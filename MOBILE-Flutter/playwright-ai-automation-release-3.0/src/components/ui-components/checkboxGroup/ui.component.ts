import { Page, Locator } from '@playwright/test';
import { ICheckboxGroupUtils } from './base.interface.js';

export class UiCheckboxGroupUtils implements ICheckboxGroupUtils {
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
    const input = this.getOptionInput(label);
    if (!(await input.isChecked())) {
      await input.click();
    }
    return this;
  }

  async uncheckOption(label: string): Promise<this> {
    const input = this.getOptionInput(label);
    if (await input.isChecked()) {
      await input.click();
    }
    return this;
  }

  async selectOptions(labels: string[]): Promise<this> {
    for (const label of labels) {
      await this.checkOption(label);
    }
    return this;
  }

  async selectAll(): Promise<this> {
    await this.getSelectAllInput().click();
    return this;
  }

  async search(query: string): Promise<this> {
    const searchInput = this.page.getByTestId(`${this.testId}-search`);
    await searchInput.fill(query);
    return this;
  }

  async getValue(): Promise<any[]> {
    return await this.getHost().evaluate((el: any) => el.value ?? []);
  }

  async getSelectedValues(): Promise<any[]> {
    return await this.getValue();
  }

  async isOptionChecked(label: string): Promise<boolean> {
    return await this.getOptionInput(label).isChecked();
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }

  async isOptionDisabled(label: string): Promise<boolean> {
    return await this.getOptionInput(label).isDisabled();
  }

  async getSelectedOptions(): Promise<any[]> {
    return await this.getHost().evaluate((el: any) => {
      if (typeof el.getSelectedOptions === 'function') {
        return el.getSelectedOptions();
      }
      // Fallback for legacy components without getSelectedOptions
      const values: any[] = el.value ?? [];
      if (!values.length) return [];
      const options: any[] = el.options ?? [];
      const valueKey: string = el.valueKeyInOptions || 'value';
      return options.filter((opt: any) => values.includes(opt?.[valueKey]));
    });
  }

  async areOptionsSelected(labels: string[] | string): Promise<boolean> {
    const labelsToCheck = Array.isArray(labels) ? labels : [labels];
    const labelKey = await this.getHost().evaluate((el: any) => el.labelKeyInOptions || 'label');
    const selectedOptions = await this.getSelectedOptions();
    const selectedLabels = selectedOptions.map((opt: any) => opt?.[labelKey]);
    return labelsToCheck.every(label => selectedLabels.includes(label));
  }
}
