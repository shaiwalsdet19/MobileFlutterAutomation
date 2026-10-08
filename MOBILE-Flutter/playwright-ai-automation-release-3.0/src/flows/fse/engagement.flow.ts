import {
  CookieAuthenticatedFlowInput,
  JsonRecord,
  normalizeBaseUrl,
  resolveCookieAuthenticatedFlowInput,
  jsonRequest,
} from "../../apis/common/cookie-auth.api";
import {
  FormCreateUpdatePayload,
  buildSurveyFormPayloadFromTextQuestions,
  createSurveyForm,
  updateSurveyForm,
} from "../../apis/fse/forms.api";
import {
  activateSurvey,
  createSurvey,
  getSurveyManagerBootstrapData,
  updateSurveyStatus,
  type SurveyApiResponse,
  type SurveyProcessPayload,
  type SubmitSurveyPayload,
} from "../../apis/fse/engagement.api";
import { runInternalCommand } from "../../apis/common/run-command.api";
import { getTenantId } from "../../../data/instances";
import type { OrderedQuestionResponses } from "../../pages/common/form.page";
import {
  UserAssignmentProcess,
  type UserAssignmentApiResponse,
  type UserAssignmentProcessId,
  type UserAssignmentRuleType,
  createUserAssignmentForFieldUsingAvailableValues,
  getUserAssignmentByCodeOrName,
} from "../../apis/settings/user-assignment.api";
export {
  activateSurvey,
  createSurvey,
  getSurveyManagerBootstrapData,
} from "../../apis/fse/engagement.api";
export type { SurveyApiResponse, SurveyProcessPayload } from "../../apis/fse/engagement.api";

export interface SurveyEmailTemplatesResponse extends SurveyApiResponse {
  templates?: Record<string, unknown>;
  allow_teams?: boolean;
}

export interface SurveyChannelPayload extends JsonRecord {
  survey_id: string;
  id?: string;
  channel_id: string;
  name: string;
  responded_type?: string | number;
  channel_responses_type?: string;
  email_template?: Record<string, unknown>;
  assignment?: unknown;
  respondent?: unknown;
  attachments?: unknown[];
  reminder_schedule?: unknown[];
  enable_auto_reminders?: boolean;
  excluded_respondent?: unknown;
  external_emails?: unknown;
  external_phone_numbers?: unknown;
  is_teams_configured?: boolean;
  rules?: unknown;
  allow_access_to_user_outside_respondent_list?: boolean;
  auth_type?: string;
  disable_mail_notification?: boolean;
  is_invite_bell_enabled?: boolean;
  is_invite_sms_enabled?: boolean;
  is_reminder_bell_enabled?: boolean;
  is_reminder_sms_enabled?: boolean;
  is_invite_whatsapp_enabled?: boolean;
  is_reminder_whatsapp_enabled?: boolean;
  send_for_all?: boolean;
}

export interface SurveyChannelResponse extends SurveyApiResponse {
  channel_details?: JsonRecord;
}

export interface CreateSurveyWithFormActivationChannelSetupAndEmailQueueInput
  extends CookieAuthenticatedFlowInput {
  /**
   * Instance folder inside `data/instances`. The helper reads `tenantId` from the
   * matching `roles.json` before kicking off `SurveySQSEmailsTask`.
   */
  instance: string;
  /**
   * Survey type to create, for example standalone/business values supported by the
   * tenant's survey bootstrap payload.
   */
  surveyType: string | number;
  /**
   * Closure target used while activating the survey. If omitted, the helper schedules
   * the survey for seven days from now.
   */
  closureDateTime?: string | number | Date;
  closureTimezone?: string;
  surveyName?: string;
  surveyIdentifier?: string;
  surveyProcessType?: string;
  surveySubType?: string | number;
  formName?: string;
  formDescription?: string;
  channelName?: string;
  /**
   * Convenience builder input for a basic text-question survey form.
   * If omitted, the helper falls back to a simple 3-question default form.
   */
  formQuestionTexts?: string[];
  /**
   * Full form payload override for cases where the caller already knows the exact
   * survey form schema they want to create.
   */
  formPayload?: FormCreateUpdatePayload;
  formType?: string;
  respondedType?: string | number;
  channelResponsesType?: string;
  assignment?: unknown;
  assignmentCreation?: {
    field?: string;
    type?: UserAssignmentRuleType;
    name?: string;
    description?: string;
    applicableProcessIds?: Array<UserAssignmentProcessId | number | string>;
  };
  respondent?: unknown;
  submitUserId?: string;
  submitPayloadOverrides?: Partial<SubmitSurveyPayload>;
  pbqBeYWPUn?: string;
  formPayloadOverrides?: Partial<FormCreateUpdatePayload>;
  formActivationPayloadOverrides?: Partial<FormCreateUpdatePayload>;
  surveyPayloadOverrides?: Partial<SurveyProcessPayload>;
  channelPayloadOverrides?: Partial<SurveyChannelPayload>;
  /**
   * Requested survey lifecycle status after the channel is configured.
   * Use `1` for active. The flow triggers `SurveySQSEmailsTask` only when the
   * resolved status is active.
   */
  status?: number;
  surveyActivationOverrides?: JsonRecord;
}

