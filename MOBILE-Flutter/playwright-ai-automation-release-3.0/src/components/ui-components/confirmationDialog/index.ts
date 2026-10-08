import { Page, Locator } from '@playwright/test';
import { IConfirmationDialogUtils } from './base.interface.js';
import { SdsConfirmationDialogUtils } from './sds.component.js';
import { DialogUtils } from '../dialog/index.js';

export class ConfirmationDialogUtils implements IConfirmationDialogUtils {
  private impl: SdsConfirmationDialogUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsConfirmationDialogUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  getDialog(): DialogUtils {
    return this.impl.getDialog();
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

  async clickProceed(): Promise<this> {
    await this.impl.clickProceed();
    return this;
  }

  async clickCancel(): Promise<this> {
    await this.impl.clickCancel();
    return this;
  }

  async clickClose(): Promise<this> {
    await this.impl.clickClose();
    return this;
  }
}

export { SdsConfirmationDialogUtils };
