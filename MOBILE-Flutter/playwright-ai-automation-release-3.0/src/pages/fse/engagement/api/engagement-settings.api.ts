import { Page, Response } from "@playwright/test";

// ── Response shape types ─────────────────────────────────────────────────────

/** Shape of the settings returned by `POST /settings/getEngagementSettings`. */
export interface EngagementSettingsPayload {
  id?: string;
  scale?: string;
  primary_engagement_indicator?: string;
  theme?: string;
  sub_themes?: string[];
  enable_nps?: boolean | number;
  clustering_fields?: string[];
  min_size_view?: number;
  filters?: string[];
  response_volume?: number;
  survey_exclusion_list?: string[];
  [key: string]: unknown;
}

/** Top-level API response shape (status + data). */
export interface EngagementSettingsResponse {
  status?: number | boolean;
  data?: EngagementSettingsPayload;
  settings?: EngagementSettingsPayload;
  [key: string]: unknown;
}

// ── Internal helpers ─────────────────────────────────────────────────────────

type WaitOptions = { timeout?: number };

function normalizeBaseUrl(url: string): string {
  return url.endsWith("/") ? url.slice(0, -1) : url;
}

function hasPathname(response: Response, pathname: string): boolean {
  return new URL(response.url()).pathname === pathname;
}

async function waitForPost(page: Page, pathname: string, timeout = 30_000): Promise<Response> {
  return page.waitForResponse(
    (r) => r.request().method() === "POST" && hasPathname(r, pathname),
    { timeout }
  );
}

async function waitForGet(page: Page, pathname: string, timeout = 30_000): Promise<Response> {
  return page.waitForResponse(
    (r) => r.request().method() === "GET" && hasPathname(r, pathname),
    { timeout }
  );
}

// ── Public API object ─────────────────────────────────────────────────────────

export const EngagementSettingsApi = {
  /**
   * URL path for the Engagement Settings page.
   */
  pagePath: "/settings/engagement/settings" as const,

  /**
   * API endpoints consumed by (or triggered from) the page.
   */
  endpoints: {
    /** GET  — the page itself (server-rendered HTML). */
    pageHtml: "/settings/engagement/settings",
    /** POST — loads the current engagement settings JSON for the tenant. */
    getEngagementSettings: "/settings/getEngagementSettings",
    /** POST — logs user activity on this settings page. */
    logActivity: "/settings/activity",
    /** POST — saves updated engagement settings (form submission). */
    saveEngagementSettings: "/settings/engagement/settings",
  } as const,

  // ── URL helpers ────────────────────────────────────────────────────────────

  /** Returns the full URL for the Engagement Settings page. */
  getPageUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}/settings/engagement/settings`;
  },

  /** Returns `true` when `response` is the page-load GET for this URL. */
  isPageLoadResponse(response: Response): boolean {
    return (
      response.request().method() === "GET" &&
      hasPathname(response, this.pagePath)
    );
  },

  /** Returns `true` when `response` is the `getEngagementSettings` payload. */
  isSettingsResponse(response: Response): boolean {
    return (
      response.request().method() === "POST" &&
      hasPathname(response, this.endpoints.getEngagementSettings)
    );
  },

  // ── API wait helpers ───────────────────────────────────────────────────────

  /**
   * Waits for the `getEngagementSettings` POST response that delivers the
   * current settings JSON to the page on load.
   */
  async waitForGetEngagementSettings(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForPost(
      page,
      this.endpoints.getEngagementSettings,
      options.timeout
    );
  },

  /**
   * Waits for the settings save POST response.
   * The form action is `POST /settings/engagement/settings`.
   */
  async waitForSaveEngagementSettings(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForPost(
      page,
      this.endpoints.saveEngagementSettings,
      options.timeout
    );
  },

  /**
   * Waits for the page HTML GET response (initial page load).
   */
  async waitForPageLoad(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForGet(page, this.endpoints.pageHtml, options.timeout);
  },

  // ── Response parsers ───────────────────────────────────────────────────────

  /**
   * Parses the body of a `getEngagementSettings` response.
   */
  async parseEngagementSettings(
    response: Response
  ): Promise<EngagementSettingsResponse> {
    return response.json() as Promise<EngagementSettingsResponse>;
  },
};
