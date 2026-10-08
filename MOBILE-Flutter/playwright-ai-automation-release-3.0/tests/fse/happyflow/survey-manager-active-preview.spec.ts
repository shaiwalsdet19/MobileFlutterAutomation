import { expect, Page, test } from "@playwright/test";
import { loginToSystem } from "../../../src/helpers/login";
import { getBaseUrl } from "../../../data/instances";
import { TopBarPage } from "../../../src/pages/common/topbar.page";
import { SidebarAppLocators } from "../../../src/pages/common/locators/topbar";
import { SurveyManagerDashboardPage } from "../../../src/pages/fse/survey-manager-dashboard.page";
import { SurveyManagerDetailsPage } from "../../../src/pages/fse/survey-manager-details.page";
import { SurveyManagerDetailsApi } from "../../../src/pages/fse/api/survey-manager-details.api";

test.describe.configure({ mode: "serial", timeout: 180_000 });

const INSTANCE = "forms1";
const BASE_URL = getBaseUrl(INSTANCE);

async function getFirstActiveRecentSurveyId(
  page: Page,
  dashboardPage: SurveyManagerDashboardPage
): Promise<string> {
  await dashboardPage.openRecentSurveysTab();
  await dashboardPage.waitForSurveyRows();

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const surveyId = await dashboardPage.getFirstActiveSurveyId();
    if (surveyId) {
      return surveyId;
    }

    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(500);
  }

  throw new Error("Expected at least one active survey in Recent Surveys");
}

test.describe("@fse-survey-preview Active Survey Preview", () => {
  let page: Page;
  let topBarPage: TopBarPage;
  let dashboardPage: SurveyManagerDashboardPage;
  let detailsPage: SurveyManagerDetailsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    topBarPage = new TopBarPage(page);
    dashboardPage = new SurveyManagerDashboardPage(page);
    detailsPage = new SurveyManagerDetailsPage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("TC-003: Admin should open preview for an active recent survey", async () => {
    await loginToSystem(page, INSTANCE, "Admin");
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });

    await topBarPage.navigateToApp(SidebarAppLocators.employeeEngagement.testId);
    await dashboardPage.waitForPageReady();

    const surveyId = await getFirstActiveRecentSurveyId(page, dashboardPage);
    const activeSurveyRowText = await dashboardPage.getSurveyRowText(surveyId);
    expect(activeSurveyRowText).toContain("Active");

    const waitForChannels = SurveyManagerDetailsApi.waitForChannels(page);
    await dashboardPage.clickSurveyMenuAction(surveyId, "viewDetails");

    const detailsUrl = SurveyManagerDetailsApi.getDetailsUrl(BASE_URL, surveyId);
    await expect(page).toHaveURL(detailsUrl, { timeout: 30_000 });
    await waitForChannels;

    await detailsPage.waitForPageReady();
    await detailsPage.waitForMoreOptionsActionVisible("preview");

    const previewPopupPromise = page.context().waitForEvent("page", { timeout: 10_000 }).catch(() => null);
    const sameTabNavigationPromise = page
      .waitForURL((url) => url.toString() !== detailsUrl, { timeout: 10_000 })
      .then(() => true)
      .catch(() => false);

    await detailsPage.clickMoreOptionsAction("preview");

    const previewOutcome = await Promise.race([
      previewPopupPromise.then((previewPage) => (previewPage ? { type: "popup" as const, previewPage } : null)),
      sameTabNavigationPromise.then((didNavigate) => (didNavigate ? { type: "same-tab" as const } : null)),
      page.waitForTimeout(10_000).then(() => null),
    ]);

    expect(
      previewOutcome,
      "Expected Preview to either open in a new page or navigate away from the survey details page"
    ).not.toBeNull();

    if (previewOutcome?.type === "popup") {
      await previewOutcome.previewPage.waitForLoadState("domcontentloaded");
      await expect(previewOutcome.previewPage).not.toHaveURL(detailsUrl);
      await previewOutcome.previewPage.close();
    } else {
      await expect(page).not.toHaveURL(detailsUrl);
    }
  });
});
