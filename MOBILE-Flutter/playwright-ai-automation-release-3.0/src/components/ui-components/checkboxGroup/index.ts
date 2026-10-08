import { Page, Locator } from '@playwright/test';
import { ICheckboxGroupUtils } from './base.interface.js';
import { SdsCheckboxGroupUtils } from './sds.component.js';
import { UiCheckboxGroupUtils } from './ui.component.js';

export class CheckboxGroupUtils implements ICheckboxGroupUtils {
  private async getImpl(): Promise<ICheckboxGroupUtils> {
    const host = this.page.getByTestId(this.testId);
    const tag = await host.evaluate((el: Element) => el.tagName.toLowerCase());
    if (tag === 'dbx-checkbox') {
      return new UiCheckboxGroupUtils(this.page, this.testId);
    }
    return new SdsCheckboxGroupUtils(this.page, this.testId);
  }

  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getOption(label: string): Locator {
    return this.getOptionInput(label);
  }

  getOptionInput(label: string): Locator {
    return this.page.getByTestId(`${this.testId}-option-${label}-input`);
  }

  getSelectAllInput(): Locator {
    return this.page.getByTestId(`${this.testId}-select-all-input`);
  }

  async checkOption(label: string): Promise<this> {
    const impl = await this.getImpl();
    await impl.checkOption(label);
    return this;
  }

  async uncheckOption(label: string): Promise<this> {
    const impl = await this.getImpl();
    await impl.uncheckOption(label);
    return this;
  }

  async selectOptions(labels: string[]): Promise<this> {
    const impl = await this.getImpl();
    await impl.selectOptions(labels);
    return this;
  }

  async selectAll(): Promise<this> {
    const impl = await this.getImpl();
    await impl.selectAll();
    return this;
  }

  async search(query: string): Promise<this> {
    const impl = await this.getImpl();
    await impl.search(query);
    return this;
  }

  async getValue(): Promise<any[]> {
    const impl = await this.getImpl();
    return impl.getValue();
  }

  async getSelectedValues(): Promise<any[]> {
    const impl = await this.getImpl();
    return impl.getSelectedValues();
  }

  async isOptionChecked(label: string): Promise<boolean> {
    const impl = await this.getImpl();
    return impl.isOptionChecked(label);
  }

  async isDisabled(): Promise<boolean> {
    const impl = await this.getImpl();
    return impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    const impl = await this.getImpl();
    return impl.isReadOnly();
  }

  async isOptionDisabled(label: string): Promise<boolean> {
    const impl = await this.getImpl();
    return impl.isOptionDisabled(label);
  }

  async getSelectedOptions(): Promise<any[]> {
    const impl = await this.getImpl();
    return impl.getSelectedOptions();
  }

  async areOptionsSelected(labels: string[] | string): Promise<boolean> {
    const impl = await this.getImpl();
    return impl.areOptionsSelected(labels);
  }
}

export { SdsCheckboxGroupUtils } from './sds.component.js';
export { UiCheckboxGroupUtils } from './ui.component.js';
export type { ICheckboxGroupUtils } from './base.interface.js';
