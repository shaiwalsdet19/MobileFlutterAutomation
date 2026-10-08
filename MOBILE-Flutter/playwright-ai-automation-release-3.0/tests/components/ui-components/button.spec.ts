import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances';

test.describe('Button Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright.html'));
  });

  const getOutput = (page) => page.getByTestId('button-output');

  test.describe('Simple Button', () => {
    test('should display message on click', async ({ page }) => {
      await page.uiComponents.button('simple-btn').click();
      await expect(getOutput(page)).toHaveText('Simple Button Clicked');
    });
  });

  test.describe('Button with Menu', () => {
    test('should display Edit when selected', async ({ page }) => {
      await page.uiComponents.button('menu-btn').click();
      await page.uiComponents.button('menu-btn').selectMenuItem(['Edit']);
      await expect(getOutput(page)).toHaveText('Menu: Edit');
    });

    test('should display Delete when selected', async ({ page }) => {
      await page.uiComponents.button('menu-btn').click();
      await page.uiComponents.button('menu-btn').selectMenuItem(['Delete']);
      await expect(getOutput(page)).toHaveText('Menu: Delete');
    });

    test('should display Archive when selected', async ({ page }) => {
      await page.uiComponents.button('menu-btn').click();
      await page.uiComponents.button('menu-btn').selectMenuItem(['Archive']);
      await expect(getOutput(page)).toHaveText('Menu: Archive');
    });

    test('should display PDF when selecting nested Export > PDF', async ({ page }) => {
      await page.uiComponents.button('menu-btn').click();
      await page.uiComponents.button('menu-btn').selectMenuItem(['Export', 'PDF']);
      await expect(getOutput(page)).toHaveText('Menu: PDF');
    });

    test('should display Excel when selecting nested Export > Excel', async ({ page }) => {
      await page.uiComponents.button('menu-btn').click();
      await page.uiComponents.button('menu-btn').selectMenuItem(['Export', 'Excel']);
      await expect(getOutput(page)).toHaveText('Menu: Excel');
    });

    test('should display CSV when selecting nested Export > CSV', async ({ page }) => {
      await page.uiComponents.button('menu-btn').click();
      await page.uiComponents.button('menu-btn').selectMenuItem(['Export', 'CSV']);
      await expect(getOutput(page)).toHaveText('Menu: CSV');
    });
  });

  test.describe('Split Button with Menu', () => {
    test('should display message when main button clicked', async ({ page }) => {
      await page.uiComponents.button('split-btn').click();
      await expect(getOutput(page)).toHaveText('Split Button Clicked');
    });

    test('should display Save when selected from split menu', async ({ page }) => {
      await page.uiComponents.button('split-btn').clickSplit();
      await page.uiComponents.button('split-btn').selectMenuItem(['Save']);
      await expect(getOutput(page)).toHaveText('Split Menu: Save');
    });

    test('should display Save As when selected from split menu', async ({ page }) => {
      await page.uiComponents.button('split-btn').clickSplit();
      await page.uiComponents.button('split-btn').selectMenuItem(['Save As']);
      await expect(getOutput(page)).toHaveText('Split Menu: Save As');
    });

    test('should display Save All when selected from split menu', async ({ page }) => {
      await page.uiComponents.button('split-btn').clickSplit();
      await page.uiComponents.button('split-btn').selectMenuItem(['Save All']);
      await expect(getOutput(page)).toHaveText('Split Menu: Save All');
    });

    test('should display Draft when selecting nested Save Options > Draft', async ({ page }) => {
      await page.uiComponents.button('split-btn').clickSplit();
      await page.uiComponents.button('split-btn').selectMenuItem(['Save Options', 'Draft']);
      await expect(getOutput(page)).toHaveText('Split Menu: Draft');
    });

    test('should display Published when selecting nested Save Options > Published', async ({ page }) => {
      await page.uiComponents.button('split-btn').clickSplit();
      await page.uiComponents.button('split-btn').selectMenuItem(['Save Options', 'Published']);
      await expect(getOutput(page)).toHaveText('Split Menu: Published');
    });
  });
});
