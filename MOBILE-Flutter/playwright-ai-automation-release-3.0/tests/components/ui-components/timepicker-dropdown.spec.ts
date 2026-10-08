import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

test.describe('Timepicker Dropdown Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-timepicker-dropdown.html'));
    await page.waitForLoadState('networkidle');
    await page.getByTestId('sds-timepicker-dropdown-24h').waitFor({ state: 'visible' });
  });

  test.describe('selectTime', () => {
    test('should select time in 24-hour format', async ({ page }) => {
      const timepickerDropdown = page.uiComponents.timepickerDropdown('sds-timepicker-dropdown-24h');

      await timepickerDropdown.selectTime({ hour: 14, minutes: 30 });
      expect(await timepickerDropdown.getValue()).toEqual({ hour: 14, minutes: 30 });
    });

    test('should select time in 12-hour format with internal 24-hour value', async ({ page }) => {
      const timepickerDropdown = page.uiComponents.timepickerDropdown('sds-timepicker-dropdown-12h');

      await timepickerDropdown.selectTime({ hour: 14, minutes: 30 });
      expect(await timepickerDropdown.getValue()).toEqual({ hour: 14, minutes: 30 });
    });

    test('should accept Date input', async ({ page }) => {
      const timepickerDropdown = page.uiComponents.timepickerDropdown('sds-timepicker-dropdown-12h');
      const date = new Date(2024, 0, 1, 9, 30, 0);

      await timepickerDropdown.selectTime(date);
      expect(await timepickerDropdown.getValue()).toEqual({ hour: 9, minutes: 30 });
    });

    test('should scroll and select end-of-range time 23:59 in 24-hour format', async ({ page }) => {
      const timepickerDropdown = page.uiComponents.timepickerDropdown('sds-timepicker-dropdown-scroll-24h');

      await timepickerDropdown.selectTime({ hour: 5, minutes: 59 });
      expect(await timepickerDropdown.getValue()).toEqual({ hour: 5, minutes: 59 });
    });

    test('should scroll and select end-of-range time 11:59 PM in 12-hour format', async ({ page }) => {
      const timepickerDropdown = page.uiComponents.timepickerDropdown('sds-timepicker-dropdown-scroll-12h');

      await timepickerDropdown.selectTime({ hour: 5, minutes: 59 });
      expect(await timepickerDropdown.getValue()).toEqual({ hour: 5, minutes: 59 });
    });
  });

  test.describe('State', () => {
    test('should detect disabled state', async ({ page }) => {
      const timepickerDropdown = page.uiComponents.timepickerDropdown('sds-timepicker-dropdown-disabled');
      expect(await timepickerDropdown.isDisabled()).toBe(true);
    });

    test('should detect read-only state', async ({ page }) => {
      const timepickerDropdown = page.uiComponents.timepickerDropdown('sds-timepicker-dropdown-readonly');
      expect(await timepickerDropdown.isReadOnly()).toBe(true);
    });

    test('should detect 24-hour format flag', async ({ page }) => {
      const timepicker24h = page.uiComponents.timepickerDropdown('sds-timepicker-dropdown-24h');
      const timepicker12h = page.uiComponents.timepickerDropdown('sds-timepicker-dropdown-12h');

      expect(await timepicker24h.isTwentyFourHourFormat()).toBe(true);
      expect(await timepicker12h.isTwentyFourHourFormat()).toBe(false);
    });
  });

  test.describe('SDS namespace', () => {
    test('sdsComponents.timepickerDropdown should behave the same', async ({ page }) => {
      const timepickerDropdown = page.uiComponents.sdsComponents.timepickerDropdown('sds-timepicker-dropdown-12h');

      await timepickerDropdown.selectTime({ hour: 5, minutes: 30 });
      expect(await timepickerDropdown.getValue()).toEqual({ hour: 5, minutes: 30 });
    });
  });
});
