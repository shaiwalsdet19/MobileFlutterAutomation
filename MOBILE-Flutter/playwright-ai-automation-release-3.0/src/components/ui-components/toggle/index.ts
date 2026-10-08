import { Page, Locator } from '@playwright/test';
import { IToggleUtils } from './base.interface.js';
import { SdsToggleUtils } from './sds.component.js';
import { UiToggleUtils } from './ui.component.js';

export class ToggleUtils implements IToggleUtils {
  private impl: SdsToggleUtils | UiToggleUtils | null = null;

  constructor(private page: Page, private testId: string) {}

  private async getImplementation(): Promise<SdsToggleUtils | UiToggleUtils> {
    if (!this.impl) {
      const tag = await this.page.getByTestId(this.testId).evaluate(el => el.tagName.toLowerCase());
      this.impl = tag === 'dbx-toggle-switch'
        ? new UiToggleUtils(this.page, this.testId)
        : new SdsToggleUtils(this.page, this.testId);
    }
    return this.impl;
  }

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getToggleButton(): Locator {
    if (this.impl) {
      return this.impl.getToggleButton();
    }
    return new SdsToggleUtils(this.page, this.testId).getToggleButton();
  }

  async getValue(): Promise<boolean> {
    return (await this.getImplementation()).getValue();
  }

  async isOn(): Promise<boolean> {
    return (await this.getImplementation()).isOn();
  }

  async turnOn(): Promise<this> {
    await (await this.getImplementation()).turnOn();
    return this;
  }

  async turnOff(): Promise<this> {
    await (await this.getImplementation()).turnOff();
    return this;
  }

  async toggle(): Promise<this> {
    await (await this.getImplementation()).toggle();
    return this;
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getImplementation()).isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    return (await this.getImplementation()).isReadOnly();
  }
}

export { SdsToggleUtils } from './sds.component.js';
export { UiToggleUtils } from './ui.component.js';
