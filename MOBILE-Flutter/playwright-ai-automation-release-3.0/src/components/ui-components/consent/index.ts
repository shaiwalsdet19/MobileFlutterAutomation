import { Page, Locator } from '@playwright/test';
import { IConsentUtils } from './base.interface.js';
import { SdsConsentUtils } from './sds.component.js';

export class ConsentUtils implements IConsentUtils {
  private impl: SdsConsentUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsConsentUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  getCheckbox(): Locator {
    return this.impl.getCheckbox();
  }

  getCheckboxInput(): Locator {
    return this.impl.getCheckboxInput();
  }

  async getValue(): Promise<boolean> {
    return this.impl.getValue();
  }

  async isAccepted(): Promise<boolean> {
    return this.impl.isAccepted();
  }

  async accept(): Promise<this> {
    await this.impl.accept();
    return this;
  }

  async decline(): Promise<this> {
    await this.impl.decline();
    return this;
  }

  async isDisabled(): Promise<boolean> {
    return this.impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    return this.impl.isReadOnly();
  }
}

export { SdsConsentUtils };
