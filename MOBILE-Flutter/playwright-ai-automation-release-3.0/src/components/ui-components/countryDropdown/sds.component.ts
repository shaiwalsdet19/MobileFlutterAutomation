import { Page, Locator } from '@playwright/test';
import { SdsDropdownUtils } from '../dropdown/sds.component.js';
import { CountryDropdownOptionMeta, CountryItemWithValue, ICountryDropdownUtils } from './base.interface.js';

export class SdsCountryDropdownUtils implements ICountryDropdownUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getTrigger(): Locator {
    return this.page.getByTestId(`${this.testId}-trigger`);
  }

  getInput(): Locator {
    return this.page.getByTestId(`${this.testId}-input`);
  }

  getReadOnly(): Locator {
    return this.page.getByTestId(`${this.testId}-read-only`);
  }

  private getDropdownUtils(): SdsDropdownUtils {
    return new SdsDropdownUtils(this.page, `${this.testId}-dropdown`);
  }

  async getSupportedOptions(): Promise<CountryDropdownOptionMeta[]> {
    return await this.getHost().evaluate(async (el: any) => {
      if (typeof el.getSupportedOptions !== 'function') {
        throw new Error('getSupportedOptions() not available on country dropdown host');
      }
      return el.getSupportedOptions();
    });
  }

  private normalizePhoneCode(phoneCode: string): string {
    const trimmed = phoneCode.trim().replace(/\s+/g, ' ');
    if (trimmed.startsWith('+')) {
      return trimmed;
    }
    return `+${trimmed}`;
  }

  private phoneCodesMatch(storedCode: string | undefined, targetCode: string): boolean {
    if (!storedCode) {
      return false;
    }
    const normalizedStored = storedCode.trim().replace(/\s+/g, ' ');
    const normalizedTarget = this.normalizePhoneCode(targetCode);
    return normalizedStored === normalizedTarget;
  }

  private countryCodeMatches(optionCountryCode: string, targetCountryCode: string): boolean {
    if (optionCountryCode === targetCountryCode) {
      return true;
    }
    return optionCountryCode.split('__').includes(targetCountryCode);
  }

  async resolveOptionLabelByPhoneCode(phoneCode: string): Promise<string> {
    if (!(await this.isPhone())) {
      throw new Error(`selectCountryByPhoneCode is only supported for phone type on "${this.testId}"`);
    }

    const options = await this.getSupportedOptions();
    const match = options.find(option => this.phoneCodesMatch(option.phoneCode, phoneCode));

    if (!match) {
      throw new Error(`No supported option found for phone code "${phoneCode}" on country dropdown "${this.testId}"`);
    }

    return match.label;
  }

  async resolveOptionLabelByCurrencyCode(currencyCode: string): Promise<string> {
    if (await this.isPhone()) {
      throw new Error(`selectCountryByCurrencyCode is only supported for currency type on "${this.testId}"`);
    }

    const options = await this.getSupportedOptions();
    const match = options.find(option => option.currencyCode === currencyCode);

    if (!match) {
      throw new Error(`No supported option found for currency code "${currencyCode}" on country dropdown "${this.testId}"`);
    }

    return match.label;
  }

  async resolveOptionLabelByCountryCode(countryCode: string): Promise<string> {
    const options = await this.getSupportedOptions();
    const match = options.find(option => this.countryCodeMatches(option.countryCode, countryCode));

    if (!match) {
      throw new Error(`No supported option found for country code "${countryCode}" on country dropdown "${this.testId}"`);
    }

    return match.label;
  }

  private async openCountryDropdown(): Promise<this> {
    const dropdown = this.getDropdownUtils();
    if (!(await dropdown.isOpen())) {
      await this.getTrigger().click();
      await dropdown.getPanel().waitFor({ state: 'visible' });
    }
    return this;
  }

  private async selectOptionByLabel(label: string): Promise<this> {
    const dropdown = this.getDropdownUtils();
    await this.openCountryDropdown();
    await dropdown.scrollToOption(label);
    await dropdown.getOption(label).click();
    return this;
  }

  async selectCountryByPhoneCode(phoneCode: string, numericValue?: string | number): Promise<this> {
    const label = await this.resolveOptionLabelByPhoneCode(phoneCode);
    await this.selectOptionByLabel(label);

    if (numericValue !== undefined) {
      await this.fillInput(numericValue);
    }

    return this;
  }

  async selectCountryByCurrencyCode(currencyCode: string): Promise<this> {
    const label = await this.resolveOptionLabelByCurrencyCode(currencyCode);
    await this.selectOptionByLabel(label);
    return this;
  }

  async selectCountryByCountryCode(countryCode: string, numericValue?: string | number): Promise<this> {
    const label = await this.resolveOptionLabelByCountryCode(countryCode);
    await this.selectOptionByLabel(label);

    if (numericValue !== undefined) {
      await this.fillInput(numericValue);
    }

    return this;
  }

  async fillInput(value: string | number): Promise<this> {
    await this.getInput().fill(String(value));
    return this;
  }

  async getValue(): Promise<CountryItemWithValue | undefined> {
    return await this.getHost().evaluate((el: any) => el.value);
  }

  async isPhone(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.type !== 'currency');
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }
}
