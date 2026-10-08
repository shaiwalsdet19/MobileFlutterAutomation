import { Page, Locator } from '@playwright/test';
import { IAccordionUtils } from './base.interface.js';

export class UiAccordionUtils implements IAccordionUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getHeaderWrapper(): Locator {
    return this.page.getByTestId(`${this.testId}-accordion-header-wrapper`);
  }

  async isOpen(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.isOpen === true);
  }

  async isAccordionEnabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.isAccordionEnabled === true);
  }

  async expand(): Promise<this> {
    const isEnabled = await this.isAccordionEnabled();
    const isCurrentlyOpen = await this.isOpen();

    if (isEnabled && !isCurrentlyOpen) {
      await this.getHeaderWrapper().click();
    }

    return this;
  }

  async collapse(): Promise<this> {
    const isEnabled = await this.isAccordionEnabled();
    const isCurrentlyOpen = await this.isOpen();

    if (isEnabled && isCurrentlyOpen) {
      await this.getHeaderWrapper().click();
    }

    return this;
  }

  async toggle(): Promise<this> {
    const isEnabled = await this.isAccordionEnabled();

    if (isEnabled) {
      await this.getHeaderWrapper().click();
    }

    return this;
  }
}
