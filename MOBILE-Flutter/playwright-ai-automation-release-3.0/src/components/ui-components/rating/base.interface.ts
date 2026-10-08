import { Locator } from '@playwright/test';

export interface IRatingUtils {
  getHost(): Locator;
  getOption(value: string | number): Locator;
  getNaOption(): Promise<Locator>;

  selectByValue(value: string | number): Promise<IRatingUtils>;
  selectByIndex(index: number): Promise<IRatingUtils>;
  selectNa(): Promise<IRatingUtils>;

  getValue(): Promise<string | number | undefined>;
  isOverflowMode(): Promise<boolean>;
  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
