import { Page, Locator } from '@playwright/test';
import { ITabGroupUtils } from './base.interface.js';
import { SdsTabGroupUtils } from './sds.component.js';

export class TabGroupUtils implements ITabGroupUtils {
  private impl: SdsTabGroupUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsTabGroupUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  getTabItem(tabIdPath: string): Locator {
    return this.impl.getTabItem(tabIdPath);
  }

  getMenuItem(tabId: string): Locator {
    return this.impl.getMenuItem(tabId);
  }

  getOverflowMenu(): Locator {
    return this.impl.getOverflowMenu();
  }

  async getTabs(): Promise<any[]> {
    return this.impl.getTabs();
  }

  async getSelectedTabId(): Promise<string | null> {
    return this.impl.getSelectedTabId();
  }

  async getSelectedTabLabel(): Promise<string> {
    return this.impl.getSelectedTabLabel();
  }

  async selectTab(tabIdOrPath: string | string[]): Promise<this> {
    await this.impl.selectTab(tabIdOrPath);
    return this;
  }

  async selectTabByLabel(labelOrPath: string | string[]): Promise<this> {
    await this.impl.selectTabByLabel(labelOrPath);
    return this;
  }

  async isTabSelected(tabIdPath: string): Promise<boolean> {
    return this.impl.isTabSelected(tabIdPath);
  }

  async isTabDisabled(tabIdPath: string): Promise<boolean> {
    return this.impl.isTabDisabled(tabIdPath);
  }
}

export { SdsTabGroupUtils };
