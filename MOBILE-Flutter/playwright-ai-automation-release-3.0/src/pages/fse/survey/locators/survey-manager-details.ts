import { Locator } from "../../../common/locators/common";

// ── Shared selector helpers ───────────────────────────────────────────────────

/**
 * CSS prefix that scopes a selector into the survey-details-grid.
 * Every field cell in the grid is a `.tw-flex-col` div; Playwright's
 * `:has-text()` narrows it to the cell whose label matches.
 */
const DETAIL_GRID = '[data-testid="dbx-surveys-section-summary-details"] .survey-details-grid';

/**
 * Returns a Locator that targets the outer cell div for a named detail field.
 * The cell structure is:
 *   <div .tw-flex-col>
 *     <div .tw-text-xs>  Field Label  </div>
 *     <div .tw-text-sm>
 *       <dbx-text-overflow>
 *         <div .dbx-overflow-container>
 *           <span .sc-dbx-text-overflow>  Field Value  </span>
 *         </div>
 *       </dbx-text-overflow>
 *     </div>
 *   </div>
 */
export function detailFieldRow(label: string): Locator {
  return {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("${label}")`,
    description: `Survey detail grid cell for the "${label}" field`,
  };
}

/**
 * Returns a Locator that targets the value span for a named detail field.
 * The value is the `<span class="sc-dbx-text-overflow">` inside the cell.
 */
export function detailFieldValue(label: string): Locator {
  return {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("${label}") .sc-dbx-text-overflow`,
    description: `Value span for the "${label}" survey detail field`,
  };
}

