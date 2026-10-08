import { Locator } from "../../../common/locators/common";

/** Overflow-menu action available on each dashboard survey row. */
export type DashboardSurveyMenuAction =
  | "viewDetails"
  | "editConfigurations"
  | "editClosureDateTime"
  | "deactivate"
  | "duplicate"
  | "delete"
  | "updateSurveyForm"
  | "replaceSurveyForm";

/** Quick-link name inside the Libraries widget. */
export type LibraryLink =
  | "templates"
  | "questionBank"
  | "themes"
  | "subThemes"
  | "benchmarks"
  | "actionPlan";

export const SurveyManagerDashboardLocators = {
  // ── Page root ─────────────────────────────────────────────────────────────

  page: {
    testId: "dbx-surveys-page-dashboard",
    description: "Root container for the Survey Manager dashboard page",
  } as Locator,

  // ── Header ────────────────────────────────────────────────────────────────

  headerTitle: {
    testId: "text=Survey & Engagement",
    description: "Page header title 'Survey & Engagement'",
  } as Locator,

  createSurveyButton: {
    testId: "dbx-surveys-btn-dashboard-create-survey",
    description: "dbx-ds-button web component that opens the Create Survey drawer",
  } as Locator,

  // ── Stats section ─────────────────────────────────────────────────────────

  /**
   * Stats section wrapper. The actual stat values are inside a `<dbx-stats>`
   * web component that renders in Shadow DOM, so inner text may not be readable
   * via `innerText()`. Use the section's presence as a readiness signal only.
   */
  statsSection: {
    testId: "dbx-surveys-section-dashboard-stats",
    description: "Dashboard stats summary section (contains dbx-stats web component)",
  } as Locator,

  // ── Insights section ──────────────────────────────────────────────────────

  insightsSection: {
    testId: "dbx-surveys-section-dashboard-insights",
    description: "Insights at a Glance section containing three insight cards",
  } as Locator,

  engagementInsightCard: {
    testId: "dbx-surveys-card-dashboard-insight-0",
    description: "Clickable Engagement insight card (navigates to engagement analyser)",
  } as Locator,

  peopleAtRiskInsightCard: {
    testId: "dbx-surveys-card-dashboard-insight-1",
    description: "People At Risk insight card — currently disabled (Coming Soon badge present)",
  } as Locator,

  managersEffectivenessInsightCard: {
    testId: "dbx-surveys-card-dashboard-insight-2",
    description: "Managers Effectiveness insight card — currently disabled (Coming Soon badge present)",
  } as Locator,

  insightComingSoonBadge: (index: 1 | 2): Locator => ({
    testId: `dbx-surveys-badge-dashboard-insight-coming-soon-${index}`,
    description: `Coming Soon flap badge on insight card ${index}`,
  }),

  // ── Surveys widget ────────────────────────────────────────────────────────

  surveysSection: {
    testId: "dbx-surveys-section-dashboard-recent-surveys",
    description: "Pinned and recent surveys widget section",
  } as Locator,

  /**
   * Tab-group container for Pinned / Recent tabs.
   * The individual tab items also carry their own testIds — prefer those for clicking.
   */
  surveysTabs: {
    testId: "dbx-surveys-tab-dashboard-recent-pinned",
    description: "dbx-ds-tab-group web component containing the Pinned / Recent survey tabs",
  } as Locator,

  pinnedSurveysTab: {
    testId: "dbx-surveys-tab-dashboard-recent-pinned-tab-item-pinned",
    description: "Pinned Surveys tab item inside the surveys widget tab-group",
  } as Locator,

  recentSurveysTab: {
    testId: "dbx-surveys-tab-dashboard-recent-pinned-tab-item-recent",
    description: "Recent Surveys tab item inside the surveys widget tab-group",
  } as Locator,

  surveysViewAllButton: {
    testId: "dbx-surveys-btn-dashboard-view-all",
    description: "dbx-ds-button web component for 'View All' in the surveys widget",
  } as Locator,

  surveyRows: {
    testId: '[data-testid^="dbx-surveys-row-dashboard-survey-"]',
    description: "Collection of all visible survey rows in the dashboard widget",
  } as Locator,

  // ── Recommended templates ─────────────────────────────────────────────────

  recommendedTemplatesSection: {
    testId: "dbx-surveys-section-dashboard-recommended-templates",
    description: "Commonly Used Templates carousel section",
  } as Locator,

  recommendedTemplatesCarousel: {
    testId: "dbx-surveys-carousel-recommended-templates",
    description: "dbx-ds-carousel web component holding the template cards",
  } as Locator,

  recommendedTemplateCards: {
    testId: '[data-testid^="dbx-surveys-card-recommended-template-"]',
    description: "Collection of all recommended template cards in the carousel",
  } as Locator,

  // ── Libraries widget ──────────────────────────────────────────────────────

  librariesSection: {
    testId: "dbx-surveys-section-dashboard-libraries-widget",
    description: "Libraries quick-link widget section",
  } as Locator,

  librariesViewAllButton: {
    testId: "dbx-surveys-btn-libraries-widget-view-all",
    description: "View All button for the libraries widget",
  } as Locator,

  librariesTemplatesLink: {
    testId: "dbx-surveys-link-libraries-widget-templates",
    description: "Templates quick-link in the libraries widget",
  } as Locator,

  librariesQuestionBankLink: {
    testId: "dbx-surveys-link-libraries-widget-question-bank",
    description: "Question Bank quick-link in the libraries widget",
  } as Locator,

  librariesThemesLink: {
    testId: "dbx-surveys-link-libraries-widget-themes",
    description: "Themes quick-link in the libraries widget",
  } as Locator,

  librariesSubThemesLink: {
    testId: "dbx-surveys-link-libraries-widget-sub-themes",
    description: "Sub-Themes quick-link in the libraries widget",
  } as Locator,

  librariesBenchmarksLink: {
    testId: "dbx-surveys-link-libraries-widget-benchmarks",
    description: "Benchmarks quick-link in the libraries widget",
  } as Locator,

  librariesActionPlanLink: {
    testId: "dbx-surveys-link-libraries-widget-action-plan-library",
    description: "Action Plan quick-link in the libraries widget",
  } as Locator,

  // ── Create Survey drawer ──────────────────────────────────────────────────

  createSurveyDrawerForm: {
    testId: "dbx-surveys-form-create-survey",
    description: "Create Survey drawer form container",
  } as Locator,

  createSurveyNameInput: {
    testId: "dbx-surveys-input-create-modal-name",
    description: "Survey name input field in the Create Survey drawer",
  } as Locator,

  createSurveyResponseFormatDropdown: {
    testId: "dbx-surveys-dropdown-create-modal-form-type",
    description: "Response format dropdown in the Create Survey drawer",
  } as Locator,

  createSurveyMomentDropdown: {
    testId: "dbx-surveys-dropdown-create-modal-moment",
    description: "Moment dropdown in the Create Survey drawer",
  } as Locator,

  createSurveyMomentSearch: {
    testId: "dbx-surveys-dropdown-create-modal-moment-search",
    description: "Search input inside the Moment dropdown of the Create Survey drawer",
  } as Locator,

  createSurveyTypeField: {
    testId: "dbx-surveys-field-create-modal-survey-type",
    description: "Survey type selection field in the Create Survey drawer",
  } as Locator,

  /**
   * Ad-Hoc Survey type card.
   * Live DOM confirms: type-2 = Ad-Hoc Survey ("Triggered at your chosen date and time")
   */
  createSurveyAdHocTypeCard: {
    testId: "dbx-surveys-card-create-modal-type-2",
    description: "Ad-Hoc Survey type card in the Create Survey drawer",
  } as Locator,

  /**
   * Linked to Business Process type card.
   * Live DOM confirms: type-1 = Linked to Business Process ("Triggered according to linked processes")
   */
  createSurveyBusinessProcessTypeCard: {
    testId: "dbx-surveys-card-create-modal-type-1",
    description: "Linked to Business Process type card in the Create Survey drawer",
  } as Locator,

  createSurveyCloseButton: {
    testId: "dbx-surveys-btn-create-modal-close",
    description: "Close button in the Create Survey drawer header",
  } as Locator,

  createSurveyCancelButton: {
    testId: "dbx-surveys-btn-create-modal-cancel",
    description: "Cancel button in the Create Survey drawer footer",
  } as Locator,

  createSurveyProceedButton: {
    testId: "dbx-surveys-btn-create-modal-proceed",
    description: "Proceed button in the Create Survey drawer footer",
  } as Locator,

  // ── Dynamic per-survey locators ───────────────────────────────────────────

  surveyRow: (surveyId: string): Locator => ({
    testId: `dbx-surveys-row-dashboard-survey-${surveyId}`,
    description: `Dashboard row for survey ${surveyId}`,
  }),

  /**
   * Status tag on a survey row.
   * The testId encodes the status label, e.g. `…-Draft-{id}` or `…-Active-{id}`.
   * Use an attribute-starts-with + ends-with selector to match regardless of status.
   */
  surveyStatusTag: (surveyId: string): Locator => ({
    testId: `[data-testid^="dbx-surveys-status-tag-dashboard-survey-"][data-testid$="-${surveyId}"]`,
    description: `Status tag for survey ${surveyId} (testId includes current status label)`,
  }),

  /**
   * Resume button shown on Draft surveys.
   * Replaces the previous `surveyPrimaryActionButton` pattern that used `-primary-`.
   */
  surveyResumeButton: (surveyId: string): Locator => ({
    testId: `dbx-surveys-btn-dashboard-survey-resume-${surveyId}`,
    description: `Resume button (Draft surveys) for survey ${surveyId}`,
  }),

  /**
   * Analyse button shown on Active surveys.
   * Counterpart to `surveyResumeButton` for non-draft surveys.
   */
  surveyAnalyseButton: (surveyId: string): Locator => ({
    testId: `dbx-surveys-btn-dashboard-survey-analyse-${surveyId}`,
    description: `Analyse button (Active surveys) for survey ${surveyId}`,
  }),

  surveyPinButton: (surveyId: string): Locator => ({
    testId: `dbx-surveys-btn-dashboard-survey-pin-${surveyId}`,
    description: `Pin toggle button for survey ${surveyId}`,
  }),

  surveyMenuButton: (surveyId: string): Locator => ({
    testId: `dbx-surveys-btn-dashboard-survey-menu-${surveyId}-button`,
    description: `Overflow menu trigger button for survey ${surveyId}`,
  }),

  surveyMenuItems: (surveyId: string): Locator => ({
    testId: `[data-testid^="dbx-surveys-btn-dashboard-survey-menu-${surveyId}-menu-item-"]`,
    description: `All mounted overflow menu items for survey ${surveyId}`,
  }),

  surveyMenuViewDetails: (surveyId: string): Locator => ({
    testId: `dbx-surveys-btn-dashboard-survey-menu-${surveyId}-menu-item-View Details`,
    description: `Overflow menu 'View Details' for survey ${surveyId}`,
  }),

  surveyMenuEditConfigurations: (surveyId: string): Locator => ({
    testId: `dbx-surveys-btn-dashboard-survey-menu-${surveyId}-menu-item-Edit Survey Configurations`,
    description: `Overflow menu 'Edit Survey Configurations' for survey ${surveyId}`,
  }),

  surveyMenuEditClosureDateTime: (surveyId: string): Locator => ({
    testId: `dbx-surveys-btn-dashboard-survey-menu-${surveyId}-menu-item-Edit Closure Date & Time`,
    description: `Overflow menu 'Edit Closure Date & Time' for survey ${surveyId}`,
  }),

  surveyMenuDeactivate: (surveyId: string): Locator => ({
    testId: `dbx-surveys-btn-dashboard-survey-menu-${surveyId}-menu-item-Deactivate`,
    description: `Overflow menu 'Deactivate' for survey ${surveyId}`,
  }),

  surveyMenuDuplicate: (surveyId: string): Locator => ({
    testId: `dbx-surveys-btn-dashboard-survey-menu-${surveyId}-menu-item-Duplicate`,
    description: `Overflow menu 'Duplicate' for survey ${surveyId}`,
  }),

  surveyMenuDelete: (surveyId: string): Locator => ({
    testId: `dbx-surveys-btn-dashboard-survey-menu-${surveyId}-menu-item-Delete`,
    description: `Overflow menu 'Delete' for survey ${surveyId}`,
  }),

  surveyMenuUpdateSurveyForm: (surveyId: string): Locator => ({
    testId: `dbx-surveys-btn-dashboard-survey-menu-${surveyId}-menu-item-Update Survey Form`,
    description: `Overflow menu 'Update Survey Form' for survey ${surveyId}`,
  }),

  surveyMenuReplaceSurveyForm: (surveyId: string): Locator => ({
    testId: `dbx-surveys-btn-dashboard-survey-menu-${surveyId}-menu-item-Replace Survey Form`,
    description: `Overflow menu 'Replace Survey Form' for survey ${surveyId}`,
  }),

  recommendedTemplateCard: (templateId: string): Locator => ({
    testId: `dbx-surveys-card-recommended-template-${templateId}`,
    description: `Recommended template card for template ${templateId}`,
  }),
};
