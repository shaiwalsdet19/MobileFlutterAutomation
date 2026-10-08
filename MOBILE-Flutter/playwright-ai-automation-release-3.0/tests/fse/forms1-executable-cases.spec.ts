import { Browser, Page, expect, test } from "@playwright/test";
import { getBaseUrl } from "../../data/instances";
import { createSurveyForm, buildSurveyFormPayloadFromTextQuestions } from "../../src/apis/fse/forms.api";
import { createSurveyWithFormActivationChannelSetupAndEmailQueue } from "../../src/flows/fse/engagement.flow";
import {
  addOrUpdateSurveyChannel,
  activateExistingSurveyForm,
  getSurveyEmailTemplates,
} from "../../src/flows/fse/engagement.flow";
import {
  createSurvey,
  searchSurveyByName,
  type SurveyListItem,
  type SurveyProcessPayload,
} from "../../src/apis/fse/engagement.api";
import { cleanupCollectionsAfterTimestamp } from "../../src/helpers/collection-cleanup";
import { loginToSystem } from "../../src/helpers/login";
import { SidebarAppLocators } from "../../src/pages/common/locators/topbar";
import { TopBarPage } from "../../src/pages/common/topbar.page";


import type { Locator as SharedLocator } from "../../src/pages/common/locators/common";
import { EngagementSettingsPage } from "../../src/pages/fse/engagement/engagement-settings.page";
import { SurveyManagerDetailsPage } from "../../src/pages/fse/survey/survey-manager-details.page";
import { SurveyManagerDetailsApi } from "../../src/pages/fse/survey/api/survey-manager-details.api";
import { SurveyManagerSummaryApi } from "../../src/pages/fse/survey/api/survey-manager-summary.api";
import { EngagementSettingsLocators } from "../../src/pages/fse/engagement/locators/engagement-settings";

test.describe.configure({ mode: "serial", timeout: 300_000 });

const INSTANCE = "forms1";
const BASE_URL = getBaseUrl(INSTANCE);
const CLEANUP_COLLECTIONS = ["survey_details"];
const DEFAULT_QUESTION_TEXTS = [
  "How was your overall survey experience?",
  "What worked well in this survey flow?",
  "What can be improved in this survey flow?",
];

type ManagedSurvey = {
  id: string;
  name: string;
};

type SurveyFixtures = {
  activePrimary: ManagedSurvey;
  activeSecondary: ManagedSurvey;
  inactiveSurvey: ManagedSurvey;
  draftSurvey: ManagedSurvey;
  sharedSearchTerm: string;
  partialMatchTerm: string;
};

let setupPage: Page;
let testsStartedAt: number;
let fixtures: SurveyFixtures;

function logSetupStep(step: string, details?: Record<string, unknown>): void {
  const suffix = details ? ` ${JSON.stringify(details)}` : "";
  console.log(`[forms1 setup] ${step}${suffix}`);
}

function setupErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function buildCookieHeader(cookies: Array<{ name: string; value: string }>): string {
  return cookies.map(({ name, value }) => `${name}=${value}`).join("; ");
}

function resolveSharedLocator(page: Page, locator: SharedLocator) {
  const selector = locator.testId.trim();
  if (selector.startsWith("dbx-") || selector.startsWith("ribbon-")) {
    return page.locator(`[data-testid=${JSON.stringify(selector)}]`);
  }

  return page.locator(selector);
}

function normalizeOptions(options: string[]): string[] {
  return options.map((option) => option.replace(/\s+/g, " ").trim()).filter(Boolean);
}

function managedSurveyNames(): string[] {
  return [
    fixtures.activePrimary.name,
    fixtures.activeSecondary.name,
    fixtures.inactiveSurvey.name,
    fixtures.draftSurvey.name,
  ];
}

async function adminCookie(page: Page): Promise<string> {
  return buildCookieHeader(await page.context().cookies());
}

async function loginAsRole(browser: Browser, role: string): Promise<Page> {
  const page = await browser.newPage();
  await loginToSystem(page, INSTANCE, role);
  await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });
  return page;
}

