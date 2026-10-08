import { Page, Locator } from '@playwright/test';
import { IButtonUtils } from './base.interface.js';

export class SdsButtonUtils implements IButtonUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getButton(): Locator {
    return this.page.getByTestId(`${this.testId}-button`);
  }

  getSplitButton(): Locator {
    return this.page.getByTestId(`${this.testId}-split-button`);
  }

  getMenu(): Locator {
    return this.page.getByTestId(`${this.testId}-menu`);
  }

  getMenuItem(labelPath: string): Locator {
    return this.page.getByTestId(`${this.testId}-menu-item-${labelPath}`);
  }

  async click(): Promise<this> {
    await this.getButton().click();
    return this;
  }

  async clickSplit(): Promise<this> {
    await this.getSplitButton().click();
    return this;
  }

  async selectMenuItem(labels: string[]): Promise<this> {
    if (labels.length === 0) {
      return this;
    }

    let currentPath = '';

    for (let i = 0; i < labels.length; i++) {
      const label = labels[i];

      currentPath = currentPath ? `${currentPath}/${label}` : label;
      const menuItem = this.getMenuItem(currentPath);

      await menuItem.waitFor({ state: 'visible' });
      await menuItem.click();
      await this.page.waitForTimeout(100);
    }

    return this;
  }

  async isDisabled(): Promise<boolean> {
    return await this.getButton().isDisabled();
  }

  async isSplitDisabled(): Promise<boolean> {
    return await this.getSplitButton().isDisabled();
  }

  async isLoading(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.isLoading === true);
  }

  async isMenuOpen(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el._isMenuOpen === true);
  }
}
