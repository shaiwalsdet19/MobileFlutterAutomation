import { Page } from "@playwright/test";
import { resolveRole, getBaseUrl } from "../../data/instances";
import { LoginPage } from "../pages/common/login.page";

/**
 * Authenticates a user to the Darwinbox system using the POM LoginPage.
 * @param page - Playwright Page instance
 * @param instance - Instance name (e.g., 'forms4', 'payroll', 'rec6')
 * @param roleId - Role alias (e.g., 'Admin', 'Employee')
 * @param employeeIndex - Index into role array when multiple creds exist (default 0)
 */
export async function loginToSystem(
  page: Page,
  instance: string,
  roleId: string,
  employeeIndex = 0
): Promise<void> {
  const creds = resolveRole(instance, roleId, employeeIndex);
  const baseUrl = getBaseUrl(instance);
  const loginPage = new LoginPage(page);
  await loginPage.navigateToLogin(baseUrl);
  await loginPage.login(creds.username, creds.password);
}
