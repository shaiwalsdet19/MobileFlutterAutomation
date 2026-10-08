import { Page, Response } from "@playwright/test";

// ── Response shape types ─────────────────────────────────────────────────────

/** Shape of the `/survey/getAllSurvey` POST response (used for header survey name). */
export interface SurveyDetailRecord {
  id: string;
  surveyProcessTitle: string;
  status: number;
  type?: string;
}

/** Shape of the `/formsapi/getallforms` POST response. */
export interface AllFormsResponse {
  data: FormRecord[];
  recordsTotal: number;
  recordsFiltered: number;
}

/** Single form record returned by `/formsapi/getallforms`. */
export interface FormRecord {
  id: string;
  form_name: string;
  status: number;
  question_count?: number;
  updated_on?: string;
}

/** Shape of the `/formsapi/formCreateUpdate` POST response (Start From Scratch). */
export interface FormCreateResponse {
  form_id?: string;
  id?: string;
  status?: number | string;
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

export const SurveyManagerFormSelectionApi = {
  /**
   * URL path pattern for the Form Selection page.
   * The `{surveyId}` segment varies per survey.
   * Full path: `/ms/formbuilder/survey-manager/{surveyId}/form-selection`
   */
  pagePathPattern: "/ms/formbuilder/survey-manager/:surveyId/form-selection",

  /**
   * URL path pattern for the Form Builder page (destination after "Start From Scratch").
   * Full path: `/ms/formbuilder/survey-manager/{surveyId}/builder/{formId}`
   */
  builderPathPattern: "/ms/formbuilder/survey-manager/:surveyId/builder/:formId",

  /**
   * API endpoints consumed by the Form Selection page.
   * All paths are relative to the application origin.
   */
  endpoints: {
    /** POST — allowed actions for the current user; gates interactive options. */
    getAllowedActions: "/survey/AllowedActions",
    /** GET  — survey feature settings (enables/disables page sections). */
    getSurveySettings: "/survey/getSurveySettings",
    /** POST — email templates (pre-fetched with page data). */
    getEmailTemplates: "/survey/getEmailTemplates",
    /** POST — template variables for email composition. */
    getTemplateVariables: "/survey/getTemplateVariables",
    /** GET  — standard / recommended form templates shown in the grid. */
    getStandardFormTemplates: "/formsapi/GetStandardFormTemplates",
    /** POST — all data for the parent survey (provides survey name for header). */
    getAllData: "/survey/getAllData",
    /** POST — full survey detail (used for header name and status). */
    getAllSurvey: "/survey/getAllSurvey",
    /** POST — channels associated with the parent survey. */
    getAllChannelsAsPerSurvey: "/survey/getAllChannelsAsPerSurvey",
    /** POST — existing form list (populates the Existing Forms section). */
    getAllForms: "/formsapi/getallforms",
    /** POST — form details (fired on form/template selection). */
    getFormDetails: "/formsapi/getdetails",
    /** POST — creates a new blank form (fired by "Start From Scratch"). */
    createForm: "/formsapi/formCreateUpdate",
    /** POST — smart tag metadata for the form builder (fired after form creation). */
    getSmartTagDetails: "/formsapi/GetSmartTagDetails",
    /** POST — full form detail by ID (fired after form creation). */
    getFormDetailById: "/formsapi/getFormDetailById",
    /** POST — question bank data (fired when the form builder loads). */
    getQuestionBankDetails: "/survey/getQuestionBankDetails",
  } as const,

  // ── URL helpers ────────────────────────────────────────────────────────────

  /** Builds the full Form Selection page URL for a given origin and survey ID. */
  getPageUrl(baseUrl: string, surveyId: string): string {
    return `${normalizeBaseUrl(baseUrl)}/ms/formbuilder/survey-manager/${surveyId}/form-selection`;
  },

  /** Returns true when the response URL corresponds to the Form Selection page. */
  isPageResponse(response: Response, surveyId: string): boolean {
    const expected = `/ms/formbuilder/survey-manager/${surveyId}/form-selection`;
    return hasPathname(response, expected);
  },

  /** Returns true when the URL is the builder page for the given survey. */
  isBuilderResponse(response: Response, surveyId: string): boolean {
    const u = new URL(response.url());
    return u.pathname.startsWith(`/ms/formbuilder/survey-manager/${surveyId}/builder/`);
  },

  // ── API wait helpers – page load ───────────────────────────────────────────

  /**
   * Waits for the existing-forms list to load.
   * Populates the Existing Forms section on the page.
   */
  async waitForAllForms(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllForms, options.timeout);
  },

  /**
   * Waits for the standard form templates (Recommended Templates section).
   */
  async waitForStandardFormTemplates(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForGet(page, this.endpoints.getStandardFormTemplates, options.timeout);
  },

  /**
   * Waits for the survey settings GET call.
   * Controls which sections are visible on the page.
   */
  async waitForSurveySettings(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForGet(page, this.endpoints.getSurveySettings, options.timeout);
  },

  /**
   * Waits for the allowed-actions metadata.
   * Required before interactive create options are fully operational.
   */
  async waitForAllowedActions(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllowedActions, options.timeout);
  },

  /**
   * Waits for the parent survey's full data (provides survey name for the header).
   */
  async waitForAllData(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getAllData, options.timeout);
  },

  /**
   * Waits for the form details response.
   * Fired when a template or existing form card is selected.
   */
  async waitForFormDetails(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getFormDetails, options.timeout);
  },

  // ── API wait helpers – Start From Scratch ─────────────────────────────────

  /**
   * Waits for the blank form creation API call.
   * Fired immediately after the user clicks "Start From Scratch".
   * The response body contains the new `form_id` used to build the builder URL.
   */
  async waitForFormCreate(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.createForm, options.timeout);
  },

  /**
   * Waits for the smart-tag metadata call triggered by the form builder load.
   */
  async waitForSmartTagDetails(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getSmartTagDetails, options.timeout);
  },

  /**
   * Waits for the form-detail-by-ID call in the builder.
   */
  async waitForFormDetailById(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getFormDetailById, options.timeout);
  },

  // ── Response parsers ───────────────────────────────────────────────────────

  /**
   * Parses the `/formsapi/getallforms` response.
   */
  async parseAllForms(response: Response): Promise<AllFormsResponse> {
    return response.json() as Promise<AllFormsResponse>;
  },

  /**
   * Parses the `/formsapi/formCreateUpdate` response to extract the new form ID.
   */
  async parseFormCreate(response: Response): Promise<FormCreateResponse> {
    return response.json() as Promise<FormCreateResponse>;
  },
};
