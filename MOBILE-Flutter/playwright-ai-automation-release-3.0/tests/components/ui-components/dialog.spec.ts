import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';

test.describe('DialogUtils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3333/playwright-dialog.html');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Dialog with Primary and Secondary buttons', () => {
    test('should open dialog when trigger is clicked', async ({ page }) => {
      const dialog = page.uiComponents.dialog('dialog-both');

      const initialState = await dialog.isOpen();
      expect(initialState).toBe(false);

      await page.click('#open-dialog-both');
      await page.waitForTimeout(300);

      const openState = await dialog.isOpen();
      expect(openState).toBe(true);
    });

    test('should close dialog when close button is clicked', async ({ page }) => {
      const dialog = page.uiComponents.dialog('dialog-both');

      await page.click('#open-dialog-both');
      await page.waitForTimeout(300);

      const openState = await dialog.isOpen();
      expect(openState).toBe(true);

      await dialog.clickClose();
      await page.waitForTimeout(300);

      const closedState = await dialog.isOpen();
      expect(closedState).toBe(false);

    });

    test('should close dialog when primary button is clicked', async ({ page }) => {
      const dialog = page.uiComponents.dialog('dialog-both');

      await page.click('#open-dialog-both');
      await page.waitForTimeout(300);

      expect(await dialog.isOpen()).toBe(true);

      await dialog.clickPrimary();
      await page.waitForTimeout(300);

      expect(await dialog.isOpen()).toBe(false);
    });

    test('should close dialog when secondary button is clicked', async ({ page }) => {
      const dialog = page.uiComponents.dialog('dialog-both');

      await page.click('#open-dialog-both');
      await page.waitForTimeout(300);

      expect(await dialog.isOpen()).toBe(true);

      await dialog.clickSecondary();
      await page.waitForTimeout(300);

      expect(await dialog.isOpen()).toBe(false);
    });

    test('should have visible primary and secondary buttons', async ({ page }) => {
      const dialog = page.uiComponents.dialog('dialog-both');

      await page.click('#open-dialog-both');
      await page.waitForTimeout(300);

      await expect(dialog.getPrimaryButton()).toBeVisible();
      await expect(dialog.getSecondaryButton()).toBeVisible();
      await expect(dialog.getCloseButton()).toBeVisible();
    });
  });

  test.describe('Dialog with Primary button only', () => {
    test('should open and close with primary button', async ({ page }) => {
      const dialog = page.uiComponents.dialog('dialog-primary');

      await page.click('#open-dialog-primary');
      await page.waitForTimeout(300);

      expect(await dialog.isOpen()).toBe(true);

      await dialog.clickPrimary();
      await page.waitForTimeout(300);

      expect(await dialog.isOpen()).toBe(false);
    });

    test('should have visible primary button only', async ({ page }) => {
      const dialog = page.uiComponents.dialog('dialog-primary');

      await page.click('#open-dialog-primary');
      await page.waitForTimeout(300);

      await expect(dialog.getPrimaryButton()).toBeVisible();
      await expect(dialog.getCloseButton()).toBeVisible();
    });
  });

  test.describe('Show and Hide methods', () => {
    test('should show dialog programmatically', async ({ page }) => {
      const dialog = page.uiComponents.dialog('dialog-both');

      expect(await dialog.isOpen()).toBe(false);

      await dialog.show();
      await page.waitForTimeout(300);

      expect(await dialog.isOpen()).toBe(true);
    });

    test('should hide dialog programmatically', async ({ page }) => {
      const dialog = page.uiComponents.dialog('dialog-both');

      await dialog.show();
      await page.waitForTimeout(300);

      expect(await dialog.isOpen()).toBe(true);

      await dialog.hide();
      await page.waitForTimeout(300);

      expect(await dialog.isOpen()).toBe(false);
    });

    test('should not show again if already open', async ({ page }) => {
      const dialog = page.uiComponents.dialog('dialog-both');

      await dialog.show();
      await page.waitForTimeout(300);

      expect(await dialog.isOpen()).toBe(true);

      await dialog.show();
      await page.waitForTimeout(100);

      expect(await dialog.isOpen()).toBe(true);
    });
  });
});
