import { Page, Locator } from '@playwright/test';
import { IDialogUtils } from './base.interface.js';
import { SdsDialogUtils } from './sds.component.js';

export class DialogUtils implements IDialogUtils {
  private impl: SdsDialogUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsDialogUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  getCloseButton(): Locator {
    return this.impl.getCloseButton();
  }

  getPrimaryButton(): Locator {
    return this.impl.getPrimaryButton();
  }

  getSecondaryButton(): Locator {
    return this.impl.getSecondaryButton();
  }

  getMenuButton(): Locator {
    return this.impl.getMenuButton();
  }

  async isOpen(): Promise<boolean> {
    return this.impl.isOpen();
  }

  async show(): Promise<this> {
    await this.impl.show();
    return this;
  }

  async hide(): Promise<this> {
    await this.impl.hide();
    return this;
  }

  async clickPrimary(): Promise<this> {
    await this.impl.clickPrimary();
    return this;
  }

  async clickSecondary(): Promise<this> {
    await this.impl.clickSecondary();
    return this;
  }

  async clickClose(): Promise<this> {
    await this.impl.clickClose();
    return this;
  }
}

export { SdsDialogUtils };
