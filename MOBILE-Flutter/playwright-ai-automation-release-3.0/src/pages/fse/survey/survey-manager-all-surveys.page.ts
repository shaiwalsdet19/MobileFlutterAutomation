import { expect, Locator as PlaywrightLocator } from "@playwright/test";
import { BasePage } from "../../base.page";
import { Locator } from "../../common/locators/common";
import { SurveyManagerAllSurveysApi } from "./api/survey-manager-all-surveys.api";
import {
  ContextMenuLabels,
  SurveyContextMenuAction,
  SurveyManagerAllSurveysLocators,
  SurveyRowAction,
  SurveyTypeTab,
  SurveyTypeTabLabels,
} from "./locators/survey-manager-all-surveys";

export class SurveyManagerAllSurveysPage extends BasePage {
  // ── Navigation ────────────────────────────────────────────────────────────

  async navigate(baseUrl: string): Promise<void> {
    await this.goto(SurveyManagerAllSurveysApi.getPageUrl(baseUrl));
    await this.waitForPageReady();
  }

  // ── Readiness ─────────────────────────────────────────────────────────────

  async waitForPageReady(): Promise<void> {
    await expect(this.resolve(SurveyManagerAllSurveysLocators.page)).toBeVisible();
    await expect(this.resolve(SurveyManagerAllSurveysLocators.table)).toBeVisible();
    await expect(this.resolve(SurveyManagerAllSurveysLocators.createSurveyButton)).toBeVisible();
    await expect(this.resolve(SurveyManagerAllSurveysLocators.tabGroup)).toBeVisible();
  }

  async waitForTableLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  // ── Tab switching ─────────────────────────────────────────────────────────

  /**
   * Switches to the given survey type tab using the dedicated tab-item testId.
   * Falls back to the text-based span locator when the tab-item testId is absent.
   */
  async switchTab(tab: SurveyTypeTab): Promise<void> {
    const tabItemLocator = this.tabItemLocator(tab);
    const tabItemEl = this.resolve(tabItemLocator);

    if (await tabItemEl.count() > 0 && await tabItemEl.isVisible().catch(() => false)) {
      await this.click(tabItemEl);
    } else {
      await this.click(this.resolve(this.tabTextLocator(tab)));
    }

    await this.waitForTableLoad();
  }

  async getActiveTabLabel(): Promise<string> {
    for (const tab of Object.keys(SurveyTypeTabLabels) as SurveyTypeTab[]) {
      const loc = this.resolve(this.tabItemLocator(tab));
      const isActive = await loc.evaluate((el) =>
        el.classList.contains("active") ||
        el.closest("[class*='active']") !== null ||
        el.getAttribute("aria-selected") === "true"
      ).catch(() => false);

      if (isActive) return SurveyTypeTabLabels[tab];
    }
    return "";
  }

  // ── Tab counts ────────────────────────────────────────────────────────────

  /**
   * Returns the count badge values for all three tabs.
   * Spans inside the tab group alternate: [label, count, label, count, label, count].
   * Order on the live page: All (index 1), Business Process Linked (index 3), Ad-Hoc (index 5).
   */
  async getTabCounts(): Promise<{ all: number; businessProcessLinked: number; adHoc: number }> {
    const spans = this.resolve(SurveyManagerAllSurveysLocators.tabCountSpans);
    const countAt = async (index: number): Promise<number> => {
      const text = await spans.nth(index).innerText().catch(() => "0");
      return parseInt(text.trim(), 10) || 0;
    };
    return {
      all: await countAt(1),
      businessProcessLinked: await countAt(3),
      adHoc: await countAt(5),
    };
  }

  // ── Search ────────────────────────────────────────────────────────────────

  async searchSurveys(query: string): Promise<void> {
    const input = this.resolve(SurveyManagerAllSurveysLocators.searchInput);
    await input.clear();https://forms1.qa.darwinbox.io/ms/formbuilder/survey-manager/a6a15906c083e1/summary
    await input.fill(query);
    await this.waitForTableLoad();
  }

  async clearSearch(): Promise<void> {
    await this.resolve(SurveyManagerAllSurveysLocators.searchInput).clear();
    await this.waitForTableLoad();
  }

  // ── Row reads ─────────────────────────────────────────────────────────────

  async getVisibleRowCount(): Promise<number> {
    return this.resolve(SurveyManagerAllSurveysLocators.surveyRows).count();
  }

  async waitForRows(): Promise<void> {
    await expect
      .poll(async () => this.getVisibleRowCount(), { timeout: 30_000 })
      .toBeGreaterThan(0);
  }

