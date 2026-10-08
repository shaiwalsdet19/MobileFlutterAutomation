import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

const currentMonth = new Date().getMonth();
const nextMonth = (currentMonth + 1) % 12;
const prevMonth = (currentMonth + 11) % 12;

test.describe('Datepicker Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-datepicker.html'));
    await page.waitForLoadState('networkidle');
  });

  test.describe('Auto-detection for SDS component', () => {
    test('should detect SDS component and open calendar', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('sds-basic');
      await datepicker.openCalendar();
      await expect(page.getByTestId('sds-basic-view-toggle')).toBeVisible();
    });

    test('should detect SDS component and select day', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('sds-basic');
      await datepicker.openCalendar();
      await datepicker.selectDay(currentMonth, 15);
      expect(await datepicker.getValue()).not.toBe('');
    });

    test('should detect SDS component and type date', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('sds-basic');
      await datepicker.typeDate('20/06/2025');
      await datepicker.getInput().blur();
      expect(await datepicker.getValue()).toContain('2025');
    });

    test('should detect SDS component and clear value', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('sds-with-value');
      expect(await datepicker.getValue()).toBe('15/01/2025');
      await datepicker.clear();
      await datepicker.getInput().blur();
      expect(await datepicker.getValue()).toBe('');
    });

    test('should detect SDS disabled state', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('sds-disabled');
      expect(await datepicker.isDisabled()).toBe(true);
    });

    test('should detect SDS readonly state', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('sds-readonly');
      expect(await datepicker.isReadOnly()).toBe(true);
    });
  });

  test.describe('Auto-detection for Legacy UI component', () => {
    test('should detect UI component and open calendar', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('ui-basic');
      await datepicker.openCalendar();
      await expect(page.getByTestId('ui-basic-view-toggle')).toBeVisible();
    });

    test('should detect UI component and select day', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('ui-basic');
      await datepicker.openCalendar();
      await datepicker.selectDay(currentMonth, 15);
      expect(await datepicker.getValue()).not.toBe('');
    });

    test('should detect UI component and type date', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('ui-basic');
      await datepicker.typeDate('20/06/2025');
      await datepicker.getInput().blur();
      expect(await datepicker.getValue()).toContain('2025');
    });

    test('should detect UI component and clear value', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('ui-with-value');
      expect(await datepicker.getValue()).toBe('15/01/2025');
      await datepicker.clear();
      await datepicker.getInput().blur();
      expect(await datepicker.getValue()).toBe('');
    });

    test('should detect UI disabled state', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('ui-disabled');
      expect(await datepicker.isDisabled()).toBe(true);
    });

    test('should detect UI readonly state', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('ui-readonly');
      expect(await datepicker.isReadOnly()).toBe(true);
    });
  });

  test.describe('Direct namespace access - sdsComponents', () => {
    test('should access SDS component via namespace', async ({ page }) => {
      const datepicker = page.uiComponents.sdsComponents.datepicker('sds-basic');
      await datepicker.openCalendar();
      await datepicker.selectDay(currentMonth, 10);
      expect(await datepicker.getValue()).not.toBe('');
    });

    test('should check disabled state via namespace', async ({ page }) => {
      const datepicker = page.uiComponents.sdsComponents.datepicker('sds-disabled');
      expect(await datepicker.isDisabled()).toBe(true);
    });
  });

  test.describe('Direct namespace access - legacyUi', () => {
    test('should access UI component via namespace', async ({ page }) => {
      const datepicker = page.uiComponents.legacyUi.datepicker('ui-basic');
      await datepicker.openCalendar();
      await datepicker.selectDay(currentMonth, 10);
      expect(await datepicker.getValue()).not.toBe('');
    });

    test('should check disabled state via namespace', async ({ page }) => {
      const datepicker = page.uiComponents.legacyUi.datepicker('ui-disabled');
      expect(await datepicker.isDisabled()).toBe(true);
    });
  });

  test.describe('Consistent API behavior', () => {
    test('both SDS and UI should have same API for open/select/close', async ({ page }) => {
      const sdsDatepicker = page.uiComponents.datepicker('sds-basic');
      const uiDatepicker = page.uiComponents.datepicker('ui-basic');

      await sdsDatepicker.openCalendar();
      await sdsDatepicker.selectDay(currentMonth, 5);
      await sdsDatepicker.closeCalendar();

      await uiDatepicker.openCalendar();
      await uiDatepicker.selectDay(currentMonth, 5);
      await uiDatepicker.closeCalendar();

      expect(await sdsDatepicker.getValue()).not.toBe('');
      expect(await uiDatepicker.getValue()).not.toBe('');
    });

    test('both SDS and UI should have same API for typeDate', async ({ page }) => {
      const sdsDatepicker = page.uiComponents.datepicker('sds-basic');
      const uiDatepicker = page.uiComponents.datepicker('ui-basic');

      await sdsDatepicker.typeDate('25/12/2025');
      await sdsDatepicker.getInput().blur();
      await uiDatepicker.typeDate('25/12/2025');
      await uiDatepicker.getInput().blur();

      expect(await sdsDatepicker.getValue()).toContain('2025');
      expect(await uiDatepicker.getValue()).toContain('2025');
    });

    test('both SDS and UI should have same API for isDisabled', async ({ page }) => {
      const sdsDisabled = page.uiComponents.datepicker('sds-disabled');
      const uiDisabled = page.uiComponents.datepicker('ui-disabled');
      const sdsEnabled = page.uiComponents.datepicker('sds-basic');
      const uiEnabled = page.uiComponents.datepicker('ui-basic');

      expect(await sdsDisabled.isDisabled()).toBe(true);
      expect(await uiDisabled.isDisabled()).toBe(true);
      expect(await sdsEnabled.isDisabled()).toBe(false);
      expect(await uiEnabled.isDisabled()).toBe(false);
    });

    test('both SDS and UI should have same API for isReadOnly', async ({ page }) => {
      const sdsReadonly = page.uiComponents.datepicker('sds-readonly');
      const uiReadonly = page.uiComponents.datepicker('ui-readonly');
      const sdsEditable = page.uiComponents.datepicker('sds-basic');
      const uiEditable = page.uiComponents.datepicker('ui-basic');

      expect(await sdsReadonly.isReadOnly()).toBe(true);
      expect(await uiReadonly.isReadOnly()).toBe(true);
      expect(await sdsEditable.isReadOnly()).toBe(false);
      expect(await uiEditable.isReadOnly()).toBe(false);
    });
  });

  test.describe('Calendar navigation', () => {
    test('should navigate to next month for SDS', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('sds-basic');
      await datepicker.openCalendar();
      await datepicker.navigateToNextMonth();
      await datepicker.selectDay(nextMonth, 1);
      expect(await datepicker.getValue()).not.toBe('');
    });

    test('should navigate to previous month for SDS', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('sds-basic');
      await datepicker.openCalendar();
      await datepicker.navigateToPrevMonth();
      await datepicker.selectDay(prevMonth, 1);
      expect(await datepicker.getValue()).not.toBe('');
    });

    test('should navigate to next month for UI', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('ui-basic');
      await datepicker.openCalendar();
      await datepicker.navigateToNextMonth();
      await datepicker.selectDay(nextMonth, 1);
      expect(await datepicker.getValue()).not.toBe('');
    });

    test('should navigate to previous month for UI', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('ui-basic');
      await datepicker.openCalendar();
      await datepicker.navigateToPrevMonth();
      await datepicker.selectDay(prevMonth, 1);
      expect(await datepicker.getValue()).not.toBe('');
    });
  });

  test.describe('View toggle and full date selection', () => {
    test('should toggle view and select month for SDS', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('sds-basic');
      await datepicker.openCalendar();
      await datepicker.toggleView();
      await datepicker.selectMonth(6);
      await datepicker.selectDay(6, 15);
      expect(await datepicker.getValue()).not.toBe('');
    });

    test('should toggle view and select month for UI', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('ui-basic');
      await datepicker.openCalendar();
      await datepicker.toggleView();
      await datepicker.selectMonth(6);
      await datepicker.selectDay(6, 15);
      expect(await datepicker.getValue()).not.toBe('');
    });

    test('should select full date with year/month/day for SDS', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('sds-basic');
      const targetDate = new Date(2024, 5, 15);
      await datepicker.selectDate(targetDate);
      expect(await datepicker.getValue()).not.toBe('');
    });

    test('should select full date with year/month/day for UI', async ({ page }) => {
      const datepicker = page.uiComponents.datepicker('ui-basic');
      const targetDate = new Date(2024, 5, 15);
      await datepicker.selectDate(targetDate);
      expect(await datepicker.getValue()).not.toBe('');
    });
  });
});
