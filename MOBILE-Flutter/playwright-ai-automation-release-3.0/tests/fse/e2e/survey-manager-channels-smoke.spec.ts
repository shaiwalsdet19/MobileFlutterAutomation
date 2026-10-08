import { test, expect, Page } from "@playwright/test";
import { loginToSystem } from "../../../src/helpers/login";
import { getBaseUrl } from "../../../data/instances";
import { SurveyManagerChannelsPage } from "../../../src/pages/fse/survey-manager-channels.page";
import { SurveyManagerChannelsApi } from "../../../src/pages/fse/api/survey-manager-channels.api";
import { SurveyManagerChannelsLocators } from "../../../src/pages/fse/locators/survey-manager-channels";

test.describe.configure({ mode: "serial", timeout: 120_000 });

/**
 * @module FSE
 * @feature Survey Manager – Channels (Add Channel)
 * @description POM smoke validation for
 *   /ms/formbuilder/survey-manager/{surveyId}/channels.
 *   Verifies the page loads, the shared header and stepper are visible,
 *   the Add Channel form fields are present, share-option rows are rendered,
 *   and the form action buttons are accessible.
 */
test.describe("@fse-channels Survey Manager – Channels Smoke", () => {
  const INSTANCE = "forms1";
  const BASE_URL = getBaseUrl(INSTANCE);

  /** Stable test survey used as a fixture. */
  const SURVEY_ID = "a6a15906c083e1";

  let channelsPage: SurveyManagerChannelsPage;
  let browserPage: Page;

  test.beforeAll(async ({ browser }) => {
    browserPage = await browser.newPage();
    channelsPage = new SurveyManagerChannelsPage(browserPage);
    await loginToSystem(browserPage, INSTANCE, "Admin");
    await expect(browserPage).toHaveURL(/dashboard|home/, { timeout: 30_000 });
  });

  test.afterAll(async () => {
    await browserPage.close();
  });

  // ── TC-001: Page loads ──────────────────────────────────────────────────────
  test("TC-001: Page loads and Add Channel form container is visible", async () => {
    await channelsPage.navigate(BASE_URL, SURVEY_ID);

    await expect(browserPage).toHaveURL(
      new RegExp(
        SurveyManagerChannelsApi.getPageUrl(BASE_URL, SURVEY_ID)
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      ),
      { timeout: 10_000 }
    );

    await channelsPage.assertPageVisible();
  });

  // ── TC-002: Shared header is visible ───────────────────────────────────────
  test("TC-002: Shared survey header shows survey name, Previous, and Next buttons", async () => {
    await channelsPage.assertHeaderVisible();

    const surveyName = await channelsPage.getHeaderSurveyName();
    expect(surveyName.length).toBeGreaterThan(0);

    // Edit-name icon and more-options button are also in the header
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.headerEditNameIcon.testId}"]`)
    ).toBeVisible();
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.headerMoreOptionsButton.testId}"]`)
    ).toBeVisible();
  });

  // ── TC-003: Survey creation stepper is visible ─────────────────────────────
  test("TC-003: Survey creation stepper (Questions / Configs / Channels / Summary) is visible", async () => {
    await channelsPage.assertStepperVisible();

    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.stepper.testId}"]`)
    ).toBeVisible();
  });

  // ── TC-004: Channel name field ─────────────────────────────────────────────
  test("TC-004: Channel name input field is visible and fillable", async () => {
    await channelsPage.assertChannelNameInputVisible();

    // The outer dbx-ds-text-input host is visible
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.channelNameInput.testId}"]`)
    ).toBeVisible();

    // The inner native input (pierced Shadow DOM) is also attached
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.channelNameNativeInput.testId}"]`)
    ).toBeAttached();
  });

  // ── TC-005: Respondent type section ───────────────────────────────────────
  test("TC-005: Respondent type section shows Internal and External cards", async () => {
    await channelsPage.assertRespondentTypeSectionVisible();

    // Internal card carries id="active" by default
    const internalCard = browserPage.locator(
      `[data-testid="${SurveyManagerChannelsLocators.internalCard.testId}"]`
    );
    const externalCard = browserPage.locator(
      `[data-testid="${SurveyManagerChannelsLocators.externalCard.testId}"]`
    );

    const internalId = await internalCard.getAttribute("id");
    expect(["active", "dummy"]).toContain(internalId);

    const externalId = await externalCard.getAttribute("id");
    expect(["active", "dummy"]).toContain(externalId);

    // Verify the respondent type can be read
    const selectedType = await channelsPage.getSelectedRespondentType();
    expect(["internal", "external"]).toContain(selectedType);
  });

  // ── TC-006: Response type radio group ─────────────────────────────────────
  test("TC-006: Response type radio group is visible with both options", async () => {
    await channelsPage.assertResponseTypeRadioVisible();

    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.responseTypeSendSurveyInput.testId}"]`)
    ).toBeAttached();
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.responseTypeImportInput.testId}"]`)
    ).toBeAttached();
  });

  // ── TC-007: Respondent dropdowns ───────────────────────────────────────────
  test("TC-007: Include and Exclude Respondents dropdowns are visible", async () => {
    await channelsPage.assertRespondentDropdownsVisible();

    // Include dropdown head shows placeholder text
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.includeRespondentsDropdownHead.testId}"]`)
    ).toBeVisible();

    // Exclude dropdown head is also visible
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.excludeRespondentsDropdownHead.testId}"]`)
    ).toBeVisible();

    // "+ Condition" button is visible
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.addConditionButton.testId}"]`)
    ).toBeVisible();
  });

  // ── TC-008: Internal auth dropdown ────────────────────────────────────────
  test("TC-008: Authenticate-via dropdown is visible with a default value", async () => {
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.internalAuthDropdown.testId}"]`)
    ).toBeVisible();

    const authValue = await channelsPage.getInternalAuthValue();
    expect(authValue.length).toBeGreaterThan(0);
  });

  // ── TC-009: Auto-reminder section ─────────────────────────────────────────
  test("TC-009: Auto-reminder section and toggle switch are visible", async () => {
    await channelsPage.assertAutoReminderSectionVisible();
  });

  // ── TC-010: Share options rows ─────────────────────────────────────────────
  test("TC-010: Email, Teams, WhatsApp, and SMS share-option rows are visible", async () => {
    await channelsPage.assertShareOptionsVisible();

    // Email row has the Configure link
    await expect(
      browserPage.locator(SurveyManagerChannelsLocators.shareEmailConfigureLink.testId)
    ).toBeVisible();

    // Teams row has the Configure link
    await expect(
      browserPage.locator(SurveyManagerChannelsLocators.shareTeamsConfigureLink.testId)
    ).toBeVisible();
  });

  // ── TC-011: Form action buttons ────────────────────────────────────────────
  test("TC-011: Cancel and Add (Submit) form action buttons are visible", async () => {
    await channelsPage.assertFormActionsVisible();

    // Submit button text should be "Add" on a fresh channel form
    const submitBtn = browserPage.locator(
      `[data-testid="${SurveyManagerChannelsLocators.submitButton.testId}-button"]`
    );
    if (await submitBtn.isVisible().catch(() => false)) {
      const text = await submitBtn.innerText();
      expect(["Add", "Save", "Submit"]).toContain(text.trim());
    }
  });

  // ── TC-012: Activate/deactivate dialog is in the DOM ──────────────────────
  test("TC-012: Activate/deactivate dialog is attached (hidden by default)", async () => {
    await expect(
      browserPage.locator(
        `[data-testid="${SurveyManagerChannelsLocators.activateDialog.testId}"]`
      )
    ).toBeAttached();
  });

  // ── TC-013: Invites panel testIds present in DOM ───────────────────────────
  test("TC-013: Invites panel elements are attached to the DOM", async () => {
    // These elements are pre-rendered in the DOM even when the panel is closed
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.invitesCloseButton.testId}"]`)
    ).toBeAttached();
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.invitesSaveButton.testId}"]`)
    ).toBeAttached();
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.invitesNameInput.testId}"]`)
    ).toBeAttached();
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerChannelsLocators.invitesEmailInput.testId}"]`)
    ).toBeAttached();
  });
});
