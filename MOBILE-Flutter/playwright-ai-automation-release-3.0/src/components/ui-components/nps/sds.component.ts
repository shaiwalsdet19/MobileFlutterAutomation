import { expect, Page } from '@playwright/test';
import { INpsUtils } from './base.interface.js';

export class SdsNpsUtils implements INpsUtils {
  constructor(private page: Page, private testId: string) {}

  getHost() {
    return this.page.getByTestId(this.testId);
  }

  getOption(score: number) {
    this.assertValidScore(score);
    return this.page.getByTestId(`${this.testId}-option-${score}`);
  }

  async selectByValue(score: number): Promise<this> {
    this.assertValidScore(score);
    await this.getOption(score).click();
    await expect.poll(async () => this.getValue()).toBe(score);
    return this;
  }

  async getValue(): Promise<number | undefined> {
    return await this.getHost().evaluate(async (el: any) => {
      const value = typeof el.getValue === 'function' ? await el.getValue() : el.value;
      return value ?? undefined;
    });
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }

  private assertValidScore(score: number): void {
    if (!Number.isInteger(score) || score < 0 || score > 10) {
      throw new Error(`NPS score must be an integer between 0 and 10, received: ${score}`);
    }
  }
}
