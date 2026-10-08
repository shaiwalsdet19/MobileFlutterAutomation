import { Locator } from "../../../common/locators/common";

/**
 * Left-panel main tab that toggles between the question list and
 * the multi-language customise view.
 */
export type BuilderMainTab = "questions" | "customise";

/**
 * Right-panel question-editor tab.
 * Shown once a question is selected in the left panel.
 */
export type QuestionEditorTab = "editor" | "logic" | "viewer";

/** Display labels for the left-panel main tabs (exact text on the live page). */
export const BuilderMainTabLabels: Record<BuilderMainTab, string> = {
  questions: "QUESTIONS",
  customise: "CUSTOMISE",
};

/** Display labels for the right-panel question-editor tabs. */
export const QuestionEditorTabLabels: Record<QuestionEditorTab, string> = {
  editor: "EDITOR",
  logic: "LOGIC",
  viewer: "VIEWER",
};

export const SurveyManagerBuilderLocators = {
  // ── Page root ──────────────────────────────────────────────────────────────

  /**
   * Root Angular component rendered at
   * `/ms/formbuilder/survey-manager/{surveyId}/builder/{formId}`.
   * Acts as the outermost stable anchor for all builder selectors.
   */
  page: {
    testId: "builder-parent",
    description: "Root Angular component for the survey form builder page",
  } as Locator,

  // ── Header ─────────────────────────────────────────────────────────────────

  header: {
    testId: "builder-parent form-header",
    description:
      "Form header containing back button, survey title, draft status, " +
      "preview, activate, save, and stepper controls",
  } as Locator,

  /**
   * Survey title text div in the header left section.
   * Uses the adjacent-sibling combinator to target the div that follows the
   * back button (`dbx-ds-button`) inside `.header-left-items`.
   */
  surveyTitle: {
    testId: ".header-left-items dbx-ds-button + div",
    description: "Survey title display in the header (non-editable; shows survey name)",
  } as Locator,

  backButton: {
    testId: ".header-left-items dbx-ds-button",
    description: "Back navigation button (chevron-left icon) in the header",
  } as Locator,

  /** Shows 'Saved As Draft' when the form has unpublished changes. */
  savedAsDraftBadge: {
    testId: ".draft-div db-typography",
    description: "'Saved As Draft' status label in the header right area",
  } as Locator,

  previewButton: {
    testId: ".preview-div dbx-ds-button",
    description: "Preview button (eye icon) in the header right area",
  } as Locator,

  activateButton: {
    testId: ".activate-div dbx-ds-button",
    description: "Activate / Deactivate button in the header right area",
  } as Locator,

  /**
   * Save button rendered inside `db-button.save_btn`.
   * The outer wrapper carries Tailwind sizing classes; the inner `<button>` is
   * the actual interactive element and is what Playwright must target.
   */
  saveButton: {
    testId: ".save_btn button",
    description: "Save survey button in the header (inside db-button.save_btn wrapper)",
  } as Locator,

  /**
   * `dbx-ds-stepper` component that visualises the builder workflow steps
   * (e.g. Build → Configure → Preview) displayed below the header toolbar.
   */
  stepper: {
    testId: ".survey-stepper-container dbx-ds-stepper",
    description: "Builder workflow stepper in the header area",
  } as Locator,

  // ── Left panel — main tab group (QUESTIONS / CUSTOMISE) ───────────────────

  mainTabGroup: {
    testId: "tabset.question-tabs",
    description: "Left-panel tab group switching between QUESTIONS and CUSTOMISE tabs",
  } as Locator,

  questionsTab: {
    testId: 'tabset.question-tabs a.nav-link:has(span:text-is("QUESTIONS"))',
    description: "QUESTIONS tab label in the left-panel main tab group",
  } as Locator,

  customiseTab: {
    testId: 'tabset.question-tabs a.nav-link:has(span:text-is("CUSTOMISE"))',
    description: "CUSTOMISE tab label in the left-panel main tab group (multi-language settings)",
  } as Locator,

  // ── Left panel — Question search ───────────────────────────────────────────

  questionSearchInput: {
    testId: ".fl-heading3-content input.search",
    description: "Search input for filtering questions in the left panel",
  } as Locator,

  // ── Left panel — Sections and questions list ───────────────────────────────

  sectionsContainer: {
    testId: "#all-pages-questions-container",
    description: "Scroll container holding all section blocks in the form builder",
  } as Locator,

  sectionContainers: {
    testId: "#all-pages-questions-container .root-page-container",
    description: "Each section block (header row + collapsible question list)",
  } as Locator,

  sectionTitle: {
    testId: ".page-counter db-typography.body.defaultText",
    description: "Section title text (e.g. 'Section 1') inside the section header",
  } as Locator,

  sectionCollapseToggle: {
    testId: ".page-counter .flex-row .collapse-icon-padding",
    description: "Collapse / expand icon in the section header row",
  } as Locator,

  sectionContextMenu: {
    testId: ".page-counter .icons.dropdown",
    description: "Section-level context menu (three-dots) in the section header",
  } as Locator,

  /**
   * All question rows across every section.
   * To scope to a specific section, scope the locator to a `.root-page-container`
   * nth element first, then look for `.each-question.flex-row` within it.
   */
  sectionQuestions: {
    testId: ".each-page-selector .each-question.flex-row",
    description: "Question row items inside a section's collapsible question list",
  } as Locator,

  /**
   * The currently selected / highlighted question in the left panel.
   * Used to confirm a question is active in the editor.
   */
  selectedQuestion: {
    testId: ".question-wrapper.selected",
    description: "Currently selected question (highlighted) in the left panel",
  } as Locator,

  questionContextMenu: {
    testId: ".question-wrapper .icons.dropdown.dropleft",
    description: "Question-level context menu (three-dots) on a question row",
  } as Locator,

  // ── Left panel — Footer action buttons ────────────────────────────────────

  addSectionButton: {
    testId: "db-button.new-page-btn button",
    description: "'+ ADD Section' button in the left-panel footer",
  } as Locator,

  addQuestionButton: {
    testId: "db-button.add-question-btn button",
    description: "'+ ADD QUESTION' button in the left-panel footer",
  } as Locator,

  // ── Right panel — Editor tab group (EDITOR / LOGIC / VIEWER) ──────────────

  editorTabGroup: {
    testId: "questions-wrapper tabset",
    description: "Right-panel tab group for per-question editing (EDITOR, LOGIC, VIEWER)",
  } as Locator,

  editorTab: {
    testId: 'questions-wrapper .nav-link:has(span:text-is("EDITOR"))',
    description: "EDITOR tab in the right panel (edits question content and options)",
  } as Locator,

  logicTab: {
    testId: 'questions-wrapper .nav-link:has(span:text-is("LOGIC"))',
    description: "LOGIC tab in the right panel (defines conditional branching logic)",
  } as Locator,

  viewerTab: {
    testId: 'questions-wrapper .nav-link:has(span:text-is("VIEWER"))',
    description: "VIEWER tab in the right panel (previews how the question renders)",
  } as Locator,

  // ── Right panel — Question metadata bar ───────────────────────────────────

  questionIdLabel: {
    testId: ".headerSection db-typography.body.appGrayText",
    description:
      "Question ID label in the right-panel header (e.g. 'ID: f1')",
  } as Locator,

  questionTypeLabel: {
    testId: ".headerSection db-typography.body.slateGrayText",
    description: "Question type label in the right-panel header (e.g. 'Question type:')",
  } as Locator,

  questionTypeSwitch: {
    testId: ".headerSection .flex-row.switch-label",
    description: "Question type toggle options in the right-panel metadata bar",
  } as Locator,

  // ── Right panel — Editor content area ─────────────────────────────────────

  editorWrapper: {
    testId: "editor-wrapper",
    description: "Angular component wrapping the active question's editor form",
  } as Locator,

  editorContentArea: {
    testId: ".take-avalible-space.overflow-auto.root-padding",
    description: "Scrollable editor content area inside the right panel",
  } as Locator,

  // ── Right panel — Survey pillar slider ────────────────────────────────────

  pillarSliderPanel: {
    testId: "app-survey-pillar-slider-edior .slider-container",
    description: "Survey pillar / dimension assignment slider panel in the right panel",
  } as Locator,

  pillarSliderSaveButton: {
    testId: ".survey-pillar-footer .btn-primary",
    description: "Save button in the survey pillar slider footer",
  } as Locator,

  // ── CUSTOMISE tab ─────────────────────────────────────────────────────────

  addLanguageButton: {
    testId: 'button:has-text("Add Language")',
    description: "Add Language button inside the CUSTOMISE tab",
  } as Locator,

  customiseSaveButton: {
    testId: '.tab-content tab.active .btn.btn-primary',
    description: "Save button inside the active CUSTOMISE tab content",
  } as Locator,

  // ── Confirmation modal — questions reordered ───────────────────────────────

  moveQuestionsModal: {
    testId: '.modal:has(.modal-body:has-text("Questions have been moved"))',
    description:
      "Confirmation modal shown when questions are reordered via drag-and-drop",
  } as Locator,

  moveQuestionsModalCancelButton: {
    testId: '.modal:has(.modal-body:has-text("Questions have been moved")) .btn-secondary',
    description: "Cancel button in the 'questions moved' modal",
  } as Locator,

  moveQuestionsModalContinueButton: {
    testId: '.modal:has(.modal-body:has-text("Questions have been moved")) .btn-primary',
    description: "Continue button in the 'questions moved' modal",
  } as Locator,

  // ── Confirmation modal — section delete ────────────────────────────────────

  deleteSectionModal: {
    testId: '.modal:has(.modal-body:has-text("Deleting this section"))',
    description:
      "Confirmation modal for section deletion (questions are retained and moved out)",
  } as Locator,

  deleteSectionModalCancelButton: {
    testId: '.modal:has(.modal-body:has-text("Deleting this section")) .btn-secondary',
    description: "Cancel button in the delete-section modal",
  } as Locator,

  deleteSectionModalDeleteButton: {
    testId: '.modal:has(.modal-body:has-text("Deleting this section")) .btn-primary',
    description: "Delete button in the delete-section modal",
  } as Locator,

  // ── Confirmation modal — question type change ──────────────────────────────

  changeQuestionTypeModal: {
    testId: '.modal:has(.modal-body:has-text("change the Question Type"))',
    description:
      "Warning modal shown when the question type is changed (configurations will be lost)",
  } as Locator,

  changeQuestionTypeModalCancelButton: {
    testId: '.modal:has(.modal-body:has-text("change the Question Type")) .btn-secondary',
    description: "Cancel button in the change-question-type modal",
  } as Locator,

  changeQuestionTypeModalProceedButton: {
    testId: '.modal:has(.modal-body:has-text("change the Question Type")) .btn-primary',
    description: "Proceed button in the change-question-type modal",
  } as Locator,

  // ── Confirmation modal — bulk question delete ──────────────────────────────

  deleteQuestionsModal: {
    testId: '.modal:has(.modal-body:has-text("delete the selected questions"))',
    description: "Confirmation modal for bulk deletion of selected questions",
  } as Locator,

  deleteQuestionsModalCancelButton: {
    testId: '.modal:has(.modal-body:has-text("delete the selected questions")) .btn-secondary',
    description: "Cancel button in the bulk-delete questions modal",
  } as Locator,

  deleteQuestionsModalConfirmButton: {
    testId: '.modal:has(.modal-body:has-text("delete the selected questions")) .btn-primary',
    description: "'Yes, Continue' button in the bulk-delete questions modal",
  } as Locator,

  // ── Discard changes dialog ─────────────────────────────────────────────────

  discardDialog: {
    testId: "discard-dialog dbx-ds-dialog",
    description:
      "Discard-changes dialog shown when navigating away with unsaved edits " +
      "('Edits to Survey are yet to be saved.')",
  } as Locator,

  discardDialogSubText: {
    testId: "discard-dialog .dialog-sub-text",
    description: "Sub-text in the discard dialog describing the unsaved state",
  } as Locator,

  discardDialogStayButton: {
    testId: "discard-dialog app-common-button:first-of-type dbx-ds-button",
    description: "Stay button in the discard dialog (continue editing)",
  } as Locator,

  discardDialogLeaveButton: {
    testId: "discard-dialog app-common-button:last-of-type dbx-ds-button",
    description: "Leave button in the discard dialog (discard changes and navigate away)",
  } as Locator,
} as const;
