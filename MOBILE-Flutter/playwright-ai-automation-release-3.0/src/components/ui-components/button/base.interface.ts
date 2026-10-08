import { Locator } from '@playwright/test';

export interface IButtonUtils {
  getHost(): Locator;
  getButton(): Locator;
  getSplitButton(): Locator;
  getMenu(): Locator;
  getMenuItem(labelPath: string): Locator;
  click(): Promise<this>;
  clickSplit(): Promise<this>;
  selectMenuItem(labels: string[]): Promise<this>;
  isDisabled(): Promise<boolean>;
  isSplitDisabled(): Promise<boolean>;
  isLoading(): Promise<boolean>;
  isMenuOpen(): Promise<boolean>;
}
