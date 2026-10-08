import {
  CookieAuthenticatedFlowInput,
  JsonRecord,
  formRequest,
  jsonRequest,
  withRequestContext,
} from "../common/cookie-auth.api";
import { FormCreateUpdatePayload, createSurveyForm } from "./forms.api";
import type { OrderedQuestionResponse, OrderedQuestionResponses } from "../../pages/common/form.page";

export interface SurveyApiResponse<T = JsonRecord> {
  status?: number | string;
  message?: string;
  error?: unknown;
  errors?: unknown;
  data?: T;
  [key: string]: unknown;
}

export interface SurveyListItem extends JsonRecord {
  id?: string;
  survey_id?: string;
  name?: string;
  status?: number | string;
  form_id?: string;
}

export interface SurveyListResponse extends SurveyApiResponse<SurveyListItem[]> {
  all_surveys?: SurveyListItem[];
  data?: SurveyListItem[];
  total_counts?: number;
}

export interface NamesByAttributesResponse extends SurveyApiResponse {
  users?: Array<{
    id?: string;
    value?: string;
    category?: string;
  }>;
  error_users?: string[];
  assignments?: Array<{
    id?: string;
    code?: string;
    value?: string;
  }>;
}

export interface SurveyProcessPayload extends JsonRecord {
  name: string;
  survey_process_type: string;
  survey_type: string | number;
  form_id: string;
  form_type: string;
  survey_sub_type?: string | number;
  proposed_closure?: {
    date_time?: string | number;
    timezone?: string;
  };
  proposed_start_time?: {
    date_time?: string | number;
  };
  filters?: unknown[];
  [key: string]: unknown;
}

export interface CreateSurveyWithFormResult {
  form: SurveyApiResponse;
  survey: SurveyApiResponse;
}

export interface SurveySubmitQuestionPayload extends JsonRecord {
  answer: unknown;
  comment: unknown | null;
  type: string;
  defaultValue: unknown | null;
  hidden: boolean;
}

export interface SurveySubmitSmartTagsPayload extends JsonRecord {
  answer: unknown[];
  hidden: boolean;
  type: "smart_tags";
}

export interface SurveyFormSubmissionPayload extends JsonRecord {
  allSmartTags: SurveySubmitSmartTagsPayload;
  [questionId: string]: SurveySubmitQuestionPayload | SurveySubmitSmartTagsPayload;
}

export interface SubmitSurveyPayload extends JsonRecord {
  channel_id: string;
  survey_id: string;
  form_id: string;
  status: number;
  external_response_form?: JsonRecord;
  form_submission: SurveyFormSubmissionPayload;
  send_all_details?: number;
  user_id?: string;
}

const EngagementApiEndpoints = {
  surveyManagerPage: "/ms/formbuilder/survey-manager/dashboard",
  engagementSettingsPage: "/settings/engagement/settings",
  surveyAllowedActions: "/survey/AllowedActions",
  surveyAllData: "/survey/getAllData",
  surveyDashboardData: "/survey/GetSurveyDashboardData",
  surveyList: "/survey/getAllSurvey",
  surveyCreateOrUpdate: "/survey/createSurveyProcess",
  surveyUpdateStatus: "/survey/updateSurveyProcessStatus",
  surveyRequiredDetails: "/survey/getTabWiseRequiredDetails",
  surveyDetails: "/surveysubmit/getSurveyDetails",
  surveyInitInfo: "/surveysubmit/getSurveyInitInfo",
  surveyFormDetailById: "/surveysubmit/getFormDetailById",
  surveySubmit: "/Surveysubmit/submitSurvey",
  surveyNamesByAttributes: "/survey/getNamesByAttributes",
  engagementSettings: "/settings/getEngagementSettings",
  engagementIndicatorOptions: "/settings/loadDropdownBasedOnSelection",
} as const;

function getSurveysFromResponse(response: SurveyListResponse): SurveyListItem[] {
  if (Array.isArray(response.all_surveys)) {
    return response.all_surveys;
  }

  if (Array.isArray(response.data)) {
    return response.data;
  }

  return [];
}

function buildSurveySubmitQuestionPayload(response: OrderedQuestionResponse): SurveySubmitQuestionPayload {
  return {
    answer: response.answer,
    comment: null,
    type: response.type,
    defaultValue: null,
    hidden: false,
  };
}

/**
 * Converts ordered form responses into the `form_submission` object expected by the
 * survey submit controller.
 */
export function buildSurveyFormSubmissionPayload(
  responses: OrderedQuestionResponses
): SurveyFormSubmissionPayload {
  const formSubmission: SurveyFormSubmissionPayload = {
    allSmartTags: {
      answer: [],
      hidden: true,
      type: "smart_tags",
    },
  };

  for (const response of responses) {
    formSubmission[response.questionId] = buildSurveySubmitQuestionPayload(response);
  }

  return formSubmission;
}

/**
 * Loads the survey-manager bootstrap payload so callers can reuse tenant-specific
 * form types, moments, survey types, and related metadata while building survey requests.
 */
