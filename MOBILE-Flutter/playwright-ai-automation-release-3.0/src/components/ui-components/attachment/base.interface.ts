import { Locator } from '@playwright/test';

export type AttachmentUploadStatus = 'success' | 'failure' | 'pending';

export type AttachmentValueSummary = {
  fileName: string;
  uploadStatus?: AttachmentUploadStatus;
};

export type UploadFilesOptions = {
  useModalUploader?: boolean;
  waitForUploadComplete?: boolean;
};

export interface IAttachmentUtils {
  getHost(): Locator;

  uploadFiles(filePaths: string[], options?: UploadFilesOptions): Promise<IAttachmentUtils>;
  openUploadModal(): Promise<IAttachmentUtils>;
  getValueSummary(): Promise<AttachmentValueSummary[]>;
  getUploadedCount(): Promise<number>;
  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
