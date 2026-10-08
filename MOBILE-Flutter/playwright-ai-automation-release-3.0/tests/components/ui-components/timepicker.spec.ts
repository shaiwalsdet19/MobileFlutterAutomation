import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

test.describe('Timepicker Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-timepicker.html'));
    await page.waitForLoadState('networkidle');
    await page.getByTestId('sds-timepicker-12h').waitFor({ state: 'visible' });
  });

  test.describe('selectTime', () => {
    test('should select time in 24-hour format', async ({ page }) => {
      const timepicker = page.uiComponents.timepicker('sds-timepicker-24h');

      await timepicker.selectTime({ hour: 14, minutes: 30, second: 45 });
      expect(await timepicker.getValue()).toEqual({ hour: 14, minutes: 30, second: 45 });
    });

    test('should select time in 12-hour format with internal 24-hour value', async ({ page }) => {
      const timepicker = page.uiComponents.timepicker('sds-timepicker-12h');

      await timepicker.selectTime({ hour: 14, minutes: 30, second: 0 });
      expect(await timepicker.getValue()).toEqual({ hour: 14, minutes: 30, second: 0 });
    });

    test('should accept Date input', async ({ page }) => {
      const timepicker = page.uiComponents.timepicker('sds-timepicker-12h');
      const date = new Date(2024, 0, 1, 9, 15, 20);

      await timepicker.selectTime(date);
      expect(await timepicker.getValue()).toEqual({ hour: 9, minutes: 15, second: 20 });
    });

    test('should skip second dropdown when showSeconds is false', async ({ page }) => {
      const timepicker = page.uiComponents.timepicker('sds-timepicker-no-seconds');

      expect(await timepicker.showSeconds()).toBe(false);
      await expect(page.getByTestId('sds-timepicker-no-seconds-second-head')).toHaveCount(0);

      await timepicker.selectTime({ hour: 10, minutes: 45 });
      expect(await timepicker.getValue()).toEqual({ hour: 10, minutes: 45 });
    });

    test('should scroll and select end-of-range time 23:59:59 in 24-hour format', async ({ page }) => {
      const timepicker = page.uiComponents.timepicker('sds-timepicker-24h');

      await timepicker.selectTime({ hour: 23, minutes: 59, second: 59 });
      expect(await timepicker.getValue()).toEqual({ hour: 23, minutes: 59, second: 59 });
    });

    test('should scroll and select end-of-range time 11:59:59 PM in 12-hour format', async ({ page }) => {
      const timepicker = page.uiComponents.timepicker('sds-timepicker-12h');

      await timepicker.selectTime({ hour: 23, minutes: 59, second: 59 });
      expect(await timepicker.getValue()).toEqual({ hour: 23, minutes: 59, second: 59 });
    });
  });

  test.describe('State', () => {
    test('should detect disabled state', async ({ page }) => {
      const timepicker = page.uiComponents.timepicker('sds-timepicker-disabled');
      expect(await timepicker.isDisabled()).toBe(true);
    });

    test('should detect read-only state', async ({ page }) => {
      const timepicker = page.uiComponents.timepicker('sds-timepicker-readonly');
      expect(await timepicker.isReadOnly()).toBe(true);
    });

    test('should detect 24-hour format flag', async ({ page }) => {
      const timepicker24h = page.uiComponents.timepicker('sds-timepicker-24h');
      const timepicker12h = page.uiComponents.timepicker('sds-timepicker-12h');

      expect(await timepicker24h.isTwentyFourHourFormat()).toBe(true);
      expect(await timepicker12h.isTwentyFourHourFormat()).toBe(false);
    });
  });

  test.describe('SDS namespace', () => {
    test('sdsComponents.timepicker should behave the same', async ({ page }) => {
      const timepicker = page.uiComponents.sdsComponents.timepicker('sds-timepicker-12h');

      await timepicker.selectTime({ hour: 14, minutes: 30, second: 0 });
      expect(await timepicker.getValue()).toEqual({ hour: 14, minutes: 30, second: 0 });
    });
  });
});
