import { expect, Locator as PlaywrightLocator, Response } from "@playwright/test";
import { BasePage } from "../../base.page";
import { Locator } from "../../common/locators/common";
import { InputsPage } from "../../../fixtures/user-inputs.fixture";
import { OnboardingSettingsApi } from "./api/onboarding-settings.api";
import { OnboardingSettingsLocators } from "./locators/onboarding-settings";

export class OnboardingSettingsPage extends BasePage {
  constructor(protected readonly page: InputsPage) {
    super(page);
  }

  async navigate(baseUrl: string): Promise<void> {
    await Promise.all([
      this.goto(OnboardingSettingsApi.getPageUrl(baseUrl)),
    ]);

    await this.waitForPageReady();
  }

  async waitForPageReady(): Promise<void> {
    await expect(this.resolve(OnboardingSettingsLocators.form)).toBeVisible({
      timeout: 30_000,
    });
    await expect(this.resolve(OnboardingSettingsLocators.saveButton)).toBeAttached();
    await expect(
      this.resolve(OnboardingSettingsLocators.exportAdvancedSettingsLink)
    ).toBeAttached();
    await expect(
      this.resolve(OnboardingSettingsLocators.importAdvancedSettingsLink)
    ).toBeAttached();
    await expect(
      this.resolve(OnboardingSettingsLocators.downloadConfigurationTable)
    ).toBeAttached();
  }

  async clickSave(): Promise<Response | null> {
    const waitForSave = OnboardingSettingsApi.waitForSave(this.page).catch(
      () => null
    );
    await this.click(this.resolve(OnboardingSettingsLocators.saveButton));
    return waitForSave;
  }

  async clickExportAdvancedSettings(): Promise<void> {
    await this.click(
      this.resolve(OnboardingSettingsLocators.exportAdvancedSettingsLink)
    );
  }

  async clickImportAdvancedSettings(): Promise<void> {
    await this.click(
      this.resolve(OnboardingSettingsLocators.importAdvancedSettingsLink)
    );
  }

  async isEnableOcrChecked(): Promise<boolean> {
    return this.resolve(OnboardingSettingsLocators.enableOcrCheckbox).isChecked();
  }

  async isDisplayGroupCompanyAsCompanyNameChecked(): Promise<boolean> {
    return this.resolve(
      OnboardingSettingsLocators.displayGroupCompanyAsCompanyNameCheckbox
    ).isChecked();
  }

  async isEnableAutoSaveChecked(): Promise<boolean> {
    return this.resolve(
      OnboardingSettingsLocators.enableAutoSaveCheckbox
    ).isChecked();
  }

  async isEnableBgvChecked(): Promise<boolean> {
    return this.resolve(OnboardingSettingsLocators.enableBgvCheckbox).isChecked();
  }

  async setEnableBgvChecked(checked: boolean): Promise<void> {
    await this.page.checkbox(OnboardingSettingsLocators.enableBgvCheckbox.testId).toggle(checked);
  }

  async enableBgv(): Promise<void> {
    await this.setEnableBgvChecked(true);
  }

  async disableBgv(): Promise<void> {
    await this.setEnableBgvChecked(false);
  }

  async isAllowBgvAdminEditChecked(): Promise<boolean> {
    return this.resolve(
      OnboardingSettingsLocators.allowBgvAdminEditCheckbox
    ).isChecked();
  }

  async isBgvDataAccessExpiryChecked(): Promise<boolean> {
    return this.resolve(
      OnboardingSettingsLocators.bgvDataAccessExpiryCheckbox
    ).isChecked();
  }

  async setBgvDataAccessExpiryChecked(checked: boolean): Promise<void> {
    await this.page.checkbox(OnboardingSettingsLocators.bgvDataAccessExpiryCheckbox.testId).toggle(checked);
  }

  async enableBgvDataAccessExpiry(): Promise<void> {
    await this.setBgvDataAccessExpiryChecked(true);
  }

  async disableBgvDataAccessExpiry(): Promise<void> {
    await this.setBgvDataAccessExpiryChecked(false);
  }

  async getBgvDataAccessExpiryDays(): Promise<string> {
    return this.resolve(
      OnboardingSettingsLocators.bgvDataAccessExpiryDaysInput
    ).inputValue();
  }

  async setBgvDataAccessExpiryDays(value: string): Promise<void> {
    await this.page.input(OnboardingSettingsLocators.bgvDataAccessExpiryDaysInput.testId).fill(value);
  }

