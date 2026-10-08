import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

test.describe('DaterangePickerUtils — Wrapper', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-daterangepicker.html'));
  });

  // -----------------------------------------------------------------------
  // SDS — Empty picker
  // -----------------------------------------------------------------------
  test.describe('SDS — Empty Daterange Picker', () => {
    test('should have empty min and max values initially', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('sds-daterange-empty');
      expect(await picker.getMinDate()).toBe('');
      expect(await picker.getMaxDate()).toBe('');
    });

    test('should set min date → getMinDate returns 10/01/2026', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('sds-daterange-empty');
      await picker.setMinDate(new Date(2026, 0, 10));
      expect(await picker.getMinDate()).toBe('10/01/2026');
    });

    test('should set max date → getMaxDate returns 20/01/2026', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('sds-daterange-empty');
      await picker.setMaxDate(new Date(2026, 0, 20));
      expect(await picker.getMaxDate()).toBe('20/01/2026');
    });

    test('should set range with both dates → min 05/01/2026, max 15/01/2026', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('sds-daterange-empty');
      await picker.setRange(new Date(2026, 0, 5), new Date(2026, 0, 15));
      expect(await picker.getMinDate()).toBe('05/01/2026');
      expect(await picker.getMaxDate()).toBe('15/01/2026');
    });
  });

  // -----------------------------------------------------------------------
  // SDS — Preset picker
  // -----------------------------------------------------------------------
  test.describe('SDS — Preset Daterange Picker', () => {
    test('should have preset min 15/01/2026 and max 25/01/2026 initially', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('sds-daterange-preset');
      expect(await picker.getMinDate()).toBe('15/01/2026');
      expect(await picker.getMaxDate()).toBe('25/01/2026');
    });

    test('should change min date → getMinDate returns 05/01/2026', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('sds-daterange-preset');
      await picker.setMinDate(new Date(2026, 0, 5));
      expect(await picker.getMinDate()).toBe('05/01/2026');
    });

    test('should change max date → getMaxDate returns 10/02/2026', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('sds-daterange-preset');
      await picker.setMaxDate(new Date(2026, 1, 10));
      expect(await picker.getMaxDate()).toBe('10/02/2026');
    });

    test('should access child datepickers via getMinDatepicker/getMaxDatepicker and read values', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('sds-daterange-preset');
      const minValue = await picker.getMinDatepicker().getValue();
      const maxValue = await picker.getMaxDatepicker().getValue();
      expect(minValue).toBe('15/01/2026');
      expect(maxValue).toBe('25/01/2026');
    });
  });

  // -----------------------------------------------------------------------
  // SDS — Disabled
  // -----------------------------------------------------------------------
  test.describe('SDS — Disabled Daterange Picker', () => {
    test('isDisabled() returns true', async ({ page }) => {
      expect(await page.uiComponents.daterangePicker('sds-daterange-disabled').isDisabled()).toBe(true);
    });

    test('isReadOnly() returns false for basic disabled', async ({ page }) => {
      expect(await page.uiComponents.daterangePicker('sds-daterange-disabled').isReadOnly()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // UI — Empty picker
  // -----------------------------------------------------------------------
  test.describe('UI — Empty Daterange Picker', () => {
    test('should have empty min and max values initially', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('ui-daterange-empty');
      expect(await picker.getMinDate()).toBe('');
      expect(await picker.getMaxDate()).toBe('');
    });

    test('should set min date → getMinDate returns 10/01/2026', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('ui-daterange-empty');
      await picker.setMinDate(new Date(2026, 0, 10));
      expect(await picker.getMinDate()).toBe('10/01/2026');
    });

    test('should set max date → getMaxDate returns 20/01/2026', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('ui-daterange-empty');
      await picker.setMaxDate(new Date(2026, 0, 20));
      expect(await picker.getMaxDate()).toBe('20/01/2026');
    });

    test('should set range with both dates → min 05/01/2026, max 15/01/2026', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('ui-daterange-empty');
      await picker.setRange(new Date(2026, 0, 5), new Date(2026, 0, 15));
      expect(await picker.getMinDate()).toBe('05/01/2026');
      expect(await picker.getMaxDate()).toBe('15/01/2026');
    });
  });

  // -----------------------------------------------------------------------
  // UI — Preset picker
  // -----------------------------------------------------------------------
  test.describe('UI — Preset Daterange Picker', () => {
    test('should have preset min 15/01/2026 and max 25/01/2026 initially', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('ui-daterange-preset');
      expect(await picker.getMinDate()).toBe('15/01/2026');
      expect(await picker.getMaxDate()).toBe('25/01/2026');
    });

    test('should change min date → getMinDate returns 05/01/2026', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('ui-daterange-preset');
      await picker.setMinDate(new Date(2026, 0, 5));
      expect(await picker.getMinDate()).toBe('05/01/2026');
    });

    test('should change max date → getMaxDate returns 10/02/2026', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('ui-daterange-preset');
      await picker.setMaxDate(new Date(2026, 1, 10));
      expect(await picker.getMaxDate()).toBe('10/02/2026');
    });

    test('should access child datepickers via getMinDatepicker/getMaxDatepicker and read values', async ({ page }) => {
      const picker = page.uiComponents.daterangePicker('ui-daterange-preset');
      const minValue = await picker.getMinDatepicker().getValue();
      const maxValue = await picker.getMaxDatepicker().getValue();
      expect(minValue).toBe('15/01/2026');
      expect(maxValue).toBe('25/01/2026');
    });
  });

  // -----------------------------------------------------------------------
  // UI — Disabled
  // -----------------------------------------------------------------------
  test.describe('UI — Disabled Daterange Picker', () => {
    test('isDisabled() returns true', async ({ page }) => {
      expect(await page.uiComponents.daterangePicker('ui-daterange-disabled').isDisabled()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Namespace access
  // -----------------------------------------------------------------------
  test.describe('Namespace access', () => {
    test('sdsComponents.daterangePicker — selects range and reads back values', async ({ page }) => {
      const picker = page.uiComponents.sdsComponents.daterangePicker('sds-daterange-empty');
      await picker.setRange(new Date(2026, 0, 3), new Date(2026, 0, 28));
      expect(await picker.getMinDate()).toBe('03/01/2026');
      expect(await picker.getMaxDate()).toBe('28/01/2026');
    });

    test('legacyUi.daterangePicker — selects range and reads back values', async ({ page }) => {
      const picker = page.uiComponents.legacyUi.daterangePicker('ui-daterange-empty');
      await picker.setRange(new Date(2026, 0, 3), new Date(2026, 0, 28));
      expect(await picker.getMinDate()).toBe('03/01/2026');
      expect(await picker.getMaxDate()).toBe('28/01/2026');
    });
  });

  // -----------------------------------------------------------------------
  // API parity
  // -----------------------------------------------------------------------
  test.describe('API parity — SDS and UI produce identical results', () => {
    test('getMinDate / getMaxDate return the same strings for the same setRange input', async ({ page }) => {
      const sds = page.uiComponents.sdsComponents.daterangePicker('sds-daterange-empty');
      const ui = page.uiComponents.legacyUi.daterangePicker('ui-daterange-empty');

      await sds.setRange(new Date(2026, 2, 1), new Date(2026, 2, 20));
      await ui.setRange(new Date(2026, 2, 1), new Date(2026, 2, 20));

      expect(await sds.getMinDate()).toBe(await ui.getMinDate());
      expect(await sds.getMaxDate()).toBe(await ui.getMaxDate());
    });

    test('getValidity() returns true after a valid range is set on both SDS and UI', async ({ page }) => {
      const sds = page.uiComponents.sdsComponents.daterangePicker('sds-daterange-empty');
      const ui = page.uiComponents.legacyUi.daterangePicker('ui-daterange-empty');

      await sds.setRange(new Date(2026, 0, 1), new Date(2026, 0, 31));
      await ui.setRange(new Date(2026, 0, 1), new Date(2026, 0, 31));

      expect(await sds.getValidity()).toBe(true);
      expect(await ui.getValidity()).toBe(true);
    });

    test('getHost() locator resolves for both SDS and UI', async ({ page }) => {
      const sdsHost = page.uiComponents.sdsComponents.daterangePicker('sds-daterange-empty').getHost();
      const uiHost = page.uiComponents.legacyUi.daterangePicker('ui-daterange-empty').getHost();
      await expect(sdsHost).toBeVisible();
      await expect(uiHost).toBeVisible();
    });
  });

  // -----------------------------------------------------------------------
  // Auto-detection
  // -----------------------------------------------------------------------
  test.describe('Auto-detection via page.uiComponents.daterangePicker()', () => {
    test('wraps SDS component correctly (getHost resolves to dbx-ds-daterange-picker)', async ({ page }) => {
      const host = page.uiComponents.daterangePicker('sds-daterange-empty').getHost();
      await expect(host).toBeVisible();
      const tag = await host.evaluate(el => el.tagName.toLowerCase());
      expect(tag).toBe('dbx-ds-daterange-picker');
    });

    test('wraps legacy UI component correctly (getHost resolves to dbx-daterange-picker)', async ({ page }) => {
      const host = page.uiComponents.daterangePicker('ui-daterange-empty').getHost();
      await expect(host).toBeVisible();
      const tag = await host.evaluate(el => el.tagName.toLowerCase());
      expect(tag).toBe('dbx-daterange-picker');
    });
  });
});
