import { Locator } from '@playwright/test';

export interface INpsUtils {
  getHost(): Locator;
  getOption(score: number): Locator;
  selectByValue(score: number): Promise<INpsUtils>;
  getValue(): Promise<number | undefined>;
  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
