import { Locator } from '@playwright/test';

export interface IDropdownUtils {
  getHost(): Locator;
  getHead(): Locator;
  getSearchInput(): Locator;
  getOption(label: string): Locator;
  getSelectAll(): Locator;
  getPanel(): Locator;

  open(): Promise<IDropdownUtils>;
  close(): Promise<IDropdownUtils>;
  selectOption(label: string): Promise<IDropdownUtils>;
  selectOptions(labels: string[]): Promise<IDropdownUtils>;
  deselectOption(label: string): Promise<IDropdownUtils>;
  selectAll(): Promise<IDropdownUtils>;
  search(query: string): Promise<IDropdownUtils>;
  clearSearch(): Promise<IDropdownUtils>;
  scrollToOption(label: string, maxScrollAttempts?: number): Promise<IDropdownUtils>;

  getValue(): Promise<any>;
  getSelectedOptions(): Promise<any[]>;
  areOptionsSelected(labels: string[] | string): Promise<boolean>;
  isOpen(): Promise<boolean>;
  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
