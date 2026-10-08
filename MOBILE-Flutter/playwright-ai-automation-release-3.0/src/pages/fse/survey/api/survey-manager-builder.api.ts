import { Page, Response } from "@playwright/test";

// ── Internal helpers ──────────────────────────────────────────────────────────

type WaitOptions = { timeout?: number };

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

// ── Public API object ─────────────────────────────────────────────────────────

export const SurveyManagerBuilderApi = {
  /**
   * Builds the URL path for the survey form builder.
   * URL family: `/ms/formbuilder/survey-manager/{surveyId}/builder/{formId}`
   *
   * @param surveyId - The survey identifier (e.g. `a6a15906c083e1`)
   * @param formId   - The form/builder identifier (e.g. `a6a159133c2c7d938786935`)
   */
  builderPath(surveyId: string, formId: string): string {
    return `/ms/formbuilder/survey-manager/${surveyId}/builder/${formId}`;
  },

  /**
   * API endpoints consumed by the Survey Builder page.
   * All paths are relative to the application origin.
   */
  endpoints: {
    /**
     * POST — loads the complete form definition (questions, sections, options,
     * validation rules) for the builder canvas.
     */
    getFormDetails: "/formsapi/getdetails",

    /**
     * POST — loads a form definition by its internal database ID.
     * Fired on builder page initialisation alongside `getdetails`.
     */
    getFormDetailById: "/formsapi/getFormDetailById",

    /**
     * GET  — retrieves the list of standard response-format templates
     * available for new question creation.
     */
    getStandardFormTemplates: "/formsapi/GetStandardFormTemplates",

    /**
     * POST — retrieves smart-tag metadata used when attaching tags to
     * questions (e.g. pillar / dimension mapping).
     */
    getSmartTagDetails: "/formsapi/GetSmartTagDetails",

    /**
     * POST — retrieves pre-built questions from the question bank
     * for import into the survey form.
     */
    getQuestionBankDetails: "/survey/getQuestionBankDetails",

    /**
     * GET  — retrieves survey feature flags / module settings that control
     * visibility of builder features (pillar tagging, logic, etc.).
     */
    getSurveySettings: "/survey/getSurveySettings",
  } as const,

  // ── URL helpers ────────────────────────────────────────────────────────────

  /** Builds the full Survey Builder page URL for a given base URL. */
  getBuilderUrl(baseUrl: string, surveyId: string, formId: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.builderPath(surveyId, formId)}`;
  },

  /** Returns true when the current response URL matches the builder page path. */
  isBuilderPageResponse(response: Response, surveyId: string, formId: string): boolean {
    return hasPathname(response, this.builderPath(surveyId, formId));
  },

  // ── API wait helpers ───────────────────────────────────────────────────────

  /**
   * Waits for the form details response.
   * This is the primary builder-load API — fired once on page navigation.
   */
  async waitForFormDetails(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForPost(page, this.endpoints.getFormDetails, options.timeout);
  },

  /**
   * Waits for the form-by-ID response.
   * Fired alongside `getdetails` on initial page load.
   */
  async waitForFormDetailById(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForPost(page, this.endpoints.getFormDetailById, options.timeout);
  },

  /**
   * Waits for the standard form templates list.
   * Populates the response-format template dropdown when adding a new question.
   */
  async waitForStandardFormTemplates(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForGet(
      page,
      this.endpoints.getStandardFormTemplates,
      options.timeout
    );
  },

  /**
   * Waits for the smart-tag details response.
   * Fired when the pillar / dimension tagging panel is opened.
   */
  async waitForSmartTagDetails(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForPost(page, this.endpoints.getSmartTagDetails, options.timeout);
  },

  /**
   * Waits for the question-bank details response.
   * Fired when the question-bank import panel is opened.
   */
  async waitForQuestionBankDetails(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForPost(
      page,
      this.endpoints.getQuestionBankDetails,
      options.timeout
    );
  },

  /**
   * Waits for the survey settings response.
   * Fired on page load to determine which builder features are enabled.
   */
  async waitForSurveySettings(
    page: Page,
    options: WaitOptions = {}
  ): Promise<Response> {
    return waitForGet(page, this.endpoints.getSurveySettings, options.timeout);
  },
};
