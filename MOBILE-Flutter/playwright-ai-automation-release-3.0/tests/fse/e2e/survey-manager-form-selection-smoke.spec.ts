import { test, expect, Page } from "@playwright/test";
import { loginToSystem } from "../../../src/helpers/login";
import { getBaseUrl } from "../../../data/instances";
import { SurveyManagerFormSelectionPage } from "../../../src/pages/fse/survey-manager-form-selection.page";
import { SurveyManagerFormSelectionApi } from "../../../src/pages/fse/api/survey-manager-form-selection.api";
import { SurveyManagerFormSelectionLocators } from "../../../src/pages/fse/locators/survey-manager-form-selection";

test.describe.configure({ mode: "serial", timeout: 120_000 });

/**
 * @module FSE
 * @feature Survey Manager – Form Selection
 * @description POM smoke validation for
 *   /ms/formbuilder/survey-manager/{surveyId}/form-selection.
 *   Verifies the page loads, header elements are present, create-option cards
 *   are visible (including the AI "Coming Soon" badge), and both the
 *   Recommended Templates and Existing Forms sections render with cards.
 */
test.describe("@fse-form-selection Survey Manager – Form Selection Smoke", () => {
  const INSTANCE = "forms1";
  const BASE_URL = getBaseUrl(INSTANCE);

  /** Survey created during earlier test runs; used as a stable test fixture. */
  const SURVEY_ID = "a6a15906c083e1";

  let formSelectionPage: SurveyManagerFormSelectionPage;
  let browserPage: Page;

  test.beforeAll(async ({ browser }) => {
    browserPage = await browser.newPage();
    formSelectionPage = new SurveyManagerFormSelectionPage(browserPage);
    await loginToSystem(browserPage, INSTANCE, "Admin");
    await expect(browserPage).toHaveURL(/dashboard|home/, { timeout: 30_000 });
  });

  test.afterAll(async () => {
    await browserPage.close();
  });

  // ── TC-001: Page loads ──────────────────────────────────────────────────────
  test("TC-001: Page loads and main container is visible", async () => {
    await formSelectionPage.navigate(BASE_URL, SURVEY_ID);

    await expect(browserPage).toHaveURL(
      new RegExp(
        SurveyManagerFormSelectionApi.getPageUrl(BASE_URL, SURVEY_ID)
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      ),
      { timeout: 10_000 }
    );

    await formSelectionPage.assertPageVisible();
  });

  // ── TC-002: Header elements ─────────────────────────────────────────────────
  test("TC-002: Header section is visible with survey name and back button", async () => {
    await formSelectionPage.assertHeaderVisible();

    const surveyName = await formSelectionPage.getHeaderSurveyName();
    expect(surveyName.length).toBeGreaterThan(0);

    // Edit-name icon should be present in the header
    await expect(
      browserPage.locator(`[data-testid="${SurveyManagerFormSelectionLocators.headerEditNameIcon.testId}"]`)
    ).toBeVisible();
  });

  // ── TC-003: Create-option cards ─────────────────────────────────────────────
  test("TC-003: Both create-option cards are visible", async () => {
    await formSelectionPage.assertCreateOptionsVisible();

    // "Start From Scratch" card title
    const scratchCard = browserPage.locator(
      `[data-testid="${SurveyManagerFormSelectionLocators.createFromScratchCard.testId}"]`
    );
    const scratchText = (await scratchCard.evaluate((el) => el.textContent ?? ""))
      .replace(/\s+/g, " ")
      .trim();
    expect(scratchText).toContain("Start From Scratch");

    // "Create Using AI" card title
    const aiCard = browserPage.locator(
      `[data-testid="${SurveyManagerFormSelectionLocators.createWithAiCard.testId}"]`
    );
    const aiText = (await aiCard.evaluate((el) => el.textContent ?? ""))
      .replace(/\s+/g, " ")
      .trim();
    expect(aiText).toContain("Create Using AI");
  });

  // ── TC-004: AI card carries "Coming Soon" badge ─────────────────────────────
  test("TC-004: AI create-option card shows the Coming Soon badge", async () => {
    const comingSoon = await formSelectionPage.isAiSurveyComingSoon();
    expect(comingSoon).toBe(true);

    await expect(
      browserPage.locator(
        `[data-testid="${SurveyManagerFormSelectionLocators.createWithAiComingSoonBadge.testId}"]`
      )
    ).toBeVisible();
  });

  // ── TC-005: Recommended Templates section ───────────────────────────────────
  test("TC-005: Recommended Templates section renders cards and View All button", async () => {
    await formSelectionPage.assertTemplatesSectionVisible();

    const titles = await formSelectionPage.getTemplateCardTitles();
    expect(titles.length).toBeGreaterThan(0);
    for (const t of titles) expect(t.length).toBeGreaterThan(0);

    // View All button is visible
    await expect(
      browserPage.locator(
        `[data-testid="${SurveyManagerFormSelectionLocators.templatesViewAllButton.testId}"]`
      )
    ).toBeVisible();
  });

  // ── TC-006: Existing Forms section ─────────────────────────────────────────
  test("TC-006: Existing Forms section renders cards and View All button", async () => {
    await formSelectionPage.assertFormsSectionVisible();

    const formTitles = await formSelectionPage.getFormCardTitles();
    expect(formTitles.length).toBeGreaterThan(0);
    for (const t of formTitles) expect(t.length).toBeGreaterThan(0);

    // View All button is visible
    await expect(
      browserPage.locator(
        `[data-testid="${SurveyManagerFormSelectionLocators.formsViewAllButton.testId}"]`
      )
    ).toBeVisible();
  });

  // ── TC-007: Activate/deactivate dialog is present in DOM ───────────────────
  test("TC-007: Activate/deactivate dialog is attached to the DOM", async () => {
    // The dialog is in the DOM but hidden; use toBeAttached (not toBeVisible)
    const dialog = browserPage.locator(
      `[data-testid="${SurveyManagerFormSelectionLocators.activateDialog.testId}"]`
    );
    await expect(dialog).toBeAttached();

    // Confirm and Cancel buttons are also in the DOM
    const confirmBtn = browserPage.locator(
      `[data-testid="${SurveyManagerFormSelectionLocators.activateDialogConfirmButton.testId}"]`
    );
    const cancelBtn = browserPage.locator(
      `[data-testid="${SurveyManagerFormSelectionLocators.activateDialogCancelButton.testId}"]`
    );
    await expect(confirmBtn).toBeAttached();
    await expect(cancelBtn).toBeAttached();
  });
});
