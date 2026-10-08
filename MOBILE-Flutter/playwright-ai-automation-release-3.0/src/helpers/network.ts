import { Page, Request } from "@playwright/test";

const API_RESOURCE_TYPES = new Set(["xhr", "fetch"]);

/**
 * Extracts cookies from the page context and returns them as a semicolon-separated string.
 * Useful for making authenticated API requests outside the browser context.
 */
export async function getCookieString(page: Page): Promise<string> {
  const cookies = await page.context().cookies();
  return cookies.map(({ name, value }) => `${name}=${value}`).join('; ');
}

function isApiRequest(request: Request): boolean {
  return API_RESOURCE_TYPES.has(request.resourceType());
}

export type WaitForNetworkApisOptions = {
  /** Max time to wait for APIs to settle (ms). Default 60_000 */
  timeout?: number;
  /** Quiet period with no in-flight API calls (ms). Default 500 */
  idleTime?: number;
};

/**
 * Waits until all in-flight XHR/fetch requests have completed and the network
 * has been idle for `idleTime` ms. Use after login or navigation before interacting.
 */
export async function waitForNetworkApis(
  page: Page,
  options: WaitForNetworkApisOptions = {}
): Promise<void> {
  const timeout = options.timeout ?? 60_000;
  const idleTime = options.idleTime ?? 500;

  await page.waitForLoadState("domcontentloaded");

  let inFlight = 0;

  await new Promise<void>((resolve, reject) => {
    let idleTimer: ReturnType<typeof setTimeout> | undefined;

    const cleanup = () => {
      if (idleTimer) clearTimeout(idleTimer);
      page.off("request", onRequest);
      page.off("requestfinished", onComplete);
      page.off("requestfailed", onComplete);
    };

    const deadline = setTimeout(() => {
      cleanup();
      reject(
        new Error(
          `Network APIs did not settle within ${timeout}ms (${inFlight} request(s) still in flight)`
        )
      );
    }, timeout);

    const scheduleIdle = () => {
      if (inFlight > 0) return;
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        clearTimeout(deadline);
        cleanup();
        resolve();
      }, idleTime);
    };

    const onRequest = (request: Request) => {
      if (!isApiRequest(request)) return;
      inFlight++;
      if (idleTimer) clearTimeout(idleTimer);
    };

    const onComplete = (request: Request) => {
      if (!isApiRequest(request)) return;
      inFlight = Math.max(0, inFlight - 1);
      scheduleIdle();
    };

    page.on("request", onRequest);
    page.on("requestfinished", onComplete);
    page.on("requestfailed", onComplete);

    scheduleIdle();
  });

  try {
    await page.waitForLoadState("networkidle", { timeout: 10_000 });
  } catch {
    // SPAs may keep long-polling connections open
  }
}
