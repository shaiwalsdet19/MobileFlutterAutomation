import { Page, Response } from "@playwright/test";

// ── Internal helpers ──────────────────────────────────────────────────────────

type WaitOptions = {
  timeout?: number;
};

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

export const SurveyManagerConfigurationApi = {
  // ── URL helpers ────────────────────────────────────────────────────────────

  /** Returns the URL path for a given survey's configuration page. */
  configurationPath(surveyId: string): string {
    return `/ms/formbuilder/survey-manager/${surveyId}/configuration`;
  },

  /**
   * API endpoints consumed by the configuration page.
   * All paths are relative to the application origin.
   */
  endpoints: {
    /** POST — survey form details; payload contains `survey_id` for filtering. */
    getSurveyDetails: "/formsapi/getdetails",
    /** GET  — survey feature settings that gate toggles and sections. */
    getSurveySettings: "/survey/getSurveySettings",
    /** POST — allowed actions for the logged-in user. */
    getAllowedActions: "/survey/AllowedActions",
  } as const,

  /** Builds the full configuration page URL for a given base URL and survey ID. */
  getConfigurationUrl(baseUrl: string, surveyId: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.configurationPath(surveyId)}`;
  },

  // ── API wait helpers ───────────────────────────────────────────────────────

  /**
   * Waits for the survey details response that matches the given survey ID.
   * The same endpoint (`/formsapi/getdetails`) is used across multiple pages;
   * filtering on `postDataJSON().survey_id` ensures we capture the right call.
   */
  async waitForSurveyDetails(
    page: Page,
    surveyId: string,
    options: WaitOptions = {}
  ): Promise<Response> {
    return page.waitForResponse(
      async (response) => {
        if (
          response.request().method() !== "POST" ||
          !hasPathname(response, this.endpoints.getSurveyDetails)
        ) {
          return false;
        }
        try {
          const payload = response.request().postDataJSON() as { survey_id?: string };
          return payload.survey_id === surveyId;
        } catch {
          return false;
        }
      },
      { timeout: options.timeout ?? 30_000 }
    );
  },

  /**
   * Waits for the survey feature-settings GET response.
   * Fired once on page load; gates which toggles and sections are visible.
   */
  async waitForSurveySettings(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForGet(page, this.endpoints.getSurveySettings, options.timeout);
  },

  /**
   * Waits for the allowed-actions POST response.
   * Determines which header actions (e.g. activate, more-options items) are available.
   */
  async waitForAllowedActions(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllowedActions, options.timeout);
  },
};
