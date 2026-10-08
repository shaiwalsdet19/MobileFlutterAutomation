import { expect, Page } from '@playwright/test';
import type { ComponentPage } from '../../../fixtures/ui-components.fixture.js';
import {
  IPictureChoicesUtils,
  PictureChoiceOption,
  PictureChoiceValue,
} from './base.interface.js';

export class SdsPictureChoicesUtils implements IPictureChoicesUtils {
  constructor(private page: Page, private testId: string) {}

  private get extendedPage(): ComponentPage {
    return this.page as ComponentPage;
  }

  getHost() {
    return this.page.getByTestId(this.testId);
  }

  async selectOptionByLabel(labels: string[]): Promise<this> {
    for (const label of labels) {
      await this.clickOptionByLabel(label);
    }
    return this;
  }

  async selectOptionByValue(values: string[]): Promise<this> {
    const options = await this.getOptions();
    const labels = values.map(value => {
      const option = options.find(item => item.value === value);
      if (!option) {
        throw new Error(`Picture choice option not found for value: ${value}`);
      }
      return option.label;
    });

    await this.selectOptionByLabel(labels);
    return this;
  }

  async selectOtherOption(uploadImage: string, otherText?: string): Promise<this> {
    await this.extendedPage.uiComponents.sdsComponents
      .attachment(`${this.testId}-other-option-attachment`)
      .uploadFiles([uploadImage], { waitForUploadComplete: false });

    await this.waitForOtherUploadComplete();

    if (otherText !== undefined) {
      await this.extendedPage.uiComponents.sdsComponents
        .textInput(`${this.testId}-other-option-textfield`)
        .fill(otherText);
    }

    return this;
  }

  async getValue(): Promise<PictureChoiceValue> {
    return await this.getHost().evaluate(async (el: any) => {
      const value = typeof el.getValue === 'function' ? await el.getValue() : el.value;
      return value ?? {};
    });
  }

  async isMulti(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.isMulti === true);
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }

  private async getOptions(): Promise<PictureChoiceOption[]> {
    return await this.getHost().evaluate(async (el: any) => {
      const options = typeof el.getOptions === 'function' ? await el.getOptions() : el.options;
      return Array.isArray(options) ? options : [];
    });
  }

  private async clickOptionByLabel(label: string): Promise<void> {
    await this.page.getByTestId(`${this.testId}-option-${label}-wrapper`).click();
  }

  private async waitForOtherUploadComplete(): Promise<void> {
    await expect
      .poll(
        async () => {
          const value = await this.getValue();
          const s3Key = value.otherValue?.s3Key ?? '';
          const previewAttached =
            (await this.page.getByTestId(`${this.testId}-other-option-preview-attachment`).count()) > 0;

          return s3Key.length > 0 && previewAttached;
        },
        { timeout: 60_000 },
      )
      .toBe(true);
  }
}
