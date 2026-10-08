import { Page, Locator } from '@playwright/test';
import { IRadioGroupUtils } from './base.interface.js';
import { SdsRadioGroupUtils } from './sds.component.js';
import { UiRadioGroupUtils } from './ui.component.js';

export class RadioGroupUtils implements IRadioGroupUtils {
  private impl: IRadioGroupUtils;

  constructor(private page: Page, private testId: string) {
    const host = page.getByTestId(testId);
    this.impl = new SdsRadioGroupUtils(page, testId);
    host.evaluate((el: Element) => el.tagName.toLowerCase()).then(tag => {
      if (tag === 'dbx-radio-group') {
        this.impl = new UiRadioGroupUtils(page, testId);
      }
    }).catch(() => {});
  }

  private async getImpl(): Promise<IRadioGroupUtils> {
    const host = this.page.getByTestId(this.testId);
    const tag = await host.evaluate((el: Element) => el.tagName.toLowerCase());
    if (tag === 'dbx-radio-group') {
      return new UiRadioGroupUtils(this.page, this.testId);
    }
    return new SdsRadioGroupUtils(this.page, this.testId);
  }

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getOption(label: string): Locator {
    return this.getOptionInput(label);
  }

  getOptionInput(label: string): Locator {
    return this.page.getByTestId(`${this.testId}-option-${label}-input`);
  }

  async selectOption(label: string): Promise<this> {
    const impl = await this.getImpl();
    await impl.selectOption(label);
    return this;
  }

  async getValue(): Promise<string | null> {
    const impl = await this.getImpl();
    return impl.getValue();
  }

  async getSelectedValue(): Promise<string | null> {
    const impl = await this.getImpl();
    return impl.getSelectedValue();
  }

  async isOptionSelected(label: string): Promise<boolean> {
    const impl = await this.getImpl();
    return impl.isOptionSelected(label);
  }

  async search(query: string): Promise<this> {
    const impl = await this.getImpl();
    await impl.search(query);
    return this;
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

export { SdsRadioGroupUtils } from './sds.component.js';
export { UiRadioGroupUtils } from './ui.component.js';
export type { IRadioGroupUtils } from './base.interface.js';
