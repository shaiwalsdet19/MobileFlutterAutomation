import path from 'path';
import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

const sampleSignaturePng = path.join(__dirname, '../../../test-assets/attachments/sample-signature.png');

test.describe('Signature Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-signature.html'));
    await page.waitForLoadState('networkidle');
    await page.getByTestId('sds-signature-default').waitFor({ state: 'visible' });
  });

  test.describe('switchTabType', () => {
    test('should switch to upload tab', async ({ page }) => {
      const signature = page.uiComponents.signature('sds-signature-default');

      await signature.switchTabType('upload');
      expect(await signature.getHost().evaluate((el: any) => el.signatureMode)).toBe('upload');
    });
  });

  test.describe('typeSignature', () => {
    test('should type and save a signature', async ({ page }) => {
      const signature = page.uiComponents.signature('sds-signature-default');

      await signature.typeSignature('Jane Doe');
      expect(await signature.getValue()).toEqual(
        expect.objectContaining({
          key: 'playwright-tests/signature-mock.png',
          signatureMode: 'type',
        }),
      );
      await expect(page.getByTestId('sds-signature-default-signature-uploaded-preview-image')).toBeAttached();
    });
  });

  test.describe('uploadSignature', () => {
    test('should upload and save a signature image', async ({ page }) => {
      const signature = page.uiComponents.signature('sds-signature-default');

      await signature.uploadSignature(sampleSignaturePng);
      expect(await signature.getValue()).toEqual(
        expect.objectContaining({
          key: 'playwright-tests/signature-mock.png',
          signatureMode: 'upload',
        }),
      );
      await expect(page.getByTestId('sds-signature-default-signature-uploaded-preview-image')).toBeAttached();
    });
  });

  test.describe('State', () => {
    test('should detect disabled state', async ({ page }) => {
      const signature = page.uiComponents.signature('sds-signature-disabled');
      expect(await signature.isDisabled()).toBe(true);
    });

    test('should detect read-only state', async ({ page }) => {
      const signature = page.uiComponents.signature('sds-signature-readonly');
      expect(await signature.isReadOnly()).toBe(true);
    });
  });

  test.describe('SDS namespace', () => {
    test('sdsComponents.signature should type and save a signature', async ({ page }) => {
      const signature = page.uiComponents.sdsComponents.signature('sds-signature-default');

      await signature.typeSignature('John Smith');
      expect(await signature.getValue()).toEqual(
        expect.objectContaining({ key: 'playwright-tests/signature-mock.png', signatureMode: 'type' }),
      );
    });
  });
});
