import { Page, Locator } from '@playwright/test';
import { IConsentUtils } from './base.interface.js';

export class SdsConsentUtils implements IConsentUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getCheckbox(): Locator {
    return this.page.getByTestId(`${this.testId}-checkbox`);
  }

  getCheckboxInput(): Locator {
    return this.page.getByTestId(`${this.testId}-checkbox-input`);
  }

  async getValue(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.value === true);
  }

  async isAccepted(): Promise<boolean> {
    return await this.getValue();
  }

  async accept(): Promise<this> {
    if (!(await this.isAccepted())) {
      await this.getCheckboxInput().click();
    }
    return this;
  }

  async decline(): Promise<this> {
    if (await this.isAccepted()) {
      await this.getCheckboxInput().click();
    }
    return this;
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }
}
