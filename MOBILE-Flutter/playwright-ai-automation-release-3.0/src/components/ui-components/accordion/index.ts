import { Page, Locator } from '@playwright/test';
import { IAccordionUtils } from './base.interface.js';
import { SdsAccordionUtils } from './sds.component.js';
import { UiAccordionUtils } from './ui.component.js';

export class AccordionUtils implements IAccordionUtils {
  private impl: SdsAccordionUtils | UiAccordionUtils | null = null;

  constructor(private page: Page, private testId: string) {}

  private async getImplementation(): Promise<SdsAccordionUtils | UiAccordionUtils> {
    if (!this.impl) {
      const tag = await this.page.getByTestId(this.testId).evaluate(el => el.tagName.toLowerCase());
      this.impl = tag === 'dbx-accordion'
        ? new UiAccordionUtils(this.page, this.testId)
        : new SdsAccordionUtils(this.page, this.testId);
    }
    return this.impl;
  }

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getHeaderWrapper(): Locator {
    return this.page.getByTestId(`${this.testId}-accordion-header-wrapper`);
  }

  async isOpen(): Promise<boolean> {
    return (await this.getImplementation()).isOpen();
  }

  async isAccordionEnabled(): Promise<boolean> {
    return (await this.getImplementation()).isAccordionEnabled();
  }

  async expand(): Promise<this> {
    await (await this.getImplementation()).expand();
    return this;
  }

  async collapse(): Promise<this> {
    await (await this.getImplementation()).collapse();
    return this;
  }

  async toggle(): Promise<this> {
    await (await this.getImplementation()).toggle();
    return this;
  }
}

export { SdsAccordionUtils } from './sds.component.js';
export { UiAccordionUtils } from './ui.component.js';
