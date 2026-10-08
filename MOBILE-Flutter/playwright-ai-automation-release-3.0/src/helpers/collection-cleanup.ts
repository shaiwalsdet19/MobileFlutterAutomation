import { Page } from "@playwright/test";

const CSRF_TOKEN_KEY = "pbqBeYWPUn";

type CleanupCollectionsOptions = {
  baseUrl: string;
  collections: string[];
  testsStartedAt: number | string;
};

type CleanupCollectionsResponseData = {
  total_deleted_count?: number;
  rejected_collections?: string[];
  [key: string]: unknown;
};

export type CleanupCollectionsResponse = {
  status?: string;
  code?: string;
  message?: string;
  data?: CleanupCollectionsResponseData;
};

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

export async function resolveCsrfToken(page: Page): Promise<string> {
  const tokenFromSessionStorage = await page.evaluate((tokenKey) => {
    try {
      return window.sessionStorage.getItem(tokenKey);
    } catch {
      return null;
    }
  }, CSRF_TOKEN_KEY);

  if (tokenFromSessionStorage) {
    return tokenFromSessionStorage;
  }

  throw new Error(`Unable to resolve CSRF token "${CSRF_TOKEN_KEY}" for collection cleanup`);
}

export async function cleanupCollectionsAfterTimestamp(
  page: Page,
  options: CleanupCollectionsOptions
): Promise<CleanupCollectionsResponse> {
  const csrfToken = await resolveCsrfToken(page);
  const response = await page.context().request.post(
    `${normalizeBaseUrl(options.baseUrl)}/collectionCleanupApi/deleteAfterTimestamp`,
    {
      headers: {
        accept: "application/json",
        "content-type": "application/json",
        "csrf-token": csrfToken,
        "x-requested-with": "XMLHttpRequest",
      },
      data: {
        collections: options.collections,
        timestamp: options.testsStartedAt,
        [CSRF_TOKEN_KEY]: csrfToken,
      },
    }
  );

  let responseBody: CleanupCollectionsResponse;
  try {
    responseBody = (await response.json()) as CleanupCollectionsResponse;
  } catch {
    throw new Error(`Collection cleanup failed with HTTP ${response.status()} and a non-JSON response`);
  }

  if (!response.ok()) {
    throw new Error(`Collection cleanup failed with HTTP ${response.status()}: ${JSON.stringify(responseBody)}`);
  }

  return responseBody;
}
