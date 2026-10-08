import { Page, Locator } from '@playwright/test';
import { IButtonUtils } from './base.interface.js';
import { SdsButtonUtils } from './sds.component.js';

export class ButtonUtils implements IButtonUtils {
  private impl: SdsButtonUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsButtonUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  getButton(): Locator {
    return this.impl.getButton();
  }

  getSplitButton(): Locator {
    return this.impl.getSplitButton();
  }

  getMenu(): Locator {
    return this.impl.getMenu();
  }

  getMenuItem(labelPath: string): Locator {
    return this.impl.getMenuItem(labelPath);
  }

  async click(): Promise<this> {
    await this.impl.click();
    return this;
  }

  async clickSplit(): Promise<this> {
    await this.impl.clickSplit();
    return this;
  }

  async selectMenuItem(labels: string[]): Promise<this> {
    await this.impl.selectMenuItem(labels);
    return this;
  }

  async isDisabled(): Promise<boolean> {
    return this.impl.isDisabled();
  }

  async isSplitDisabled(): Promise<boolean> {
    return this.impl.isSplitDisabled();
  }

  async isLoading(): Promise<boolean> {
    return this.impl.isLoading();
  }

  async isMenuOpen(): Promise<boolean> {
    return this.impl.isMenuOpen();
  }
}

export { SdsButtonUtils };
