import { Page, Locator } from '@playwright/test';
import { IFiltersUtils } from './base.interface.js';
import { SdsFiltersUtils } from './sds.component.js';
import { AccordionUtils } from '../accordion/index.js';
import { TextInputUtils } from '../textInput/index.js';
import { ConfirmationDialogUtils } from '../confirmationDialog/index.js';

export class FiltersUtils implements IFiltersUtils {
  private impl: SdsFiltersUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsFiltersUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  getTrigger(): Locator {
    return this.impl.getTrigger();
  }

  getModal(): Locator {
    return this.impl.getModal();
  }

  getSearchInput(): TextInputUtils {
    return this.impl.getSearchInput();
  }

  getGroupAccordion(groupId: string): AccordionUtils {
    return this.impl.getGroupAccordion(groupId);
  }

  getFilter(filterId: string): Locator {
    return this.impl.getFilter(filterId);
  }

  async isPanelOpen(): Promise<boolean> {
    return this.impl.isPanelOpen();
  }

  async openPanel(): Promise<this> {
    await this.impl.openPanel();
    return this;
  }

  async closePanel(): Promise<this> {
    await this.impl.closePanel();
    return this;
  }

  getConfirmationDialog(): ConfirmationDialogUtils {
    return this.impl.getConfirmationDialog();
  }

  async closePanelWithoutConfirmation(): Promise<this> {
    await this.impl.closePanelWithoutConfirmation();
    return this;
  }

  async getValue(): Promise<Record<string, any>> {
    return this.impl.getValue();
  }

  async getFilterValue(filterId: string): Promise<any> {
    return this.impl.getFilterValue(filterId);
  }

  async getAppliedFiltersCount(): Promise<number> {
    return this.impl.getAppliedFiltersCount();
  }

  async clickApply(): Promise<this> {
    await this.impl.clickApply();
    return this;
  }

  async clickReset(): Promise<this> {
    await this.impl.clickReset();
    return this;
  }

  async clickCancel(): Promise<this> {
    await this.impl.clickCancel();
    return this;
  }

  async search(query: string): Promise<this> {
    await this.impl.search(query);
    return this;
  }

  async clearSearch(): Promise<this> {
    await this.impl.clearSearch();
    return this;
  }

  async isDisabled(): Promise<boolean> {
    return this.impl.isDisabled();
  }
}

export { SdsFiltersUtils };
