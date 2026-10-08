import { test as base, Page, expect } from "@playwright/test";

/**
 * Settings item with id and description
 */
export interface SettingsItem {
  id: string;
  description: string;
}

/**
 * Full settings path with metadata for L1, L2, L3
 */
export interface SettingsPath {
  l1: SettingsItem;
  l2: SettingsItem;
  l3: SettingsItem & { url: string };
}

/**
 * Settings path mapping - maps setting keys to their full path with metadata.
 */
export const SETTINGS_MAP: Record<string, SettingsPath> = {
  // ══════════════════════════════════════════════════════════════════════════
  // ORGANIZATION
  // ══════════════════════════════════════════════════════════════════════════

  // Organization > Organization Units
  companyProfile: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "organization_units", description: "Organization Units" },
    l3: { id: "profile", description: "Create a Parent Company for the business that is at the highest level of the Functional Structure hierarchy", url: "/settings/company/profile" },
  },
  groupCompany: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "organization_units", description: "Organization Units" },
    l3: { id: "grpcompany", description: "Create and manage one or more Group Companies that act as the second level of the Functional Structure hierarchy", url: "/settings/company/grpcompany" },
  },
  businessUnit: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "organization_units", description: "Organization Units" },
    l3: { id: "businessunit", description: "Create and manage Business Unit that can aggregate multiple Department in the functional structure across Group Companies", url: "/settings/company/businessunit" },
  },
  division: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "organization_units", description: "Organization Units" },
    l3: { id: "division", description: "Configure and manage Divisions to combine Business Units across multiple Group Companies", url: "/settings/company/division" },
  },
  capability: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "organization_units", description: "Organization Units" },
    l3: { id: "capability", description: "Configure and manage Capability to combine multiple Departments across different Companies", url: "/settings/company/capability" },
  },
  department: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "organization_units", description: "Organization Units" },
    l3: { id: "departments", description: "Configure and manage Department to add additional levels to functional structure", url: "/settings/company/departments" },
  },

  // Organization > Roles & Career
  designationName: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "roles_and_career", description: "Roles & Career" },
    l3: { id: "designationnames", description: "Create and manage Designation Name that you can assign for a role in a Department", url: "/settings/company/designationnames" },
  },
  designation: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "roles_and_career", description: "Roles & Career" },
    l3: { id: "designations", description: "Configure one or more Designations that indicate the role or position associated with an Employee within the Department", url: "/settings/company/designations" },
  },
  designationTitle: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "roles_and_career", description: "Roles & Career" },
    l3: { id: "designationtitles", description: "Create one or more Designation Titles that can be used to represent the Designation associated with an Employee", url: "/settings/company/designationtitles" },
  },
  functionalArea: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "roles_and_career", description: "Roles & Career" },
    l3: { id: "functionalarea", description: "Configure one or more Functional Areas and link them to Designations for easy identification of the specialization of an Employee", url: "/settings/company/functionalarea" },
  },
  grade: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "roles_and_career", description: "Roles & Career" },
    l3: { id: "grades", description: "Create one or more Grades to easily distinguish between Employees with varying pay scales and work experience", url: "/settings/company/grades" },
  },
  band: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "roles_and_career", description: "Roles & Career" },
    l3: { id: "bands", description: "Create and manage one or more Bands to logically group Grades", url: "/settings/company/bands" },
  },
  jobLevel: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "roles_and_career", description: "Roles & Career" },
    l3: { id: "joblevel", description: "Create and manage one or more Job Levels to differentiate Employees who are in the role but with different Grade", url: "/settings/company/joblevel" },
  },
  contributionLevel: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "roles_and_career", description: "Roles & Career" },
    l3: { id: "neevlevel", description: "Create one or more Contribution Levels for recognizing and differentiating Employees based on their contributions", url: "/settings/company/neevlevel" },
  },
  position: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "roles_and_career", description: "Roles & Career" },
    l3: { id: "positionsetting", description: "Configure Position Management for your Company", url: "/settings/company/positionsetting" },
  },
  jdTemplate: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "roles_and_career", description: "Roles & Career" },
    l3: { id: "jdtemplate", description: "Create and manage one or more Job Descriptions detailing a Job's responsibilities and requirements", url: "/settings/company/jdtemplate" },
  },
  jobFamily: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "roles_and_career", description: "Roles & Career" },
    l3: { id: "jobfamily", description: "Create one or more Job Families by specifying one or more Designations and other optional attributes", url: "/settings/company/jobfamily" },
  },
  roleCategory: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "roles_and_career", description: "Roles & Career" },
    l3: { id: "rolecategory", description: "Create the Role Categories", url: "/settings/company/rolecategory" },
  },

  // Organization > Locations
  locations: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "locations", description: "Locations" },
    l3: { id: "offices", description: "Create and manage Locations corresponding to the Locations where a Company has presence", url: "/settings/company/offices" },
  },
  locationType: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "locations", description: "Locations" },
    l3: { id: "locationtype", description: "Create and manage Location Type to further qualify the type of Locations in the system", url: "/settings/company/locationtype" },
  },
  centreType: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "locations", description: "Locations" },
    l3: { id: "centretype", description: "Create and manage Centre Type to further qualify the centre of Locations in the system", url: "/settings/company/centretype" },
  },
  cityType: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "locations", description: "Locations" },
    l3: { id: "citytype", description: "Create and manage Centre Type to further qualify the city of Locations in the system", url: "/settings/company/citytype" },
  },
  region: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "locations", description: "Locations" },
    l3: { id: "region", description: "Create and manage Regions to aggregate States within countries", url: "/settings/company/region" },
  },
  locationsMaster: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "locations", description: "Locations" },
    l3: { id: "locationcountrymaster", description: "View the Locations master that is applicable for the instance", url: "/settings/company/locationcountrymaster" },
  },

  // Organization > Role Based Access Controls
  standardPermissions: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "role_based_access_controls", description: "Role Based Access Controls" },
    l3: { id: "standardPermissions", description: "View and customize the permissions that is assigned to standard roles in the system", url: "/standardPermissions" },
  },
  customPermissions: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "role_based_access_controls", description: "Role Based Access Controls" },
    l3: { id: "customPermissions", description: "Create and manage custom permission roles to provide role-based access controls for Employees", url: "/settings/permissions/index" },
  },
  reportPermissions: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "role_based_access_controls", description: "Role Based Access Controls" },
    l3: { id: "reportpermissions_edit", description: "Edit the report custom permission roles to add or remove fields", url: "/settings/reportpermissions/edit" },
  },

  // Organization > Employee Data
  employmentDetailsSettings: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "employee_data", description: "Employee Data" },
    l3: { id: "employmentdetailssettings", description: "Configure the visibility of sections within the Employment Details tab", url: "/settings/employees/employmentdetailssettings" },
  },
  nominations: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "employee_data", description: "Employee Data" },
    l3: { id: "nominations", description: "Configure and manage the benefit programs that Employee can nominate their dependents", url: "/settings/employees/nominations" },
  },
  orgViewSettings: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "employee_data", description: "Employee Data" },
    l3: { id: "orgsettings", description: "Configure various Employee, Functional, and Position attributes for Organizational structures", url: "/settings/employees/orgsettings" },
  },
  profileFieldOptions: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "employee_data", description: "Employee Data" },
    l3: { id: "profilefieldoptions", description: "Configure the options to display in the drop-down list for certain fields", url: "/settings/employees/profilefieldoptions" },
  },
  profileViewSettings: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "employee_data", description: "Employee Data" },
    l3: { id: "profilesetting", description: "Configure the fields to be displayed on an Employee profile", url: "/settings/employees/profilesetting" },
  },
  weeklyOff: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "employee_data", description: "Employee Data" },
    l3: { id: "weeklyoff", description: "Create and manage Weekly Off configurations", url: "/settings/company/weeklyoff" },
  },
  mobileReporteeDashboard: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "employee_data", description: "Employee Data" },
    l3: { id: "mobiledashboard", description: "Configure the attributes of the Reportees displayed on Darwinbox Mobile App", url: "/settings/employees/mobiledashboard" },
  },
  directoryViewSetting: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "employee_data", description: "Employee Data" },
    l3: { id: "directoryviewsetting", description: "Configure the columns that need to be displayed under Directory Page", url: "/settings/employees/directoryviewsetting" },
  },
  nationalId: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "employee_data", description: "Employee Data" },
    l3: { id: "nationalidmanager", description: "Configure the applicable options and fields for National ID array section in profile", url: "/settings/employees/nationalidmanager" },
  },
  dependentRules: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "employee_data", description: "Employee Data" },
    l3: { id: "dependentrules", description: "Configure rules for employee dependents", url: "/settings/employees/dependentrules" },
  },

  // Organization > Employment Management
  employeeIdNumbering: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "employment_management", description: "Employment Management" },
    l3: { id: "employee_numbering", description: "Create and maintain an auto-numbering system for Employee IDs", url: "/settings/employees/number" },
  },
  employeeType: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "employment_management", description: "Employment Management" },
    l3: { id: "employee_type", description: "Create and manage Employee Type to segregate Employees", url: "/settings/employees/types" },
  },
  employeeSubType: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "employment_management", description: "Employment Management" },
    l3: { id: "employee_subtype", description: "Create and manage Employee Sub Type to segregate Employees within the same Employee Type", url: "/settings/employees/subtypes" },
  },

  // Organization > Lifecycle Management
  probationPeriod: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "lifecycle_management", description: "Lifecycle Management" },
    l3: { id: "probation", description: "Configure and manage Probation Periods for the Confirmation process", url: "/settings/company/probation" },
  },
  employeeAdvancedSettings: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "lifecycle_management", description: "Lifecycle Management" },
    l3: { id: "advancesettings", description: "Configure various settings of the Employee profile", url: "/settings/employees/advancesettings" },
  },
  noticePeriod: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "lifecycle_management", description: "Lifecycle Management" },
    l3: { id: "notice", description: "Configure and manage Notice Periods for the Separation process", url: "/settings/company/notice" },
  },
  retirementPeriod: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "lifecycle_management", description: "Lifecycle Management" },
    l3: { id: "retire", description: "Configure and manage Retirement Periods", url: "/settings/company/retire" },
  },
  separationReasons: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "lifecycle_management", description: "Lifecycle Management" },
    l3: { id: "deactivate", description: "Configure the options for Separation reasons", url: "/settings/employees/deactivate" },
  },

  // Organization > Project Management
  activities: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "project_management", description: "Project Management" },
    l3: { id: "company_activity", description: "Create and manage a list of tasks or activities for Projects", url: "/settings/company/activity" },
  },
  project: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "project_management", description: "Project Management" },
    l3: { id: "project", description: "Create and manage Projects including Employees and stakeholders", url: "/settings/company/project" },
  },
  projectRoles: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "project_management", description: "Project Management" },
    l3: { id: "project_roles", description: "Create and manage Project Roles", url: "/settings/company/project_roles" },
  },
  rateCards: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "project_management", description: "Project Management" },
    l3: { id: "rate_card", description: "View Rate Cards", url: "/settings/company/rate_card" },
  },
  subActivity: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "project_management", description: "Project Management" },
    l3: { id: "sub_activity", description: "Create and manage a list of tasks or sub-activities", url: "/settings/company/sub_activity" },
  },

  // Organization > Spend Tracking
  costCenter: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "spend_tracking", description: "Spend Tracking" },
    l3: { id: "costcenter", description: "Create and manage Cost Centers for tracking costs", url: "/settings/company/costcenter" },
  },
  ledgers: {
    l1: { id: "organization", description: "Organization" },
    l2: { id: "spend_tracking", description: "Spend Tracking" },
    l3: { id: "ledger", description: "Create and manage Ledgers for tracking transactions", url: "/settings/company/ledger" },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PLATFORM
  // ══════════════════════════════════════════════════════════════════════════

  // Platform > Notification Centre
  standardNotifications: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "notifications", description: "Notification Centre" },
    l3: { id: "notification_templates", description: "Manage Standard Notification Templates to send pre-defined notifications", url: "/notificationtemplates/template/view" },
  },
  customNotifications: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "notifications", description: "Notification Centre" },
    l3: { id: "createwfemailtemplate", description: "Create and manage custom notifications for configurable events", url: "/flows/flowssettings/customworkflow/createwfemailtemplate" },
  },
  emailDigest: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "notifications", description: "Notification Centre" },
    l3: { id: "emaildigest", description: "Configure email digests for consolidated notifications", url: "/emaildigest/index/tab/view" },
  },
  notificationSettings: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "notifications", description: "Notification Centre" },
    l3: { id: "notification_settings", description: "Configure settings for Email Digest and other notifications", url: "/emaildigest/index/tab/settings" },
  },

  // Platform > Form Builder
  pdfForms: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "form_builder", description: "Form Builder" },
    l3: { id: "pdf_forms", description: "Create and manage fillable PDF Forms", url: "/ms/formbuilder/settings/list/pdf" },
  },
  standardForms: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "form_builder", description: "Form Builder" },
    l3: { id: "standard_forms", description: "Create and manage Standard Forms for collecting data", url: "/ms/formbuilder/settings/list/standard" },
  },
  smartTags: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "form_builder", description: "Form Builder" },
    l3: { id: "smart_tags", description: "Smart Tags to merge data from multiple form fields", url: "/ms/formbuilder/settings/smart-tags" },
  },

  // Platform > Document Management
  documentCategories: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "document_management", description: "Document Management" },
    l3: { id: "documentcategories", description: "Create categories to organize and classify documents", url: "/hrfiles/hrfilessettings/documentcategories" },
  },
  hrPoliciesAndLettersSettings: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "document_management", description: "Document Management" },
    l3: { id: "letterSettings", description: "Customize Font Type, Font Size, Sign-off text for HR Letters", url: "/hrfiles/hrfilessettings/letterSettings" },
  },
  selfGenerateSetting: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "document_management", description: "Document Management" },
    l3: { id: "selfgeneration", description: "Set default Letter Head and Signing Authorities for HR Letters", url: "/hrfiles/hrfilessettings/selfgeneration" },
  },
  letterHeadManagement: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "document_management", description: "Document Management" },
    l3: { id: "letterhead", description: "Create Letter Heads for generating HR Letters", url: "/hrfiles/hrfilessettings/letterhead" },
  },
  signingAuthority: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "document_management", description: "Document Management" },
    l3: { id: "lettersignature", description: "Create Signing Authorities for HR Letters", url: "/hrfiles/hrfilessettings/lettersignature" },
  },
  letterAutoNumbering: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "document_management", description: "Document Management" },
    l3: { id: "letterAutoNumber", description: "Create auto-numbering system for HR Letters", url: "/hrfiles/hrfilessettings/letterAutoNumber" },
  },
  ctcTableFormatting: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "document_management", description: "Document Management" },
    l3: { id: "letterctcformatting", description: "Customize the appearance of CTC Tables in HR Letters", url: "/hrfiles/hrfilessettings/letterctcformatting" },
  },
  documentTemplateFormats: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "document_management", description: "Document Management" },
    l3: { id: "documenttemplateformats", description: "Customize generated document file name", url: "/hrfiles/hrfilessettings/documenttemplateformats" },
  },

  // Platform > Reporting & Analytics
  reportsBuilder: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "reporting_and_analytics", description: "Reporting & Analytics" },
    l3: { id: "reportbuilder", description: "Reports Builder", url: "/settings/company/reportbuilder" },
  },
  reportsScheduler: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "reporting_and_analytics", description: "Reporting & Analytics" },
    l3: { id: "reportscheduler", description: "Automate the generation and distribution of reports", url: "/settings/company/reportscheduler" },
  },
  customRoster: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "reporting_and_analytics", description: "Reporting & Analytics" },
    l3: { id: "customroster", description: "Custom Roster offers fields for generating custom reports", url: "/settings/company/customroster" },
  },
  auditTrail: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "reporting_and_analytics", description: "Reporting & Analytics" },
    l3: { id: "audittrail", description: "View the audit trail of changes in the system", url: "/audittrail" },
  },
  studioSettings: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "reporting_and_analytics", description: "Reporting & Analytics" },
    l3: { id: "studiosettings", description: "Studio Settings", url: "/settings/studiosettings" },
  },

  // Platform > Access & Security
  mobileAppAccess: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "access_and_security", description: "Access & Security" },
    l3: { id: "allowmobile", description: "Provision Mobile App access to Employees", url: "/settings/employees/allowmobile" },
  },
  passwordSettings: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "access_and_security", description: "Access & Security" },
    l3: { id: "passwordsettings", description: "Secure user accounts with password policies", url: "/settings/company/passwordsettings" },
  },
  platformAccessibilitySettings: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "access_and_security", description: "Access & Security" },
    l3: { id: "platformaccessibilitysettings", description: "Platform Accessibility Configuration Settings", url: "/settings/employees/platformaccessibilitysettings" },
  },
  singleSignOn: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "access_and_security", description: "Access & Security" },
    l3: { id: "ssosettings", description: "Single Sign-On Settings", url: "/settings/ssoconfig" },
  },
  sensitiveDataConfiguration: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "access_and_security", description: "Access & Security" },
    l3: { id: "sensitive_data_configuration", description: "Manage and configure sensitive information", url: "/SensitiveData/configure" },
  },

  // Platform > Additional Configurations
  userAssignments: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "assignment", description: "Configure User Assignments to group Employees", url: "/settings/company/assignment" },
  },
  aliases: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "companyalias", description: "Configure Aliases to replace default attribute names", url: "/settings/company/companyalias" },
  },
  event: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "event", description: "Configure Events to categorize certain actions in Employee lifecycle", url: "/settings/company/event" },
  },
  subEvent: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "subevent", description: "Create and manage Sub Events for the same Event", url: "/settings/company/subevent" },
  },
  customFields: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "customfields_manage", description: "Create Custom Fields across modules in Darwinbox", url: "/settings/customfields/manage" },
  },
  reasonList: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "reasonlist", description: "Create and manage Reasons for various activities", url: "/settings/company/reasonlist" },
  },
  redirection: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "extramenu", description: "Create and manage icons with redirection links", url: "/settings/company/extramenu" },
  },
  scales: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "scale", description: "Create Scales for rating Employee performance", url: "/settings/company/scale" },
  },
  currencyConversion: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "conversion", description: "Specify conversion factors for currencies", url: "/settings/company/conversion" },
  },
  delegations: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "delegationsetting", description: "Create Delegation policies for task delegation", url: "/settings/employees/delegationsetting" },
  },
  attestations: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "attestations", description: "Configure rules and settings related to attestation", url: "/settings/company/attestations" },
  },
  customImport: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "customimport", description: "Create imports for bulk uploads with custom columns", url: "/import/customImport" },
  },
  importAutoNumbering: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "import_autonumbering", description: "Configure auto numbering series for imports", url: "/import/importAutoNumbering" },
  },
  decisionMatrix: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "decisionmatrix", description: "Configure and manage the Decision Matrix", url: "/settings/company/decisionmatrix" },
  },
  hoverViewConfiguration: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "hoverviewconfiguration", description: "Setup data to be shown on hover", url: "/settings/employees/hoverviewconfiguration" },
  },
  bgvVendor: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "bgvvendor", description: "Configure background verification partners", url: "/VerificationSettings/verification/bgvvendor" },
  },
  verificationPackages: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "verification_packages", description: "Configure verification packages", url: "/VerificationSettings/verification/verificationpackages" },
  },
  verificationStatus: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "verification_status", description: "Configure background verification status", url: "/VerificationSettings/verification/verificationstatus" },
  },
  tags: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "tag", description: "Tags", url: "/settings/company/tags" },
  },
  payScaleGroup: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "payscalegroup", description: "Create Pay Scale Groups for categorizing Employees", url: "/settings/company/payscalegroup" },
  },
  taskCategory: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "taskcategoryconfig", description: "Create and manage Task Category", url: "/ms/flows/config/additional-config/categories" },
  },
  calculatedFields: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "calculatedfields", description: "Configure calculated fields", url: "/settings/company/calculatedfields" },
  },
  todoActivities: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "additional_configuration", description: "Additional Configurations" },
    l3: { id: "todoactivity", description: "Activities", url: "/settings/company/todoactivity" },
  },

  // Platform > Account Details
  administrator: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "account_details", description: "Account Details" },
    l3: { id: "administration", description: "Add Employees to System Administrator configuration", url: "/settings/accountdetails/administration" },
  },
  neoUsers: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "account_details", description: "Account Details" },
    l3: { id: "neousers", description: "Configure Neo Users with controlled access", url: "/settings/accountdetails/neousers" },
  },

  // Platform > Data Management
  consentManagement: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "datamanagement", description: "Data Management" },
    l3: { id: "consentmanagement", description: "Manage consent statements for capturing data", url: "/settings/company/consentmanagement" },
  },
  dataPurgePolicy: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "datamanagement", description: "Data Management" },
    l3: { id: "data_purge_policy", description: "Create and manage data archival policies", url: "/DataArchival/Policy" },
  },
  dataPurgeLogs: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "datamanagement", description: "Data Management" },
    l3: { id: "data_purge_logs", description: "View data archival logs", url: "/DataArchival/logs" },
  },

  // Platform > Dashboard Settings
  dashboardLayout: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "dashboard_settings", description: "Dashboard Settings" },
    l3: { id: "applayout", description: "Configure the left panel icons order", url: "/settings/employees/applayout" },
  },
  generalDisplaySettings: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "dashboard_settings", description: "Dashboard Settings" },
    l3: { id: "platform_experience", description: "Setup experiential elements for the platform", url: "/settings/company/platformexperience" },
  },
  platformTheme: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "dashboard_settings", description: "Dashboard Settings" },
    l3: { id: "platform_theme", description: "Configure theme colour and logo", url: "/ms/db/settings/themes/list" },
  },
  bannerConfiguration: {
    l1: { id: "platform", description: "Platform" },
    l2: { id: "dashboard_settings", description: "Dashboard Settings" },
    l3: { id: "banner_configuration", description: "Create and manage banners on homepage", url: "/ms/db/settings/banners/list" },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // FLOWS
  // ══════════════════════════════════════════════════════════════════════════

  // Flows > Onboarding
  onboardingAdvancedSettings: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "onboarding", description: "Onboarding" },
    l3: { id: "onboardingsettings", description: "Configure settings related to onboarding initiation and reminders", url: "/onboarding/onboardingsettings/onboarding/onboardingsettings" },
  },
  documentsClusters: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "onboarding", description: "Onboarding" },
    l3: { id: "docclusters", description: "Configure Document Clusters for Onboarding", url: "/onboarding/onboardingsettings/onboarding/docclusters" },
  },
  onboardingForms: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "onboarding", description: "Onboarding" },
    l3: { id: "onboarding_create", description: "Configure forms for onboarding process", url: "/onboarding/onboardingsettings/onboarding/manage" },
  },
  onboardingDocuments: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "onboarding", description: "Onboarding" },
    l3: { id: "adddoc", description: "Configure reference and sign-off documents", url: "/onboarding/onboardingsettings/onboarding/adddoc" },
  },
  onboardingEmailTemplates: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "onboarding", description: "Onboarding" },
    l3: { id: "onboardingemailtemplate", description: "Configure custom email templates for onboarding", url: "/onboarding/onboardingsettings/onboarding/onboardingemailtemplate" },
  },
  onboardingTaskCategories: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "onboarding", description: "Onboarding" },
    l3: { id: "onboardingtaskcategories", description: "Configure Onboarding Task Categories", url: "/onboarding/onboardingsettings/onboarding/onboardingtaskcategories" },
  },
  welcomePageSettings: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "onboarding", description: "Onboarding" },
    l3: { id: "welcomepagesettings", description: "Configure the Welcome Page for Candidate Portal", url: "/onboarding/onboardingsettings/onboarding/welcomepagesettings" },
  },
  onboardingProcessConfiguration: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "onboarding", description: "Onboarding" },
    l3: { id: "onboardingprocessconfig", description: "Configure onboarding process for different Employees", url: "/onboarding/onboardingsettings/onboarding/onboardingprocessconfig" },
  },

  // Flows > Flow Builder
  flows: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "custom_flows", description: "Flow Builder" },
    l3: { id: "flowconfig", description: "Create and manage Flows for business processes", url: "/ms/flows/config/flow-config/flows" },
  },
  journeys: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "custom_flows", description: "Flow Builder" },
    l3: { id: "journeyconfig", description: "Create and manage Journeys", url: "/ms/flows/config/journey-config/journeys" },
  },
  approvalFlows: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "custom_flows", description: "Flow Builder" },
    l3: { id: "createapprovalflow", description: "Create and manage Approval Flows", url: "/flows/flowssettings/customworkflow/manageapprovalflow" },
  },
  skipSettings: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "custom_flows", description: "Flow Builder" },
    l3: { id: "customworkflow_skip", description: "Configure Skip settings for seamless flow execution", url: "/flows/flowssettings/customworkflow/skip" },
  },
  slaSettings: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "custom_flows", description: "Flow Builder" },
    l3: { id: "customworkflow_sla", description: "Configure SLAs for approval actions", url: "/flows/flowssettings/customworkflow/sla" },
  },
  workflows: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "custom_flows", description: "Flow Builder" },
    l3: { id: "createworkflow", description: "Configure and manage onboarding workflows", url: "/flows/flowssettings/customworkflow/manageworkflow" },
  },
  customFlowAutoNumbering: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "custom_flows", description: "Flow Builder" },
    l3: { id: "customflowautonum", description: "Create auto-numbering system for Flows", url: "/flows/flowssettings/customworkflow/customflowautonum" },
  },
  flowCategory: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "custom_flows", description: "Flow Builder" },
    l3: { id: "createflowcategory", description: "Create and manage categories to group flows", url: "/ms/flows/config/flow-config/flow-category" },
  },
  stageCategory: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "custom_flows", description: "Flow Builder" },
    l3: { id: "taskcategory", description: "Create and manage categories for stages", url: "/flows/flowssettings/customworkflow/taskcategory" },
  },
  guides: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "custom_flows", description: "Flow Builder" },
    l3: { id: "guides", description: "Create and manage Guide for Custom Workflow stages", url: "/ms/flows/config/flow-config/guides" },
  },

  // Flows > Lifecycle Management
  confirmationPolicies: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "lifecycle_management_flows", description: "Lifecycle Management" },
    l3: { id: "manageconfirmationpolicy", description: "Create policies for probation review and Confirmation", url: "/ms/flows/config/standard-workflows/confirmation" },
  },
  separationPolicies: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "lifecycle_management_flows", description: "Lifecycle Management" },
    l3: { id: "manageseparationpolicy", description: "Create policies for exit management and Separation", url: "/ms/flows/config/standard-workflows/separation" },
  },
  terminationPolicies: {
    l1: { id: "flows", description: "Flows" },
    l2: { id: "lifecycle_management_flows", description: "Lifecycle Management" },
    l3: { id: "manageterminationpolicy", description: "Create policies for termination of employment", url: "/ms/flows/config/standard-workflows/termination" },
  },

  // ══════════════════════════════════════════════════════════════════════════
  // CONNECT
  // ══════════════════════════════════════════════════════════════════════════

  // Connect > Surveys
  surveyManager: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "surveys", description: "Surveys" },
    l3: { id: "survey-manager", description: "Create and manage Standalone and Business Process Linked Surveys", url: "/ms/formbuilder/survey-manager/all-surveys" },
  },
  surveyPillar: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "surveys", description: "Surveys" },
    l3: { id: "pillar", description: "Create Survey Pillars with a defined Rating Scale", url: "/flows/flowssettings/customworkflow/pillar" },
  },

  // Connect > Engage Libraries
  templates: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "library", description: "Engage Libraries" },
    l3: { id: "templates", description: "View Survey Templates", url: "/ms/formbuilder/survey-manager/libraries/templates" },
  },
  questionBank: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "library", description: "Engage Libraries" },
    l3: { id: "questionbank", description: "Create and Manage questions for surveys", url: "/ms/formbuilder/survey-manager/libraries/question-bank" },
  },
  themes: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "library", description: "Engage Libraries" },
    l3: { id: "themes", description: "Create and manage Themes to group Sub Themes", url: "/ms/formbuilder/survey-manager/libraries/themes" },
  },
  subThemes: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "library", description: "Engage Libraries" },
    l3: { id: "subthemes", description: "Create Sub Themes to assess Employee Engagement", url: "/ms/formbuilder/survey-manager/libraries/sub-themes" },
  },
  benchmarks: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "library", description: "Engage Libraries" },
    l3: { id: "benchmarks", description: "Create Benchmarks to compare Engagement against industry standards", url: "/ms/formbuilder/survey-manager/libraries/benchmarks" },
  },
  actionPlanLibrary: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "library", description: "Engage Libraries" },
    l3: { id: "actionplansuggestions", description: "Create Action Plans recommended for Engagement Sub Themes", url: "/ms/formbuilder/survey-manager/libraries/action-plan-library" },
  },
  surveyForms: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "library", description: "Engage Libraries" },
    l3: { id: "survey_forms", description: "Create and manage Forms for Surveys", url: "/ms/formbuilder/survey-manager/libraries/survey-forms" },
  },
  followUpQuestions: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "library", description: "Engage Libraries" },
    l3: { id: "followup", description: "Follow-Up Questions", url: "/ms/formbuilder/survey-manager/libraries/followup" },
  },
  acknowledgementMessage: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "library", description: "Engage Libraries" },
    l3: { id: "acknowledgement_message", description: "Acknowledgement Message", url: "/ms/formbuilder/survey-manager/libraries/ack-message" },
  },

  // Connect > Vibe
  vibeBanners: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "vibe", description: "Vibe" },
    l3: { id: "banners", description: "Create and manage banners for Vibe landing pages", url: "/settings/vibe/banners" },
  },
  contentControl: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "vibe", description: "Vibe" },
    l3: { id: "contentcontrol", description: "Configure content creation permissions on Vibe", url: "/settings/vibe/contentcontrol" },
  },
  vibeEditor: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "vibe", description: "Vibe" },
    l3: { id: "editor", description: "Specify font options for posting on Vibe", url: "/settings/vibe/editor" },
  },
  vibeVisibilitySettings: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "vibe", description: "Vibe" },
    l3: { id: "visibility_settings", description: "Customize appearance and visibility of Vibe content", url: "/settings/vibe/organization" },
  },
  systemGeneratedPosts: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "vibe", description: "Vibe" },
    l3: { id: "systemgenposts", description: "Configure auto-generated posts on Vibe", url: "/settings/vibe/systemgenposts" },
  },
  workflowPosts: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "vibe", description: "Vibe" },
    l3: { id: "manageworkflowposts", description: "Create and manage Vibe posts through Flows", url: "/settings/vibe/manageworkflowposts" },
  },
  bannedWords: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "vibe", description: "Vibe" },
    l3: { id: "bannedwords", description: "Configure banned words on Vibe", url: "/settings/vibe/bannedwords" },
  },

  // Connect > Recognition
  recognitionAdvancedSettings: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "recognition", description: "Recognition" },
    l3: { id: "randrsetting", description: "General Settings for Recognition Programs", url: "/rewards/randrsettings/randr/randrsetting" },
  },
  budgetingRules: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "recognition", description: "Recognition" },
    l3: { id: "budgetingrule", description: "Configure Budgeting Rules for Recognition", url: "/rewards/randrsettings/randr/budgetingrule" },
  },
  nominationAutoNumbering: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "recognition", description: "Recognition" },
    l3: { id: "nominationauto", description: "Create auto-numbering for Recognition Programs", url: "/rewards/randrsettings/randr/nominationauto" },
  },
  recognitionPrograms: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "recognition", description: "Recognition" },
    l3: { id: "randr_program", description: "Create and manage Recognition Programs", url: "/rewards/randrsettings/randr/program" },
  },
  recognitionEmailTemplates: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "recognition", description: "Recognition" },
    l3: { id: "recogemailtemplates", description: "Recognition Email Templates for notifications", url: "/rewards/randrsettings/randr/recogemailtemplates" },
  },

  // Connect > Engage Settings
  additionalEngageSettings: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "engage", description: "Engage Settings" },
    l3: { id: "engagement_settings", description: "Configure Engagement-related settings", url: "/settings/engagement/settings" },
  },
  customPulseQuestion: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "engage", description: "Engage Settings" },
    l3: { id: "custompulsequestion", description: "Create and manage Pulse Survey questions", url: "/settings/pulse/custompulsequestion" },
  },
  pulseSettings: {
    l1: { id: "connect", description: "Connect" },
    l2: { id: "engage", description: "Engage Settings" },
    l3: { id: "pulsesetting", description: "Configure Pulse-related settings", url: "/settings/pulse/pulsesetting" },
  },
};

