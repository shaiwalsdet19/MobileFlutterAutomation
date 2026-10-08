import { Page, Response } from "@playwright/test";

// ── Response shape types ─────────────────────────────────────────────────────

/** Status values a channel can have. */
export type ChannelStatus = "active" | "draft" | "closed";

/** Single channel record returned by `/survey/getAllChannelsAsPerSurvey`. */
export interface ChannelRecord {
  id: string;
  channel_name?: string;
  channel_title?: string;
  status?: number | string;
  respondent_type?: string;
}

/** Top-level shape of `/survey/getAllChannelsAsPerSurvey` POST response. */
export interface AllChannelsResponse {
  data?: ChannelRecord[];
  channels?: ChannelRecord[];
  status?: number;
}

/** Shape of the `/survey/createChannel` or `/survey/updateChannel` POST response. */
export interface ChannelSaveResponse {
  status?: number | string;
  channel_id?: string;
  id?: string;
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

export const SurveyManagerChannelsApi = {
  /**
   * URL path pattern for the Channels (Add Channel) page.
   * Full path: `/ms/formbuilder/survey-manager/{surveyId}/channels`
   */
  pagePathPattern: "/ms/formbuilder/survey-manager/:surveyId/channels",

  /**
   * API endpoints consumed by the Channels page.
   * All paths are relative to the application origin.
   */
  endpoints: {
    /** POST — allowed actions for the current user. */
    getAllowedActions: "/survey/AllowedActions",
    /** GET  — survey feature settings (controls page sections). */
    getSurveySettings: "/survey/getSurveySettings",
    /** POST — email templates used in the Invites configuration panel. */
    getEmailTemplates: "/survey/getEmailTemplates",
    /** POST — template variables for email composition. */
    getTemplateVariables: "/survey/getTemplateVariables",
    /** GET  — standard form templates (pre-fetched for consistent state). */
    getStandardFormTemplates: "/formsapi/GetStandardFormTemplates",
    /** POST — full data for the parent survey (provides survey name for header). */
    getAllData: "/survey/getAllData",
    /** POST — form/question details for the survey. */
    getFormDetails: "/formsapi/getdetails",
    /** POST — full survey detail with all configuration. */
    getAllSurvey: "/survey/getAllSurvey",
    /** POST — all existing channels for the parent survey. */
    getAllChannels: "/survey/getAllChannelsAsPerSurvey",
  } as const,

  // ── URL helpers ────────────────────────────────────────────────────────────

  /** Builds the full Channels page URL for a given origin and survey ID. */
  getPageUrl(baseUrl: string, surveyId: string): string {
    return `${normalizeBaseUrl(baseUrl)}/ms/formbuilder/survey-manager/${surveyId}/channels`;
  },

  /** Returns true when the response URL matches this page's path. */
  isPageResponse(response: Response, surveyId: string): boolean {
    return hasPathname(
      response,
      `/ms/formbuilder/survey-manager/${surveyId}/channels`
    );
  },

  // ── API wait helpers – page load ───────────────────────────────────────────

  /**
   * Waits for the existing channels list to be fetched.
   * Fired on initial page load with the parent `survey_id`.
   */
  async waitForAllChannels(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllChannels, options.timeout);
  },

  /**
   * Waits for the parent survey's full detail response.
   * Provides the survey name displayed in the header.
   */
  async waitForAllSurvey(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllSurvey, options.timeout);
  },

  /**
   * Waits for the allowed-actions response.
   * Controls which channel actions are available to the current user.
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
   * Waits for the email templates POST call.
   * Pre-fetched on page load; also used by the Invites configuration panel.
   */
  async waitForEmailTemplates(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getEmailTemplates, options.timeout);
  },

  /**
   * Waits for the template variables POST call.
   * Pre-fetched alongside email templates.
   */
  async waitForTemplateVariables(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getTemplateVariables, options.timeout);
  },

  /**
   * Waits for the survey data POST call.
   */
  async waitForAllData(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllData, options.timeout);
  },

  // ── Response parsers ───────────────────────────────────────────────────────

  /**
   * Parses the `/survey/getAllChannelsAsPerSurvey` response.
   */
  async parseAllChannels(response: Response): Promise<AllChannelsResponse> {
    return response.json() as Promise<AllChannelsResponse>;
  },
};