  async getSurveyTitleAt(rowIndex: number): Promise<string> {
    return this.rowCellText(rowIndex, SurveyManagerAllSurveysLocators.rowTitleCell);
  }

  async getSurveyTypeAt(rowIndex: number): Promise<string> {
    return this.rowCellText(rowIndex, SurveyManagerAllSurveysLocators.rowSurveyTypeCell);
  }

  async getPrivacyTypeAt(rowIndex: number): Promise<string> {
    return this.rowCellText(rowIndex, SurveyManagerAllSurveysLocators.rowPrivacyTypeCell);
  }

  async getChannelCountAt(rowIndex: number): Promise<string> {
    return this.rowCellText(rowIndex, SurveyManagerAllSurveysLocators.rowChannelsCell);
  }

  async getResponseCountAt(rowIndex: number): Promise<string> {
    return this.rowCellText(rowIndex, SurveyManagerAllSurveysLocators.rowResponsesCell);
  }

  async getActivatedOnAt(rowIndex: number): Promise<string> {
    return this.rowCellText(rowIndex, SurveyManagerAllSurveysLocators.rowActivatedOnCell);
  }

  /**
   * Returns the `status` attribute value of the status tag
   * (e.g. "draft", "active", "closed").
   */
  async getSurveyStatusAt(rowIndex: number): Promise<string> {
    const row = this.getRow(rowIndex);
    const statusTag = row.locator(SurveyManagerAllSurveysLocators.rowStatusTag.testId).first();
    return (await statusTag.getAttribute("status")) ?? "";
  }

  /**
   * Returns the human-readable status label from the status tag
   * (e.g. "Draft", "Active").
   */
  async getSurveyStatusLabelAt(rowIndex: number): Promise<string> {
    const row = this.getRow(rowIndex);
    const statusTag = row.locator(SurveyManagerAllSurveysLocators.rowStatusTag.testId).first();
    return (await statusTag.getAttribute("label")) ?? "";
  }

  // ── Row actions ───────────────────────────────────────────────────────────

  /** Clicks the survey title to navigate to the survey details page. */
  async clickSurveyTitleAt(rowIndex: number): Promise<void> {
    const row = this.getRow(rowIndex);
    await this.click(row.locator(SurveyManagerAllSurveysLocators.rowTitleCell.testId).first());
  }

  /** Clicks the inline Pin, Unpin, Resume, or Analyse button for the given row. */
  async clickRowActionAt(rowIndex: number, action: SurveyRowAction): Promise<void> {
    const row = this.getRow(rowIndex);
    const locator = SurveyManagerAllSurveysLocators.rowActionButton(action);
    await this.click(row.locator(locator.testId).first());
  }

  /** Opens the three-dots context menu for the given row. */
  async openContextMenuAt(rowIndex: number): Promise<void> {
    const row = this.getRow(rowIndex);
    await this.click(row.locator(SurveyManagerAllSurveysLocators.rowContextMenuButton.testId).first());
    await this.page.waitForTimeout(300);
  }

  /**
   * Clicks a context menu item.
   * Call `openContextMenuAt()` first to ensure the menu is open.
   */
  async clickContextMenuItem(action: SurveyContextMenuAction): Promise<void> {
    const label = ContextMenuLabels[action];
    await this.click(this.page.getByText(label, { exact: true }).first());
  }

  /**
   * Opens the context menu for the given row and immediately clicks the action.
   */
  async clickContextMenuActionAt(rowIndex: number, action: SurveyContextMenuAction): Promise<void> {
    await this.openContextMenuAt(rowIndex);
    await this.clickContextMenuItem(action);
  }

  // ── Create Survey drawer ──────────────────────────────────────────────────

