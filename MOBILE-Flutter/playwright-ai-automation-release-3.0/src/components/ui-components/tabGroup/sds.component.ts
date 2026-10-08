import { Page, Locator } from '@playwright/test';
import type { ComponentPage } from '../../../fixtures/ui-components.fixture.js';
import { ITabGroupUtils } from './base.interface.js';

interface Tab {
  id: string | number;
  label: string;
  disabled?: boolean;
  children?: Tab[];
}

export class SdsTabGroupUtils implements ITabGroupUtils {
  constructor(private page: Page, private testId: string) {}

  private get extendedPage(): ComponentPage {
    return this.page as ComponentPage;
  }

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getTabItem(tabIdPath: string): Locator {
    return this.page.getByTestId(`${this.testId}-tab-item-${tabIdPath}`);
  }

  getMenuItem(tabId: string): Locator {
    return this.page.getByTestId(`${this.testId}-menu-item-${tabId}`);
  }

  getOverflowMenu(): Locator {
    return this.page.getByTestId(`${this.testId}-overflow-menu`);
  }

  async getTabs(): Promise<Tab[]> {
    return await this.getHost().evaluate((el: any) => el.tabs ?? []);
  }

  async getSelectedTabId(): Promise<string | null> {
    const selectedId = await this.getHost().evaluate((el: any) => el.selectedTabId);
    return selectedId ? String(selectedId) : null;
  }

  async getSelectedTabLabel(): Promise<string> {
    const tabs = await this.getTabs();
    const selectedId = await this.getSelectedTabId();

    if (!selectedId) return '';

    for (const tab of tabs) {
      if (String(tab.id) === selectedId) {
        return tab.label;
      }
      if (tab.children) {
        const child = tab.children.find(c => String(c.id) === selectedId);
        if (child) return child.label;
      }
    }

    return '';
  }

  private async findTabIdByLabel(label: string): Promise<string | null> {
    const tabs = await this.getTabs();
    const tab = tabs.find(t => t.label === label);
    return tab ? String(tab.id) : null;
  }

  private async findChildTabIdByLabel(
    parentLabel: string,
    childLabel: string
  ): Promise<[string, string] | null> {
    const tabs = await this.getTabs();
    const parent = tabs.find(t => t.label === parentLabel);
    if (!parent?.children) return null;
    const child = parent.children.find(c => c.label === childLabel);
    if (!child) return null;
    return [String(parent.id), String(child.id)];
  }

  async selectTab(tabIdOrPath: string | string[]): Promise<this> {
    if (Array.isArray(tabIdOrPath)) {
      const [parentId, childId] = tabIdOrPath;
      const parentTabItem = this.getTabItem(parentId);

      await parentTabItem.click();
      await this.page.waitForTimeout(100);

      const childTabItem = this.getTabItem(`${parentId}/${childId}`);
      await childTabItem.waitFor({ state: 'visible' });
      await childTabItem.click();
    } else {
      const tabItem = this.getTabItem(tabIdOrPath);

      let isVisible = await tabItem.isVisible();

      if (!isVisible) {
        await this.page.waitForTimeout(200);
        isVisible = await tabItem.isVisible();
      }

      if (isVisible) {
        await tabItem.click();
      } else {
        const overflowMenu = this.getOverflowMenu();
        const menuExists = await overflowMenu.isVisible().catch(() => false);

        if (menuExists) {
          const tabs = await this.getTabs();
          const tab = tabs.find(t => String(t.id) === tabIdOrPath);

          if (tab) {
            await this.extendedPage.uiComponents.menu(`${this.testId}-overflow-menu`).open();
            await this.extendedPage.uiComponents.menu(`${this.testId}-overflow-menu`).selectItem([tab.label]);
          }
        }
      }
    }

    return this;
  }

  async selectTabByLabel(labelOrPath: string | string[]): Promise<this> {
    if (Array.isArray(labelOrPath)) {
      const [parentLabel, childLabel] = labelOrPath;
      const ids = await this.findChildTabIdByLabel(parentLabel, childLabel);

      if (ids) {
        await this.selectTab(ids);
      }
    } else {
      const tabId = await this.findTabIdByLabel(labelOrPath);

      if (tabId) {
        await this.selectTab(tabId);
      }
    }

    return this;
  }

  async isTabSelected(tabIdPath: string): Promise<boolean> {
    const selectedId = await this.getSelectedTabId();
    if (!selectedId) return false;

    const pathParts = tabIdPath.split('/');
    const targetId = pathParts[pathParts.length - 1];

    return selectedId === targetId;
  }

  async isTabDisabled(tabIdPath: string): Promise<boolean> {
    const tabs = await this.getTabs();
    const pathParts = tabIdPath.split('/');

    if (pathParts.length === 1) {
      const tab = tabs.find(t => String(t.id) === pathParts[0]);
      return tab?.disabled ?? false;
    } else {
      const [parentId, childId] = pathParts;
      const parent = tabs.find(t => String(t.id) === parentId);
      if (!parent?.children) return false;
      const child = parent.children.find(c => String(c.id) === childId);
      return child?.disabled ?? false;
    }
  }
}
