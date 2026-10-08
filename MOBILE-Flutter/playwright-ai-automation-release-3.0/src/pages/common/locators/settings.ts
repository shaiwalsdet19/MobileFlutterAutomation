import { Locator } from "./common";

/**
 * Settings menu locators for topbar search.
 * Test ID pattern: dbx-ds-bluebar-search-setting-item-{id}
 */
export const SettingsLocators = {
  // Connect > Engage Settings
  engagementSettings: { testId: "dbx-ds-bluebar-search-setting-item-engagement_settings", description: "Additional Engage Settings", hierarchy: "Connect | Engage Settings" } as Locator,
  custompulsequestion: { testId: "dbx-ds-bluebar-search-setting-item-custompulsequestion", description: "Custom Pulse Question", hierarchy: "Connect | Engage Settings" } as Locator,
  pulsesetting: { testId: "dbx-ds-bluebar-search-setting-item-pulsesetting", description: "Pulse Settings", hierarchy: "Connect | Engage Settings" } as Locator,

  // Connect > Recognition
  randrsetting: { testId: "dbx-ds-bluebar-search-setting-item-randrsetting", description: "Advanced Settings (Recognition)", hierarchy: "Connect | Recognition" } as Locator,
  budgetingrule: { testId: "dbx-ds-bluebar-search-setting-item-budgetingrule", description: "Budgeting Rules", hierarchy: "Connect | Recognition" } as Locator,
  nominationauto: { testId: "dbx-ds-bluebar-search-setting-item-nominationauto", description: "Nomination Auto Numbering", hierarchy: "Connect | Recognition" } as Locator,
  randrProgram: { testId: "dbx-ds-bluebar-search-setting-item-randr_program", description: "Programs", hierarchy: "Connect | Recognition" } as Locator,
  recogemailtemplates: { testId: "dbx-ds-bluebar-search-setting-item-recogemailtemplates", description: "Recognition Email Templates", hierarchy: "Connect | Recognition" } as Locator,

  // Connect > Vibe
  banners: { testId: "dbx-ds-bluebar-search-setting-item-banners", description: "Banners", hierarchy: "Connect | Vibe" } as Locator,
  contentcontrol: { testId: "dbx-ds-bluebar-search-setting-item-contentcontrol", description: "Content Control", hierarchy: "Connect | Vibe" } as Locator,
  editor: { testId: "dbx-ds-bluebar-search-setting-item-editor", description: "Editor", hierarchy: "Connect | Vibe" } as Locator,
  visibilitySettings: { testId: "dbx-ds-bluebar-search-setting-item-visibility_settings", description: "Visibility Settings", hierarchy: "Connect | Vibe" } as Locator,
  systemgenposts: { testId: "dbx-ds-bluebar-search-setting-item-systemgenposts", description: "System Generated Posts", hierarchy: "Connect | Vibe" } as Locator,
  manageworkflowposts: { testId: "dbx-ds-bluebar-search-setting-item-manageworkflowposts", description: "Workflow Posts", hierarchy: "Connect | Vibe" } as Locator,
  bannedwords: { testId: "dbx-ds-bluebar-search-setting-item-bannedwords", description: "Banned Words", hierarchy: "Connect | Vibe" } as Locator,

  // Connect > Engage Libraries
  templates: { testId: "dbx-ds-bluebar-search-setting-item-templates", description: "Templates", hierarchy: "Connect | Engage Libraries" } as Locator,
  questionbank: { testId: "dbx-ds-bluebar-search-setting-item-questionbank", description: "Question Bank", hierarchy: "Connect | Engage Libraries" } as Locator,
  themes: { testId: "dbx-ds-bluebar-search-setting-item-themes", description: "Themes", hierarchy: "Connect | Engage Libraries" } as Locator,
  subthemes: { testId: "dbx-ds-bluebar-search-setting-item-subthemes", description: "Sub-Themes", hierarchy: "Connect | Engage Libraries" } as Locator,
  benchmarks: { testId: "dbx-ds-bluebar-search-setting-item-benchmarks", description: "Benchmarks", hierarchy: "Connect | Engage Libraries" } as Locator,
  actionplansuggestions: { testId: "dbx-ds-bluebar-search-setting-item-actionplansuggestions", description: "Action Plan Library", hierarchy: "Connect | Engage Libraries" } as Locator,
  surveyForms: { testId: "dbx-ds-bluebar-search-setting-item-survey_forms", description: "Survey Forms", hierarchy: "Connect | Engage Libraries" } as Locator,
  followup: { testId: "dbx-ds-bluebar-search-setting-item-followup", description: "Follow-Up Questions", hierarchy: "Connect | Engage Libraries" } as Locator,
  acknowledgementMessage: { testId: "dbx-ds-bluebar-search-setting-item-acknowledgement_message", description: "Acknowledgement Message", hierarchy: "Connect | Engage Libraries" } as Locator,

  // Connect > Surveys
  surveyManager: { testId: "dbx-ds-bluebar-search-setting-item-survey-manager", description: "Survey Manager", hierarchy: "Connect | Surveys" } as Locator,
  pillar: { testId: "dbx-ds-bluebar-search-setting-item-pillar", description: "Survey Pillar", hierarchy: "Connect | Surveys" } as Locator,

  // Platform > Additional Configurations
  companyalias: { testId: "dbx-ds-bluebar-search-setting-item-companyalias", description: "Aliases", hierarchy: "Platform | Additional Configurations" } as Locator,
  decisionmatrix: { testId: "dbx-ds-bluebar-search-setting-item-decisionmatrix", description: "Decision Matrix", hierarchy: "Platform | Additional Configurations" } as Locator,
  scale: { testId: "dbx-ds-bluebar-search-setting-item-scale", description: "Scales", hierarchy: "Platform | Additional Configurations" } as Locator,
  assignment: { testId: "dbx-ds-bluebar-search-setting-item-assignment", description: "User Assignments", hierarchy: "Platform | Additional Configurations" } as Locator,
  event: { testId: "dbx-ds-bluebar-search-setting-item-event", description: "Event", hierarchy: "Platform | Additional Configurations" } as Locator,
  subevent: { testId: "dbx-ds-bluebar-search-setting-item-subevent", description: "Sub Event", hierarchy: "Platform | Additional Configurations" } as Locator,
  customfieldsManage: { testId: "dbx-ds-bluebar-search-setting-item-customfields_manage", description: "Custom Fields", hierarchy: "Platform | Additional Configurations" } as Locator,
  reasonlist: { testId: "dbx-ds-bluebar-search-setting-item-reasonlist", description: "Reason List", hierarchy: "Platform | Additional Configurations" } as Locator,
  extramenu: { testId: "dbx-ds-bluebar-search-setting-item-extramenu", description: "Redirection", hierarchy: "Platform | Additional Configurations" } as Locator,
  conversion: { testId: "dbx-ds-bluebar-search-setting-item-conversion", description: "Currency Conversion", hierarchy: "Platform | Additional Configurations" } as Locator,
  delegationsetting: { testId: "dbx-ds-bluebar-search-setting-item-delegationsetting", description: "Delegations", hierarchy: "Platform | Additional Configurations" } as Locator,
  attestations: { testId: "dbx-ds-bluebar-search-setting-item-attestations", description: "Attestations", hierarchy: "Platform | Additional Configurations" } as Locator,
  customimport: { testId: "dbx-ds-bluebar-search-setting-item-customimport", description: "Custom Import", hierarchy: "Platform | Additional Configurations" } as Locator,
  importAutonumbering: { testId: "dbx-ds-bluebar-search-setting-item-import_autonumbering", description: "Import Auto Numbering", hierarchy: "Platform | Additional Configurations" } as Locator,
  hoverviewconfiguration: { testId: "dbx-ds-bluebar-search-setting-item-hoverviewconfiguration", description: "Hover View Configuration", hierarchy: "Platform | Additional Configurations" } as Locator,
  bgvvendor: { testId: "dbx-ds-bluebar-search-setting-item-bgvvendor", description: "BGV Vendor", hierarchy: "Platform | Additional Configurations" } as Locator,
  verificationPackages: { testId: "dbx-ds-bluebar-search-setting-item-verification_packages", description: "Verification Packages", hierarchy: "Platform | Additional Configurations" } as Locator,
  verificationStatus: { testId: "dbx-ds-bluebar-search-setting-item-verification_status", description: "Verification Status", hierarchy: "Platform | Additional Configurations" } as Locator,
  tag: { testId: "dbx-ds-bluebar-search-setting-item-tag", description: "Tags", hierarchy: "Platform | Additional Configurations" } as Locator,
  payscalegroup: { testId: "dbx-ds-bluebar-search-setting-item-payscalegroup", description: "Pay Scale Group", hierarchy: "Platform | Additional Configurations" } as Locator,
  taskcategoryconfig: { testId: "dbx-ds-bluebar-search-setting-item-taskcategoryconfig", description: "Task Category", hierarchy: "Platform | Additional Configurations" } as Locator,
  calculatedfields: { testId: "dbx-ds-bluebar-search-setting-item-calculatedfields", description: "Calculated Fields", hierarchy: "Platform | Additional Configurations" } as Locator,
  todoactivity: { testId: "dbx-ds-bluebar-search-setting-item-todoactivity", description: "Activities", hierarchy: "Platform | Additional Configurations" } as Locator,

  // Platform > Notification Centre
  notificationTemplates: { testId: "dbx-ds-bluebar-search-setting-item-notification_templates", description: "Standard Notifications", hierarchy: "Platform | Notification Centre" } as Locator,
  createwfemailtemplate: { testId: "dbx-ds-bluebar-search-setting-item-createwfemailtemplate", description: "Custom Notifications", hierarchy: "Platform | Notification Centre" } as Locator,
  emaildigest: { testId: "dbx-ds-bluebar-search-setting-item-emaildigest", description: "Email Digest", hierarchy: "Platform | Notification Centre" } as Locator,
  notificationSettings: { testId: "dbx-ds-bluebar-search-setting-item-notification_settings", description: "Additional Settings", hierarchy: "Platform | Notification Centre" } as Locator,

  // Platform > Form Builder
  pdfForms: { testId: "dbx-ds-bluebar-search-setting-item-pdf_forms", description: "Form Builder - PDF Forms", hierarchy: "Platform | Form Builder" } as Locator,
  standardForms: { testId: "dbx-ds-bluebar-search-setting-item-standard_forms", description: "Form Builder - Standard Forms", hierarchy: "Platform | Form Builder" } as Locator,
  smartTags: { testId: "dbx-ds-bluebar-search-setting-item-smart_tags", description: "Smart Tags", hierarchy: "Platform | Form Builder" } as Locator,

  // Platform > Document Management
  documentcategories: { testId: "dbx-ds-bluebar-search-setting-item-documentcategories", description: "Document Categories", hierarchy: "Platform | Document Management" } as Locator,
  letterSettings: { testId: "dbx-ds-bluebar-search-setting-item-letterSettings", description: "HR Policies and Letters Settings", hierarchy: "Platform | Document Management" } as Locator,
  selfgeneration: { testId: "dbx-ds-bluebar-search-setting-item-selfgeneration", description: "Self Generate Setting", hierarchy: "Platform | Document Management" } as Locator,
  letterhead: { testId: "dbx-ds-bluebar-search-setting-item-letterhead", description: "Letter Head Management", hierarchy: "Platform | Document Management" } as Locator,
  lettersignature: { testId: "dbx-ds-bluebar-search-setting-item-lettersignature", description: "Signing Authority", hierarchy: "Platform | Document Management" } as Locator,
  letterAutoNumber: { testId: "dbx-ds-bluebar-search-setting-item-letterAutoNumber", description: "Letter Auto Numbering", hierarchy: "Platform | Document Management" } as Locator,
  letterctcformatting: { testId: "dbx-ds-bluebar-search-setting-item-letterctcformatting", description: "CTC Table Formatting Configurations", hierarchy: "Platform | Document Management" } as Locator,
  documenttemplateformats: { testId: "dbx-ds-bluebar-search-setting-item-documenttemplateformats", description: "Document Template Name Formats", hierarchy: "Platform | Document Management" } as Locator,

  // Platform > Reporting & Analytics
  reportbuilder: { testId: "dbx-ds-bluebar-search-setting-item-reportbuilder", description: "Reports Builder", hierarchy: "Platform | Reporting & Analytics" } as Locator,
  reportscheduler: { testId: "dbx-ds-bluebar-search-setting-item-reportscheduler", description: "Reports Scheduler", hierarchy: "Platform | Reporting & Analytics" } as Locator,
  customroster: { testId: "dbx-ds-bluebar-search-setting-item-customroster", description: "Custom Roster", hierarchy: "Platform | Reporting & Analytics" } as Locator,
  analyticsadvancedsettings: { testId: "dbx-ds-bluebar-search-setting-item-analyticsadvancedsettings", description: "Analytics Advanced Settings", hierarchy: "Platform | Reporting & Analytics" } as Locator,
  audittrail: { testId: "dbx-ds-bluebar-search-setting-item-audittrail", description: "Audit Trail", hierarchy: "Platform | Reporting & Analytics" } as Locator,
  analyticssubscriptions: { testId: "dbx-ds-bluebar-search-setting-item-analyticssubscriptions", description: "Analytics Subscription", hierarchy: "Platform | Reporting & Analytics" } as Locator,
  analyticsCustomFieldMappings: { testId: "dbx-ds-bluebar-search-setting-item-analytics_custom_field_mappings", description: "Analytics Custom Field Mappings", hierarchy: "Platform | Reporting & Analytics" } as Locator,
  analyticscalendar: { testId: "dbx-ds-bluebar-search-setting-item-analyticscalendar", description: "Analytics Dashboard Level Settings", hierarchy: "Platform | Reporting & Analytics" } as Locator,
  studiosettings: { testId: "dbx-ds-bluebar-search-setting-item-studiosettings", description: "Studio Settings", hierarchy: "Platform | Reporting & Analytics" } as Locator,

  // Platform > Access & Security
  allowmobile: { testId: "dbx-ds-bluebar-search-setting-item-allowmobile", description: "Mobile App Access", hierarchy: "Platform | Access & Security" } as Locator,
  passwordsettings: { testId: "dbx-ds-bluebar-search-setting-item-passwordsettings", description: "Password Settings", hierarchy: "Platform | Access & Security" } as Locator,
  platformaccessibilitysettings: { testId: "dbx-ds-bluebar-search-setting-item-platformaccessibilitysettings", description: "Platform Accessibility Settings", hierarchy: "Platform | Access & Security" } as Locator,
  ssosettings: { testId: "dbx-ds-bluebar-search-setting-item-ssosettings", description: "Single Sign-On", hierarchy: "Platform | Access & Security" } as Locator,
  sensitiveDataConfiguration: { testId: "dbx-ds-bluebar-search-setting-item-sensitive_data_configuration", description: "Sensitive Data Configuration", hierarchy: "Platform | Access & Security" } as Locator,

  // Platform > Account Details
  administration: { testId: "dbx-ds-bluebar-search-setting-item-administration", description: "Administrator", hierarchy: "Platform | Account Details" } as Locator,
  neousers: { testId: "dbx-ds-bluebar-search-setting-item-neousers", description: "Neo Users", hierarchy: "Platform | Account Details" } as Locator,

  // Platform > Data Management
  consentmanagement: { testId: "dbx-ds-bluebar-search-setting-item-consentmanagement", description: "Consent Management", hierarchy: "Platform | Data Management" } as Locator,
  dataPurgePolicy: { testId: "dbx-ds-bluebar-search-setting-item-data_purge_policy", description: "Data Purge Policy", hierarchy: "Platform | Data Management" } as Locator,
  dataPurgeLogs: { testId: "dbx-ds-bluebar-search-setting-item-data_purge_logs", description: "Data Purge Logs", hierarchy: "Platform | Data Management" } as Locator,

  // Platform > Dashboard Settings
  applayout: { testId: "dbx-ds-bluebar-search-setting-item-applayout", description: "Dashboard Layout", hierarchy: "Platform | Dashboard Settings" } as Locator,
  platformExperience: { testId: "dbx-ds-bluebar-search-setting-item-platform_experience", description: "General Display Settings", hierarchy: "Platform | Dashboard Settings" } as Locator,
  platformTheme: { testId: "dbx-ds-bluebar-search-setting-item-platform_theme", description: "Platform Theme", hierarchy: "Platform | Dashboard Settings" } as Locator,
  bannerConfiguration: { testId: "dbx-ds-bluebar-search-setting-item-banner_configuration", description: "Banner Configuration", hierarchy: "Platform | Dashboard Settings" } as Locator,

  // Flows > Flow Builder
  flowconfig: { testId: "dbx-ds-bluebar-search-setting-item-flowconfig", description: "Flows", hierarchy: "Flows | Flow Builder" } as Locator,
  journeyconfig: { testId: "dbx-ds-bluebar-search-setting-item-journeyconfig", description: "Journeys", hierarchy: "Flows | Flow Builder" } as Locator,
  createapprovalflow: { testId: "dbx-ds-bluebar-search-setting-item-createapprovalflow", description: "Approval Flows", hierarchy: "Flows | Flow Builder" } as Locator,
  customworkflowSkip: { testId: "dbx-ds-bluebar-search-setting-item-customworkflow_skip", description: "Skip Settings", hierarchy: "Flows | Flow Builder" } as Locator,
  customworkflowSla: { testId: "dbx-ds-bluebar-search-setting-item-customworkflow_sla", description: "SLA Settings", hierarchy: "Flows | Flow Builder" } as Locator,
  createworkflow: { testId: "dbx-ds-bluebar-search-setting-item-createworkflow", description: "Workflows", hierarchy: "Flows | Flow Builder" } as Locator,
  customflowautonum: { testId: "dbx-ds-bluebar-search-setting-item-customflowautonum", description: "Custom Flow Auto Numbering", hierarchy: "Flows | Flow Builder" } as Locator,
  createflowcategory: { testId: "dbx-ds-bluebar-search-setting-item-createflowcategory", description: "Flow Category", hierarchy: "Flows | Flow Builder" } as Locator,
  taskcategory: { testId: "dbx-ds-bluebar-search-setting-item-taskcategory", description: "Stage Category", hierarchy: "Flows | Flow Builder" } as Locator,
  guides: { testId: "dbx-ds-bluebar-search-setting-item-guides", description: "Guides", hierarchy: "Flows | Flow Builder" } as Locator,

  // Flows > Onboarding
  onboardingsettings: { testId: "dbx-ds-bluebar-search-setting-item-onboardingsettings", description: "Advanced Settings (Onboarding)", hierarchy: "Flows | Onboarding" } as Locator,
  docclusters: { testId: "dbx-ds-bluebar-search-setting-item-docclusters", description: "Documents Clusters", hierarchy: "Flows | Onboarding" } as Locator,
  onboardingCreate: { testId: "dbx-ds-bluebar-search-setting-item-onboarding_create", description: "Onboarding Forms", hierarchy: "Flows | Onboarding" } as Locator,
  adddoc: { testId: "dbx-ds-bluebar-search-setting-item-adddoc", description: "Onboarding Documents", hierarchy: "Flows | Onboarding" } as Locator,
  onboardingemailtemplate: { testId: "dbx-ds-bluebar-search-setting-item-onboardingemailtemplate", description: "Onboarding Email Templates", hierarchy: "Flows | Onboarding" } as Locator,
  onboardingtaskcategories: { testId: "dbx-ds-bluebar-search-setting-item-onboardingtaskcategories", description: "Onboarding Task Categories", hierarchy: "Flows | Onboarding" } as Locator,
  welcomepagesettings: { testId: "dbx-ds-bluebar-search-setting-item-welcomepagesettings", description: "Welcome Page Settings", hierarchy: "Flows | Onboarding" } as Locator,
  onboardingprocessconfig: { testId: "dbx-ds-bluebar-search-setting-item-onboardingprocessconfig", description: "Onboarding Process Configuration", hierarchy: "Flows | Onboarding" } as Locator,

  // Flows > Lifecycle Management
  manageconfirmationpolicy: { testId: "dbx-ds-bluebar-search-setting-item-manageconfirmationpolicy", description: "Confirmation Policies", hierarchy: "Flows | Lifecycle Management" } as Locator,
  manageseparationpolicy: { testId: "dbx-ds-bluebar-search-setting-item-manageseparationpolicy", description: "Separation Policies", hierarchy: "Flows | Lifecycle Management" } as Locator,
  manageterminationpolicy: { testId: "dbx-ds-bluebar-search-setting-item-manageterminationpolicy", description: "Termination Policies", hierarchy: "Flows | Lifecycle Management" } as Locator,
  contractmanagement: { testId: "dbx-ds-bluebar-search-setting-item-contractmanagement", description: "Contract Policies", hierarchy: "Flows | Lifecycle Management" } as Locator,

  // Organization > Organization Units
  profile: { testId: "dbx-ds-bluebar-search-setting-item-profile", description: "Company Profile", hierarchy: "Organization | Organization Units" } as Locator,
  grpcompany: { testId: "dbx-ds-bluebar-search-setting-item-grpcompany", description: "Group Company", hierarchy: "Organization | Organization Units" } as Locator,
  businessunit: { testId: "dbx-ds-bluebar-search-setting-item-businessunit", description: "Business Unit", hierarchy: "Organization | Organization Units" } as Locator,
  division: { testId: "dbx-ds-bluebar-search-setting-item-division", description: "Division", hierarchy: "Organization | Organization Units" } as Locator,
  capability: { testId: "dbx-ds-bluebar-search-setting-item-capability", description: "Capability", hierarchy: "Organization | Organization Units" } as Locator,
  departments: { testId: "dbx-ds-bluebar-search-setting-item-departments", description: "Department", hierarchy: "Organization | Organization Units" } as Locator,

  // Organization > Roles & Career
  designationnames: { testId: "dbx-ds-bluebar-search-setting-item-designationnames", description: "Designation Name", hierarchy: "Organization | Roles & Career" } as Locator,
  designations: { testId: "dbx-ds-bluebar-search-setting-item-designations", description: "Designation", hierarchy: "Organization | Roles & Career" } as Locator,
  designationtitles: { testId: "dbx-ds-bluebar-search-setting-item-designationtitles", description: "Designation Title", hierarchy: "Organization | Roles & Career" } as Locator,
  functionalarea: { testId: "dbx-ds-bluebar-search-setting-item-functionalarea", description: "Functional Area", hierarchy: "Organization | Roles & Career" } as Locator,
  grades: { testId: "dbx-ds-bluebar-search-setting-item-grades", description: "Grade", hierarchy: "Organization | Roles & Career" } as Locator,
  bands: { testId: "dbx-ds-bluebar-search-setting-item-bands", description: "Band", hierarchy: "Organization | Roles & Career" } as Locator,
  joblevel: { testId: "dbx-ds-bluebar-search-setting-item-joblevel", description: "Job Level", hierarchy: "Organization | Roles & Career" } as Locator,
  neevlevel: { testId: "dbx-ds-bluebar-search-setting-item-neevlevel", description: "Contribution Level", hierarchy: "Organization | Roles & Career" } as Locator,
  positionsetting: { testId: "dbx-ds-bluebar-search-setting-item-positionsetting", description: "Position", hierarchy: "Organization | Roles & Career" } as Locator,
  assignmentone: { testId: "dbx-ds-bluebar-search-setting-item-assignmentone", description: "Assignment one", hierarchy: "Organization | Roles & Career" } as Locator,
  assignmenttwo: { testId: "dbx-ds-bluebar-search-setting-item-assignmenttwo", description: "Mission Two", hierarchy: "Organization | Roles & Career" } as Locator,
  assignmentthree: { testId: "dbx-ds-bluebar-search-setting-item-assignmentthree", description: "Assignment Three", hierarchy: "Organization | Roles & Career" } as Locator,
  jdtemplate: { testId: "dbx-ds-bluebar-search-setting-item-jdtemplate", description: "JD Template", hierarchy: "Organization | Roles & Career" } as Locator,
  jobfamily: { testId: "dbx-ds-bluebar-search-setting-item-jobfamily", description: "Job Family", hierarchy: "Organization | Roles & Career" } as Locator,
  rolecategory: { testId: "dbx-ds-bluebar-search-setting-item-rolecategory", description: "Role Category", hierarchy: "Organization | Roles & Career" } as Locator,

  // Organization > Locations
  offices: { testId: "dbx-ds-bluebar-search-setting-item-offices", description: "Locations", hierarchy: "Organization | Locations" } as Locator,
  locationtype: { testId: "dbx-ds-bluebar-search-setting-item-locationtype", description: "Location Type", hierarchy: "Organization | Locations" } as Locator,
  centretype: { testId: "dbx-ds-bluebar-search-setting-item-centretype", description: "Centre Type", hierarchy: "Organization | Locations" } as Locator,
  citytype: { testId: "dbx-ds-bluebar-search-setting-item-citytype", description: "City Type", hierarchy: "Organization | Locations" } as Locator,
  region: { testId: "dbx-ds-bluebar-search-setting-item-region", description: "Region", hierarchy: "Organization | Locations" } as Locator,
  locationcountrymaster: { testId: "dbx-ds-bluebar-search-setting-item-locationcountrymaster", description: "Locations Master", hierarchy: "Organization | Locations" } as Locator,

  // Organization > Role Based Access Controls
  standardPermissions: { testId: "dbx-ds-bluebar-search-setting-item-standardPermissions", description: "Manage Standard Permission Roles", hierarchy: "Organization | Role Based Access Controls" } as Locator,
  customPermissions: { testId: "dbx-ds-bluebar-search-setting-item-customPermissions", description: "Manage Custom Permission Roles", hierarchy: "Organization | Role Based Access Controls" } as Locator,
  reportpermissionsEdit: { testId: "dbx-ds-bluebar-search-setting-item-reportpermissions_edit", description: "Manage Report Permissions", hierarchy: "Organization | Role Based Access Controls" } as Locator,

  // Organization > Employee Data
  employmentdetailssettings: { testId: "dbx-ds-bluebar-search-setting-item-employmentdetailssettings", description: "Employment Details Settings", hierarchy: "Organization | Employee Data" } as Locator,
  nominations: { testId: "dbx-ds-bluebar-search-setting-item-nominations", description: "Nominations", hierarchy: "Organization | Employee Data" } as Locator,
  orgsettings: { testId: "dbx-ds-bluebar-search-setting-item-orgsettings", description: "Org View Settings", hierarchy: "Organization | Employee Data" } as Locator,
  profilefieldoptions: { testId: "dbx-ds-bluebar-search-setting-item-profilefieldoptions", description: "Profile Field Options", hierarchy: "Organization | Employee Data" } as Locator,
  profilesetting: { testId: "dbx-ds-bluebar-search-setting-item-profilesetting", description: "Profile View Settings", hierarchy: "Organization | Employee Data" } as Locator,
  weeklyoff: { testId: "dbx-ds-bluebar-search-setting-item-weeklyoff", description: "Weekly Off", hierarchy: "Organization | Employee Data" } as Locator,
  mobiledashboard: { testId: "dbx-ds-bluebar-search-setting-item-mobiledashboard", description: "Mobile Reportee Dashboard", hierarchy: "Organization | Employee Data" } as Locator,
  directoryviewsetting: { testId: "dbx-ds-bluebar-search-setting-item-directoryviewsetting", description: "Directory View Setting", hierarchy: "Organization | Employee Data" } as Locator,
  nationalidmanager: { testId: "dbx-ds-bluebar-search-setting-item-nationalidmanager", description: "National ID", hierarchy: "Organization | Employee Data" } as Locator,
  dependentrules: { testId: "dbx-ds-bluebar-search-setting-item-dependentrules", description: "Dependent Rules", hierarchy: "Organization | Employee Data" } as Locator,

  // Organization > Employment Management
  employeeNumbering: { testId: "dbx-ds-bluebar-search-setting-item-employee_numbering", description: "Employee ID Numbering", hierarchy: "Organization | Employment Management" } as Locator,
  employeeType: { testId: "dbx-ds-bluebar-search-setting-item-employee_type", description: "Employee Type", hierarchy: "Organization | Employment Management" } as Locator,
  employeeSubtype: { testId: "dbx-ds-bluebar-search-setting-item-employee_subtype", description: "Employee Sub Type", hierarchy: "Organization | Employment Management" } as Locator,

  // Organization > Lifecycle Management
  probation: { testId: "dbx-ds-bluebar-search-setting-item-probation", description: "Probation Period", hierarchy: "Organization | Lifecycle Management" } as Locator,
  contractperiod: { testId: "dbx-ds-bluebar-search-setting-item-contractperiod", description: "Contract Period", hierarchy: "Organization | Lifecycle Management" } as Locator,
  advancesettings: { testId: "dbx-ds-bluebar-search-setting-item-advancesettings", description: "Employee Advanced Settings", hierarchy: "Organization | Lifecycle Management" } as Locator,
  notice: { testId: "dbx-ds-bluebar-search-setting-item-notice", description: "Notice Period", hierarchy: "Organization | Lifecycle Management" } as Locator,
  retire: { testId: "dbx-ds-bluebar-search-setting-item-retire", description: "Retirement Period", hierarchy: "Organization | Lifecycle Management" } as Locator,
  deactivate: { testId: "dbx-ds-bluebar-search-setting-item-deactivate", description: "Separation Reasons", hierarchy: "Organization | Lifecycle Management" } as Locator,

  // Organization > Project Management
  companyActivity: { testId: "dbx-ds-bluebar-search-setting-item-company_activity", description: "Activities", hierarchy: "Organization | Project Management" } as Locator,
  project: { testId: "dbx-ds-bluebar-search-setting-item-project", description: "Project", hierarchy: "Organization | Project Management" } as Locator,
  projectRoles: { testId: "dbx-ds-bluebar-search-setting-item-project_roles", description: "Project Roles", hierarchy: "Organization | Project Management" } as Locator,
  rateCard: { testId: "dbx-ds-bluebar-search-setting-item-rate_card", description: "Rate Cards", hierarchy: "Organization | Project Management" } as Locator,
  subActivity: { testId: "dbx-ds-bluebar-search-setting-item-sub_activity", description: "Sub-Activity", hierarchy: "Organization | Project Management" } as Locator,

  // Organization > Spend Tracking
  costcenter: { testId: "dbx-ds-bluebar-search-setting-item-costcenter", description: "Cost Center", hierarchy: "Organization | Spend Tracking" } as Locator,
  ledger: { testId: "dbx-ds-bluebar-search-setting-item-ledger", description: "Ledgers", hierarchy: "Organization | Spend Tracking" } as Locator,

  // Time > Attendance
  attendancesettings: { testId: "dbx-ds-bluebar-search-setting-item-attendancesettings", description: "Attendance Settings", hierarchy: "Time | Attendance" } as Locator,
  checkin: { testId: "dbx-ds-bluebar-search-setting-item-checkin", description: "Check In", hierarchy: "Time | Attendance" } as Locator,
  geofencing: { testId: "dbx-ds-bluebar-search-setting-item-geofencing", description: "Geofencing", hierarchy: "Time | Attendance" } as Locator,
  attendanceOption: { testId: "dbx-ds-bluebar-search-setting-item-attendance_option", description: "IP Restrictions", hierarchy: "Time | Attendance" } as Locator,
  overtime: { testId: "dbx-ds-bluebar-search-setting-item-overtime", description: "Overtime Policies", hierarchy: "Time | Attendance" } as Locator,
  overtimesettings: { testId: "dbx-ds-bluebar-search-setting-item-overtimesettings", description: "Overtime Settings", hierarchy: "Time | Attendance" } as Locator,
  overtimeslabs: { testId: "dbx-ds-bluebar-search-setting-item-overtimeslabs", description: "Overtime Slabs", hierarchy: "Time | Attendance" } as Locator,
  attendancePolicy: { testId: "dbx-ds-bluebar-search-setting-item-attendance_policy", description: "Attendance Policies", hierarchy: "Time | Attendance" } as Locator,
  regularisereasons: { testId: "dbx-ds-bluebar-search-setting-item-regularisereasons", description: "Reason (Attendance)", hierarchy: "Time | Attendance" } as Locator,
  shiftblocks: { testId: "dbx-ds-bluebar-search-setting-item-shiftblocks", description: "Shift Blocks", hierarchy: "Time | Attendance" } as Locator,
  shift: { testId: "dbx-ds-bluebar-search-setting-item-shift", description: "Shift", hierarchy: "Time | Attendance" } as Locator,
  attendanceTags: { testId: "dbx-ds-bluebar-search-setting-item-attendance_tags", description: "Tags (Attendance)", hierarchy: "Time | Attendance" } as Locator,
  overtimeThreshold: { testId: "dbx-ds-bluebar-search-setting-item-overtime_threshold", description: "Overtime Threshold", hierarchy: "Time | Attendance" } as Locator,
  overtimeSimulator: { testId: "dbx-ds-bluebar-search-setting-item-overtime_simulator", description: "Overtime Simulator", hierarchy: "Time | Attendance" } as Locator,

  // Time > Leave
  leavesCreate: { testId: "dbx-ds-bluebar-search-setting-item-leaves_create", description: "Leave Policies", hierarchy: "Time | Leave" } as Locator,
  subCategory: { testId: "dbx-ds-bluebar-search-setting-item-sub_category", description: "External Sub Category", hierarchy: "Time | Leave" } as Locator,
  holidays: { testId: "dbx-ds-bluebar-search-setting-item-holidays", description: "Holiday", hierarchy: "Time | Leave" } as Locator,
  unpaidreasons: { testId: "dbx-ds-bluebar-search-setting-item-unpaidreasons", description: "Reason (Leave)", hierarchy: "Time | Leave" } as Locator,
  leavesSettings: { testId: "dbx-ds-bluebar-search-setting-item-leaves_settings", description: "Leave Settings", hierarchy: "Time | Leave" } as Locator,
  unpaid: { testId: "dbx-ds-bluebar-search-setting-item-unpaid", description: "Unpaid Leave", hierarchy: "Time | Leave" } as Locator,

  // Time > Timesheets
  timesheetsSetting: { testId: "dbx-ds-bluebar-search-setting-item-timesheets_setting", description: "Timesheet Settings", hierarchy: "Time | Timesheets" } as Locator,
  timesheetsPolicy: { testId: "dbx-ds-bluebar-search-setting-item-timesheets_policy", description: "Timesheet Policies", hierarchy: "Time | Timesheets" } as Locator,

  // Time > Others
  approvalflow: { testId: "dbx-ds-bluebar-search-setting-item-approvalflow", description: "Time Approval Flow", hierarchy: "Time | Others" } as Locator,

  // Talent > Performance
  goalplankra: { testId: "dbx-ds-bluebar-search-setting-item-goalplankra", description: "New Goal Plan Framework", hierarchy: "Talent | Performance" } as Locator,
  goal: { testId: "dbx-ds-bluebar-search-setting-item-goal", description: "Common Goals / Key Result Areas", hierarchy: "Talent | Performance" } as Locator,
  reviewkra: { testId: "dbx-ds-bluebar-search-setting-item-reviewkra", description: "Review Cycle", hierarchy: "Talent | Performance" } as Locator,
  cyclekra: { testId: "dbx-ds-bluebar-search-setting-item-cyclekra", description: "Review", hierarchy: "Talent | Performance" } as Locator,
  calibration: { testId: "dbx-ds-bluebar-search-setting-item-calibration", description: "Calibration", hierarchy: "Talent | Performance" } as Locator,
  exclusion: { testId: "dbx-ds-bluebar-search-setting-item-exclusion", description: "Exclusions", hierarchy: "Talent | Performance" } as Locator,
  categories: { testId: "dbx-ds-bluebar-search-setting-item-categories", description: "Scorecard Pillar", hierarchy: "Talent | Performance" } as Locator,
  normalization: { testId: "dbx-ds-bluebar-search-setting-item-normalization", description: "Normalization Settings", hierarchy: "Talent | Performance" } as Locator,
  promotion: { testId: "dbx-ds-bluebar-search-setting-item-promotion", description: "Promotion Framework", hierarchy: "Talent | Performance" } as Locator,
  potential: { testId: "dbx-ds-bluebar-search-setting-item-potential", description: "Potential Framework", hierarchy: "Talent | Performance" } as Locator,
  pmsPerformance: { testId: "dbx-ds-bluebar-search-setting-item-pms_performance", description: "Performance Framework", hierarchy: "Talent | Performance" } as Locator,
  achievementmapping: { testId: "dbx-ds-bluebar-search-setting-item-achievementmapping", description: "Achievement Mapping", hierarchy: "Talent | Performance" } as Locator,
  metric: { testId: "dbx-ds-bluebar-search-setting-item-metric", description: "Metric", hierarchy: "Talent | Performance" } as Locator,
  customformula: { testId: "dbx-ds-bluebar-search-setting-item-customformula", description: "Custom Formula", hierarchy: "Talent | Performance" } as Locator,
  mapassignmentgrid: { testId: "dbx-ds-bluebar-search-setting-item-mapassignmentgrid", description: "Map N Grid", hierarchy: "Talent | Performance" } as Locator,
  pmsOther: { testId: "dbx-ds-bluebar-search-setting-item-pms_other", description: "Other Settings (Performance)", hierarchy: "Talent | Performance" } as Locator,
  performancealias: { testId: "dbx-ds-bluebar-search-setting-item-performancealias", description: "Performance Alias", hierarchy: "Talent | Performance" } as Locator,
  reviewparameter: { testId: "dbx-ds-bluebar-search-setting-item-reviewparameter", description: "Review Parameter", hierarchy: "Talent | Performance" } as Locator,
  reviewparameteroption: { testId: "dbx-ds-bluebar-search-setting-item-reviewparameteroption", description: "Review Parameter Options", hierarchy: "Talent | Performance" } as Locator,
  reviewparametermapping: { testId: "dbx-ds-bluebar-search-setting-item-reviewparametermapping", description: "Review Parameter Mapping", hierarchy: "Talent | Performance" } as Locator,
  talentreviewcycle: { testId: "dbx-ds-bluebar-search-setting-item-talentreviewcycle", description: "Talent Review Cycle", hierarchy: "Talent | Performance" } as Locator,
  talentreview: { testId: "dbx-ds-bluebar-search-setting-item-talentreview", description: "Talent Review", hierarchy: "Talent | Performance" } as Locator,
  talentcalibration: { testId: "dbx-ds-bluebar-search-setting-item-talentcalibration", description: "Talent Calibration", hierarchy: "Talent | Performance" } as Locator,
  teamgoal: { testId: "dbx-ds-bluebar-search-setting-item-teamgoal", description: "Team Goals / Key Result Areas Framework", hierarchy: "Talent | Performance" } as Locator,

  // Talent > Feedback
  contfeed: { testId: "dbx-ds-bluebar-search-setting-item-contfeed", description: "Feedback", hierarchy: "Talent | Feedback" } as Locator,
  feedbackquestions: { testId: "dbx-ds-bluebar-search-setting-item-feedbackquestions", description: "Feedback Questions", hierarchy: "Talent | Feedback" } as Locator,
  contfeedOther: { testId: "dbx-ds-bluebar-search-setting-item-contfeed_other", description: "Other Settings (Feedback)", hierarchy: "Talent | Feedback" } as Locator,

  // Talent > MSF
  msfquestions: { testId: "dbx-ds-bluebar-search-setting-item-msfquestions", description: "MSF Question", hierarchy: "Talent | MSF" } as Locator,
  msfquestionset: { testId: "dbx-ds-bluebar-search-setting-item-msfquestionset", description: "MSF Questionnaires", hierarchy: "Talent | MSF" } as Locator,
  msfprocess: { testId: "dbx-ds-bluebar-search-setting-item-msfprocess", description: "MSF Process", hierarchy: "Talent | MSF" } as Locator,
  msfOther: { testId: "dbx-ds-bluebar-search-setting-item-msf_other", description: "Other Settings (MSF)", hierarchy: "Talent | MSF" } as Locator,

  // Talent > Talent Acquisition
  recruitmentUser: { testId: "dbx-ds-bluebar-search-setting-item-recruitment_user", description: "Advanced Settings (Recruitment)", hierarchy: "Talent | Talent Acquisition" } as Locator,
  reasons: { testId: "dbx-ds-bluebar-search-setting-item-reasons", description: "Candidate Decision & Archival Reasons", hierarchy: "Talent | Talent Acquisition" } as Locator,
  assignassessment: { testId: "dbx-ds-bluebar-search-setting-item-assignassessment", description: "Assign Assessment", hierarchy: "Talent | Talent Acquisition" } as Locator,
  jobid: { testId: "dbx-ds-bluebar-search-setting-item-jobid", description: "Auto Job ID", hierarchy: "Talent | Talent Acquisition" } as Locator,
  requisitionautonumber: { testId: "dbx-ds-bluebar-search-setting-item-requisitionautonumber", description: "Auto Numbering Requisition ID", hierarchy: "Talent | Talent Acquisition" } as Locator,
  candidatenumbering: { testId: "dbx-ds-bluebar-search-setting-item-candidatenumbering", description: "Candidate Auto Numbering", hierarchy: "Talent | Talent Acquisition" } as Locator,
  customtags: { testId: "dbx-ds-bluebar-search-setting-item-customtags", description: "Custom Tags", hierarchy: "Talent | Talent Acquisition" } as Locator,
  customsource: { testId: "dbx-ds-bluebar-search-setting-item-customsource", description: "Custom Source", hierarchy: "Talent | Talent Acquisition" } as Locator,
  customsourcetype: { testId: "dbx-ds-bluebar-search-setting-item-customsourcetype", description: "Custom Source Type", hierarchy: "Talent | Talent Acquisition" } as Locator,
  duplicitycheck: { testId: "dbx-ds-bluebar-search-setting-item-duplicitycheck", description: "Duplicity Check Settings", hierarchy: "Talent | Talent Acquisition" } as Locator,
  employerbrand: { testId: "dbx-ds-bluebar-search-setting-item-employerbrand", description: "Employer Brand Settings", hierarchy: "Talent | Talent Acquisition" } as Locator,
  manageevaluation: { testId: "dbx-ds-bluebar-search-setting-item-manageevaluation", description: "Evaluation Forms", hierarchy: "Talent | Talent Acquisition" } as Locator,
  recruiter: { testId: "dbx-ds-bluebar-search-setting-item-recruiter", description: "External Recruiters", hierarchy: "Talent | Talent Acquisition" } as Locator,
  externalrecruitergroup: { testId: "dbx-ds-bluebar-search-setting-item-externalrecruitergroup", description: "External Recruiter Groups", hierarchy: "Talent | Talent Acquisition" } as Locator,
  hiringleads: { testId: "dbx-ds-bluebar-search-setting-item-hiringleads", description: "Hiring lead", hierarchy: "Talent | Talent Acquisition" } as Locator,
  hiringworkflow: { testId: "dbx-ds-bluebar-search-setting-item-hiringworkflow", description: "Hiring Workflow", hierarchy: "Talent | Talent Acquisition" } as Locator,
  interviewguide: { testId: "dbx-ds-bluebar-search-setting-item-interviewguide", description: "Interview Guides", hierarchy: "Talent | Talent Acquisition" } as Locator,
  interviewtypes: { testId: "dbx-ds-bluebar-search-setting-item-interviewtypes", description: "Interview Types", hierarchy: "Talent | Talent Acquisition" } as Locator,
  portal: { testId: "dbx-ds-bluebar-search-setting-item-portal", description: "Job Portals", hierarchy: "Talent | Talent Acquisition" } as Locator,
  onboardingsalstr: { testId: "dbx-ds-bluebar-search-setting-item-onboardingsalstr", description: "Offer Letter Salary Structures", hierarchy: "Talent | Talent Acquisition" } as Locator,
  recemailtemplates: { testId: "dbx-ds-bluebar-search-setting-item-recemailtemplates", description: "Recruitment Email Templates", hierarchy: "Talent | Talent Acquisition" } as Locator,
  referalpolicyconfiguration: { testId: "dbx-ds-bluebar-search-setting-item-referalpolicyconfiguration", description: "Referral Policy Configuration", hierarchy: "Talent | Talent Acquisition" } as Locator,
  rehireduplicitycheck: { testId: "dbx-ds-bluebar-search-setting-item-rehireduplicitycheck", description: "Rehire Check Settings", hierarchy: "Talent | Talent Acquisition" } as Locator,
  reqspan: { testId: "dbx-ds-bluebar-search-setting-item-reqspan", description: "Raise Requisition Scope", hierarchy: "Talent | Talent Acquisition" } as Locator,
  tatSlaSettings: { testId: "dbx-ds-bluebar-search-setting-item-tat_sla_settings", description: "SLA & TAT Settings", hierarchy: "Talent | Talent Acquisition" } as Locator,
  jobtags: { testId: "dbx-ds-bluebar-search-setting-item-jobtags", description: "Job Tags", hierarchy: "Talent | Talent Acquisition" } as Locator,
  careerpagesettings: { testId: "dbx-ds-bluebar-search-setting-item-careerpagesettings", description: "Careers Page Settings", hierarchy: "Talent | Talent Acquisition" } as Locator,

  // Talent > Talent Intelligence
  tier: { testId: "dbx-ds-bluebar-search-setting-item-tier", description: "Competency Tiers", hierarchy: "Talent | Talent Intelligence" } as Locator,
  competency: { testId: "dbx-ds-bluebar-search-setting-item-competency", description: "Competencies", hierarchy: "Talent | Talent Intelligence" } as Locator,
  mapping: { testId: "dbx-ds-bluebar-search-setting-item-mapping", description: "Competencies Mapping", hierarchy: "Talent | Talent Intelligence" } as Locator,
  talentassesment: { testId: "dbx-ds-bluebar-search-setting-item-talentassesment", description: "Talent Assessment Settings", hierarchy: "Talent | Talent Intelligence" } as Locator,
  ngridframework: { testId: "dbx-ds-bluebar-search-setting-item-ngridframework", description: "N Grid", hierarchy: "Talent | Talent Intelligence" } as Locator,
  skillsettings: { testId: "dbx-ds-bluebar-search-setting-item-skillsettings", description: "Skill Settings", hierarchy: "Talent | Talent Intelligence" } as Locator,
  paritycluster: { testId: "dbx-ds-bluebar-search-setting-item-paritycluster", description: "Parity Clusters", hierarchy: "Talent | Talent Intelligence" } as Locator,

  // Talent > Talent Hub
  othersettings: { testId: "dbx-ds-bluebar-search-setting-item-othersettings", description: "Other Settings (Talent Hub)", hierarchy: "Talent | Talent Hub" } as Locator,
  talentalias: { testId: "dbx-ds-bluebar-search-setting-item-talentalias", description: "Talent Aliases", hierarchy: "Talent | Talent Hub" } as Locator,

  // Service Delivery > Helpdesk
  helpdeskCategory: { testId: "dbx-ds-bluebar-search-setting-item-helpdesk_category", description: "Category", hierarchy: "Service Delivery | Helpdesk" } as Locator,
  helpdeskSubcategory: { testId: "dbx-ds-bluebar-search-setting-item-helpdesk_subcategory", description: "Subcategory", hierarchy: "Service Delivery | Helpdesk" } as Locator,
  assignmentRules: { testId: "dbx-ds-bluebar-search-setting-item-assignment_rules", description: "Rules Engine", hierarchy: "Service Delivery | Helpdesk" } as Locator,
  helpdeskSla: { testId: "dbx-ds-bluebar-search-setting-item-helpdesk_sla", description: "SLA", hierarchy: "Service Delivery | Helpdesk" } as Locator,
  businesshours: { testId: "dbx-ds-bluebar-search-setting-item-businesshours", description: "Business Hours", hierarchy: "Service Delivery | Helpdesk" } as Locator,
  helpdeskSettings: { testId: "dbx-ds-bluebar-search-setting-item-helpdesk_settings", description: "Settings", hierarchy: "Service Delivery | Helpdesk" } as Locator,
  emailparsersettings: { testId: "dbx-ds-bluebar-search-setting-item-emailparsersettings", description: "Email Parser Settings", hierarchy: "Service Delivery | Helpdesk" } as Locator,
  faqcat: { testId: "dbx-ds-bluebar-search-setting-item-faqcat", description: "FAQ Category", hierarchy: "Service Delivery | Helpdesk" } as Locator,
  addfaqs: { testId: "dbx-ds-bluebar-search-setting-item-addfaqs", description: "FAQ Settings", hierarchy: "Service Delivery | Helpdesk" } as Locator,
  reassignmentreason: { testId: "dbx-ds-bluebar-search-setting-item-reassignmentreason", description: "Reason (Helpdesk)", hierarchy: "Service Delivery | Helpdesk" } as Locator,

  // Service Delivery > Chatbot
  chatbotAccess: { testId: "dbx-ds-bluebar-search-setting-item-chatbot_access", description: "Chatbot Access", hierarchy: "Service Delivery | Chatbot" } as Locator,
  standardIntents: { testId: "dbx-ds-bluebar-search-setting-item-standard_intents", description: "Manage Standard Intents", hierarchy: "Service Delivery | Chatbot" } as Locator,

  // Spend > Compensation Setup
  structures: { testId: "dbx-ds-bluebar-search-setting-item-structures", description: "Salary Structures", hierarchy: "Spend | Compensation Setup" } as Locator,
  frequencyTable: { testId: "dbx-ds-bluebar-search-setting-item-frequencyTable", description: "Frequency Table", hierarchy: "Spend | Compensation Setup" } as Locator,
  frequency: { testId: "dbx-ds-bluebar-search-setting-item-frequency", description: "Pay Frequency", hierarchy: "Spend | Compensation Setup" } as Locator,
  salarycomponents: { testId: "dbx-ds-bluebar-search-setting-item-salarycomponents", description: "Salary Components", hierarchy: "Spend | Compensation Setup" } as Locator,
  payscale: { testId: "dbx-ds-bluebar-search-setting-item-payscale", description: "Pay Scale", hierarchy: "Spend | Compensation Setup" } as Locator,
  payGroups: { testId: "dbx-ds-bluebar-search-setting-item-payGroups", description: "Pay Group", hierarchy: "Spend | Compensation Setup" } as Locator,

  // Spend > Payroll Setup
  extrapayment: { testId: "dbx-ds-bluebar-search-setting-item-extrapayment", description: "Extra Payments Categories", hierarchy: "Spend | Payroll Setup" } as Locator,
  payslipdesign: { testId: "dbx-ds-bluebar-search-setting-item-payslipdesign", description: "Pay slips Design", hierarchy: "Spend | Payroll Setup" } as Locator,
  negativeSalaryConfig: { testId: "dbx-ds-bluebar-search-setting-item-negativeSalaryConfig", description: "Negative Salary Management", hierarchy: "Spend | Payroll Setup" } as Locator,
  schedulerConfiguration: { testId: "dbx-ds-bluebar-search-setting-item-schedulerConfiguration", description: "Schedular Configuration", hierarchy: "Spend | Payroll Setup" } as Locator,
  wageGroups: { testId: "dbx-ds-bluebar-search-setting-item-wageGroups", description: "Wage Mapping", hierarchy: "Spend | Payroll Setup" } as Locator,
  loantype: { testId: "dbx-ds-bluebar-search-setting-item-loantype", description: "Loans Type", hierarchy: "Spend | Payroll Setup" } as Locator,
  deductioncategories: { testId: "dbx-ds-bluebar-search-setting-item-deductioncategories", description: "Advances / Extra Deductions Categories", hierarchy: "Spend | Payroll Setup" } as Locator,
  perquisite: { testId: "dbx-ds-bluebar-search-setting-item-perquisite", description: "Perquisites", hierarchy: "Spend | Payroll Setup" } as Locator,
  bankdetails: { testId: "dbx-ds-bluebar-search-setting-item-bankdetails", description: "Bank Details", hierarchy: "Spend | Payroll Setup" } as Locator,
  minimumwagesglobal: { testId: "dbx-ds-bluebar-search-setting-item-minimumwagesglobal", description: "Minimum Wages", hierarchy: "Spend | Payroll Setup" } as Locator,
  personacategories: { testId: "dbx-ds-bluebar-search-setting-item-personacategories", description: "Persona Categories", hierarchy: "Spend | Payroll Setup" } as Locator,

  // Spend > Payroll Additional Settings
  employeeCompensationSettings: { testId: "dbx-ds-bluebar-search-setting-item-employee_compensation_settings", description: "Visibility Settings", hierarchy: "Spend | Payroll Additional Settings" } as Locator,
  countrySpecificSettings: { testId: "dbx-ds-bluebar-search-setting-item-countrySpecificSettings", description: "Country Specific Settings", hierarchy: "Spend | Payroll Additional Settings" } as Locator,
  riversettings: { testId: "dbx-ds-bluebar-search-setting-item-riversettings", description: "River Settings", hierarchy: "Spend | Payroll Additional Settings" } as Locator,
  additionalearnings: { testId: "dbx-ds-bluebar-search-setting-item-additionalearnings", description: "Additional Earnings", hierarchy: "Spend | Payroll Additional Settings" } as Locator,
  payrollspecificfields: { testId: "dbx-ds-bluebar-search-setting-item-payrollspecificfields", description: "Payroll Specific Master Fields", hierarchy: "Spend | Payroll Additional Settings" } as Locator,
  additionaldeductions: { testId: "dbx-ds-bluebar-search-setting-item-additionaldeductions", description: "Additional Deductions", hierarchy: "Spend | Payroll Additional Settings" } as Locator,
  releaseconfig: { testId: "dbx-ds-bluebar-search-setting-item-releaseconfig", description: "Declaration Schedule Manager", hierarchy: "Spend | Payroll Additional Settings" } as Locator,
  payrollDocumentsCategory: { testId: "dbx-ds-bluebar-search-setting-item-payrollDocumentsCategory", description: "Payroll Documents Categories", hierarchy: "Spend | Payroll Additional Settings" } as Locator,

  // Spend > Expense Management
  reimbunits: { testId: "dbx-ds-bluebar-search-setting-item-reimbunits", description: "Units", hierarchy: "Spend | Expense Management" } as Locator,
  locationcategory: { testId: "dbx-ds-bluebar-search-setting-item-locationcategory", description: "Location Category", hierarchy: "Spend | Expense Management" } as Locator,
  vehicletype: { testId: "dbx-ds-bluebar-search-setting-item-vehicletype", description: "Vehicle Types", hierarchy: "Spend | Expense Management" } as Locator,
  distancetier: { testId: "dbx-ds-bluebar-search-setting-item-distancetier", description: "Distance Tiers", hierarchy: "Spend | Expense Management" } as Locator,
  createcategory: { testId: "dbx-ds-bluebar-search-setting-item-createcategory", description: "Reimbursement Category", hierarchy: "Spend | Expense Management" } as Locator,
  perunitSettings: { testId: "dbx-ds-bluebar-search-setting-item-perunit_settings", description: "Per-unit Expense Type", hierarchy: "Spend | Expense Management" } as Locator,
  createperdiem: { testId: "dbx-ds-bluebar-search-setting-item-createperdiem", description: "Per-diem Expense Type", hierarchy: "Spend | Expense Management" } as Locator,
  createmileagepolicy: { testId: "dbx-ds-bluebar-search-setting-item-createmileagepolicy", description: "Per-mileage Expense Type", hierarchy: "Spend | Expense Management" } as Locator,
  reimbursementTenantsettings: { testId: "dbx-ds-bluebar-search-setting-item-reimbursement_tenantsettings", description: "Reimbursement Settings", hierarchy: "Spend | Expense Management" } as Locator,
  reimbautonumbering: { testId: "dbx-ds-bluebar-search-setting-item-reimbautonumbering", description: "Reimbursement Auto-numbering", hierarchy: "Spend | Expense Management" } as Locator,
  createadvancetype: { testId: "dbx-ds-bluebar-search-setting-item-createadvancetype", description: "Advance Types", hierarchy: "Spend | Expense Management" } as Locator,
  createadvancepolicy: { testId: "dbx-ds-bluebar-search-setting-item-createadvancepolicy", description: "Advance Policy", hierarchy: "Spend | Expense Management" } as Locator,
  configurerules: { testId: "dbx-ds-bluebar-search-setting-item-configurerules", description: "Configure Rules", hierarchy: "Spend | Expense Management" } as Locator,

  // Spend > Travel
  traveltype: { testId: "dbx-ds-bluebar-search-setting-item-traveltype", description: "Travel Type", hierarchy: "Spend | Travel" } as Locator,
  travelclass: { testId: "dbx-ds-bluebar-search-setting-item-travelclass", description: "Travel Class", hierarchy: "Spend | Travel" } as Locator,
  travelpolicy: { testId: "dbx-ds-bluebar-search-setting-item-travelpolicy", description: "Travel Policies", hierarchy: "Spend | Travel" } as Locator,
  advancepolicy: { testId: "dbx-ds-bluebar-search-setting-item-advancepolicy", description: "Advance Policies", hierarchy: "Spend | Travel" } as Locator,
  traveltenantsettings: { testId: "dbx-ds-bluebar-search-setting-item-traveltenantsettings", description: "Travel Settings", hierarchy: "Spend | Travel" } as Locator,
  travelAgent: { testId: "dbx-ds-bluebar-search-setting-item-travel_agent", description: "Travel Agents", hierarchy: "Spend | Travel" } as Locator,
  agency: { testId: "dbx-ds-bluebar-search-setting-item-agency", description: "Travel Agencies", hierarchy: "Spend | Travel" } as Locator,
  agencyassignment: { testId: "dbx-ds-bluebar-search-setting-item-agencyassignment", description: "Travel Agency Assignment", hierarchy: "Spend | Travel" } as Locator,
  travelReason: { testId: "dbx-ds-bluebar-search-setting-item-travel_reason", description: "Modification/Cancellation Reasons", hierarchy: "Spend | Travel" } as Locator,
  travelAutonumber: { testId: "dbx-ds-bluebar-search-setting-item-travel_autonumber", description: "Travel Auto Numbering", hierarchy: "Spend | Travel" } as Locator,

  // Spend > Others
  travelBudget: { testId: "dbx-ds-bluebar-search-setting-item-travel_budget", description: "Budgeting", hierarchy: "Spend | Others" } as Locator,
  travelComponents: { testId: "dbx-ds-bluebar-search-setting-item-travel_components", description: "Tax Components", hierarchy: "Spend | Others" } as Locator,
  componentgroups: { testId: "dbx-ds-bluebar-search-setting-item-componentgroups", description: "Tax Groups", hierarchy: "Spend | Others" } as Locator,

  // Marketplace > Applications
  assets: { testId: "dbx-ds-bluebar-search-setting-item-assets", description: "Asset Management", hierarchy: "Marketplace | Applications" } as Locator,

  // Marketplace > Consumption SKUs
  consumptionsSkus: { testId: "dbx-ds-bluebar-search-setting-item-consumptions_skus", description: "Consumption & Logs", hierarchy: "Marketplace | Consumption SKUs" } as Locator,
  enablement: { testId: "dbx-ds-bluebar-search-setting-item-enablement", description: "Enablement", hierarchy: "Marketplace | Consumption SKUs" } as Locator,
};
