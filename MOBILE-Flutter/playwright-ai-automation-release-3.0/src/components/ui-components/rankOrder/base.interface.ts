import { Locator } from '@playwright/test';

export type RankOrderValue = Array<string | number>;

export interface IRankOrderUtils {
  getHost(): Locator;
  setValue(value: RankOrderValue): Promise<IRankOrderUtils>;
  getValue(): Promise<RankOrderValue | undefined>;
  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
