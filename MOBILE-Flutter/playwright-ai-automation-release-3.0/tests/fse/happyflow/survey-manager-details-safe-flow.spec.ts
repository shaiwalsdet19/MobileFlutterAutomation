import { expect, Page, test } from "@playwright/test";
import { loginToSystem } from "../../../src/helpers/login";
import { getBaseUrl } from "../../../data/instances";
import { SurveyManagerDashboardApi } from "../../../src/pages/fse/api/survey-manager-dashboard.api";
import { SurveyManagerDashboardPage } from "../../../src/pages/fse/survey-manager-dashboard.page";
import { SurveyManagerDetailsApi } from "../../../src/pages/fse/api/survey-manager-details.api";
import { SurveyManagerDetailsPage } from "../../../src/pages/fse/survey-manager-details.page";

test.describe.configure({ mode: "serial", timeout: 180_000 });

const INSTANCE = "forms1";
const BASE_URL = getBaseUrl(INSTANCE);

async function openFirstActiveSurveyDetails(
  page: Page,
  dashboardPage: SurveyManagerDashboardPage
): Promise<string> {
  const [, , , , initialRecentSurveyListResponse] = await Promise.all([
    SurveyManagerDashboardApi.waitForAllowedActions(page),
    SurveyManagerDashboardApi.waitForAllData(page),
    SurveyManagerDashboardApi.waitForSurveySettings(page),
    SurveyManagerDashboardApi.waitForDashboardStats(page),
    SurveyManagerDashboardApi.waitForRecentSurveyList(page),
    dashboardPage.navigate(BASE_URL),
  ]);
  const recentPayload = await SurveyManagerDashboardApi.parseSurveyList(initialRecentSurveyListResponse);

  await expect(await dashboardPage.getHeaderTitle()).toBe("Survey & Engagement");
  await dashboardPage.waitForSurveyRows();

  await dashboardPage.openRecentSurveysTab();
  await dashboardPage.waitForSurveyRows();
  const recentVisibleIds = await dashboardPage.getVisibleSurveyIds();
  const recentApiCandidates = recentPayload.data
    .filter((survey) => !SurveyManagerDashboardApi.isDraftSurvey(survey))
    .map((survey) => survey.id)
    .filter((visibleId) => recentVisibleIds.includes(visibleId));
  let surveyId = await dashboardPage.getFirstVisibleSurveyIdWithMenuAction(
    "viewDetails",
    recentApiCandidates.length > 0 ? recentApiCandidates : recentVisibleIds
  );

  if (!surveyId) {
    await dashboardPage.openPinnedSurveysTab();
    await dashboardPage.waitForSurveyRows();
    const pinnedVisibleIds = await dashboardPage.getVisibleSurveyIds();
    surveyId = await dashboardPage.getFirstVisibleSurveyIdWithMenuAction("viewDetails", pinnedVisibleIds);
  }

  expect(surveyId, "Expected a visible survey row with View Details in Recent or Pinned Surveys").toBeTruthy();
  const resolvedSurveyId = surveyId as string;
  await dashboardPage.waitForSurveyRowVisible(resolvedSurveyId);

  const waitForChannels = SurveyManagerDetailsApi.waitForChannels(page);
  await dashboardPage.clickSurveyMenuAction(resolvedSurveyId, "viewDetails");

  await expect(page).toHaveURL(SurveyManagerDetailsApi.getDetailsUrl(BASE_URL, resolvedSurveyId), {
    timeout: 30_000,
  });
  await waitForChannels;

  return resolvedSurveyId;
}

test.describe("@fse-survey-manager-details Survey Manager Details", () => {
  let page: Page;
  let dashboardPage: SurveyManagerDashboardPage;
  let detailsPage: SurveyManagerDetailsPage;

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
    dashboardPage = new SurveyManagerDashboardPage(page);
    detailsPage = new SurveyManagerDetailsPage(page);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("TC-002: Admin should validate safe details page actions without mutating survey state", async () => {
    await loginToSystem(page, INSTANCE, "Admin");
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });

    const surveyId = await openFirstActiveSurveyDetails(page, dashboardPage);

    await detailsPage.waitForPageReady();
    expect(await detailsPage.getSurveyName()).not.toBe("");

    const summaryText = await detailsPage.getSummaryText();
    expect(summaryText).toContain("Survey Details");

    await detailsPage.waitForAddChannelButton();

    await detailsPage.openDeactivateDialog();
    await detailsPage.waitForDeactivateDialogMessage();
    await detailsPage.cancelDeactivate();
    await detailsPage.waitForDeactivateDialogClosed();

    await detailsPage.openMoreOptions();
    await detailsPage.waitForMoreOptionsActionVisible("preview");
    await detailsPage.waitForMoreOptionsActionVisible("duplicate");

    await detailsPage.clickBack();
    await expect(page).toHaveURL(SurveyManagerDashboardApi.getDashboardUrl(BASE_URL), { timeout: 30_000 });
    await dashboardPage.waitForPageReady();
    await dashboardPage.waitForSurveyRows();
  });
});
