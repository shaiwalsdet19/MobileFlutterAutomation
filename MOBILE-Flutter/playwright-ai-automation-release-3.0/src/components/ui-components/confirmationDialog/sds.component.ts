import { Page, Locator } from '@playwright/test';
import { IConfirmationDialogUtils } from './base.interface.js';
import { DialogUtils } from '../dialog/index.js';

export class SdsConfirmationDialogUtils implements IConfirmationDialogUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getDialog(): DialogUtils {
    return new DialogUtils(this.page, `${this.testId}-dialog`);
  }

  async isOpen(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.isOpen === true);
  }

  async show(): Promise<this> {
    const isCurrentlyOpen = await this.isOpen();
    if (!isCurrentlyOpen) {
      await this.getHost().evaluate((el: any) => el.show?.());
    }
    return this;
  }

  async hide(): Promise<this> {
    const isCurrentlyOpen = await this.isOpen();
    if (isCurrentlyOpen) {
      await this.getHost().evaluate((el: any) => el.hide?.());
    }
    return this;
  }

  async clickProceed(): Promise<this> {
    await this.getDialog().clickPrimary();
    return this;
  }

  async clickCancel(): Promise<this> {
    await this.getDialog().clickSecondary();
    return this;
  }

  async clickClose(): Promise<this> {
    await this.getDialog().clickClose();
    return this;
  }
}
