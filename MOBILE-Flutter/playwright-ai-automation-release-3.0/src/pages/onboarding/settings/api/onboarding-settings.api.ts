import { Page, Response } from "@playwright/test";

type WaitOptions = { timeout?: number };

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function hasPathname(response: Response, pathname: string): boolean {
  return new URL(response.url()).pathname === pathname;
}

async function waitForMethod(
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

// https://ta6.qa.darwinbox.io/onboarding/onboardingsettings/onboarding/onboardingsettings
//
// Live API inventory from headed Chromium exploration:
// - GET  /onboarding/onboardingsettings/onboarding/onboardingsettings
//     Server-rendered HTML for the advanced settings page.
// - POST /onboarding/onboardingsettings/onboarding/onboardingsettings
//     Form submit endpoint used by the SAVE action.
// - GET  /Commondata/getCSRF
//     Generic CSRF bootstrap request observed during page load.
// - POST /settings/activity
//     Generic activity logging request observed during page load.
// - GET  /Commondata/menu
// - GET  /Commondata/BellNotifications
//     Shared shell requests rendered alongside the page.
// - Export/import actions are plain navigation endpoints; no page-specific XHR
//   payloads were detected for this route family.

export const OnboardingSettingsApi = {
  pagePath: "/onboarding/onboardingsettings" as const,

  endpoints: {
    pageHtml: "/onboarding/onboardingsettings",
    saveAdvancedSettings: "/onboarding/onboardingsettings",
    exportAdvancedSettings: "/import/exportData/type/onboarding_advanced_settings",
    importAdvancedSettings: "/importCenter/index",
    csrf: "/Commondata/getCSRF",
    activityLog: "/settings/activity",
    menu: "/Commondata/menu",
    bellNotifications: "/Commondata/BellNotifications",
  } as const,

  getPageUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.endpoints.pageHtml}`;
  },

  getExportUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.endpoints.exportAdvancedSettings}`;
  },

  getImportUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.endpoints.importAdvancedSettings}?import_type=onboarding_advanced_settings`;
  },

  isPageLoadResponse(response: Response): boolean {
    return (
      response.request().method() === "GET" &&
      hasPathname(response, this.endpoints.pageHtml)
    );
  },

  isSaveResponse(response: Response): boolean {
    return (
      response.request().method() === "POST" &&
      hasPathname(response, this.endpoints.saveAdvancedSettings)
    );
  },

  async waitForPageLoad(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForMethod(page, "GET", this.endpoints.pageHtml, options.timeout);
  },

  async waitForSave(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForMethod(
      page,
      "POST",
      this.endpoints.saveAdvancedSettings,
      options.timeout
    );
  },

  async waitForCsrf(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForMethod(page, "GET", this.endpoints.csrf, options.timeout);
  },

  async waitForActivityLog(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForMethod(page, "POST", this.endpoints.activityLog, options.timeout);
  },
} as const;