  async clearBgvDataAccessExpiryDays(): Promise<void> {
    await this.page.input(OnboardingSettingsLocators.bgvDataAccessExpiryDaysInput.testId).clear();
  }

  async isBgvDataAccessExpiryDaysEnabled(): Promise<boolean> {
    return this.resolve(
      OnboardingSettingsLocators.bgvDataAccessExpiryDaysInput
    ).isEnabled();
  }

  async isBgvDataAccessExpiryVisible(): Promise<boolean> {
    return this.resolve(
      OnboardingSettingsLocators.bgvDataAccessExpiryCheckbox
    ).isVisible().catch(() => false);
  }

  async isBgvDataAccessExpiryTooltipVisible(): Promise<boolean> {
    return this.resolve(
      OnboardingSettingsLocators.bgvDataAccessExpiryTooltipLink
    ).isVisible().catch(() => false);
  }

  async getBgvDataAccessExpiryTooltipText(): Promise<string | null> {
    return this.resolve(
      OnboardingSettingsLocators.bgvDataAccessExpiryTooltipLink
    ).getAttribute("aria-label");
  }

  async getErrorSummaryText(): Promise<string> {
    return this.text(OnboardingSettingsLocators.errorSummary);
  }

  async getExportHref(): Promise<string | null> {
    return this.resolve(
      OnboardingSettingsLocators.exportAdvancedSettingsLink
    ).getAttribute("href");
  }

  async getImportHref(): Promise<string | null> {
    return this.resolve(
      OnboardingSettingsLocators.importAdvancedSettingsLink
    ).getAttribute("href");
  }

  async getDownloadConfigurationText(): Promise<string> {
    return this.text(OnboardingSettingsLocators.downloadConfigurationTable);
  }

  async assertActionsVisible(): Promise<void> {
    await expect(this.resolve(OnboardingSettingsLocators.saveButton)).toBeAttached();
    await expect(
      this.resolve(OnboardingSettingsLocators.exportAdvancedSettingsLink)
    ).toBeAttached();
    await expect(
      this.resolve(OnboardingSettingsLocators.importAdvancedSettingsLink)
    ).toBeAttached();
  }

  async assertBgvDataAccessExpiryTooltipVisible(): Promise<void> {
    await expect(
      this.resolve(OnboardingSettingsLocators.bgvDataAccessExpiryTooltipLink)
    ).toBeVisible();
  }

  async assertErrorSummaryVisible(): Promise<void> {
    await expect(this.resolve(OnboardingSettingsLocators.errorSummary)).toBeVisible();
  }

  async assertErrorSummaryHidden(): Promise<void> {
    await expect(this.resolve(OnboardingSettingsLocators.errorSummary)).toBeHidden();
  }

  async assertDefaultAdminState(): Promise<void> {
    await expect(this.resolve(OnboardingSettingsLocators.enableOcrCheckbox)).toBeChecked();
    await expect(
      this.resolve(
        OnboardingSettingsLocators.displayGroupCompanyAsCompanyNameCheckbox
      )
    ).toBeChecked();
    await expect(
      this.resolve(OnboardingSettingsLocators.enableAutoSaveCheckbox)
    ).not.toBeChecked();
    await expect(this.resolve(OnboardingSettingsLocators.enableBgvCheckbox)).toBeChecked();
    await expect(
      this.resolve(OnboardingSettingsLocators.allowBgvAdminEditCheckbox)
    ).not.toBeChecked();
    await expect(
      this.resolve(OnboardingSettingsLocators.bgvDataAccessExpiryCheckbox)
    ).not.toBeChecked();
    await expect(
      this.resolve(OnboardingSettingsLocators.bgvDataAccessExpiryDaysInput)
    ).toHaveValue("90");
    await expect(
      this.resolve(OnboardingSettingsLocators.bgvDataAccessExpiryDaysInput)
    ).toBeDisabled();
    await expect(
      this.resolve(OnboardingSettingsLocators.bgvDataAccessExpiryTooltipLink)
    ).toBeVisible();
    await expect(
      this.resolve(OnboardingSettingsLocators.downloadConfigurationTable)
    ).toBeVisible();
  }

  private resolve(locator: Locator): PlaywrightLocator {
    return this.resolveLocator(locator);
  }

  private async text(locator: Locator): Promise<string> {
    return this.getLocatorText(locator);
  }
}
