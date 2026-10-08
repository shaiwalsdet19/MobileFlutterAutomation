import { BrowserContext, Page, test } from "@playwright/test";
import { BgvLoginPage } from "../../../src/pages/onboarding/bgv/bgv-login.page";

test.describe.configure({ mode: "serial", timeout: 240_000 });

test.describe("@onboarding-bgv-login BGV Login", () => {
  let page: Page;
  let bgvLoginPage: BgvLoginPage;
  let context: BrowserContext;

  const INSTANCE = "ta6";

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    bgvLoginPage = new BgvLoginPage(page);
  });

  test.afterAll(async () => {
    await page.close();
    await context.close();
  });

  test("TC-001: should open ta6 BGV login, submit credentials, and pause on OTP step", async () => {
    await bgvLoginPage.navigateToBgv(INSTANCE);
    await bgvLoginPage.assertInitialState();

    await bgvLoginPage.fillBgvCredentials(INSTANCE);
    await bgvLoginPage.assertCredentialsReadyToSubmit();

    await bgvLoginPage.clickSignInAndWaitForOtp();

    // Resume from the Playwright inspector after checking or entering the OTP manually.
    await bgvLoginPage.pauseForOtpStep();
    await bgvLoginPage.clickSignIn();
  });
});
