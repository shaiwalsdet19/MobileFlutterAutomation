import { expect, Locator as PlaywrightLocator, Response } from "@playwright/test";
import { Credentials, getBaseUrl, resolveRole } from "../../../../data/instances";
import { BasePage } from "../../base.page";
import { Locator } from "../../common/locators/common";
import { BgvLoginApi } from "./api/bgv-login.api";
import { BgvLoginLocators } from "./locators/bgv-login";

export class BgvLoginPage extends BasePage {
  async navigate(baseUrl: string): Promise<void> {
    await Promise.all([
      BgvLoginApi.waitForPageLoad(this.page).catch(() => null),
      this.goto(BgvLoginApi.getPageUrl(baseUrl)),
    ]);

    await this.waitForPageReady();
  }

  async waitForPageReady(): Promise<void> {
    await expect(this.resolve(BgvLoginLocators.form)).toBeVisible();
    await expect(this.resolve(BgvLoginLocators.emailInput)).toBeVisible();
    await expect(this.resolve(BgvLoginLocators.passwordInput)).toBeVisible();
    await expect(this.resolve(BgvLoginLocators.signInButton)).toBeVisible();
  }

  async navigateToBgv(instance: string): Promise<void> {
    await this.navigate(getBaseUrl(instance));
  }

  async waitForOtpStep(): Promise<void> {
    await expect(this.resolve(BgvLoginLocators.otpInput)).toBeVisible();
    await expect(this.resolve(BgvLoginLocators.resendOtpButton)).toBeVisible();
  }

  async getEmailValue(): Promise<string> {
    return this.resolve(BgvLoginLocators.emailInput).inputValue();
  }

  async fillEmailAddress(emailAddress: string): Promise<void> {
    await this.fill(this.resolve(BgvLoginLocators.emailInput), emailAddress);
  }

  async fillPassword(password: string): Promise<void> {
    await this.fill(this.resolve(BgvLoginLocators.passwordInput), password);
  }

  async fillCredentials(emailAddress: string, password: string): Promise<void> {
    await this.fillEmailAddress(emailAddress);
    await this.fillPassword(password);
  }

  async fillBgvCredentials(instance: string, employeeIndex = 0): Promise<void> {
    const credentials = this.getRoleCredentials(instance, "BGV", employeeIndex);
    await this.fillCredentials(credentials.username, credentials.password);
  }

  async fillOtp(otp: string): Promise<void> {
    await this.fill(this.resolve(BgvLoginLocators.otpInput), otp);
  }

  async getPasswordValue(): Promise<string> {
    return this.resolve(BgvLoginLocators.passwordInput).inputValue();
  }

  async clickSignIn(): Promise<Response | null> {
    const waitForSubmit = BgvLoginApi.waitForCredentialSubmit(this.page).catch(() => null);
    await this.click(this.resolve(BgvLoginLocators.signInButton));
    return waitForSubmit;
  }

  async clickSignInAndWaitForOtp(): Promise<Response | null> {
    const response = await this.clickSignIn();
    await this.waitForOtpStep();
    return response;
  }

  async pauseForOtpStep(): Promise<void> {
    await this.waitForOtpStep();
    await this.page.pause();
  }

  async submitOtp(otp: string): Promise<Response | null> {
    await this.fillOtp(otp);
    return this.clickSignIn();
  }

  async submitCredentialsAndPauseForOtp(
    instance: string,
    roleId = "BGV",
    employeeIndex = 0
  ): Promise<Response | null> {
    const credentials = this.getRoleCredentials(instance, roleId, employeeIndex);
    await this.navigateToBgv(instance);
    await this.fillCredentials(credentials.username, credentials.password);
    const response = await this.clickSignInAndWaitForOtp();
    await this.pauseForOtpStep();
    return response;
  }

  async loginWithRole(
    instance: string,
    roleId = "BGV",
    employeeIndex = 0
  ): Promise<Response | null> {
    const credentials = this.getRoleCredentials(instance, roleId, employeeIndex);
    await this.navigateToBgv(instance);
    await this.fillCredentials(credentials.username, credentials.password);
    return this.clickSignIn();
  }

  async loginAsBgv(instance: string, employeeIndex = 0): Promise<Response | null> {
    return this.loginWithRole(instance, "BGV", employeeIndex);
  }

  async loginAsBgvAndPauseForOtp(
    instance: string,
    employeeIndex = 0
  ): Promise<Response | null> {
    return this.submitCredentialsAndPauseForOtp(instance, "BGV", employeeIndex);
  }

  async clickResendOtp(): Promise<void> {
    await this.click(this.resolve(BgvLoginLocators.resendOtpButton));
  }

  async isSignInEnabled(): Promise<boolean> {
    return this.resolve(BgvLoginLocators.signInButton).isEnabled();
  }

  async isOtpVisible(): Promise<boolean> {
    return this.resolve(BgvLoginLocators.otpInput).isVisible().catch(() => false);
  }

  async isResendOtpVisible(): Promise<boolean> {
    return this.resolve(BgvLoginLocators.resendOtpButton).isVisible().catch(() => false);
  }

  async assertInitialState(): Promise<void> {
    await expect(this.resolve(BgvLoginLocators.form)).toBeVisible();
    await expect(this.resolve(BgvLoginLocators.signInButton)).toBeDisabled();
    await expect(this.resolve(BgvLoginLocators.otpInput)).toBeHidden();
    await expect(this.resolve(BgvLoginLocators.resendOtpButton)).toBeHidden();
  }

  async assertCredentialsReadyToSubmit(): Promise<void> {
    await expect(this.resolve(BgvLoginLocators.signInButton)).toBeEnabled();
  }

  private resolve(locator: Locator): PlaywrightLocator {
    return this.page.getByTestId(locator.testId.trim());
  }

  private getRoleCredentials(
    instance: string,
    roleId: string,
    employeeIndex = 0
  ): Credentials {
    const credentials = resolveRole(instance, roleId, employeeIndex);

    if (Array.isArray(credentials)) {
      throw new Error(
        `Expected a single credential set for role "${roleId}" in instance "${instance}".`
      );
    }

    return credentials;
  }
}
