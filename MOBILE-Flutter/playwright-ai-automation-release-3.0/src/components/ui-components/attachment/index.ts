import { Page, Locator } from '@playwright/test';
import {
  AttachmentValueSummary,
  IAttachmentUtils,
  UploadFilesOptions,
} from './base.interface.js';
import { SdsAttachmentUtils } from './sds.component.js';

export class AttachmentUtils implements IAttachmentUtils {
  private impl: SdsAttachmentUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsAttachmentUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  async openUploadModal(): Promise<this> {
    await this.impl.openUploadModal();
    return this;
  }

  async uploadFiles(filePaths: string[], options?: UploadFilesOptions): Promise<this> {
    await this.impl.uploadFiles(filePaths, options);
    return this;
  }

  async getValueSummary(): Promise<AttachmentValueSummary[]> {
    return this.impl.getValueSummary();
  }

  async getUploadedCount(): Promise<number> {
    return this.impl.getUploadedCount();
  }

  async isDisabled(): Promise<boolean> {
    return this.impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    return this.impl.isReadOnly();
  }
}

export { SdsAttachmentUtils } from './sds.component.js';
export type {
  AttachmentUploadStatus,
  AttachmentValueSummary,
  IAttachmentUtils,
  UploadFilesOptions,
} from './base.interface.js';