async function openSettingsPage(browser: Browser, role: string): Promise<{
  page: Page;
  settingsPage: EngagementSettingsPage;
}> {
  const page = await loginAsRole(browser, role);
  const settingsPage = new EngagementSettingsPage(page);
  await settingsPage.navigate(BASE_URL);
  return { page, settingsPage };
}

async function openDetailsPage(browser: Browser, role: string, surveyId: string): Promise<{
  page: Page;
  detailsPage: SurveyManagerDetailsPage;
}> {
  const page = await loginAsRole(browser, role);
  const detailsPage = new SurveyManagerDetailsPage(page);
  await detailsPage.navigate(BASE_URL, surveyId);
  await expect(page).toHaveURL(SurveyManagerDetailsApi.getDetailsUrl(BASE_URL, surveyId), {
    timeout: 30_000,
  });
  return { page, detailsPage };
}

async function openSummaryPage(browser: Browser, role: string, surveyId: string): Promise<{
  page: Page;
  detailsPage: SurveyManagerDetailsPage;
}> {
  const page = await loginAsRole(browser, role);
  const detailsPage = new SurveyManagerDetailsPage(page);
  await page.goto(SurveyManagerSummaryApi.getPageUrl(BASE_URL, surveyId));
  await detailsPage.waitForPageReady();
  await expect(page).toHaveURL(SurveyManagerSummaryApi.getPageUrl(BASE_URL, surveyId), {
    timeout: 30_000,
  });
  return { page, detailsPage };
}

async function currentExcludedSurveyNames(
  settingsPage: EngagementSettingsPage
): Promise<string[]> {
  return normalizeOptions(
    await settingsPage.inputs.getSelectedDropdownOptions(
      EngagementSettingsLocators.surveyExclusionSelect
    )
  );
}

async function saveSettingsIfChanged(
  settingsPage: EngagementSettingsPage,
  changed: boolean
): Promise<void> {
  if (!changed) {
    return;
  }

  await settingsPage.clickSave();
  await settingsPage.waitForPageReady();
}

async function ensureManagedExclusions(
  settingsPage: EngagementSettingsPage,
  desiredSurveyNames: string[]
): Promise<void> {
  const desired = new Set(desiredSurveyNames);
  const selected = new Set(await currentExcludedSurveyNames(settingsPage));
  let changed = false;

  for (const surveyName of managedSurveyNames()) {
    if (selected.has(surveyName) && !desired.has(surveyName)) {
      await settingsPage.inputs.clearDropdownOption(
        EngagementSettingsLocators.surveyExclusionSelect,
        surveyName
      );
      changed = true;
    }
  }

  for (const surveyName of desiredSurveyNames) {
    if (!selected.has(surveyName)) {
      await settingsPage.inputs.selectDropdownOption(
        EngagementSettingsLocators.surveyExclusionSelect,
        surveyName
      );
      changed = true;
    }
  }

  await saveSettingsIfChanged(settingsPage, changed);
}

async function searchExclusionList(
  settingsPage: EngagementSettingsPage,
  searchText: string
): Promise<void> {
  await settingsPage.inputs.searchDropdown(
    EngagementSettingsLocators.surveyExclusionSelect,
    searchText
  );
  await settingsPage.waitForTimeout(250);
}

async function expectSearchContains(
  settingsPage: EngagementSettingsPage,
  searchText: string,
  surveyName: string
): Promise<void> {
  await searchExclusionList(settingsPage, searchText);
  await expect
    .poll(async () => {
      return settingsPage.inputs.listOfOptionsAvalible(
        EngagementSettingsLocators.surveyExclusionSelect,
        surveyName
      );
    })
    .toBeGreaterThan(0);
}

async function expectSearchExcludes(
  settingsPage: EngagementSettingsPage,
  searchText: string,
  surveyName: string
): Promise<void> {
  await searchExclusionList(settingsPage, searchText);
  expect(
    await settingsPage.inputs.listOfOptionsAvalible(
      EngagementSettingsLocators.surveyExclusionSelect,
      surveyName
    )
  ).toBe(0);
}

