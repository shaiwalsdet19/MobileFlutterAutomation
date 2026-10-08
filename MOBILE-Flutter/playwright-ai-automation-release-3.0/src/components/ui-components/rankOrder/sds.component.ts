import { Page, Locator } from '@playwright/test';
import { IRankOrderUtils, RankOrderValue } from './base.interface.js';

export class SdsRankOrderUtils implements IRankOrderUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  async setValue(value: RankOrderValue): Promise<this> {
    await this.getHost().evaluate(async (el: any, order: RankOrderValue) => {
      if (typeof el.setValue !== 'function') {
        throw new Error('setValue() not available on rank order host');
      }
      await el.setValue(order.map(item => String(item)));
      if (typeof el.forceEmitEvents === 'function') {
        await el.forceEmitEvents();
      }
    }, value);
    return this;
  }

  async getValue(): Promise<RankOrderValue | undefined> {
    return await this.getHost().evaluate(async (el: any) => {
      if (typeof el.getValue === 'function') {
        const value = await el.getValue();
        if (Array.isArray(value)) {
          return value;
        }
      }
      if (Array.isArray(el.value)) {
        return el.value;
      }
      const valueKey = el.valueKeyInOptions ?? 'value';
      return (el.options ?? []).map((option: any) => option?.[valueKey]);
    });
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }
}
