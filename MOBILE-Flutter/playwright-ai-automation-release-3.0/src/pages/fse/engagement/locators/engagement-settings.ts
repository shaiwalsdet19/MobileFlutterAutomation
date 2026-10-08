import { Locator } from "../../../common/locators/common";

// ── Page URL ──────────────────────────────────────────────────────────────────
//
// https://forms1.qa.darwinbox.io/settings/engagement/settings
//
// This is a server-rendered (non-Angular) Yii-based settings page.
// It uses jQuery Chosen for all <select> elements, meaning the native
// <select> elements are hidden (style="display:none") and wrapped by
// Chosen-generated `.chosen-container` divs.
//
// Page structure:
//   1. Breadcrumb nav   (CSS-class based, no data-testid)
//   2. Settings heading (data-testid: dbx-engagement-item-settings-heading)
//   3. Ribbon Save button (data-testid: ribbon-btn-btn_0)
//   4. Settings form   (data-testid: dbx-engagement-form-settings)
//      a. Scale                        — single Chosen select
//      b. Primary Engagement Indicator — single Chosen select
//         ├── Theme section   (hidden unless "Theme" selected)
//         └── Sub-Themes section (hidden unless "Theme" or "Custom" selected)
//      c. Enable eNPS checkbox
//      d. Intelligent clustering fields — multi Chosen select
//      e. Minimum attribute size input  — plain number input + tooltip (ⓘ)
//      f. Dashboard Filters             — multi Chosen select + tooltip (ⓘ)
//      g. Score calculation settings    — accordion toggle
//         ├── Recency/volume slider
//         ├── Info modal trigger (slide-in panel)
//         └── Survey Exclusion List  — multi Chosen select + tooltip (ⓘ)
//   5. Score settings info modal (outer wrapper + slide-in panel)
//
// Tooltip pattern (Bootstrap popover, no jQuery Chosen):
//   • Each tooltip is an `<a class="custom_tooltip" data-bs-toggle="popover">` element
//   • data-testid variants: *-info (e.g. dbx-engagement-btn-min-size-view-info)
//   • Tooltip content is in the `data-bs-content` attribute
//
// Chosen-select interaction pattern:
//   • To open a single-select: click the `.chosen-single` anchor inside the wrapper
//   • To pick an option:        click the matching `.chosen-results li` text
//   • To read the current value: read the text of `.chosen-single span`
//   • For multi-selects, click in `.chosen-choices .search-field input` then pick options
//   • Chosen container id = `${select.id}_chosen`

