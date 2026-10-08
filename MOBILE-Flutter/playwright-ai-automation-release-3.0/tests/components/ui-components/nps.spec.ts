import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

test.describe('NPS Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-nps.html'));
    await page.waitForLoadState('networkidle');
    await page.getByTestId('sds-nps-default').waitFor({ state: 'visible' });
  });

  test.describe('selectByValue', () => {
    test('should select a score on default NPS', async ({ page }) => {
      const nps = page.uiComponents.nps('sds-nps-default');

      await nps.selectByValue(8);
      expect(await nps.getValue()).toBe(8);
    });

    test('should select boundary scores 0 and 10', async ({ page }) => {
      const nps = page.uiComponents.nps('sds-nps-default');

      await nps.selectByValue(0);
      expect(await nps.getValue()).toBe(0);

      await nps.selectByValue(10);
      expect(await nps.getValue()).toBe(10);
    });

    test('should select a score on small NPS', async ({ page }) => {
      const nps = page.uiComponents.nps('sds-nps-small');

      await nps.selectByValue(5);
      expect(await nps.getValue()).toBe(5);
    });
  });

  test.describe('State', () => {
    test('should detect disabled state', async ({ page }) => {
      const nps = page.uiComponents.nps('sds-nps-disabled');
      expect(await nps.isDisabled()).toBe(true);
    });

    test('should detect read-only state', async ({ page }) => {
      const nps = page.uiComponents.nps('sds-nps-readonly');
      expect(await nps.isReadOnly()).toBe(true);
    });
  });

  test.describe('SDS namespace', () => {
    test('sdsComponents.nps should select by value', async ({ page }) => {
      const nps = page.uiComponents.sdsComponents.nps('sds-nps-default');

      await nps.selectByValue(7);
      expect(await nps.getValue()).toBe(7);
    });
  });
});
