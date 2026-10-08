import { test, expect, Page } from "@playwright/test";
import { loginToSystem } from "../../../src/helpers/login";
import { getBaseUrl } from "../../../data/instances";
import { SurveyManagerSummaryPage } from "../../../src/pages/fse/survey-manager-summary.page";
import { SurveyManagerSummaryApi } from "../../../src/pages/fse/api/survey-manager-summary.api";
import { SurveyManagerSummaryLocators } from "../../../src/pages/fse/locators/survey-manager-summary";

test.describe.configure({ mode: "serial", timeout: 120_000 });

/**
 * @module FSE
 * @feature Survey Manager – Summary (final wizard step)
 * @description POM smoke validation for
 *   /ms/formbuilder/survey-manager/{surveyId}/summary.
 *   Verifies the page loads, the shared header and stepper are visible,
 *   the Survey Details card is populated with field cells, the Channels
 *   table is rendered, and the Activate dialog / Invites panel are present
 *   in the DOM.
 */
test.describe("@fse-summary Survey Manager – Summary Smoke", () => {
  const INSTANCE = "forms1";
  const BASE_URL = getBaseUrl(INSTANCE);

  /** Stable test survey used as a fixture. */
  const SURVEY_ID = "a6a15906c083e1";

  let summaryPage: SurveyManagerSummaryPage;
  let browserPage: Page;

  test.beforeAll(async ({ browser }) => {
    browserPage = await browser.newPage();
    summaryPage = new SurveyManagerSummaryPage(browserPage);
    await loginToSystem(browserPage, INSTANCE, "Admin");
    await expect(browserPage).toHaveURL(/dashboard|home/, { timeout: 30_000 });
  });

  test.afterAll(async () => {
    await browserPage.close();
  });

  // ── TC-001: Page loads ──────────────────────────────────────────────────────

  test("TC-001 | Summary page loads and page container is visible", async () => {
    await summaryPage.navigate(BASE_URL, SURVEY_ID);
    await summaryPage.assertPageVisible();

    expect(browserPage.url()).toContain(
      `/survey-manager/${SURVEY_ID}/summary`
    );
  });

  // ── TC-002: Header ─────────────────────────────────────────────────────────

  test("TC-002 | Shared survey header is visible with Back, Previous, and Activate buttons", async () => {
    await summaryPage.assertHeaderVisible();
  });

  // ── TC-003: Survey name in header ──────────────────────────────────────────

  test("TC-003 | Survey name text is non-empty in the header", async () => {
    const name = await summaryPage.getHeaderSurveyName();
    expect(name.length).toBeGreaterThan(0);
  });

  // ── TC-004: Activate button label ─────────────────────────────────────────

  test("TC-004 | Activate/Deactivate button has a non-empty label ('Activate' or 'Deactivate')", async () => {
    const label = await summaryPage.getActivateButtonLabel();
    expect(["Activate", "Deactivate"]).toContain(label);
  });

  // ── TC-005: Stepper ────────────────────────────────────────────────────────

  test("TC-005 | Survey creation stepper is visible", async () => {
    await summaryPage.assertStepperVisible();
  });

  // ── TC-006: Survey Details section ────────────────────────────────────────

  test("TC-006 | Survey Details card container is visible", async () => {
    await summaryPage.assertDetailsSectionVisible();
  });

  // ── TC-007: Survey Details grid populated ─────────────────────────────────

  test("TC-007 | Survey Details grid contains one or more field cells", async () => {
    await summaryPage.assertDetailsGridPopulated();
  });

  // ── TC-008: Survey title value ────────────────────────────────────────────

  test("TC-008 | 'Survey Title' detail field returns a non-empty value", async () => {
    const title = await summaryPage.getSurveyDetailValue("surveyTitle");
    expect(title.length).toBeGreaterThan(0);
  });

  // ── TC-009: Created By value ──────────────────────────────────────────────

  test("TC-009 | 'Created By' detail field returns a non-empty value", async () => {
    const createdBy = await summaryPage.getSurveyDetailValue("createdBy");
    expect(createdBy.length).toBeGreaterThan(0);
  });

  // ── TC-010: Channels section ──────────────────────────────────────────────

  test("TC-010 | Channels section container and dbox-table are visible", async () => {
    await summaryPage.assertChannelsSectionVisible();
    await summaryPage.assertChannelsTableVisible();
  });

  // ── TC-011: Channels search input ─────────────────────────────────────────

  test("TC-011 | Channels table search input is visible (identified by placeholder text)", async () => {
    // Scroll the channels section into view to trigger the dbox-table lazy rendering,
    // then wait for the network to settle so the skeleton loader is replaced.
    await browserPage
      .locator('[data-testid="dbx-surveys-section-summary-channels"]')
      .scrollIntoViewIfNeeded();
    await browserPage.waitForLoadState("networkidle", { timeout: 30_000 }).catch(() => {});
    await summaryPage.assertChannelsSearchInputVisible();
  });

  // ── TC-012: Activate dialog attached ─────────────────────────────────────

  test("TC-012 | Activate/Deactivate confirmation dialog is present in DOM (hidden by default)", async () => {
    await summaryPage.assertActivateDialogAttached();

    // Verify internal elements are also attached
    await expect(
      browserPage.locator(
        `[data-testid="${SurveyManagerSummaryLocators.activateDialogCancelButton.testId}"]`
      )
    ).toBeAttached();
    await expect(
      browserPage.locator(
        `[data-testid="${SurveyManagerSummaryLocators.activateDialogConfirmButton.testId}"]`
      )
    ).toBeAttached();
  });

  // ── TC-013: Invites / reminder panel attached ─────────────────────────────

  test("TC-013 | Invites/Reminder panel key elements are present in DOM (hidden by default)", async () => {
    await summaryPage.assertInvitesPanelAttached();
    await summaryPage.assertInvitesSaveReminderAttached();
    await summaryPage.assertInvitesErrorsAttached();

    // Verify checkbox and tick elements are also pre-rendered
    await expect(
      browserPage.locator(
        `[data-testid="${SurveyManagerSummaryLocators.invitesSendAllCheckbox.testId}"]`
      )
    ).toBeAttached();
    await expect(
      browserPage.locator(
        `[data-testid="${SurveyManagerSummaryLocators.invitesReminderNameInput.testId}"]`
      )
    ).toBeAttached();
  });

  // ── TC-014: getAllSurveyDetails returns a map ─────────────────────────────

  test("TC-014 | getAllSurveyDetails returns a non-empty map with known labels", async () => {
    const details = await summaryPage.getAllSurveyDetails();
    const keys = Object.keys(details);

    expect(keys.length).toBeGreaterThan(0);
    expect(keys).toContain("Survey Title");
    expect(keys).toContain("Created By");
    expect(keys).toContain("Created On");
  });
});
