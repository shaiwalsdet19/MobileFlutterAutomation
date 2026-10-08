import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

test.describe('Rating Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-rating.html'));
    await page.waitForLoadState('networkidle');
    await page.getByTestId('sds-rating-inline').waitFor({ state: 'visible' });
  });

  test.describe('Inline rating', () => {
    test('should select by value', async ({ page }) => {
      const rating = page.uiComponents.rating('sds-rating-inline');
      expect(await rating.isOverflowMode()).toBe(false);

      await rating.selectByValue(4);
      expect(await rating.getValue()).toBe(4);
    });

    test('should select by index', async ({ page }) => {
      const rating = page.uiComponents.rating('sds-rating-inline');

      await rating.selectByIndex(2);
      expect(await rating.getValue()).toBe(3);
    });
  });

  test.describe('Overflow dropdown rating', () => {
    test('should detect overflow mode', async ({ page }) => {
      const rating = page.uiComponents.rating('sds-rating-overflow');
      expect(await rating.isOverflowMode()).toBe(true);
    });

    test('should select by value via dropdown utils', async ({ page }) => {
      const rating = page.uiComponents.rating('sds-rating-overflow');

      await rating.selectByValue(8);
      expect(await rating.getValue()).toBe(8);
    });

    test('should select by index via dropdown utils', async ({ page }) => {
      const rating = page.uiComponents.rating('sds-rating-overflow');

      await rating.selectByIndex(7);
      expect(await rating.getValue()).toBe(8);
    });
  });

  test.describe('NA option', () => {
    test('should select NA inline', async ({ page }) => {
      const rating = page.uiComponents.rating('sds-rating-with-na');

      await rating.selectNa();
      expect(await rating.getValue()).toBe('na');
    });

    test('should expose NA option locator', async ({ page }) => {
      const rating = page.uiComponents.rating('sds-rating-with-na');
      await expect(await rating.getNaOption()).toBeVisible();
    });
  });

  test.describe('State', () => {
    test('should detect disabled state', async ({ page }) => {
      const rating = page.uiComponents.rating('sds-rating-disabled');
      expect(await rating.isDisabled()).toBe(true);
    });

    test('should detect read-only state is false for inline', async ({ page }) => {
      const rating = page.uiComponents.rating('sds-rating-inline');
      expect(await rating.isReadOnly()).toBe(false);
    });
  });

  test.describe('SDS namespace', () => {
    test('sdsComponents.rating should behave the same', async ({ page }) => {
      const rating = page.uiComponents.sdsComponents.rating('sds-rating-inline');
      await rating.selectByValue(4);
      expect(await rating.getValue()).toBe(4);
    });
  });
});
