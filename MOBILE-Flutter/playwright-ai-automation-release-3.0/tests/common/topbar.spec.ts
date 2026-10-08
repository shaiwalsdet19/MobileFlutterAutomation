import { test, expect, Page } from "@playwright/test";
import { loginToSystem } from "../../src/helpers/login";
import { TopBarPage } from "../../src/pages/common/topbar.page";
import { SettingsLocators } from "../../src/pages/common/locators/settings";

test.describe.configure({ mode: "serial", timeout: 180_000 });

/**
 * @module Common
 * @feature TopBar Search Functionality
 * @description Validates topbar search navigation for Darwinbox system.
 *   - TC-001: Verifies admin can search and navigate to Additional Engagement Settings.
 */
test.describe("@common-topbar TopBar Search Functionality", () => {
  let page: Page;
  let topBarPage: TopBarPage;

  const INSTANCE = process.env.INSTANCE ?? '';

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    topBarPage = new TopBarPage(page);
    await loginToSystem(page, INSTANCE, "Admin");
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("TC-001: should search and navigate to Additional Engagement Settings", async () => {
    await topBarPage.searchSetting("Additional Engage Sett", SettingsLocators.engagementSettings.testId);

    await expect(page.getByTestId(SettingsLocators.engagementSettings.testId)).toBeVisible({ timeout: 30_000 });
  });
});
