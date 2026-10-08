import { Page, Response } from "@playwright/test";

type WaitOptions = {
  timeout?: number;
};

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function hasPathname(response: Response, pathname: string): boolean {
  return new URL(response.url()).pathname === pathname;
}

async function waitForPost(
  page: Page,
  pathname: string,
  timeout = 30_000
): Promise<Response> {
  return page.waitForResponse(
    (r) => r.request().method() === "POST" && hasPathname(r, pathname),
    { timeout }
  );
}

async function waitForGet(
  page: Page,
  pathname: string,
  timeout = 30_000
): Promise<Response> {
  return page.waitForResponse(
    (r) => r.request().method() === "GET" && hasPathname(r, pathname),
    { timeout }
  );
}

export const SurveyManagerDetailsApi = {
  /**
   * URL path for the survey details page.
   * URL family: `/ms/formbuilder/survey-manager/{surveyId}/details`
   */
  detailsPath(surveyId: string): string {
    return `/ms/formbuilder/survey-manager/${surveyId}/details`;
  },

  /**
   * API endpoints consumed by the Survey Details page.
   * All paths are relative to the application origin.
   */
  endpoints: {
    /**
     * POST — loads the form/survey definition.
     * Payload includes `survey_id`; response carries all survey metadata
     * including the `show_on_dashboard` field that drives
     * "Visible on Engagement Dashboard".
     */
    getSurveyDetails: "/formsapi/getdetails",

    /**
     * POST — returns the list of channels configured for this survey.
     * Populates the channels table in the details page.
     */
    getChannels: "/survey/getAllChannelsAsPerSurvey",

    /**
     * GET — survey feature flags / module settings.
     * Determines which sections and actions are visible on the details page.
     */
    getSurveySettings: "/survey/getSurveySettings",

    /**
     * POST — DBox table configuration for the channels DataTable.
     * Fired when the channels table initialises (Amplify config for DBoxTable).
     */
    getTableAmplifyConfig: "/DBoxTableView/getAmplifyConfig",

    /**
     * POST — email templates for the reminder drawer.
     * Fired when the reminder (Invites) drawer is opened.
     */
    getEmailTemplates: "/survey/getEmailTemplates",

    /**
     * POST — template variables used in reminder email composition.
     * Fired alongside `getEmailTemplates`.
     */
    getTemplateVariables: "/survey/getTemplateVariables",

    /**
     * POST — loads all survey data for the current context.
     * Fired on page load; populates the summary section fields including
     * `show_on_dashboard` which drives "Visible on Engagement Dashboard".
     */
    getAllData: "/survey/getAllData",

    /**
     * POST — returns the full survey list for the current account.
     * Fired on navigation to the details page as part of the survey index load.
     */
    getAllSurveys: "/survey/getAllSurvey",

    /**
     * POST — resolves which header actions (Activate, Analyse, etc.) are
     * available for the current survey and persona.
     */
    getAllowedActions: "/survey/AllowedActions",
  } as const,

  // ── URL helpers ────────────────────────────────────────────────────────────

  /** Builds the full details page URL for a given base URL and survey ID. */
  getDetailsUrl(baseUrl: string, surveyId: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.detailsPath(surveyId)}`;
  },

  // ── API wait helpers ───────────────────────────────────────────────────────

  /**
   * Waits for the survey details response.
   * Matches on the POST method AND the `survey_id` in the request payload to
   * avoid collisions when multiple surveys share the same endpoint concurrently.
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
          const payload = response.request().postDataJSON() as {
            survey_id?: string;
          };
          return payload.survey_id === surveyId;
        } catch {
          return false;
        }
      },
      { timeout: options.timeout ?? 30_000 }
    );
  },

  /**
   * Waits for the channels list response.
   * Fired on page load and after adding / removing a channel.
   */
  async waitForChannels(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForPost(
      page,
      this.endpoints.getChannels,
      options.timeout
    );
  },

  /**
   * Waits for the survey settings response.
   * Fired on initial page navigation.
   */
  async waitForSurveySettings(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForGet(
      page,
      this.endpoints.getSurveySettings,
      options.timeout
    );
  },

  /**
   * Waits for the channels table Amplify config response.
   * Fired when the DBox channels table initialises on page load.
   */
  async waitForTableAmplifyConfig(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForPost(
      page,
      this.endpoints.getTableAmplifyConfig,
      options.timeout
    );
  },

  /**
   * Waits for the email templates response.
   * Fired when the reminder (Invites) drawer opens.
   */
  async waitForEmailTemplates(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForPost(
      page,
      this.endpoints.getEmailTemplates,
      options.timeout
    );
  },

  /**
   * Waits for the template variables response.
   * Fired alongside `getEmailTemplates` when the reminder drawer opens.
   */
  async waitForTemplateVariables(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForPost(
      page,
      this.endpoints.getTemplateVariables,
      options.timeout
    );
  },

  /**
   * Waits for the all-data response.
   * Fired on page load; the payload includes `show_on_dashboard` which drives
   * the "Visible on Engagement Dashboard" field.
   */
  async waitForGetAllData(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllData, options.timeout);
  },

  /**
   * Waits for the all-surveys response.
   * Fired during initial navigation to the details page.
   */
  async waitForGetAllSurveys(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllSurveys, options.timeout);
  },

  /**
   * Waits for the allowed-actions response.
   * Use this to confirm the header action buttons have resolved before asserting
   * their presence (e.g. Activate/Deactivate, Analyse).
   */
  async waitForAllowedActions(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllowedActions, options.timeout);
  },
};
