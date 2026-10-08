import { Locator } from "../../../common/locators/common";

// ── Page URL ──────────────────────────────────────────────────────────────────
//
// https://forms1.qa.darwinbox.io/ms/formbuilder/survey-manager/{surveyId}/form-selection
//
// This page is the entry-point for attaching a form to a newly created survey.
// The user can:
//   • Start from scratch (blank form → navigates to /builder/{formId})
//   • Use a recommended template card
//   • Reuse an existing form card
//   • Open a full template or form browser via "View All"
//
// Template and form cards do NOT carry individual `data-testid` attributes.
// They are identified via their parent `.select_section` container and
// the `.each_card` CSS class assigned to every card root.
//
// The header and activate/deactivate dialog are shared components that appear
// across all survey-specific builder sub-pages.

export const SurveyManagerFormSelectionLocators = {
  // ── Page container ────────────────────────────────────────────────────────

  page: {
    testId: "dbx-surveys-page-form-selection",
    description: "Root container for the Form Selection page (<form-selection-dashboard>)",
  } as Locator,

  // ── Shared survey header ──────────────────────────────────────────────────
  //
  // The header is rendered by `<survey-new-header>` and carries the survey
  // name, a back-navigation button, and an edit-name icon.

  header: {
    testId: "dbx-surveys-section-header",
    description: "Top header bar shared across all survey-specific builder sub-pages",
  } as Locator,

  headerBackButton: {
    testId: "dbx-surveys-btn-header-back",
    description: "Back navigation dbx-ds-button in the survey header",
  } as Locator,

  headerSurveyName: {
    testId: "dbx-surveys-text-header-survey-name",
    description: "Survey name text element in the header",
  } as Locator,

  headerEditNameIcon: {
    testId: "dbx-surveys-icon-header-edit-name",
    description: "Pencil / edit icon next to the survey name in the header",
  } as Locator,

  // ── Activate / deactivate dialog ──────────────────────────────────────────
  //
  // This `<dbx-ds-dialog>` lives in the DOM but is hidden until the user
  // triggers an activate/deactivate action from elsewhere in the survey flow.

  activateDialog: {
    testId: "dbx-surveys-modal-activate-deactivate",
    description: "Activate / deactivate confirmation dialog (dbx-ds-dialog)",
  } as Locator,

  activateDialogMessage: {
    testId: "dbx-surveys-text-activate-dialog-message",
    description: "Body text inside the activate/deactivate confirmation dialog",
  } as Locator,

  activateDialogCancelButton: {
    testId: "dbx-surveys-btn-activate-dialog-cancel",
    description: "Cancel button inside the activate/deactivate dialog (dbx-ds-button wrapper)",
  } as Locator,

  activateDialogConfirmButton: {
    testId: "dbx-surveys-btn-activate-dialog-confirm",
    description: "Confirm / proceed button inside the activate/deactivate dialog (dbx-ds-button wrapper)",
  } as Locator,

  // ── Create-option cards (top section) ─────────────────────────────────────
  //
  // Two side-by-side option cards let the user choose how to create the form.
  // The AI card is disabled ("Coming Soon") and carries a badge.

  createFromScratchCard: {
    testId: "dbx-surveys-card-create-option-create-new-survey",
    description: "'Start From Scratch' create-option card – clicking opens a blank form in the builder",
  } as Locator,

  createWithAiCard: {
    testId: "dbx-surveys-card-create-option-ai-survey",
    description: "'Create Using AI' create-option card – disabled, shows 'Coming Soon' badge",
  } as Locator,

  createWithAiComingSoonBadge: {
    testId: "dbx-surveys-badge-create-option-coming-soon-ai-survey",
    description: "'Coming Soon' flap badge on the AI create-option card",
  } as Locator,

  // ── Recommended Templates section ─────────────────────────────────────────
  //
  // A `.select_section` container with heading "Recommended Templates".
  // Cards are `<each-template-card>` web components whose root `.each_card`
  // divs do not carry `data-testid` attributes.

  templatesSectionHeading: {
    testId: '[data-testid="dbx-surveys-page-form-selection"] .select_section .section_title:text-is("Recommended Templates")',
    description: "Section heading label 'Recommended Templates'",
  } as Locator,

  templatesViewAllButton: {
    testId: "dbx-surveys-btn-form-selection-templates-view-all",
    description: "'View All' dbx-ds-button in the Recommended Templates section header",
  } as Locator,

  /**
   * All template card root divs within the Recommended Templates section.
   * Scoped to the section that has the "Recommended Templates" heading to
   * avoid matching Existing Forms cards.
   */
  templateCards: {
    testId: '[data-testid="dbx-surveys-page-form-selection"] .section_content.templates-grid .each_card',
    description: "All template card root divs in the Recommended Templates grid",
  } as Locator,

  /**
   * Card title spans within the Recommended Templates section.
   * Each span wraps a `<dbx-text-overflow>` web component.
   * Use `evaluate(el => el.textContent)` to read the displayed title.
   */
  templateCardTitles: {
    testId: '[data-testid="dbx-surveys-page-form-selection"] .section_content.templates-grid .form_title',
    description: "Title <span class='form_title'> elements inside each template card",
  } as Locator,

  // ── Existing Forms section ─────────────────────────────────────────────────
  //
  // A second `.select_section` container with heading "Existing Forms".
  // Uses identical card markup to the Templates section.

  formsSectionHeading: {
    testId: '[data-testid="dbx-surveys-page-form-selection"] .select_section .section_title:text-is("Existing Forms")',
    description: "Section heading label 'Existing Forms'",
  } as Locator,

  formsViewAllButton: {
    testId: "dbx-surveys-btn-form-selection-forms-view-all",
    description: "'View All' dbx-ds-button in the Existing Forms section header",
  } as Locator,

  /**
   * All existing-form card root divs within the Existing Forms section.
   * Scoped via the section heading to avoid matching Template section cards.
   */
  formCards: {
    testId: '[data-testid="dbx-surveys-page-form-selection"] .select_section:has(.section_title:text-is("Existing Forms")) .each_card',
    description: "All form card root divs in the Existing Forms list",
  } as Locator,

  /**
   * Card title spans within the Existing Forms section.
   * Use `evaluate(el => el.textContent)` to read the displayed title.
   */
  formCardTitles: {
    testId: '[data-testid="dbx-surveys-page-form-selection"] .select_section:has(.section_title:text-is("Existing Forms")) .form_title',
    description: "Title <span class='form_title'> elements inside each existing-form card",
  } as Locator,
} as const;
