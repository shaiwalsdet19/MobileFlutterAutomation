import { Locator } from '@playwright/test';

export interface IConsentUtils {
  getHost(): Locator;
  getCheckbox(): Locator;
  getCheckboxInput(): Locator;
  getValue(): Promise<boolean>;
  isAccepted(): Promise<boolean>;
  accept(): Promise<this>;
  decline(): Promise<this>;
  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
