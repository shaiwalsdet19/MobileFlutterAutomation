import { Locator } from "../../../common/locators/common";

// ── Background color types ────────────────────────────────────────────────────

/**
 * Preset background color keys as used in the DOM card indices.
 * Index order matches the live page: 0–7.
 */
export type BackgroundColor =
  | "darwinBlue"
  | "amberBlue"
  | "coralRed"
  | "crimsonRed"
  | "bloomViolet"
  | "aquaTeal"
  | "springGreen"
  | "greyCharcoal";

/** Human-readable labels as they appear on each background card. */
export const BackgroundColorLabels: Record<BackgroundColor, string> = {
  darwinBlue: "Darwin Blue",
  amberBlue: "Amber Blue",
  coralRed: "Coral Red",
  crimsonRed: "Crimson Red",
  bloomViolet: "Bloom Violet",
  aquaTeal: "Aqua Teal",
  springGreen: "Spring Green",
  greyCharcoal: "Grey/Charcoal",
};

/** DOM card index for each background color (used to build `dbx-surveys-card-background-{n}`). */
export const BackgroundColorIndex: Record<BackgroundColor, number> = {
  darwinBlue: 0,
  amberBlue: 1,
  coralRed: 2,
  crimsonRed: 3,
  bloomViolet: 4,
  aquaTeal: 5,
  springGreen: 6,
  greyCharcoal: 7,
};

// ── Locators ──────────────────────────────────────────────────────────────────

