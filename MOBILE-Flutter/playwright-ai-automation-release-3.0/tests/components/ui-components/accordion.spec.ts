import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

test.describe('AccordionUtils — Wrapper', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-accordion.html'));
  });

  // -----------------------------------------------------------------------
  // SDS — Closed accordion
  // -----------------------------------------------------------------------
  test.describe('SDS — Closed Accordion', () => {
    test('should be closed initially', async ({ page }) => {
      expect(await page.uiComponents.accordion('sds-accordion-closed').isOpen()).toBe(false);
    });

    test('should expand when expand() is called', async ({ page }) => {
      await page.uiComponents.accordion('sds-accordion-closed').expand();
      expect(await page.uiComponents.accordion('sds-accordion-closed').isOpen()).toBe(true);
    });

    test('should collapse after expand', async ({ page }) => {
      await page.uiComponents.accordion('sds-accordion-closed').expand();
      await page.uiComponents.accordion('sds-accordion-closed').collapse();
      expect(await page.uiComponents.accordion('sds-accordion-closed').isOpen()).toBe(false);
    });

    test('should handle multiple expand/collapse cycles', async ({ page }) => {
      const accordion = page.uiComponents.accordion('sds-accordion-closed');

      expect(await accordion.isOpen()).toBe(false);

      await accordion.expand();
      expect(await accordion.isOpen()).toBe(true);

      await accordion.collapse();
      expect(await accordion.isOpen()).toBe(false);

      await accordion.expand();
      expect(await accordion.isOpen()).toBe(true);

      await accordion.collapse();
      expect(await accordion.isOpen()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // SDS — Open accordion
  // -----------------------------------------------------------------------
  test.describe('SDS — Open Accordion', () => {
    test('should be open initially', async ({ page }) => {
      expect(await page.uiComponents.accordion('sds-accordion-open').isOpen()).toBe(true);
    });

    test('should collapse when collapse() is called', async ({ page }) => {
      await page.uiComponents.accordion('sds-accordion-open').collapse();
      expect(await page.uiComponents.accordion('sds-accordion-open').isOpen()).toBe(false);
    });

    test('should expand after collapse', async ({ page }) => {
      await page.uiComponents.accordion('sds-accordion-open').collapse();
      await page.uiComponents.accordion('sds-accordion-open').expand();
      expect(await page.uiComponents.accordion('sds-accordion-open').isOpen()).toBe(true);
    });

    test('should handle multiple collapse/expand cycles', async ({ page }) => {
      const accordion = page.uiComponents.accordion('sds-accordion-open');

      expect(await accordion.isOpen()).toBe(true);

      await accordion.collapse();
      expect(await accordion.isOpen()).toBe(false);

      await accordion.expand();
      expect(await accordion.isOpen()).toBe(true);

      await accordion.collapse();
      expect(await accordion.isOpen()).toBe(false);

      await accordion.expand();
      expect(await accordion.isOpen()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // UI — Closed accordion
  // -----------------------------------------------------------------------
  test.describe('UI — Closed Accordion', () => {
    test('should be closed initially', async ({ page }) => {
      expect(await page.uiComponents.accordion('ui-accordion-closed').isOpen()).toBe(false);
    });

    test('should expand when expand() is called', async ({ page }) => {
      await page.uiComponents.accordion('ui-accordion-closed').expand();
      expect(await page.uiComponents.accordion('ui-accordion-closed').isOpen()).toBe(true);
    });

    test('should collapse after expand', async ({ page }) => {
      await page.uiComponents.accordion('ui-accordion-closed').expand();
      await page.uiComponents.accordion('ui-accordion-closed').collapse();
      expect(await page.uiComponents.accordion('ui-accordion-closed').isOpen()).toBe(false);
    });

    test('should handle multiple expand/collapse cycles', async ({ page }) => {
      const accordion = page.uiComponents.accordion('ui-accordion-closed');

      expect(await accordion.isOpen()).toBe(false);

      await accordion.expand();
      expect(await accordion.isOpen()).toBe(true);

      await accordion.collapse();
      expect(await accordion.isOpen()).toBe(false);

      await accordion.expand();
      expect(await accordion.isOpen()).toBe(true);

      await accordion.collapse();
      expect(await accordion.isOpen()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // UI — Open accordion
  // -----------------------------------------------------------------------
  test.describe('UI — Open Accordion', () => {
    test('should be open initially', async ({ page }) => {
      expect(await page.uiComponents.accordion('ui-accordion-open').isOpen()).toBe(true);
    });

    test('should collapse when collapse() is called', async ({ page }) => {
      await page.uiComponents.accordion('ui-accordion-open').collapse();
      expect(await page.uiComponents.accordion('ui-accordion-open').isOpen()).toBe(false);
    });

    test('should expand after collapse', async ({ page }) => {
      await page.uiComponents.accordion('ui-accordion-open').collapse();
      await page.uiComponents.accordion('ui-accordion-open').expand();
      expect(await page.uiComponents.accordion('ui-accordion-open').isOpen()).toBe(true);
    });

    test('should handle multiple collapse/expand cycles', async ({ page }) => {
      const accordion = page.uiComponents.accordion('ui-accordion-open');

      expect(await accordion.isOpen()).toBe(true);

      await accordion.collapse();
      expect(await accordion.isOpen()).toBe(false);

      await accordion.expand();
      expect(await accordion.isOpen()).toBe(true);

      await accordion.collapse();
      expect(await accordion.isOpen()).toBe(false);

      await accordion.expand();
      expect(await accordion.isOpen()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Namespace access
  // -----------------------------------------------------------------------
  test.describe('Namespace access', () => {
    test('sdsComponents.accordion — expand and isOpen returns true', async ({ page }) => {
      await page.uiComponents.sdsComponents.accordion('sds-accordion-closed').expand();
      expect(await page.uiComponents.sdsComponents.accordion('sds-accordion-closed').isOpen()).toBe(true);
    });

    test('legacyUi.accordion — expand and isOpen returns true', async ({ page }) => {
      await page.uiComponents.legacyUi.accordion('ui-accordion-closed').expand();
      expect(await page.uiComponents.legacyUi.accordion('ui-accordion-closed').isOpen()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // API parity
  // -----------------------------------------------------------------------
  test.describe('API parity — SDS and UI produce identical results', () => {
    test('expand() on both SDS and UI yields isOpen() === true', async ({ page }) => {
      await page.uiComponents.sdsComponents.accordion('sds-accordion-closed').expand();
      await page.uiComponents.legacyUi.accordion('ui-accordion-closed').expand();
      expect(await page.uiComponents.sdsComponents.accordion('sds-accordion-closed').isOpen()).toBe(true);
      expect(await page.uiComponents.legacyUi.accordion('ui-accordion-closed').isOpen()).toBe(true);
    });

    test('collapse() on both SDS and UI yields isOpen() === false', async ({ page }) => {
      await page.uiComponents.sdsComponents.accordion('sds-accordion-open').collapse();
      await page.uiComponents.legacyUi.accordion('ui-accordion-open').collapse();
      expect(await page.uiComponents.sdsComponents.accordion('sds-accordion-open').isOpen()).toBe(false);
      expect(await page.uiComponents.legacyUi.accordion('ui-accordion-open').isOpen()).toBe(false);
    });

    test('getHost() is visible for both SDS and UI', async ({ page }) => {
      await expect(page.uiComponents.sdsComponents.accordion('sds-accordion-closed').getHost()).toBeVisible();
      await expect(page.uiComponents.legacyUi.accordion('ui-accordion-closed').getHost()).toBeVisible();
    });
  });

  // -----------------------------------------------------------------------
  // Auto-detection
  // -----------------------------------------------------------------------
  test.describe('Auto-detection via page.uiComponents.accordion()', () => {
    test('wraps SDS component correctly (host tag is dbx-ds-accordion)', async ({ page }) => {
      const host = page.uiComponents.accordion('sds-accordion-closed').getHost();
      await expect(host).toBeVisible();
      const tag = await host.evaluate(el => el.tagName.toLowerCase());
      expect(tag).toBe('dbx-ds-accordion');
    });

    test('wraps legacy UI component correctly (host tag is dbx-accordion)', async ({ page }) => {
      const host = page.uiComponents.accordion('ui-accordion-closed').getHost();
      await expect(host).toBeVisible();
      const tag = await host.evaluate(el => el.tagName.toLowerCase());
      expect(tag).toBe('dbx-accordion');
    });
  });
});
