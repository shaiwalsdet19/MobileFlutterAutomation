import { expect, Page, test } from "@playwright/test";
import { loginToSystem } from "../../../src/helpers/login";
import { getBaseUrl } from "../../../data/instances";
import { SurveyManagerDashboardApi } from "../../../src/pages/fse/api/survey-manager-dashboard.api";
import { SurveyManagerDetailsApi } from "../../../src/pages/fse/api/survey-manager-details.api";
import { SurveyManagerDashboardPage } from "../../../src/pages/fse/survey-manager-dashboard.page";
import { SurveyManagerDetailsPage } from "../../../src/pages/fse/survey-manager-details.page";

test.describe.configure({ mode: "serial", timeout: 180_000 });

const INSTANCE = "forms1";
const BASE_URL = getBaseUrl(INSTANCE);

async function getSurveyIdWithViewDetails(
  page: Page,
  dashboardPage: SurveyManagerDashboardPage,
  recentSurveyListResponse: Awaited<ReturnType<typeof SurveyManagerDashboardApi.waitForRecentSurveyList>>
): Promise<{ surveyId: string | null; sourceTab: "recent" | "pinned" | null }> {
  const recentPayload = await SurveyManagerDashboardApi.parseSurveyList(recentSurveyListResponse);

  await dashboardPage.openRecentSurveysTab();
  await dashboardPage.waitForSurveyRows();
  const recentSurveyCount = await dashboardPage.getVisibleSurveyCount();
  expect(recentSurveyCount).toBeGreaterThan(0);
  const recentVisibleIds = await dashboardPage.getVisibleSurveyIds();
  const recentApiCandidates = recentPayload.data
    .filter((survey) => !SurveyManagerDashboardApi.isDraftSurvey(survey))
    .map((survey) => survey.id)
    .filter((surveyId) => recentVisibleIds.includes(surveyId));

  const recentSurveyId = await dashboardPage.getFirstVisibleSurveyIdWithMenuAction(
    "viewDetails",
    recentApiCandidates.length > 0 ? recentApiCandidates : recentVisibleIds
  );
  if (recentSurveyId) {
    return { surveyId: recentSurveyId, sourceTab: "recent" };
  }

  await dashboardPage.openPinnedSurveysTab();
  await dashboardPage.waitForSurveyRows();
  const pinnedVisibleIds = await dashboardPage.getVisibleSurveyIds();
  const pinnedSurveyId = await dashboardPage.getFirstVisibleSurveyIdWithMenuAction(
    "viewDetails",
    pinnedVisibleIds
  );
  if (pinnedSurveyId) {
    return { surveyId: pinnedSurveyId, sourceTab: "pinned" };
  }

  return { surveyId: null, sourceTab: null };
}

test.describe("@fse-survey-manager-dashboard Survey Manager Dashboard", () => {
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

  test("TC-001: Admin should open dashboard and view active survey details", async () => {
    await loginToSystem(page, INSTANCE, "Admin");
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });

    const [, , , , recentSurveyListResponse] = await Promise.all([
      SurveyManagerDashboardApi.waitForAllowedActions(page),
      SurveyManagerDashboardApi.waitForAllData(page),
      SurveyManagerDashboardApi.waitForSurveySettings(page),
      SurveyManagerDashboardApi.waitForDashboardStats(page),
      SurveyManagerDashboardApi.waitForRecentSurveyList(page),
      dashboardPage.navigate(BASE_URL),
    ]);

    await expect(await dashboardPage.getHeaderTitle()).toBe("Survey & Engagement");
    await dashboardPage.waitForSurveyRows();

    const { surveyId, sourceTab } = await getSurveyIdWithViewDetails(
      page,
      dashboardPage,
      recentSurveyListResponse
    );
    expect(surveyId, "Expected a visible survey row with View Details in Recent or Pinned Surveys").toBeTruthy();
    const resolvedSurveyId = surveyId as string;

    if (sourceTab === "recent") {
      await dashboardPage.openRecentSurveysTab();
    } else if (sourceTab === "pinned") {
      await dashboardPage.openPinnedSurveysTab();
    }

    const visibleSurveyIds = await dashboardPage.getVisibleSurveyIds();
    expect(visibleSurveyIds.length).toBeGreaterThan(0);
    const activeSurveyTitle = await dashboardPage.getSurveyRowText(resolvedSurveyId);
    expect(visibleSurveyIds).toContain(resolvedSurveyId);

    const waitForChannels = SurveyManagerDetailsApi.waitForChannels(page);
    await dashboardPage.clickSurveyMenuAction(resolvedSurveyId, "viewDetails");
    await expect(page).toHaveURL(SurveyManagerDetailsApi.getDetailsUrl(BASE_URL, resolvedSurveyId), {
      timeout: 30_000,
    });
    await waitForChannels;

    await detailsPage.waitForPageReady();
    expect(await detailsPage.getSurveyName()).not.toBe("");
    expect(activeSurveyTitle).toContain(await detailsPage.getSurveyName());

    const summaryText = await detailsPage.getSummaryText();
    expect(summaryText).toContain("Survey Details");
    expect(summaryText).toContain("Survey Title");

    await detailsPage.waitForAddChannelButton();
  });
});
