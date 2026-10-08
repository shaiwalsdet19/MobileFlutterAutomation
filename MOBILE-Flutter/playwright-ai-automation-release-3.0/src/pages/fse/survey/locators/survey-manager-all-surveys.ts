import { Locator } from "../../../common/locators/common";

/**
 * Inline row action available on every survey row.
 * Maps to the `data-action` attribute on `dbx-ds-button`.
 */
export type SurveyRowAction = "pin" | "unpin" | "resume" | "analyse";

/**
 * Context menu action available through the three-dots button.
 * Items shown depend on the survey's current status.
 */
export type SurveyContextMenuAction =
  | "duplicate"
  | "delete"
  | "updateForm"
  | "replaceForm"
  | "editConfiguration"
  | "extend";

/** Display label for each context menu action as it appears in the DOM. */
export const ContextMenuLabels: Record<SurveyContextMenuAction, string> = {
  duplicate: "Duplicate",
  delete: "Delete",
  updateForm: "Update Survey Form",
  replaceForm: "Replace Survey Form",
  editConfiguration: "Edit Survey Configurations",
  extend: "Edit Closure Date & Time",
};

/**
 * Survey type tab labels as they appear in the tab group.
 * Counts are shown as badges next to each label.
 */
export const SurveyTypeTabLabels = {
  all: "All",
  businessProcessLinked: "Business Process Linked",
  adHoc: "Ad-Hoc",
} as const;

export type SurveyTypeTab = keyof typeof SurveyTypeTabLabels;

