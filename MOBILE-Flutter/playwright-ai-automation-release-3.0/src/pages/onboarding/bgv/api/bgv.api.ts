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

function hasPendingReviewsTableId(response: Response): boolean {
  const url = new URL(response.url());
  return (
    url.pathname === "/DBoxTableView/index" &&
    url.searchParams.get("table_id") === "onboarding_bgv_pending_reviews"
  );
}

async function waitForRequest(
  page: Page,
  predicate: (response: Response) => boolean,
  timeout = 30_000
): Promise<Response> {
  return page.waitForResponse(predicate, { timeout });
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

// https://ta6.qa.darwinbox.io/onboarding/onboarding/bgvemployees
//
// Live API inventory from headed Chromium exploration:
// - GET  /onboarding/onboarding/bgvemployees
//     Server-rendered landing page for the BGV employee review workspace.
// - GET  /DBoxTableView/index?table_id=onboarding_bgv_pending_reviews...
//     Table bootstrap request observed for the pending-reviews data grid.
// - POST /onboarding/onboarding/bgvEmployeesPagination
//     Data pagination endpoint observed after the grid initializes.
// - POST /TranslationApi/getTranslations
//     Shared translations bootstrap for the page shell.
// - POST /commondata/getemployeedetails
// - GET  /Commondata/getCSRF
//     Shared shell calls observed on the route family; both returned 401 in the
//     headed exploration session and are retained for synchronization only.

export const BgvApi = {
  pagePath: "/onboarding/onboarding/bgvemployees" as const,

  endpoints: {
    pageHtml: "/onboarding/onboarding/bgvemployees",
    completedReviews: "/onboarding/onboarding/bgvemployeescompleted",
    completedReviewsPagination: "/onboarding/onboarding/bgvEmployeesCompletedPagination",
    logout: "/onboarding/onboarding/bgvlogout",
    pendingReviewsTable: "/DBoxTableView/index",
    pendingReviewsPagination: "/onboarding/onboarding/bgvEmployeesPagination",
    translations: "/TranslationApi/getTranslations",
    employeeDetails: "/commondata/getemployeedetails",
    csrf: "/Commondata/getCSRF",
  } as const,

  getPageUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.pagePath}`;
  },

  getCompletedReviewsUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.endpoints.completedReviews}`;
  },

  isPageLoadResponse(response: Response): boolean {
    return (
      response.request().method() === "GET" &&
      hasPathname(response, this.endpoints.pageHtml)
    );
  },

  isPendingReviewsTableResponse(response: Response): boolean {
    return (
      response.request().method() === "GET" && hasPendingReviewsTableId(response)
    );
  },

  isPendingReviewsPaginationResponse(response: Response): boolean {
    return (
      response.request().method() === "POST" &&
      hasPathname(response, this.endpoints.pendingReviewsPagination)
    );
  },

  isTranslationsResponse(response: Response): boolean {
    return (
      response.request().method() === "POST" &&
      hasPathname(response, this.endpoints.translations)
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
    return waitForRequest(page, (response) => this.isPageLoadResponse(response), options.timeout);
  },

  async waitForPendingReviewsTable(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForRequest(
      page,
      (response) => this.isPendingReviewsTableResponse(response),
      options.timeout
    );
  },

  async waitForPendingReviewsPagination(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForRequest(
      page,
      (response) => this.isPendingReviewsPaginationResponse(response),
      options.timeout
    );
  },

  async waitForTranslations(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForRequest(
      page,
      (response) => this.isTranslationsResponse(response),
      options.timeout
    );
  },

  async waitForCompletedReviews(
    page: Page,
    options: WaitOptions = {}
  ): Promise<void> {
    return waitForPath(page, this.endpoints.completedReviews, options.timeout);
  },

  async waitForCurrentPage(
    page: Page,
    options: WaitOptions = {}
  ): Promise<void> {
    return waitForPath(page, this.pagePath, options.timeout);
  },

  async waitForEmployeeDetails(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForRequest(
      page,
      (response) => this.isEmployeeDetailsResponse(response),
      options.timeout
    );
  },

  async waitForCsrf(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForRequest(page, (response) => this.isCsrfResponse(response), options.timeout);
  },
};
