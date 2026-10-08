import { expect, Page, test } from "@playwright/test";
import { getBaseUrl } from "../../../data/instances";
import { loginToSystem } from "../../../src/helpers/login";
import { waitForNetworkApis } from "../../../src/helpers/network";
import { LoginLocators } from "../../../src/pages/common/locators/common";
import { SettingsLocators } from "../../../src/pages/common/locators/settings";
import { TenantProvisioningSurveysPage } from "../../../src/pages/common/tenant-provisioning-surveys.page";
import { TopBarPage } from "../../../src/pages/common/topbar.page";

test.describe.configure({ mode: "serial", timeout: 180_000 });

const INSTANCE = process.env.INSTANCE ?? "forms1";
const BASE_URL = getBaseUrl(INSTANCE);

async function loginAsAdmin(page: Page): Promise<void> {
  await loginToSystem(page, INSTANCE, "Admin");
  await waitForNetworkApis(page);
  await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });
}

async function logoutAndLoginAgain(page: Page, topBarPage: TopBarPage): Promise<void> {
  await topBarPage.logout();
  await expect(page.getByTestId(LoginLocators.usernameInput.testId)).toBeVisible({
    timeout: 30_000,
  });
  await loginAsAdmin(page);
}

async function expectSurveyManagerSearchResult(
  page: Page,
  topBarPage: TopBarPage,
  shouldExist: boolean
): Promise<void> {
  const surveyManagerResult = page.getByTestId(SettingsLocators.surveyManager.testId);

  await waitForNetworkApis(page);
  await expect(topBarPage.searchInput).toBeVisible({ timeout: 30_000 });
  await topBarPage.searchInput.fill("");
  await topBarPage.searchInput.fill("Survey Manager");

  if (shouldExist) {
    await expect(surveyManagerResult).toHaveCount(1);
    await expect(surveyManagerResult).toBeVisible({ timeout: 30_000 });
    return;
  }

  await expect(surveyManagerResult).toHaveCount(0);
}

async function setEnableSurveys(
  tenantProvisioningPage: TenantProvisioningSurveysPage,
  enabled: boolean
): Promise<void> {
  await tenantProvisioningPage.navigate(BASE_URL);

  const isCurrentlyEnabled = await tenantProvisioningPage.isEnableSurveysChecked();
  if (isCurrentlyEnabled === enabled) {
    return;
  }

  await tenantProvisioningPage.setEnableSurveys(enabled);
  const saveResponse = await tenantProvisioningPage.saveSettings();
  expect(saveResponse.ok()).toBeTruthy();
}

test.describe("@fse-settings Survey Manager tenant provisioning visibility", () => {
  let page: Page;
  let topBarPage: TopBarPage;
  let tenantProvisioningPage: TenantProvisioningSurveysPage;
  let originalEnableSurveysState = true;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    topBarPage = new TopBarPage(page);
    tenantProvisioningPage = new TenantProvisioningSurveysPage(page);

    await loginAsAdmin(page);
    await tenantProvisioningPage.navigate(BASE_URL);
    originalEnableSurveysState = await tenantProvisioningPage.isEnableSurveysChecked();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("TC-001: should hide and restore Survey Manager when Enable Surveys is toggled", async () => {
    try {
      await test.step('Disable "Enable Surveys" and validate Survey Manager is hidden after relogin', async () => {
        await setEnableSurveys(tenantProvisioningPage, false);
        await logoutAndLoginAgain(page, topBarPage);
        await expectSurveyManagerSearchResult(page, topBarPage, false);
      });

      await test.step('Enable "Enable Surveys" and validate Survey Manager is visible after relogin', async () => {
        await setEnableSurveys(tenantProvisioningPage, true);
        await logoutAndLoginAgain(page, topBarPage);
        await expectSurveyManagerSearchResult(page, topBarPage, true);
      });
    } finally {
      await loginAsAdmin(page);
      await setEnableSurveys(tenantProvisioningPage, originalEnableSurveysState);
    }
  });
});
