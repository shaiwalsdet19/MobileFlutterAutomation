import { expect, Locator as PlaywrightLocator } from "@playwright/test";
import { BasePage } from "../../base.page";
import { Locator } from "../../common/locators/common";
import { SurveyManagerDetailsApi } from "./api/survey-manager-details.api";
import {
  SurveyManagerDetailsLocators,
  detailFieldValue,
} from "./locators/survey-manager-details";

type MoreOptionsAction =
  | "preview"
  | "editClosureDateTime"
  | "editSurveyConfigurations"
  | "duplicate";

export class SurveyManagerDetailsPage extends BasePage {
  // ── Navigation ────────────────────────────────────────────────────────────

  async navigate(baseUrl: string, surveyId: string): Promise<void> {
    await this.goto(SurveyManagerDetailsApi.getDetailsUrl(baseUrl, surveyId));
    await this.waitForPageReady();
  }

  // ── Readiness ─────────────────────────────────────────────────────────────

  async waitForPageReady(): Promise<void> {
    await expect(this.resolve(SurveyManagerDetailsLocators.page)).toBeVisible();
    await expect(
      this.resolve(SurveyManagerDetailsLocators.headerSection)
    ).toBeVisible();
    await expect(
      this.resolve(SurveyManagerDetailsLocators.summarySection)
    ).toBeVisible();
    await expect(
      this.resolve(SurveyManagerDetailsLocators.channelsSection)
    ).toBeVisible();
    await expect(
      this.resolve(SurveyManagerDetailsLocators.channelsTable)
    ).toBeVisible();
  }

  // ── Header reads ──────────────────────────────────────────────────────────

  async getSurveyName(): Promise<string> {
    return this.text(SurveyManagerDetailsLocators.surveyName);
  }

  async isSurveyNameEditIconVisible(): Promise<boolean> {
    return this.resolve(
      SurveyManagerDetailsLocators.surveyNameEditIcon
    ).isVisible();
  }

  // ── Header actions ────────────────────────────────────────────────────────

  async clickBack(): Promise<void> {
    await this.click(this.resolve(SurveyManagerDetailsLocators.backButton));
  }

