import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

// Options seeded in the test harness
const FIRST_OPTION = 'Option 001';
const MIDDLE_OPTION = 'Option 050';
const LAST_OPTION = 'Option 100';

const SMALL_FIRST = 'Alpha';
const SMALL_LAST = 'Epsilon';

test.describe('Dropdown Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-dropdown.html'));
    await page.waitForLoadState('networkidle');
  });

  // ---------------------------------------------------------------------------
  // SDS — Single select, no search
  // ---------------------------------------------------------------------------
  test.describe('SDS | Single | No Search', () => {
    test('should open and close', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-single-nosearch');
      expect(await dd.isOpen()).toBe(false);
      await dd.open();
      expect(await dd.isOpen()).toBe(true);
      await dd.close();
      expect(await dd.isOpen()).toBe(false);
    });

    test('should select first option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-single-nosearch');
      await dd.selectOption(SMALL_FIRST);
      expect(await dd.areOptionsSelected(SMALL_FIRST)).toBe(true);
    });

    test('should select last option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-single-nosearch');
      await dd.selectOption(SMALL_LAST);
      expect(await dd.areOptionsSelected(SMALL_LAST)).toBe(true);
    });

    test('should replace selection on second pick', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-single-nosearch');
      await dd.selectOption(SMALL_FIRST);
      await dd.selectOption('Beta');
      expect(await dd.areOptionsSelected('Beta')).toBe(true);
      expect(await dd.areOptionsSelected(SMALL_FIRST)).toBe(false);
    });

    test('getOption locator should be attached after open', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-single-nosearch');
      await dd.open();
      await expect(dd.getOption(SMALL_FIRST)).toBeAttached();
      await dd.close();
    });
  });

  // ---------------------------------------------------------------------------
  // SDS — Single select, with search, 100 options
  // ---------------------------------------------------------------------------
  test.describe('SDS | Single | With Search | 100 options', () => {
    test('should select first option (Option 001)', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-single-search');
      await dd.selectOption(FIRST_OPTION);
      expect(await dd.areOptionsSelected(FIRST_OPTION)).toBe(true);
    });

    test('should scroll and select middle option (Option 050)', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-single-search');
      await dd.selectOption(MIDDLE_OPTION);
      expect(await dd.areOptionsSelected(MIDDLE_OPTION)).toBe(true);
    });

    test('should scroll and select last option (Option 100)', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-single-search');
      await dd.selectOption(LAST_OPTION);
      expect(await dd.areOptionsSelected(LAST_OPTION)).toBe(true);
    });

    test('should search and select first option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-single-search');
      await dd.search('Option 001');
      await expect(dd.getOption(FIRST_OPTION)).toBeVisible();
      await dd.getOption(FIRST_OPTION).click();
      expect(await dd.areOptionsSelected(FIRST_OPTION)).toBe(true);
    });

    test('should search and select middle option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-single-search');
      await dd.search('Option 050');
      await expect(dd.getOption(MIDDLE_OPTION)).toBeVisible();
      await dd.getOption(MIDDLE_OPTION).click();
      expect(await dd.areOptionsSelected(MIDDLE_OPTION)).toBe(true);
    });

    test('should search and select last option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-single-search');
      await dd.search('Option 100');
      await expect(dd.getOption(LAST_OPTION)).toBeVisible();
      await dd.getOption(LAST_OPTION).click();
      expect(await dd.areOptionsSelected(LAST_OPTION)).toBe(true);
    });

    test('should clear search and show all options again', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-single-search');
      await dd.search('Option 050');
      await dd.clearSearch();
      await expect(dd.getOption(FIRST_OPTION)).toBeAttached();
    });
  });

  // ---------------------------------------------------------------------------
  // SDS — Multi select, no search
  // ---------------------------------------------------------------------------
  test.describe('SDS | Multi | No Search', () => {
    test('should select first and last options', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-multi-nosearch');
      await dd.selectOptions([SMALL_FIRST, SMALL_LAST]);
      expect(await dd.areOptionsSelected([SMALL_FIRST, SMALL_LAST])).toBe(true);
    });

    test('should deselect an option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-multi-nosearch');
      await dd.selectOption(SMALL_FIRST);
      await dd.deselectOption(SMALL_FIRST);
      expect(await dd.areOptionsSelected(SMALL_FIRST)).toBe(false);
    });

    test('should select all options', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-multi-nosearch');
      await dd.open();
      await dd.selectAll();
      const selected = await dd.getSelectedOptions();
      expect(selected.length).toBe(5);
    });
  });

  // ---------------------------------------------------------------------------
  // SDS — Multi select, with search, 100 options
  // ---------------------------------------------------------------------------
  test.describe('SDS | Multi | With Search | 100 options', () => {
    test('should select first option (Option 001)', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-multi-search');
      await dd.selectOption(FIRST_OPTION);
      expect(await dd.areOptionsSelected(FIRST_OPTION)).toBe(true);
    });

    test('should scroll and select middle option (Option 050)', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-multi-search');
      await dd.selectOption(MIDDLE_OPTION);
      expect(await dd.areOptionsSelected(MIDDLE_OPTION)).toBe(true);
    });

    test('should scroll and select last option (Option 100)', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-multi-search');
      await dd.selectOption(LAST_OPTION);
      expect(await dd.areOptionsSelected(LAST_OPTION)).toBe(true);
    });

    test('should search and select first option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-multi-search');
      await dd.search('Option 001');
      await expect(dd.getOption(FIRST_OPTION)).toBeVisible();
      await dd.getOption(FIRST_OPTION).click();
      expect(await dd.areOptionsSelected(FIRST_OPTION)).toBe(true);
    });

    test('should search and select middle option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-multi-search');
      await dd.search('Option 050');
      await expect(dd.getOption(MIDDLE_OPTION)).toBeVisible();
      await dd.getOption(MIDDLE_OPTION).click();
      expect(await dd.areOptionsSelected(MIDDLE_OPTION)).toBe(true);
    });

    test('should search and select last option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-multi-search');
      await dd.search('Option 100');
      await expect(dd.getOption(LAST_OPTION)).toBeVisible();
      await dd.getOption(LAST_OPTION).click();
      expect(await dd.areOptionsSelected(LAST_OPTION)).toBe(true);
    });

    test('should select first, middle and last via selectOptions', async ({ page }) => {
      const dd = page.uiComponents.dropdown('sds-dropdown-multi-search');
      await dd.selectOptions([FIRST_OPTION, MIDDLE_OPTION, LAST_OPTION]);
      expect(await dd.areOptionsSelected([FIRST_OPTION, MIDDLE_OPTION, LAST_OPTION])).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // SDS — Disabled
  // ---------------------------------------------------------------------------
  test.describe('SDS | Disabled', () => {
    test('should detect disabled state', async ({ page }) => {
      expect(await page.uiComponents.dropdown('sds-dropdown-disabled').isDisabled()).toBe(true);
    });

    test('should return false for read-only on non-readonly dropdown', async ({ page }) => {
      expect(await page.uiComponents.dropdown('sds-dropdown-single-nosearch').isReadOnly()).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Legacy UI — Single select, no search
  // ---------------------------------------------------------------------------
  test.describe('UI | Single | No Search', () => {
    test('should open and close', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-single-nosearch');
      expect(await dd.isOpen()).toBe(false);
      await dd.open();
      expect(await dd.isOpen()).toBe(true);
      await dd.close();
      expect(await dd.isOpen()).toBe(false);
    });

    test('should select first option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-single-nosearch');
      await dd.selectOption(SMALL_FIRST);
      expect(await dd.areOptionsSelected(SMALL_FIRST)).toBe(true);
    });

    test('should select last option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-single-nosearch');
      await dd.selectOption(SMALL_LAST);
      expect(await dd.areOptionsSelected(SMALL_LAST)).toBe(true);
    });

    test('should replace selection on second pick', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-single-nosearch');
      await dd.selectOption(SMALL_FIRST);
      await dd.selectOption('Beta');
      expect(await dd.areOptionsSelected('Beta')).toBe(true);
    });

    test('getOption locator should be attached after open', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-single-nosearch');
      await dd.open();
      await expect(dd.getOption(SMALL_FIRST)).toBeAttached();
      await dd.close();
    });
  });

  // ---------------------------------------------------------------------------
  // Legacy UI — Single select, with search, 100 options
  // ---------------------------------------------------------------------------
  test.describe('UI | Single | With Search | 100 options', () => {
    test('should select first option (Option 001)', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-single-search');
      await dd.selectOption(FIRST_OPTION);
      expect(await dd.areOptionsSelected(FIRST_OPTION)).toBe(true);
    });

    test('should scroll and select middle option (Option 050)', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-single-search');
      await dd.selectOption(MIDDLE_OPTION);
      expect(await dd.areOptionsSelected(MIDDLE_OPTION)).toBe(true);
    });

    test('should scroll and select last option (Option 100)', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-single-search');
      await dd.selectOption(LAST_OPTION);
      expect(await dd.areOptionsSelected(LAST_OPTION)).toBe(true);
    });

    test('should search and select first option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-single-search');
      await dd.search('Option 001');
      await expect(dd.getOption(FIRST_OPTION)).toBeVisible();
      await dd.getOption(FIRST_OPTION).click();
      expect(await dd.areOptionsSelected(FIRST_OPTION)).toBe(true);
    });

    test('should search and select middle option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-single-search');
      await dd.search('Option 050');
      await expect(dd.getOption(MIDDLE_OPTION)).toBeVisible();
      await dd.getOption(MIDDLE_OPTION).click();
      expect(await dd.areOptionsSelected(MIDDLE_OPTION)).toBe(true);
    });

    test('should search and select last option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-single-search');
      await dd.search('Option 100');
      await expect(dd.getOption(LAST_OPTION)).toBeVisible();
      await dd.getOption(LAST_OPTION).click();
      expect(await dd.areOptionsSelected(LAST_OPTION)).toBe(true);
    });

    test('should clear search and restore full list', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-single-search');
      await dd.search('Option 050');
      await dd.clearSearch();
      await expect(dd.getOption(FIRST_OPTION)).toBeAttached();
    });
  });

  // ---------------------------------------------------------------------------
  // Legacy UI — Multi select, no search
  // ---------------------------------------------------------------------------
  test.describe('UI | Multi | No Search', () => {
    test('should select first and last options', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-multi-nosearch');
      await dd.selectOptions([SMALL_FIRST, SMALL_LAST]);
      expect(await dd.areOptionsSelected([SMALL_FIRST, SMALL_LAST])).toBe(true);
    });

    test('should deselect an option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-multi-nosearch');
      await dd.selectOption(SMALL_FIRST);
      await dd.deselectOption(SMALL_FIRST);
      expect(await dd.areOptionsSelected(SMALL_FIRST)).toBe(false);
    });

    test('should select all options', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-multi-nosearch');
      await dd.open();
      await dd.selectAll();
      const selected = await dd.getSelectedOptions();
      expect(selected.length).toBe(5);
    });
  });

  // ---------------------------------------------------------------------------
  // Legacy UI — Multi select, with search, 100 options
  // ---------------------------------------------------------------------------
  test.describe('UI | Multi | With Search | 100 options', () => {
    test('should select first option (Option 001)', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-multi-search');
      await dd.selectOption(FIRST_OPTION);
      expect(await dd.areOptionsSelected(FIRST_OPTION)).toBe(true);
    });

    test('should scroll and select middle option (Option 050)', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-multi-search');
      await dd.selectOption(MIDDLE_OPTION);
      expect(await dd.areOptionsSelected(MIDDLE_OPTION)).toBe(true);
    });

    test('should scroll and select last option (Option 100)', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-multi-search');
      await dd.selectOption(LAST_OPTION);
      expect(await dd.areOptionsSelected(LAST_OPTION)).toBe(true);
    });

    test('should search and select first option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-multi-search');
      await dd.search('Option 001');
      await expect(dd.getOption(FIRST_OPTION)).toBeVisible();
      await dd.getOption(FIRST_OPTION).click();
      expect(await dd.areOptionsSelected(FIRST_OPTION)).toBe(true);
    });

    test('should search and select middle option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-multi-search');
      await dd.search('Option 050');
      await expect(dd.getOption(MIDDLE_OPTION)).toBeVisible();
      await dd.getOption(MIDDLE_OPTION).click();
      expect(await dd.areOptionsSelected(MIDDLE_OPTION)).toBe(true);
    });

    test('should search and select last option', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-multi-search');
      await dd.search('Option 100');
      await expect(dd.getOption(LAST_OPTION)).toBeVisible();
      await dd.getOption(LAST_OPTION).click();
      expect(await dd.areOptionsSelected(LAST_OPTION)).toBe(true);
    });

    test('should select first, middle and last via selectOptions', async ({ page }) => {
      const dd = page.uiComponents.dropdown('ui-dropdown-multi-search');
      await dd.selectOptions([FIRST_OPTION, MIDDLE_OPTION, LAST_OPTION]);
      expect(await dd.areOptionsSelected([FIRST_OPTION, MIDDLE_OPTION, LAST_OPTION])).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // Legacy UI — Disabled
  // ---------------------------------------------------------------------------
  test.describe('UI | Disabled', () => {
    test('should detect disabled state', async ({ page }) => {
      expect(await page.uiComponents.dropdown('ui-dropdown-disabled').isDisabled()).toBe(true);
    });

    test('should return false for read-only on non-readonly dropdown', async ({ page }) => {
      expect(await page.uiComponents.dropdown('ui-dropdown-single-nosearch').isReadOnly()).toBe(false);
    });
  });

  // ---------------------------------------------------------------------------
  // Namespace access
  // ---------------------------------------------------------------------------
  test.describe('Direct namespace access', () => {
    test('sdsComponents.dropdown should select option', async ({ page }) => {
      const dd = page.uiComponents.sdsComponents.dropdown('sds-dropdown-single-nosearch');
      await dd.selectOption(SMALL_FIRST);
      expect(await dd.areOptionsSelected(SMALL_FIRST)).toBe(true);
    });

    test('legacyUi.dropdown should select option', async ({ page }) => {
      const dd = page.uiComponents.legacyUi.dropdown('ui-dropdown-single-nosearch');
      await dd.selectOption(SMALL_FIRST);
      expect(await dd.areOptionsSelected(SMALL_FIRST)).toBe(true);
    });

    test('sdsComponents.dropdown should detect disabled', async ({ page }) => {
      expect(await page.uiComponents.sdsComponents.dropdown('sds-dropdown-disabled').isDisabled()).toBe(true);
    });

    test('legacyUi.dropdown should detect disabled', async ({ page }) => {
      expect(await page.uiComponents.legacyUi.dropdown('ui-dropdown-disabled').isDisabled()).toBe(true);
    });
  });

  // ---------------------------------------------------------------------------
  // API parity — SDS vs UI should behave identically
  // ---------------------------------------------------------------------------
  test.describe('API parity — SDS vs UI', () => {
    test('both should open, select, and report same result', async ({ page }) => {
      await page.uiComponents.dropdown('sds-dropdown-single-nosearch').selectOption(SMALL_FIRST);
      await page.uiComponents.dropdown('ui-dropdown-single-nosearch').selectOption(SMALL_FIRST);

      expect(await page.uiComponents.dropdown('sds-dropdown-single-nosearch').areOptionsSelected(SMALL_FIRST)).toBe(true);
      expect(await page.uiComponents.dropdown('ui-dropdown-single-nosearch').areOptionsSelected(SMALL_FIRST)).toBe(true);
    });

    test('both should scroll and select last of 100 options', async ({ page }) => {
      await page.uiComponents.dropdown('sds-dropdown-single-search').selectOption(LAST_OPTION);
      await page.uiComponents.dropdown('ui-dropdown-single-search').selectOption(LAST_OPTION);

      expect(await page.uiComponents.dropdown('sds-dropdown-single-search').areOptionsSelected(LAST_OPTION)).toBe(true);
      expect(await page.uiComponents.dropdown('ui-dropdown-single-search').areOptionsSelected(LAST_OPTION)).toBe(true);
    });

    test('both should search and find middle option', async ({ page }) => {
      await page.uiComponents.dropdown('sds-dropdown-single-search').search('Option 050');

      await expect(page.uiComponents.dropdown('sds-dropdown-single-search').getOption(MIDDLE_OPTION)).toBeVisible();
      
      await page.uiComponents.dropdown('ui-dropdown-single-search').search('Option 050');

  
      await expect(page.uiComponents.dropdown('ui-dropdown-single-search').getOption(MIDDLE_OPTION)).toBeVisible();
    });

    test('getHost should be attached for both', async ({ page }) => {
      await expect(page.uiComponents.dropdown('sds-dropdown-single-nosearch').getHost()).toBeAttached();
      await expect(page.uiComponents.dropdown('ui-dropdown-single-nosearch').getHost()).toBeAttached();
    });

    test('getHead should be attached for both', async ({ page }) => {
      await expect(page.uiComponents.dropdown('sds-dropdown-single-nosearch').getHead()).toBeAttached();
      await expect(page.uiComponents.dropdown('ui-dropdown-single-nosearch').getHead()).toBeAttached();
    });
  });
});
