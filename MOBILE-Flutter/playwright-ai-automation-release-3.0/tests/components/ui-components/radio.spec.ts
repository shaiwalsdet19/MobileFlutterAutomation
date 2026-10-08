import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

test.describe('RadioGroup Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-radio.html'));
    await page.waitForLoadState('networkidle');
  });

  test.describe('Auto-detection for SDS component', () => {
    test('should get null value initially', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('sds-radio-basic');
      expect(await radio.getValue()).toBeNull();
    });

    test('should select option and get value', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('sds-radio-basic');
      await radio.selectOption('Male');
      expect(await radio.getValue()).toBe('male');
    });

    test('should change selection', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('sds-radio-basic');
      await radio.selectOption('Male');
      await radio.selectOption('Female');
      expect(await radio.getValue()).toBe('female');
    });

    test('should check if option is selected', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('sds-radio-basic');
      await radio.selectOption('Other');
      expect(await radio.isOptionSelected('Other')).toBe(true);
      expect(await radio.isOptionSelected('Male')).toBe(false);
    });

    test('should detect SDS disabled state', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('sds-radio-disabled');
      expect(await radio.isDisabled()).toBe(true);
    });

    test('should check read-only state is false for basic', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('sds-radio-basic');
      expect(await radio.isReadOnly()).toBe(false);
    });

    test('should filter options with search', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('sds-radio-search');
      await radio.search('Apple');
      await expect(radio.getOptionInput('Apple')).toBeVisible();
    });

    test('should confirm areOptionsSelected with selected label', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('sds-radio-basic');
      await radio.selectOption('Female');
      expect(await radio.areOptionsSelected('Female')).toBe(true);
    });
  });

  test.describe('Auto-detection for Legacy UI component', () => {
    test('should get null value initially', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('ui-radio-basic');
      expect(await radio.getValue()).toBeNull();
    });

    test('should select option and get value', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('ui-radio-basic');
      await radio.selectOption('Male');
      expect(await radio.getValue()).toBe('male');
    });

    test('should change selection', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('ui-radio-basic');
      await radio.selectOption('Male');
      await radio.selectOption('Female');
      expect(await radio.getValue()).toBe('female');
    });

    test('should check if option is selected', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('ui-radio-basic');
      await radio.selectOption('Other');
      expect(await radio.isOptionSelected('Other')).toBe(true);
      expect(await radio.isOptionSelected('Male')).toBe(false);
    });

    test('should detect UI disabled state', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('ui-radio-disabled');
      expect(await radio.isDisabled()).toBe(true);
    });

    test('should check read-only state is false for basic', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('ui-radio-basic');
      expect(await radio.isReadOnly()).toBe(false);
    });

    test('should filter options with search', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('ui-radio-search');
      await radio.search('Apple');
      await expect(radio.getOptionInput('Apple')).toBeVisible();
    });

    test('should confirm areOptionsSelected with selected label', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('ui-radio-basic');
      await radio.selectOption('Female');
      expect(await radio.areOptionsSelected('Female')).toBe(true);
    });
  });

  test.describe('Direct namespace access - sdsComponents', () => {
    test('should access SDS component via namespace', async ({ page }) => {
      const radio = page.uiComponents.sdsComponents.radioGroup('sds-radio-basic');
      await radio.selectOption('Male');
      expect(await radio.getValue()).toBe('male');
    });

    test('should check disabled state via namespace', async ({ page }) => {
      const radio = page.uiComponents.sdsComponents.radioGroup('sds-radio-disabled');
      expect(await radio.isDisabled()).toBe(true);
    });
  });

  test.describe('Direct namespace access - legacyUi', () => {
    test('should access UI component via namespace', async ({ page }) => {
      const radio = page.uiComponents.legacyUi.radioGroup('ui-radio-basic');
      await radio.selectOption('Male');
      expect(await radio.getValue()).toBe('male');
    });

    test('should check disabled state via namespace', async ({ page }) => {
      const radio = page.uiComponents.legacyUi.radioGroup('ui-radio-disabled');
      expect(await radio.isDisabled()).toBe(true);
    });
  });

  test.describe('Consistent API behavior', () => {
    test('both SDS and UI should have same selectOption/getValue API', async ({ page }) => {
      const sdsRadio = page.uiComponents.radioGroup('sds-radio-basic');
      const uiRadio = page.uiComponents.radioGroup('ui-radio-basic');

      await sdsRadio.selectOption('Male');
      await uiRadio.selectOption('Male');

      expect(await sdsRadio.getValue()).toBe('male');
      expect(await uiRadio.getValue()).toBe('male');
    });

    test('both SDS and UI should return null for no selection', async ({ page }) => {
      const sdsRadio = page.uiComponents.radioGroup('sds-radio-basic');
      const uiRadio = page.uiComponents.radioGroup('ui-radio-basic');

      expect(await sdsRadio.getValue()).toBeNull();
      expect(await uiRadio.getValue()).toBeNull();
    });

    test('getSelectedValue should match getValue for both', async ({ page }) => {
      const sdsRadio = page.uiComponents.radioGroup('sds-radio-basic');
      await sdsRadio.selectOption('Other');
      expect(await sdsRadio.getSelectedValue()).toBe(await sdsRadio.getValue());

      const uiRadio = page.uiComponents.radioGroup('ui-radio-basic');
      await uiRadio.selectOption('Other');
      expect(await uiRadio.getSelectedValue()).toBe(await uiRadio.getValue());
    });
  });

  test.describe('Locator helpers', () => {
    test('getHost should return a valid locator for SDS', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('sds-radio-basic');
      await expect(radio.getHost()).toBeAttached();
    });

    test('getHost should return a valid locator for UI', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('ui-radio-basic');
      await expect(radio.getHost()).toBeAttached();
    });

    test('getOptionInput should return input element for SDS', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('sds-radio-basic');
      await expect(radio.getOptionInput('Male')).toBeAttached();
    });

    test('getOptionInput should return input element for UI', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('ui-radio-basic');
      await expect(radio.getOptionInput('Male')).toBeAttached();
    });

    test('getOption should resolve to input element for SDS', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('sds-radio-basic');
      await expect(radio.getOption('Male')).toBeAttached();
    });

    test('getOption should resolve to input element for UI', async ({ page }) => {
      const radio = page.uiComponents.radioGroup('ui-radio-basic');
      await expect(radio.getOption('Male')).toBeAttached();
    });
  });
});
