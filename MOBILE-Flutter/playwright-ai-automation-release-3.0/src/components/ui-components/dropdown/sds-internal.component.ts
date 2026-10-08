import { Page, Locator } from '@playwright/test';

export class SdsInternalDropdownUtils {
  constructor(private page: Page, private testId: string) {}

  getHead(): Locator {
    return this.page.getByTestId(`${this.testId}-head`);
  }

  getScrollContainer(): Locator {
    return this.page.getByTestId(`${this.testId}-scroll-container`);
  }

  getOption(label: string): Locator {
    return this.page.getByTestId(`${this.testId}-option-${label}`);
  }

  getPanel(): Locator {
    return this.page.locator('dbx-dropdown-panel');
  }

  async isOpen(): Promise<boolean> {
    return await this.getPanel().isVisible();
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
}
