import { expect, Locator as PlaywrightLocator } from "@playwright/test";
import { BasePage } from "../../base.page";
import { SurveyManagerDashboardApi } from "./api/survey-manager-dashboard.api";
import { Locator } from "../../common/locators/common";
import {
  DashboardSurveyMenuAction,
  LibraryLink,
  SurveyManagerDashboardLocators,
} from "./locators/survey-manager-dashboard";

export class SurveyManagerDashboardPage extends BasePage {
  // ── Navigation ────────────────────────────────────────────────────────────

  async navigate(baseUrl: string): Promise<void> {
    await this.goto(SurveyManagerDashboardApi.getDashboardUrl(baseUrl));
    await this.waitForPageReady();
  }

  // ── Readiness ─────────────────────────────────────────────────────────────

  async waitForPageReady(): Promise<void> {
    await expect(this.resolve(SurveyManagerDashboardLocators.page)).toBeVisible();
    await expect(this.resolve(SurveyManagerDashboardLocators.createSurveyButton)).toBeVisible();
    await expect(this.resolve(SurveyManagerDashboardLocators.statsSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerDashboardLocators.insightsSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerDashboardLocators.surveysSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerDashboardLocators.recommendedTemplatesSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerDashboardLocators.librariesSection)).toBeVisible();
  }

  // ── Header ────────────────────────────────────────────────────────────────

  async getHeaderTitle(): Promise<string> {
    return this.text(SurveyManagerDashboardLocators.headerTitle);
  }

  // ── Create Survey drawer ──────────────────────────────────────────────────

