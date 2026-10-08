import { test, expect, Locator, Page } from "@playwright/test";
import { loginToSystem } from "../../global/helpers/login";
import { getBaseUrl } from "../../global/instances";
import { TopBarPage } from "../../pages/common/topbar.page";
import { TenantProvisioningSurveysApi } from "../../pages/common/api/tenant-provisioning-surveys.api";
import { TenantProvisioningSurveysLocators } from "../../pages/common/locators/tenant-provisioning-surveys";
import { SidebarAppLocators } from "../../pages/common/locators/topbar";

test.describe.configure({ mode: "serial", timeout: 180_000 });

/**
 * @module FSE
 * @feature Survey Enable Toggle
 * @description Validates that toggling "Enable Survey" on the tenant provisioning page
 *   controls the visibility of "Survey Manager" in the sidebar apps menu.
 *
 *   - TC-001: Disable "Enable Survey" → logout → login → Survey Manager must NOT appear.
 *   - TC-002: Enable "Enable Survey" → logout → login → Survey Manager MUST appear.
 */
test.describe("@fse-survey-toggle Survey Enable Toggle - Tenant Provisioning", () => {
  let page: Page;
  let topBarPage: TopBarPage;

  const INSTANCE = "forms1";
  const BASE_URL = getBaseUrl(INSTANCE);

  /**
   * Resolves the "Enable Surveys" checkbox using the data-testid when available,
   * and falls back to an XPath text-based lookup for instances where the attribute is absent.
   */
  function enableSurveysCheckbox(): Locator {
    const byTestId = page.getByTestId(TenantProvisioningSurveysLocators.enableSurveysCheckbox.testId);
    const byLabel = page.locator(
      'xpath=//input[@type="checkbox"][following-sibling::*[normalize-space()="Enable Surveys"]]'
    );
    return byTestId.or(byLabel);
  }

  /** Navigates to the tenant provisioning page and opens the Survey section. */
  async function openSurveySection(): Promise<void> {
    const response = await page.goto(TenantProvisioningSurveysApi.getPageUrl(BASE_URL));
    if (!TenantProvisioningSurveysApi.isTenantProvisioningResponse(response)) {
      throw new Error("Tenant provisioning page did not load successfully.");
    }

    await page.waitForURL(/\/settings\/employees\/tenantprovisioning/, { timeout: 30_000 });

    // Wait for the search settings input and save button to confirm the page is ready
    await expect(page.locator(TenantProvisioningSurveysLocators.searchSettingsInput.testId)).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.locator(TenantProvisioningSurveysLocators.saveSettingsButton.testId)).toBeVisible({
      timeout: 30_000,
    });

    // Click the "Survey" category link in the left-side navigation list to open survey settings
    const surveyNavLink = page.getByRole("link", { name: /^Survey\s*\d*$/ });
    if (await surveyNavLink.isVisible({ timeout: 5_000 }).catch(() => false)) {
      await surveyNavLink.click();
    }

    // Wait for the Enable Surveys checkbox (by testId or by label text)
    await expect(enableSurveysCheckbox().first()).toBeVisible({ timeout: 30_000 });
  }

  /** Returns the current checked state of the Enable Surveys checkbox. */
  async function isEnableSurveysChecked(): Promise<boolean> {
    return enableSurveysCheckbox().first().isChecked();
  }

  /** Sets the Enable Surveys checkbox to the desired state and saves. */
  async function setEnableSurveys(checked: boolean): Promise<void> {
    await enableSurveysCheckbox().first().setChecked(checked, { force: true });

    const saveResponse = TenantProvisioningSurveysApi.waitForSave(page);
    await page.locator(TenantProvisioningSurveysLocators.saveSettingsButton.testId).click();
    await saveResponse;
  }

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    topBarPage = new TopBarPage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("TC-001: Disable Enable Survey → Survey Manager should NOT exist in sidebar", async () => {
    // Step 1: Login as Admin
    await loginToSystem(page, INSTANCE, "Admin");
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });

    // Step 2: Navigate to tenant provisioning and open survey section
    await openSurveySection();

    // Step 3: Disable "Enable Survey" only if it is currently enabled
    if (await isEnableSurveysChecked()) {
      await setEnableSurveys(false);
    }

    // Step 4: Logout
    await topBarPage.logout();
    await expect(page).toHaveURL(/login/, { timeout: 30_000 });

    // Step 5: Login again
    await loginToSystem(page, INSTANCE, "Admin");
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });

    // Step 6: Open sidebar apps and assert Survey Manager is NOT visible
    await topBarPage.toggleSidebarApps();
    await expect(
      page.getByTestId(SidebarAppLocators.surveyManagerAdmin.testId)
    ).not.toBeVisible({ timeout: 15_000 });
  });

  test("TC-002: Enable Enable Survey → Survey Manager SHOULD exist in sidebar", async () => {
    // Step 1: Navigate to tenant provisioning and open survey section (already logged in)
    await openSurveySection();

    // Step 2: Enable "Enable Survey" only if it is currently disabled
    if (!(await isEnableSurveysChecked())) {
      await setEnableSurveys(true);
    }

    // Step 3: Logout
    await topBarPage.logout();
    await expect(page).toHaveURL(/login/, { timeout: 30_000 });

    // Step 4: Login again
    await loginToSystem(page, INSTANCE, "Admin");
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });

    // Step 5: Open sidebar apps and assert Survey Manager IS visible
    await topBarPage.toggleSidebarApps();
    await expect(
      page.getByTestId(SidebarAppLocators.surveyManagerAdmin.testId)
    ).toBeVisible({ timeout: 15_000 });
  });
});
