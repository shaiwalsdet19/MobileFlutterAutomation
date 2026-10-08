import { Page, Response } from "@playwright/test";

type WaitOptions = {
  timeout?: number;
};

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function hasPathname(response: Response, pathname: string): boolean {
  return new URL(response.url()).pathname === pathname;
}

async function waitForRequest(
  page: Page,
  method: "GET" | "POST",
  pathname: string,
  timeout = 30_000
): Promise<Response> {
  return page.waitForResponse(
    (response) =>
      response.request().method() === method && hasPathname(response, pathname),
    { timeout }
  );
}

async function waitForPath(
  page: Page,
  pathname: string,
  timeout = 30_000
): Promise<void> {
  await page.waitForURL((url) => new URL(url.toString()).pathname === pathname, {
    timeout,
  });
}

// https://ta6.qa.darwinbox.io/onboarding/onboarding/bgv
//
// Live API inventory from headed Chromium exploration:
// - GET  /onboarding/onboarding/bgv
//     Server-rendered BGV sign-in page for this onboarding route family.
// - POST /onboarding/onboarding/bgv
//     Form action declared on the BGV sign-in form for credential and OTP submission.
// - GET  /onboarding/onboarding/bgvemployees
//     Downstream authenticated landing route observed after the BGV sign-in flow completed.
// - POST /commondata/getemployeedetails
// - GET  /Commondata/getCSRF
//     Shared shell calls observed around the route family; both returned 401 during the
//     public login shell because no tenant session existed yet.

export const BgvLoginApi = {
  pagePath: "/onboarding/onboarding/bgv" as const,

  endpoints: {
    pageHtml: "/onboarding/onboarding/bgv",
    credentialSubmit: "/onboarding/onboarding/bgv",
    authenticatedLanding: "/onboarding/onboarding/bgvemployees",
    employeeDetails: "/commondata/getemployeedetails",
    csrf: "/Commondata/getCSRF",
  } as const,

  getPageUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.pagePath}`;
  },

  getAuthenticatedLandingUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.endpoints.authenticatedLanding}`;
  },

  isPageLoadResponse(response: Response): boolean {
    return (
      response.request().method() === "GET" &&
      hasPathname(response, this.endpoints.pageHtml)
    );
  },

  isCredentialSubmitResponse(response: Response): boolean {
    return (
      response.request().method() === "POST" &&
      hasPathname(response, this.endpoints.credentialSubmit)
    );
  },

  isEmployeeDetailsResponse(response: Response): boolean {
    return (
      response.request().method() === "POST" &&
      hasPathname(response, this.endpoints.employeeDetails)
    );
  },

  isCsrfResponse(response: Response): boolean {
    return (
      response.request().method() === "GET" &&
      hasPathname(response, this.endpoints.csrf)
    );
  },

  async waitForPageLoad(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForRequest(page, "GET", this.endpoints.pageHtml, options.timeout);
  },

  async waitForCredentialSubmit(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForRequest(
      page,
      "POST",
      this.endpoints.credentialSubmit,
      options.timeout
    );
  },

  async waitForAuthenticatedLanding(
    page: Page,
    options: WaitOptions = {}
  ): Promise<void> {
    return waitForPath(page, this.endpoints.authenticatedLanding, options.timeout);
  },

  async waitForEmployeeDetails(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForRequest(page, "POST", this.endpoints.employeeDetails, options.timeout);
  },

  async waitForCsrf(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForRequest(page, "GET", this.endpoints.csrf, options.timeout);
  },
};