export async function getSurveyManagerBootstrapData(
  input: CookieAuthenticatedFlowInput,
  body: JsonRecord = {}
): Promise<SurveyApiResponse> {
  return jsonRequest<SurveyApiResponse>(input, EngagementApiEndpoints.surveyAllData, { body });
}

/**
 * Fetches the permission metadata consumed by the Survey & Engagement dashboard,
 * including the engagement-dashboard access gates evaluated for the current cookie session.
 */
export async function getAllowedEngagementActions(
  input: CookieAuthenticatedFlowInput,
  body: JsonRecord = { engagment_action: true }
): Promise<SurveyApiResponse> {
  return jsonRequest<SurveyApiResponse>(input, EngagementApiEndpoints.surveyAllowedActions, { body });
}

/**
 * Returns the engagement dashboard widget payload so callers can confirm the dashboard
 * is reachable and inspect the summary metrics shown to the current user.
 */
export async function getEngagementDashboardData(
  input: CookieAuthenticatedFlowInput,
  body: JsonRecord = {}
): Promise<SurveyApiResponse> {
  return jsonRequest<SurveyApiResponse>(input, EngagementApiEndpoints.surveyDashboardData, { body });
}

/**
 * Loads the Additional Engage Settings payload used by the settings page. This is
 * helpful when setup code needs sub-theme, scale, or filter metadata before saving data.
 */
export async function getEngagementSettings(
  input: CookieAuthenticatedFlowInput
): Promise<SurveyApiResponse> {
  return jsonRequest<SurveyApiResponse>(input, EngagementApiEndpoints.engagementSettings, { body: {} });
}

/**
 * Replays the scale-change settings request so callers can discover which primary
 * engagement indicators are valid for the selected scale before saving settings.
 */
export async function loadPrimaryIndicatorsForScale(
  input: CookieAuthenticatedFlowInput,
  scale: string
): Promise<SurveyApiResponse> {
  return formRequest<SurveyApiResponse>(input, EngagementApiEndpoints.engagementIndicatorOptions, {
    "TenantEngagementSettings[scale]": scale,
  });
}

/**
 * Retrieves tab-wise lookup data such as sub-themes, themes, scales, or other survey
 * dropdown values needed to satisfy engagement survey setup preconditions.
 */
export async function getTabWiseRequiredDetails(
  input: CookieAuthenticatedFlowInput,
  requiredFields: string[] = ["sub_themes"]
): Promise<SurveyApiResponse> {
  return jsonRequest<SurveyApiResponse>(input, EngagementApiEndpoints.surveyRequiredDetails, {
    body: { required_fields: requiredFields },
  });
}

/**
 * Lists surveys from the survey manager using the same backend API that powers dashboard
 * search, filtering, and active-survey validation in the product UI.
 */
export async function listSurveys(
  input: CookieAuthenticatedFlowInput,
  body: JsonRecord = { page_number: 1, length: 100, send_all_details: 1 }
): Promise<SurveyListResponse> {
  return jsonRequest<SurveyListResponse>(input, EngagementApiEndpoints.surveyList, { body });
}

/**
 * Returns only active surveys so callers can validate prerequisites like
 * "at least two active surveys exist" without rebuilding common status filters.
 */
export async function listActiveSurveys(
  input: CookieAuthenticatedFlowInput,
  body: JsonRecord = {}
): Promise<SurveyListItem[]> {
  const response = await listSurveys(input, {
    page_number: 1,
    length: 100,
    send_all_details: 1,
    status: 1,
    ...body,
  });

  return getSurveysFromResponse(response);
}

/**
 * Searches surveys by name using the same list endpoint used by the UI, which makes
 * it suitable for validating that survey names are unique enough for search or typeahead.
 */
export async function searchSurveyByName(
  input: CookieAuthenticatedFlowInput,
  surveyName: string,
  body: JsonRecord = {}
): Promise<SurveyListItem[]> {
  const response = await listSurveys(input, {
    page_number: 1,
    length: 25,
    send_all_details: 1,
    search: { text: surveyName },
    ...body,
  });

  return getSurveysFromResponse(response);
}

/**
 * Pulls analyser-side survey details for a specific survey. Use this when later logic
 * needs the survey payload after creation or needs to inspect response-related metadata.
 */
export async function getSurveyDetails(
  input: CookieAuthenticatedFlowInput,
  surveyId: string,
  userId?: string
): Promise<SurveyApiResponse> {
  const body: JsonRecord = { survey_id: surveyId };
  if (userId) {
    body.user_id = userId;
  }

  return jsonRequest<SurveyApiResponse>(input, EngagementApiEndpoints.surveyDetails, { body });
}

/**
 * Retrieves survey-init metadata for a given survey or channel. This is useful when
 * downstream code needs the respondent-facing initialization payload before submissions.
 */
export async function getSurveyInitInfo(
  input: CookieAuthenticatedFlowInput,
  body: JsonRecord
): Promise<SurveyApiResponse> {
  return jsonRequest<SurveyApiResponse>(input, EngagementApiEndpoints.surveyInitInfo, { body });
}