export const SurveyManagerDetailsLocators = {
  // ── Page root ──────────────────────────────────────────────────────────────

  page: {
    testId: "dbx-surveys-page-summary",
    description: "Root container for the survey details page",
  } as Locator,

  // ── Header ─────────────────────────────────────────────────────────────────

  headerSection: {
    testId: "dbx-surveys-section-header",
    description: "Header section for the survey details page",
  } as Locator,

  backButton: {
    testId: "dbx-surveys-btn-header-back",
    description: "Back button in the survey details header",
  } as Locator,

  surveyName: {
    testId: "dbx-surveys-text-header-survey-name",
    description: "Survey name text in the survey details header",
  } as Locator,

  /** Pencil icon next to the survey name; clicking it opens the inline rename input. */
  surveyNameEditIcon: {
    testId: "dbx-surveys-icon-header-edit-name",
    description: "Edit-name pencil icon next to the survey name in the header",
  } as Locator,

  analyseSurveyButton: {
    testId: "dbx-surveys-btn-header-analyse-survey",
    description: "Analyse Survey button in the survey details header",
  } as Locator,

  activateDeactivateButton: {
    testId: "dbx-surveys-btn-header-activate-deactivate",
    description: "Activate or deactivate action button in the survey details header",
  } as Locator,

  moreOptionsButton: {
    testId: "dbx-surveys-btn-header-more-options",
    description: "More options button in the survey details header",
  } as Locator,

  // ── Activate / Deactivate dialog ───────────────────────────────────────────

  deactivateDialog: {
    testId: "dbx-surveys-modal-activate-deactivate",
    description: "Activation or deactivation confirmation dialog",
  } as Locator,

  deactivateDialogMessage: {
    testId: "dbx-surveys-text-activate-dialog-message",
    description: "Confirmation message inside the activate or deactivate dialog",
  } as Locator,

  deactivateDialogCancelButton: {
    testId: "dbx-surveys-btn-activate-dialog-cancel",
    description: "Cancel button inside the activate or deactivate dialog",
  } as Locator,

  deactivateDialogConfirmButton: {
    testId: "dbx-surveys-btn-activate-dialog-confirm",
    description: "Confirm button inside the activate or deactivate dialog",
  } as Locator,

  // ── Survey Details section ─────────────────────────────────────────────────

  summarySection: {
    testId: "dbx-surveys-section-summary-details",
    description: "Survey Details card containing all survey metadata fields",
  } as Locator,

  /**
   * "Survey Details" heading text inside the summary card.
   * Scoped to the summary section to avoid matching other 'Survey Details' text.
   */
  summaryDetailsHeading: {
    testId: '[data-testid="dbx-surveys-section-summary-details"] .tw-text-base',
    description: "'Survey Details' section heading inside the summary card",
  } as Locator,

  /** The CSS grid that renders each survey detail field as a label/value pair. */
  surveyDetailsGrid: {
    testId: `${DETAIL_GRID}`,
    description: "CSS grid containing all survey detail label/value cells",
  } as Locator,

  // ── Survey Detail field rows (label + value pairs) ─────────────────────────
  //
  // Each cell is a `.tw-flex-col` div inside `.survey-details-grid`.
  // Use `detailFieldRow(label)` / `detailFieldValue(label)` for ad-hoc access,
  // or the named locators below for the most-used / most-tested fields.

  surveyTitleRow: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Survey Title")`,
    description: "Survey detail cell for the Survey Title field",
  } as Locator,

  surveyTitleValue: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Survey Title") .sc-dbx-text-overflow`,
    description: "Value span for the Survey Title field in survey details",
  } as Locator,

  createdByRow: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Created By")`,
    description: "Survey detail cell for the Created By field",
  } as Locator,

  createdByValue: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Created By") .sc-dbx-text-overflow`,
    description: "Value span for the Created By field in survey details",
  } as Locator,

  createdOnRow: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Created On")`,
    description: "Survey detail cell for the Created On date field",
  } as Locator,

  createdOnValue: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Created On") .sc-dbx-text-overflow`,
    description: "Value span for the Created On date field in survey details",
  } as Locator,

  surveyFormRow: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Survey Form")`,
    description: "Survey detail cell for the Survey Form field",
  } as Locator,

  surveyFormValue: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Survey Form") .sc-dbx-text-overflow`,
    description: "Value span for the Survey Form field in survey details",
  } as Locator,

  surveyAccessPermissionRow: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Survey Access Permission")`,
    description: "Survey detail cell for the Survey Access Permission field",
  } as Locator,

  surveyAccessPermissionValue: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Survey Access Permission") .sc-dbx-text-overflow`,
    description: "Value span for the Survey Access Permission field",
  } as Locator,

  // ── Visible on Engagement Dashboard ───────────────────────────────────────

  /**
   * Outer cell div for the "Visible on Engagement Dashboard" field.
   * testId follows the `dbx-surveys-field-summary-{name}` convention used by
   * every other named field cell in the survey-summary Angular component.
   *
   * CSS fallback (for reference, used before testId was shipped):
   *   `${DETAIL_GRID} .tw-flex-col:has-text("Visible on Engagement Dashboard")`
   */
  dashboardVisibilityRow: {
    testId: "dbx-surveys-field-summary-dashboard-visibility",
    description:
      "Survey detail grid cell for the 'Visible on Engagement Dashboard' field",
  } as Locator,

  /**
   * Read-only text element that shows "Yes" or "No" for dashboard visibility.
   * testId follows the `dbx-surveys-text-summary-{name}` convention used for
   * inline text displays in the survey-summary component.
   *
   * CSS fallback (for reference):
   *   `${DETAIL_GRID} .tw-flex-col:has-text("Visible on Engagement Dashboard") .sc-dbx-text-overflow`
   */
  dashboardVisibilityValueYes: {
    testId: "dbx-surveys-text-quick-info-on-engagement-dashboard-visible",
    description:
      "'Visible on Engagement Dashboard' value element — reads 'Yes'",
  } as Locator,

  dashboardVisibilityValueNo: {
    testId: "dbx-surveys-text-quick-info-on-engagement-dashboard-invisible",
    description:
      "'Visible on Engagement Dashboard' value element — reads 'No'",
  } as Locator,

  // ── Additional survey detail fields ───────────────────────────────────────

  surveyTypeRow: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Survey Type")`,
    description: "Survey detail cell for the Survey Type field (e.g. 'Regular')",
  } as Locator,

  surveyTypeValue: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Survey Type") .sc-dbx-text-overflow`,
    description: "Value span for the Survey Type field",
  } as Locator,

  surveyStartRow: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Survey Start")`,
    description: "Survey detail cell for the Survey Start trigger (e.g. 'Manual')",
  } as Locator,

  surveyStartValue: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Survey Start") .sc-dbx-text-overflow`,
    description: "Value span for the Survey Start field",
  } as Locator,

  surveyEndRow: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Survey End")`,
    description: "Survey detail cell for the Survey End trigger (e.g. 'Manual')",
  } as Locator,

  surveyEndValue: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Survey End") .sc-dbx-text-overflow`,
    description: "Value span for the Survey End field",
  } as Locator,

  startDateTimeRow: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Start Date & Time")`,
    description: "Survey detail cell for the Start Date & Time field",
  } as Locator,

  startDateTimeValue: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("Start Date & Time") .sc-dbx-text-overflow`,
    description: "Value span for the Start Date & Time field",
  } as Locator,

  endDateTimeRow: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("End Date & Time")`,
    description: "Survey detail cell for the End Date & Time field",
  } as Locator,

  endDateTimeValue: {
    testId: `${DETAIL_GRID} .tw-flex-col:has-text("End Date & Time") .sc-dbx-text-overflow`,
    description: "Value span for the End Date & Time field",
  } as Locator,

  // ── Channels section ───────────────────────────────────────────────────────

  channelsSection: {
    testId: "dbx-surveys-section-summary-channels",
    description: "Channels section on the survey details page",
  } as Locator,

  channelsTable: {
    testId: "dbx-surveys-table-summary-channels",
    description: "Channels DataTable on the survey details page",
  } as Locator,

  addChannelButton: {
    testId: "dbx-surveys-btn-summary-add-channel",
    description: "Add channel button in the channels section",
  } as Locator,

  channelSearchInput: {
    testId: 'input[placeholder="Search by Channel Title"]',
    description: "Search field for filtering channels by title",
  } as Locator,

  /** Each data row in the channels table body. */
  channelTableRows: {
    testId: '[data-testid="dbx-surveys-table-summary-channels"] tbody tr.table-row',
    description: "All channel data rows in the channels table",
  } as Locator,

  /** Remind action button on a channel row (use `.first()` or scope to a row). */
  channelRemindButton: {
    testId: 'button:has-text("Remind")',
    description: "Remind action button for a survey channel row",
  } as Locator,

  /** Three-dots context menu button on a channel row. */
  channelContextMenuButton: {
    testId: '[data-testid="dbx-surveys-table-summary-channels"] .btn-action.context_menu',
    description: "Context menu (three-dots) button on a channel row",
  } as Locator,

  // ── Reminder / Invites drawer ──────────────────────────────────────────────

  reminderDrawerCloseButton: {
    testId: "dbx-surveys-btn-invites-close",
    description: "Close button in the reminder drawer header",
  } as Locator,

  reminderDrawerErrors: {
    testId: "dbx-surveys-errors-invites",
    description: "Validation errors container in the reminder drawer",
  } as Locator,

  reminderSendAllCheckbox: {
    testId: "dbx-surveys-checkbox-invites-send-all",
    description: "Checkbox to send reminders to all respondents",
  } as Locator,

  reminderEmailInput: {
    testId: "dbx-surveys-input-invites-reminder-email",
    description: "Reminder email sender address input",
  } as Locator,

  reminderNameInput: {
    testId: "dbx-surveys-input-invites-reminder-name",
    description: "Reminder sender name input",
  } as Locator,

  reminderSubjectEditor: {
    testId: "dbx-surveys-editor-invites-reminder-subject",
    description: "Reminder email subject rich-text editor",
  } as Locator,

  reminderMessageEditor: {
    testId: "dbx-surveys-editor-invites-reminder-message",
    description: "Reminder email body rich-text editor",
  } as Locator,

  reminderBellNotificationTick: {
    testId: "dbx-surveys-tick-invites-bell-enabled",
    description: "Tick indicator for bell notification configuration in the reminder drawer",
  } as Locator,

  /** Bell notification message editor — visible when bell notification is enabled. */
  reminderBellMessageEditor: {
    testId: "dbx-surveys-editor-invites-bell-message",
    description: "Bell notification message rich-text editor in the reminder drawer",
  } as Locator,

  reminderSmsNotificationTick: {
    testId: "dbx-surveys-tick-invites-reminder-sms",
    description: "Tick indicator for SMS notification configuration in the reminder drawer",
  } as Locator,

  reminderWhatsappNotificationTick: {
    testId: "dbx-surveys-tick-invites-reminder-whatsapp",
    description: "Tick indicator for WhatsApp notification configuration in the reminder drawer",
  } as Locator,

  teamsReminderSubjectEditor: {
    testId: "dbx-surveys-editor-invites-teams-reminder-subject",
    description: "Teams reminder subject rich-text editor",
  } as Locator,

  teamsReminderMessageEditor: {
    testId: "dbx-surveys-editor-invites-teams-reminder-message",
    description: "Teams reminder message rich-text editor",
  } as Locator,

  reminderFooterCloseButton: {
    testId: "dbx-surveys-btn-invites-footer-close",
    description: "Close button in the reminder drawer footer",
  } as Locator,

  reminderSaveButton: {
    testId: "dbx-surveys-btn-invites-save-reminder",
    description: "Save button in the reminder drawer footer",
  } as Locator,

  // ── More options menu items ────────────────────────────────────────────────

  moreOptionsPreview: {
    testId: "text=Preview",
    description: "Preview action in the header more-options dropdown menu",
  } as Locator,

  moreOptionsEditClosureDateTime: {
    testId: "text=Edit Closure Date & Time",
    description: "Edit Closure Date and Time action in the more-options menu",
  } as Locator,

  moreOptionsEditSurveyConfigurations: {
    testId: "text=Edit Survey Configurations",
    description: "Edit Survey Configurations action in the more-options menu",
  } as Locator,

  moreOptionsDuplicate: {
    testId: "text=Duplicate",
    description: "Duplicate action in the more-options menu",
  } as Locator,

  // ── Misc text-based helpers ────────────────────────────────────────────────

  channelsHeading: {
    testId: "text=Channels",
    description: "Heading text for the channels section",
  } as Locator,

  reminderNotificationsTab: {
    testId: "text=Reminder Notifications",
    description: "Reminder Notifications tab inside the reminder drawer",
  } as Locator,

  teamsReminderNotificationsTab: {
    testId: "text=Teams Reminder Notification",
    description: "Teams Reminder Notification tab inside the reminder drawer",
  } as Locator,
};
