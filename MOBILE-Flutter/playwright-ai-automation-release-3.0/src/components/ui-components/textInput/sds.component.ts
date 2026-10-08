import { Page, Locator } from '@playwright/test';
import { ITextInputUtils } from './base.interface.js';

export class SdsTextInputUtils implements ITextInputUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getInput(): Locator {
    return this.page.getByTestId(`${this.testId}-input`);
  }

  async fill(value: string): Promise<this> {
    await this.getInput().fill(value);
    return this;
  }

  async getValue(): Promise<string> {
    return await this.getHost().evaluate((el: any) => el.value ?? '');
  }

  async clear(): Promise<this> {
    await this.getInput().clear();
    return this;
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }

  async getErrorMessage(): Promise<string | null> {
    return await this.getHost().evaluate((el: any) => el.errorMessage ?? null);
  }
}
