import { Page, Locator as PlaywrightLocator } from "@playwright/test";
import { Locator as LocatorDefinition } from "./common/locators/common";

export abstract class BasePage {
  constructor(protected readonly page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  async fill(locator: PlaywrightLocator, value: string): Promise<void> {
    await locator.fill(value);
  }

  async click(locator: PlaywrightLocator): Promise<void> {
    await locator.click();
  }

  async waitForURL(pattern: string | RegExp): Promise<void> {
    await this.page.waitForURL(pattern);
  }

  async waitForTimeout(timeout: number): Promise<void> {
    await this.page.waitForTimeout(timeout);
  }

  getByTestId(testId: string): PlaywrightLocator {
    return this.page.getByTestId(testId);
  }

  protected resolveLocator(locator: LocatorDefinition): PlaywrightLocator {
    const selector = locator.testId.trim();
    return this.getByTestId(selector);
  }

  protected async getLocatorText(locator: LocatorDefinition): Promise<string> {
    return (await this.resolveLocator(locator).innerText()).replace(/\s+/g, " ").trim();
  }
}
