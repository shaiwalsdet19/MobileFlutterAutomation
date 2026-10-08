import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances';

test.describe('Tab Group Component', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tab.html'));
  });

  test.describe('Horizontal Tabs', () => {
    const testId = 'horizontal-tabs';

    test('should get initial selected tab id', async ({ page }) => {
      const selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('tab-1');
    });

    test('should get initial selected tab label', async ({ page }) => {
      const selectedLabel = await page.uiComponents.tabGroup(testId).getSelectedTabLabel();
      expect(selectedLabel).toBe('Dashboard');
    });

    test('should get tabs array', async ({ page }) => {
      const tabs = await page.uiComponents.tabGroup(testId).getTabs();
      expect(tabs).toHaveLength(5);
      expect(tabs[0].label).toBe('Dashboard');
      expect(tabs[1].label).toBe('Reports');
    });

    test('should select tab by id', async ({ page }) => {
      await page.uiComponents.tabGroup(testId).selectTab('tab-2');

      const selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('tab-2');
    });

    test('should select tab by label', async ({ page }) => {
      await page.uiComponents.tabGroup(testId).selectTabByLabel('Analytics');

      const selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('tab-3');
    });

    test('should check if tab is selected', async ({ page }) => {
      const isTab1Selected = await page.uiComponents.tabGroup(testId).isTabSelected('tab-1');
      const isTab2Selected = await page.uiComponents.tabGroup(testId).isTabSelected('tab-2');

      expect(isTab1Selected).toBe(true);
      expect(isTab2Selected).toBe(false);
    });

    test('should update output when tab is clicked', async ({ page }) => {
      const tabOutput = page.getByTestId('tab-output');

      await page.uiComponents.tabGroup(testId).selectTab('tab-3');

      await expect(tabOutput).toContainText('Analytics');
    });

    test('should get tab item locator', async ({ page }) => {
      const tabItem = page.uiComponents.tabGroup(testId).getTabItem('tab-1');
      await expect(tabItem).toBeVisible();
    });
  });

  test.describe('Vertical Tabs', () => {
    const testId = 'vertical-tabs';

    test('should get initial selected tab id', async ({ page }) => {
      const selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('tab-1');
    });

    test('should get initial selected tab label', async ({ page }) => {
      const selectedLabel = await page.uiComponents.tabGroup(testId).getSelectedTabLabel();
      expect(selectedLabel).toBe('Overview');
    });

    test('should select tab by id', async ({ page }) => {
      await page.uiComponents.tabGroup(testId).selectTab('tab-3');

      const selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('tab-3');
    });

    test('should select tab by label', async ({ page }) => {
      await page.uiComponents.tabGroup(testId).selectTabByLabel('Comments');

      const selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('tab-4');
    });

    test('should update output when tab is clicked', async ({ page }) => {
      const tabOutput = page.getByTestId('tab-output');

      await page.uiComponents.tabGroup(testId).selectTab('tab-2');

      await expect(tabOutput).toContainText('Details');
    });
  });

  test.describe('Nested Tabs (Vertical with Children)', () => {
    const testId = 'nested-tabs';

    test('should get initial selected tab id (child tab)', async ({ page }) => {
      const selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('general');
    });

    test('should get initial selected tab label (child tab)', async ({ page }) => {
      const selectedLabel = await page.uiComponents.tabGroup(testId).getSelectedTabLabel();
      expect(selectedLabel).toBe('General');
    });

    test('should get tabs array with children', async ({ page }) => {
      const tabs = await page.uiComponents.tabGroup(testId).getTabs();
      expect(tabs).toHaveLength(3);
      expect(tabs[0].label).toBe('Settings');
      expect(tabs[0].children).toHaveLength(3);
      expect(tabs[0].children?.[0].label).toBe('General');
    });

    test('should select nested child tab by id array', async ({ page }) => {
      await page.uiComponents.tabGroup(testId).selectTab(['settings', 'theme']);

      const selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('theme');
    });

    test('should select nested child tab by label array', async ({ page }) => {
      await page.uiComponents.tabGroup(testId).selectTabByLabel(['Profile', 'Avatar']);

      const selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('avatar');
    });

    test('should check if nested child tab is selected', async ({ page }) => {
      const isGeneralSelected = await page.uiComponents.tabGroup(testId).isTabSelected('settings/general');
      expect(isGeneralSelected).toBe(true);

      await page.uiComponents.tabGroup(testId).selectTab(['settings', 'theme']);
      const isThemeSelected = await page.uiComponents.tabGroup(testId).isTabSelected('settings/theme');
      expect(isThemeSelected).toBe(true);
    });

    test('should update output when nested tab is clicked', async ({ page }) => {
      const tabOutput = page.getByTestId('tab-output');

      await page.uiComponents.tabGroup(testId).selectTab(['help', 'faq']);

      await expect(tabOutput).toContainText('Help > FAQ');
    });

    test('should select child tabs from different parents', async ({ page }) => {
      await page.uiComponents.tabGroup(testId).selectTab(['profile', 'preferences']);
      let selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('preferences');

      await page.uiComponents.tabGroup(testId).selectTab(['help', 'support']);
      selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('support');
    });
  });

  test.describe('Overflow Tabs', () => {
    const testId = 'overflow-tabs';

    test('should get initial selected tab id', async ({ page }) => {
      const selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('tab-1');
    });

    test('should select visible tab by id', async ({ page }) => {
      await page.uiComponents.tabGroup(testId).selectTab('tab-2');

      const selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('tab-2');
    });

    test('should have overflow menu when tabs overflow', async ({ page }) => {
      const overflowMenu = page.uiComponents.tabGroup(testId).getOverflowMenu();
      await expect(overflowMenu).toBeVisible();
    });

    test('should get all tabs including overflow', async ({ page }) => {
      const tabs = await page.uiComponents.tabGroup(testId).getTabs();
      expect(tabs).toHaveLength(7);
    });

    test('should select tab from overflow menu by id', async ({ page }) => {
      const tabOutput = page.getByTestId('tab-output');

      await page.uiComponents.tabGroup(testId).selectTab('tab-6');

      const selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('tab-6');
      await expect(tabOutput).toContainText('Privacy');
    });

    test('should select tab from overflow menu by label', async ({ page }) => {
      const tabOutput = page.getByTestId('tab-output');

      await page.uiComponents.tabGroup(testId).selectTabByLabel('Security');

      const selectedId = await page.uiComponents.tabGroup(testId).getSelectedTabId();
      expect(selectedId).toBe('tab-7');
      await expect(tabOutput).toContainText('Security');
    });

    test('should select multiple tabs from overflow menu', async ({ page }) => {
      await page.uiComponents.tabGroup(testId).selectTab('tab-5');
      expect(await page.uiComponents.tabGroup(testId).getSelectedTabId()).toBe('tab-5');

      await page.uiComponents.tabGroup(testId).selectTab('tab-7');
      expect(await page.uiComponents.tabGroup(testId).getSelectedTabId()).toBe('tab-7');

      await page.uiComponents.tabGroup(testId).selectTab('tab-6');
      expect(await page.uiComponents.tabGroup(testId).getSelectedTabId()).toBe('tab-6');
    });
  });

  test.describe('State Queries', () => {
    test('should check isTabSelected for horizontal tabs', async ({ page }) => {
      const testId = 'horizontal-tabs';

      expect(await page.uiComponents.tabGroup(testId).isTabSelected('tab-1')).toBe(true);
      expect(await page.uiComponents.tabGroup(testId).isTabSelected('tab-2')).toBe(false);

      await page.uiComponents.tabGroup(testId).selectTab('tab-4');

      expect(await page.uiComponents.tabGroup(testId).isTabSelected('tab-1')).toBe(false);
      expect(await page.uiComponents.tabGroup(testId).isTabSelected('tab-4')).toBe(true);
    });

    test('should check isTabSelected for nested tabs', async ({ page }) => {
      const testId = 'nested-tabs';

      expect(await page.uiComponents.tabGroup(testId).isTabSelected('settings/general')).toBe(true);
      expect(await page.uiComponents.tabGroup(testId).isTabSelected('settings/theme')).toBe(false);

      await page.uiComponents.tabGroup(testId).selectTab(['settings', 'notifications']);

      expect(await page.uiComponents.tabGroup(testId).isTabSelected('settings/notifications')).toBe(true);
    });
  });
});
