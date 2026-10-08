import { Locator } from '@playwright/test';
import { DialogUtils } from '../dialog/index.js';

export interface IConfirmationDialogUtils {
  getHost(): Locator;
  getDialog(): DialogUtils;
  isOpen(): Promise<boolean>;
  show(): Promise<this>;
  hide(): Promise<this>;
  clickProceed(): Promise<this>;
  clickCancel(): Promise<this>;
  clickClose(): Promise<this>;
}