export interface CreateSurveyWithFormActivationChannelSetupAndEmailQueueResult {
  bootstrap: SurveyApiResponse;
  draftForm: SurveyApiResponse;
  activatedForm: SurveyApiResponse;
  createdAssignment?: UserAssignmentApiResponse;
  reporteeCount?: JsonRecord;
  resolvedAssignment?: {
    id?: string;
    code?: string;
    value?: string;
  };
  survey: SurveyApiResponse;
  emailTemplates: SurveyEmailTemplatesResponse;
  channel: SurveyChannelResponse;
  statusUpdatedSurvey: SurveyApiResponse;
  queuedEmails?: JsonRecord;
  submitResponses: SurveyApiResponse[];
  generatedResponses: OrderedQuestionResponses;
  formId: string;
  surveyId: string;
  channelId: string;
  channelMongoId: string;
  surveySubmissionUrl: string;
  tenantId?: string;
  usedClosureDateTime: number;
  usedClosureTimezone: string;
}

const DEFAULT_SURVEY_TEXT_QUESTIONS = [
  "How would you describe your overall experience?",
  "What worked well for you in this experience?",
  "What could we improve for you next time?",
] as const;
const DEFAULT_SURVEY_TEXT_RESPONSES = [
  "Good overall experience.",
  "The survey setup flow worked smoothly.",
  "The submission flow can be simpler.",
] as const;

function getSurveyFormQuestionTexts(
  questionTexts?: string[]
): string[] {
  if (!questionTexts?.length) {
    return [...DEFAULT_SURVEY_TEXT_QUESTIONS];
  }

  const sanitizedQuestionTexts = questionTexts
    .map((questionText) => questionText.trim())
    .filter(Boolean);

  if (!sanitizedQuestionTexts.length) {
    throw new Error("Survey form creation expects at least one non-empty text question.");
  }

  return sanitizedQuestionTexts;
}

function getSurveyFormResponseTexts(questionCount: number): string[] {
  return Array.from({ length: questionCount }, (_, index) => {
    return DEFAULT_SURVEY_TEXT_RESPONSES[index] ?? `Automated response ${index + 1}`;
  });
}

function buildGeneratedSurveyResponses(
  questionTexts: string[]
): OrderedQuestionResponses {
  if (!questionTexts.length) {
    throw new Error("Unable to generate survey responses because the form payload has no text-box questions.");
  }

  const responseTexts = getSurveyFormResponseTexts(questionTexts.length);

  return questionTexts.map((_, index) => ({
    questionId: `f${index + 1}`,
    type: "text-box",
    answer: responseTexts[index],
  }));
}

function extractEntityId(response: JsonRecord, ...candidateKeys: string[]): string {
  for (const key of candidateKeys) {
    const value = response[key];
    if (value !== undefined && value !== null && String(value).trim()) {
      return String(value);
    }
  }

  return "";
}

function getFirstChannelDetail(channelDetails?: JsonRecord): JsonRecord {
  if (!channelDetails) {
    return {};
  }

  const directChannelId = extractEntityId(channelDetails, "id", "channel_id");
  if (directChannelId) {
    return channelDetails;
  }

  const firstChannelDetail = Object.values(channelDetails).find(
    (value) => value && typeof value === "object" && !Array.isArray(value)
  );

  return (firstChannelDetail as JsonRecord | undefined) ?? {};
}

