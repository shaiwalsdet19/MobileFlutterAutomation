import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';

test.describe('ConfirmationDialogUtils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3333/playwright-dialog.html');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Open and Close operations', () => {
    test('should open confirmation dialog when trigger is clicked', async ({ page }) => {
      const confirmDialog = page.uiComponents.confirmationDialog('confirm-dialog');

      const initialState = await confirmDialog.isOpen();
      expect(initialState).toBe(false);

      await page.click('#open-confirm-dialog');
      await page.waitForTimeout(300);

      const openState = await confirmDialog.isOpen();
      expect(openState).toBe(true);
    });

    test('should close when proceed button is clicked', async ({ page }) => {
      const confirmDialog = page.uiComponents.confirmationDialog('confirm-dialog');

      await page.click('#open-confirm-dialog');
      await page.waitForTimeout(300);

      expect(await confirmDialog.isOpen()).toBe(true);

      await confirmDialog.clickProceed();
      await page.waitForTimeout(300);

      expect(await confirmDialog.isOpen()).toBe(false);
    });

    test('should close when cancel button is clicked', async ({ page }) => {
      const confirmDialog = page.uiComponents.confirmationDialog('confirm-dialog');

      await page.click('#open-confirm-dialog');
      await page.waitForTimeout(300);

      expect(await confirmDialog.isOpen()).toBe(true);

      await confirmDialog.clickCancel();
      await page.waitForTimeout(300);

      expect(await confirmDialog.isOpen()).toBe(false);
    });

    test('should close when close button is clicked', async ({ page }) => {
      const confirmDialog = page.uiComponents.confirmationDialog('confirm-dialog');

      await page.click('#open-confirm-dialog');
      await page.waitForTimeout(300);

      expect(await confirmDialog.isOpen()).toBe(true);

      await confirmDialog.clickClose();
      await page.waitForTimeout(300);

      expect(await confirmDialog.isOpen()).toBe(false);
    });
  });

  test.describe('Inner dialog access', () => {
    test('should access inner dialog via getDialog()', async ({ page }) => {
      const confirmDialog = page.uiComponents.confirmationDialog('confirm-dialog');

      await page.click('#open-confirm-dialog');
      await page.waitForTimeout(300);

      const innerDialog = confirmDialog.getDialog();

      await expect(innerDialog.getPrimaryButton()).toBeVisible();
      await expect(innerDialog.getSecondaryButton()).toBeVisible();
      await expect(innerDialog.getCloseButton()).toBeVisible();
    });

    test('should check inner dialog open state', async ({ page }) => {
      const confirmDialog = page.uiComponents.confirmationDialog('confirm-dialog');

      await page.click('#open-confirm-dialog');
      await page.waitForTimeout(300);

      const innerDialog = confirmDialog.getDialog();

      expect(await innerDialog.isOpen()).toBe(true);
    });
  });

  test.describe('Show and Hide methods', () => {
    test('should show confirmation dialog programmatically', async ({ page }) => {
      const confirmDialog = page.uiComponents.confirmationDialog('confirm-dialog');

      expect(await confirmDialog.isOpen()).toBe(false);

      await confirmDialog.show();
      await page.waitForTimeout(300);

      expect(await confirmDialog.isOpen()).toBe(true);
    });

    test('should hide confirmation dialog programmatically', async ({ page }) => {
      const confirmDialog = page.uiComponents.confirmationDialog('confirm-dialog');

      await confirmDialog.show();
      await page.waitForTimeout(300);

      expect(await confirmDialog.isOpen()).toBe(true);

      await confirmDialog.hide();
      await page.waitForTimeout(300);

      expect(await confirmDialog.isOpen()).toBe(false);
    });
  });

  test.describe('Multiple open and close cycles', () => {
    test('should handle multiple open and close cycles with proceed', async ({ page }) => {
      const confirmDialog = page.uiComponents.confirmationDialog('confirm-dialog');

      for (let i = 0; i < 3; i++) {
        await page.click('#open-confirm-dialog');
        await page.waitForTimeout(300);

        expect(await confirmDialog.isOpen()).toBe(true);

        await confirmDialog.clickProceed();
        await page.waitForTimeout(300);

        expect(await confirmDialog.isOpen()).toBe(false);
      }
    });

    test('should handle multiple open and close cycles with cancel', async ({ page }) => {
      const confirmDialog = page.uiComponents.confirmationDialog('confirm-dialog');

      for (let i = 0; i < 3; i++) {
        await page.click('#open-confirm-dialog');
        await page.waitForTimeout(300);

        expect(await confirmDialog.isOpen()).toBe(true);

        await confirmDialog.clickCancel();
        await page.waitForTimeout(300);

        expect(await confirmDialog.isOpen()).toBe(false);
      }
    });
  });
});
