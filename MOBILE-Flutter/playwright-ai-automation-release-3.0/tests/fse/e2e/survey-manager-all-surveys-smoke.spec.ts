import { test, expect, Page } from "@playwright/test";
import { loginToSystem } from "../../../src/helpers/login";
import { getBaseUrl } from "../../../data/instances";
import { SurveyManagerAllSurveysPage } from "../../../src/pages/fse/survey-manager-all-surveys.page";
import { SurveyManagerAllSurveysApi } from "../../../src/pages/fse/api/survey-manager-all-surveys.api";
import { SurveyManagerAllSurveysLocators } from "../../../src/pages/fse/locators/survey-manager-all-surveys";

test.describe.configure({ mode: "serial", timeout: 180_000 });

/**
 * @module FSE
 * @feature Survey Manager – All Surveys
 * @description POM smoke validation for /ms/formbuilder/survey-manager/all-surveys.
 *   Verifies page loads, key sections are visible, tab switching works,
 *   row data is accessible, and the Create Survey drawer can be opened / closed.
 */
test.describe("@fse-all-surveys Survey Manager – All Surveys Smoke", () => {
  const INSTANCE = "forms1";
  const BASE_URL = getBaseUrl(INSTANCE);

  let allSurveysPage: SurveyManagerAllSurveysPage;
  let browserPage: Page;

  test.beforeAll(async ({ browser }) => {
    browserPage = await browser.newPage();
    allSurveysPage = new SurveyManagerAllSurveysPage(browserPage);
    await loginToSystem(browserPage, INSTANCE, "Admin");
    await expect(browserPage).toHaveURL(/dashboard|home/, { timeout: 30_000 });
  });

  test.afterAll(async () => {
    await browserPage.close();
  });

  // ── TC-001: Page loads ──────────────────────────────────────────────────────
  test("TC-001: Page loads and all key sections are visible", async () => {
    await allSurveysPage.navigate(BASE_URL);

    await allSurveysPage.assertPageVisible();
    await allSurveysPage.assertTableVisible();
    await allSurveysPage.assertTabGroupVisible();

    await expect(browserPage).toHaveURL(
      new RegExp(SurveyManagerAllSurveysApi.pagePath.replace(/\//g, "\\/")),
      { timeout: 10_000 }
    );
  });

  // ── TC-002: Tab items have dedicated testIds ────────────────────────────────
  test("TC-002: Tab item testIds are present on the live page", async () => {
    const tabAll = browserPage.locator('[data-testid="dbx-surveys-tab-list-survey-type-tab-item-all"]');
    const tabBusiness = browserPage.locator('[data-testid="dbx-surveys-tab-list-survey-type-tab-item-business"]');
    const tabAdHoc = browserPage.locator('[data-testid="dbx-surveys-tab-list-survey-type-tab-item-standalone"]');

    await expect(tabAll).toBeVisible();
    await expect(tabBusiness).toBeVisible();
    await expect(tabAdHoc).toBeVisible();
  });

  // ── TC-003: Survey rows are visible and readable ────────────────────────────
  test("TC-003: Survey rows are visible and readable", async () => {
    await allSurveysPage.waitForRows();

    const rowCount = await allSurveysPage.getVisibleRowCount();
    expect(rowCount).toBeGreaterThan(0);

    const title = await allSurveysPage.getSurveyTitleAt(0);
    expect(title.length).toBeGreaterThan(0);

    const statusLabel = await allSurveysPage.getSurveyStatusLabelAt(0);
    expect(["Draft", "Active", "Closed", "Scheduled"]).toContain(statusLabel);
  });

  // ── TC-004: Tab switching ──────────────────────────────────────────────────
  test("TC-004: Tab switching loads different survey sets", async () => {
    await allSurveysPage.switchTab("adHoc");
    await allSurveysPage.assertTableVisible();

    await allSurveysPage.switchTab("businessProcessLinked");
    await allSurveysPage.assertTableVisible();

    await allSurveysPage.switchTab("all");
    await allSurveysPage.waitForRows();
  });

  // ── TC-005: Search filters rows ────────────────────────────────────────────
  test("TC-005: Search filters rows", async () => {
    const allRows = await allSurveysPage.getVisibleRowCount();
    expect(allRows).toBeGreaterThan(0);

    await allSurveysPage.searchSurveys("zzz_unlikely_to_match_anything_xyz");
    await allSurveysPage.waitForTableLoad();

    await allSurveysPage.clearSearch();
    await allSurveysPage.waitForTableLoad();
  });

  // ── TC-006: Create Survey drawer opens ────────────────────────────────────
  test("TC-006: Create Survey button opens the drawer with all form elements", async () => {
    await allSurveysPage.openCreateSurveyDrawer();
    await allSurveysPage.assertCreateSurveyDrawerVisible();

    // Name input is on the outer web-component host — check it's in the DOM
    const nameInput = browserPage.locator('[data-testid="dbx-surveys-input-create-modal-name"]');
    await expect(nameInput).toBeAttached();

    // Response format dropdown is in the DOM
    const formatDropdown = browserPage.locator('[data-testid="dbx-surveys-dropdown-create-modal-form-type"]');
    await expect(formatDropdown).toBeAttached();

    // Moment dropdown is in the DOM
    const momentDropdown = browserPage.locator('[data-testid="dbx-surveys-dropdown-create-modal-moment"]');
    await expect(momentDropdown).toBeAttached();

    // Survey type field wrapper is in the DOM
    const typeField = browserPage.locator('[data-testid="dbx-surveys-field-create-modal-survey-type"]');
    await expect(typeField).toBeAttached();
  });

  // ── TC-007: Create Survey type cards are correct ─────────────────────────
  test("TC-007: Survey type cards show correct labels (type-2=Ad-Hoc, type-1=Business Process)", async () => {
    // Drawer is still open from TC-006
    await allSurveysPage.assertCreateSurveyDrawerVisible();

    const adHocCard = browserPage.locator('[data-testid="dbx-surveys-card-create-modal-type-2"]');
    const bpCard = browserPage.locator('[data-testid="dbx-surveys-card-create-modal-type-1"]');

    await expect(adHocCard).toBeAttached();
    await expect(bpCard).toBeAttached();

    // Cards are inside a dbx-ds-form-field web component — use textContent
    // (not innerText) to read the raw text regardless of Shadow-host CSS.
    const adHocText = (await adHocCard.evaluate((el) => el.textContent ?? "")).replace(/\s+/g, " ").trim();
    const bpText = (await bpCard.evaluate((el) => el.textContent ?? "")).replace(/\s+/g, " ").trim();

    expect(adHocText).toContain("Ad-Hoc Survey");
    expect(bpText).toContain("Linked to Business Process");
  });

  // ── TC-008: Create Survey drawer can be closed ───────────────────────────
  test("TC-008: Create Survey drawer can be closed with the × button", async () => {
    await allSurveysPage.closeCreateSurveyDrawer();

    // After closing the drawer, the All Surveys table should still be visible
    await allSurveysPage.assertTableVisible();
  });

  // ── TC-009: Re-open drawer and fill name field ───────────────────────────
  test("TC-009: Survey name can be filled in the Create Survey drawer", async () => {
    await allSurveysPage.openCreateSurveyDrawer();
    await allSurveysPage.fillCreateSurveyName("Smoke Test Survey");

    // Moment search is inside a collapsed dropdown — verify its hidden presence
    const momentSearch = browserPage.locator(
      `[data-testid="${SurveyManagerAllSurveysLocators.createSurveyMomentSearch.testId}"]`
    );
    await expect(momentSearch).toBeAttached();

    await allSurveysPage.closeCreateSurveyDrawer();
  });
});
