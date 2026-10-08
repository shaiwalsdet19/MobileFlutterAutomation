import { Page, Locator } from '@playwright/test';
import { ITextInputUtils } from './base.interface.js';
import { SdsTextInputUtils } from './sds.component.js';
import { UiTextInputUtils } from './ui.component.js';

export class TextInputUtils implements ITextInputUtils {
  private impl: SdsTextInputUtils | UiTextInputUtils | null = null;

  constructor(private page: Page, private testId: string) {}

  private async getImplementation(): Promise<ITextInputUtils> {
    if (!this.impl) {
      const tagName = await this.page.getByTestId(this.testId).evaluate(el => el.tagName.toLowerCase());
      this.impl = tagName.startsWith('dbx-ds-')
        ? new SdsTextInputUtils(this.page, this.testId)
        : new UiTextInputUtils(this.page, this.testId);
    }
    return this.impl;
  }

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getInput(): Locator {
    return this.page.getByTestId(`${this.testId}-input`);
  }

  async fill(value: string): Promise<this> {
    const impl = await this.getImplementation();
    await impl.fill(value);
    return this;
  }

  async getValue(): Promise<string> {
    const impl = await this.getImplementation();
    return impl.getValue();
  }

  async clear(): Promise<this> {
    const impl = await this.getImplementation();
    await impl.clear();
    return this;
  }

  async isDisabled(): Promise<boolean> {
    const impl = await this.getImplementation();
    return impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    const impl = await this.getImplementation();
    return impl.isReadOnly();
  }

  async getErrorMessage(): Promise<string | null> {
    const impl = await this.getImplementation();
    return impl.getErrorMessage();
  }
}

export { ITextInputUtils } from './base.interface.js';
export { SdsTextInputUtils } from './sds.component.js';
export { UiTextInputUtils } from './ui.component.js';
