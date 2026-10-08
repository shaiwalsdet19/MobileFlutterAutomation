import { LoginLocators } from "./locators/common";
import { BasePage } from "../base.page";

export class LoginPage extends BasePage {

  async login(username: string, password: string): Promise<void> {
    await this.fill(this.getByTestId(LoginLocators.usernameInput.testId), username);
    await this.fill(this.getByTestId(LoginLocators.passwordInput.testId), password);
    await this.click(this.getByTestId(LoginLocators.submitBtn.testId));
  }

  async navigateToLogin(baseUrl: string): Promise<void> {
    await this.goto(`${baseUrl}user/login`);
  }
}
