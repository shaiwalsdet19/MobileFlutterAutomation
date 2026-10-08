import { Page, Locator } from '@playwright/test';
import { CountryDropdownOptionMeta, CountryItemWithValue, ICountryDropdownUtils } from './base.interface.js';
import { SdsCountryDropdownUtils } from './sds.component.js';

export class CountryDropdownUtils implements ICountryDropdownUtils {
  private impl: SdsCountryDropdownUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsCountryDropdownUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  getTrigger(): Locator {
    return this.impl.getTrigger();
  }

  getInput(): Locator {
    return this.impl.getInput();
  }

  getReadOnly(): Locator {
    return this.impl.getReadOnly();
  }

  async getSupportedOptions(): Promise<CountryDropdownOptionMeta[]> {
    return this.impl.getSupportedOptions();
  }

  async resolveOptionLabelByPhoneCode(phoneCode: string): Promise<string> {
    return this.impl.resolveOptionLabelByPhoneCode(phoneCode);
  }

  async resolveOptionLabelByCurrencyCode(currencyCode: string): Promise<string> {
    return this.impl.resolveOptionLabelByCurrencyCode(currencyCode);
  }

  async resolveOptionLabelByCountryCode(countryCode: string): Promise<string> {
    return this.impl.resolveOptionLabelByCountryCode(countryCode);
  }

  async selectCountryByPhoneCode(phoneCode: string, numericValue?: string | number): Promise<this> {
    await this.impl.selectCountryByPhoneCode(phoneCode, numericValue);
    return this;
  }

  async selectCountryByCurrencyCode(currencyCode: string): Promise<this> {
    await this.impl.selectCountryByCurrencyCode(currencyCode);
    return this;
  }

  async selectCountryByCountryCode(countryCode: string, numericValue?: string | number): Promise<this> {
    await this.impl.selectCountryByCountryCode(countryCode, numericValue);
    return this;
  }

  async fillInput(value: string | number): Promise<this> {
    await this.impl.fillInput(value);
    return this;
  }

  async getValue(): Promise<CountryItemWithValue | undefined> {
    return this.impl.getValue();
  }

  async isPhone(): Promise<boolean> {
    return this.impl.isPhone();
  }

  async isDisabled(): Promise<boolean> {
    return this.impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    return this.impl.isReadOnly();
  }
}

export { SdsCountryDropdownUtils } from './sds.component.js';
export type { ICountryDropdownUtils, CountryDropdownOptionMeta, CountryItemWithValue } from './base.interface.js';
