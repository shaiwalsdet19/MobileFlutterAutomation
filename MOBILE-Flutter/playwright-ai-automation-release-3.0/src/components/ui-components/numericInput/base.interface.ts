import { Locator } from '@playwright/test';

export interface INumericInputUtils {
  getHost(): Locator;
  getInput(): Locator;

  fill(value: number | string): Promise<INumericInputUtils>;
  getValue(): Promise<number | undefined>;
  clear(): Promise<INumericInputUtils>;

  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;

  blur(): Promise<INumericInputUtils>;
  focus(): Promise<INumericInputUtils>;
}