function stringifyError(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (error === undefined || error === null) {
    return "";
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function isJsonRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeChannelEmailTemplateValue(template: JsonRecord): JsonRecord {
  const normalizedTemplate = { ...template };
  const bellNotification = normalizedTemplate.bell_notification;

  if (isJsonRecord(bellNotification) && bellNotification.isEnabled === undefined) {
    normalizedTemplate.bell_notification = {
      ...bellNotification,
      isEnabled: false,
    };
  }

  return normalizedTemplate;
}

function normalizeSurveyEmailTemplatesForChannel(templates: unknown): Record<string, unknown> {
  if (!isJsonRecord(templates)) {
    return {};
  }

  const normalizedTemplates: JsonRecord = {};

  for (const [key, value] of Object.entries(templates)) {
    normalizedTemplates[key] = isJsonRecord(value)
      ? normalizeChannelEmailTemplateValue(value)
      : value;
  }

  if (!normalizedTemplates.intro && isJsonRecord(normalizedTemplates.invitation)) {
    normalizedTemplates.intro = normalizeChannelEmailTemplateValue(normalizedTemplates.invitation);
  }

  return normalizedTemplates;
}

function assertSuccessfulResponse(stepName: string, response: SurveyApiResponse | SurveyChannelResponse): void {
  if (response.status === 1 || response.status === "success") {
    return;
  }

  const detailedError =
    stringifyError(response.error) || stringifyError(response.errors) || response.message || "Unknown error";
  throw new Error(`${stepName} failed: ${detailedError}`);
}

function normalizeUnixSeconds(dateTime: string | number | Date): number {
  if (dateTime instanceof Date) {
    return Math.floor(dateTime.getTime() / 1000);
  }

  if (typeof dateTime === "number") {
    return dateTime > 1_000_000_000_000 ? Math.floor(dateTime / 1000) : Math.floor(dateTime);
  }

  const parsed = new Date(dateTime);
  if (Number.isNaN(parsed.getTime())) {
    throw new Error(`Unable to parse closureDateTime: ${dateTime}`);
  }

  return Math.floor(parsed.getTime() / 1000);
}

function getOneWeekFromNowInUnixSeconds(): number {
  return Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
}

/**
 * Activates an already created survey form in-place so callers do not have to duplicate
 * the same `status: 1` and `updates_in_same_vesion` wiring in every survey setup flow.
 */
export async function activateExistingSurveyForm(
  input: CookieAuthenticatedFlowInput,
  formId: string,
  formPayload: FormCreateUpdatePayload,
  overrides: Partial<FormCreateUpdatePayload> = {}
): Promise<SurveyApiResponse> {
  const activatedForm = await updateSurveyForm(input, formId, {
    ...formPayload,
    status: 1,
    updates_in_same_vesion: true,
    from_survey: true,
    ...overrides,
  } as FormCreateUpdatePayload);

  assertSuccessfulResponse("Activating survey form", activatedForm);
  return activatedForm;
}

/**
 * Loads the tenant's default survey email templates so channel creation can stay aligned
 * with the same invitation/reminder/closure content the Survey Manager UI would preload.
 */
export async function getSurveyEmailTemplates(
  input: CookieAuthenticatedFlowInput,
  body: JsonRecord = {}
): Promise<SurveyEmailTemplatesResponse> {
  return jsonRequest<SurveyEmailTemplatesResponse>(input, "/survey/getEmailTemplates", { body });
}

/**
 * Creates or updates a survey channel using the same backend endpoint the details page uses
 * for invite, reminder, and respondent configuration.
 */
export async function addOrUpdateSurveyChannel(
  input: CookieAuthenticatedFlowInput,
  payload: SurveyChannelPayload
): Promise<SurveyChannelResponse> {
  return jsonRequest<SurveyChannelResponse>(input, "/survey/addEditChannelDetails", {
    body: {
      ...payload,
      email_template: normalizeSurveyEmailTemplatesForChannel(payload.email_template),
    },
  });
}

/**
 * Runs the survey SQS email command using the `tenantId` configured for the provided
 * instance so higher-level flows can queue invites/reminders without hand-building
 * the internal run-command request.
 */
export async function runSurveyEmailQueueTaskForInstance(
  input: CookieAuthenticatedFlowInput & {
    instance: string;
    pbqBeYWPUn?: string;
  }
): Promise<{ queuedEmails: JsonRecord; tenantId: string }> {
  const tenantId = getTenantId(input.instance);
  const queuedEmails = (await runInternalCommand({
    ...input,
    command: "SurveySQSEmailsTask",
    arguments: [tenantId],
    pbqBeYWPUn: input.pbqBeYWPUn,
  })) as JsonRecord;

  if (queuedEmails.status !== 1 && queuedEmails.status !== "success") {
    throw new Error(
      `Queueing SurveySQSEmailsTask failed: ${
        stringifyError(queuedEmails.error) || queuedEmails.message || "Unknown error"
      }`
    );
  }

  return { queuedEmails, tenantId };
}

/**
 * Runs the `ReporteeCount` internal command using the tenant id configured for the
 * provided instance. This is useful right after user-assignment mutations so the
 * tenant's derived reportee hierarchy is refreshed before downstream flows use it.
 */
export async function runReporteeCountTaskForInstance(
  input: CookieAuthenticatedFlowInput & {
    instance: string;
    pbqBeYWPUn?: string;
  }
): Promise<{ reporteeCount: JsonRecord; tenantId: string }> {
  const tenantId = getTenantId(input.instance);
  const reporteeCount = (await runInternalCommand({
    ...input,
    command: "ReporteeCount",
    arguments: [tenantId],
    pbqBeYWPUn: input.pbqBeYWPUn,
  })) as JsonRecord;

  if (reporteeCount.status !== 1 && reporteeCount.status !== "success") {
    throw new Error(
      `Running ReporteeCount failed: ${
        stringifyError(reporteeCount.error) || reporteeCount.message || "Unknown error"
      }`
    );
  }

  return { reporteeCount, tenantId };
}

/**
 * Reusable end-to-end survey setup flow:
 * 1. Create a survey form from either a caller-supplied payload or a simple text-question builder.
 * 2. Activate that form.
 * 3. Optionally create a user assignment and refresh reportee counts for the tenant.
 * 4. Create a survey for the requested `surveyType` and tag the activated form.
 * 5. Add a channel to the survey using tenant-default survey email templates.
 * 6. Update the survey to the caller-requested `status` (defaults to `1`, active) while
 *    applying the parameterised closure date (defaults to one week from now).
 * 7. Trigger `SurveySQSEmailsTask` with the `tenantId` read from `data/instances/<instance>/roles.json`
 *    only when the resolved survey status is active.
 */
export async function createSurveyWithFormActivationChannelSetupAndEmailQueue(
  input: CreateSurveyWithFormActivationChannelSetupAndEmailQueueInput
): Promise<CreateSurveyWithFormActivationChannelSetupAndEmailQueueResult> {
  let flowInput:
    | CreateSurveyWithFormActivationChannelSetupAndEmailQueueInput
    | undefined;
  let surveyName: string | undefined;
  let surveyIdentifier: string | undefined;

  try {
    flowInput = (await resolveCookieAuthenticatedFlowInput(input)) as
      CreateSurveyWithFormActivationChannelSetupAndEmailQueueInput;
    const timestampSuffix = Date.now();
    const bootstrap = await getSurveyManagerBootstrapData(flowInput);
    assertSuccessfulResponse("Loading survey manager bootstrap data", bootstrap);
    surveyName = flowInput.surveyName ?? `Survey ${timestampSuffix}`;
    surveyIdentifier = flowInput.surveyIdentifier ?? surveyName;
    const surveyQuestionTexts = getSurveyFormQuestionTexts(flowInput.formQuestionTexts);
    const draftFormPayload = flowInput.formPayload
      ? ({
          ...flowInput.formPayload,
          ...flowInput.formPayloadOverrides,
        } as FormCreateUpdatePayload)
      : buildSurveyFormPayloadFromTextQuestions({
          formName: flowInput.formName ?? `Survey Form ${timestampSuffix}`,
          formDescription: flowInput.formDescription ?? "",
          questionTexts: surveyQuestionTexts,
          payloadOverrides: flowInput.formPayloadOverrides,
        });
    const generatedResponses = buildGeneratedSurveyResponses(surveyQuestionTexts);

    console.info("[engagement.flow] Starting survey setup flow", {
      instance: flowInput.instance,
      surveyName,
      surveyIdentifier,
      requestedStatus: flowInput.status ?? 1,
    });

    const draftForm = await createSurveyForm(flowInput, draftFormPayload);
    assertSuccessfulResponse("Creating draft survey form", draftForm);

    const formId = extractEntityId(draftForm as JsonRecord, "form_id", "id");
    if (!formId) {
      throw new Error("Draft survey form creation did not return a form_id.");
    }

    console.info("[engagement.flow] Draft form created", {
      formId,
      surveyName,
    });

    const activatedForm = await activateExistingSurveyForm(
      flowInput,
      formId,
      draftFormPayload,
      flowInput.formActivationPayloadOverrides
    );

    console.info("[engagement.flow] Form activated", {
      formId,
      surveyName,
    });

    let createdAssignment: UserAssignmentApiResponse | undefined;
    let reporteeCount: JsonRecord | undefined;
    let resolvedAssignment:
      | {
          id?: string;
          code?: string;
          value?: string;
        }
      | undefined;
    let assignmentForChannel = flowInput.assignment;

    if (assignmentForChannel === undefined) {
      const assignmentCreationResult = await createUserAssignmentForFieldUsingAvailableValues(flowInput, {
        field: flowInput.assignmentCreation?.field ?? "parent_company_id",
        type: flowInput.assignmentCreation?.type ?? "include",
        name: flowInput.assignmentCreation?.name ?? `${surveyName} Assignment`,
        description: flowInput.assignmentCreation?.description ?? "",
        applicableProcessIds: flowInput.assignmentCreation?.applicableProcessIds ?? [
          UserAssignmentProcess.DEFAULT,
          UserAssignmentProcess.SURVEY,
        ],
      });
      createdAssignment = assignmentCreationResult.assignment;
      reporteeCount = (
        await runReporteeCountTaskForInstance({
          ...flowInput,
          instance: flowInput.instance,
        })
      ).reporteeCount;

      const assignmentLookup = await getUserAssignmentByCodeOrName(flowInput, {
        code: assignmentCreationResult.assignmentCode,
        name: assignmentCreationResult.assignmentName,
      });

      if (!assignmentLookup?.id) {
        throw new Error(
          `Unable to resolve created user assignment from /settings/getAssignment for code ` +
            `"${assignmentCreationResult.assignmentCode}" and name "${assignmentCreationResult.assignmentName}".`
        );
      }

      resolvedAssignment = {
        id: assignmentLookup.id,
        code: assignmentLookup.code,
        value: assignmentLookup.name,
      };
      assignmentForChannel = [assignmentLookup.id];

      console.info("[engagement.flow] Assignment created for survey channel", {
        assignmentId: assignmentLookup.id,
        assignmentCode: assignmentLookup.code,
        surveyName,
      });
    }

    const closureDateTime = normalizeUnixSeconds(flowInput.closureDateTime ?? getOneWeekFromNowInUnixSeconds());
    const closureTimezone = String(
      flowInput.closureTimezone ?? bootstrap.default_timezone ?? "+330|Kolkata"
    );

    const survey = await createSurvey(flowInput, {
      survey_id: surveyIdentifier,
      name: surveyName,
      survey_process_type: flowInput.surveyProcessType ?? "",
      survey_type: flowInput.surveyType,
      survey_sub_type: flowInput.surveySubType,
      form_id: formId,
      form_type: flowInput.formType ?? "2",
      enable_auto_save: true,
      enable_partial_response: false,
      enable_editing_after_submission: false,
      configure_permissions: false,
      survey_permissions: [],
      filters: [],
      is_auto_scheduled_closure: false,
      is_auto_scheduled_start: false,
      survey_confidential_fields: [],
      is_survey_confidential_fields_enabled: false,
      excluded_respondents: [],
      privacy_promise_enabled: true,
      ...flowInput.surveyPayloadOverrides,
    } as SurveyProcessPayload);
    assertSuccessfulResponse("Creating survey", survey);

    const surveyId = extractEntityId(survey as JsonRecord, "survey_id", "id");
    if (!surveyId) {
      throw new Error("Survey creation did not return a survey_id.");
    }

    console.info("[engagement.flow] Survey created", {
      surveyId,
      surveyName,
      surveyIdentifier,
    });

    const emailTemplates = await getSurveyEmailTemplates(flowInput);
    assertSuccessfulResponse("Loading survey email templates", emailTemplates);

    const defaultChannelIdentifier = `channel_${timestampSuffix}`;
    const channel = await addOrUpdateSurveyChannel(flowInput, {
      survey_id: surveyId,
      id: "",
      channel_id: defaultChannelIdentifier,
      name: flowInput.channelName ?? `Channel ${timestampSuffix}`,
      responded_type: flowInput.respondedType ?? 1,
      channel_responses_type: flowInput.channelResponsesType ?? "",
      email_template: normalizeSurveyEmailTemplatesForChannel(emailTemplates.templates),
      assignment: assignmentForChannel ?? "",
      respondent: flowInput.respondent ?? [],
      attachments: [],
      reminder_schedule: [],
      enable_auto_reminders: false,
      excluded_respondent: "",
      external_emails: [],
      external_phone_numbers: [],
      is_teams_configured: Boolean(emailTemplates.allow_teams),
      rules: {},
      allow_access_to_user_outside_respondent_list: true,
      auth_type: "otp",
      disable_mail_notification: false,
      is_invite_bell_enabled: false,
      is_invite_sms_enabled: false,
      is_reminder_bell_enabled: false,
      is_reminder_sms_enabled: false,
      is_invite_whatsapp_enabled: false,
      is_reminder_whatsapp_enabled: false,
      send_for_all: false,
      ...flowInput.channelPayloadOverrides,
    });
    assertSuccessfulResponse("Adding survey channel", channel);

    const channelDetails = (channel.channel_details ?? {}) as JsonRecord;
    const channelMongoIdFromChannel = Object.keys(channelDetails)[0] ?? "";
    const resolvedChannelDetail = getFirstChannelDetail(channel.channel_details as JsonRecord | undefined);
    const channelId = extractEntityId(resolvedChannelDetail, "channel_id") || defaultChannelIdentifier;

    console.info("[engagement.flow] Survey channel added", {
      surveyId,
      channelId,
      channelMongoId: channelMongoIdFromChannel,
    });

    const requestedStatus = flowInput.status ?? 1;
    const statusUpdatedSurvey = await updateSurveyStatus(flowInput, surveyId, requestedStatus, {
      proposed_closure: {
        date_time: closureDateTime,
        timezone: closureTimezone,
      },
      is_auto_scheduled_closure: false,
      ...flowInput.surveyActivationOverrides,
    });
    assertSuccessfulResponse(
      `Updating survey to status ${requestedStatus}`,
      statusUpdatedSurvey
    );

    console.info("[engagement.flow] Survey status updated", {
      surveyId,
      requestedStatus,
      closureDateTime,
      closureTimezone,
    });

    let queuedEmails: JsonRecord | undefined;
    let tenantId: string | undefined;

    if (requestedStatus === 1) {
      runSurveyEmailQueueTaskForInstance(flowInput);
      // queuedEmails = queuedEmailResult.queuedEmails;
      // tenantId = queuedEmailResult.tenantId;

      console.info("[engagement.flow] Survey email queue task completed", {
        surveyId,
        tenantId,
      });
    }

    const submitResponses: SurveyApiResponse[] = [];
    const channelMongoId = channelMongoIdFromChannel;
    const surveySubmissionUrl = `${normalizeBaseUrl(flowInput.baseUrl)}/ms/formbuilder/submitSurveyForm/internal/${channelMongoId}`;

    console.info("[engagement.flow] Survey setup flow completed", {
      surveyId,
      channelId,
      requestedStatus,
    });

    return {
      bootstrap,
      draftForm,
      activatedForm,
      createdAssignment,
      reporteeCount,
      resolvedAssignment,
      survey,
      emailTemplates,
      channel,
      statusUpdatedSurvey,
      queuedEmails,
      submitResponses,
      generatedResponses,
      formId,
      surveyId,
      channelId,
      channelMongoId,
      surveySubmissionUrl,
      tenantId,
      usedClosureDateTime: closureDateTime,
      usedClosureTimezone: closureTimezone,
    };
  } catch (error) {
    console.error("[engagement.flow] Survey setup flow failed", {
      instance: flowInput?.instance ?? input.instance,
      surveyName,
      surveyIdentifier,
      error: stringifyError(error),
    });
    throw error;
  }
}

export type CreateSurveyWithThreeQuestionTextFormThenActivateChannelAndQueueEmailsInput =
  CreateSurveyWithFormActivationChannelSetupAndEmailQueueInput;

export type CreateSurveyWithThreeQuestionTextFormThenActivateChannelAndQueueEmailsResult =
  CreateSurveyWithFormActivationChannelSetupAndEmailQueueResult;

/**
 * Backward-compatible convenience wrapper for the original request shape.
 * The reusable flow underneath now supports either a fully custom form payload or
 * a basic text-question form builder, while this wrapper keeps the initial scenario simple.
 */
export async function createSurveyWithThreeQuestionTextFormThenActivateChannelAndQueueEmails(
  input: CreateSurveyWithThreeQuestionTextFormThenActivateChannelAndQueueEmailsInput
): Promise<CreateSurveyWithThreeQuestionTextFormThenActivateChannelAndQueueEmailsResult> {
  return createSurveyWithFormActivationChannelSetupAndEmailQueue(input);
}
