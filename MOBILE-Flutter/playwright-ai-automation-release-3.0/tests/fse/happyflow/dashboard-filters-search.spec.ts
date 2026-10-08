import { expect, Page, test } from "@playwright/test";
import { getBaseUrl } from "../../../data/instances";
import { loginToSystem } from "../../../src/helpers/login";
import { EngagementSettingsApi } from "../../../src/pages/fse/api/engagement-settings.api";
import { EngagementSettingsPage } from "../../../src/pages/fse/engagement-settings.page";
import { EngagementSettingsLocators } from "../../../src/pages/fse/locators/engagement-settings";



test.describe.configure({ mode: "serial", timeout: 180_000 });

const INSTANCE = process.env.INSTANCE ?? "forms1";
const BASE_URL = getBaseUrl(INSTANCE);
const SEARCH_VALUE = "L1 Manager";

test.describe("@fse-engagement-settings Dashboard Filters Search", () => {
  let page: Page;
  let engagementSettingsPage: EngagementSettingsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    engagementSettingsPage = new EngagementSettingsPage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("TC-001: should search for L1 Manager in Customize Fields in Dashboard Filters", async () => {
    await loginToSystem(page, INSTANCE, "Admin");
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });

    await Promise.all([
      EngagementSettingsApi.waitForSettingsActivity(page),
      EngagementSettingsApi.waitForEngagementSettings(page),
      engagementSettingsPage.navigate(BASE_URL),
    ]);

    engagementSettingsPage.inputs.searchDropdown(EngagementSettingsLocators.dashboardFiltersSearchInput, SEARCH_VALUE);
    await expect(await engagementSettingsPage.inputs.listOfOptionsAvalible(EngagementSettingsLocators.dashboardFiltersChosenContainer, SEARCH_VALUE)).toBeGreaterThan(0);
  });
});
