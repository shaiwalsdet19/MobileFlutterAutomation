import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances';

test.describe('Consent Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright.html'));
  });

  test('should get initial value (not accepted)', async ({ page }) => {
    expect(await page.uiComponents.consent('terms').getValue()).toBe(false);
  });

  test('should accept and get value', async ({ page }) => {
    await page.uiComponents.consent('terms').accept();
    expect(await page.uiComponents.consent('terms').getValue()).toBe(true);
  });

  test('should decline and get value', async ({ page }) => {
    await page.uiComponents.consent('terms').accept();
    await page.uiComponents.consent('terms').decline();
    expect(await page.uiComponents.consent('terms').getValue()).toBe(false);
  });

  test('should check disabled state', async ({ page }) => {
    expect(await page.uiComponents.consent('terms').isDisabled()).toBe(false);
  });

  test('should check readonly state', async ({ page }) => {
    expect(await page.uiComponents.consent('terms').isReadOnly()).toBe(false);
  });

  test('isAccepted should match getValue', async ({ page }) => {
    expect(await page.uiComponents.consent('terms').isAccepted()).toBe(await page.uiComponents.consent('terms').getValue());
    await page.uiComponents.consent('terms').accept();
    expect(await page.uiComponents.consent('terms').isAccepted()).toBe(await page.uiComponents.consent('terms').getValue());
  });

  test('accept should be idempotent', async ({ page }) => {
    await page.uiComponents.consent('terms').accept();
    await page.uiComponents.consent('terms').accept();
    expect(await page.uiComponents.consent('terms').getValue()).toBe(true);
  });

  test('decline should be idempotent', async ({ page }) => {
    await page.uiComponents.consent('terms').decline();
    await page.uiComponents.consent('terms').decline();
    expect(await page.uiComponents.consent('terms').getValue()).toBe(false);
  });
});