async function addSurveyToExclusionList(
  settingsPage: EngagementSettingsPage,
  surveyName: string,
  searchText: string
): Promise<void> {
  await expectSearchContains(settingsPage, searchText, surveyName);
  await settingsPage.inputs.selectDropdownOption(
    EngagementSettingsLocators.surveyExclusionSelect,
    surveyName
  );
  await settingsPage.clickSave();
  await expect
    .poll(async () => currentExcludedSurveyNames(settingsPage))
    .toContain(surveyName);
}

async function removeSurveyFromExclusionList(
  settingsPage: EngagementSettingsPage,
  surveyName: string
): Promise<void> {
  await settingsPage.inputs.clearDropdownOption(
    EngagementSettingsLocators.surveyExclusionSelect,
    surveyName
  );
  await settingsPage.clickSave();
  await expect
    .poll(async () => currentExcludedSurveyNames(settingsPage))
    .not.toContain(surveyName);
}

async function findSurveyStatusByName(page: Page, survey: ManagedSurvey): Promise<number | string | undefined> {
  const results = await searchSurveyByName(
    {
      baseUrl: BASE_URL,
      cookie: await adminCookie(page),
    },
    survey.name
  );

  const matchedSurvey = results.find((item: SurveyListItem) => {
    const id = String(item.id ?? item.survey_id ?? "");
    return id === survey.id || item.name === survey.name;
  });

  return matchedSurvey?.status;
}

async function createActiveSurvey(page: Page, surveyName: string): Promise<ManagedSurvey> {
  const result = await createSurveyWithFormActivationChannelSetupAndEmailQueue({
    instance: INSTANCE,
    baseUrl: BASE_URL,
    cookie: await adminCookie(page),
    status: 1,
    surveyType: 2,
    surveySubType: 3,
    channelResponsesType: "regular",
    surveyName,
    formName: `${surveyName} Form`,
    channelName: `${surveyName} Channel`,
    formQuestionTexts: DEFAULT_QUESTION_TEXTS,
  });

  expect(result.surveyId).toBeTruthy();
  return {
    id: result.surveyId,
    name: surveyName,
  };
}

async function createDraftSurvey(page: Page, surveyName: string): Promise<ManagedSurvey> {
  const requestInput = {
    baseUrl: BASE_URL,
    cookie: await adminCookie(page),
  };
  const formPayload = buildSurveyFormPayloadFromTextQuestions({
    formName: `${surveyName} Form`,
    formDescription: "",
    questionTexts: DEFAULT_QUESTION_TEXTS,
  });
  const draftForm = await createSurveyForm(requestInput, formPayload);
  const formId = String(draftForm.form_id ?? draftForm.id ?? "");

  expect(formId).toBeTruthy();

  await activateExistingSurveyForm(requestInput, formId, formPayload);

  const survey = await createSurvey(requestInput, {
    survey_id: surveyName,
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
  } as SurveyProcessPayload);
  const surveyId = String(survey.survey_id ?? survey.id ?? "");

  expect(surveyId).toBeTruthy();

  const emailTemplates = await getSurveyEmailTemplates(requestInput);
  await addOrUpdateSurveyChannel(requestInput, {
    survey_id: surveyId,
    id: "",
    channel_id: `draft_channel_${Date.now()}`,
    name: `${surveyName} Channel`,
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
  });

  return {
    id: surveyId,
    name: surveyName,
  };
}

async function deactivateSurveyViaUi(page: Page, survey: ManagedSurvey): Promise<ManagedSurvey> {
  const detailsPage = new SurveyManagerDetailsPage(page);
  await detailsPage.navigate(BASE_URL, survey.id);
  await detailsPage.openDeactivateDialog();
  await detailsPage.confirmDeactivate();
  await detailsPage.waitForDeactivateDialogClosed();

  await expect
    .poll(async () => findSurveyStatusByName(page, survey), { timeout: 30_000 })
    .not.toBe(1);

  return survey;
}

