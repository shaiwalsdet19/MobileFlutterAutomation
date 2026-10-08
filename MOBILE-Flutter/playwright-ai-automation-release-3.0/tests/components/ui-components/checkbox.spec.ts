import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

test.describe('CheckboxGroup Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-checkbox.html'));
    await page.waitForLoadState('networkidle');
  });

  test.describe('Auto-detection for SDS component', () => {
    test('should get empty value initially', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      expect(await checkbox.getValue()).toEqual([]);
    });

    test('should check option and get value', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      await checkbox.checkOption('Sports');
      expect(await checkbox.getValue()).not.toEqual([]);
    });

    test('should uncheck option', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      await checkbox.checkOption('Sports');
      await checkbox.uncheckOption('Sports');
      expect(await checkbox.getValue()).toEqual([]);
    });

    test('should select multiple options', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      await checkbox.selectOptions(['Sports', 'Music']);
      expect(await checkbox.areOptionsSelected(['Sports', 'Music'])).toBe(true);
    });

    test('should check if option is checked', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      await checkbox.checkOption('Reading');
      expect(await checkbox.isOptionChecked('Reading')).toBe(true);
      expect(await checkbox.isOptionChecked('Sports')).toBe(false);
    });

    test('should detect SDS disabled state', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-disabled');
      expect(await checkbox.isDisabled()).toBe(true);
    });

    test('should check read-only state is false for basic', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      expect(await checkbox.isReadOnly()).toBe(false);
    });

    test('should filter options with search', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-search');
      await checkbox.search('Apple');
      await expect(checkbox.getOptionInput('Apple')).toBeVisible();
    });

    test('should confirm areOptionsSelected with selected label', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      await checkbox.checkOption('Music');
      expect(await checkbox.areOptionsSelected('Music')).toBe(true);
    });

    test('getSelectedValues should match getValue', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      await checkbox.checkOption('Sports');
      const value = await checkbox.getValue();
      const selectedValues = await checkbox.getSelectedValues();
      expect(selectedValues).toEqual(value);
    });
  });

  test.describe('Auto-detection for Legacy UI component', () => {
    test('should get empty value initially', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');
      expect(await checkbox.getValue()).toEqual([]);
    });

    test('should check option and get value', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');
      await checkbox.checkOption('Sports');
      expect(await checkbox.getValue()).not.toEqual([]);
    });

    test('should uncheck option', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');
      await checkbox.checkOption('Sports');
      await checkbox.uncheckOption('Sports');
      expect(await checkbox.getValue()).toEqual([]);
    });

    test('should select multiple options', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');
      await checkbox.selectOptions(['Sports', 'Music']);
      expect(await checkbox.areOptionsSelected(['Sports', 'Music'])).toBe(true);
    });

    test('should check if option is checked', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');
      await checkbox.checkOption('Reading');
      expect(await checkbox.isOptionChecked('Reading')).toBe(true);
      expect(await checkbox.isOptionChecked('Sports')).toBe(false);
    });

    test('should detect UI disabled state', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('ui-checkbox-disabled');
      expect(await checkbox.isDisabled()).toBe(true);
    });

    test('should check read-only state is false for basic', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');
      expect(await checkbox.isReadOnly()).toBe(false);
    });

    test('should filter options with search', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('ui-checkbox-search');
      await checkbox.search('Apple');
      await expect(checkbox.getOptionInput('Apple')).toBeVisible();
    });

    test('should confirm areOptionsSelected with selected label', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');
      await checkbox.checkOption('Music');
      expect(await checkbox.areOptionsSelected('Music')).toBe(true);
    });
  });

  test.describe('Direct namespace access - sdsComponents', () => {
    test('should access SDS component via namespace', async ({ page }) => {
      const checkbox = page.uiComponents.sdsComponents.checkboxGroup('sds-checkbox-basic');
      await checkbox.checkOption('Sports');
      expect(await checkbox.isOptionChecked('Sports')).toBe(true);
    });

    test('should check disabled state via namespace', async ({ page }) => {
      const checkbox = page.uiComponents.sdsComponents.checkboxGroup('sds-checkbox-disabled');
      expect(await checkbox.isDisabled()).toBe(true);
    });
  });

  test.describe('Direct namespace access - legacyUi', () => {
    test('should access UI component via namespace', async ({ page }) => {
      const checkbox = page.uiComponents.legacyUi.checkboxGroup('ui-checkbox-basic');
      await checkbox.checkOption('Sports');
      expect(await checkbox.isOptionChecked('Sports')).toBe(true);
    });

    test('should check disabled state via namespace', async ({ page }) => {
      const checkbox = page.uiComponents.legacyUi.checkboxGroup('ui-checkbox-disabled');
      expect(await checkbox.isDisabled()).toBe(true);
    });
  });

  test.describe('Consistent API behavior', () => {
    test('both SDS and UI should have same checkOption/getValue API', async ({ page }) => {
      const sdsCheckbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      const uiCheckbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');

      await sdsCheckbox.checkOption('Sports');
      await uiCheckbox.checkOption('Sports');

      expect(await sdsCheckbox.isOptionChecked('Sports')).toBe(true);
      expect(await uiCheckbox.isOptionChecked('Sports')).toBe(true);
    });

    test('both SDS and UI should return empty array for no selection', async ({ page }) => {
      const sdsCheckbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      const uiCheckbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');

      expect(await sdsCheckbox.getValue()).toEqual([]);
      expect(await uiCheckbox.getValue()).toEqual([]);
    });

    test('selectOptions should work consistently for both', async ({ page }) => {
      const sdsCheckbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      const uiCheckbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');

      await sdsCheckbox.selectOptions(['Sports', 'Music']);
      await uiCheckbox.selectOptions(['Sports', 'Music']);

      expect(await sdsCheckbox.areOptionsSelected(['Sports', 'Music'])).toBe(true);
      expect(await uiCheckbox.areOptionsSelected(['Sports', 'Music'])).toBe(true);
    });
  });

  test.describe('Locator helpers', () => {
    test('getHost should return a valid locator for SDS', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      await expect(checkbox.getHost()).toBeAttached();
    });

    test('getHost should return a valid locator for UI', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');
      await expect(checkbox.getHost()).toBeAttached();
    });

    test('getOptionInput should return input element for SDS', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      await expect(checkbox.getOptionInput('Sports')).toBeAttached();
    });

    test('getOptionInput should return input element for UI', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');
      await expect(checkbox.getOptionInput('Sports')).toBeAttached();
    });

    test('getOption should resolve to input element for SDS', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      await expect(checkbox.getOption('Sports')).toBeAttached();
    });

    test('getOption should resolve to input element for UI', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');
      await expect(checkbox.getOption('Sports')).toBeAttached();
    });

    test('getSelectAllInput should return select-all input for SDS', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('sds-checkbox-basic');
      await expect(checkbox.getSelectAllInput()).toBeAttached();
    });

    test('getSelectAllInput should return select-all input for UI', async ({ page }) => {
      const checkbox = page.uiComponents.checkboxGroup('ui-checkbox-basic');
      await expect(checkbox.getSelectAllInput()).toBeAttached();
    });
  });
});
