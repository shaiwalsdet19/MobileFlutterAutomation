import { Page, Locator } from '@playwright/test';
import { IMenuUtils } from './base.interface.js';

export class SdsMenuUtils implements IMenuUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getTrigger(): Locator {
    return this.page.getByTestId(`${this.testId}-trigger`);
  }

  getMenuItem(labelPath: string): Locator {
    return this.page.getByTestId(`${this.testId}-item-${labelPath}`);
  }

  async open(): Promise<this> {
    await this.getTrigger().click();
    await this.page.waitForTimeout(100);
    return this;
  }

  async selectItem(labels: string[]): Promise<this> {
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

  async isItemDisabled(labelPath: string): Promise<boolean> {
    const menuItem = this.getMenuItem(labelPath);
    const classList = await menuItem.getAttribute('class');
    return classList?.includes('disable') ?? false;
  }

  async isItemVisible(labelPath: string): Promise<boolean> {
    const menuItem = this.getMenuItem(labelPath);
    return await menuItem.isVisible();
  }
}
