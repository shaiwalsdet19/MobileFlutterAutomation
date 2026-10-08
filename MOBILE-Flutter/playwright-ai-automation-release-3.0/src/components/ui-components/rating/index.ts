import { Page, Locator } from '@playwright/test';
import { IRatingUtils } from './base.interface.js';
import { SdsRatingUtils } from './sds.component.js';

export class RatingUtils implements IRatingUtils {
  private impl: SdsRatingUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsRatingUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  getOption(value: string | number): Locator {
    return this.impl.getOption(value);
  }

  getNaOption(): Promise<Locator> {
    return this.impl.getNaOption();
  }

  async selectByValue(value: string | number): Promise<this> {
    await this.impl.selectByValue(value);
    return this;
  }

  async selectByIndex(index: number): Promise<this> {
    await this.impl.selectByIndex(index);
    return this;
  }

  async selectNa(): Promise<this> {
    await this.impl.selectNa();
    return this;
  }

  async getValue(): Promise<string | number | undefined> {
    return this.impl.getValue();
  }

  async isOverflowMode(): Promise<boolean> {
    return this.impl.isOverflowMode();
  }

  async isDisabled(): Promise<boolean> {
    return this.impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    return this.impl.isReadOnly();
  }
}

export { SdsRatingUtils } from './sds.component.js';
export type { IRatingUtils } from './base.interface.js';