/** Type for valid setting keys */
export type SettingKey = keyof typeof SETTINGS_MAP;

/** Base testId prefix for settings component */
const BASE_TESTID = "dbx-settings-l1";

/**
 * Settings Navigator - single fixture for all settings navigation.
 *
 * @example
 * await settingsNav.goTo('companyProfile');
 * await settingsNav.goTo('standardForms');
 */
export class SettingsNavigator {
  constructor(private readonly page: Page) {}

  // ══════════════════════════════════════════════════════════════════════════
  // TESTID HELPERS
  // ══════════════════════════════════════════════════════════════════════════

  private l1TestId(l1Id: string): string {
    return `${BASE_TESTID}-${l1Id}`;
  }

  private l2TestId(l1Id: string, l2Id: string): string {
    return `${BASE_TESTID}-${l1Id}-${l2Id}`;
  }

  private l3TestId(l1Id: string, l2Id: string, l3Id: string): string {
    return `${BASE_TESTID}-${l1Id}-${l2Id}-${l3Id}`;
  }

  private locator(testId: string) {
    return this.page.locator(`[data-testid="${testId}"]`);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // NAVIGATION
  // ══════════════════════════════════════════════════════════════════════════

  /**
   * Navigate to a setting.
   *
   * @param keyOrL1 - Setting key from SETTINGS_MAP, or L1 category ID
   * @param l2Id - Optional L2 category ID (required if keyOrL1 is L1 ID)
   * @param l3Id - Optional L3 item ID (required if keyOrL1 is L1 ID)
   *
   * @example
   * await settingsNav.goTo('companyProfile');
   * await settingsNav.goTo('standardForms');
   * await settingsNav.goTo('organization', 'organization_units', 'profile');
   */
  async goTo(keyOrL1: SettingKey | string, l2Id?: string, l3Id?: string): Promise<void> {
    let l1: string, l2: string, l3: string;

    if (l2Id && l3Id) {
      l1 = keyOrL1;
      l2 = l2Id;
      l3 = l3Id;
    } else {
      const path = SETTINGS_MAP[keyOrL1 as SettingKey];
      if (!path) {
        throw new Error(`Unknown setting key: "${keyOrL1}". Use a valid key from SETTINGS_MAP or provide l1Id, l2Id, l3Id.`);
      }
      l1 = path.l1.id;
      l2 = path.l2.id;
      l3 = path.l3.id;
    }

    await this.hoverL1(l1);
    await this.hoverL2(l1, l2);
    await this.clickL3(l1, l2, l3);
  }

  // ══════════════════════════════════════════════════════════════════════════
  // L1 INTERACTIONS
  // ══════════════════════════════════════════════════════════════════════════

  async hoverL1(l1Id: string): Promise<void> {
    await this.locator(this.l1TestId(l1Id)).hover();
    await this.page.waitForTimeout(300);
  }

  async clickL1(l1Id: string): Promise<void> {
    await this.locator(this.l1TestId(l1Id)).click();
    await this.page.waitForTimeout(300);
  }

  async getL1Text(l1Id: string): Promise<string> {
    return (await this.locator(this.l1TestId(l1Id)).innerText()).trim();
  }

  async isL1Visible(l1Id: string): Promise<boolean> {
    return this.locator(this.l1TestId(l1Id)).isVisible();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // L2 INTERACTIONS
  // ══════════════════════════════════════════════════════════════════════════

  async hoverL2(l1Id: string, l2Id: string): Promise<void> {
    await this.locator(this.l2TestId(l1Id, l2Id)).hover();
    await this.page.waitForTimeout(300);
  }

  async clickL2(l1Id: string, l2Id: string): Promise<void> {
    await this.locator(this.l2TestId(l1Id, l2Id)).click();
    await this.page.waitForTimeout(300);
  }

  async getL2Text(l1Id: string, l2Id: string): Promise<string> {
    return (await this.locator(this.l2TestId(l1Id, l2Id)).innerText()).trim();
  }

  async isL2Visible(l1Id: string, l2Id: string): Promise<boolean> {
    return this.locator(this.l2TestId(l1Id, l2Id)).isVisible();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // L3 INTERACTIONS
  // ══════════════════════════════════════════════════════════════════════════

  async clickL3(l1Id: string, l2Id: string, l3Id: string): Promise<void> {
    await this.locator(this.l3TestId(l1Id, l2Id, l3Id)).click();
  }

  async getL3Text(l1Id: string, l2Id: string, l3Id: string): Promise<string> {
    return (await this.locator(this.l3TestId(l1Id, l2Id, l3Id)).innerText()).trim();
  }

  async isL3Visible(l1Id: string, l2Id: string, l3Id: string): Promise<boolean> {
    return this.locator(this.l3TestId(l1Id, l2Id, l3Id)).isVisible();
  }

  async getL3Href(l1Id: string, l2Id: string, l3Id: string): Promise<string | null> {
    return this.locator(this.l3TestId(l1Id, l2Id, l3Id)).getAttribute("href");
  }

  // ══════════════════════════════════════════════════════════════════════════
  // ASSERTIONS
  // ══════════════════════════════════════════════════════════════════════════

  async assertContainerVisible(): Promise<void> {
    await expect(this.locator(BASE_TESTID)).toBeVisible();
  }

  async assertL1Visible(l1Id: string): Promise<void> {
    await expect(this.locator(this.l1TestId(l1Id))).toBeVisible();
  }

  async assertL2Visible(l1Id: string, l2Id: string): Promise<void> {
    await expect(this.locator(this.l2TestId(l1Id, l2Id))).toBeVisible();
  }

  async assertL3Visible(l1Id: string, l2Id: string, l3Id: string): Promise<void> {
    await expect(this.locator(this.l3TestId(l1Id, l2Id, l3Id))).toBeVisible();
  }

  // ══════════════════════════════════════════════════════════════════════════
  // UTILITY
  // ══════════════════════════════════════════════════════════════════════════

  /** Get full path metadata for a setting key */
  getPath(key: SettingKey): SettingsPath {
    const path = SETTINGS_MAP[key];
    if (!path) {
      throw new Error(`Unknown setting key: "${key}"`);
    }
    return path;
  }

  /** Get description for a setting key */
  getDescription(key: SettingKey): string {
    return this.getPath(key).l3.description;
  }

  /** Get URL for a setting key */
  getUrl(key: SettingKey): string {
    return this.getPath(key).l3.url;
  }

  /** Check if a setting key exists */
  hasKey(key: string): key is SettingKey {
    return key in SETTINGS_MAP;
  }

  /** Get all available setting keys */
  getAllKeys(): SettingKey[] {
    return Object.keys(SETTINGS_MAP) as SettingKey[];
  }
}

/**
 * Fixture types
 */
export interface SettingsFixtures {
  settingsNav: SettingsNavigator;
}

/**
 * Playwright test fixture for Settings navigation.
 *
 * @example
 * import { test, expect } from '../fixtures/settings.fixture';
 *
 * test('navigate to company profile', async ({ page, settingsNav }) => {
 *   await page.goto('https://forms4.qa.darwinbox.io/settings');
 *   await settingsNav.goTo('companyProfile');
 * });
 */
export const test = base.extend<SettingsFixtures>({
  settingsNav: async ({ page }, use) => {
    const navigator = new SettingsNavigator(page);
    await use(navigator);
  },
});

export { expect } from "@playwright/test";
