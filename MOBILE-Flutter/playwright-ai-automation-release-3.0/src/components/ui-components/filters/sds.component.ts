import { Page, Locator } from '@playwright/test';
import { IFiltersUtils } from './base.interface.js';
import { AccordionUtils } from '../accordion/index.js';
import { ConfirmationDialogUtils } from '../confirmationDialog/index.js';
import { TextInputUtils } from '../textInput/index.js';
import { ComponentPage } from '../../../fixtures/ui-components.fixture.js';

export class SdsFiltersUtils implements IFiltersUtils {
  constructor(private page: Page, private testId: string) {}

  private get extendedPage(): ComponentPage {
    return this.page as ComponentPage;
  }

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getTrigger(): Locator {
    return this.page.getByTestId(`${this.testId}-trigger`);
  }

  getModal(): Locator {
    return this.page.getByTestId(`${this.testId}-modal`);
  }

  getSearchInput(): TextInputUtils {
    return this.extendedPage.uiComponents.textInput(`${this.testId}-search`);
  }

  getGroupAccordion(groupId: string): AccordionUtils {
    return new AccordionUtils(this.page, `${this.testId}-group-${groupId}`);
  }

  getFilter(filterId: string): Locator {
    return this.page.getByTestId(`${this.testId}-filter-${filterId}`);
  }

  async isPanelOpen(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => {
      if (typeof el.isPanelOpen === 'function') {
        return el.isPanelOpen();
      }
      return el.isFiltersPanelOpen === true;
    });
  }

  async openPanel(): Promise<this> {
    const isOpen = await this.isPanelOpen();
    if (!isOpen) {
      await this.getTrigger().click();
    }
    return this;
  }

  async closePanel(): Promise<this> {
    const isOpen = await this.isPanelOpen();
    if (isOpen) {
      await this.clickCancel();
      await this.page.waitForTimeout(200);

      const stillOpen = await this.isPanelOpen();
      if (stillOpen) {
        await this.clickCancel();
        await this.page.waitForTimeout(300);

        const confirmDialog = this.getConfirmationDialog();
        if (await confirmDialog.isOpen()) {
          const proceedBtn = confirmDialog.getDialog().getPrimaryButton();
          await proceedBtn.waitFor({ state: 'visible', timeout: 5000 });
          await proceedBtn.click();
          await this.page.waitForTimeout(300);
        }
      }
    }
    return this;
  }

  getConfirmationDialog(): ConfirmationDialogUtils {
    return new ConfirmationDialogUtils(this.page, `${this.testId}-confirm-dialog`);
  }

  async closePanelWithoutConfirmation(): Promise<this> {
    const isOpen = await this.isPanelOpen();
    if (isOpen) {
      await this.clickCancel();
    }
    return this;
  }

  async getValue(): Promise<Record<string, any>> {
    return await this.getHost().evaluate((el: any) => {
      if (typeof el.getValue === 'function') {
        return el.getValue();
      }
      return el.value ?? {};
    });
  }

  async getFilterValue(filterId: string): Promise<any> {
    const value = await this.getValue();
    return value[filterId] ?? null;
  }

  async getAppliedFiltersCount(): Promise<number> {
    return await this.getHost().evaluate((el: any) => el.appliedFiltersCount ?? 0);
  }

  async clickApply(): Promise<this> {
    await this.page.getByTestId(`${this.testId}-apply-btn`).click();
    return this;
  }

  async clickReset(): Promise<this> {
    await this.page.getByTestId(`${this.testId}-reset-btn`).click();
    return this;
  }

  async clickCancel(): Promise<this> {
    await this.page.getByTestId(`${this.testId}-cancel-btn`).click();
    return this;
  }

  async search(query: string): Promise<this> {
    const searchInput = this.getSearchInput();
    await searchInput.fill(query);
    return this;
  }

  async clearSearch(): Promise<this> {
    const searchInput = this.getSearchInput();
    await searchInput.clear();
    return this;
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }
}
