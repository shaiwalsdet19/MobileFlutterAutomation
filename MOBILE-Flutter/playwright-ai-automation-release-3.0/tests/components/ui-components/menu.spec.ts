import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances';

test.describe('Menu Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-menu.html'));
  });

  test.describe('Click-Triggered Menu', () => {
    test('should select direct item (Edit)', async ({ page }) => {
      const menuOutput = page.getByTestId('menu-output');

      await page.uiComponents.menu('click-menu').open();
      await page.uiComponents.menu('click-menu').selectItem(['Edit']);

      await expect(menuOutput).toHaveText('Edit');
    });

    test('should select direct item (Delete)', async ({ page }) => {
      const menuOutput = page.getByTestId('menu-output');

      await page.uiComponents.menu('click-menu').open();
      await page.uiComponents.menu('click-menu').selectItem(['Delete']);

      await expect(menuOutput).toHaveText('Delete');
    });

    test('should select direct item (Copy)', async ({ page }) => {
      const menuOutput = page.getByTestId('menu-output');

      await page.uiComponents.menu('click-menu').open();
      await page.uiComponents.menu('click-menu').selectItem(['Copy']);

      await expect(menuOutput).toHaveText('Copy');
    });

    test('should select nested item (Export > PDF)', async ({ page }) => {
      const menuOutput = page.getByTestId('menu-output');

      await page.uiComponents.menu('click-menu').open();
      await page.uiComponents.menu('click-menu').selectItem(['Export', 'PDF']);

      await expect(menuOutput).toHaveText('Export/PDF');
    });

    test('should select nested item (Export > Excel)', async ({ page }) => {
      const menuOutput = page.getByTestId('menu-output');

      await page.uiComponents.menu('click-menu').open();
      await page.uiComponents.menu('click-menu').selectItem(['Export', 'Excel']);

      await expect(menuOutput).toHaveText('Export/Excel');
    });

    test('should select nested item (Export > CSV)', async ({ page }) => {
      const menuOutput = page.getByTestId('menu-output');

      await page.uiComponents.menu('click-menu').open();
      await page.uiComponents.menu('click-menu').selectItem(['Export', 'CSV']);

      await expect(menuOutput).toHaveText('Export/CSV');
    });
  });

  test.describe('Hover-Triggered Menu', () => {
    test('should select direct item (View)', async ({ page }) => {
      const menuOutput = page.getByTestId('menu-output');

      await page.uiComponents.menu('hover-menu').open();
      await page.uiComponents.menu('hover-menu').selectItem(['View']);

      await expect(menuOutput).toHaveText('View');
    });

    test('should select direct item (Refresh)', async ({ page }) => {
      const menuOutput = page.getByTestId('menu-output');

      await page.uiComponents.menu('hover-menu').open();
      await page.uiComponents.menu('hover-menu').selectItem(['Refresh']);

      await expect(menuOutput).toHaveText('Refresh');
    });

    test('should select nested item (Settings > General)', async ({ page }) => {
      const menuOutput = page.getByTestId('menu-output');

      await page.uiComponents.menu('hover-menu').open();
      await page.uiComponents.menu('hover-menu').selectItem(['Settings', 'General']);

      await expect(menuOutput).toHaveText('Settings/General');
    });

    test('should select deeply nested item (Settings > Advanced > Theme)', async ({ page }) => {
      const menuOutput = page.getByTestId('menu-output');

      await page.uiComponents.menu('hover-menu').open();
      await page.uiComponents.menu('hover-menu').selectItem(['Settings', 'Advanced', 'Theme']);

      await expect(menuOutput).toHaveText('Settings/Advanced/Theme');
    });

    test('should select deeply nested item (Settings > Advanced > Notifications)', async ({ page }) => {
      const menuOutput = page.getByTestId('menu-output');

      await page.uiComponents.menu('hover-menu').open();
      await page.uiComponents.menu('hover-menu').selectItem(['Settings', 'Advanced', 'Notifications']);

      await expect(menuOutput).toHaveText('Settings/Advanced/Notifications');
    });
  });

  test.describe('Menu Item Visibility', () => {
    test('should check if direct menu item is visible after opening', async ({ page }) => {
      await page.uiComponents.menu('click-menu').open();

      const isVisible = await page.uiComponents.menu('click-menu').isItemVisible('Edit');
      expect(isVisible).toBe(true);
    });

    test('should check nested menu item visibility', async ({ page }) => {
      await page.uiComponents.menu('click-menu').open();
      await page.uiComponents.menu('click-menu').getMenuItem('Export').click();
      await page.waitForTimeout(100);

      const isVisible = await page.uiComponents.menu('click-menu').isItemVisible('Export/PDF');
      expect(isVisible).toBe(true);
    });
  });
});
