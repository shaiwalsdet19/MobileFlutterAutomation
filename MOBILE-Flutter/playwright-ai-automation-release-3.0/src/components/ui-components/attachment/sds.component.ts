import { expect, Locator, Page } from '@playwright/test';
import {
  AttachmentValueSummary,
  IAttachmentUtils,
  UploadFilesOptions,
} from './base.interface.js';

export class SdsAttachmentUtils implements IAttachmentUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  async openUploadModal(): Promise<this> {
    await this.page.getByTestId(`${this.testId}-uploader-button-button`).click();
    // Wait for modal content in DOM — not viewport visibility. Playwright `visible` also
    // requires non-hidden layout (size > 0), which can fail on animated modal hosts.
    await this.page
      .getByTestId(`${this.testId}-inside-modal-uploader-drop-area`)
      .waitFor({ state: 'attached' });
    return this;
  }

  async uploadFiles(filePaths: string[], options?: UploadFilesOptions): Promise<this> {
    const useModal =
      options?.useModalUploader === true ||
      (options?.useModalUploader !== false && (await this.getUploaderType()) === 'button');

    if (useModal) {
      // Button uploader opens the native file picker on click (openFilePicker in component).
      const [fileChooser] = await Promise.all([
        this.page.waitForEvent('filechooser'),
        this.page.getByTestId(`${this.testId}-uploader-button-button`).click(),
      ]);
      await fileChooser.setFiles(filePaths);
      await this.page
        .getByTestId(`${this.testId}-inside-modal-uploader-drop-area`)
        .waitFor({ state: 'attached' });
    } else {
      const dropArea = this.page.getByTestId(`${this.testId}-uploader-drop-area`);
      const [fileChooser] = await Promise.all([
        this.page.waitForEvent('filechooser'),
        dropArea.click(),
      ]);
      await fileChooser.setFiles(filePaths);
    }

    if (options?.waitForUploadComplete !== false) {
      await this.waitForUploadsComplete(filePaths.length);
    }

    return this;
  }

  async getValueSummary(): Promise<AttachmentValueSummary[]> {
    return await this.getHost().evaluate(async (el: any) => {
      const value = typeof el.getValue === 'function' ? await el.getValue() : el.value;
      const items = Array.isArray(value) ? value : [];

      return items.map((item: any) => ({
        fileName: item?.file?.name ?? item?.fileMetaData?.name ?? '',
        uploadStatus: item?.uploadStatus,
      }));
    });
  }

  async getUploadedCount(): Promise<number> {
    const summaries = await this.getValueSummary();
    return summaries.filter(item => item.uploadStatus === 'success').length;
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }

  private async getUploaderType(): Promise<string> {
    return await this.getHost().evaluate((el: any) => el.uploaderType ?? 'file');
  }

  private async waitForUploadsComplete(expectedCount: number): Promise<void> {
    await expect
      .poll(
        async () => {
          const inProgress = await this.getHost().evaluate((el: any) => el.filesUploadInProgressCount ?? 0);
          const summaries = await this.getValueSummary();
          const failure = summaries.find(item => item.uploadStatus === 'failure');

          if (failure) {
            throw new Error(`Upload failed for ${failure.fileName}`);
          }

          const successCount = summaries.filter(item => item.uploadStatus === 'success').length;
          return inProgress === 0 && successCount >= expectedCount;
        },
        { timeout: 60_000 },
      )
      .toBe(true);
  }
}
