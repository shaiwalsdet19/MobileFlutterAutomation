import { Page, Locator } from '@playwright/test';
import { IRadioGroupUtils } from './base.interface.js';

export class UiRadioGroupUtils implements IRadioGroupUtils {
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

  async selectOption(label: string): Promise<this> {
    await this.getOptionInput(label).click();
    return this;
  }

  async getValue(): Promise<string | null> {
    return await this.getHost().evaluate((el: any) => el.value ?? null);
  }

  async getSelectedValue(): Promise<string | null> {
    return await this.getValue();
  }

  async isOptionSelected(label: string): Promise<boolean> {
    return await this.getOptionInput(label).isChecked();
  }

  async search(query: string): Promise<this> {
    const searchInput = this.page.getByTestId(`${this.testId}-search`);
    await searchInput.fill(query);
    return this;
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
      const value = el.value;
      if (value === null || value === undefined) return [];
      const options: any[] = el.options ?? [];
      const valueKey: string = el.valueKeyInOptions || 'value';
      const selected = options.find((opt: any) => opt?.[valueKey] === value);
      return selected ? [selected] : [];
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
