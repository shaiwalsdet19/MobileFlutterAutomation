import { Locator } from "./common";

export const TenantProvisioningSurveysConfidentialFieldIds = {
  age: "TenantProfile_survey_age",
  band: "TenantProfile_survey_band",
  businessUnit: "TenantProfile_survey_bu",
  designation: "TenantProfile_survey_des",
  department: "TenantProfile_survey_dep",
  division: "TenantProfile_survey_div",
  groupCompany: "TenantProfile_survey_gc",
  gender: "TenantProfile_survey_gender",
  grade: "TenantProfile_survey_grade",
  jobLevel: "TenantProfile_survey_jl",
  currentOfficeLocation: "TenantProfile_survey_location_region",
  l1ManagerNameAndId: "TenantProfile_survey_l1_manager",
  l2ManagerAliasesNameAndId: "TenantProfile_survey_l2_manager",
  l3ManagerNameAndId: "TenantProfile_survey_l3_manager",
  l4ManagerNameAndId: "TenantProfile_survey_l4_manager",
  l5ManagerNameAndId: "TenantProfile_survey_l5_manager",
  hodAliases: "TenantProfile_survey_hod",
  hrbp: "TenantProfile_survey_hrbp_role",
  dottedLineManager: "TenantProfile_survey_dotted_line_manager",
  businessUnitHr: "TenantProfile_survey_business_unit_hr",
  functionalHead: "TenantProfile_survey_functional_head",
  headHr: "TenantProfile_survey_head_hrs",
  groupHrHead: "TenantProfile_survey_group_head_hrs",
  locationHead: "TenantProfile_survey_office_location_head",
  businessUnitHead: "TenantProfile_survey_business_unit_head",
  locationType: "TenantProfile_survey_office_location_type",
  region: "TenantProfile_survey_region_id",
  centerType: "TenantProfile_survey_office_location_centre_type_id",
  cityType: "TenantProfile_survey_office_location_city_type_id",
  capability: "TenantProfile_survey_capability_name",
  lastPromotedDate: "TenantProfile_survey_last_promotion_date",
  isOnNoticePeriod: "TenantProfile_survey_on_notice_check",
  functionalAreaHierarchy: "TenantProfile_survey_functional_area_hierarchy",
  departmentHierarchyFromTop: "TenantProfile_survey_department_hierarchy_from_top",
  departmentHierarchyFromBottom: "TenantProfile_survey_department_hierarchy_from_bottom",
  parentDepartment: "TenantProfile_survey_parent_department",
  topDepartment: "TenantProfile_survey_top_department",
  contributionLevel: "TenantProfile_survey_contribution_level",
  standardRole1: "TenantProfile_survey_standard_role1",
  standardRole2: "TenantProfile_survey_standard_role2",
  standardRole3: "TenantProfile_survey_standard_role3",
  tenureFromDateOfJoining: "TenantProfile_survey_tenure",
  assignmentOneName: "TenantProfile_survey_assignment_one",
  missionTwoName: "TenantProfile_survey_assignment_two",
  assignmentThreeName: "TenantProfile_survey_assignment_three",
  functionalArea: "TenantProfile_survey_functional_area_name",
  costCenter: "TenantProfile_survey_cost_center_name",
  employeeSubType: "TenantProfile_survey_sub_type",
  employeeType: "TenantProfile_survey_employee_type",
  employeeId: "TenantProfile_survey_employee_no",
  userId: "TenantProfile_survey_user_id",
  ip: "TenantProfile_survey_ip",
  submissionTime: "TenantProfile_survey_submission_time",
  timeZone: "TenantProfile_survey_time_zone",
} as const;

export type TenantProvisioningSurveysConfidentialFieldKey =
  keyof typeof TenantProvisioningSurveysConfidentialFieldIds;