  async clickAnalyseSurvey(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerDetailsLocators.analyseSurveyButton)
    );
  }

  async openDeactivateDialog(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerDetailsLocators.activateDeactivateButton)
    );
    await expect(
      this.resolve(SurveyManagerDetailsLocators.deactivateDialogMessage)
    ).toBeVisible();
    await expect(
      this.resolve(SurveyManagerDetailsLocators.deactivateDialogCancelButton)
    ).toBeVisible();
  }

  async waitForDeactivateDialogMessage(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerDetailsLocators.deactivateDialogMessage)
    ).toBeVisible();
  }

  async waitForDeactivateDialogClosed(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerDetailsLocators.deactivateDialogMessage)
    ).toBeHidden();
  }

  async cancelDeactivate(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerDetailsLocators.deactivateDialogCancelButton)
    );
  }

  async confirmDeactivate(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerDetailsLocators.deactivateDialogConfirmButton)
    );
  }

  async openMoreOptions(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerDetailsLocators.moreOptionsButton)
    );
  }

  async waitForMoreOptionsActionVisible(
    action: MoreOptionsAction
  ): Promise<void> {
    await expect(this.resolve(this.moreOptionsAction(action))).toBeVisible();
  }

  async clickMoreOptionsAction(action: MoreOptionsAction): Promise<void> {
    await this.openMoreOptions();
    await this.click(this.resolve(this.moreOptionsAction(action)));
  }

  // ── Survey Details grid reads ─────────────────────────────────────────────

  /**
   * Reads the text value of any field in the Survey Details grid by its label.
   * Example: `await page.getDetailFieldValue("Survey Title")`
   */
  async getDetailFieldValue(label: string): Promise<string> {
    return (
      await this.resolve(detailFieldValue(label)).innerText()
    )
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Reads the Survey Title value from the details grid. */
  async getSurveyTitle(): Promise<string> {
    return (
      await this.resolve(
        SurveyManagerDetailsLocators.surveyTitleValue
      ).innerText()
    )
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Reads the Created By value from the details grid. */
  async getCreatedBy(): Promise<string> {
    return (
      await this.resolve(
        SurveyManagerDetailsLocators.createdByValue
      ).innerText()
    )
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Reads the Created On date value from the details grid. */
  async getCreatedOn(): Promise<string> {
    return (
      await this.resolve(
        SurveyManagerDetailsLocators.createdOnValue
      ).innerText()
    )
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Reads the Survey Form name from the details grid. */
  async getSurveyForm(): Promise<string> {
    return (
      await this.resolve(
        SurveyManagerDetailsLocators.surveyFormValue
      ).innerText()
    )
      .replace(/\s+/g, " ")
      .trim();
  }

  /** Reads the Survey Access Permission value from the details grid. */
  async getSurveyAccessPermission(): Promise<string> {
    return (
      await this.resolve(
        SurveyManagerDetailsLocators.surveyAccessPermissionValue
      ).innerText()
    )
      .replace(/\s+/g, " ")
      .trim();
  }

  // ── Visible on Engagement Dashboard ───────────────────────────────────────

  /**
   * Returns the "Visible on Engagement Dashboard" value as displayed in the
   * Survey Details grid — either `"Yes"` or `"No"`.
   */
  async getEngagementDashboardVisibility(): Promise<string> {
    if (
      await this.resolve(
        SurveyManagerDetailsLocators.dashboardVisibilityValueYes
      ).isVisible()
    ) {
      return "Yes";
    }

    if (
      await this.resolve(
        SurveyManagerDetailsLocators.dashboardVisibilityValueNo
      ).isVisible()
    ) {
      return "No";
    }

    throw new Error(
      '"Visible on Engagement Dashboard" value is not visible on the details page'
    );
  }

  /** Returns `true` when the "Visible on Engagement Dashboard" field row is visible. */
  async isDashboardVisibilityRowVisible(): Promise<boolean> {
    return (
      (await this.resolve(
        SurveyManagerDetailsLocators.dashboardVisibilityValueYes
      ).isVisible()) ||
      (await this.resolve(
        SurveyManagerDetailsLocators.dashboardVisibilityValueNo
      ).isVisible())
    );
  }

  // ── Summary text ───────────────────────────────────────────────────────────

  async getSummaryText(): Promise<string> {
    return this.text(SurveyManagerDetailsLocators.summarySection);
  }

  // ── Channels section ───────────────────────────────────────────────────────

  async waitForAddChannelButton(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerDetailsLocators.addChannelButton)
    ).toBeVisible();
  }

  async waitForChannelsSectionReady(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerDetailsLocators.channelsHeading)
    ).toBeVisible();
    await expect
      .poll(
        async () =>
          this.resolve(SurveyManagerDetailsLocators.channelRemindButton).count(),
        { timeout: 30_000 }
      )
      .toBeGreaterThan(0);
  }

  async getChannelsTableText(): Promise<string> {
    return this.text(SurveyManagerDetailsLocators.channelsTable);
  }

  async getChannelRowCount(): Promise<number> {
    return this.resolve(SurveyManagerDetailsLocators.channelTableRows).count();
  }

  async searchChannel(channelTitle: string): Promise<void> {
    await this.fill(
      this.resolve(SurveyManagerDetailsLocators.channelSearchInput),
      channelTitle
    );
  }

  // ── Reminder drawer ────────────────────────────────────────────────────────

  async openFirstChannelReminder(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerDetailsLocators.channelRemindButton).first()
    );
    await expect(
      this.resolve(SurveyManagerDetailsLocators.reminderEmailInput)
    ).toBeVisible();
    await expect(
      this.resolve(SurveyManagerDetailsLocators.reminderNameInput)
    ).toBeVisible();
  }

  async closeReminderDrawer(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerDetailsLocators.reminderFooterCloseButton)
    );
  }

  async waitForReminderDrawerClosed(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerDetailsLocators.reminderFooterCloseButton)
    ).toBeHidden();
    await expect(
      this.resolve(SurveyManagerDetailsLocators.channelsHeading)
    ).toBeVisible();
  }

  async getReminderEmail(): Promise<string> {
    return (
      await this.resolve(
        SurveyManagerDetailsLocators.reminderEmailInput
      ).inputValue()
    ).trim();
  }

  async getReminderName(): Promise<string> {
    return (
      await this.resolve(
        SurveyManagerDetailsLocators.reminderNameInput
      ).inputValue()
    ).trim();
  }

  async getReminderSubject(): Promise<string> {
    return this.text(SurveyManagerDetailsLocators.reminderSubjectEditor);
  }

  async getReminderMessage(): Promise<string> {
    return this.text(SurveyManagerDetailsLocators.reminderMessageEditor);
  }

  async getReminderBellMessage(): Promise<string> {
    return this.text(SurveyManagerDetailsLocators.reminderBellMessageEditor);
  }

  // ── Assertions (UI-only) ──────────────────────────────────────────────────

  async assertPageVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerDetailsLocators.page)).toBeVisible();
  }

  async assertHeaderVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerDetailsLocators.headerSection)
    ).toBeVisible();
  }

  async assertSurveySectionVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerDetailsLocators.summarySection)
    ).toBeVisible();
  }

  async assertChannelsSectionVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerDetailsLocators.channelsSection)
    ).toBeVisible();
  }

  async assertChannelsTableVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerDetailsLocators.channelsTable)
    ).toBeVisible();
  }

  async assertSurveyNameIs(expectedName: string): Promise<void> {
    await expect(
      this.resolve(SurveyManagerDetailsLocators.surveyName)
    ).toHaveText(expectedName);
  }

  async assertSurveyNameEditIconVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerDetailsLocators.surveyNameEditIcon)
    ).toBeVisible();
  }

  // ── Assertions — Survey Details grid fields ───────────────────────────────

  async assertDetailFieldValue(
    label: string,
    expectedValue: string
  ): Promise<void> {
    await expect(this.resolve(detailFieldValue(label))).toHaveText(
      expectedValue
    );
  }

  async assertSurveyTitleIs(expectedTitle: string): Promise<void> {
    await expect(
      this.resolve(SurveyManagerDetailsLocators.surveyTitleValue)
    ).toHaveText(expectedTitle);
  }

  async assertSurveyFormIs(expectedForm: string): Promise<void> {
    await expect(
      this.resolve(SurveyManagerDetailsLocators.surveyFormValue)
    ).toHaveText(expectedForm);
  }

  // ── Assertions — Visible on Engagement Dashboard ──────────────────────────

  /**
   * Asserts that the "Visible on Engagement Dashboard" row is present and visible
   * in the Survey Details grid.
   */
  async assertDashboardVisibilityRowVisible(): Promise<void> {
    await expect
      .poll(async () => this.isDashboardVisibilityRowVisible())
      .toBe(true);
  }

  /**
   * Asserts the "Visible on Engagement Dashboard" value matches `expectedValue`.
   * Pass `"Yes"` or `"No"` as the expected value.
   */
  async assertEngagementDashboardVisibilityIs(
    expectedValue: "Yes" | "No"
  ): Promise<void> {
    const locator =
      expectedValue === "Yes"
        ? SurveyManagerDetailsLocators.dashboardVisibilityValueYes
        : SurveyManagerDetailsLocators.dashboardVisibilityValueNo;

    await expect(this.resolve(locator)).toBeVisible();
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  private resolve(locator: Locator): PlaywrightLocator {
    const selector = locator.testId.trim();
    if (selector.startsWith("dbx-")) {
      return this.getByTestId(selector);
    }
    return this.page.locator(selector);
  }

  private async text(locator: Locator): Promise<string> {
    return (await this.resolve(locator).innerText())
      .replace(/\s+/g, " ")
      .trim();
  }

  private moreOptionsAction(action: MoreOptionsAction): Locator {
    switch (action) {
      case "preview":
        return SurveyManagerDetailsLocators.moreOptionsPreview;
      case "editClosureDateTime":
        return SurveyManagerDetailsLocators.moreOptionsEditClosureDateTime;
      case "editSurveyConfigurations":
        return SurveyManagerDetailsLocators.moreOptionsEditSurveyConfigurations;
      case "duplicate":
        return SurveyManagerDetailsLocators.moreOptionsDuplicate;
    }
  }
}
