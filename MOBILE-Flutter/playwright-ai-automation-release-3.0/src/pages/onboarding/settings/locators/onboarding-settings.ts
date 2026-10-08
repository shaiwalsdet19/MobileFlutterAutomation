import { Locator } from "../../../common/locators/common";

// https://ta6.qa.darwinbox.io/onboarding/onboardingsettings/onboarding/onboardingsettings
//
// Live exploration summary:
// - This route renders the server-side "Advanced Settings" page for Onboarding.
// - The page is already accessible for the Admin persona in ta6.
// - The page now exposes stable test IDs for the root form, validation summary, primary
//   actions, checkbox inputs, the BGV expiry input and tooltip, and the download table.
// - Breadcrumbs, section headings, and row-level controls inside the download configuration
//   table still do not have data-testid attributes, so they are omitted.

export const OnboardingSettingsLocators = {
  form: {
    testId: "dbx-onboarding-form-advanced-settings",
    description: "Root form for the onboarding advanced settings page",
  } as Locator,

  errorSummary: {
    testId: "dbx-onboarding-advanced-settings-error",
    description: "Validation summary shown when the advanced settings form submission fails",
  } as Locator,

  saveButton: {
    testId: "dbx-onboarding-btn-save-advanced-settings",
    description: "Primary save action for onboarding advanced settings",
  } as Locator,

  exportAdvancedSettingsLink: {
    testId: "dbx-onboarding-link-export-advanced-settings",
    description: "Link that exports the advanced settings configuration",
  } as Locator,

  importAdvancedSettingsLink: {
    testId: "dbx-onboarding-link-import-advanced-settings",
    description: "Link that opens the advanced settings import flow",
  } as Locator,

  enableOcrCheckbox: {
    testId: "dbx-onboarding-checkbox-enable-ocr",
    description: "Checkbox that enables OCR in onboarding",
  } as Locator,

  displayGroupCompanyAsCompanyNameCheckbox: {
    testId: "dbx-onboarding-checkbox-display-group-company-as-company-name",
    description: "Checkbox that shows the group firm as the firm name on the welcome page",
  } as Locator,

  enableAutoSaveCheckbox: {
    testId: "dbx-onboarding-checkbox-enable-auto-save",
    description: "Checkbox that enables auto save for the onboarding form",
  } as Locator,

  enableBgvCheckbox: {
    testId: "dbx-onboarding-checkbox-enable-bgv",
    description: "Checkbox that enables BGV for onboarding",
  } as Locator,

  allowBgvAdminEditCheckbox: {
    testId: "dbx-onboarding-checkbox-edit-bgv",
    description: "Checkbox that allows the BGV admin to edit user inputs",
  } as Locator,

  bgvDataAccessExpiryCheckbox: {
    testId: "dbx-onboarding-checkbox-bgv-data-access-expiry",
    description: "Checkbox that enables automatic BGV data-access expiry",
  } as Locator,

  bgvDataAccessExpiryDaysInput: {
    testId: "dbx-onboarding-input-bgv-data-access-expiry-days",
    description: "Numeric input for the BGV data-access expiry duration in days",
  } as Locator,

  bgvDataAccessExpiryTooltipLink: {
    testId: "dbx-onboarding-link-bgv-data-access-expiry-tooltip",
    description: "Tooltip trigger that explains the BGV data-access expiry behavior",
  } as Locator,

  downloadConfigurationTable: {
    testId: "dbx-onboarding-table-form-download-config",
    description: "Onboarding form download configuration table",
  } as Locator,
} as const;
