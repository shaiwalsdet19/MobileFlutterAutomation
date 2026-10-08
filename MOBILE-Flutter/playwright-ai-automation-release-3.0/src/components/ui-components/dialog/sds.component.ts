import { Page, Locator } from '@playwright/test';
import { IDialogUtils } from './base.interface.js';

export class SdsDialogUtils implements IDialogUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getCloseButton(): Locator {
    return this.page.getByTestId(`${this.testId}-close-btn-button`);
  }

  getPrimaryButton(): Locator {
    return this.page.getByTestId(`${this.testId}-primary-btn-button`);
  }

  getSecondaryButton(): Locator {
    return this.page.getByTestId(`${this.testId}-secondary-btn-button`);
  }

  getMenuButton(): Locator {
    return this.page.getByTestId(`${this.testId}-menu-btn-button`);
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

  async clickPrimary(): Promise<this> {
    await this.getPrimaryButton().click();
    return this;
  }

  async clickSecondary(): Promise<this> {
    await this.getSecondaryButton().click();
    return this;
  }

  async clickClose(): Promise<this> {
    await this.getCloseButton().click();
    return this;
  }
}
