import { test, expect, Page } from "@playwright/test";
import { loginToSystem } from "../../src/helpers/login";

test.describe.configure({ mode: "serial", timeout: 180_000 });

/**
 * @module Common
 * @feature Login Functionality
 * @description Validates authentication flow across personas for Darwinbox instances.
 */
test.describe("@common-login Login Functionality", () => {
  let page: Page;

  const INSTANCE = process.env.INSTANCE ?? "";

  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  test.afterAll(async () => {
    await page.close();
  });

  test("TC-001: Admin should authenticate successfully", async () => {
    await loginToSystem(page, INSTANCE, "Admin");
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });
  });

  test("TC-002: Employee should authenticate successfully", async () => {
    await loginToSystem(page, INSTANCE, "Employee");
    await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });
  });
});
