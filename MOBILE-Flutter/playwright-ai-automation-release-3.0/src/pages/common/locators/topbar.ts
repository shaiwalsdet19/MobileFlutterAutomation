import { Locator } from "./common";

export const TopBarLocators = {
  root: { testId: "dbx-ds-bluebar", description: "Root container for the top navigation bar" } as Locator,
  searchInput: { testId: "dbx-ds-bluebar-search-bar", description: "Global search input field" } as Locator,
  searchBtn: { testId: "dbx-common-btn-topbar-search", description: "Button to trigger search" } as Locator,
  searchResults: { testId: "dbx-common-list-topbar-search-results", description: "Container for search result items" } as Locator,
  searchResultItem: { testId: "dbx-common-item-topbar-search-result", description: "Individual search result item" } as Locator,
  notificationBtn: { testId: "dbx-common-btn-topbar-notifications", description: "Button to open notifications panel" } as Locator,
  notificationBadge: { testId: "dbx-common-badge-topbar-notification-count", description: "Badge showing unread notification count" } as Locator,
  profileBtn: { testId: "dbx-ds-bluebar-profile-menu", description: "Button to open user profile menu" } as Locator,
  profileMenu: { testId: "dbx-common-menu-topbar-profile", description: "Dropdown menu for profile options" } as Locator,
  logoutBtn: { testId: "dbx-ds-bluebar-profile-menu-item-Logout", description: "Button to logout from the system" } as Locator,
  settingsBtn: { testId: "dbx-common-btn-topbar-settings", description: "Button to navigate to settings" } as Locator,
  helpBtn: { testId: "dbx-common-btn-topbar-help", description: "Button to open help/support options" } as Locator,
  homeBtn: { testId: "dbx-common-btn-topbar-home", description: "Button to navigate to home/dashboard" } as Locator,
  moduleSelector: { testId: "dbx-common-dropdown-topbar-module", description: "Dropdown to switch between modules" } as Locator,

  // Sidebar Apps Menu
  sidebarAppsBtn: { testId: "dbx-sidebar-apps-button", description: "Button to toggle sidebar apps menu" } as Locator,
};

/**
 * Sidebar App Item locators for navigation menu.
 * Test ID pattern: dbx-ds-sidebar-app-item-{module_id}
 */
