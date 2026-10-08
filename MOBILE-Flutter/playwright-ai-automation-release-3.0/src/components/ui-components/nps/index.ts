import { Page, Locator } from '@playwright/test';
import { INpsUtils } from './base.interface.js';
import { SdsNpsUtils } from './sds.component.js';

export class NpsUtils implements INpsUtils {
  private impl: SdsNpsUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsNpsUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  getOption(score: number): Locator {
    return this.impl.getOption(score);
  }

  async selectByValue(score: number): Promise<this> {
    await this.impl.selectByValue(score);
    return this;
  }

  async getValue(): Promise<number | undefined> {
    return this.impl.getValue();
  }

  async isDisabled(): Promise<boolean> {
    return this.impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    return this.impl.isReadOnly();
  }
}

export { SdsNpsUtils } from './sds.component.js';
export type { INpsUtils } from './base.interface.js';
