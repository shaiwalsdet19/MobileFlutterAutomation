import { Locator } from "../../../common/locators/common";

// ── Page URL ──────────────────────────────────────────────────────────────────
//
// https://forms1.qa.darwinbox.io/ms/formbuilder/survey-manager/{surveyId}/channels
//
// This is the "Add Channel" configuration page within the survey creation
// wizard. It presents a multi-step stepper (Questions → Configurations →
// Channels → Summary) and an inline form to define a new distribution channel.
//
// Key sections on the page:
//   1. Shared survey header  (back, previous, next, more-options, stepper)
//   2. Add Channel form      (channel name, respondent type, response type,
//                             include/exclude respondents, auth, auto-reminder,
//                             share modes, respondent-summary panel)
//   3. Invites / notification panel  (opened via the Email/Teams "Configure")
//   4. Activate / deactivate dialog  (shared – hidden by default)
//
// Share-mode rows (Email, Teams, WhatsApp, SMS) do NOT carry data-testid.
// They are identified with CSS selectors scoped to the page container.

export const SurveyManagerChannelsLocators = {
  // ── Page container ────────────────────────────────────────────────────────

  page: {
    testId: "dbx-surveys-page-add-channel",
    description: "Root container for the Add Channel form page (<new-add-channel>)",
  } as Locator,

  // ── Shared survey header ──────────────────────────────────────────────────
  //
  // Rendered by <survey-new-header>. The same component appears on every
  // survey-builder sub-page (form-selection, channels, summary, builder).

  header: {
    testId: "dbx-surveys-section-header",
    description: "Top header bar for all survey-builder sub-pages",
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
    description: "Previous step dbx-ds-button in the header actions area",
  } as Locator,

  headerNextButton: {
    testId: "dbx-surveys-btn-header-next",
    description: "Next step dbx-ds-button in the header actions area",
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
  //
  // A dbx-ds-stepper showing 4 steps rendered inside a Shadow DOM:
  //   Questions → Configurations → Channels → Summary

  stepper: {
    testId: "dbx-surveys-stepper-survey-creation",
    description: "Survey creation progress stepper (Questions / Configurations / Channels / Summary)",
  } as Locator,

  // ── Activate / deactivate dialog ──────────────────────────────────────────
  //
  // Present in the DOM (hidden by default). Triggered by activating the survey.

  activateDialog: {
    testId: "dbx-surveys-modal-activate-deactivate",
    description: "Activate / deactivate confirmation dialog (dbx-ds-dialog)",
  } as Locator,

  activateDialogMessage: {
    testId: "dbx-surveys-text-activate-dialog-message",
    description: "Body text inside the activate/deactivate dialog",
  } as Locator,

  activateDialogCancelButton: {
    testId: "dbx-surveys-btn-activate-dialog-cancel",
    description: "Cancel button inside the activate/deactivate dialog",
  } as Locator,

  activateDialogConfirmButton: {
    testId: "dbx-surveys-btn-activate-dialog-confirm",
    description: "Confirm button inside the activate/deactivate dialog",
  } as Locator,

  // ── Add Channel form – top-level ──────────────────────────────────────────

  formErrors: {
    testId: "dbx-surveys-errors-add-channel",
    description: "dbx-ds-errors component that shows channel-form validation messages",
  } as Locator,

  channelNameInput: {
    testId: "dbx-surveys-input-channel-name",
    description: "Channel name dbx-ds-text-input web component (outer host element)",
  } as Locator,

  /**
   * Inner `<input>` pierced through the dbx-ds-text-input Shadow DOM.
   * Use for `.fill()` calls — do NOT use for `.toBeVisible()` assertions.
   */
  channelNameNativeInput: {
    testId: "dbx-surveys-input-channel-name-input",
    description: "Native <input> rendered inside the channel name dbx-ds-text-input",
  } as Locator,

  // ── Respondent type selection ─────────────────────────────────────────────

  respondentTypeSection: {
    testId: "dbx-surveys-section-channel-respondent-type",
    description: "Container holding the Internal and External respondent type cards",
  } as Locator,

  internalCard: {
    testId: "dbx-surveys-card-channel-internal",
    description: "'Internal' respondent type card — `id='active'` when selected",
  } as Locator,

  internalTick: {
    testId: "dbx-surveys-tick-channel-internal",
    description: "Selection tick on the Internal respondent type card (dbx-ds-tick)",
  } as Locator,

  externalCard: {
    testId: "dbx-surveys-card-channel-external",
    description: "'External' respondent type card — `id='active'` when selected",
  } as Locator,

  externalTick: {
    testId: "dbx-surveys-tick-channel-external",
    description: "Selection tick on the External respondent type card (dbx-ds-tick)",
  } as Locator,

  // ── Response collection type radio ────────────────────────────────────────
  //
  // A dbx-ds-radio group with two options:
  //   • Send Survey to Respondents (default)
  //   • Import Responses

  responseTypeRadio: {
    testId: "dbx-surveys-radio-channel-response-type",
    description: "Response collection type radio group (dbx-ds-radio)",
  } as Locator,

  responseTypeSendSurveyInput: {
    testId: "dbx-surveys-radio-channel-response-type-option-Send Survey to Respondents-input",
    description: "Native radio <input> for 'Send Survey to Respondents' option",
  } as Locator,

  responseTypeImportInput: {
    testId: "dbx-surveys-radio-channel-response-type-option-Import Responses-input",
    description: "Native radio <input> for 'Import Responses' option",
  } as Locator,

  // ── Include / Exclude respondents ─────────────────────────────────────────

  includeRespondentsDropdown: {
    testId: "dbx-surveys-dropdown-channel-include-respondents",
    description: "Include Respondents dbx-ds-dropdown (search-by Name, Email, User Assignment)",
  } as Locator,

  includeRespondentsDropdownHead: {
    testId: "dbx-surveys-dropdown-channel-include-respondents-head",
    description: "Header / placeholder element of the Include Respondents dropdown",
  } as Locator,

  includeRespondentsSearch: {
    testId: "dbx-surveys-dropdown-channel-include-respondents-search",
    description: "Search input inside the expanded Include Respondents dropdown",
  } as Locator,

  addConditionButton: {
    testId: "dbx-surveys-btn-channel-add-condition",
    description: "'+ Condition' dbx-ds-button for adding respondent filter conditions",
  } as Locator,

  internalAuthDropdown: {
    testId: "dbx-surveys-dropdown-channel-internal-auth",
    description: "Authenticate-via dbx-ds-dropdown (e.g. Credentials, SSO)",
  } as Locator,

  internalAuthDropdownHead: {
    testId: "dbx-surveys-dropdown-channel-internal-auth-head",
    description: "Header / placeholder of the Authenticate-via dropdown (shows current selection)",
  } as Locator,

  excludeRespondentsDropdown: {
    testId: "dbx-surveys-dropdown-channel-exclude-respondents",
    description: "Exclude Respondents dbx-ds-dropdown (search-by Name, Email)",
  } as Locator,

  excludeRespondentsDropdownHead: {
    testId: "dbx-surveys-dropdown-channel-exclude-respondents-head",
    description: "Header / placeholder of the Exclude Respondents dropdown",
  } as Locator,

  excludeRespondentsSearch: {
    testId: "dbx-surveys-dropdown-channel-exclude-respondents-search",
    description: "Search input inside the expanded Exclude Respondents dropdown",
  } as Locator,

  // ── Auto-reminder section ─────────────────────────────────────────────────

  autoReminderSection: {
    testId: "dbx-surveys-section-auto-reminder",
    description: "Auto-Reminder section container (<auto-reminder> component)",
  } as Locator,

  autoReminderToggle: {
    testId: "dbx-surveys-toggle-auto-reminder-enable",
    description: "'Enable Automatic Reminders' toggle switch (dbx-ds-toggle-switch)",
  } as Locator,

  autoReminderToggleButton: {
    testId: "dbx-surveys-toggle-auto-reminder-enable-button",
    description: "Clickable button inside the auto-reminder toggle switch",
  } as Locator,

  // ── Share options (Email / Teams / WhatsApp / SMS) ────────────────────────
  //
  // These rows do NOT carry data-testid attributes.
  // They are identified by CSS class selectors scoped to the page container.
  // The Email row is the only one with a `data-scroll-id` attribute.

  shareEmailRow: {
    testId: '[data-testid="dbx-surveys-page-add-channel"] [data-scroll-id="email_template"]',
    description: "Email share-mode row (has `data-scroll-id='email_template'` and `email_outline` class)",
  } as Locator,

  shareEmailConfigureLink: {
    testId: '[data-testid="dbx-surveys-page-add-channel"] [data-scroll-id="email_template"] .activeText',
    description: "'Configure' link text inside the Email share row",
  } as Locator,

  shareTeamsRow: {
    testId: '[data-testid="dbx-surveys-page-add-channel"] .distModeActive:has(img[src*="teams"])',
    description: "Teams Notifications share-mode row",
  } as Locator,

  shareTeamsConfigureLink: {
    testId: '[data-testid="dbx-surveys-page-add-channel"] .distModeActive:has(img[src*="teams"]) .activeText',
    description: "'Configure' link text inside the Teams share row",
  } as Locator,

  shareWhatsAppRow: {
    testId: '[data-testid="dbx-surveys-page-add-channel"] .distModeActive:has(img[src*="whatsapp"])',
    description: "WhatsApp share-mode row",
  } as Locator,

  shareWhatsAppEnableLink: {
    testId: '[data-testid="dbx-surveys-page-add-channel"] .distModeActive:has(img[src*="whatsapp"]) .activeText',
    description: "'Enable' link text inside the WhatsApp share row",
  } as Locator,

  shareSmsRow: {
    testId: '[data-testid="dbx-surveys-page-add-channel"] .distModeActive:has(img[src*="sendSMS"])',
    description: "SMS share-mode row",
  } as Locator,

  shareSmsEnableLink: {
    testId: '[data-testid="dbx-surveys-page-add-channel"] .distModeActive:has(img[src*="sendSMS"]) .activeText',
    description: "'Enable' link text inside the SMS share row",
  } as Locator,

  // ── Respondent summary panel (right side) ─────────────────────────────────
  //
  // No data-testid on the panel. Identified by the `.respSummary` CSS class.

  respondentSummaryPanel: {
    testId: '[data-testid="dbx-surveys-page-add-channel"] .respSummary',
    description: "'Respondent Summary' panel header on the right side of the form",
  } as Locator,

  // ── Form action buttons ───────────────────────────────────────────────────

  cancelButton: {
    testId: "dbx-surveys-btn-channel-cancel",
    description: "Cancel form button (discards new channel, goes back)",
  } as Locator,

  submitButton: {
    testId: "dbx-surveys-btn-channel-submit",
    description: "Submit / Add channel button (saves the channel configuration)",
  } as Locator,

  // ── Invites / notification configuration panel ────────────────────────────
  //
  // This panel slides in when the user clicks "Configure" on the Email or
  // Teams share row. All elements are attached to the DOM when the panel
  // is open.

  invitesCloseButton: {
    testId: "dbx-surveys-btn-invites-close",
    description: "× close button in the top-right of the Invites configuration panel",
  } as Locator,

  invitesFooterCloseButton: {
    testId: "dbx-surveys-btn-invites-footer-close",
    description: "Close button in the Invites panel footer",
  } as Locator,

  invitesSaveButton: {
    testId: "dbx-surveys-btn-invites-save",
    description: "Save button in the Invites panel footer",
  } as Locator,

  invitesNameInput: {
    testId: "dbx-surveys-input-invites-name",
    description: "Channel name input inside the Invites panel (dbx-ds-text-input)",
  } as Locator,

  invitesEmailInput: {
    testId: "dbx-surveys-input-invites-email",
    description: "Reply-to email input inside the Invites panel (dbx-ds-text-input)",
  } as Locator,

  invitesBellEnabledTick: {
    testId: "dbx-surveys-tick-invites-bell-enabled",
    description: "Bell-notification enabled indicator tick inside the Invites panel",
  } as Locator,

  invitesErrors: {
    testId: "dbx-surveys-errors-invites",
    description: "Validation errors container inside the Invites panel",
  } as Locator,

  invitesIntroSubjectEditor: {
    testId: "dbx-surveys-editor-invites-intro-subject",
    description: "Intro email subject rich-text editor in the Invites panel",
  } as Locator,

  invitesIntroMessageEditor: {
    testId: "dbx-surveys-editor-invites-intro-message",
    description: "Intro email message body rich-text editor in the Invites panel",
  } as Locator,

  invitesClosureSubjectEditor: {
    testId: "dbx-surveys-editor-invites-closure-subject",
    description: "Closure/completion email subject editor in the Invites panel",
  } as Locator,

  invitesClosureMessageEditor: {
    testId: "dbx-surveys-editor-invites-closure-message",
    description: "Closure/completion email message body editor in the Invites panel",
  } as Locator,

  invitesBellMessageEditor: {
    testId: "dbx-surveys-editor-invites-bell-message",
    description: "Bell (push) notification message editor in the Invites panel",
  } as Locator,

  invitesTeamsSubjectEditor: {
    testId: "dbx-surveys-editor-invites-teams-subject",
    description: "Teams notification subject editor in the Invites panel",
  } as Locator,

  invitesTeamsMessageEditor: {
    testId: "dbx-surveys-editor-invites-teams-message",
    description: "Teams notification message body editor in the Invites panel",
  } as Locator,
} as const;