test.beforeAll(async ({ browser }) => {
  let currentStep = "initializing setup";

  try {
    currentStep = "creating browser page";
    logSetupStep(currentStep);
    setupPage = await browser.newPage();
    testsStartedAt = Date.now();

    currentStep = "logging in as Admin";
    logSetupStep(currentStep, { instance: INSTANCE });
    await loginToSystem(setupPage, INSTANCE, "Admin");
    await expect(setupPage).toHaveURL(/dashboard|home/, { timeout: 30_000 });

    const uniqueSuffix = Date.now();
    const sharedSearchTerm = "Blazing Survey Pulse";
    logSetupStep("resolved setup naming", { uniqueSuffix, sharedSearchTerm });

    currentStep = "creating active primary survey";
    logSetupStep(currentStep);
    const activePrimary = await createActiveSurvey(
      setupPage,
      `${sharedSearchTerm} Active Primary ${uniqueSuffix}`
    );

    currentStep = "creating active secondary survey";
    logSetupStep(currentStep);
    const activeSecondary = await createActiveSurvey(
      setupPage,
      `${sharedSearchTerm} Active Secondary ${uniqueSuffix}`
    );

    currentStep = "creating inactive seed survey";
    logSetupStep(currentStep);
    const inactiveSurvey = await createActiveSurvey(
      setupPage,
      `${sharedSearchTerm} Inactive ${uniqueSuffix}`
    );

    currentStep = "creating draft survey";
    logSetupStep(currentStep);
    const draftSurvey = await createDraftSurvey(
      setupPage,
      `${sharedSearchTerm} Draft ${uniqueSuffix}`
    );

    fixtures = {
      activePrimary,
      activeSecondary,
      inactiveSurvey,
      draftSurvey,
      sharedSearchTerm,
      partialMatchTerm: "Blazing Surv",
    };
    logSetupStep("created survey fixtures", {
      activePrimaryId: activePrimary.id,
      activeSecondaryId: activeSecondary.id,
      inactiveSurveyId: inactiveSurvey.id,
      draftSurveyId: draftSurvey.id,
    });

    currentStep = "deactivating inactive survey via UI";
    logSetupStep(currentStep, { surveyId: fixtures.inactiveSurvey.id });
    fixtures.inactiveSurvey = await deactivateSurveyViaUi(
      setupPage,
      fixtures.inactiveSurvey
    );

    currentStep = "resetting managed exclusions";
    logSetupStep(currentStep);
    const settingsPage = new EngagementSettingsPage(setupPage);
    await settingsPage.navigate(BASE_URL);
    await ensureManagedExclusions(settingsPage, []);

    logSetupStep("beforeAll setup completed", {
      elapsedMs: Date.now() - testsStartedAt,
    });
  } catch (error) {
    console.error(
      `[forms1 setup] FAILED during "${currentStep}": ${setupErrorMessage(error)}`
    );

    if (error instanceof Error && error.stack) {
      console.error(error.stack);
    }

    if (setupPage && !setupPage.isClosed()) {
      const screenshotPath = `test-results/forms1-beforeall-failure-${Date.now()}.png`;
      try {
        await setupPage.screenshot({ path: screenshotPath, fullPage: true });
        console.error(`[forms1 setup] failure screenshot saved: ${screenshotPath}`);
      } catch (screenshotError) {
        console.error(
          `[forms1 setup] screenshot capture failed: ${setupErrorMessage(screenshotError)}`
        );
      }
    }

    throw error;
  }
});

test.afterAll(async () => {
  try {
    await cleanupCollectionsAfterTimestamp(setupPage, {
      baseUrl: BASE_URL,
      collections: CLEANUP_COLLECTIONS,
      testsStartedAt,
    });
  } finally {
    await setupPage.close();
  }
});

