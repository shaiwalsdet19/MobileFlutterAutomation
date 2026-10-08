import { Page, Response } from "@playwright/test";

// ── Response shape types ─────────────────────────────────────────────────────

/** Survey status values returned by `/survey/getAllSurvey`. */
export type SurveyStatus = "draft" | "active" | "closed" | "scheduled";

/** Survey detail record from `/survey/getAllSurvey`. */
export interface SurveyDetailRecord {
  id: string;
  surveyProcessTitle?: string;
  status?: number;
  survey_type?: string;
  created_by?: string;
  created_on?: string;
  form_name?: string;
}

/** Channel record from `/survey/getAllChannelsAsPerSurvey`. */
export interface ChannelRecord {
  id: string;
  channel_name?: string;
  channel_title?: string;
  respondent_type?: string;
  status?: number | string;
  number_of_responses?: number;
  updated_on?: string;
  created_by?: string;
}

/** Top-level shape of the channels response. */
export interface AllChannelsResponse {
  data?: ChannelRecord[];
  channels?: ChannelRecord[];
  status?: number;
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

export const SurveyManagerSummaryApi = {
  /**
   * URL path pattern for the Summary page.
   * Full path: `/ms/formbuilder/survey-manager/{surveyId}/summary`
   */
  pagePathPattern: "/ms/formbuilder/survey-manager/:surveyId/summary",

  /**
   * API endpoints consumed by the Summary page.
   * All paths are relative to the application origin.
   */
  endpoints: {
    /** POST — allowed actions for the current user (gates Activate button). */
    getAllowedActions: "/survey/AllowedActions",
    /** GET  — survey feature settings. */
    getSurveySettings: "/survey/getSurveySettings",
    /** POST — email templates (pre-fetched; used by Invites panel). */
    getEmailTemplates: "/survey/getEmailTemplates",
    /** POST — template variables for email composition. */
    getTemplateVariables: "/survey/getTemplateVariables",
    /** GET  — standard form templates (pre-fetched for consistent state). */
    getStandardFormTemplates: "/formsapi/GetStandardFormTemplates",
    /** POST — full survey data (provides details shown in the Summary card). */
    getAllData: "/survey/getAllData",
    /** POST — full survey detail with configuration. */
    getAllSurvey: "/survey/getAllSurvey",
    /** POST — form/question details for the survey. */
    getFormDetails: "/formsapi/getdetails",
    /** POST — all channels for the survey (populates channels table). */
    getAllChannels: "/survey/getAllChannelsAsPerSurvey",
    /** POST — table column / display config (fired by the dbox-table component). */
    getTableConfig: "/DBoxTableView/getAmplifyConfig",
  } as const,

  // ── URL helpers ────────────────────────────────────────────────────────────

  /** Builds the full Summary page URL for a given origin and survey ID. */
  getPageUrl(baseUrl: string, surveyId: string): string {
    return `${normalizeBaseUrl(baseUrl)}/ms/formbuilder/survey-manager/${surveyId}/summary`;
  },

  /** Returns true when the response URL matches this page's path. */
  isPageResponse(response: Response, surveyId: string): boolean {
    return hasPathname(
      response,
      `/ms/formbuilder/survey-manager/${surveyId}/summary`
    );
  },

  // ── API wait helpers – page load ───────────────────────────────────────────

  /**
   * Waits for the full survey data POST call.
   * Provides the survey detail values shown in the Summary Details card.
   */
  async waitForAllData(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllData, options.timeout);
  },

  /**
   * Waits for the full survey detail response.
   */
  async waitForAllSurvey(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllSurvey, options.timeout);
  },

  /**
   * Waits for the channels list to load (populates the channels table).
   */
  async waitForAllChannels(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllChannels, options.timeout);
  },

  /**
   * Waits for the allowed-actions response.
   * Determines whether the Activate / Deactivate button is interactive.
   */
  async waitForAllowedActions(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllowedActions, options.timeout);
  },

  /**
   * Waits for the survey settings GET call.
   */
  async waitForSurveySettings(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForGet(page, this.endpoints.getSurveySettings, options.timeout);
  },

  /**
   * Waits for the email templates call.
   * Pre-fetched on page load; consumed by the Invites/Reminder panel.
   */
  async waitForEmailTemplates(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getEmailTemplates, options.timeout);
  },

  // ── Response parsers ───────────────────────────────────────────────────────

  /**
   * Parses the `/survey/getAllChannelsAsPerSurvey` response.
   */
  async parseAllChannels(response: Response): Promise<AllChannelsResponse> {
    return response.json() as Promise<AllChannelsResponse>;
  },
};
