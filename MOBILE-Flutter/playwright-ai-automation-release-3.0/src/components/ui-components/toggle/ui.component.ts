import { Page, Locator } from '@playwright/test';
import { IToggleUtils } from './base.interface.js';

export class UiToggleUtils implements IToggleUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getToggleButton(): Locator {
    return this.page.getByTestId(`${this.testId}-button`);
  }

  async getValue(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.value === true);
  }

  async isOn(): Promise<boolean> {
    return await this.getValue();
  }

  async turnOn(): Promise<this> {
    if (!(await this.isOn())) {
      await this.getToggleButton().click();
    }
    return this;
  }

  async turnOff(): Promise<this> {
    if (await this.isOn()) {
      await this.getToggleButton().click();
    }
    return this;
  }

  async toggle(): Promise<this> {
    await this.getToggleButton().click();
    return this;
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }
}
