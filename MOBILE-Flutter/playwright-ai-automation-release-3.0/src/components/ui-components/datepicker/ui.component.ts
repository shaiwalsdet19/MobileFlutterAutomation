import { Page, Locator } from '@playwright/test';
import { IDatepickerUtils } from './base.interface.js';

export class UiDatepickerUtils implements IDatepickerUtils {
  constructor(protected page: Page, protected testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getInput(): Locator {
    return this.page.getByTestId(`${this.testId}-input`);
  }

  async openCalendar(): Promise<this> {
    await this.getInput().click();
    return this;
  }

  async closeCalendar(): Promise<this> {
    await this.page.keyboard.press('Escape');
    return this;
  }

  async selectDay(monthIndex: number, day: number): Promise<this> {
    await this.page.getByTestId(`${this.testId}-day-${monthIndex}-${day}`).click();
    return this;
  }

  async navigateToPrevMonth(): Promise<this> {
    await this.page.getByTestId(`${this.testId}-nav-prev`).click();
    return this;
  }

  async navigateToNextMonth(): Promise<this> {
    await this.page.getByTestId(`${this.testId}-nav-next`).click();
    return this;
  }

  async toggleView(): Promise<this> {
    await this.page.getByTestId(`${this.testId}-view-toggle`).click();
    return this;
  }

  async selectMonth(monthIndex: number): Promise<this> {
    await this.page.getByTestId(`${this.testId}-month-${monthIndex}`).click();
    return this;
  }

  async selectYear(year: number): Promise<this> {
    await this.page.getByTestId(`${this.testId}-year-${year}`).click();
    return this;
  }

  async selectDate(date: Date): Promise<this> {
    await this.openCalendar();
    await this.toggleView();
    await this.toggleView();
    await this.selectYear(date.getFullYear());
    await this.selectMonth(date.getMonth());
    await this.selectDay(date.getMonth(), date.getDate());
    return this;
  }

  async getValue(): Promise<string> {
    return await this.getHost().evaluate((el: any) => el.value ?? '');
  }

  async typeDate(dateString: string): Promise<this> {
    await this.getInput().fill(dateString);
    return this;
  }

  async clear(): Promise<this> {
    await this.getInput().clear();
    return this;
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }
}
