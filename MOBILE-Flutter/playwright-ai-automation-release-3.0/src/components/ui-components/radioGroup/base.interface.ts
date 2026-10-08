import { Locator } from '@playwright/test';

export interface IRadioGroupUtils {
  getHost(): Locator;
  getOption(label: string): Locator;
  getOptionInput(label: string): Locator;

  selectOption(label: string): Promise<IRadioGroupUtils>;
  getValue(): Promise<string | null>;
  getSelectedValue(): Promise<string | null>;
  isOptionSelected(label: string): Promise<boolean>;
  search(query: string): Promise<IRadioGroupUtils>;

  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
  isOptionDisabled(label: string): Promise<boolean>;

  getSelectedOptions(): Promise<any[]>;
  areOptionsSelected(labels: string[] | string): Promise<boolean>;
}
