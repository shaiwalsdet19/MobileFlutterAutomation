import { Page, Response } from "@playwright/test";

// ── Response shape types ─────────────────────────────────────────────────────

/** Status values returned on survey rows from `/survey/getAllSurvey`. */
export type SurveyStatus = "draft" | "active" | "closed" | "scheduled";

/** Single survey record in the getAllSurvey response. */
export interface AllSurveyRecord {
  id: string;
  /** Survey display title */
  surveyProcessTitle: string;
  /** 1 = active, 3 = draft */
  status: number;
  /** Survey type identifier */
  type?: string;
  anonymity?: number;
  numberOfEvents?: number;
  numberOfChannels?: number;
  numberOfResponses?: number;
  activatedOn?: string | null;
}

/** Top-level shape of the `/survey/getAllSurvey` POST response. */
export interface AllSurveyListResponse {
  data: AllSurveyRecord[];
  recordsTotal: number;
  recordsFiltered: number;
}

/** Shape of the `/survey/getSurveyManagerCounts` POST response. */
export interface SurveyManagerCountsResponse {
  status: number;
  standalone_counts: number;
  /** Note: typo in the API — "businees" not "business" */
  businees_process_counts: number;
}

// ── Internal helpers ─────────────────────────────────────────────────────────

type WaitOptions = { timeout?: number };

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
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

export const SurveyManagerAllSurveysApi = {
  /** URL path for the All Surveys page. */
  pagePath: "/ms/formbuilder/survey-manager/all-surveys",

  /**
   * API endpoints consumed by this page and the Create Survey drawer.
   * All paths are relative to the application origin.
   */
  endpoints: {
    /** POST — paginated survey list (used for table data and tab counts). */
    getAllSurvey: "/survey/getAllSurvey",
    /** POST — tab badge counts (All / Business Process Linked / Ad-Hoc). */
    getSurveyManagerCounts: "/survey/getSurveyManagerCounts",
    /** POST — allowed actions for the logged-in user; gates Create Survey. */
    getAllowedActions: "/survey/AllowedActions",
    /** GET  — survey feature settings (enables/disables tabs and sections). */
    getSurveySettings: "/survey/getSurveySettings",
    /** POST — survey dashboard data (also fired on the All Surveys page load). */
    getAllData: "/survey/getAllData",
    /** POST — email templates used when configuring a new survey. */
    getEmailTemplates: "/survey/getEmailTemplates",
    /** POST — template variables for email composition. */
    getTemplateVariables: "/survey/getTemplateVariables",
    /** GET  — standard form templates listed in the Create Survey response-format dropdown. */
    getStandardFormTemplates: "/formsapi/GetStandardFormTemplates",
    /** POST — survey form details (fired after a template is selected). */
    getFormDetails: "/formsapi/getdetails",
  } as const,

  // ── URL helpers ────────────────────────────────────────────────────────────

  /** Builds the full All Surveys page URL for a given base URL. */
  getPageUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.pagePath}`;
  },

  /** Returns true when the response corresponds to the All Surveys page load. */
  isPageResponse(response: Response | null): boolean {
    return response !== null && hasPathname(response, this.pagePath);
  },

  // ── API wait helpers – page load ───────────────────────────────────────────

  /**
   * Waits for the survey list to be fetched.
   * Triggered on navigation, tab switch, search, or page change.
   */
  async waitForSurveyList(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllSurvey, options.timeout);
  },

  /**
   * Waits for the tab count badge data to load.
   * Fired once on initial page load.
   */
  async waitForSurveyCounts(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getSurveyManagerCounts, options.timeout);
  },

  /**
   * Waits for the allowed-actions metadata response.
   * Required before the Create Survey button becomes fully operational.
   */
  async waitForAllowedActions(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllowedActions, options.timeout);
  },

  async waitForSurveySettings(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForGet(page, this.endpoints.getSurveySettings, options.timeout);
  },

  // ── API wait helpers – Create Survey drawer ────────────────────────────────

  /**
   * Waits for the email templates call.
   * Fired when the Create Survey drawer initialises.
   */
  async waitForEmailTemplates(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getEmailTemplates, options.timeout);
  },

  /**
   * Waits for template variable definitions.
   * Fired alongside the email templates call.
   */
  async waitForTemplateVariables(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getTemplateVariables, options.timeout);
  },

  /**
   * Waits for the standard form templates list.
   * Populates the Response Format dropdown in the Create Survey drawer.
   */
  async waitForStandardFormTemplates(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForGet(page, this.endpoints.getStandardFormTemplates, options.timeout);
  },

  /**
   * Waits for the form detail response.
   * Fired after a survey type card is selected in the Create Survey drawer.
   */
  async waitForFormDetails(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getFormDetails, options.timeout);
  },

  // ── Response parsers ───────────────────────────────────────────────────────

  /**
   * Parses the `/survey/getAllSurvey` response body.
   */
  async parseSurveyList(response: Response): Promise<AllSurveyListResponse> {
    return response.json() as Promise<AllSurveyListResponse>;
  },

  /**
   * Parses the `/survey/getSurveyManagerCounts` response body.
   * Note: the API spells the field name "businees_process_counts" (typo in backend).
   */
  async parseSurveyCounts(response: Response): Promise<SurveyManagerCountsResponse> {
    return response.json() as Promise<SurveyManagerCountsResponse>;
  },

  // ── Domain helpers ─────────────────────────────────────────────────────────

  /** Returns true when the survey list status code and shape indicate success. */
  isSuccessStatus(status: number | string | undefined): boolean {
    return status === 1 || status === "success" || status === 200;
  },
};
