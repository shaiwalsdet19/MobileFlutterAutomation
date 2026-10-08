import { Locator } from "../../../common/locators/common";

// ── Page URL ──────────────────────────────────────────────────────────────────
//
// https://forms1.qa.darwinbox.io/ms/formbuilder/survey-manager/{surveyId}/summary
//
// This is the final step of the survey creation wizard (step 4 of 4).
// It presents a read-only overview of the survey configuration and allows
// the Admin to activate the survey or navigate back.
//
// Page sections:
//   1. Shared survey header  (back, previous, activate split-button, more-options, stepper)
//   2. Survey Details card   (label/value grid: title, creator, form, type, dates, etc.)
//   3. Channels card         (dbox-table listing all configured channels)
//   4. Activate/deactivate confirmation dialog  (shared – hidden by default)
//   5. Invites / reminder panel  (in DOM by default, opened from the channels table)
//
// The Survey Details grid fields do NOT carry data-testid attributes.
// They are accessed via CSS selectors scoped to `.survey-details-grid`.

/**
 * Known field labels in the Survey Details grid, as they appear in the live DOM.
 * Used by the `getSurveyDetailValue` page helper.
 */
export const SurveyDetailFieldLabels = {
  surveyTitle: "Survey Title",
  createdBy: "Created By",
  createdOn: "Created On",
  surveyForm: "Survey Form",
  accessPermission: "Survey Access Permission",
  surveyType: "Survey Type",
  surveyStart: "Survey Start",
  surveyEnd: "Survey End",
  startDateTime: "Start Date & Time",
  endDateTime: "End Date & Time",
} as const;

export type SurveyDetailField = keyof typeof SurveyDetailFieldLabels;

