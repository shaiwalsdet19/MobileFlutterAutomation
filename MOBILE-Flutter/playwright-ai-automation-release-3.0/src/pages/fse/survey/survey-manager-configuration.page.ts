import { expect, Locator as PlaywrightLocator } from "@playwright/test";
import { BasePage } from "../../base.page";
import { Locator } from "../../common/locators/common";
import { SurveyManagerConfigurationApi } from "./api/survey-manager-configuration.api";
import {
  BackgroundColor,
  BackgroundColorLabels,
  SurveyManagerConfigurationLocators,
} from "./locators/survey-manager-configuration";

export class SurveyManagerConfigurationPage extends BasePage {
  // ── Navigation ────────────────────────────────────────────────────────────

  async navigate(baseUrl: string, surveyId: string): Promise<void> {
    await this.goto(SurveyManagerConfigurationApi.getConfigurationUrl(baseUrl, surveyId));
    await this.waitForPageReady();
  }

  // ── Readiness ─────────────────────────────────────────────────────────────

  async waitForPageReady(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.page)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.headerSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.surveyDetailsSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.advancedSettingsSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.backgroundSection)).toBeVisible();
  }

  // ── Header reads ──────────────────────────────────────────────────────────

  async getSurveyName(): Promise<string> {
    return this.text(SurveyManagerConfigurationLocators.surveyNameText);
  }

  // ── Header actions ────────────────────────────────────────────────────────

  async clickBack(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.backButton));
  }

  async clickPrevious(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.previousButton));
  }

  async clickNext(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.nextButton));
  }

  async clickEditName(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.editNameIcon));
  }

  async openMoreOptions(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.moreOptionsButton));
    await this.page.waitForTimeout(300);
  }

  // ── Activate / Deactivate dialog ──────────────────────────────────────────

  async waitForActivateDialogVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.activateDialogMessage)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.activateDialogCancelButton)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.activateDialogConfirmButton)).toBeVisible();
  }

  async waitForActivateDialogHidden(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.activateDialogMessage)).toBeHidden();
  }

  async getActivateDialogMessage(): Promise<string> {
    return this.text(SurveyManagerConfigurationLocators.activateDialogMessage);
  }

  async cancelActivateDialog(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.activateDialogCancelButton));
  }

  async confirmActivateDialog(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.activateDialogConfirmButton));
  }

  // ── Survey Details section ────────────────────────────────────────────────

  /**
   * Returns the current value of the form name input.
   * The underlying `<input>` lives inside the Shadow DOM of `dbx-ds-text-input`;
   * we pierce it by chaining `.locator("input")`.
   */
  async getFormNameValue(): Promise<string> {
    const input = this.resolve(SurveyManagerConfigurationLocators.formNameInput).locator("input");
    return (await input.inputValue()).trim();
  }

  /**
   * Fills the survey / form name input.
   */
  async fillFormName(name: string): Promise<void> {
    const input = this.resolve(SurveyManagerConfigurationLocators.formNameInput).locator("input");
    await input.clear();
    await input.fill(name);
  }

  /**
   * Returns the privacy type radio group element for further assertions or interaction.
   * Options are typically: Regular / Confidential.
   */
  getPrivacyTypeRadio(): PlaywrightLocator {
    return this.resolve(SurveyManagerConfigurationLocators.privacyTypeRadio);
  }

  // ── Access Permissions section ────────────────────────────────────────────

  async clickAddAccessMenu(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.accessAddMenuButton));
    await this.page.waitForTimeout(300);
  }

  // ── Advance Settings section ──────────────────────────────────────────────

  /**
   * Returns whether the Auto Save toggle is checked.
   * `dbx-ds-tick` exposes its checked state via the `checked` attribute.
   */
  async isAutoSaveEnabled(): Promise<boolean> {
    return this.isTickEnabled(SurveyManagerConfigurationLocators.autoSaveCheckbox);
  }

  async isPartialResponseEnabled(): Promise<boolean> {
    return this.isTickEnabled(SurveyManagerConfigurationLocators.partialResponseCheckbox);
  }

  async isAiFollowupsEnabled(): Promise<boolean> {
    return this.isTickEnabled(SurveyManagerConfigurationLocators.aiFollowupsCheckbox);
  }

  async isEditAfterSubmitEnabled(): Promise<boolean> {
    return this.isTickEnabled(SurveyManagerConfigurationLocators.editAfterSubmitCheckbox);
  }

  async isPrivacyPromiseEnabled(): Promise<boolean> {
    return this.isTickEnabled(SurveyManagerConfigurationLocators.privacyPromiseCheckbox);
  }

  async toggleAutoSave(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.autoSaveCheckbox));
  }

  async togglePartialResponse(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.partialResponseCheckbox));
  }

  async toggleAiFollowups(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.aiFollowupsCheckbox));
  }

  async toggleEditAfterSubmit(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.editAfterSubmitCheckbox));
  }

  async togglePrivacyPromise(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.privacyPromiseCheckbox));
  }

  async openAdditionalFieldsDropdown(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.additionalFieldsDropdown));
  }

  async openExcludeRespondentsDropdown(): Promise<void> {
    await this.click(this.resolve(SurveyManagerConfigurationLocators.excludeRespondentsDropdown));
  }

  // ── Background section ────────────────────────────────────────────────────

  /**
   * Clicks a preset background color card.
   * Cards are identified by the `BackgroundColor` key (e.g. "darwinBlue", "coralRed").
   */
  async selectBackgroundColor(color: BackgroundColor): Promise<void> {
    const locator = SurveyManagerConfigurationLocators.backgroundColorCard(color);
    await this.click(this.resolve(locator));
  }

  /**
   * Returns the label text of the currently selected background color card,
   * determined by the presence of an 'active' or 'selected' class on the card.
   */
  async getSelectedBackgroundColorLabel(): Promise<string | null> {
    for (const color of Object.keys(BackgroundColorLabels) as BackgroundColor[]) {
      const card = this.resolve(SurveyManagerConfigurationLocators.backgroundColorCard(color));
      const isSelected = await card
        .evaluate((el) => el.classList.contains("active") || el.classList.contains("selected"))
        .catch(() => false);
      if (isSelected) return BackgroundColorLabels[color];
    }
    return null;
  }

  /**
   * Opens the background type radio to the custom-upload option.
   * After switching, `backgroundUploadInput` becomes visible.
   */
  getBackgroundTypeRadio(): PlaywrightLocator {
    return this.resolve(SurveyManagerConfigurationLocators.backgroundTypeRadio);
  }

  // ── Assertions (UI-only) ──────────────────────────────────────────────────

  async assertPageVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.page)).toBeVisible();
  }

  async assertHeaderVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.headerSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.surveyNameText)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.stepper)).toBeVisible();
  }

  async assertNavigationButtonsVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.previousButton)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.nextButton)).toBeVisible();
  }

  async assertSurveyDetailsSectionVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.surveyDetailsSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.formNameInput)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.privacyTypeRadio)).toBeVisible();
  }

  async assertAccessPermissionsSectionVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.accessPermissionsSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.accessComponent)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.accessAddMenuButton)).toBeVisible();
  }

  async assertAdvancedSettingsSectionVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.advancedSettingsSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.autoSaveCheckbox)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.partialResponseCheckbox)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.aiFollowupsCheckbox)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.editAfterSubmitCheckbox)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.additionalFieldsDropdown)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.excludeRespondentsDropdown)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.privacyPromiseCheckbox)).toBeVisible();
  }

  async assertBackgroundSectionVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.backgroundSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.backgroundForm)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.backgroundTypeRadio)).toBeVisible();
    await expect(this.resolve(SurveyManagerConfigurationLocators.backgroundImagesSection)).toBeVisible();
  }

  async assertAllBackgroundColorCardsVisible(): Promise<void> {
    for (const color of Object.keys(BackgroundColorLabels) as BackgroundColor[]) {
      await expect(
        this.resolve(SurveyManagerConfigurationLocators.backgroundColorCard(color))
      ).toBeVisible();
    }
  }

  async assertPrivacyPromiseAlertVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.privacyPromiseAlert)).toBeVisible();
  }

  async assertPrivacyPromiseAlertHidden(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.privacyPromiseAlert)).toBeHidden();
  }

  async assertBackgroundUploadInputHidden(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.backgroundUploadInput)).toBeHidden();
  }

  async assertErrorsContainerAttached(): Promise<void> {
    await expect(this.resolve(SurveyManagerConfigurationLocators.errorsContainer)).toBeAttached();
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

  /**
   * Reads the `checked` attribute from a `dbx-ds-tick` web component.
   * Falls back to evaluating the host element's `checked` property.
   */
  private async isTickEnabled(locator: Locator): Promise<boolean> {
    const el = this.resolve(locator);
    return el
      .evaluate((node) => {
        const attr = node.getAttribute("checked");
        if (attr !== null) return attr !== "false" && attr !== "";
        return (node as HTMLInputElement).checked ?? false;
      })
      .catch(() => false);
  }
}
