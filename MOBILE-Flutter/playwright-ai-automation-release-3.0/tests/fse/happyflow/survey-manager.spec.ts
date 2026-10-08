import { test, expect, Page } from "@playwright/test";
import { loginToSystem } from "../../../src/helpers/login";
import { TopBarPage } from "../../../src/pages/common/topbar.page";
import { SidebarAppLocators } from "../../../src/pages/common/locators/topbar";

test.describe.configure({ mode: "serial", timeout: 180_000 });

/**
 * @module FSE
 * @feature Survey Manager Navigation
 * @description Validates navigation to Survey Manager from sidebar.
 *   - TC-001: Verifies admin can navigate to Survey Manager via sidebar apps menu.
 */
test.describe("@fse-flow Survey Manager Navigation", () => {
  let page: Page;
  let topBarPage: TopBarPage;

  const INSTANCE = process.env.INSTANCE ?? "";

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    topBarPage = new TopBarPage(page);
    await loginToSystem(page, INSTANCE, "Admin");
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("TC-001: should navigate to Survey Manager", async () => {
    await topBarPage.navigateToApp(SidebarAppLocators.surveyManagerAdmin.testId);

    await expect(page).toHaveURL(/survey-manager/, { timeout: 30_000 });
  });
});
