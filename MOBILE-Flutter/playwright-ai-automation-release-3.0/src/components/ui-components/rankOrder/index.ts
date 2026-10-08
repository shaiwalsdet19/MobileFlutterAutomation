import { Page, Locator } from '@playwright/test';
import { IRankOrderUtils, RankOrderValue } from './base.interface.js';
import { SdsRankOrderUtils } from './sds.component.js';

export class RankOrderUtils implements IRankOrderUtils {
  private impl: SdsRankOrderUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsRankOrderUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  async setValue(value: RankOrderValue): Promise<this> {
    await this.impl.setValue(value);
    return this;
  }

  async getValue(): Promise<RankOrderValue | undefined> {
    return this.impl.getValue();
  }

  async isDisabled(): Promise<boolean> {
    return this.impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    return this.impl.isReadOnly();
  }
}

export { SdsRankOrderUtils } from './sds.component.js';
export type { IRankOrderUtils, RankOrderValue } from './base.interface.js';