  /**
   * Clicks the Create Survey button and waits for the drawer form to appear.
   */
  async openCreateSurveyDrawer(): Promise<void> {
    await this.click(this.resolve(SurveyManagerAllSurveysLocators.createSurveyButton));
    await expect(this.resolve(SurveyManagerAllSurveysLocators.createSurveyDrawerForm)).toBeAttached({
      timeout: 10_000,
    });
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  /**
   * Closes the Create Survey drawer via the × close button.
   */
  async closeCreateSurveyDrawer(): Promise<void> {
    await this.click(this.resolve(SurveyManagerAllSurveysLocators.createSurveyCloseButton));
    await expect(this.resolve(SurveyManagerAllSurveysLocators.createSurveyDrawerForm)).not.toBeAttached({
      timeout: 5_000,
    }).catch(() => {});
  }

  /**
   * Cancels the Create Survey drawer via the Cancel button.
   */
  async cancelCreateSurvey(): Promise<void> {
    await this.click(this.resolve(SurveyManagerAllSurveysLocators.createSurveyCancelButton));
  }

  /**
   * Fills the survey name field in the Create Survey drawer.
   * The name field is a `<dbx-ds-text-input>` web component — the actual
   * `<input>` lives in its Shadow DOM, so we chain `.locator("input")` to pierce it.
   */
  async fillCreateSurveyName(name: string): Promise<void> {
    const input = this.resolve(SurveyManagerAllSurveysLocators.createSurveyNameInput).locator("input");
    await input.fill(name);
  }

  /**
   * Selects the Ad-Hoc survey type card.
   * Live DOM: `dbx-surveys-card-create-modal-type-2` = Ad-Hoc Survey.
   */
  async selectAdHocSurveyType(): Promise<void> {
    await this.click(this.resolve(SurveyManagerAllSurveysLocators.createSurveyAdHocTypeCard));
  }

  /**
   * Selects the Business Process Linked survey type card.
   * Live DOM: `dbx-surveys-card-create-modal-type-1` = Linked to Business Process.
   */
  async selectBusinessProcessSurveyType(): Promise<void> {
    await this.click(this.resolve(SurveyManagerAllSurveysLocators.createSurveyBusinessProcessTypeCard));
  }

  /**
   * Opens the Response Format dropdown.
   */
  async openResponseFormatDropdown(): Promise<void> {
    await this.click(this.resolve(SurveyManagerAllSurveysLocators.createSurveyResponseFormatDropdown));
  }

  /**
   * Opens the Moment dropdown.
   */
  async openMomentDropdown(): Promise<void> {
    await this.click(this.resolve(SurveyManagerAllSurveysLocators.createSurveyMomentDropdown));
  }

  /**
   * Clicks the Proceed button in the Create Survey drawer footer.
   */
  async proceedCreateSurvey(): Promise<void> {
    await this.click(this.resolve(SurveyManagerAllSurveysLocators.createSurveyProceedButton));
  }

  // ── Assertions (UI-only) ──────────────────────────────────────────────────

  async assertPageVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerAllSurveysLocators.page)).toBeVisible();
  }

  async assertTableVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerAllSurveysLocators.table)).toBeVisible();
  }

  async assertTabGroupVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerAllSurveysLocators.tabGroup)).toBeVisible();
  }

  async assertCreateSurveyDrawerVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerAllSurveysLocators.createSurveyDrawerForm)).toBeAttached();
  }

  async assertRowActionVisibleAt(rowIndex: number, action: SurveyRowAction): Promise<void> {
    const row = this.getRow(rowIndex);
    await expect(
      row.locator(SurveyManagerAllSurveysLocators.rowActionButton(action).testId).first()
    ).toBeVisible();
  }

  async assertContextMenuItemVisible(action: SurveyContextMenuAction): Promise<void> {
    const label = ContextMenuLabels[action];
    await expect(this.page.getByText(label, { exact: true }).first()).toBeVisible();
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

  private getRow(rowIndex: number): PlaywrightLocator {
    return this.resolve(SurveyManagerAllSurveysLocators.surveyRows).nth(rowIndex);
  }

  private async rowCellText(rowIndex: number, cellLocator: Locator): Promise<string> {
    const cell = this.getRow(rowIndex).locator(cellLocator.testId).first();
    return (await cell.innerText()).replace(/\s+/g, " ").trim();
  }

  /** Returns the dedicated tab-item locator (preferred, uses testId). */
  private tabItemLocator(tab: SurveyTypeTab): Locator {
    switch (tab) {
      case "all":
        return SurveyManagerAllSurveysLocators.tabItemAll;
      case "businessProcessLinked":
        return SurveyManagerAllSurveysLocators.tabItemBusiness;
      case "adHoc":
        return SurveyManagerAllSurveysLocators.tabItemAdHoc;
    }
  }

  /** Returns the text-span fallback locator for a tab. */
  private tabTextLocator(tab: SurveyTypeTab): Locator {
    switch (tab) {
      case "all":
        return SurveyManagerAllSurveysLocators.tabAll;
      case "businessProcessLinked":
        return SurveyManagerAllSurveysLocators.tabBusinessProcessLinked;
      case "adHoc":
        return SurveyManagerAllSurveysLocators.tabAdHoc;
    }
  }
}
