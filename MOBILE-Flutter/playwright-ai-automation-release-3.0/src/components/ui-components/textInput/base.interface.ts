import { Locator } from '@playwright/test';

export interface ITextInputUtils {
  getHost(): Locator;
  getInput(): Locator;

  fill(value: string): Promise<ITextInputUtils>;
  getValue(): Promise<string>;
  clear(): Promise<ITextInputUtils>;

  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;

  getErrorMessage(): Promise<string | null>;
}
