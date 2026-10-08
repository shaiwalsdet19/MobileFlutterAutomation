import { expect, Page } from '@playwright/test';
import type { ComponentPage } from '../../../fixtures/ui-components.fixture.js';
import { ISignatureUtils, SignatureTabType, SignatureValue } from './base.interface.js';

export class SdsSignatureUtils implements ISignatureUtils {
  constructor(private page: Page, private testId: string) {}

  private get extendedPage(): ComponentPage {
    return this.page as ComponentPage;
  }

  getHost() {
    return this.page.getByTestId(this.testId);
  }

  async switchTabType(tab: SignatureTabType): Promise<this> {
    await this.page.getByTestId(`${this.testId}-signature-type-tabs-tab-item-${tab}`).click();
    await expect
      .poll(async () => this.getHost().evaluate((el: any) => el.signatureMode))
      .toBe(tab);
    return this;
  }

  async typeSignature(inputText: string): Promise<this> {
    await this.switchTabType('type');
    const input = this.page.getByTestId(`${this.testId}-signature-type-input`);
    await input.click();
    await input.pressSequentially(inputText);
    await this.page.getByTestId(`${this.testId}-signature-save-action`).waitFor({ state: 'visible' });
    await this.page.getByTestId(`${this.testId}-signature-save-action`).click();
    await this.waitForSignatureSaved();

    return this;
  }

  async uploadSignature(filePath: string): Promise<this> {
    await this.switchTabType('upload');

    await this.extendedPage.uiComponents.sdsComponents
      .attachment(`${this.testId}-signature-upload-attachment`)
      .uploadFiles([filePath], { waitForUploadComplete: false });

    await this.page.getByTestId(`${this.testId}-signature-preview-image`).waitFor({ state: 'attached' });
    const saveAction = this.page.getByTestId(`${this.testId}-signature-save-action`);
    await saveAction.waitFor({ state: 'visible' });
    await saveAction.click();
    await this.waitForSignatureSaved();

    return this;
  }

  async getValue(): Promise<SignatureValue | undefined> {
    return await this.getHost().evaluate(async (el: any) => {
      const value = typeof el.getValue === 'function' ? await el.getValue() : el.value;
      return value ?? undefined;
    });
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }

  private async waitForSignatureSaved(): Promise<void> {
    await expect
      .poll(
        async () => {
          const state = await this.getHost().evaluate(async (el: any) => {
            const value = typeof el.getValue === 'function' ? await el.getValue() : el.value;
            return {
              key: value?.key ?? '',
              loading: el.loading === true,
            };
          });

          if (state.loading || !state.key) {
            return false;
          }

          const previewAttached = await this.page
            .getByTestId(`${this.testId}-signature-uploaded-preview-image`)
            .count();

          return !state.loading && state.key.length > 0 && previewAttached > 0;
        },
        { timeout: 60_000 },
      )
      .toBe(true);
  }
}