export const EngagementSettingsLocators = {
  // ── Page wrapper ─────────────────────────────────────────────────────────

  page: {
    testId: "dbx-engagement-section-settings-page",
    description: "Root <section> wrapping the entire Engagement Settings page",
  } as Locator,

  settingsContainer: {
    testId: "dbx-engagement-section-settings-container",
    description: "Inner container div immediately inside the page section",
  } as Locator,

  formContainer: {
    testId: "dbx-engagement-form-settings-container",
    description: "Container div that wraps both the inline <style> and the <form>",
  } as Locator,

  form: {
    testId: "dbx-engagement-form-settings",
    description: "<form name='createThemeSettings'> containing all settings fields",
  } as Locator,

  heading: {
    testId: "dbx-engagement-item-settings-heading",
    description: "<h3> showing 'Engagement Settings'",
  } as Locator,

  // ── Breadcrumbs ───────────────────────────────────────────────────────────
  //
  // No data-testid; identified by CSS class.

  breadcrumbItems: {
    testId: ".bread-crumb-item",
    description: "All breadcrumb step items (CSS: .bread-crumb-item)",
  } as Locator,

  breadcrumbSelected: {
    testId: ".bread-crumb-item.is-selected",
    description: "Currently-active breadcrumb (CSS: .bread-crumb-item.is-selected)",
  } as Locator,

  // ── Ribbon Save button ────────────────────────────────────────────────────
  //
  // Primary Save action inside <dbx-ribbon> component.

  ribbonSaveButton: {
    testId: "ribbon-btn-btn_0",
    description: "Save button inside the <dbx-ribbon> component",
  } as Locator,

  /**
   * Legacy hidden anchor Save button. Normally replaced by the ribbon.
   */
  legacySaveButton: {
    testId: "dbx-engagement-btn-settings-save",
    description: "Hidden <a> Save button (id='update_engagemet_settings')",
  } as Locator,

  // ── Scale field ───────────────────────────────────────────────────────────
  //
  // Native <select id="engagement_scale"> wrapped by Chosen.
  // Chosen wrapper id = "engagement_scale_chosen".

  scaleSelect: {
    testId: "dbx-engagement-dropdown-scale",
    description: "Native (hidden) <select> for Scale",
  } as Locator,

  scaleChosenContainer: {
    testId: "#engagement_scale_chosen",
    description: "Chosen wrapper for the Scale single-select",
  } as Locator,

  scaleChosenSingle: {
    testId: "#engagement_scale_chosen .chosen-single",
    description: "Clickable anchor that opens the Scale Chosen dropdown",
  } as Locator,

  scaleChosenResults: {
    testId: "#engagement_scale_chosen .chosen-results",
    description: "Options <ul> inside the Scale Chosen dropdown",
  } as Locator,

  // ── Primary Engagement Indicator ──────────────────────────────────────────
  //
  // Options: happiness | moodometer | theme | custom

  indicatorSection: {
    testId: "dbx-engagement-section-indicator-selection",
    description: "Container div for the Primary Engagement Indicator dropdown",
  } as Locator,

  indicatorSelect: {
    testId: "dbx-engagement-dropdown-primary-indicator",
    description: "Native (hidden) <select> for the Primary Engagement Indicator",
  } as Locator,

  indicatorChosenContainer: {
    testId: "#primary_engagement_indicator_chosen",
    description: "Chosen wrapper for the Primary Engagement Indicator select",
  } as Locator,

  indicatorChosenSingle: {
    testId: "#primary_engagement_indicator_chosen .chosen-single",
    description: "Clickable anchor that opens the Primary Indicator dropdown",
  } as Locator,

  // ── Theme selection (visible only when Primary Indicator = "Theme") ───────

  themeSection: {
    testId: "dbx-engagement-section-theme-selection",
    description: "Theme section (visible when Primary Indicator is 'Theme')",
  } as Locator,

  themeSelect: {
    testId: "dbx-engagement-dropdown-theme",
    description: "Native (hidden) <select> for Theme",
  } as Locator,

  themeChosenContainer: {
    testId: "#themes_select_chosen",
    description: "Chosen wrapper for the Theme single-select",
  } as Locator,

  themeChosenSingle: {
    testId: "#themes_select_chosen .chosen-single",
    description: "Clickable anchor that opens the Theme Chosen dropdown",
  } as Locator,

  // ── Sub-theme section (visible when Primary Indicator = "Theme" or "Custom") ─

  subThemeSection: {
    testId: "dbx-engagement-section-sub-theme-selection",
    description: "Sub-themes section (hidden by default; shown when Theme or Custom selected)",
  } as Locator,

  subThemeSelect: {
    testId: "dbx-engagement-select-sub-themes",
    description: "Native (hidden) multi-<select> for Sub Themes",
  } as Locator,

  subThemeChosenContainer: {
    testId: "#sub_themes_chosen",
    description: "Chosen multi-select wrapper for Sub Themes",
  } as Locator,

  // ── Enable eNPS section ───────────────────────────────────────────────────

  enableNpsSection: {
    testId: "dbx-engagement-section-enable-nps",
    description: "Section row containing the Enable eNPS checkbox",
  } as Locator,

  enableNpsCheckbox: {
    testId: "dbx-engagement-checkbox-enable-nps",
    description: "Checkbox: TenantEngagementSettings[enable_nps]",
  } as Locator,

  // ── Intelligent clustering fields ─────────────────────────────────────────

  clusteringSection: {
    testId: "dbx-engagement-section-clustering-fields",
    description: "Section for 'Consider below attributes for Intelligent clustering'",
  } as Locator,

  clusteringSelect: {
    testId: "dbx-engagement-select-clustering-fields",
    description: "Native (hidden) multi-<select> for clustering attributes",
  } as Locator,

  clusteringChosenContainer: {
    testId: "#clustering_fields_chosen",
    description: "Chosen multi-select wrapper for clustering attributes",
  } as Locator,

  // ── Minimum attribute size ────────────────────────────────────────────────

  minSizeSection: {
    testId: "dbx-engagement-section-min-size-view",
    description: "Section for 'Minimum attribute size to view results'",
  } as Locator,

  minSizeInput: {
    testId: "dbx-engagement-input-min-size-view",
    description: "Number input: TenantEngagementSettings[min_size_view] (type='number', min='1')",
  } as Locator,

  /**
   * Tooltip info anchor (ⓘ) for the Minimum attribute size field.
   * Bootstrap popover content: "Minimum size of the employee attributes needed
   * to show the responses in engagement dashboard"
   */
  minSizeInfoTooltip: {
    testId: "dbx-engagement-btn-min-size-view-info",
    description: "Tooltip anchor (ⓘ) for the Minimum attribute size field",
  } as Locator,

  // ── Dashboard filters ─────────────────────────────────────────────────────

  filtersSection: {
    testId: "dbx-engagement-section-filter-selection",
    description: "Section for 'Customize Fields in Dashboard Filters'",
  } as Locator,

  filtersSelect: {
    testId: "dbx-engagement-select-filters",
    description: "Native (hidden) multi-<select> for dashboard filter fields",
  } as Locator,

  filtersChosenContainer: {
    testId: "#filters_chosen",
    description: "Chosen multi-select wrapper for Dashboard Filters",
  } as Locator,

  /**
   * Tooltip info anchor (ⓘ) for the Dashboard Filters field.
   * Bootstrap popover content: "Select Additional Fields for Filters"
   */
  filtersInfoTooltip: {
    testId: "dbx-engagement-btn-filters-info",
    description: "Tooltip anchor (ⓘ) for the Dashboard Filters field",
  } as Locator,

  // ── Score calculation settings accordion ──────────────────────────────────

  scoreSettingsSection: {
    testId: "dbx-engagement-section-score-settings",
    description: "Score calculation settings accordion outermost wrapper",
  } as Locator,

  scoreSettingsToggle: {
    testId: "dbx-engagement-btn-score-settings-toggle",
    description: "Toggle button for the Score calculation settings accordion",
  } as Locator,

  scoreSettingsBody: {
    testId: "dbx-engagement-section-score-settings-body",
    description: "Collapsible body of the Score calculation settings accordion",
  } as Locator,

  scoreSettingsInfoButton: {
    testId: "dbx-engagement-btn-score-settings-info",
    description: "Info button (ⓘ) that opens the score calculation help modal panel",
  } as Locator,

  responseVolumeSlider: {
    testId: "dbx-engagement-input-response-volume-slider",
    description: "Range slider: TenantEngagementSettings[response_volume] (min=0, max=1, step=0.1)",
  } as Locator,

  /**
   * Value pill showing the current slider position (e.g. "1.0").
   * No data-testid; identified by id.
   */
  sliderValuePill: {
    testId: "#engagement-score-settings-value",
    description: "Pill showing current slider value (id='engagement-score-settings-value')",
  } as Locator,

  /**
   * Helper/description text below the slider.
   */
  sliderHelperText: {
    testId: ".engagement-score-settings__helper",
    description: "Helper text below the slider (first of two .engagement-score-settings__helper divs)",
  } as Locator,

  // ── Survey Exclusion List ─────────────────────────────────────────────────
  //
  // Lives inside the Score settings section (.engagement-score-settings-section).
  // All three elements now carry data-testid attributes.

  surveyExclusionSection: {
    testId: "dbx-engagement-section-survey-exclusion",
    description: "Section div (id='survey_exclusion_group') for the Survey Exclusion List",
  } as Locator,

  surveyExclusionSelect: {
    testId: "dbx-engagement-select-survey-exclusion-list",
    description: "Native (hidden) multi-<select> for Survey Exclusion List (id='survey_exclusion_list')",
  } as Locator,

  /**
   * Chosen multi-select wrapper for the Survey Exclusion List.
   * Generated by jQuery Chosen with id="survey_exclusion_list_chosen".
   */
  surveyExclusionChosenContainer: {
    testId: "#survey_exclusion_list_chosen",
    description: "Chosen multi-select wrapper for Survey Exclusion List",
  } as Locator,

  /**
   * Tooltip info anchor (ⓘ) for the Survey Exclusion List field.
   * Bootstrap popover content: "Surveys added to this list will not contribute
   * to Engagement Dashboard scores, trends, or analyses."
   */
  surveyExclusionInfoTooltip: {
    testId: "dbx-engagement-btn-survey-exclusion-info",
    description: "Tooltip anchor (ⓘ) for the Survey Exclusion List field",
  } as Locator,

  // ── Score settings info modal ─────────────────────────────────────────────
  //
  // Two-layer structure:
  //   1. Outer modal wrapper  (dbx-engagement-modal-score-settings) — hidden by default
  //   2. Inner slide-in panel (dbx-engagement-section-modal-panel)  — always in DOM

  /**
   * Outer modal wrapper div. Hidden by default; gains CSS class
   * `engagement-score-settings-modal--open` when the info button is clicked.
   */
  infoModalWrapper: {
    testId: "dbx-engagement-modal-score-settings",
    description: "Outer wrapper div for the score calculation info modal (hidden by default)",
  } as Locator,

  infoModalPanel: {
    testId: "dbx-engagement-section-modal-panel",
    description: "Slide-in panel (role='dialog') inside the score calculation info modal",
  } as Locator,

  infoModalCloseButton: {
    testId: "dbx-engagement-btn-modal-close",
    description: "× close button inside the score calculation info modal",
  } as Locator,

  infoModalTitle: {
    testId: ".engagement-score-settings-modal__title",
    description: "<h3> title inside the info modal panel",
  } as Locator,
} as const;
