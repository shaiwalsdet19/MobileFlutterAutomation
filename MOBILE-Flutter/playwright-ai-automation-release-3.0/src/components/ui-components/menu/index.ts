import { Page, Locator } from '@playwright/test';
import { IMenuUtils } from './base.interface.js';
import { SdsMenuUtils } from './sds.component.js';

export class MenuUtils implements IMenuUtils {
  private impl: SdsMenuUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsMenuUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  getTrigger(): Locator {
    return this.impl.getTrigger();
  }

  getMenuItem(labelPath: string): Locator {
    return this.impl.getMenuItem(labelPath);
  }

  async open(): Promise<this> {
    await this.impl.open();
    return this;
  }

  async selectItem(labels: string[]): Promise<this> {
    await this.impl.selectItem(labels);
    return this;
  }

  async isItemDisabled(labelPath: string): Promise<boolean> {
    return this.impl.isItemDisabled(labelPath);
  }

  async isItemVisible(labelPath: string): Promise<boolean> {
    return this.impl.isItemVisible(labelPath);
  }
}

export { SdsMenuUtils };
