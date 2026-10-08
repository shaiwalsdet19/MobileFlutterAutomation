import { Page, Locator } from '@playwright/test';
import { INumericInputUtils } from './base.interface.js';

export class UiNumericInputUtils implements INumericInputUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getInput(): Locator {
    return this.page.getByTestId(`${this.testId}-input`);
  }

  async fill(value: number | string): Promise<this> {
    await this.getInput().fill(String(value));
    return this;
  }

  async getValue(): Promise<number | undefined> {
    const value = await this.getHost().evaluate((el: any) => el.value);
    return value;
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

  async blur(): Promise<this> {
    await this.getInput().blur();
    return this;
  }

  async focus(): Promise<this> {
    await this.getInput().focus();
    return this;
  }
}