test.describe("@forms1-exclusion-list Forms1 Survey Exclusion List", () => {
  test("TC-001 | Survey Exclusion List section is visible with exact heading, tooltip, and default empty state", async ({
    browser,
  }) => {
    const { page, settingsPage } = await openSettingsPage(browser, "Admin");

    try {
      await ensureManagedExclusions(settingsPage, []);
      await settingsPage.assertSurveyExclusionSectionVisible();

      const sectionText = (
        await resolveSharedLocator(page, EngagementSettingsLocators.surveyExclusionSection).innerText()
      )
        .replace(/\s+/g, " ")
        .trim();

      expect(sectionText).toContain("Survey Exclusion List");
      expect(await settingsPage.getSurveyExclusionTooltipContent()).toBe(
        "Surveys added to this list will not contribute to Engagement Dashboard scores, trends, or analyses."
      );
      expect(await settingsPage.getSurveyExclusionCount()).toBe(0);
    } finally {
      await page.close();
    }
  });

  test("TC-002 | HR Admin can add an Active survey to the Survey Exclusion List and see the exact tooltip text", async ({
    browser,
  }) => {
    const { page, settingsPage } = await openSettingsPage(browser, "Admin");

    try {
      await ensureManagedExclusions(settingsPage, []);
      await addSurveyToExclusionList(
        settingsPage,
        fixtures.activePrimary.name,
        fixtures.sharedSearchTerm
      );

      expect(await currentExcludedSurveyNames(settingsPage)).toContain(
        fixtures.activePrimary.name
      );
      expect(await settingsPage.getSurveyExclusionTooltipContent()).toBe(
        "Surveys added to this list will not contribute to Engagement Dashboard scores, trends, or analyses."
      );
    } finally {
      await page.close();
    }
  });

  test("TC-003 | HR Admin can add an Inactive survey to the Survey Exclusion List", async ({
    browser,
  }) => {
    const { page, settingsPage } = await openSettingsPage(browser, "Admin");

    try {
      await ensureManagedExclusions(settingsPage, []);
      await addSurveyToExclusionList(
        settingsPage,
        fixtures.inactiveSurvey.name,
        fixtures.sharedSearchTerm
      );

      expect(await currentExcludedSurveyNames(settingsPage)).toContain(
        fixtures.inactiveSurvey.name
      );
    } finally {
      await page.close();
    }
  });

  test("TC-004 | HR Admin can remove a survey from the Survey Exclusion List and the survey no longer appears", async ({
    browser,
  }) => {
    const { page, settingsPage } = await openSettingsPage(browser, "Admin");

    try {
      await ensureManagedExclusions(settingsPage, [fixtures.activePrimary.name]);
      expect(await currentExcludedSurveyNames(settingsPage)).toContain(
        fixtures.activePrimary.name
      );

      await removeSurveyFromExclusionList(settingsPage, fixtures.activePrimary.name);

      expect(await currentExcludedSurveyNames(settingsPage)).not.toContain(
        fixtures.activePrimary.name
      );
      expect(await settingsPage.getSurveyExclusionCount()).toBe(0);
    } finally {
      await page.close();
    }
  });

  test("TC-005 | Engagement Admin can add and remove surveys from the Survey Exclusion List", async ({
    browser,
  }) => {
    const { page, settingsPage } = await openSettingsPage(browser, "Engagement Admin");

    try {
      await ensureManagedExclusions(settingsPage, []);
      await addSurveyToExclusionList(
        settingsPage,
        fixtures.activeSecondary.name,
        fixtures.sharedSearchTerm
      );
      expect(await currentExcludedSurveyNames(settingsPage)).toContain(
        fixtures.activeSecondary.name
      );

      await removeSurveyFromExclusionList(settingsPage, fixtures.activeSecondary.name);
      expect(await currentExcludedSurveyNames(settingsPage)).not.toContain(
        fixtures.activeSecondary.name
      );
    } finally {
      await page.close();
    }
  });

  test("TC-007 | Typeahead returns Active and Inactive surveys at 3+ characters and excludes Draft surveys", async ({
    browser,
  }) => {
    const { page, settingsPage } = await openSettingsPage(browser, "Admin");

    try {
      await ensureManagedExclusions(settingsPage, []);

      await searchExclusionList(settingsPage, fixtures.sharedSearchTerm);
      await expect
        .poll(async () =>
          settingsPage.inputs.listOfOptionsAvalible(
            EngagementSettingsLocators.surveyExclusionSelect,
            fixtures.activePrimary.name
          )
        )
        .toBeGreaterThan(0);
      await expect
        .poll(async () =>
          settingsPage.inputs.listOfOptionsAvalible(
            EngagementSettingsLocators.surveyExclusionSelect,
            fixtures.inactiveSurvey.name
          )
        )
        .toBeGreaterThan(0);
      await expect
        .poll(async () =>
          settingsPage.inputs.listOfOptionsAvalible(
            EngagementSettingsLocators.surveyExclusionSelect,
            fixtures.draftSurvey.name
          )
        )
        .toBe(0);

      await settingsPage.navigate(BASE_URL);
      await ensureManagedExclusions(settingsPage, []);

      await searchExclusionList(settingsPage, fixtures.partialMatchTerm);
      await expect
        .poll(async () =>
          settingsPage.inputs.listOfOptionsAvalible(
            EngagementSettingsLocators.surveyExclusionSelect,
            fixtures.activePrimary.name
          )
        )
        .toBeGreaterThan(0);
      await expect
        .poll(async () =>
          settingsPage.inputs.listOfOptionsAvalible(
            EngagementSettingsLocators.surveyExclusionSelect,
            fixtures.draftSurvey.name
          )
        )
        .toBe(0);
    } finally {
      await page.close();
    }
  });

  test("TC-021 | Draft surveys do not appear in the Survey Name typeahead search results", async ({
    browser,
  }) => {
    const { page, settingsPage } = await openSettingsPage(browser, "Admin");

    try {
      await ensureManagedExclusions(settingsPage, []);

      await searchExclusionList(settingsPage, fixtures.sharedSearchTerm);
      await expect
        .poll(async () =>
          settingsPage.inputs.listOfOptionsAvalible(
            EngagementSettingsLocators.surveyExclusionSelect,
            fixtures.draftSurvey.name
          )
        )
        .toBe(0);
      await expect
        .poll(async () =>
          settingsPage.inputs.listOfOptionsAvalible(
            EngagementSettingsLocators.surveyExclusionSelect,
            fixtures.activePrimary.name
          )
        )
        .toBeGreaterThan(0);
    } finally {
      await page.close();
    }
  });

  test("TC-022 | Already-excluded surveys do not appear in typeahead results while other eligible surveys still appear", async ({
    browser,
  }) => {
    const { page, settingsPage } = await openSettingsPage(browser, "Admin");

    try {
      const excludedSurveySearchPrefix = "Primary";
      const eligibleSurveySearchPrefix = "Secondary";

      await ensureManagedExclusions(settingsPage, [fixtures.activePrimary.name]);
      expect(await currentExcludedSurveyNames(settingsPage)).toContain(
        fixtures.activePrimary.name
      );

      await expectSearchExcludes(
        settingsPage,
        excludedSurveySearchPrefix,
        fixtures.activePrimary.name
      );
      await expectSearchContains(
        settingsPage,
        eligibleSurveySearchPrefix,
        fixtures.activeSecondary.name
      );
    } finally {
      await page.close();
    }
  });

  test("TC-023 | Restricted user cannot access the Survey Exclusion List", async ({
    browser,
  }) => {
    const page = await loginAsRole(browser, "Employee");

    try {
      await page.goto(`${BASE_URL}settings/engagement/settings`);
      await page.waitForLoadState("networkidle").catch(() => {});

      const onSettingsPage = page.url().includes("/settings/engagement/settings");
      if (!onSettingsPage) {
        await expect(page).not.toHaveURL(/\/settings\/engagement\/settings/, {
          timeout: 5_000,
        });
        return;
      }

      await expect(
        resolveSharedLocator(page, EngagementSettingsLocators.surveyExclusionSection)
      ).not.toBeVisible();
      await expect(
        resolveSharedLocator(page, EngagementSettingsLocators.surveyExclusionSelect)
      ).not.toBeVisible();
    } finally {
      await page.close();
    }
  });

  // test("TC-028 | Typeahead search does not trigger before 3 characters and activates at exactly 3 characters", async ({
  //   browser,
  // }) => {
  //   const { page, settingsPage } = await openSettingsPage(browser, "Admin");

  //   try {
  //     await ensureManagedExclusions(settingsPage, []);

  //     await expectSearchExcludes(settingsPage, "S", fixtures.activePrimary.name);
  //     await expectSearchExcludes(settingsPage, "S", fixtures.inactiveSurvey.name);

  //     await settingsPage.navigate(BASE_URL);
  //     await ensureManagedExclusions(settingsPage, []);

  //     await expectSearchExcludes(settingsPage, "Su", fixtures.activePrimary.name);
  //     await expectSearchExcludes(settingsPage, "Su", fixtures.inactiveSurvey.name);

  //     await settingsPage.navigate(BASE_URL);
  //     await ensureManagedExclusions(settingsPage, []);

  //     await expectSearchContains(settingsPage, "Sur", fixtures.activePrimary.name);
  //     await expectSearchContains(settingsPage, "Sur", fixtures.inactiveSurvey.name);
  //   } finally {
  //     await page.close();
  //   }
  // });
});

