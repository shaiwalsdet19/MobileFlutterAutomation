import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

test.describe('NumericInput Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-numeric-input.html'));
    await page.waitForLoadState('networkidle');
  });

  test.describe('Auto-detection for SDS component', () => {
    test('should detect SDS component and fill value', async ({ page }) => {
      const numericInput = page.uiComponents.numericInput('sds-numeric-basic');
      await numericInput.fill(123);
      await numericInput.blur();
      expect(await numericInput.getValue()).toBe(123);
    });

    test('should detect SDS component and clear value', async ({ page }) => {
      const numericInput = page.uiComponents.numericInput('sds-numeric-basic');
      await numericInput.fill(456);
      await numericInput.blur();
      await numericInput.clear();
      await numericInput.blur();
      expect(await numericInput.getValue()).toBe(undefined);
    });

    test('should detect SDS disabled state', async ({ page }) => {
      const numericInput = page.uiComponents.numericInput('sds-numeric-disabled');
      expect(await numericInput.isDisabled()).toBe(true);
    });

    test('should detect SDS readonly state', async ({ page }) => {
      const numericInput = page.uiComponents.numericInput('sds-numeric-readonly');
      expect(await numericInput.isReadOnly()).toBe(true);
    });
  });

  test.describe('Auto-detection for Legacy UI component', () => {
    test('should detect UI component and fill value', async ({ page }) => {
      const numericInput = page.uiComponents.numericInput('ui-numeric-basic');
      await numericInput.fill(789);
      await numericInput.blur();
      expect(await numericInput.getValue()).toBe(789);
    });

    test('should detect UI component and clear value', async ({ page }) => {
      const numericInput = page.uiComponents.numericInput('ui-numeric-basic');
      await numericInput.fill(100);
      await numericInput.blur();
      await numericInput.clear();
      await numericInput.blur();
      expect(await numericInput.getValue()).toBe(undefined);
    });

    test('should detect UI disabled state', async ({ page }) => {
      const numericInput = page.uiComponents.numericInput('ui-numeric-disabled');
      expect(await numericInput.isDisabled()).toBe(true);
    });

    test('should detect UI readonly state', async ({ page }) => {
      const numericInput = page.uiComponents.numericInput('ui-numeric-readonly');
      expect(await numericInput.isReadOnly()).toBe(true);
    });
  });

  test.describe('Direct namespace access - sdsComponents', () => {
    test('should access SDS component via namespace', async ({ page }) => {
      const numericInput = page.uiComponents.sdsComponents.numericInput('sds-numeric-basic');
      await numericInput.fill(555);
      await numericInput.blur();
      expect(await numericInput.getValue()).toBe(555);
    });

    test('should check disabled state via namespace', async ({ page }) => {
      const numericInput = page.uiComponents.sdsComponents.numericInput('sds-numeric-disabled');
      expect(await numericInput.isDisabled()).toBe(true);
    });
  });

  test.describe('Direct namespace access - legacyUi', () => {
    test('should access UI component via namespace', async ({ page }) => {
      const numericInput = page.uiComponents.legacyUi.numericInput('ui-numeric-basic');
      await numericInput.fill(666);
      await numericInput.blur();
      expect(await numericInput.getValue()).toBe(666);
    });

    test('should check disabled state via namespace', async ({ page }) => {
      const numericInput = page.uiComponents.legacyUi.numericInput('ui-numeric-disabled');
      expect(await numericInput.isDisabled()).toBe(true);
    });
  });

  test.describe('Consistent API behavior', () => {
    test('both SDS and UI should have same API for fill and getValue', async ({ page }) => {
      const sdsInput = page.uiComponents.numericInput('sds-numeric-basic');
      const uiInput = page.uiComponents.numericInput('ui-numeric-basic');

      await sdsInput.fill(111);
      await sdsInput.blur();
      await uiInput.fill(222);
      await uiInput.blur();

      expect(await sdsInput.getValue()).toBe(111);
      expect(await uiInput.getValue()).toBe(222);
    });

    test('both SDS and UI should have same API for clear', async ({ page }) => {
      const sdsInput = page.uiComponents.numericInput('sds-numeric-basic');
      const uiInput = page.uiComponents.numericInput('ui-numeric-basic');

      await sdsInput.fill(100);
      await sdsInput.blur();
      await uiInput.fill(200);
      await uiInput.blur();

      await sdsInput.clear();
      await sdsInput.blur();
      await uiInput.clear();
      await uiInput.blur();

      expect(await sdsInput.getValue()).toBe(undefined);
      expect(await uiInput.getValue()).toBe(undefined);
    });

    test('both SDS and UI should have same API for isDisabled', async ({ page }) => {
      const sdsDisabled = page.uiComponents.numericInput('sds-numeric-disabled');
      const uiDisabled = page.uiComponents.numericInput('ui-numeric-disabled');
      const sdsEnabled = page.uiComponents.numericInput('sds-numeric-basic');
      const uiEnabled = page.uiComponents.numericInput('ui-numeric-basic');

      expect(await sdsDisabled.isDisabled()).toBe(true);
      expect(await uiDisabled.isDisabled()).toBe(true);
      expect(await sdsEnabled.isDisabled()).toBe(false);
      expect(await uiEnabled.isDisabled()).toBe(false);
    });

    test('both SDS and UI should have same API for isReadOnly', async ({ page }) => {
      const sdsReadonly = page.uiComponents.numericInput('sds-numeric-readonly');
      const uiReadonly = page.uiComponents.numericInput('ui-numeric-readonly');
      const sdsEditable = page.uiComponents.numericInput('sds-numeric-basic');
      const uiEditable = page.uiComponents.numericInput('ui-numeric-basic');

      expect(await sdsReadonly.isReadOnly()).toBe(true);
      expect(await uiReadonly.isReadOnly()).toBe(true);
      expect(await sdsEditable.isReadOnly()).toBe(false);
      expect(await uiEditable.isReadOnly()).toBe(false);
    });
  });

  test.describe('Focus and Blur operations', () => {
    test('should support focus and blur for SDS', async ({ page }) => {
      const numericInput = page.uiComponents.numericInput('sds-numeric-basic');
      await numericInput.focus();
      await numericInput.fill(999);
      await numericInput.blur();
      expect(await numericInput.getValue()).toBe(999);
    });

    test('should support focus and blur for UI', async ({ page }) => {
      const numericInput = page.uiComponents.numericInput('ui-numeric-basic');
      await numericInput.focus();
      await numericInput.fill(888);
      await numericInput.blur();
      expect(await numericInput.getValue()).toBe(888);
    });
  });
});
