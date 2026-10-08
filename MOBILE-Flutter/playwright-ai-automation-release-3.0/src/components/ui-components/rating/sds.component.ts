import { Page, Locator } from '@playwright/test';
import { SdsDropdownUtils } from '../dropdown/sds.component.js';
import { IRatingUtils } from './base.interface.js';

export class SdsRatingUtils implements IRatingUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getOption(value: string | number): Locator {
    return this.page.getByTestId(`${this.testId}-option-${value}`);
  }

  async getNaOption(): Promise<Locator> {
    const naValue = await this.getNaValue();
    return this.page.getByTestId(`${this.testId}-${naValue}`);
  }

  private getDropdownUtils(): SdsDropdownUtils {
    return new SdsDropdownUtils(this.page, `${this.testId}-dropdown`);
  }

  async isOverflowMode(): Promise<boolean> {
    return await this.getHost().evaluate(
      (el: any) => (el.config?.length ?? 0) > (el.overflowLength ?? 7) && el.disableOverflowDropdownBehaviour !== true,
    );
  }

  private async getNaValue(): Promise<string | number> {
    return await this.getHost().evaluate((el: any) => el.naValue ?? 'na');
  }

  private async getConfigValueAtIndex(index: number): Promise<string | number | undefined> {
    return await this.getHost().evaluate((el: any, idx: number) => {
      const config = el.config ?? [];
      const valueKey = el.valueKeyInOptions ?? 'rating';
      return config[idx]?.[valueKey];
    }, index);
  }

  private async resolveDropdownOptionLabel(value: string | number): Promise<string> {
    const label = await this.getHost().evaluate((el: any, targetValue: string | number) => {
      const config = el.config ?? [];
      const valueKey = el.valueKeyInOptions ?? 'rating';
      const labelKey = el.labelKeyInOptions ?? 'description';
      const naValue = el.naValue ?? 'na';
      const appendPrefix = el.appendRatingPrefixForOverflowingRatings !== false;
      const idx = config.findIndex((option: any) => option?.[valueKey] == targetValue);

      if (idx < 0) {
        return null;
      }

      const option = config[idx];
      const optionValue = option[valueKey];
      const optionLabel = option[labelKey];
      const labelPrefix = optionValue == naValue ? 'N/A' : `${idx + 1}`;

      if (!optionLabel) {
        return labelPrefix;
      }

      return appendPrefix ? `${labelPrefix} - ${optionLabel}` : optionLabel;
    }, value);

    if (!label) {
      throw new Error(`No dropdown option label found for value "${value}" on rating "${this.testId}"`);
    }

    return label;
  }

  async selectByValue(value: string | number): Promise<this> {
    if (await this.isOverflowMode()) {
      const label = await this.resolveDropdownOptionLabel(value);
      await this.getDropdownUtils().selectOption(label);
      return this;
    }

    const naValue = await this.getNaValue();
    if (value == naValue) {
      await (await this.getNaOption()).click();
      return this;
    }

    await this.getOption(value).click();
    return this;
  }

  async selectByIndex(index: number): Promise<this> {
    const value = await this.getConfigValueAtIndex(index);

    if (value === undefined) {
      throw new Error(`No config entry at index ${index} on rating "${this.testId}"`);
    }

    return this.selectByValue(value);
  }

  async selectNa(): Promise<this> {
    return this.selectByValue(await this.getNaValue());
  }

  async getValue(): Promise<string | number | undefined> {
    return await this.getHost().evaluate((el: any) => el.value);
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }
}
