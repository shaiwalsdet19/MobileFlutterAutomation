import { Locator } from '@playwright/test';

export interface IDatepickerUtils {
  getHost(): Locator;
  getInput(): Locator;

  openCalendar(): Promise<IDatepickerUtils>;
  closeCalendar(): Promise<IDatepickerUtils>;

  selectDay(monthIndex: number, day: number): Promise<IDatepickerUtils>;
  selectMonth(monthIndex: number): Promise<IDatepickerUtils>;
  selectYear(year: number): Promise<IDatepickerUtils>;
  selectDate(date: Date): Promise<IDatepickerUtils>;

  navigateToPrevMonth(): Promise<IDatepickerUtils>;
  navigateToNextMonth(): Promise<IDatepickerUtils>;
  toggleView(): Promise<IDatepickerUtils>;

  typeDate(dateString: string): Promise<IDatepickerUtils>;
  getValue(): Promise<string>;
  clear(): Promise<IDatepickerUtils>;

  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
