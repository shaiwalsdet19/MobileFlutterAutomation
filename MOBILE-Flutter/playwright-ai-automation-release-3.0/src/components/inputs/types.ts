import { Page, Locator } from "@playwright/test";

export abstract class BaseInputUtils {
  constructor(protected readonly page: Page, protected readonly testId: string) {}

  protected getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }
}
