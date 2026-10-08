import { Locator } from '@playwright/test';

export interface IMenuUtils {
  getHost(): Locator;
  getTrigger(): Locator;
  getMenuItem(labelPath: string): Locator;
  open(): Promise<this>;
  selectItem(labels: string[]): Promise<this>;
  isItemDisabled(labelPath: string): Promise<boolean>;
  isItemVisible(labelPath: string): Promise<boolean>;
}