export const SurveyManagerConfigurationLocators = {
  // ── Page-level ────────────────────────────────────────────────────────────

  page: {
    testId: "dbx-surveys-page-configurations",
    description: "Root container for the survey configuration page",
  } as Locator,

  errorsContainer: {
    testId: "dbx-surveys-errors-config",
    description: "Validation errors container shown at the top of the configuration form",
  } as Locator,

  // ── Header ────────────────────────────────────────────────────────────────

  headerSection: {
    testId: "dbx-surveys-section-header",
    description: "Page header section containing the survey title, navigation buttons, and stepper",
  } as Locator,

  backButton: {
    testId: "dbx-surveys-btn-header-back",
    description: "Back button in the configuration page header — navigates to the survey list",
  } as Locator,

  surveyNameText: {
    testId: "dbx-surveys-text-header-survey-name",
    description: "Survey name display text in the configuration page header",
  } as Locator,

  editNameIcon: {
    testId: "dbx-surveys-icon-header-edit-name",
    description: "Edit survey name icon button in the header (inline rename)",
  } as Locator,

  previousButton: {
    testId: "dbx-surveys-btn-header-previous",
    description: "Previous step button in the header — navigates to the prior creation step",
  } as Locator,

  nextButton: {
    testId: "dbx-surveys-btn-header-next",
    description: "Next step button in the header — advances to the next creation step",
  } as Locator,

  moreOptionsButton: {
    testId: "dbx-surveys-btn-header-more-options",
    description: "More options overflow menu button in the configuration page header",
  } as Locator,

  stepper: {
    testId: "dbx-surveys-stepper-survey-creation",
    description: "Survey creation stepper (dbx-ds-stepper) that tracks progress through configuration steps",
  } as Locator,

  // ── Activate / Deactivate dialog ──────────────────────────────────────────
  //
  // The dialog is present in the DOM from page load but hidden until triggered.

  activateDialog: {
    testId: "dbx-surveys-modal-activate-deactivate",
    description: "Activation / deactivation confirmation dialog (dbx-ds-dialog)",
  } as Locator,

  activateDialogMessage: {
    testId: "dbx-surveys-text-activate-dialog-message",
    description: "Confirmation message inside the activate / deactivate dialog",
  } as Locator,

  activateDialogCancelButton: {
    testId: "dbx-surveys-btn-activate-dialog-cancel",
    description: "Cancel button inside the activate / deactivate dialog",
  } as Locator,

  activateDialogConfirmButton: {
    testId: "dbx-surveys-btn-activate-dialog-confirm",
    description: "Confirm button inside the activate / deactivate dialog",
  } as Locator,

  // ── Survey Details section ────────────────────────────────────────────────

  surveyDetailsSection: {
    testId: "dbx-surveys-section-config-details",
    description: "Survey Details section containing the form name input and privacy type selection",
  } as Locator,

  formNameInput: {
    testId: "dbx-surveys-input-config-form-name",
    description: "Survey / form name text input (dbx-ds-text-input web component) — inner <input> is in Shadow DOM",
  } as Locator,

  privacyTypeRadio: {
    testId: "dbx-surveys-radio-config-privacy-type",
    description: "Privacy type radio group (dbx-ds-radio) — options: Regular / Confidential",
  } as Locator,

  // ── Access Permissions section ────────────────────────────────────────────

  accessPermissionsSection: {
    testId: "dbx-surveys-section-config-permissions",
    description: "Outer Access Permissions section container",
  } as Locator,

  accessComponent: {
    testId: "dbx-surveys-component-config-access",
    description: "survey-access custom element that houses the full access permissions UI",
  } as Locator,

  accessPermissionsInnerSection: {
    testId: "dbx-surveys-section-access-permissions",
    description: "Inner Access Permissions section rendered inside the survey-access component",
  } as Locator,

  accessAddMenuButton: {
    testId: "dbx-surveys-btn-access-add-menu",
    description: "Add button / dropdown trigger for adding access rules in the Access Permissions section",
  } as Locator,

  // ── Advance Settings section ──────────────────────────────────────────────

  advancedSettingsSection: {
    testId: "dbx-surveys-section-config-advanced",
    description: "Advance Settings section with feature toggles and respondent configuration dropdowns",
  } as Locator,

  autoSaveCheckbox: {
    testId: "dbx-surveys-checkbox-config-auto-save",
    description: "Auto Save toggle (dbx-ds-tick) in Advance Settings",
  } as Locator,

  partialResponseCheckbox: {
    testId: "dbx-surveys-checkbox-config-partial-response",
    description: "Allow Partial Response toggle (dbx-ds-tick) in Advance Settings",
  } as Locator,

  aiFollowupsCheckbox: {
    testId: "dbx-surveys-checkbox-config-ai-followups",
    description: "AI Follow-ups toggle (dbx-ds-tick) in Advance Settings",
  } as Locator,

  editAfterSubmitCheckbox: {
    testId: "dbx-surveys-checkbox-config-edit-after-submit",
    description: "Allow Edit After Submit toggle (dbx-ds-tick) in Advance Settings",
  } as Locator,

  additionalFieldsDropdown: {
    testId: "dbx-surveys-dropdown-config-additional-fields",
    description: "Additional Fields dropdown (dbx-ds-dropdown) in Advance Settings",
  } as Locator,

  excludeRespondentsDropdown: {
    testId: "dbx-surveys-dropdown-config-exclude-respondents",
    description: "Exclude Respondents dropdown (dbx-ds-dropdown) in Advance Settings",
  } as Locator,

  privacyPromiseCheckbox: {
    testId: "dbx-surveys-checkbox-config-privacy-promise",
    description: "Privacy Promise toggle (dbx-ds-tick) in Advance Settings",
  } as Locator,

  privacyPromiseAlert: {
    testId: "dbx-surveys-alert-config-privacy-promise",
    description: "Privacy Promise informational alert (dbx-ds-alert) shown when the privacy promise option is enabled",
  } as Locator,

  // ── Background section ────────────────────────────────────────────────────

  backgroundSection: {
    testId: "dbx-surveys-section-config-background",
    description: "Background section outer container — contains both preset color cards and the custom image upload",
  } as Locator,

  backgroundComponent: {
    testId: "dbx-surveys-component-config-background",
    description: "select-survey-background custom element that houses the full background selection UI",
  } as Locator,

  backgroundForm: {
    testId: "dbx-surveys-form-background",
    description: "Form element wrapping all background selection options",
  } as Locator,

  backgroundTypeRadio: {
    testId: "dbx-surveys-radio-background-type",
    description: "Background type radio group (dbx-ds-radio) — toggles between preset color and custom upload",
  } as Locator,

  backgroundImagesSection: {
    testId: "dbx-surveys-section-background-images",
    description: "Section listing the eight preset background color cards",
  } as Locator,

  /**
   * Custom background image upload input.
   * Hidden until the 'custom' background type is selected.
   */
  backgroundUploadInput: {
    testId: "dbx-surveys-input-background-upload",
    description: "Custom background image upload attachment input (dbx-ds-attachment) — visible only when custom type is active",
  } as Locator,

  // ── Dynamic background card locators ─────────────────────────────────────

  /** Returns the locator for a specific preset background color card. */
  backgroundColorCard: (color: BackgroundColor): Locator => ({
    testId: `dbx-surveys-card-background-${BackgroundColorIndex[color]}`,
    description: `Preset background color card: '${BackgroundColorLabels[color]}'`,
  }),
} as const;
