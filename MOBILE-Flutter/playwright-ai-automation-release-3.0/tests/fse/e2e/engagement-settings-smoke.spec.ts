import { test, expect, Page } from "@playwright/test";
import { loginToSystem } from "../../../src/helpers/login";
import { getBaseUrl } from "../../../data/instances";
import { EngagementSettingsPage } from "../../../src/pages/fse/engagement-settings.page";
import { EngagementSettingsApi } from "../../../src/pages/fse/api/engagement-settings.api";
import { EngagementSettingsLocators } from "../../../src/pages/fse/locators/engagement-settings";

test.describe.configure({ mode: "serial", timeout: 120_000 });

/**
 * @module FSE
 * @feature Engagement Settings
 * @description POM smoke validation for /settings/engagement/settings.
 *   Verifies page load, heading, breadcrumbs, ribbon save button,
 *   all major form fields (Scale, Primary Indicator, eNPS, clustering,
 *   min size, filters, score settings accordion + slider), and
 *   the score-settings info modal panel is present in the DOM.
 */
test.describe("@fse-engagement-settings Engagement Settings Smoke", () => {
  const INSTANCE = "forms1";
  const BASE_URL = getBaseUrl(INSTANCE);

  let settingsPage: EngagementSettingsPage;
  let browserPage: Page;

  test.beforeAll(async ({ browser }) => {
    browserPage = await browser.newPage();
    settingsPage = new EngagementSettingsPage(browserPage);
    await loginToSystem(browserPage, INSTANCE, "Admin");
    await expect(browserPage).toHaveURL(/dashboard|home/, { timeout: 30_000 });
  });

  test.afterAll(async () => {
    await browserPage.close();
  });

  // ── TC-001: Page loads ──────────────────────────────────────────────────────

  test("TC-001 | Engagement Settings page loads and root section is visible", async () => {
    await settingsPage.navigate(BASE_URL);
    await settingsPage.assertPageVisible();
    expect(browserPage.url()).toContain("/settings/engagement/settings");
  });

  // ── TC-002: Page heading ────────────────────────────────────────────────────

  test("TC-002 | Page heading 'Engagement Settings' is visible", async () => {
    await settingsPage.assertHeadingVisible();
    const headingText = await browserPage
      .locator(`[data-testid="${EngagementSettingsLocators.heading.testId}"]`)
      .innerText();
    expect(headingText.trim()).toContain("Engagement Settings");
  });

  // ── TC-003: Breadcrumbs ─────────────────────────────────────────────────────

  test("TC-003 | Breadcrumbs are visible and active breadcrumb is 'Additional Engage Settings'", async () => {
    const crumbs = await settingsPage.getAllBreadcrumbTexts();
    expect(crumbs.length).toBeGreaterThan(0);
    await settingsPage.assertActiveBreadcrumb("Additional Engage Settings");
  });

  // ── TC-004: Ribbon Save button ──────────────────────────────────────────────

  test("TC-004 | Ribbon Save button is visible and shows 'Save'", async () => {
    await settingsPage.assertSaveButtonVisible();
    const label = await browserPage
      .locator(`[data-testid="${EngagementSettingsLocators.ribbonSaveButton.testId}"]`)
      .innerText();
    expect(label.trim()).toBe("Save");
  });

  // ── TC-005: Settings form ───────────────────────────────────────────────────

  test("TC-005 | Settings form container and form element are visible", async () => {
    await settingsPage.assertFormVisible();
    await expect(
      browserPage.locator(
        `[data-testid="${EngagementSettingsLocators.formContainer.testId}"]`
      )
    ).toBeVisible();
  });

  // ── TC-006: Scale dropdown ──────────────────────────────────────────────────

  test("TC-006 | Scale Chosen dropdown is visible with a non-empty selection", async () => {
    await settingsPage.assertScaleDropdownVisible();
    const value = await settingsPage.getScaleValue();
    expect(value.length).toBeGreaterThan(0);
  });

  // ── TC-007: Primary Engagement Indicator ────────────────────────────────────

  test("TC-007 | Primary Engagement Indicator dropdown is visible with a valid selection", async () => {
    await settingsPage.assertIndicatorDropdownVisible();
    const value = await settingsPage.getPrimaryIndicatorValue();
    expect(["Happiness", "Moodometer", "Theme", "Custom Happiness"]).toContain(value);
  });

  // ── TC-008: Enable eNPS checkbox ────────────────────────────────────────────

  test("TC-008 | Enable eNPS checkbox is visible and has a defined checked state", async () => {
    await settingsPage.assertEnableNpsCheckboxVisible();
    const checked = await settingsPage.isEnableNpsChecked();
    expect(typeof checked).toBe("boolean");
  });

  // ── TC-009: Intelligent clustering fields ───────────────────────────────────

  test("TC-009 | Intelligent clustering Chosen multi-select is visible", async () => {
    await settingsPage.assertClusteringFieldsVisible();
  });

  // ── TC-010: Minimum attribute size input ────────────────────────────────────

  test("TC-010 | Minimum attribute size input is visible and has a numeric value", async () => {
    await settingsPage.assertMinSizeInputVisible();
    const value = await settingsPage.getMinSizeValue();
    expect(Number(value)).toBeGreaterThanOrEqual(1);
  });

  // ── TC-011: Dashboard Filters Chosen multi-select ───────────────────────────

  test("TC-011 | Dashboard Filters Chosen multi-select is visible", async () => {
    await settingsPage.assertFiltersDropdownVisible();
  });

  // ── TC-012: Score calculation settings section ──────────────────────────────

  test("TC-012 | Score calculation settings section and toggle button are visible", async () => {
    await settingsPage.assertScoreSettingsSectionVisible();
    await settingsPage.assertScoreSettingsToggleVisible();
  });

  // ── TC-013: Score settings accordion expanded by default ────────────────────

  test("TC-013 | Score calculation settings accordion body is expanded by default", async () => {
    const expanded = await settingsPage.isScoreSettingsExpanded();
    expect(expanded).toBe(true);
  });

  // ── TC-014: Response volume slider ──────────────────────────────────────────

  test("TC-014 | Response volume range slider is visible and has a valid value", async () => {
    await settingsPage.assertSliderVisible();
    const value = await settingsPage.getSliderValue();
    const numeric = parseFloat(value);
    expect(numeric).toBeGreaterThanOrEqual(0);
    expect(numeric).toBeLessThanOrEqual(1);
  });

  // ── TC-015: Slider value pill ────────────────────────────────────────────────

  test("TC-015 | Slider value pill displays a number between 0.0 and 1.0", async () => {
    const pill = await settingsPage.getSliderValuePillText();
    expect(pill.length).toBeGreaterThan(0);
    const numeric = parseFloat(pill);
    expect(numeric).toBeGreaterThanOrEqual(0);
    expect(numeric).toBeLessThanOrEqual(1);
  });

  // ── TC-016: Info modal panel in DOM ──────────────────────────────────────────

  test("TC-016 | Score calculation info modal outer wrapper and panel are present in DOM (hidden by default)", async () => {
    await settingsPage.assertInfoModalWrapperAttached();
    await settingsPage.assertInfoModalPanelAttached();
    // Verify the info button that opens it is also visible
    await expect(
      browserPage.locator(
        `[data-testid="${EngagementSettingsLocators.scoreSettingsInfoButton.testId}"]`
      )
    ).toBeVisible();
  });

  // ── TC-017: Native selects in DOM ────────────────────────────────────────────

  test("TC-017 | Native <select> elements for Scale, Indicator, Clustering and Filters are attached in DOM", async () => {
    await expect(
      browserPage.locator(
        `[data-testid="${EngagementSettingsLocators.scaleSelect.testId}"]`
      )
    ).toBeAttached();
    await expect(
      browserPage.locator(
        `[data-testid="${EngagementSettingsLocators.indicatorSelect.testId}"]`
      )
    ).toBeAttached();
    await expect(
      browserPage.locator(
        `[data-testid="${EngagementSettingsLocators.clusteringSelect.testId}"]`
      )
    ).toBeAttached();
    await expect(
      browserPage.locator(
        `[data-testid="${EngagementSettingsLocators.filtersSelect.testId}"]`
      )
    ).toBeAttached();
  });

  // ── TC-018: Survey Exclusion List section ─────────────────────────────────

  test("TC-018 | Survey Exclusion List section container is visible", async () => {
    await settingsPage.assertSurveyExclusionSectionVisible();
  });

  // ── TC-019: Survey Exclusion List native select ───────────────────────────

  test("TC-019 | Survey Exclusion List native <select> is attached in DOM with testId", async () => {
    await settingsPage.assertSurveyExclusionSelectAttached();
    await expect(
      browserPage.locator(
        `[data-testid="${EngagementSettingsLocators.surveyExclusionSelect.testId}"]`
      )
    ).toBeAttached();
  });

  // ── TC-020: Survey Exclusion List tooltip ─────────────────────────────────

  test("TC-020 | Survey Exclusion List tooltip (ⓘ) is visible and has a non-empty popover content", async () => {
    await settingsPage.assertSurveyExclusionTooltipVisible();
    const content = await settingsPage.getSurveyExclusionTooltipContent();
    expect(content).toContain("Surveys added to this list will not contribute");
  });

  // ── TC-021: Min size view tooltip ─────────────────────────────────────────

  test("TC-021 | Minimum attribute size tooltip (ⓘ) is visible", async () => {
    await settingsPage.assertMinSizeTooltipVisible();
    const content = await settingsPage.getMinSizeTooltipContent();
    expect(content.length).toBeGreaterThan(0);
  });

  // ── TC-022: Dashboard Filters tooltip ────────────────────────────────────

  test("TC-022 | Dashboard Filters tooltip (ⓘ) is visible", async () => {
    await settingsPage.assertFiltersTooltipVisible();
    const content = await settingsPage.getFiltersTooltipContent();
    expect(content.length).toBeGreaterThan(0);
  });
});
