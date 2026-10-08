import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

test.describe('Rank Order Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-rank-order.html'));
    await page.waitForLoadState('networkidle');
    await page.getByTestId('sds-rank-order').waitFor({ state: 'visible' });
  });

  test.describe('setValue', () => {
    test('should default to options order', async ({ page }) => {
      const rankOrder = page.uiComponents.rankOrder('sds-rank-order');

      expect(await rankOrder.getValue()).toEqual(['A', 'B', 'C', 'D']);
    });

    test('should set rank order programmatically', async ({ page }) => {
      const rankOrder = page.uiComponents.rankOrder('sds-rank-order');

      await rankOrder.setValue(['D', 'C', 'B', 'A']);
      expect(await rankOrder.getValue()).toEqual(['D', 'C', 'B', 'A']);
    });
  });

  test.describe('State', () => {
    test('should detect disabled state', async ({ page }) => {
      const rankOrder = page.uiComponents.rankOrder('sds-rank-order-disabled');
      expect(await rankOrder.isDisabled()).toBe(true);
    });

    test('should detect read-only state', async ({ page }) => {
      const rankOrder = page.uiComponents.rankOrder('sds-rank-order-readonly');
      expect(await rankOrder.isReadOnly()).toBe(true);
    });
  });

  test.describe('SDS namespace', () => {
    test('sdsComponents.rankOrder should behave the same', async ({ page }) => {
      const rankOrder = page.uiComponents.sdsComponents.rankOrder('sds-rank-order');

      await rankOrder.setValue(['D', 'C', 'B', 'A']);
      expect(await rankOrder.getValue()).toEqual(['D', 'C', 'B', 'A']);
    });
  });
});
