import { Page, Locator } from '@playwright/test';
import { IDropdownUtils } from './base.interface.js';

export class SdsDropdownUtils implements IDropdownUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getHead(): Locator {
    return this.page.getByTestId(`${this.testId}-head`);
  }

  getSearchInput(): Locator {
    return this.page.getByTestId(`${this.testId}-search`);
  }

  getScrollContainer(): Locator {
    return this.page.getByTestId(`${this.testId}-scroll-container`);
  }

  getOption(label: string): Locator {
    return this.page.getByTestId(`${this.testId}-option-${label}`);
  }

  getNoOptions(): Locator {
    return this.page.getByTestId(`${this.testId}-no-options`);
  }

  getSelectAll(): Locator {
    return this.page.getByTestId(`${this.testId}-select-all`);
  }

  getPanel(): Locator {
    return this.page.locator('dbx-dropdown-panel');
  }

  async open(): Promise<this> {
    if (!(await this.isOpen())) {
      await this.getHead().click();
      await this.getPanel().waitFor({ state: 'visible' });
    }
    return this;
  }

  async close(): Promise<this> {
    if (await this.isOpen()) {
      await this.page.keyboard.press('Escape');
      await this.getPanel().waitFor({ state: 'hidden' });
    }
    return this;
  }

  async search(query: string): Promise<this> {
    await this.open();
    await this.getSearchInput().fill(query);
    return this;
  }

  async clearSearch(): Promise<this> {
    await this.open();
    await this.getSearchInput().clear();
    return this;
  }

  async scrollToOption(label: string, maxScrollAttempts = 200): Promise<this> {
    const option = this.getOption(label);
    const scrollContainer = this.getScrollContainer();

    for (let i = 0; i < maxScrollAttempts; i++) {
      try {
        await option.waitFor({ state: 'visible', timeout: 200 });
        return this;
      } catch {
        await scrollContainer.evaluate(el => {
          el.scrollTop += 500;
        });
        await this.page.waitForTimeout(100);
      }
    }
    return this;
  }

  async selectOption(label: string): Promise<this> {
    await this.open();
    await this.scrollToOption(label);
    await this.getOption(label).click();
    return this;
  }

  async selectOptions(labels: string[]): Promise<this> {
    for (const label of labels) {
      await this.selectOption(label);
    }
    return this;
  }

  async deselectOption(label: string): Promise<this> {
    await this.open();
    await this.scrollToOption(label);
    await this.getOption(label).click();
    return this;
  }

  async selectAll(): Promise<this> {
    await this.open();
    await this.getSelectAll().click();
    return this;
  }

  async getValue(): Promise<any> {
    return await this.getHost().evaluate((el: any) => el.value);
  }

  async getSelectedOptions(): Promise<any[]> {
    return await this.getHost().evaluate((el: any) => {
      if (typeof el.getSelectedOptions === 'function') {
        return el.getSelectedOptions();
      }
      return [];
    });
  }

  async areOptionsSelected(labels: string[] | string): Promise<boolean> {
    const labelsToCheck = Array.isArray(labels) ? labels : [labels];
    const labelKey = await this.getHost().evaluate((el: any) => el.labelKeyInOptions || 'label');
    const selectedOptions = await this.getSelectedOptions();
    const selectedLabels = selectedOptions.map((opt: any) => opt?.[labelKey]);
    return labelsToCheck.every(label => selectedLabels.includes(label));
  }

  async isOpen(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => {
      if (typeof el.isDropdownOpen === 'function') {
        return el.isDropdownOpen();
      }
      return false;
    });
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }

  async isLoading(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => {
      if (typeof el.isLoading === 'function') {
        return el.isLoading();
      }
      return false;
    });
  }

  async hasNoOptions(): Promise<boolean> {
    await this.open();
    return await this.getNoOptions().isVisible();
  }
}
