import { expect, Locator as PlaywrightLocator, Response } from "@playwright/test";
import { BasePage } from "../base.page";
import { TenantProvisioningSurveysApi } from "./api/tenant-provisioning-surveys.api";
import {
  TenantProvisioningSurveysConfidentialFieldIds,
  TenantProvisioningSurveysConfidentialFieldKey,
  TenantProvisioningSurveysLocators,
} from "./locators/tenant-provisioning-surveys";
import { Locator as LocatorDefinition } from "./locators/common";

type SurveySubTab = "all" | "survey" | "confidentialSurvey" | "engagement";

type SectionVisibility = {
  survey: boolean;
  confidentialSurvey: boolean;
  engagement: boolean;
};

export class TenantProvisioningSurveysPage extends BasePage {
  async navigate(baseUrl: string): Promise<void> {
    const response = await this.page.goto(TenantProvisioningSurveysApi.getPageUrl(baseUrl));

    if (!TenantProvisioningSurveysApi.isTenantProvisioningResponse(response)) {
      throw new Error("Tenant provisioning surveys page did not load successfully.");
    }

    await this.waitForURL(/\/settings\/employees\/tenantprovisioning(?:\?.*)?$/);
    await this.waitForPageReady();
  }

  async waitForPageReady(): Promise<void> {
    await expect(this.resolve(TenantProvisioningSurveysLocators.form)).toBeVisible();
    await expect(this.resolve(TenantProvisioningSurveysLocators.searchSettingsInput)).toBeVisible();
    await expect(this.resolve(TenantProvisioningSurveysLocators.saveSettingsButton)).toBeVisible();

    await this.openSurveysTab();
    await expect(this.resolve(TenantProvisioningSurveysLocators.subTabMenu)).toBeVisible();

    await this.openAllSubTab();
  }

  async openSurveysTab(): Promise<void> {
    const surveysSection = this.resolve(TenantProvisioningSurveysLocators.surveysProvisioningSection);
    if (await surveysSection.isVisible().catch(() => false)) {
      return;
    }

    await this.click(this.resolve(TenantProvisioningSurveysLocators.mainSurveyTab));
    await expect(surveysSection).toBeVisible();
  }

  async openAllSubTab(): Promise<void> {
    await this.openSubTab("all");
  }

  async openSurveySubTab(): Promise<void> {
    await this.openSubTab("survey");
  }

  async openConfidentialSurveySubTab(): Promise<void> {
    await this.openSubTab("confidentialSurvey");
  }

  async openEngagementSubTab(): Promise<void> {
    await this.openSubTab("engagement");
  }

  async getActiveSubTab(): Promise<SurveySubTab> {
    const activeSubTabText = await this.text(TenantProvisioningSurveysLocators.activeSubTab);

    switch (activeSubTabText) {
      case "All":
        return "all";
      case "Survey":
        return "survey";
      case "Confidential Survey":
        return "confidentialSurvey";
      case "Engagement":
        return "engagement";
      default:
        throw new Error(`Unsupported Survey sub-tab: ${activeSubTabText}`);
    }
  }

  async getVisibleSections(): Promise<Array<"survey" | "confidentialSurvey" | "engagement">> {
    const visibility = await this.readSectionVisibility();
    return Object.entries(visibility)
      .filter(([, isVisible]) => isVisible)
      .map(([section]) => section as "survey" | "confidentialSurvey" | "engagement");
  }

  async isEnableSurveysChecked(): Promise<boolean> {
    return this.resolve(TenantProvisioningSurveysLocators.enableSurveysCheckbox).isChecked();
  }

  async setEnableSurveys(checked: boolean): Promise<void> {
    await this.openAllSubTab();
    await this.resolve(TenantProvisioningSurveysLocators.enableSurveysCheckbox).setChecked(checked, {
      force: true,
    });
  }

  async isShowUserSpecificLinkChecked(): Promise<boolean> {
    return this.resolve(TenantProvisioningSurveysLocators.showUserSpecificLinkCheckbox).isChecked();
  }

  async isEnableAiSmartFollowUpsChecked(): Promise<boolean> {
    return this.resolve(TenantProvisioningSurveysLocators.enableAiSmartFollowUpsCheckbox).isChecked();
  }

  async isUseSupervisedClusteringChecked(): Promise<boolean> {
    return this.resolve(TenantProvisioningSurveysLocators.useSupervisedClusteringCheckbox).isChecked();
  }

  async getClusterTimeFrame(): Promise<string> {
    return this.resolve(TenantProvisioningSurveysLocators.clusterTimeFrameInput).inputValue();
  }

