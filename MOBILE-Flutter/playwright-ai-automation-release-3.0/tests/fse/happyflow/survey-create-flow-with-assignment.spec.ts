import { Browser, expect, Page, test } from "@playwright/test";
import { getBaseUrl } from "../../../data/instances";
import { loginToSystem } from "../../../src/helpers/login";
import { createSurveyWithFormActivationChannelSetupAndEmailQueue } from "../../../src/flows/fse/engagement.flow";
import type { OrderedQuestionResponses } from "../../../src/pages/common/form.page";
import { SurveyFormPage } from "../../../src/pages/common/survey-form.page";

test.describe.configure({ mode: "serial", timeout: 240_000 });

const INSTANCE = process.env.INSTANCE ?? "forms1";
const BASE_URL = getBaseUrl(INSTANCE);
const SURVEY_PARTICIPANT_ROLES = ["Admin", "Manager", "L2Manager", "Employee"] as const;

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

async function loginAndSubmitSurveyForRole(
  browser: Browser,
  roleId: string,
  surveySubmissionUrl: string,
  formId: string,
  responses: OrderedQuestionResponses
): Promise<void> {
  const participantPage = await browser.newPage();

  try {
    await loginToSystem(participantPage, INSTANCE, roleId);
    await expect(participantPage).toHaveURL(/dashboard|home/, { timeout: 30_000 });
    await participantPage.goto(surveySubmissionUrl);

    const surveyFormPage = new SurveyFormPage(participantPage, formId);
    await surveyFormPage.completeSurvey(responses);
  } finally {
    await participantPage.close();
  }
}

test.describe("@fse-survey-create-flow-with-assignment Survey Create Flow With Assignment", () => {
  let page: Page;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("TC-001: should create survey, assignment, channel, and activation through the reusable flow", async ({
    browser,
  }) => {
    await loginToSystem(page, INSTANCE, "Admin");
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });

    const cookie = buildCookieHeader(await page.context().cookies());
    const uniqueSuffix = Date.now();

    const result = await createSurveyWithFormActivationChannelSetupAndEmailQueue({
      instance: INSTANCE,
      baseUrl: BASE_URL,
      cookie,
      status: 1,
      surveyType: 2,
      channelResponsesType: 'regular',
      surveySubType: 3,
      surveyName: `PW API Survey With Assignment ${uniqueSuffix}`,
      formName: `PW API Survey Form With Assignment ${uniqueSuffix}`,
      channelName: `PW API Channel With Assignment ${uniqueSuffix}`,
      formQuestionTexts: [
        "How was your overall survey experience?",
        "What worked well in this survey flow?",
        "What can be improved in this survey flow?",
      ],
      assignmentCreation: {
        field: "parent_company_id",
      },
    });

    logApiResponse("getSurveyManagerBootstrapData", result.bootstrap);
    logApiResponse("createSurveyForm", result.draftForm);
    logApiResponse("activateExistingSurveyForm", result.activatedForm);
    logApiResponse("createUserAssignment", result.createdAssignment);
    logApiResponse("runReporteeCountTaskForInstance", result.reporteeCount);
    logApiResponse("resolveUserAssignment", result.resolvedAssignment);
    logApiResponse("createSurvey", result.survey);
    logApiResponse("getSurveyEmailTemplates", result.emailTemplates);
    logApiResponse("addOrUpdateSurveyChannel", result.channel);
    logApiResponse("updateSurveyStatus", result.statusUpdatedSurvey);
    logApiResponse("runSurveyEmailQueueTaskForInstance", {
      queuedEmails: result.queuedEmails,
      tenantId: result.tenantId,
    });
    logApiResponse("surveySubmissionUrl", result.surveySubmissionUrl);

    const resolvedChannelDetail = getFirstChannelDetail(
      result.channel.channel_details as Record<string, unknown> | undefined
    );

    for (const roleId of SURVEY_PARTICIPANT_ROLES) {
      await loginAndSubmitSurveyForRole(
        browser,
        roleId,
        result.surveySubmissionUrl,
        result.formId,
        result.generatedResponses
      );
    }

    expect(result.formId).toBeTruthy();
    expect(result.surveyId).toBeTruthy();
    expect(result.createdAssignment).toBeTruthy();
    expect(result.reporteeCount?.status).toBe(1);
    expect(result.resolvedAssignment?.id).toBeTruthy();
    expect(String(resolvedChannelDetail.id ?? resolvedChannelDetail.channel_id ?? result.channelId)).toBeTruthy();
    expect(result.surveySubmissionUrl).toContain("/ms/formbuilder/submitSurveyForm/internal/");
    expect(result.generatedResponses.length).toBeGreaterThan(0);
    expect(result.statusUpdatedSurvey.status).toBe(1);
  });
});