export const TenantProvisioningSurveysLocators = {
  form: {
    testId: "#tenant_setting_level",
    description: "Tenant profile settings form on the tenant provisioning page",
  } as Locator,
  searchSettingsInput: {
    testId: "input.search_settings_field",
    description: "Global search input used to filter tenant provisioning settings",
  } as Locator,
  saveSettingsButton: {
    testId: "#setting_create_btn",
    description: "Save Settings submit button for tenant provisioning changes",
  } as Locator,

  mainSurveyTab: {
    testId: "dbx-survey-tab-main",
    description: "Main Survey tab within tenant profile settings",
  } as Locator,
  surveysProvisioningSection: {
    testId: "dbx-survey-section-provisioning-tab",
    description: "Container for the Survey tenant provisioning settings",
  } as Locator,
  subTabMenu: {
    testId: "dbx-survey-menu-subtabs",
    description: "Sub-tab menu for Survey tenant provisioning settings",
  } as Locator,
  activeSubTab: {
    testId: '[data-testid="dbx-survey-menu-subtabs"] a.active',
    description: "Currently active Survey sub-tab",
  } as Locator,
  allSubTab: {
    testId: "dbx-survey-tab-all",
    description: "All sub-tab inside the Survey settings family",
  } as Locator,
  surveySubTab: {
    testId: "dbx-survey-tab-survey",
    description: "Survey-only sub-tab inside the Survey settings family",
  } as Locator,
  confidentialSurveySubTab: {
    testId: "dbx-survey-tab-confidential-survey",
    description: "Confidential Survey sub-tab inside the Survey settings family",
  } as Locator,
  engagementSubTab: {
    testId: "dbx-survey-tab-engagement",
    description: "Engagement sub-tab inside the Survey settings family",
  } as Locator,

  surveySettingsSection: {
    testId: "dbx-survey-section-survey-settings",
    description: "Survey settings section shown for All and Survey sub-tabs",
  } as Locator,
  confidentialSettingsSection: {
    testId: "dbx-survey-section-confidential-settings",
    description: "Confidential Survey settings section shown for All and Confidential Survey sub-tabs",
  } as Locator,
  engagementSettingsSection: {
    testId: "dbx-survey-section-engagement-settings",
    description: "Engagement settings section shown for All and Engagement sub-tabs",
  } as Locator,

  enableSurveysCheckbox: {
    testId: "dbx-survey-checkbox-enable-surveys",
    description: "Checkbox that enables Surveys",
  } as Locator,
  showUserSpecificLinkCheckbox: {
    testId: "dbx-survey-checkbox-show-user-specific-link",
    description: "Checkbox that enables the user specific respondents CSV link",
  } as Locator,
  enableAiSmartFollowUpsCheckbox: {
    testId: "dbx-survey-checkbox-enable-ai-follow-ups",
    description: "Checkbox that enables AI smart follow-ups",
  } as Locator,
  useSupervisedClusteringCheckbox: {
    testId: "dbx-survey-checkbox-use-supervised-clustering",
    description: "Checkbox that enables supervised clustering",
  } as Locator,
  clusterTimeFrameInput: {
    testId: "dbx-survey-input-cluster-time-frame",
    description: "Number input for the clustering lookback window in months",
  } as Locator,

  confidentialFieldCheckboxes: {
    testId: '[data-testid="dbx-survey-section-confidential-settings"] input[type="checkbox"]',
    description: "All confidential survey field checkboxes",
  } as Locator,
  minimumAttributeSizeInput: {
    testId: "dbx-survey-input-min-attribute-size",
    description: "Minimum attribute size input in the Confidential Survey section",
  } as Locator,

  enableEngagementCheckbox: {
    testId: "dbx-survey-checkbox-enable-engagement",
    description: "Checkbox that enables engagement surveys",
  } as Locator,

  confidentialFieldCheckbox: (
    fieldKey: TenantProvisioningSurveysConfidentialFieldKey
  ): Locator => ({
    testId: `#${TenantProvisioningSurveysConfidentialFieldIds[fieldKey]}`,
    description: `Confidential survey checkbox for ${fieldKey}`,
  }),
  confidentialFieldCheckboxById: (fieldId: string): Locator => ({
    testId: `#${fieldId}`,
    description: `Confidential survey checkbox with DOM id ${fieldId}`,
  }),
} as const;
