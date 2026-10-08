import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

test.describe('ToggleUtils — Wrapper', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-toggle.html'));
  });

  // -----------------------------------------------------------------------
  // SDS — Off (initial value false)
  // -----------------------------------------------------------------------
  test.describe('SDS — Off Toggle', () => {
    test('should get initial value (off)', async ({ page }) => {
      expect(await page.uiComponents.toggle('sds-toggle-off').getValue()).toBe(false);
    });

    test('should turn on and get value', async ({ page }) => {
      await page.uiComponents.toggle('sds-toggle-off').turnOn();
      expect(await page.uiComponents.toggle('sds-toggle-off').getValue()).toBe(true);
    });

    test('should turn off and get value', async ({ page }) => {
      await page.uiComponents.toggle('sds-toggle-off').turnOn();
      await page.uiComponents.toggle('sds-toggle-off').turnOff();
      expect(await page.uiComponents.toggle('sds-toggle-off').getValue()).toBe(false);
    });

    test('should check disabled state', async ({ page }) => {
      expect(await page.uiComponents.toggle('sds-toggle-off').isDisabled()).toBe(false);
    });

    test('should check readonly state', async ({ page }) => {
      expect(await page.uiComponents.toggle('sds-toggle-off').isReadOnly()).toBe(false);
    });

    test('should toggle state', async ({ page }) => {
      const initial = await page.uiComponents.toggle('sds-toggle-off').isOn();
      await page.uiComponents.toggle('sds-toggle-off').toggle();
      expect(await page.uiComponents.toggle('sds-toggle-off').isOn()).toBe(!initial);
    });

    test('turnOn should be idempotent', async ({ page }) => {
      await page.uiComponents.toggle('sds-toggle-off').turnOn();
      await page.uiComponents.toggle('sds-toggle-off').turnOn();
      expect(await page.uiComponents.toggle('sds-toggle-off').getValue()).toBe(true);
    });

    test('turnOff should be idempotent', async ({ page }) => {
      await page.uiComponents.toggle('sds-toggle-off').turnOff();
      await page.uiComponents.toggle('sds-toggle-off').turnOff();
      expect(await page.uiComponents.toggle('sds-toggle-off').getValue()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // SDS — Preset on (initial value true)
  // -----------------------------------------------------------------------
  test.describe('SDS — Preset-on Toggle', () => {
    test('should get initial value (on)', async ({ page }) => {
      expect(await page.uiComponents.toggle('sds-toggle-on').getValue()).toBe(true);
    });

    test('should turn off', async ({ page }) => {
      await page.uiComponents.toggle('sds-toggle-on').turnOff();
      expect(await page.uiComponents.toggle('sds-toggle-on').getValue()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // SDS — Disabled
  // -----------------------------------------------------------------------
  test.describe('SDS — Disabled Toggle', () => {
    test('isDisabled() returns true', async ({ page }) => {
      expect(await page.uiComponents.toggle('sds-toggle-disabled').isDisabled()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // SDS — Readonly
  // -----------------------------------------------------------------------
  test.describe('SDS — Readonly Toggle', () => {
    test('isReadOnly() returns true', async ({ page }) => {
      expect(await page.uiComponents.toggle('sds-toggle-readonly').isReadOnly()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // UI — Off (initial value false)
  // -----------------------------------------------------------------------
  test.describe('UI — Off Toggle', () => {
    test('should get initial value (off)', async ({ page }) => {
      expect(await page.uiComponents.toggle('ui-toggle-off').getValue()).toBe(false);
    });

    test('should turn on and get value', async ({ page }) => {
      await page.uiComponents.toggle('ui-toggle-off').turnOn();
      expect(await page.uiComponents.toggle('ui-toggle-off').getValue()).toBe(true);
    });

    test('should turn off and get value', async ({ page }) => {
      await page.uiComponents.toggle('ui-toggle-off').turnOn();
      await page.uiComponents.toggle('ui-toggle-off').turnOff();
      expect(await page.uiComponents.toggle('ui-toggle-off').getValue()).toBe(false);
    });

    test('should check disabled state', async ({ page }) => {
      expect(await page.uiComponents.toggle('ui-toggle-off').isDisabled()).toBe(false);
    });

    test('should check readonly state', async ({ page }) => {
      expect(await page.uiComponents.toggle('ui-toggle-off').isReadOnly()).toBe(false);
    });

    test('should toggle state', async ({ page }) => {
      const initial = await page.uiComponents.toggle('ui-toggle-off').isOn();
      await page.uiComponents.toggle('ui-toggle-off').toggle();
      expect(await page.uiComponents.toggle('ui-toggle-off').isOn()).toBe(!initial);
    });

    test('turnOn should be idempotent', async ({ page }) => {
      await page.uiComponents.toggle('ui-toggle-off').turnOn();
      await page.uiComponents.toggle('ui-toggle-off').turnOn();
      expect(await page.uiComponents.toggle('ui-toggle-off').getValue()).toBe(true);
    });

    test('turnOff should be idempotent', async ({ page }) => {
      await page.uiComponents.toggle('ui-toggle-off').turnOff();
      await page.uiComponents.toggle('ui-toggle-off').turnOff();
      expect(await page.uiComponents.toggle('ui-toggle-off').getValue()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // UI — Preset on (initial value true)
  // -----------------------------------------------------------------------
  test.describe('UI — Preset-on Toggle', () => {
    test('should get initial value (on)', async ({ page }) => {
      expect(await page.uiComponents.toggle('ui-toggle-on').getValue()).toBe(true);
    });

    test('should turn off', async ({ page }) => {
      await page.uiComponents.toggle('ui-toggle-on').turnOff();
      expect(await page.uiComponents.toggle('ui-toggle-on').getValue()).toBe(false);
    });
  });

  // -----------------------------------------------------------------------
  // UI — Disabled
  // -----------------------------------------------------------------------
  test.describe('UI — Disabled Toggle', () => {
    test('isDisabled() returns true', async ({ page }) => {
      expect(await page.uiComponents.toggle('ui-toggle-disabled').isDisabled()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // UI — Readonly
  // -----------------------------------------------------------------------
  test.describe('UI — Readonly Toggle', () => {
    test('isReadOnly() returns true', async ({ page }) => {
      expect(await page.uiComponents.toggle('ui-toggle-readonly').isReadOnly()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // Namespace access
  // -----------------------------------------------------------------------
  test.describe('Namespace access', () => {
    test('sdsComponents.toggle — turnOn and getValue returns true', async ({ page }) => {
      await page.uiComponents.sdsComponents.toggle('sds-toggle-off').turnOn();
      expect(await page.uiComponents.sdsComponents.toggle('sds-toggle-off').getValue()).toBe(true);
    });

    test('legacyUi.toggle — turnOn and getValue returns true', async ({ page }) => {
      await page.uiComponents.legacyUi.toggle('ui-toggle-off').turnOn();
      expect(await page.uiComponents.legacyUi.toggle('ui-toggle-off').getValue()).toBe(true);
    });
  });

  // -----------------------------------------------------------------------
  // API parity
  // -----------------------------------------------------------------------
  test.describe('API parity — SDS and UI produce identical results', () => {
    test('turnOn() on both SDS and UI yields getValue() === true', async ({ page }) => {
      await page.uiComponents.sdsComponents.toggle('sds-toggle-off').turnOn();
      await page.uiComponents.legacyUi.toggle('ui-toggle-off').turnOn();
      expect(await page.uiComponents.sdsComponents.toggle('sds-toggle-off').getValue()).toBe(true);
      expect(await page.uiComponents.legacyUi.toggle('ui-toggle-off').getValue()).toBe(true);
    });

    test('turnOff() on both SDS and UI yields getValue() === false', async ({ page }) => {
      await page.uiComponents.sdsComponents.toggle('sds-toggle-on').turnOff();
      await page.uiComponents.legacyUi.toggle('ui-toggle-on').turnOff();
      expect(await page.uiComponents.sdsComponents.toggle('sds-toggle-on').getValue()).toBe(false);
      expect(await page.uiComponents.legacyUi.toggle('ui-toggle-on').getValue()).toBe(false);
    });

    test('getHost() is visible for both SDS and UI', async ({ page }) => {
      await expect(page.uiComponents.sdsComponents.toggle('sds-toggle-off').getHost()).toBeVisible();
      await expect(page.uiComponents.legacyUi.toggle('ui-toggle-off').getHost()).toBeVisible();
    });
  });

  // -----------------------------------------------------------------------
  // Auto-detection
  // -----------------------------------------------------------------------
  test.describe('Auto-detection via page.uiComponents.toggle()', () => {
    test('wraps SDS component correctly (host tag is dbx-ds-toggle-switch)', async ({ page }) => {
      const host = page.uiComponents.toggle('sds-toggle-off').getHost();
      await expect(host).toBeVisible();
      const tag = await host.evaluate(el => el.tagName.toLowerCase());
      expect(tag).toBe('dbx-ds-toggle-switch');
    });

    test('wraps legacy UI component correctly (host tag is dbx-toggle-switch)', async ({ page }) => {
      const host = page.uiComponents.toggle('ui-toggle-off').getHost();
      await expect(host).toBeVisible();
      const tag = await host.evaluate(el => el.tagName.toLowerCase());
      expect(tag).toBe('dbx-toggle-switch');
    });
  });
});
