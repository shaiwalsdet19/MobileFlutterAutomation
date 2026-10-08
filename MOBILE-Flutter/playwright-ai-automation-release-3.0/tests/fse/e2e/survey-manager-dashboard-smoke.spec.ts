import { test, expect, Page } from "@playwright/test";
import { loginToSystem } from "../../../src/helpers/login";
import { getBaseUrl } from "../../../data/instances";
import { SurveyManagerDashboardPage } from "../../../src/pages/fse/survey-manager-dashboard.page";
import { SurveyManagerDashboardApi } from "../../../src/pages/fse/api/survey-manager-dashboard.api";
import { SurveyManagerDashboardLocators } from "../../../src/pages/fse/locators/survey-manager-dashboard";

test.describe.configure({ mode: "serial", timeout: 120_000 });

/**
 * @module FSE
 * @feature Survey Manager – Dashboard
 * @description POM smoke validation for /ms/formbuilder/survey-manager/dashboard.
 *   Verifies all key sections are visible, tab switching works, survey rows are
 *   readable, the Create Survey drawer opens and closes correctly, and the
 *   Libraries widget quick-links are present.
 */
test.describe("@fse-dashboard Survey Manager – Dashboard Smoke", () => {
  const INSTANCE = "forms1";
  const BASE_URL = getBaseUrl(INSTANCE);

  let dashboardPage: SurveyManagerDashboardPage;
  let browserPage: Page;

  test.beforeAll(async ({ browser }) => {
    browserPage = await browser.newPage();
    dashboardPage = new SurveyManagerDashboardPage(browserPage);
    await loginToSystem(browserPage, INSTANCE, "Admin");
    await expect(browserPage).toHaveURL(/dashboard|home/, { timeout: 30_000 });
  });

  test.afterAll(async () => {
    await browserPage.close();
  });

  // ── TC-001: Page loads ──────────────────────────────────────────────────────
  test("TC-001: Dashboard page loads and all major sections are visible", async () => {
    await dashboardPage.navigate(BASE_URL);

    await expect(browserPage).toHaveURL(
      new RegExp(SurveyManagerDashboardApi.dashboardPath.replace(/\//g, "\\/")),
      { timeout: 10_000 }
    );

    await dashboardPage.assertPageVisible();
    await dashboardPage.assertStatsSectionVisible();
    await dashboardPage.assertInsightsSectionVisible();
    await dashboardPage.assertSurveysSectionVisible();
    await dashboardPage.assertTemplatesSectionVisible();
    await dashboardPage.assertLibrariesSectionVisible();
  });

  // ── TC-002: Create Survey button and tab widgets are visible ────────────────
  test("TC-002: Create Survey button and surveys widget tabs are visible", async () => {
    const page = browserPage;

    const createSurveyBtn = page.locator('[data-testid="dbx-surveys-btn-dashboard-create-survey"]');
    await expect(createSurveyBtn).toBeVisible();

    const pinnedTab = page.locator('[data-testid="dbx-surveys-tab-dashboard-recent-pinned-tab-item-pinned"]');
    const recentTab = page.locator('[data-testid="dbx-surveys-tab-dashboard-recent-pinned-tab-item-recent"]');
    await expect(pinnedTab).toBeVisible();
    await expect(recentTab).toBeVisible();

    const viewAllBtn = page.locator('[data-testid="dbx-surveys-btn-dashboard-view-all"]');
    await expect(viewAllBtn).toBeVisible();
  });

  // ── TC-003: Insight cards are visible with correct Coming Soon state ─────────
  test("TC-003: Insight cards visible; People at Risk and Managers Effectiveness are Coming Soon", async () => {
    const page = browserPage;

    const engagementCard = page.locator('[data-testid="dbx-surveys-card-dashboard-insight-0"]');
    const peopleAtRiskCard = page.locator('[data-testid="dbx-surveys-card-dashboard-insight-1"]');
    const managersCard = page.locator('[data-testid="dbx-surveys-card-dashboard-insight-2"]');

    await expect(engagementCard).toBeVisible();
    await expect(peopleAtRiskCard).toBeVisible();
    await expect(managersCard).toBeVisible();

    const comingSoon1 = page.locator('[data-testid="dbx-surveys-badge-dashboard-insight-coming-soon-1"]');
    const comingSoon2 = page.locator('[data-testid="dbx-surveys-badge-dashboard-insight-coming-soon-2"]');
    await expect(comingSoon1).toBeVisible();
    await expect(comingSoon2).toBeVisible();
  });

  // ── TC-004: Recent surveys tab shows rows ────────────────────────────────────
  test("TC-004: Recent Surveys tab loads survey rows", async () => {
    await dashboardPage.openRecentSurveysTab();
    await dashboardPage.waitForSurveyRows();

    const count = await dashboardPage.getVisibleSurveyCount();
    expect(count).toBeGreaterThan(0);

    const ids = await dashboardPage.getVisibleSurveyIds();
    expect(ids.length).toBeGreaterThan(0);
    expect(ids[0]).toBeTruthy();
  });

  // ── TC-005: Pinned surveys tab renders ───────────────────────────────────────
  test("TC-005: Pinned Surveys tab renders (may have 0 rows if none pinned)", async () => {
    await dashboardPage.openPinnedSurveysTab();

    const pinnedTab = browserPage.locator('[data-testid="dbx-surveys-tab-dashboard-recent-pinned-tab-item-pinned"]');
    await expect(pinnedTab).toBeVisible();
  });

  // ── TC-006: Survey row status tag is visible ─────────────────────────────────
  test("TC-006: First visible survey row has a status tag", async () => {
    await dashboardPage.openRecentSurveysTab();
    await dashboardPage.waitForSurveyRows();

    const firstId = await dashboardPage.getFirstVisibleSurveyId();
    expect(firstId).not.toBeNull();

    if (firstId) {
      const statusTag = browserPage.locator(
        `[data-testid^="dbx-surveys-status-tag-dashboard-survey-"][data-testid$="-${firstId}"]`
      );
      await expect(statusTag).toBeVisible();
    }
  });

  // ── TC-007: Recommended template cards are visible ───────────────────────────
  test("TC-007: Recommended template cards render in the carousel", async () => {
    const carousel = browserPage.locator('[data-testid="dbx-surveys-carousel-recommended-templates"]');
    await expect(carousel).toBeVisible();

    const templateIds = await dashboardPage.getVisibleRecommendedTemplateIds();
    expect(templateIds.length).toBeGreaterThan(0);
  });

  // ── TC-008: Libraries widget quick-links are all visible ─────────────────────
  test("TC-008: All six library quick-links are visible", async () => {
    const page = browserPage;
    const links = [
      "dbx-surveys-link-libraries-widget-templates",
      "dbx-surveys-link-libraries-widget-question-bank",
      "dbx-surveys-link-libraries-widget-themes",
      "dbx-surveys-link-libraries-widget-sub-themes",
      "dbx-surveys-link-libraries-widget-benchmarks",
      "dbx-surveys-link-libraries-widget-action-plan-library",
    ];

    for (const testId of links) {
      await expect(page.locator(`[data-testid="${testId}"]`)).toBeVisible();
    }

    const viewAllBtn = page.locator('[data-testid="dbx-surveys-btn-libraries-widget-view-all"]');
    await expect(viewAllBtn).toBeVisible();
  });

  // ── TC-009: Create Survey drawer opens and closes ────────────────────────────
  test("TC-009: Create Survey drawer opens and can be closed", async () => {
    await dashboardPage.openCreateSurveyDrawer();
    await dashboardPage.assertCreateSurveyDrawerVisible();

    // Moment search input exists in the DOM inside a collapsed dropdown — verify
    // the dropdown trigger is visible instead (the search only becomes visible
    // after the dropdown is opened).
    const momentDropdown = browserPage.locator('[data-testid="dbx-surveys-dropdown-create-modal-moment"]');
    await expect(momentDropdown).toBeVisible();

    await dashboardPage.closeCreateSurveyDrawer();
    await expect(
      browserPage.locator('[data-testid="dbx-surveys-form-create-survey"]')
    ).not.toBeVisible();
  });

  // ── TC-010: Survey row context menu opens ─────────────────────────────────────
  test("TC-010: Overflow menu on a survey row opens and shows actions", async () => {
    await dashboardPage.openRecentSurveysTab();
    await dashboardPage.waitForSurveyRows();

    const firstId = await dashboardPage.getFirstVisibleSurveyId();
    if (!firstId) {
      test.skip();
      return;
    }

    await dashboardPage.openSurveyMenu(firstId);
    await dashboardPage.waitForSurveyMenuItems(firstId);

    const menuItems = browserPage.locator(
      `[data-testid^="dbx-surveys-btn-dashboard-survey-menu-${firstId}-menu-item-"]`
    );
    const itemCount = await menuItems.count();
    expect(itemCount).toBeGreaterThan(0);

    await browserPage.keyboard.press("Escape");
  });
});
