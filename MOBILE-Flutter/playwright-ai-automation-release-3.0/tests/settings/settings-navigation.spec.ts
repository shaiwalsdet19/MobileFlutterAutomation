import { test, expect } from "../../src/fixtures/settings.fixture";
import { loginToSystem } from "../../src/helpers/login";
import { getBaseUrl } from "../../data/instances";
import { waitForNetworkApis } from "../../src/helpers/network";

test.describe.configure({ mode: "serial", timeout: 180_000 });

/**
 * @module Settings
 * @feature Settings L1 Navigation
 * @description Validates settings navigation using dbx-settings-l1 component.
 */
test.describe("@settings Settings L1 Navigation", () => {
  const INSTANCE = process.env.INSTANCE ?? "forms4";

  test.beforeEach(async ({ page }) => {
    await loginToSystem(page, INSTANCE, "Admin");
    const baseUrl = getBaseUrl(INSTANCE);
    await waitForNetworkApis(page);
    await page.goto(`${baseUrl}settings`);
    
  });

  test("TC-001: should navigate to Standard Forms", async ({ page, settingsNav }) => {
    await page.waitForTimeout(10000);
    await settingsNav.goTo("standardForms");

    await expect(page).toHaveURL(/\/ms\/formbuilder\/settings\/list\/standard/);
  });
});
