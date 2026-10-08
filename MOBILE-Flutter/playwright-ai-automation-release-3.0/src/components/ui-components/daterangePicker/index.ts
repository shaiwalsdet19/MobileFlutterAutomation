import { Page, Locator } from '@playwright/test';
import { IDaterangePickerUtils } from './base.interface.js';
import { SdsDaterangePickerUtils } from './sds.component.js';
import { UiDaterangePickerUtils } from './ui.component.js';
import { IDatepickerUtils } from '../datepicker/base.interface.js';

export class DaterangePickerUtils implements IDaterangePickerUtils {
  private impl: SdsDaterangePickerUtils | UiDaterangePickerUtils | null = null;

  constructor(private page: Page, private testId: string) {}

  private async getImplementation(): Promise<SdsDaterangePickerUtils | UiDaterangePickerUtils> {
    if (!this.impl) {
      const tag = await this.page.getByTestId(this.testId).evaluate(el => el.tagName.toLowerCase());
      this.impl = tag === 'dbx-daterange-picker'
        ? new UiDaterangePickerUtils(this.page, this.testId)
        : new SdsDaterangePickerUtils(this.page, this.testId);
    }
    return this.impl;
  }

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getMinDatepicker(): IDatepickerUtils {
    if (this.impl) {
      return this.impl.getMinDatepicker();
    }
    // Pre-resolution fallback — returns a no-op proxy until impl is resolved
    return new SdsDaterangePickerUtils(this.page, this.testId).getMinDatepicker();
  }

  getMaxDatepicker(): IDatepickerUtils {
    if (this.impl) {
      return this.impl.getMaxDatepicker();
    }
    return new SdsDaterangePickerUtils(this.page, this.testId).getMaxDatepicker();
  }

  async setMinDate(date: Date): Promise<this> {
    await (await this.getImplementation()).setMinDate(date);
    return this;
  }

  async setMaxDate(date: Date): Promise<this> {
    await (await this.getImplementation()).setMaxDate(date);
    return this;
  }

  async setRange(minDate: Date, maxDate: Date): Promise<this> {
    await (await this.getImplementation()).setRange(minDate, maxDate);
    return this;
  }

  async getMinDate(): Promise<string> {
    return (await this.getImplementation()).getMinDate();
  }

  async getMaxDate(): Promise<string> {
    return (await this.getImplementation()).getMaxDate();
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getImplementation()).isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    return (await this.getImplementation()).isReadOnly();
  }

  async getValidity(): Promise<boolean> {
    return (await this.getImplementation()).getValidity();
  }
}

export { SdsDaterangePickerUtils } from './sds.component.js';
export { UiDaterangePickerUtils } from './ui.component.js';
