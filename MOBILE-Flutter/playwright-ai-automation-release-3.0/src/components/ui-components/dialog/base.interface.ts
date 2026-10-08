import { Locator } from '@playwright/test';

export interface IDialogUtils {
  getHost(): Locator;
  getCloseButton(): Locator;
  getPrimaryButton(): Locator;
  getSecondaryButton(): Locator;
  getMenuButton(): Locator;
  isOpen(): Promise<boolean>;
  show(): Promise<this>;
  hide(): Promise<this>;
  clickPrimary(): Promise<this>;
  clickSecondary(): Promise<this>;
  clickClose(): Promise<this>;
}