  async getMinimumAttributeSize(): Promise<string> {
    return this.resolve(TenantProvisioningSurveysLocators.minimumAttributeSizeInput).inputValue();
  }

  async isEnableEngagementChecked(): Promise<boolean> {
    return this.resolve(TenantProvisioningSurveysLocators.enableEngagementCheckbox).isChecked();
  }

  async isConfidentialFieldChecked(
    fieldKey: TenantProvisioningSurveysConfidentialFieldKey
  ): Promise<boolean> {
    return this.resolve(TenantProvisioningSurveysLocators.confidentialFieldCheckbox(fieldKey)).isChecked();
  }

  async getCheckedConfidentialFieldKeys(): Promise<TenantProvisioningSurveysConfidentialFieldKey[]> {
    const checkedFields: TenantProvisioningSurveysConfidentialFieldKey[] = [];

    for (const fieldKey of Object.keys(
      TenantProvisioningSurveysConfidentialFieldIds
    ) as TenantProvisioningSurveysConfidentialFieldKey[]) {
      if (await this.isConfidentialFieldChecked(fieldKey)) {
        checkedFields.push(fieldKey);
      }
    }

    return checkedFields;
  }

  async saveSettings(): Promise<Response> {
    const saveResponse = TenantProvisioningSurveysApi.waitForSave(this.page);
    await this.click(this.resolve(TenantProvisioningSurveysLocators.saveSettingsButton));
    return saveResponse;
  }

  private async openSubTab(subTab: SurveySubTab): Promise<void> {
    await this.openSurveysTab();

    const targetSubTab = this.resolve(this.subTabLocator(subTab));
    await this.click(targetSubTab);
    await expect(targetSubTab).toHaveClass(/active/);
    await this.expectSectionVisibility(this.sectionVisibilityFor(subTab));
  }

  private async expectSectionVisibility(expected: SectionVisibility): Promise<void> {
    await this.expectVisibility(TenantProvisioningSurveysLocators.surveySettingsSection, expected.survey);
    await this.expectVisibility(
      TenantProvisioningSurveysLocators.confidentialSettingsSection,
      expected.confidentialSurvey
    );
    await this.expectVisibility(
      TenantProvisioningSurveysLocators.engagementSettingsSection,
      expected.engagement
    );
  }

  private async expectVisibility(locator: LocatorDefinition, shouldBeVisible: boolean): Promise<void> {
    if (shouldBeVisible) {
      await expect(this.resolve(locator)).toBeVisible();
      return;
    }

    await expect(this.resolve(locator)).toBeHidden();
  }

  private async readSectionVisibility(): Promise<SectionVisibility> {
    return {
      survey: await this.resolve(TenantProvisioningSurveysLocators.surveySettingsSection)
        .isVisible()
        .catch(() => false),
      confidentialSurvey: await this.resolve(TenantProvisioningSurveysLocators.confidentialSettingsSection)
        .isVisible()
        .catch(() => false),
      engagement: await this.resolve(TenantProvisioningSurveysLocators.engagementSettingsSection)
        .isVisible()
        .catch(() => false),
    };
  }

  private subTabLocator(subTab: SurveySubTab): LocatorDefinition {
    switch (subTab) {
      case "all":
        return TenantProvisioningSurveysLocators.allSubTab;
      case "survey":
        return TenantProvisioningSurveysLocators.surveySubTab;
      case "confidentialSurvey":
        return TenantProvisioningSurveysLocators.confidentialSurveySubTab;
      case "engagement":
        return TenantProvisioningSurveysLocators.engagementSubTab;
    }
  }

  private sectionVisibilityFor(subTab: SurveySubTab): SectionVisibility {
    switch (subTab) {
      case "all":
        return {
          survey: true,
          confidentialSurvey: true,
          engagement: true,
        };
      case "survey":
        return {
          survey: true,
          confidentialSurvey: false,
          engagement: false,
        };
      case "confidentialSurvey":
        return {
          survey: false,
          confidentialSurvey: true,
          engagement: false,
        };
      case "engagement":
        return {
          survey: false,
          confidentialSurvey: false,
          engagement: true,
        };
    }
  }

  private resolve(locator: LocatorDefinition): PlaywrightLocator {
    const selector = locator.testId.trim();

    if (selector.startsWith("dbx-")) {
      return this.page.locator(`[data-testid=${JSON.stringify(selector)}]`);
    }

    return this.page.locator(selector);
  }

  private async text(locator: LocatorDefinition): Promise<string> {
    return (await this.resolve(locator).innerText()).replace(/\s+/g, " ").trim();
  }
}