  async openCreateSurveyDrawer(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.createSurveyButton));
    await expect(this.resolve(SurveyManagerDashboardLocators.createSurveyDrawerForm)).toBeVisible();
  }

  async closeCreateSurveyDrawer(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.createSurveyCloseButton));
  }

  async cancelCreateSurvey(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.createSurveyCancelButton));
  }

  async proceedCreateSurvey(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.createSurveyProceedButton));
  }

  async fillCreateSurveyName(name: string): Promise<void> {
    await this.fill(this.resolve(SurveyManagerDashboardLocators.createSurveyNameInput), name);
  }

  async openResponseFormatDropdown(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.createSurveyResponseFormatDropdown));
  }

  async openMomentDropdown(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.createSurveyMomentDropdown));
  }

  async selectAdHocSurveyType(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.createSurveyAdHocTypeCard));
  }

  async selectBusinessProcessSurveyType(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.createSurveyBusinessProcessTypeCard));
  }

  // ── Insights section ──────────────────────────────────────────────────────

  async clickEngagementInsight(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.engagementInsightCard));
  }

  async getEngagementInsightText(): Promise<string> {
    return this.text(SurveyManagerDashboardLocators.engagementInsightCard);
  }

  async getPeopleAtRiskInsightText(): Promise<string> {
    return this.text(SurveyManagerDashboardLocators.peopleAtRiskInsightCard);
  }

  async getManagersEffectivenessInsightText(): Promise<string> {
    return this.text(SurveyManagerDashboardLocators.managersEffectivenessInsightCard);
  }

  /**
   * Returns true if the insight card at the given index is currently disabled
   * (i.e. carries a Coming Soon badge).
   */
  async isInsightCardComingSoon(index: 1 | 2): Promise<boolean> {
    const badge = this.resolve(SurveyManagerDashboardLocators.insightComingSoonBadge(index));
    return (await badge.count()) > 0 && badge.first().isVisible().catch(() => false);
  }

  // ── Survey widget – tabs ──────────────────────────────────────────────────

  async openPinnedSurveysTab(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.pinnedSurveysTab));
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  async openRecentSurveysTab(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.recentSurveysTab));
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  // ── Survey widget – rows ──────────────────────────────────────────────────

  async clickViewAllSurveys(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.surveysViewAllButton));
  }

  async waitForSurveyRows(): Promise<void> {
    await expect
      .poll(async () => this.getVisibleSurveyCount(), { timeout: 30_000 })
      .toBeGreaterThan(0);
  }

  async waitForSurveyRowVisible(surveyId: string): Promise<void> {
    await expect(this.resolve(SurveyManagerDashboardLocators.surveyRow(surveyId))).toBeVisible({
      timeout: 30_000,
    });
  }

  async getVisibleSurveyIds(): Promise<string[]> {
    const rows = this.resolve(SurveyManagerDashboardLocators.surveyRows);
    const count = await rows.count();
    const ids: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const row = rows.nth(index);
      if (!(await row.isVisible())) continue;

      const testId = await row.getAttribute("data-testid");
      if (testId) {
        ids.push(testId.replace("dbx-surveys-row-dashboard-survey-", ""));
      }
    }

    return ids;
  }

  async getVisibleSurveyCount(): Promise<number> {
    const rows = this.resolve(SurveyManagerDashboardLocators.surveyRows);
    const count = await rows.count();
    let visibleCount = 0;

    for (let index = 0; index < count; index += 1) {
      if (await rows.nth(index).isVisible()) visibleCount += 1;
    }

    return visibleCount;
  }

  async getSurveyRowText(surveyId: string): Promise<string> {
    return this.text(SurveyManagerDashboardLocators.surveyRow(surveyId));
  }

  async getFirstVisibleSurveyId(): Promise<string | null> {
    const rows = this.resolve(SurveyManagerDashboardLocators.surveyRows);
    const count = await rows.count();

    for (let index = 0; index < count; index += 1) {
      const row = rows.nth(index);
      if (await row.isVisible()) {
        const testId = await row.getAttribute("data-testid");
        return testId ? testId.replace("dbx-surveys-row-dashboard-survey-", "") : null;
      }
    }

    return null;
  }

  async getFirstActiveSurveyId(): Promise<string | null> {
    const rows = this.resolve(SurveyManagerDashboardLocators.surveyRows);
    const count = await rows.count();

    for (let index = 0; index < count; index += 1) {
      const row = rows.nth(index);
      const rowText = (await row.innerText()).replace(/\s+/g, " ").trim();
      if (!rowText.includes("Active")) continue;

      const testId = await row.getAttribute("data-testid");
      return testId ? testId.replace("dbx-surveys-row-dashboard-survey-", "") : null;
    }

    return null;
  }

  // ── Survey widget – row actions ───────────────────────────────────────────

  /**
   * Clicks the Resume button (visible on Draft surveys).
   */
  async clickSurveyResume(surveyId: string): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.surveyResumeButton(surveyId)));
  }

  /**
   * Clicks the Analyse button (visible on Active surveys).
   */
  async clickSurveyAnalyse(surveyId: string): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.surveyAnalyseButton(surveyId)));
  }

  /**
   * Clicks whichever primary action button is visible for the given survey.
   * Use `clickSurveyResume` or `clickSurveyAnalyse` when the status is known.
   */
  async clickSurveyPrimaryAction(surveyId: string): Promise<void> {
    const resumeLocator = this.resolve(SurveyManagerDashboardLocators.surveyResumeButton(surveyId));
    const analyseLocator = this.resolve(SurveyManagerDashboardLocators.surveyAnalyseButton(surveyId));

    if (await resumeLocator.isVisible().catch(() => false)) {
      await this.click(resumeLocator);
    } else {
      await this.click(analyseLocator);
    }
  }

  async clickSurveyPin(surveyId: string): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.surveyPinButton(surveyId)));
  }

  async openSurveyMenu(surveyId: string): Promise<void> {
    await this.resolve(SurveyManagerDashboardLocators.surveyRow(surveyId)).hover().catch(() => {});
    await this.click(this.resolve(SurveyManagerDashboardLocators.surveyMenuButton(surveyId)));
  }

  async waitForSurveyMenuItems(surveyId: string): Promise<void> {
    await expect
      .poll(
        async () => this.resolve(SurveyManagerDashboardLocators.surveyMenuItems(surveyId)).count(),
        { timeout: 2_000 }
      )
      .toBeGreaterThan(0);
  }

  async clickSurveyMenuAction(surveyId: string, action: DashboardSurveyMenuAction): Promise<void> {
    const actionLocator = this.resolve(this.menuActionLocator(action, surveyId));

    if ((await actionLocator.count()) > 0 && (await actionLocator.first().isVisible().catch(() => false))) {
      await this.click(actionLocator);
      return;
    }

    await this.openSurveyMenu(surveyId);
    await this.waitForSurveyMenuItems(surveyId);
    await this.click(this.resolve(this.menuActionLocator(action, surveyId)));
  }

  async getFirstVisibleSurveyIdWithMenuAction(
    action: DashboardSurveyMenuAction,
    candidateSurveyIds?: string[]
  ): Promise<string | null> {
    const surveyIds = candidateSurveyIds ?? (await this.getVisibleSurveyIds());

    for (const surveyId of surveyIds) {
      await this.openSurveyMenu(surveyId);
      await this.waitForSurveyMenuItems(surveyId).catch(() => {});
      const loc = this.resolve(this.menuActionLocator(action, surveyId));

      if ((await loc.count()) > 0 && (await loc.first().isVisible().catch(() => false))) {
        return surveyId;
      }
    }

    return null;
  }

  // ── Recommended templates ─────────────────────────────────────────────────

  async clickRecommendedTemplate(templateId: string): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.recommendedTemplateCard(templateId)));
  }

  async getVisibleRecommendedTemplateIds(): Promise<string[]> {
    const cards = this.resolve(SurveyManagerDashboardLocators.recommendedTemplateCards);
    const count = await cards.count();
    const ids: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const testId = await cards.nth(index).getAttribute("data-testid");
      if (testId) {
        ids.push(testId.replace("dbx-surveys-card-recommended-template-", ""));
      }
    }

    return ids;
  }

  // ── Libraries widget ──────────────────────────────────────────────────────

  async clickLibrariesViewAll(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDashboardLocators.librariesViewAllButton));
  }

  async clickLibraryLink(link: LibraryLink): Promise<void> {
    await this.click(this.resolve(this.libraryLinkLocator(link)));
  }

  // ── Assertions (UI-only) ──────────────────────────────────────────────────

  async assertPageVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerDashboardLocators.page)).toBeVisible();
  }

  async assertStatsSectionVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerDashboardLocators.statsSection)).toBeVisible();
  }

  async assertInsightsSectionVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerDashboardLocators.insightsSection)).toBeVisible();
  }

  async assertSurveysSectionVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerDashboardLocators.surveysSection)).toBeVisible();
  }

  async assertTemplatesSectionVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerDashboardLocators.recommendedTemplatesSection)).toBeVisible();
  }

  async assertLibrariesSectionVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerDashboardLocators.librariesSection)).toBeVisible();
  }

  async assertCreateSurveyDrawerVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerDashboardLocators.createSurveyDrawerForm)).toBeVisible();
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private resolve(locator: Locator): PlaywrightLocator {
    const selector = locator.testId.trim();
    if (selector.startsWith("dbx-")) {
      return this.page.locator(`[data-testid=${JSON.stringify(selector)}]`);
    }
    return this.page.locator(selector);
  }

  private async text(locator: Locator): Promise<string> {
    return (await this.resolve(locator).innerText()).replace(/\s+/g, " ").trim();
  }

  private libraryLinkLocator(link: LibraryLink): Locator {
    const map: Record<LibraryLink, Locator> = {
      templates: SurveyManagerDashboardLocators.librariesTemplatesLink,
      questionBank: SurveyManagerDashboardLocators.librariesQuestionBankLink,
      themes: SurveyManagerDashboardLocators.librariesThemesLink,
      subThemes: SurveyManagerDashboardLocators.librariesSubThemesLink,
      benchmarks: SurveyManagerDashboardLocators.librariesBenchmarksLink,
      actionPlan: SurveyManagerDashboardLocators.librariesActionPlanLink,
    };
    return map[link];
  }

  private menuActionLocator(action: DashboardSurveyMenuAction, surveyId: string): Locator {
    const map: Record<DashboardSurveyMenuAction, Locator> = {
      viewDetails: SurveyManagerDashboardLocators.surveyMenuViewDetails(surveyId),
      editConfigurations: SurveyManagerDashboardLocators.surveyMenuEditConfigurations(surveyId),
      editClosureDateTime: SurveyManagerDashboardLocators.surveyMenuEditClosureDateTime(surveyId),
      deactivate: SurveyManagerDashboardLocators.surveyMenuDeactivate(surveyId),
      duplicate: SurveyManagerDashboardLocators.surveyMenuDuplicate(surveyId),
      delete: SurveyManagerDashboardLocators.surveyMenuDelete(surveyId),
      updateSurveyForm: SurveyManagerDashboardLocators.surveyMenuUpdateSurveyForm(surveyId),
      replaceSurveyForm: SurveyManagerDashboardLocators.surveyMenuReplaceSurveyForm(surveyId),
    };
    return map[action];
  }
}
