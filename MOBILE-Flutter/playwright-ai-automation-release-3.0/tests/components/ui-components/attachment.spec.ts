import path from 'path';
import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

const attachmentFixturesDir = path.join(__dirname, '../../../test-assets/attachments');
const samplePng = path.join(attachmentFixturesDir, 'sample.png');
const samplePdf = path.join(attachmentFixturesDir, 'sample.pdf');

test.describe('Attachment Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-attachment.html'));
    await page.waitForLoadState('networkidle');
    await page.getByTestId('sds-attachment-file').waitFor({ state: 'visible' });
  });

  test.describe('uploadFiles', () => {
    test('should upload a PNG file', async ({ page }) => {
      const attachment = page.uiComponents.attachment('sds-attachment-file');

      await attachment.uploadFiles([samplePng]);
      expect(await attachment.getUploadedCount()).toBe(1);
      expect(await attachment.getValueSummary()).toEqual(
        expect.arrayContaining([{ fileName: 'sample.png', uploadStatus: 'success' }]),
      );
    });

    test('should upload a PDF file', async ({ page }) => {
      const attachment = page.uiComponents.attachment('sds-attachment-file');

      await attachment.uploadFiles([samplePdf]);
      expect(await attachment.getUploadedCount()).toBe(1);
      expect(await attachment.getValueSummary()).toEqual(
        expect.arrayContaining([{ fileName: 'sample.pdf', uploadStatus: 'success' }]),
      );
    });

    test('should upload PNG and PDF files', async ({ page }) => {
      const attachment = page.uiComponents.attachment('sds-attachment-file');

      await attachment.uploadFiles([
        samplePng,
        samplePdf,
      ]);
      expect(await attachment.getUploadedCount()).toBe(2);
      expect(await attachment.getValueSummary()).toEqual(
        expect.arrayContaining([
          { fileName: 'sample.png', uploadStatus: 'success' },
          { fileName: 'sample.pdf', uploadStatus: 'success' },
        ]),
      );
    });

    test('should upload via button uploader modal', async ({ page }) => {
      const attachment = page.uiComponents.attachment('sds-attachment-button');

      await attachment.uploadFiles([samplePng]);
      expect(await attachment.getUploadedCount()).toBe(1);
      expect(await attachment.getValueSummary()).toEqual(
        expect.arrayContaining([{ fileName: 'sample.png', uploadStatus: 'success' }]),
      );
    });
  });

  test.describe('State', () => {
    test('should detect disabled state', async ({ page }) => {
      const attachment = page.uiComponents.attachment('sds-attachment-disabled');
      expect(await attachment.isDisabled()).toBe(true);
    });

    test('should detect read-only state', async ({ page }) => {
      const attachment = page.uiComponents.attachment('sds-attachment-readonly');
      expect(await attachment.isReadOnly()).toBe(true);
    });
  });

  test.describe('SDS namespace', () => {
    test('sdsComponents.attachment should upload a file', async ({ page }) => {
      const attachment = page.uiComponents.sdsComponents.attachment('sds-attachment-file');

      await attachment.uploadFiles([samplePdf]);
      expect(await attachment.getUploadedCount()).toBe(1);
    });
  });
});
