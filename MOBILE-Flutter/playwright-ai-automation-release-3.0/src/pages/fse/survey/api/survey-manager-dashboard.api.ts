import { Page, Response } from "@playwright/test";

// ── Response shape types ─────────────────────────────────────────────────────

export interface SurveyDashboardStat {
  label: string;
  value: number | string;
  stats: string;
  tool_tip_data?: string[];
}

export interface SurveyDashboardSurvey {
  id: string;
  name: string;
  /** 1 = active, 3 = draft */
  status: number;
  step_level?: string | null;
  is_pinned: boolean;
  can_edit_survey: boolean;
  can_access_analyser: boolean;
  completion_rate: number;
  invitees: number;
  form_name?: string;
}

export interface SurveyDashboardSurveyListResponse {
  data: SurveyDashboardSurvey[];
  total_counts: number;
  status: number;
  message: string;
}

export interface SurveyDashboardStatsResponse {
  data: SurveyDashboardStat[];
  status: string;
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

export const SurveyManagerDashboardApi = {
  /** URL path for the Survey Manager dashboard page. */
  dashboardPath: "/ms/formbuilder/survey-manager/dashboard",

  /**
   * API endpoints consumed by this page.
   * All are relative to the application origin.
   */
  endpoints: {
    /** POST — allowed actions for the logged-in user; gates Create Survey availability. */
    allowedActions: "/survey/AllowedActions",
    /** POST — all-data call that initialises the dashboard state. */
    getAllData: "/survey/getAllData",
    /** POST — email template list used in the Create Survey drawer. */
    getEmailTemplates: "/survey/getEmailTemplates",
    /** POST — template variable definitions for email composition. */
    getTemplateVariables: "/survey/getTemplateVariables",
    /** GET  — survey feature settings (enables/disables tabs and sections). */
    getSurveySettings: "/survey/getSurveySettings",
    /** POST — paginated survey list; payload distinguishes pinned vs recent. */
    getAllSurvey: "/survey/getAllSurvey",
    /** POST — aggregate stats shown in the stats section (note: capital G). */
    getSurveyDashboardData: "/survey/GetSurveyDashboardData",
    /** GET  — standard form templates for the Create Survey type picker. */
    getStandardFormTemplates: "/formsapi/GetStandardFormTemplates",
  } as const,

  // ── URL helpers ────────────────────────────────────────────────────────────

  getDashboardUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.dashboardPath}`;
  },

  isPageResponse(response: Response | null): boolean {
    return response !== null && hasPathname(response, this.dashboardPath);
  },

  // ── API wait helpers ───────────────────────────────────────────────────────

  async waitForAllowedActions(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.allowedActions, options.timeout);
  },

  async waitForAllData(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllData, options.timeout);
  },

  async waitForEmailTemplates(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getEmailTemplates, options.timeout);
  },

  async waitForTemplateVariables(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getTemplateVariables, options.timeout);
  },

  async waitForSurveySettings(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForGet(page, this.endpoints.getSurveySettings, options.timeout);
  },

  async waitForDashboardStats(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getSurveyDashboardData, options.timeout);
  },

  /**
   * Waits for the survey list response where `send_only_pinned === true`.
   * Fired when the user switches to the Pinned tab.
   */
  async waitForPinnedSurveyList(page: Page, options: WaitOptions = {}): Promise<Response> {
    return page.waitForResponse(async (response) => {
      if (response.request().method() !== "POST" || !hasPathname(response, this.endpoints.getAllSurvey)) {
        return false;
      }
      try {
        const payload = response.request().postDataJSON() as { send_only_pinned?: boolean };
        return payload.send_only_pinned === true;
      } catch {
        return false;
      }
    }, { timeout: options.timeout ?? 30_000 });
  },

  /**
   * Waits for the survey list response where `send_only_pinned === false`.
   * Fired on initial load and when switching to the Recent tab.
   */
  async waitForRecentSurveyList(page: Page, options: WaitOptions = {}): Promise<Response> {
    return page.waitForResponse(async (response) => {
      if (response.request().method() !== "POST" || !hasPathname(response, this.endpoints.getAllSurvey)) {
        return false;
      }
      try {
        const payload = response.request().postDataJSON() as { send_only_pinned?: boolean };
        return payload.send_only_pinned === false;
      } catch {
        return false;
      }
    }, { timeout: options.timeout ?? 30_000 });
  },

  // ── Response parsers ───────────────────────────────────────────────────────

  async parseSurveyList(response: Response): Promise<SurveyDashboardSurveyListResponse> {
    return response.json() as Promise<SurveyDashboardSurveyListResponse>;
  },

  async parseDashboardStats(response: Response): Promise<SurveyDashboardStatsResponse> {
    return response.json() as Promise<SurveyDashboardStatsResponse>;
  },

  // ── Domain helpers ─────────────────────────────────────────────────────────

  isSuccessStatus(status: number | string | undefined): boolean {
    return status === 1 || status === "success";
  },

  isDraftSurvey(survey: SurveyDashboardSurvey): boolean {
    return survey.status === 3;
  },

  isActiveSurvey(survey: SurveyDashboardSurvey): boolean {
    return survey.status === 1;
  },

  /**
   * Returns which primary action button the UI shows for a survey.
   * Draft → "Resume", any other status → "Analyse".
   */
  getPrimaryActionLabel(survey: SurveyDashboardSurvey): "Resume" | "Analyse" {
    return this.isDraftSurvey(survey) ? "Resume" : "Analyse";
  },

  /**
   * Canonical request body used when fetching the survey list for the dashboard widget.
   */
  getSurveyListRequestBody(sendOnlyPinned: boolean): Record<string, boolean | number | string> {
    return {
      survey_dashboard: true,
      send_only_pinned: sendOnlyPinned,
      length: 7,
      send_all_details: 1,
    };
  },
};
