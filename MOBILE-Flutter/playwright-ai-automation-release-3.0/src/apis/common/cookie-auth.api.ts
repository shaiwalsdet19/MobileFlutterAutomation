import { APIRequestContext, APIResponse, request } from "@playwright/test";
import type { Credentials } from "../../../data/instances";

export type JsonRecord = Record<string, unknown>;
export type HttpMethod = "GET" | "POST";

export interface CookieAuthenticatedFlowInput {
  baseUrl: string;
  cookie: string;
  pbqBeYWPUn?: string;
}

interface CsrfTokenResponse {
  status?: number | string;
  data?: string;
}

/**
 * Normalizes tenant base URLs so downstream API helpers can safely append endpoint
 * paths without introducing accidental double slashes in the final request URL.
 */
export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function buildCookieHeaderFromStorageStateCookies(
  cookies: Array<{ name: string; value: string }>
): string {
  return cookies.map(({ name, value }) => `${name}=${value}`).join("; ");
}

function extractHiddenInputValue(html: string, fieldName: string): string {
  const escapedFieldName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = html.match(new RegExp(`name="${escapedFieldName}" value="([^"]+)"`));
  return match?.[1]?.trim() ?? "";
}

async function fetchCsrfTokenFromContext(context: APIRequestContext): Promise<string> {
  const response = await context.get("/Commondata/getCSRF", {
    headers: {
      Accept: "*/*",
      "X-Requested-With": "XMLHttpRequest",
    },
  });
  const payload = await parseJsonResponse<CsrfTokenResponse>(response, "GET /Commondata/getCSRF");
  const csrfToken = payload.data?.trim();

  if (!csrfToken) {
    throw new Error("GET /Commondata/getCSRF did not return a csrf token in `data`.");
  }

  return csrfToken;
}

export async function getCsrfToken(
  input: CookieAuthenticatedFlowInput,
  context?: APIRequestContext
): Promise<string> {
  if (input.pbqBeYWPUn?.trim()) {
    return input.pbqBeYWPUn.trim();
  }

  if (context) {
    return fetchCsrfTokenFromContext(context);
  }

  return withRequestContext(input, async (requestContext) => fetchCsrfTokenFromContext(requestContext));
}

/**
 * Resolves the flow auth input into a reusable shape with the cookie plus a single
 * CSRF token. If the caller already passed `pbqBeYWPUn`, the same object is reused.
 */
export async function resolveCookieAuthenticatedFlowInput(
  input: CookieAuthenticatedFlowInput
): Promise<CookieAuthenticatedFlowInput> {
  if (input.pbqBeYWPUn?.trim()) {
    return {
      ...input,
      pbqBeYWPUn: input.pbqBeYWPUn.trim(),
    };
  }

  return {
    ...input,
    pbqBeYWPUn: await getCsrfToken(input),
  };
}

async function withCsrfTokenInBody(
  input: CookieAuthenticatedFlowInput,
  context: APIRequestContext,
  body: JsonRecord = {}
): Promise<JsonRecord> {
  if (body.pbqBeYWPUn) {
    return body;
  }

  const csrfToken = await getCsrfToken(input, context);
  return {
    ...body,
    pbqBeYWPUn: csrfToken,
  };
}

async function withCsrfTokenInForm(
  input: CookieAuthenticatedFlowInput,
  context: APIRequestContext,
  form: Record<string, string | number | boolean>
): Promise<Record<string, string | number | boolean>> {
  if (form.pbqBeYWPUn) {
    return form;
  }

  const csrfToken = await getCsrfToken(input, context);
  return {
    ...form,
    pbqBeYWPUn: csrfToken,
  };
}

/**
 * Creates a short-lived Playwright request context that authenticates every request
 * with the caller-provided cookie. Scoping the context to a single callback keeps the
 * API layer stateless and prevents one helper call from leaking session state into another.
 */
export async function withRequestContext<T>(
  input: CookieAuthenticatedFlowInput,
  callback: (context: APIRequestContext) => Promise<T>
): Promise<T> {
  const context = await request.newContext({
    baseURL: normalizeBaseUrl(input.baseUrl),
    extraHTTPHeaders: {
      Accept: "application/json, text/plain, */*",
      Cookie: input.cookie,
    },
    ignoreHTTPSErrors: true,
  });

  try {
    return await callback(context);
  } finally {
    await context.dispose();
  }
}

/**
 * Parses an API response as JSON and throws a readable error when the backend returns
 * HTML or plain text instead. This is especially helpful for debugging auth failures,
 * access-denied pages, or unexpected server responses in cookie-based API calls.
 */
export async function parseJsonResponse<T>(
  response: APIResponse,
  requestLabel: string
): Promise<T> {
  const rawResponse = await response.text();

  try {
    return JSON.parse(rawResponse) as T;
  } catch {
    throw new Error(
      `${requestLabel} did not return JSON. HTTP ${response.status()} response: ${rawResponse.slice(0, 500)}`
    );
  }
}

/**
 * Sends a JSON-style API request using the shared cookie-authenticated context. Use
 * this helper for Yii endpoints that accept JSON-style POST payloads such as the survey
 * manager APIs and most of the form builder controller actions.
 */
export async function jsonRequest<T>(
  input: CookieAuthenticatedFlowInput,
  path: string,
  options: {
    method?: HttpMethod;
    body?: JsonRecord;
  } = {}
): Promise<T> {
  return withRequestContext(input, async (context) => {
    const method = options.method ?? "POST";
    const bodyWithCsrf =
      method === "GET" ? options.body ?? {} : await withCsrfTokenInBody(input, context, options.body ?? {});
    const response =
      method === "GET"
        ? await context.get(path)
        : await context.post(path, {
            data: bodyWithCsrf,
          });

    return parseJsonResponse<T>(response, `${method} ${path}`);
  });
}

/**
 * Sends a form-encoded POST request for legacy PHP endpoints that expect classic form
 * field names like `TenantEngagementSettings[scale]` instead of a JSON request body.
 */
export async function formRequest<T>(
  input: CookieAuthenticatedFlowInput,
  path: string,
  form: Record<string, string | number | boolean>
): Promise<T> {
  return withRequestContext(input, async (context) => {
    const response = await context.post(path, { form: await withCsrfTokenInForm(input, context, form) });
    return parseJsonResponse<T>(response, `POST ${path}`);
  });
}
