import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';

test.describe('FiltersUtils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:3333/playwright-filters.html');
    await page.waitForLoadState('networkidle');
  });

  test.describe('Set filter value and apply', () => {
    test('should set a textfield filter value, apply, and verify value', async ({ page }) => {
      const filters = page.uiComponents.filters('multi-filters');

      await filters.openPanel();
      await page.waitForTimeout(300);

      const nameInput = page.uiComponents.textInput('multi-filters-filter-name');
      await nameInput.fill('John Doe');
      await page.waitForTimeout(100);

      await filters.clickApply();
      await page.waitForTimeout(300);

      const value = await filters.getValue();
      expect(value.name).toBe('John Doe');
    });

    test('should set a dropdown filter value, apply, and verify value', async ({ page }) => {
      const filters = page.uiComponents.filters('multi-filters');

      await filters.openPanel();
      await page.waitForTimeout(300);

      const departmentDropdown = page.uiComponents.dropdown('multi-filters-filter-department');
      await departmentDropdown.selectOption('Engineering');
      await page.waitForTimeout(100);

      await filters.clickApply();
      await page.waitForTimeout(300);

      const value = await filters.getValue();
      expect(value.department).toEqual(['engineering']);
    });

    test('should set a checkbox filter value, apply, and verify value', async ({ page }) => {
      const filters = page.uiComponents.filters('multi-filters');

      await filters.openPanel();
      await page.waitForTimeout(300);

      const optionsGroup = filters.getGroupAccordion('options');
      await optionsGroup.expand();
      await page.waitForTimeout(200);

      const workTypeCheckbox = page.uiComponents.checkboxGroup('multi-filters-filter-isRemote');
      await workTypeCheckbox.checkOption('Remote');
      await page.waitForTimeout(100);

      await filters.clickApply();
      await page.waitForTimeout(300);

      const value = await filters.getValue();
      expect(value.isRemote).toContain('remote');
    });

    test('should set a radio filter value, apply, and verify value', async ({ page }) => {
      const filters = page.uiComponents.filters('multi-filters');

      await filters.openPanel();
      await page.waitForTimeout(300);

      const optionsGroup = filters.getGroupAccordion('options');
      await optionsGroup.expand();
      await page.waitForTimeout(200);

      const employmentTypeRadio = page.uiComponents.radioGroup('multi-filters-filter-employmentType');
      await employmentTypeRadio.selectOption('Full-time');
      await page.waitForTimeout(100);

      await filters.clickApply();
      await page.waitForTimeout(300);

      const value = await filters.getValue();
      expect(value.employmentType).toBe('fulltime');
    });
  });

  test.describe('Search filter and set value', () => {
    test('should search for a filter, set value, apply and verify', async ({ page }) => {
      const filters = page.uiComponents.filters('multi-filters');

      await filters.openPanel();
      await page.waitForTimeout(300);

      await filters.search('Name');
      await page.waitForTimeout(200);

      const nameInput = page.uiComponents.textInput('multi-filters-filter-name');
      await expect(nameInput.getHost()).toBeVisible();
      await nameInput.fill('Jane Smith');
      await page.waitForTimeout(100);

      await filters.clearSearch();
      await page.waitForTimeout(100);

      await filters.clickApply();
      await page.waitForTimeout(300);

      const value = await filters.getValue();
      expect(value.name).toBe('Jane Smith');
    });

    test('should search for dropdown filter, set value, apply and verify', async ({ page }) => {
      const filters = page.uiComponents.filters('multi-filters');

      await filters.openPanel();
      await page.waitForTimeout(300);

      await filters.search('Department');
      await page.waitForTimeout(200);

      const departmentDropdown = page.uiComponents.dropdown('multi-filters-filter-department');
      await departmentDropdown.selectOption('Marketing');
      await page.waitForTimeout(100);

      await filters.clearSearch();
      await page.waitForTimeout(100);

      await filters.clickApply();
      await page.waitForTimeout(300);

      const value = await filters.getValue();
      expect(value.department).toEqual(['marketing']);
    });
  });

  test.describe('Open filter group and set value', () => {
    test('should open dates group, set date filter, apply and verify', async ({ page }) => {
      const filters = page.uiComponents.filters('multi-filters');

      await filters.openPanel();
      await page.waitForTimeout(300);

      const datesGroup = filters.getGroupAccordion('dates');
      await datesGroup.expand();
      await page.waitForTimeout(200);

      const isOpen = await datesGroup.isOpen();
      expect(isOpen).toBe(true);

      const joinDatePicker = page.uiComponents.datepicker('multi-filters-filter-joinDate');
      await joinDatePicker.selectDate(new Date(2026, 0, 15));
      await page.waitForTimeout(100);

      await filters.clickApply();
      await page.waitForTimeout(300);

      const value = await filters.getValue();
      expect(value.joinDate).toBe('15/01/2026');
    });

    test('should open options group, set multiple filter values, apply and verify', async ({ page }) => {
      const filters = page.uiComponents.filters('multi-filters');

      await filters.openPanel();
      await page.waitForTimeout(300);

      const optionsGroup = filters.getGroupAccordion('options');
      await optionsGroup.expand();
      await page.waitForTimeout(200);

      const workTypeCheckbox = page.uiComponents.checkboxGroup('multi-filters-filter-isRemote');
      await workTypeCheckbox.checkOption('Hybrid');
      await page.waitForTimeout(100);

      const employmentTypeRadio = page.uiComponents.radioGroup('multi-filters-filter-employmentType');
      await employmentTypeRadio.selectOption('Contract');
      await page.waitForTimeout(100);

      await filters.clickApply();
      await page.waitForTimeout(300);

      const value = await filters.getValue();
      expect(value.isRemote).toContain('hybrid');
      expect(value.employmentType).toBe('contract');
    });

    test('should set filters across multiple groups, apply and verify all values', async ({ page }) => {
      const filters = page.uiComponents.filters('multi-filters');

      await filters.openPanel();
      await page.waitForTimeout(300);

      const nameInput = page.uiComponents.textInput('multi-filters-filter-name');
      await nameInput.fill('Test User');
      await page.waitForTimeout(100);

      const datesGroup = filters.getGroupAccordion('dates');
      await datesGroup.expand();
      await page.waitForTimeout(200);

      const joinDatePicker = page.uiComponents.datepicker('multi-filters-filter-joinDate');
      await joinDatePicker.selectDate(new Date(2026, 5, 20));
      await page.waitForTimeout(100);

      const optionsGroup = filters.getGroupAccordion('options');
      await optionsGroup.expand();
      await page.waitForTimeout(200);

      const employmentTypeRadio = page.uiComponents.radioGroup('multi-filters-filter-employmentType');
      await employmentTypeRadio.selectOption('Part-time');
      await page.waitForTimeout(100);

      await filters.clickApply();
      await page.waitForTimeout(300);

      const value = await filters.getValue();
      expect(value.name).toBe('Test User');
      expect(value.joinDate).toBe('20/06/2026');
      expect(value.employmentType).toBe('parttime');
    });
  });

  test.describe('Cancel with Confirmation Dialog', () => {
    test('should close panel and revert values when closePanel is called with unsaved changes', async ({ page }) => {
      const filters = page.uiComponents.filters('multi-filters');

      await filters.openPanel();
      await page.waitForTimeout(300);

      const nameInput = page.uiComponents.textInput('multi-filters-filter-name');
      await nameInput.fill('Initial Value');
      await page.waitForTimeout(100);
      await filters.clickApply();
      await page.waitForTimeout(300);

      const initialValue = await filters.getValue();
      expect(initialValue.name).toBe('Initial Value');

      await filters.openPanel();
      await page.waitForTimeout(300);
      await nameInput.fill('Changed Value');
      await page.waitForTimeout(100);

      await filters.closePanel();
      await page.waitForTimeout(300);

      expect(await filters.isPanelOpen()).toBe(false);

      const revertedValue = await filters.getValue();
      expect(revertedValue.name).toBe('Initial Value');
    });

    test('should close panel directly when no changes have been made', async ({ page }) => {
      const filters = page.uiComponents.filters('multi-filters');

      await filters.openPanel();
      await page.waitForTimeout(300);
      expect(await filters.isPanelOpen()).toBe(true);

      await filters.closePanel();
      await page.waitForTimeout(300);
      expect(await filters.isPanelOpen()).toBe(false);
    });

    test('should close panel and revert dropdown filter values', async ({ page }) => {
      const filters = page.uiComponents.filters('multi-filters');

      await filters.openPanel();
      await page.waitForTimeout(300);

      const departmentDropdown = page.uiComponents.dropdown('multi-filters-filter-department');
      await departmentDropdown.selectOption('Engineering');
      await page.waitForTimeout(100);
      await filters.clickApply();
      await page.waitForTimeout(300);

      const initialValue = await filters.getValue();
      expect(initialValue.department).toEqual(['engineering']);

      await filters.openPanel();
      await page.waitForTimeout(300);
      await departmentDropdown.selectOption('Marketing');
      await page.waitForTimeout(100);

      await filters.closePanel();
      await page.waitForTimeout(1000);

      expect(await filters.isPanelOpen()).toBe(false);

      const revertedValue = await filters.getValue();
      expect(revertedValue.department).toEqual(['engineering']);
    });

    test('should close panel and revert radio filter values', async ({ page }) => {
      const filters = page.uiComponents.filters('multi-filters');

      await filters.openPanel();
      await page.waitForTimeout(300);

      const optionsGroup = filters.getGroupAccordion('options');
      await optionsGroup.expand();
      await page.waitForTimeout(200);

      const employmentTypeRadio = page.uiComponents.radioGroup('multi-filters-filter-employmentType');
      await employmentTypeRadio.selectOption('Full-time');
      await page.waitForTimeout(100);
      await filters.clickApply();
      await page.waitForTimeout(300);

      const initialValue = await filters.getValue();
      expect(initialValue.employmentType).toBe('fulltime');

      await filters.openPanel();
      await page.waitForTimeout(300);

      await optionsGroup.expand();
      await page.waitForTimeout(200);

      await employmentTypeRadio.selectOption('Contract');
      await page.waitForTimeout(100);

      await filters.closePanel();
      await page.waitForTimeout(1000);

      expect(await filters.isPanelOpen()).toBe(false);

      const revertedValue = await filters.getValue();
      expect(revertedValue.employmentType).toBe('fulltime');
    });
  });
});