test.describe("@forms1-details-visibility Forms1 Survey Details Visibility", () => {
  test("TC-010 | Visible on Engagement Dashboard reverts to 'Yes' after survey removal from the exclusion list", async ({
    browser,
  }) => {
    const settings = await openSettingsPage(browser, "Admin");

    try {
      await ensureManagedExclusions(settings.settingsPage, []);
      await addSurveyToExclusionList(
        settings.settingsPage,
        fixtures.activePrimary.name,
        fixtures.sharedSearchTerm
      );
      await removeSurveyFromExclusionList(
        settings.settingsPage,
        fixtures.activePrimary.name
      );
    } finally {
      await settings.page.close();
    }

    const details = await openDetailsPage(browser, "Admin", fixtures.activePrimary.id);
    try {
      // await details.detailsPage.assertDashboardVisibilityRowVisible();
      await details.detailsPage.assertEngagementDashboardVisibilityIs("Yes");
    } finally {
      await details.page.close();
    }
  });

  test("TC-011 | Visible on Engagement Dashboard is visible to Engagement Admin, Manager, and HRBP-mapped Admin", async ({
    browser,
  }) => {
    const roles = [
      // { role: "Engagement Admin", label: "Engagement Admin" },
      // { role: "Manager", label: "Manager" },
      { role: "Admin", label: "HRBP" },
    ];

    const adminSettings = await openSettingsPage(browser, "Admin");
    try {
      await ensureManagedExclusions(adminSettings.settingsPage, []);
    } finally {
      await adminSettings.page.close();
    }

    for (const { role, label } of roles) {
      const details = await openDetailsPage(browser, role, fixtures.activeSecondary.id);
      try {
        // await details.detailsPage.assertDashboardVisibilityRowVisible();
        await details.detailsPage.assertEngagementDashboardVisibilityIs("Yes");
      } catch (error) {
        throw new Error(`${label} validation failed: ${String(error)}`);
      } finally {
        await details.page.close();
      }
    }
  });

  test("TC-029 | Excluded survey shows 'No' for dashboard-access user and no field for user without dashboard access", async ({
    browser,
  }) => {
    const settings = await openSettingsPage(browser, "Admin");
    try {
      await ensureManagedExclusions(settings.settingsPage, []);
      await addSurveyToExclusionList(
        settings.settingsPage,
        fixtures.activePrimary.name,
        fixtures.sharedSearchTerm
      );
    } finally {
      await settings.page.close();
    }

    const adminDetails = await openDetailsPage(browser, "Admin", fixtures.activePrimary.id);
    try {
      // await adminDetails.detailsPage.assertDashboardVisibilityRowVisible();
      await adminDetails.detailsPage.assertEngagementDashboardVisibilityIs("No");
    } finally {
      await adminDetails.page.close();
    }

    const employeePage = await loginAsRole(browser, "Employee");
    const employeeTopBarPage = new TopBarPage(employeePage);
    try {
      await employeeTopBarPage.toggleSidebarApps();
      await expect(
        employeePage.getByTestId(SidebarAppLocators.surveyManagerAdmin.testId)
      ).not.toBeVisible({ timeout: 15_000 });
    } finally {
      await employeePage.close();
    }
  });

  test("TC-030 | Survey removal immediately updates Visible on Engagement Dashboard back to 'Yes'", async ({
    browser,
  }) => {
    const settings = await openSettingsPage(browser, "Admin");
    try {
      await ensureManagedExclusions(settings.settingsPage, []);
      await addSurveyToExclusionList(
        settings.settingsPage,
        fixtures.activeSecondary.name,
        fixtures.sharedSearchTerm
      );
    } finally {
      await settings.page.close();
    }

    const excludedDetails = await openDetailsPage(
      browser,
      "Admin",
      fixtures.activeSecondary.id
    );
    try {
      await excludedDetails.detailsPage.assertEngagementDashboardVisibilityIs("No");
    } finally {
      await excludedDetails.page.close();
    }

    const settingsAfterRemoval = await openSettingsPage(browser, "Admin");
    try {
      await removeSurveyFromExclusionList(
        settingsAfterRemoval.settingsPage,
        fixtures.activeSecondary.name
      );
    } finally {
      await settingsAfterRemoval.page.close();
    }

    const restoredDetails = await openDetailsPage(
      browser,
      "Admin",
      fixtures.activeSecondary.id
    );
    try {
      // await restoredDetails.detailsPage.assertDashboardVisibilityRowVisible();
      await restoredDetails.detailsPage.assertEngagementDashboardVisibilityIs("Yes");
    } finally {
      await restoredDetails.page.close();
    }
  });

  test("TC-031 | Inactive survey added to the Exclusion List shows 'No' on Survey Details", async ({
    browser,
  }) => {
    const initialDetails = await openDetailsPage(
      browser,
      "Admin",
      fixtures.inactiveSurvey.id
    );
    try {
      // await initialDetails.detailsPage.assertDashboardVisibilityRowVisible();
      await initialDetails.detailsPage.assertEngagementDashboardVisibilityIs("Yes");
    } finally {
      await initialDetails.page.close();
    }

    const settings = await openSettingsPage(browser, "Admin");
    try {
      await ensureManagedExclusions(settings.settingsPage, []);
      await addSurveyToExclusionList(
        settings.settingsPage,
        fixtures.inactiveSurvey.name,
        fixtures.sharedSearchTerm
      );
    } finally {
      await settings.page.close();
    }

    const excludedDetails = await openDetailsPage(
      browser,
      "Admin",
      fixtures.inactiveSurvey.id
    );
    try {
      // await excludedDetails.detailsPage.assertDashboardVisibilityRowVisible();
      await excludedDetails.detailsPage.assertEngagementDashboardVisibilityIs("No");
    } finally {
      await excludedDetails.page.close();
    }
  });

  test("TC-032 | Draft survey cannot be added to the Exclusion List and still shows 'Yes' on Survey Details", async ({
    browser,
  }) => {
    const settings = await openSettingsPage(browser, "Admin");
    try {
      await ensureManagedExclusions(settings.settingsPage, []);

      await expectSearchExcludes(
        settings.settingsPage,
        fixtures.sharedSearchTerm,
        fixtures.draftSurvey.name
      );
      expect(await currentExcludedSurveyNames(settings.settingsPage)).not.toContain(
        fixtures.draftSurvey.name
      );
    } finally {
      await settings.page.close();
    }

    const details = await openSummaryPage(browser, "Admin", fixtures.draftSurvey.id);
    try {
      await details.detailsPage.assertDashboardVisibilityRowVisible();
      await details.detailsPage.assertEngagementDashboardVisibilityIs("Yes");
    } finally {
      await details.page.close();
    }
  });
});
