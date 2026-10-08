import { Page, Locator } from '@playwright/test';
import { INumericInputUtils } from './base.interface.js';
import { SdsNumericInputUtils } from './sds.component.js';
import { UiNumericInputUtils } from './ui.component.js';

export class NumericInputUtils implements INumericInputUtils {
  private impl: SdsNumericInputUtils | UiNumericInputUtils | null = null;

  constructor(private page: Page, private testId: string) {}

  private async getImplementation(): Promise<INumericInputUtils> {
    if (!this.impl) {
      const tagName = await this.page.getByTestId(this.testId).evaluate(el => el.tagName.toLowerCase());
      this.impl = tagName.startsWith('dbx-ds-')
        ? new SdsNumericInputUtils(this.page, this.testId)
        : new UiNumericInputUtils(this.page, this.testId);
    }
    return this.impl;
  }

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getInput(): Locator {
    return this.page.getByTestId(`${this.testId}-input`);
  }

  async fill(value: number | string): Promise<this> {
    const impl = await this.getImplementation();
    await impl.fill(value);
    return this;
  }

  async getValue(): Promise<number | undefined> {
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

  async blur(): Promise<this> {
    const impl = await this.getImplementation();
    await impl.blur();
    return this;
  }

  async focus(): Promise<this> {
    const impl = await this.getImplementation();
    await impl.focus();
    return this;
  }
}

export { INumericInputUtils } from './base.interface.js';
export { SdsNumericInputUtils } from './sds.component.js';
export { UiNumericInputUtils } from './ui.component.js';
