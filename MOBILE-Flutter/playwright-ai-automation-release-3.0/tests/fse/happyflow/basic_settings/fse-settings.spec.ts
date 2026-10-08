import { test, expect, Page } from "@playwright/test";
import { loginToSystem } from "../../../../src/helpers/login";
import { waitForNetworkApis } from "../../../../src/helpers/network";
import { TopBarPage } from "../../../../src/pages/common/topbar.page";
import { SettingsLocators } from "../../../../src/pages/common/locators/settings";

test.describe.configure({ mode: "serial", timeout: 180_000 });

/**
 * @module FSE
 * @feature FSE Settings Validation
 * @description Validates that all FSE-related settings are accessible via topbar search.
 *   - Survey Forms
 *   - Survey Manager
 *   - Survey Pillar
 *   - Additional Engagement Settings
 *   - Action Plan Library
 */
test.describe("@fse-settings FSE Settings Validation", () => {
  let page: Page;
  let topBarPage: TopBarPage;

  const INSTANCE = process.env.INSTANCE ?? "";

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    topBarPage = new TopBarPage(page);
    await loginToSystem(page, INSTANCE, "Admin");
    await waitForNetworkApis(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("TC-001: should verify all FSE settings exist in dashboard", async () => {
    await waitForNetworkApis(page);
    await expect(topBarPage.searchInput).toBeVisible();

    // Survey Forms
    await topBarPage.searchSetting(
      "Survey Forms",
      SettingsLocators.surveyForms.testId,
      false
    );
    await expect(
      page.getByTestId(SettingsLocators.surveyForms.testId)
    ).toBeVisible({ timeout: 30_000 });

    // Survey Manager
    await topBarPage.searchSetting(
      "Survey Manager",
      SettingsLocators.surveyManager.testId,
      false
    );
    await expect(
      page.getByTestId(SettingsLocators.surveyManager.testId)
    ).toBeVisible({ timeout: 30_000 });

    // Survey Pillar
    await topBarPage.searchSetting(
      "Survey Pillar",
      SettingsLocators.pillar.testId,
      false
    );
    await expect(
      page.getByTestId(SettingsLocators.pillar.testId)
    ).toBeVisible({ timeout: 30_000 });

    // Additional Engagement Settings
    await topBarPage.searchSetting(
      "Additional Engage",
      SettingsLocators.engagementSettings.testId,
      false
    );
    await expect(
      page.getByTestId(SettingsLocators.engagementSettings.testId)
    ).toBeVisible({ timeout: 30_000 });

    // Action Plan Library
    await topBarPage.searchSetting(
      "Action Plan",
      SettingsLocators.actionplansuggestions.testId,
      false
    );
    await expect(
      page.getByTestId(SettingsLocators.actionplansuggestions.testId)
    ).toBeVisible({ timeout: 30_000 });
  });
});
