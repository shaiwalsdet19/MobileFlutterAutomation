import { Locator } from '@playwright/test';
import { AccordionUtils } from '../accordion/index.js';
import { TextInputUtils } from '../textInput/index.js';
import { ConfirmationDialogUtils } from '../confirmationDialog/index.js';

export interface IFiltersUtils {
  getHost(): Locator;
  getTrigger(): Locator;
  getModal(): Locator;
  getSearchInput(): TextInputUtils;
  getGroupAccordion(groupId: string): AccordionUtils;
  getFilter(filterId: string): Locator;
  isPanelOpen(): Promise<boolean>;
  openPanel(): Promise<this>;
  closePanel(): Promise<this>;
  getConfirmationDialog(): ConfirmationDialogUtils;
  closePanelWithoutConfirmation(): Promise<this>;
  getValue(): Promise<Record<string, any>>;
  getFilterValue(filterId: string): Promise<any>;
  getAppliedFiltersCount(): Promise<number>;
  clickApply(): Promise<this>;
  clickReset(): Promise<this>;
  clickCancel(): Promise<this>;
  search(query: string): Promise<this>;
  clearSearch(): Promise<this>;
  isDisabled(): Promise<boolean>;
}
