import { Locator } from '@playwright/test';

export interface ITabGroupUtils {
  getHost(): Locator;
  getTabItem(tabIdPath: string): Locator;
  getMenuItem(tabId: string): Locator;
  getOverflowMenu(): Locator;
  getTabs(): Promise<any[]>;
  getSelectedTabId(): Promise<string | null>;
  getSelectedTabLabel(): Promise<string>;
  selectTab(tabIdOrPath: string | string[]): Promise<this>;
  selectTabByLabel(labelOrPath: string | string[]): Promise<this>;
  isTabSelected(tabIdPath: string): Promise<boolean>;
  isTabDisabled(tabIdPath: string): Promise<boolean>;
}
