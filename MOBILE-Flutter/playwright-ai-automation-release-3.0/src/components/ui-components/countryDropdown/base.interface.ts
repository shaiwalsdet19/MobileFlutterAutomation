import { Locator } from '@playwright/test';

export type CountryDropdownOptionMeta = {
  label: string;
  countryCode: string;
  phoneCode?: string;
  currencyCode?: string;
  countryName?: string;
  isPhone: boolean;
};

export type CountryItemWithValue = {
  value?: string;
  countryCode?: string;
  phoneCode?: string;
  currencyCode?: string;
  formattedValue?: string;
  locale?: string;
};

export interface ICountryDropdownUtils {
  getHost(): Locator;
  getTrigger(): Locator;
  getInput(): Locator;
  getReadOnly(): Locator;

  getSupportedOptions(): Promise<CountryDropdownOptionMeta[]>;
  resolveOptionLabelByPhoneCode(phoneCode: string): Promise<string>;
  resolveOptionLabelByCurrencyCode(currencyCode: string): Promise<string>;
  resolveOptionLabelByCountryCode(countryCode: string): Promise<string>;

  selectCountryByPhoneCode(phoneCode: string, numericValue?: string | number): Promise<ICountryDropdownUtils>;
  selectCountryByCurrencyCode(currencyCode: string): Promise<ICountryDropdownUtils>;
  selectCountryByCountryCode(countryCode: string, numericValue?: string | number): Promise<ICountryDropdownUtils>;
  fillInput(value: string | number): Promise<ICountryDropdownUtils>;

  getValue(): Promise<CountryItemWithValue | undefined>;
  isPhone(): Promise<boolean>;
  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
