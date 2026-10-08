import { Page, Locator } from '@playwright/test';
import { IDatepickerUtils } from './base.interface.js';
import { SdsDatepickerUtils } from './sds.component.js';
import { UiDatepickerUtils } from './ui.component.js';

export class DatepickerUtils implements IDatepickerUtils {
  private impl: SdsDatepickerUtils | UiDatepickerUtils | null = null;

  constructor(private page: Page, private testId: string) {}

  private async getImplementation(): Promise<IDatepickerUtils> {
    if (!this.impl) {
      const tagName = await this.page.getByTestId(this.testId).evaluate(el => el.tagName.toLowerCase());
      this.impl = tagName.startsWith('dbx-ds-')
        ? new SdsDatepickerUtils(this.page, this.testId)
        : new UiDatepickerUtils(this.page, this.testId);
    }
    return this.impl;
  }

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getInput(): Locator {
    return this.page.getByTestId(`${this.testId}-input`);
  }

  async openCalendar(): Promise<this> {
    const impl = await this.getImplementation();
    await impl.openCalendar();
    return this;
  }

  async closeCalendar(): Promise<this> {
    const impl = await this.getImplementation();
    await impl.closeCalendar();
    return this;
  }

  async selectDay(monthIndex: number, day: number): Promise<this> {
    const impl = await this.getImplementation();
    await impl.selectDay(monthIndex, day);
    return this;
  }

  async selectMonth(monthIndex: number): Promise<this> {
    const impl = await this.getImplementation();
    await impl.selectMonth(monthIndex);
    return this;
  }

  async selectYear(year: number): Promise<this> {
    const impl = await this.getImplementation();
    await impl.selectYear(year);
    return this;
  }

  async selectDate(date: Date): Promise<this> {
    const impl = await this.getImplementation();
    await impl.selectDate(date);
    return this;
  }

  async navigateToPrevMonth(): Promise<this> {
    const impl = await this.getImplementation();
    await impl.navigateToPrevMonth();
    return this;
  }

  async navigateToNextMonth(): Promise<this> {
    const impl = await this.getImplementation();
    await impl.navigateToNextMonth();
    return this;
  }

  async toggleView(): Promise<this> {
    const impl = await this.getImplementation();
    await impl.toggleView();
    return this;
  }

  async typeDate(dateString: string): Promise<this> {
    const impl = await this.getImplementation();
    await impl.typeDate(dateString);
    return this;
  }

  async getValue(): Promise<string> {
    const impl = await this.getImplementation();
    return impl.getValue();
  }

  async clear(): Promise<this> {
    const impl = await this.getImplementation();
    await impl.clear();
    return this;
  }

  async isDisabled(): Promise<boolean> {
    const impl = await this.getImplementation();
    return impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    const impl = await this.getImplementation();
    return impl.isReadOnly();
  }
}

export { IDatepickerUtils } from './base.interface.js';
export { SdsDatepickerUtils } from './sds.component.js';
export { UiDatepickerUtils } from './ui.component.js';