export const SurveyManagerAllSurveysLocators = {
  // ── Page-level ────────────────────────────────────────────────────────────

  page: {
    testId: "dbx-surveys-page-all-surveys-list",
    description: "Root container for the All Surveys list page",
  } as Locator,

  pageTitle: {
    testId: "text=Surveys",
    description: "Page heading 'Surveys' at the top of the list",
  } as Locator,

  createSurveyButton: {
    testId: '[data-testid="ribbon-btn-btn_0"]',
    description: "Create Survey button in the top ribbon toolbar (ribbon-btn-btn_0)",
  } as Locator,

  settingsButton: {
    testId: "dbx-surveys-settings-all-surveys",
    description: "Settings / column-visibility toggle in the top ribbon (dbx-module-settings web component)",
  } as Locator,

  // ── Survey-type tab group ─────────────────────────────────────────────────

  tabGroup: {
    testId: "dbx-surveys-tab-list-survey-type",
    description: "dbx-ds-tab-group container that filters the table by survey type",
  } as Locator,

  /**
   * Individual tab items — prefer these for clicking because they carry
   * dedicated testIds and do not require text-matching.
   *
   * Note: The Ad-Hoc tab key in the DOM is "standalone", not "adhoc".
   */
  tabItemAll: {
    testId: "dbx-surveys-tab-list-survey-type-tab-item-all",
    description: "All surveys tab item inside the tab group",
  } as Locator,

  tabItemBusiness: {
    testId: "dbx-surveys-tab-list-survey-type-tab-item-business",
    description: "Business Process Linked surveys tab item",
  } as Locator,

  tabItemAdHoc: {
    testId: "dbx-surveys-tab-list-survey-type-tab-item-standalone",
    description: "Ad-Hoc surveys tab item (DOM key is 'standalone')",
  } as Locator,

  /**
   * Fallback text-based tab selectors — used as alternatives when the
   * tab-item testIds are not yet rendered or in older builds.
   */
  tabAll: {
    testId: '[data-testid="dbx-surveys-tab-list-survey-type"] span:text-is("All")',
    description: "All surveys tab label span — shows total count badge",
  } as Locator,

  tabBusinessProcessLinked: {
    testId: '[data-testid="dbx-surveys-tab-list-survey-type"] span:text-is("Business Process Linked")',
    description: "Business Process Linked surveys tab label span",
  } as Locator,

  tabAdHoc: {
    testId: '[data-testid="dbx-surveys-tab-list-survey-type"] span:text-is("Ad-Hoc")',
    description: "Ad-Hoc surveys tab label span",
  } as Locator,

  /**
   * Badge counts are rendered as bare text inside `dbx-ds-badge`.
   * The page reads them from the light-DOM span pairs:
   * span[0]=label, span[1]=count, span[2]=label, span[3]=count, ...
   * Order on the live page: All (index 1), Business Process Linked (index 3), Ad-Hoc (index 5).
   */
  tabCountSpans: {
    testId: '[data-testid="dbx-surveys-tab-list-survey-type"] span',
    description: "All visible span elements inside the tab group (alternating label / count)",
  } as Locator,

  // ── Table shell ───────────────────────────────────────────────────────────

  table: {
    testId: "dbx-surveys-table-all-surveys",
    description: "All Surveys DataTables-based table (dbox-table web component)",
  } as Locator,

  searchInput: {
    testId: '[data-testid="dbx-surveys-table-all-surveys"] .custom-search input',
    description: "Primary search input in the table header (scoped to .custom-search to exclude filter-dropdown inputs)",
  } as Locator,

  // ── Survey rows ───────────────────────────────────────────────────────────

  surveyRows: {
    testId: '[data-testid="dbx-surveys-table-all-surveys"] tbody tr.table-row',
    description: "All survey data rows in the table body",
  } as Locator,

  // ── Per-row cell selectors (scope to a row locator before resolving) ──────

  rowTitleCell: {
    testId: "td.surveyProcessTitle",
    description: "Survey title cell — clicking navigates to the survey details page",
  } as Locator,

  rowSurveyTypeCell: {
    testId: "td.surveyType",
    description: "Survey Type cell (e.g. 'Ad-Hoc', 'Business Process Linked')",
  } as Locator,

  rowPrivacyTypeCell: {
    testId: "td.anonymity",
    description: "Privacy Type cell (e.g. 'Regular', 'Confidential')",
  } as Locator,

  rowBusinessProcessesCell: {
    testId: "td.numberOfEvents",
    description: "No. of Business Processes cell",
  } as Locator,

  rowChannelsCell: {
    testId: "td.numberOfChannels",
    description: "No. of Channels cell",
  } as Locator,

  rowResponsesCell: {
    testId: "td.numberOfResponses",
    description: "No. of Responses cell",
  } as Locator,

  rowActivatedOnCell: {
    testId: "td.no-wrap",
    description: "Activated On date cell (shows '-' for non-activated surveys)",
  } as Locator,

  rowStatusCell: {
    testId: "td.rawStatus",
    description: "Status cell containing the dbx-ds-status-tag web component",
  } as Locator,

  rowStatusTag: {
    testId: "dbx-ds-status-tag",
    description: "Status tag web component — carries 'status' (draft|active|closed) and 'label' attributes",
  } as Locator,

  // ── Per-row action buttons ────────────────────────────────────────────────

  rowContextMenuButton: {
    testId: "dbx-ds-button.context_menu",
    description: "Three-dots overflow menu button in the Actions column",
  } as Locator,

  // ── Dynamic row-scoped locators ───────────────────────────────────────────

  rowActionButton: (action: SurveyRowAction): Locator => ({
    testId: `dbx-ds-button[data-action="${action}"]`,
    description: `Inline row action button for '${action}'`,
  }),

  contextMenuItem: (action: SurveyContextMenuAction): Locator => ({
    testId: `text=${ContextMenuLabels[action]}`,
    description: `Context menu item '${ContextMenuLabels[action]}'`,
  }),

  // ── Create Survey drawer ──────────────────────────────────────────────────
  //
  // The Create Survey flow opens a side-drawer over the All Surveys list.
  // The drawer uses the shared `dbx-surveys-form-create-survey` component,
  // identical to the Dashboard's Create Survey drawer.
  //
  // Live HTML (confirmed):
  //   dbx-surveys-card-create-modal-type-2 = "Ad-Hoc Survey"
  //   dbx-surveys-card-create-modal-type-1 = "Linked to Business Process"
  //
  // Note: the outer web-component elements (dbx-ds-text-input, dbx-ds-dropdown)
  // render their inner inputs inside Shadow DOM. The testIds on the outer
  // host elements are used for interaction and are accessible by Playwright.

  createSurveyDrawerForm: {
    testId: "dbx-surveys-form-create-survey",
    description: "Create Survey drawer form container — present in the DOM once the drawer opens",
  } as Locator,

  createSurveyNameInput: {
    testId: "dbx-surveys-input-create-modal-name",
    description: "Survey name text-input (dbx-ds-text-input) in the Create Survey drawer",
  } as Locator,

  createSurveyResponseFormatDropdown: {
    testId: "dbx-surveys-dropdown-create-modal-form-type",
    description: "Response format dropdown (dbx-ds-dropdown) in the Create Survey drawer",
  } as Locator,

  createSurveyMomentDropdown: {
    testId: "dbx-surveys-dropdown-create-modal-moment",
    description: "Moment dropdown (dbx-ds-dropdown) in the Create Survey drawer",
  } as Locator,

  createSurveyMomentSearch: {
    testId: "dbx-surveys-dropdown-create-modal-moment-search",
    description: "Search input inside the expanded Moment dropdown (only visible after dropdown is opened)",
  } as Locator,

  createSurveyTypeField: {
    testId: "dbx-surveys-field-create-modal-survey-type",
    description: "Survey type selection form-field container in the Create Survey drawer",
  } as Locator,

  /**
   * Ad-Hoc Survey type card.
   * Live DOM confirms: `type-2` = Ad-Hoc Survey ("Triggered at your chosen date and time")
   */
  createSurveyAdHocTypeCard: {
    testId: "dbx-surveys-card-create-modal-type-2",
    description: "Ad-Hoc Survey type card in the Create Survey drawer",
  } as Locator,

  /**
   * Linked to Business Process type card.
   * Live DOM confirms: `type-1` = Linked to Business Process ("Triggered according to linked processes")
   */
  createSurveyBusinessProcessTypeCard: {
    testId: "dbx-surveys-card-create-modal-type-1",
    description: "Linked to Business Process type card in the Create Survey drawer",
  } as Locator,

  createSurveyCloseButton: {
    testId: "dbx-surveys-btn-create-modal-close",
    description: "Close (×) button in the Create Survey drawer header",
  } as Locator,

  createSurveyCancelButton: {
    testId: "dbx-surveys-btn-create-modal-cancel",
    description: "Cancel button in the Create Survey drawer footer",
  } as Locator,

  createSurveyProceedButton: {
    testId: "dbx-surveys-btn-create-modal-proceed",
    description: "Proceed button in the Create Survey drawer footer",
  } as Locator,
} as const;
