import { Locator } from '@playwright/test';

export interface ICheckboxGroupUtils {
  getHost(): Locator;
  getOption(label: string): Locator;
  getOptionInput(label: string): Locator;
  getSelectAllInput(): Locator;

  checkOption(label: string): Promise<ICheckboxGroupUtils>;
  uncheckOption(label: string): Promise<ICheckboxGroupUtils>;
  selectOptions(labels: string[]): Promise<ICheckboxGroupUtils>;
  selectAll(): Promise<ICheckboxGroupUtils>;
  search(query: string): Promise<ICheckboxGroupUtils>;

  getValue(): Promise<any[]>;
  getSelectedValues(): Promise<any[]>;
  isOptionChecked(label: string): Promise<boolean>;

  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
  isOptionDisabled(label: string): Promise<boolean>;

  getSelectedOptions(): Promise<any[]>;
  areOptionsSelected(labels: string[] | string): Promise<boolean>;
}
