import { Page, Locator } from '@playwright/test';
import { IDaterangePickerUtils } from './base.interface.js';
import { UiDatepickerUtils } from '../datepicker/ui.component.js';

export class UiDaterangePickerUtils implements IDaterangePickerUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getMinDatepicker(): UiDatepickerUtils {
    return new UiDatepickerUtils(this.page, `${this.testId}-min`);
  }

  getMaxDatepicker(): UiDatepickerUtils {
    return new UiDatepickerUtils(this.page, `${this.testId}-max`);
  }

  async getMinDate(): Promise<string> {
    return await this.getHost().evaluate((el: any) => el.value?.[0] ?? '');
  }

  async getMaxDate(): Promise<string> {
    return await this.getHost().evaluate((el: any) => el.value?.[1] ?? '');
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }

  async getValidity(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => {
      if (typeof el.getValidity === 'function') {
        return el.getValidity();
      }
      return true;
    });
  }

  async setMinDate(date: Date): Promise<this> {
    await this.getMinDatepicker().selectDate(date);
    return this;
  }

  async setMaxDate(date: Date): Promise<this> {
    await this.getMaxDatepicker().selectDate(date);
    return this;
  }

  async setRange(minDate: Date, maxDate: Date): Promise<this> {
    await this.setMinDate(minDate);
    await this.setMaxDate(maxDate);
    return this;
  }
}
