import { Page, Locator } from '@playwright/test';
import { IDropdownUtils } from './base.interface.js';
import { SdsDropdownUtils } from './sds.component.js';
import { UiDropdownUtils } from './ui.component.js';

export class DropdownUtils implements IDropdownUtils {
  private async getImpl(): Promise<IDropdownUtils> {
    const tag = await this.page.getByTestId(this.testId).evaluate((el: Element) => el.tagName.toLowerCase());
    if (tag === 'dbx-dropdown') {
      return new UiDropdownUtils(this.page, this.testId);
    }
    return new SdsDropdownUtils(this.page, this.testId);
  }

  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getHead(): Locator {
    return this.page.getByTestId(`${this.testId}-head`);
  }

  getSearchInput(): Locator {
    return this.page.getByTestId(`${this.testId}-search`);
  }

  getOption(label: string): Locator {
    return this.page.getByTestId(`${this.testId}-option-${label}`);
  }

  getSelectAll(): Locator {
    return this.page.getByTestId(`${this.testId}-select-all`);
  }

  getPanel(): Locator {
    return this.page.locator('dbx-dropdown-panel');
  }

  async open(): Promise<this> {
    const impl = await this.getImpl();
    await impl.open();
    return this;
  }

  async close(): Promise<this> {
    const impl = await this.getImpl();
    await impl.close();
    return this;
  }

  async search(query: string): Promise<this> {
    const impl = await this.getImpl();
    await impl.search(query);
    return this;
  }

  async clearSearch(): Promise<this> {
    const impl = await this.getImpl();
    await impl.clearSearch();
    return this;
  }

  async scrollToOption(label: string, maxScrollAttempts = 25): Promise<this> {
    const impl = await this.getImpl();
    await impl.scrollToOption(label, maxScrollAttempts);
    return this;
  }

  async selectOption(label: string): Promise<this> {
    const impl = await this.getImpl();
    await impl.selectOption(label);
    return this;
  }

  async selectOptions(labels: string[]): Promise<this> {
    const impl = await this.getImpl();
    await impl.selectOptions(labels);
    return this;
  }

  async deselectOption(label: string): Promise<this> {
    const impl = await this.getImpl();
    await impl.deselectOption(label);
    return this;
  }

  async selectAll(): Promise<this> {
    const impl = await this.getImpl();
    await impl.selectAll();
    return this;
  }

  async getValue(): Promise<any> {
    const impl = await this.getImpl();
    return impl.getValue();
  }

  async getSelectedOptions(): Promise<any[]> {
    const impl = await this.getImpl();
    return impl.getSelectedOptions();
  }

  async areOptionsSelected(labels: string[] | string): Promise<boolean> {
    const impl = await this.getImpl();
    return impl.areOptionsSelected(labels);
  }

  async isOpen(): Promise<boolean> {
    const impl = await this.getImpl();
    return impl.isOpen();
  }

  async isDisabled(): Promise<boolean> {
    const impl = await this.getImpl();
    return impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    const impl = await this.getImpl();
    return impl.isReadOnly();
  }
}

export { SdsDropdownUtils } from './sds.component.js';
export { SdsInternalDropdownUtils } from './sds-internal.component.js';
export { UiDropdownUtils } from './ui.component.js';
export type { IDropdownUtils } from './base.interface.js';
