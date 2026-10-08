import { expect, Page, test } from "@playwright/test";
import { getBaseUrl } from "../../../data/instances";
import { loginToSystem } from "../../../src/helpers/login";
import { buildSurveyFormPayloadFromTextQuestions, createSurveyForm } from "../../../src/apis/fse/forms.api";
import { activateSurvey, createSurvey, getSurveyManagerBootstrapData } from "../../../src/apis/fse/engagement.api";
import {
  activateExistingSurveyForm,
  addOrUpdateSurveyChannel,
  getSurveyEmailTemplates,
  runSurveyEmailQueueTaskForInstance,
} from "../../../src/flows/fse/engagement.flow";
import { cleanupCollectionsAfterTimestamp } from "../../../src/helpers/collection-cleanup";

test.describe.configure({ mode: "serial", timeout: 240_000 });

const INSTANCE = process.env.INSTANCE ?? "forms1";
const BASE_URL = getBaseUrl(INSTANCE);
const CLEANUP_COLLECTIONS = ["survey_details"];

function buildCookieHeader(cookies: Array<{ name: string; value: string }>): string {
  return cookies.map(({ name, value }) => `${name}=${value}`).join("; ");
}

function logApiResponse(label: string, payload: unknown): void {
  console.log(`\n=== ${label} ===`);
  console.log(JSON.stringify(payload, null, 2));
}

function getFirstChannelDetail(channelDetails: Record<string, unknown> | undefined): Record<string, unknown> {
  if (!channelDetails) {
    return {};
  }

  if (channelDetails.id || channelDetails.channel_id) {
    return channelDetails;
  }

  const firstChannelDetail = Object.values(channelDetails).find(
    (value) => value && typeof value === "object" && !Array.isArray(value)
  );

  return (firstChannelDetail as Record<string, unknown> | undefined) ?? {};
}

test.describe("@fse-survey-create-flow Survey Create Flow", () => {
  let page: Page;
  let testsStartedAt: number;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  // test.afterAll(async () => {
  //   await page.close();
  // });

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    testsStartedAt = Date.now();
  });

  test.afterAll(async () => {
    try {
      await cleanupCollectionsAfterTimestamp(page, {
        baseUrl: BASE_URL,
        collections: CLEANUP_COLLECTIONS,
        testsStartedAt,
      });
    } finally {
      await page.close();
    }
  });

  test("TC-001: should create and activate a survey through the reusable API flow", async () => {
    await loginToSystem(page, INSTANCE, "Admin");
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });

    const cookie = buildCookieHeader(await page.context().cookies());
    const uniqueSuffix = Date.now();
    const flowInput = {
      baseUrl: BASE_URL,
      cookie,
    };
    const surveyName = `PW API Survey ${uniqueSuffix}`;
    const surveyIdentifier = surveyName;

    const bootstrap = await getSurveyManagerBootstrapData(flowInput);
    logApiResponse("getSurveyManagerBootstrapData", bootstrap);

    const formPayload = buildSurveyFormPayloadFromTextQuestions({
      formName: `PW API Survey Form ${uniqueSuffix}`,
      formDescription: "",
      questionTexts: [
        "How was your overall survey experience?",
        "What went well in this survey setup?",
        "What can be improved in this survey flow?",
      ],
    });

    const draftForm = await createSurveyForm(flowInput, formPayload);
    logApiResponse("createSurveyForm", draftForm);
    const formId = String(draftForm.form_id ?? "");

    const activatedForm = await activateExistingSurveyForm(flowInput, formId, formPayload);
    logApiResponse("activateExistingSurveyForm", activatedForm);

    const survey = await createSurvey(flowInput, {
      survey_id: surveyIdentifier,
      name: surveyName,
      survey_process_type: "",
      survey_type: 2,
      survey_sub_type: 3,
      form_id: formId,
      form_type: "2",
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
    });
    logApiResponse("createSurvey", survey);
    const surveyId = String(survey.survey_id ?? survey.id ?? "");

    const emailTemplates = await getSurveyEmailTemplates(flowInput);
    logApiResponse("getSurveyEmailTemplates", emailTemplates);

    const channel = await addOrUpdateSurveyChannel(flowInput, {
      survey_id: surveyId,
      channel_id: `channel_${uniqueSuffix}`,
      name: `PW API Channel ${uniqueSuffix}`,
      responded_type: 1,
      channel_responses_type: "regular",
      email_template: emailTemplates.templates ?? {},
      assignment: "",
      respondent: [],
      attachments: [],
      reminder_schedule: [],
      enable_auto_reminders: false,
      excluded_respondent: "",
      external_emails: [],
      external_phone_numbers: [],
      is_teams_configured: Boolean(emailTemplates.allow_teams),
      rules: "",
      allow_access_to_user_outside_respondent_list: true,
      auth_type: "otp",
      disable_mail_notification: false,
      is_invite_bell_enabled: false,
      is_invite_sms_enabled: false,
      is_reminder_bell_enabled: false,
      is_reminder_sms_enabled: false,
      is_invite_whatsapp_enabled: false,
      is_reminder_whatsapp_enabled: false,
    });
    logApiResponse("addOrUpdateSurveyChannel", channel);

    const activatedSurvey = await activateSurvey(flowInput, surveyId, {
      proposed_closure: {
        date_time: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
        timezone: String(bootstrap.default_timezone ?? "+330|Kolkata"),
      },
      is_auto_scheduled_closure: false,
    });
    logApiResponse("activateSurvey", activatedSurvey);

    const queued = await runSurveyEmailQueueTaskForInstance({
      ...flowInput,
      instance: INSTANCE,
    });
    logApiResponse("runSurveyEmailQueueTaskForInstance", queued);
    const resolvedChannelDetail = getFirstChannelDetail(channel.channel_details as Record<string, unknown> | undefined);

    expect(formId).toBeTruthy();
    expect(surveyId).toBeTruthy();
    expect(String(resolvedChannelDetail.id ?? resolvedChannelDetail.channel_id ?? "")).toBeTruthy();
    expect(queued.tenantId).toBeTruthy();
    expect(activatedSurvey.status).toBe(1);

    await page.goto(`${BASE_URL}ms/formbuilder/survey-manager/dashboard`);
    await expect(page).toHaveURL(/survey-manager/, { timeout: 30_000 });
  });
});