export const SurveyManagerSummaryLocators = {
  // ── Page container ────────────────────────────────────────────────────────

  page: {
    testId: "dbx-surveys-page-summary",
    description: "Root container for the Summary page (<survey-summary> component)",
  } as Locator,

  // ── Shared survey header ──────────────────────────────────────────────────
  //
  // The Summary page is the last wizard step (step 4) – it has:
  //   • Back button (always)
  //   • Previous button  (goes back to Channels)
  //   • Activate split-button  (primary action; label changes to "Deactivate" when active)
  //   • More-options overflow button

  header: {
    testId: "dbx-surveys-section-header",
    description: "Top header bar shared across all survey-builder sub-pages",
  } as Locator,

  headerBackButton: {
    testId: "dbx-surveys-btn-header-back",
    description: "Back navigation dbx-ds-button in the survey header",
  } as Locator,

  headerSurveyName: {
    testId: "dbx-surveys-text-header-survey-name",
    description: "Survey name text in the header",
  } as Locator,

  headerEditNameIcon: {
    testId: "dbx-surveys-icon-header-edit-name",
    description: "Edit-name pencil icon in the header",
  } as Locator,

  headerPreviousButton: {
    testId: "dbx-surveys-btn-header-previous",
    description: "Previous step dbx-ds-button (returns to Channels step)",
  } as Locator,

  /**
   * The primary activate/deactivate action split-button (dbx-ds-button wrapper).
   * The button label changes between "Activate" (draft) and "Deactivate" (active).
   */
  headerActivateButton: {
    testId: "dbx-surveys-btn-header-activate-deactivate",
    description: "Activate/Deactivate split-button dbx-ds-button wrapper in the header",
  } as Locator,

  /**
   * The inner `<button>` element that shows the Activate / Deactivate label text.
   * Use this for reading the button text or clicking the primary action.
   */
  headerActivateNativeButton: {
    testId: "dbx-surveys-btn-header-activate-deactivate-button",
    description: "Native <button> inside the Activate/Deactivate split-button (shows 'Activate' or 'Deactivate')",
  } as Locator,

  /**
   * The split caret button that opens the dropdown menu on the Activate button.
   */
  headerActivateSplitCaret: {
    testId: "dbx-surveys-btn-header-activate-deactivate-split-button",
    description: "Caret / dropdown-trigger button on the Activate split-button",
  } as Locator,

  /**
   * The dropdown menu that opens when the split caret is clicked.
   */
  headerActivateMenu: {
    testId: "dbx-surveys-btn-header-activate-deactivate-menu",
    description: "dbx-ds-menu opened by the Activate split-button caret",
  } as Locator,

  headerMoreOptionsButton: {
    testId: "dbx-surveys-btn-header-more-options",
    description: "Three-dot overflow menu dbx-ds-button in the header",
  } as Locator,

  headerMoreOptionsMenu: {
    testId: "dbx-surveys-btn-header-more-options-menu",
    description: "dbx-ds-menu opened by the More Options button",
  } as Locator,

  // ── Survey creation stepper ───────────────────────────────────────────────

  stepper: {
    testId: "dbx-surveys-stepper-survey-creation",
    description: "4-step survey creation stepper (Questions → Configurations → Channels → Summary)",
  } as Locator,

  // ── Activate / deactivate confirmation dialog ─────────────────────────────
  //
  // Pre-rendered in DOM; becomes visible when Activate is clicked.

  activateDialog: {
    testId: "dbx-surveys-modal-activate-deactivate",
    description: "Activate/deactivate confirmation dialog (dbx-ds-dialog)",
  } as Locator,

  activateDialogMessage: {
    testId: "dbx-surveys-text-activate-dialog-message",
    description: "Body message inside the activate/deactivate confirmation dialog",
  } as Locator,

  activateDialogCancelButton: {
    testId: "dbx-surveys-btn-activate-dialog-cancel",
    description: "Cancel button inside the activate/deactivate dialog",
  } as Locator,

  activateDialogConfirmButton: {
    testId: "dbx-surveys-btn-activate-dialog-confirm",
    description: "Confirm button inside the activate/deactivate dialog",
  } as Locator,

  // ── Survey Details card ───────────────────────────────────────────────────
  //
  // A `summary-common-container` card containing a label/value grid.
  // Individual field cells do NOT carry data-testid attributes.

  detailsSection: {
    testId: "dbx-surveys-section-summary-details",
    description: "Survey Details card container (holds the label/value grid)",
  } as Locator,

  /**
   * All field cells within the Survey Details grid.
   * Each cell is a `div.tw-flex.tw-flex-col.tw-gap-2` containing a label and a value.
   * Use with `.nth(index)` or iterate in `getSurveyDetailValue()`.
   */
  detailFieldCells: {
    testId: '[data-testid="dbx-surveys-section-summary-details"] .survey-details-grid > .tw-flex.tw-flex-col',
    description: "Individual field cells in the Survey Details grid (label + value pairs)",
  } as Locator,

  /**
   * Label `<div>` elements inside each detail field cell.
   * Text content matches entries in `SurveyDetailFieldLabels` (trimmed).
   */
  detailFieldLabels: {
    testId: '[data-testid="dbx-surveys-section-summary-details"] .tw-text-xs.tw-text-\\[\\#6D829C\\]',
    description: "Label div elements in the Survey Details grid (grey, small text)",
  } as Locator,

  /**
   * Value wrapper `<div>` elements inside each detail field cell.
   * The actual text lives in `span#dbx-overflow-span` inside `dbx-text-overflow`.
   */
  detailFieldValues: {
    testId: '[data-testid="dbx-surveys-section-summary-details"] .tw-text-sm.tw-text-\\[\\#212831\\]',
    description: "Value div elements in the Survey Details grid (dark, medium text)",
  } as Locator,

  // ── Channels card ─────────────────────────────────────────────────────────

  channelsSection: {
    testId: "dbx-surveys-section-summary-channels",
    description: "Channels card container (holds the channels dbox-table)",
  } as Locator,

  channelsTable: {
    testId: "dbx-surveys-table-summary-channels",
    description: "Channels dbox-table listing all configured channels for this survey",
  } as Locator,

  /**
   * Search input inside the channels table toolbar.
   * No data-testid; the actual `<input>` lives inside the Shadow DOM of the
   * `<dbx-ds-text-input>` custom element, so we target the host element
   * by its `placeholder` attribute (which is set on the host itself).
   */
  channelsTableSearchInput: {
    testId: '[data-testid="dbx-surveys-table-summary-channels"] dbx-ds-text-input[placeholder="Search by Channel Title"]',
    description: "dbx-ds-text-input search host inside the channels table (placeholder attr on the host, input inside Shadow DOM)",
  } as Locator,

  /**
   * Table rows inside the channels table body.
   * Used to count channels and read per-row data.
   */
  channelsTableRows: {
    testId: '[data-testid="dbx-surveys-table-summary-channels"] tbody tr.table-row',
    description: "Data rows in the channels table body",
  } as Locator,

  // ── Invites / reminder notification panel ─────────────────────────────────
  //
  // This panel contains reminder notification settings. It appears to be
  // accessible from channel row actions in the channels table.
  // All elements are pre-rendered in the DOM but hidden until the panel opens.

  invitesCloseButton: {
    testId: "dbx-surveys-btn-invites-close",
    description: "× close button in the Invites/Reminder panel header",
  } as Locator,

  invitesFooterCloseButton: {
    testId: "dbx-surveys-btn-invites-footer-close",
    description: "Close button in the Invites/Reminder panel footer",
  } as Locator,

  invitesSaveReminderButton: {
    testId: "dbx-surveys-btn-invites-save-reminder",
    description: "Save reminder button in the Invites/Reminder panel footer",
  } as Locator,

  invitesSendAllCheckbox: {
    testId: "dbx-surveys-checkbox-invites-send-all",
    description: "'Send All' checkbox inside the Invites/Reminder panel",
  } as Locator,

  invitesReminderNameInput: {
    testId: "dbx-surveys-input-invites-reminder-name",
    description: "Reminder channel name input in the Invites panel (dbx-ds-text-input)",
  } as Locator,

  invitesReminderEmailInput: {
    testId: "dbx-surveys-input-invites-reminder-email",
    description: "Reminder reply-to email input in the Invites panel (dbx-ds-text-input)",
  } as Locator,

  invitesBellEnabledTick: {
    testId: "dbx-surveys-tick-invites-bell-enabled",
    description: "Bell notification enabled tick in the Invites panel",
  } as Locator,

  invitesReminderSmsTick: {
    testId: "dbx-surveys-tick-invites-reminder-sms",
    description: "SMS reminder enabled tick in the Invites panel",
  } as Locator,

  invitesReminderWhatsAppTick: {
    testId: "dbx-surveys-tick-invites-reminder-whatsapp",
    description: "WhatsApp reminder enabled tick in the Invites panel",
  } as Locator,

  invitesErrors: {
    testId: "dbx-surveys-errors-invites",
    description: "Validation errors container inside the Invites panel",
  } as Locator,

  invitesBellMessageEditor: {
    testId: "dbx-surveys-editor-invites-bell-message",
    description: "Bell notification message rich-text editor in the Invites panel",
  } as Locator,

  invitesReminderSubjectEditor: {
    testId: "dbx-surveys-editor-invites-reminder-subject",
    description: "Reminder email subject rich-text editor in the Invites panel",
  } as Locator,

  invitesReminderMessageEditor: {
    testId: "dbx-surveys-editor-invites-reminder-message",
    description: "Reminder email message body rich-text editor in the Invites panel",
  } as Locator,

  invitesTeamsReminderSubjectEditor: {
    testId: "dbx-surveys-editor-invites-teams-reminder-subject",
    description: "Teams reminder notification subject editor in the Invites panel",
  } as Locator,

  invitesTeamsReminderMessageEditor: {
    testId: "dbx-surveys-editor-invites-teams-reminder-message",
    description: "Teams reminder notification message body editor in the Invites panel",
  } as Locator,
} as const;