/**
 * Resolves survey-side attribute ids such as assignment codes into richer objects that include
 * the backend assignment id expected by internal survey channel logic.
 */
export async function getNamesByAttributes(
  input: CookieAuthenticatedFlowInput,
  body: JsonRecord = {}
): Promise<NamesByAttributesResponse> {
  return jsonRequest<NamesByAttributesResponse>(input, EngagementApiEndpoints.surveyNamesByAttributes, { body });
}

/**
 * Loads the survey-renderer form payload by form id through the submit controller,
 * which is useful when a survey API consumer needs the runtime form definition.
 */
export async function getSurveyRuntimeFormDetail(
  input: CookieAuthenticatedFlowInput,
  formId: string,
  extraBody: JsonRecord = {}
): Promise<SurveyApiResponse> {
  return jsonRequest<SurveyApiResponse>(input, EngagementApiEndpoints.surveyFormDetailById, {
    body: {
      form_id: formId,
      ...extraBody,
    },
  });
}

/**
 * Sends a respondent-side survey submission through the same cookie-authenticated
 * request layer used by the rest of the survey API helpers.
 */
export async function submitSurvey(
  input: CookieAuthenticatedFlowInput,
  payload: SubmitSurveyPayload
): Promise<SurveyApiResponse> {
  return jsonRequest<SurveyApiResponse>(input, EngagementApiEndpoints.surveySubmit, {
    body: payload,
  });
}

/**
 * Creates a survey process after the caller has prepared the linked form id and any
 * schedule, filter, confidentiality, or engagement-specific fields required by the tenant.
 */
export async function createSurvey(
  input: CookieAuthenticatedFlowInput,
  payload: SurveyProcessPayload
): Promise<SurveyApiResponse> {
  return jsonRequest<SurveyApiResponse>(input, EngagementApiEndpoints.surveyCreateOrUpdate, {
    body: payload,
  });
}

/**
 * Updates an existing survey by passing its id back to the same survey-process API
 * that handles both create and edit flows on the Survey Manager side.
 */
export async function updateSurvey(
  input: CookieAuthenticatedFlowInput,
  surveyId: string,
  payload: SurveyProcessPayload
): Promise<SurveyApiResponse> {
  return createSurvey(input, {
    ...payload,
    id: surveyId,
  });
}

/**
 * Changes the survey lifecycle status, which is commonly needed right after creation
 * when code wants to move a draft survey into active or scheduled state.
 */
export async function updateSurveyStatus(
  input: CookieAuthenticatedFlowInput,
  surveyId: string,
  status: number,
  extraBody: JsonRecord = {}
): Promise<SurveyApiResponse> {
  return jsonRequest<SurveyApiResponse>(input, EngagementApiEndpoints.surveyUpdateStatus, {
    body: {
      survey_id: surveyId,
      status,
      ...extraBody,
    },
  });
}

/**
 * Convenience wrapper for the common post-create step of activating a survey while
 * still allowing callers to pass schedule fields understood by the activation endpoint.
 */
export async function activateSurvey(
  input: CookieAuthenticatedFlowInput,
  surveyId: string,
  extraBody: JsonRecord = {}
): Promise<SurveyApiResponse> {
  return updateSurveyStatus(input, surveyId, 1, extraBody);
}

/**
 * Creates a survey form first and then creates the survey against that new form id.
 * This is useful for callers that want a single API-level helper for the standard
 * create-form-then-create-survey sequence used during engagement survey setup.
 */
export async function createSurveyWithForm(
  input: CookieAuthenticatedFlowInput,
  formPayload: FormCreateUpdatePayload,
  surveyPayload: Omit<SurveyProcessPayload, "form_id">
): Promise<CreateSurveyWithFormResult> {
  const formResponse = await createSurveyForm(input, formPayload);
  const formId = String(formResponse.form_id ?? "");

  if (!formId) {
    throw new Error("Form creation did not return a form_id, so the survey could not be created.");
  }

  const surveyResponse = await createSurvey(input, {
    ...surveyPayload,
    form_id: formId,
  } as SurveyProcessPayload);

  return {
    form: formResponse,
    survey: surveyResponse,
  };
}

/**
 * Lightweight page-access probe for the Survey & Engagement dashboard route. This is
 * useful when setup code wants an explicit accessibility check before starting UI flows.
 */
export async function getSurveyManagerDashboardPage(
  input: CookieAuthenticatedFlowInput
): Promise<string> {
  return withRequestContext(input, async (context) => {
    const response = await context.get(EngagementApiEndpoints.surveyManagerPage);
    return response.text();
  });
}

/**
 * Lightweight page-access probe for the Additional Engage Settings route so callers
 * can verify the page is reachable with the provided cookie before starting UI automation.
 */
export async function getEngagementSettingsPage(
  input: CookieAuthenticatedFlowInput
): Promise<string> {
  return withRequestContext(input, async (context) => {
    const response = await context.get(EngagementApiEndpoints.engagementSettingsPage);
    return response.text();
  });
}
