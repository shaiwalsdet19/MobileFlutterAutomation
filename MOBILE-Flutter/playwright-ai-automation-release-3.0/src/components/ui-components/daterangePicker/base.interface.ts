import { Locator } from '@playwright/test';
import { IDatepickerUtils } from '../datepicker/base.interface.js';

export interface IDaterangePickerUtils {
  getHost(): Locator;
  getMinDatepicker(): IDatepickerUtils;
  getMaxDatepicker(): IDatepickerUtils;

  setMinDate(date: Date): Promise<IDaterangePickerUtils>;
  setMaxDate(date: Date): Promise<IDaterangePickerUtils>;
  setRange(minDate: Date, maxDate: Date): Promise<IDaterangePickerUtils>;

  getMinDate(): Promise<string>;
  getMaxDate(): Promise<string>;

  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
  getValidity(): Promise<boolean>;
}