export const SidebarAppLocators = {
  // Employee Menu Items
  dashboard: { testId: "dbx-ds-sidebar-app-item-dashboard", description: "Dashboard", category: "employee" } as Locator,
  taskBox: { testId: "dbx-ds-sidebar-app-item-task_box", description: "Task Box", category: "employee" } as Locator,
  profile: { testId: "dbx-ds-sidebar-app-item-profile", description: "Profile", category: "employee" } as Locator,
  timeManagement: { testId: "dbx-ds-sidebar-app-item-time_management", description: "Time Management", category: "employee" } as Locator,
  employees: { testId: "dbx-ds-sidebar-app-item-employee_dashboard", description: "Employees", category: "employee" } as Locator,
  reimbursement: { testId: "dbx-ds-sidebar-app-item-reimbursement", description: "Reimbursement", category: "employee" } as Locator,
  compensation: { testId: "dbx-ds-sidebar-app-item-compensation", description: "Compensation", category: "employee" } as Locator,
  recruitment: { testId: "dbx-ds-sidebar-app-item-recruitment", description: "Recruitment", category: "employee" } as Locator,
  calendar: { testId: "dbx-ds-sidebar-app-item-calendar", description: "Calendar", category: "employee" } as Locator,
  performance: { testId: "dbx-ds-sidebar-app-item-performance", description: "Performance", category: "employee" } as Locator,
  hrDocuments: { testId: "dbx-ds-sidebar-app-item-hr_documents", description: "HR Documents", category: "employee" } as Locator,
  flows: { testId: "dbx-ds-sidebar-app-item-flows", description: "Flows", category: "employee" } as Locator,
  journeys: { testId: "dbx-ds-sidebar-app-item-journeys", description: "Journeys", category: "employee" } as Locator,
  hrPolicies: { testId: "dbx-ds-sidebar-app-item-hr_policies", description: "HR Policies", category: "employee" } as Locator,
  orgView: { testId: "dbx-ds-sidebar-app-item-org_view", description: "Org View", category: "employee" } as Locator,
  vibe: { testId: "dbx-ds-sidebar-app-item-vibe", description: "Vibe", category: "employee" } as Locator,
  reportsBuilder: { testId: "dbx-ds-sidebar-app-item-reports_builder", description: "Reports Builder", category: "employee" } as Locator,
  travel: { testId: "dbx-ds-sidebar-app-item-travel", description: "Travel", category: "employee" } as Locator,
  reports: { testId: "dbx-ds-sidebar-app-item-reports", description: "Reports", category: "employee" } as Locator,
  helpdesk: { testId: "dbx-ds-sidebar-app-item-helpdesk", description: "Helpdesk", category: "employee" } as Locator,
  employeeEngagement: { testId: "dbx-ds-sidebar-app-item-employee_engagement", description: "Employee Engagement", category: "employee" } as Locator,
  peopleAnalytics: { testId: "dbx-ds-sidebar-app-item-people_analytics", description: "People Analytics", category: "employee" } as Locator,

  // Admin Menu Items
  settings: { testId: "dbx-ds-sidebar-app-item-settings", description: "Settings", category: "admin" } as Locator,
  onboarding: { testId: "dbx-ds-sidebar-app-item-onboarding", description: "Onboarding", category: "admin" } as Locator,
  recognition: { testId: "dbx-ds-sidebar-app-item-recognition", description: "Recognition", category: "admin" } as Locator,
  performanceAdmin: { testId: "dbx-ds-sidebar-app-item-performance_admin", description: "Performance (Admin)", category: "admin" } as Locator,
  surveyManagerAdmin: { testId: "dbx-ds-sidebar-app-item-survey_manager_admin", description: "Survey Manager", category: "admin" } as Locator,
  positionManagementAdmin: { testId: "dbx-ds-sidebar-app-item-position_management_admin", description: "Position Management", category: "admin" } as Locator,
  helpdeskAdmin: { testId: "dbx-ds-sidebar-app-item-helpdesk_admin", description: "Helpdesk (Admin)", category: "admin" } as Locator,
  payroll: { testId: "dbx-ds-sidebar-app-item-payroll", description: "Payroll", category: "admin" } as Locator,
  payrollReportsAdmin: { testId: "dbx-ds-sidebar-app-item-payroll_reports_admin", description: "Payroll Reports", category: "admin" } as Locator,
  travelExpenseAdmin: { testId: "dbx-ds-sidebar-app-item-travel_expense_admin", description: "Travel & Expense", category: "admin" } as Locator,
  hrDocumentsAdmin: { testId: "dbx-ds-sidebar-app-item-hr_documents_admin", description: "HR Documents (Admin)", category: "admin" } as Locator,
  darwinboxStudioAdmin: { testId: "dbx-ds-sidebar-app-item-darwinbox_studio_admin", description: "Darwinbox Studio", category: "admin" } as Locator,
  importCenterAdmin: { testId: "dbx-ds-sidebar-app-item-import_center_admin", description: "Imports Center", category: "admin" } as Locator,
  flowManagerAdmin: { testId: "dbx-ds-sidebar-app-item-flow_manager_admin", description: "Flow Manager", category: "admin" } as Locator,
  talentSearchAdmin: { testId: "dbx-ds-sidebar-app-item-talent_search_admin", description: "Talent Search", category: "admin" } as Locator,
  talentIntelligenceAdmin: { testId: "dbx-ds-sidebar-app-item-talent_intelligence_admin", description: "Talent Intelligence", category: "admin" } as Locator,
  darwinboxHelpPortalAdmin: { testId: "dbx-ds-sidebar-app-item-darwinbox_help_portal_admin", description: "Darwinbox Help Portal", category: "admin" } as Locator,
};
