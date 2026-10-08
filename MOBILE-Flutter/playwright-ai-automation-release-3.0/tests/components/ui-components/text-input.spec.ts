import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';
import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
test.describe('TextInput Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-text-input.html'));
    await page.waitForLoadState('networkidle');
  });

  test.describe('Auto-detection for SDS component', () => {
    test('should detect SDS component and fill value', async ({ page }) => {
      const textInput = page.uiComponents.textInput('sds-basic');
      await textInput.fill('Hello SDS');
      expect(await textInput.getValue()).toBe('Hello SDS');
    });

    test('should detect SDS component and clear value', async ({ page }) => {
      const textInput = page.uiComponents.textInput('sds-basic');
      await textInput.fill('Test value');
      await textInput.clear();
      expect(await textInput.getValue()).toBe('');
    });

    test('should detect SDS disabled state', async ({ page }) => {
      const textInput = page.uiComponents.textInput('sds-disabled');
      expect(await textInput.isDisabled()).toBe(true);
    });

    test('should detect SDS readonly state', async ({ page }) => {
      const textInput = page.uiComponents.textInput('sds-readonly');
      expect(await textInput.isReadOnly()).toBe(true);
    });
  });

  test.describe('Auto-detection for Legacy UI component', () => {
    test('should detect UI component and fill value', async ({ page }) => {
      const textInput = page.uiComponents.textInput('ui-basic');
      await textInput.fill('Hello UI');
      expect(await textInput.getValue()).toBe('Hello UI');
    });

    test('should detect UI component and clear value', async ({ page }) => {
      const textInput = page.uiComponents.textInput('ui-basic');
      await textInput.fill('Test value');
      await textInput.clear();
      expect(await textInput.getValue()).toBe('');
    });

    test('should detect UI disabled state', async ({ page }) => {
      const textInput = page.uiComponents.textInput('ui-disabled');
      expect(await textInput.isDisabled()).toBe(true);
    });

    test('should detect UI readonly state', async ({ page }) => {
      const textInput = page.uiComponents.textInput('ui-readonly');
      expect(await textInput.isReadOnly()).toBe(true);
    });
  });

  test.describe('Direct namespace access - sdsComponents', () => {
    test('should access SDS component via namespace', async ({ page }) => {
      const textInput = page.uiComponents.sdsComponents.textInput('sds-basic');
      await textInput.fill('Direct SDS');
      expect(await textInput.getValue()).toBe('Direct SDS');
    });

    test('should check disabled state via namespace', async ({ page }) => {
      const textInput = page.uiComponents.sdsComponents.textInput('sds-disabled');
      expect(await textInput.isDisabled()).toBe(true);
    });
  });

  test.describe('Direct namespace access - legacyUi', () => {
    test('should access UI component via namespace', async ({ page }) => {
      const textInput = page.uiComponents.legacyUi.textInput('ui-basic');
      await textInput.fill('Direct UI');
      expect(await textInput.getValue()).toBe('Direct UI');
    });

    test('should check disabled state via namespace', async ({ page }) => {
      const textInput = page.uiComponents.legacyUi.textInput('ui-disabled');
      expect(await textInput.isDisabled()).toBe(true);
    });
  });

  test.describe('Consistent API behavior', () => {
    test('both SDS and UI should have same API for fill and getValue', async ({ page }) => {
      const sdsInput = page.uiComponents.textInput('sds-basic');
      const uiInput = page.uiComponents.textInput('ui-basic');

      await sdsInput.fill('SDS Value');
      await uiInput.fill('UI Value');

      expect(await sdsInput.getValue()).toBe('SDS Value');
      expect(await uiInput.getValue()).toBe('UI Value');
    });

    test('both SDS and UI should have same API for clear', async ({ page }) => {
      const sdsInput = page.uiComponents.textInput('sds-basic');
      const uiInput = page.uiComponents.textInput('ui-basic');

      await sdsInput.fill('SDS');
      await uiInput.fill('UI');

      await sdsInput.clear();
      await uiInput.clear();

      expect(await sdsInput.getValue()).toBe('');
      expect(await uiInput.getValue()).toBe('');
    });

    test('both SDS and UI should have same API for isDisabled', async ({ page }) => {
      const sdsDisabled = page.uiComponents.textInput('sds-disabled');
      const uiDisabled = page.uiComponents.textInput('ui-disabled');
      const sdsEnabled = page.uiComponents.textInput('sds-basic');
      const uiEnabled = page.uiComponents.textInput('ui-basic');

      expect(await sdsDisabled.isDisabled()).toBe(true);
      expect(await uiDisabled.isDisabled()).toBe(true);
      expect(await sdsEnabled.isDisabled()).toBe(false);
      expect(await uiEnabled.isDisabled()).toBe(false);
    });

    test('both SDS and UI should have same API for isReadOnly', async ({ page }) => {
      const sdsReadonly = page.uiComponents.textInput('sds-readonly');
      const uiReadonly = page.uiComponents.textInput('ui-readonly');
      const sdsEditable = page.uiComponents.textInput('sds-basic');
      const uiEditable = page.uiComponents.textInput('ui-basic');

      expect(await sdsReadonly.isReadOnly()).toBe(true);
      expect(await uiReadonly.isReadOnly()).toBe(true);
      expect(await sdsEditable.isReadOnly()).toBe(false);
      expect(await uiEditable.isReadOnly()).toBe(false);
    });
  });

  test.describe('TextArea variant', () => {
    test('SDS textarea should work with wrapper', async ({ page }) => {
      const textInput = page.uiComponents.textInput('sds-textarea');
      await textInput.fill('Multi-line\ntext');
      expect(await textInput.getValue()).toBe('Multi-line\ntext');
    });

    test('UI textarea should work with wrapper', async ({ page }) => {
      const textInput = page.uiComponents.textInput('ui-textarea');
      await textInput.fill('Multi-line\ntext');
      expect(await textInput.getValue()).toBe('Multi-line\ntext');
    });
  });
});
