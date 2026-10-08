import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

test.describe('Choices Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-choices.html'));
    await page.waitForLoadState('networkidle');
  });

  test.describe('Multi select', () => {
    test('should select multiple choices by label', async ({ page }) => {
      const choices = page.uiComponents.choices('sds-choices-multi');
      expect(await choices.isMulti()).toBe(true);

      await choices.selectChoicesByLabel(['Sports', 'Music']);
      const value = await choices.getValue();

      expect(value.selected).toEqual(expect.arrayContaining(['sports', 'music']));
    });

    test('should expose option inputs under checkboxGroup prefix', async ({ page }) => {
      const choices = page.uiComponents.choices('sds-choices-multi');
      await expect(await choices.getOptionInput('Sports')).toBeVisible();
    });
  });

  test.describe('Single select', () => {
    test('should select a single choice by label', async ({ page }) => {
      const choices = page.uiComponents.choices('sds-choices-single');
      expect(await choices.isMulti()).toBe(false);

      await choices.selectChoicesByLabel(['Reading']);
      const value = await choices.getValue();

      expect(value.selected).toBe('reading');
    });
  });

  test.describe('Other option', () => {
    test('should select other choice toggle', async ({ page }) => {
      const choices = page.uiComponents.choices('sds-choices-other');

      await choices.selectOtherChoice();
      const value = await choices.getValue();

      expect(value.otherSelected).toBe(true);
    });

    test('should fill other choice text box', async ({ page }) => {
      const choices = page.uiComponents.choices('sds-choices-other');

      await choices.fillOtherChoiceTextBox('Custom answer');
      const value = await choices.getValue();

      expect(value.otherSelected).toBe(true);
      expect(value.otherText).toBe('Custom answer');
    });

    test('should expose other locators', async ({ page }) => {
      const choices = page.uiComponents.choices('sds-choices-other');

      await expect(choices.getOtherToggleInput()).toBeVisible();
      await expect(choices.getOtherTextInput()).toBeVisible();
    });
  });

  test.describe('State', () => {
    test('should detect disabled state', async ({ page }) => {
      const choices = page.uiComponents.choices('sds-choices-disabled');
      expect(await choices.isDisabled()).toBe(true);
    });

    test('should detect read-only state is false for basic multi', async ({ page }) => {
      const choices = page.uiComponents.choices('sds-choices-multi');
      expect(await choices.isReadOnly()).toBe(false);
    });
  });

  test.describe('SDS namespace', () => {
    test('sdsComponents.choices should behave the same', async ({ page }) => {
      const choices = page.uiComponents.sdsComponents.choices('sds-choices-single');
      await choices.selectChoicesByLabel(['Music']);
      expect(await choices.getValue()).toMatchObject({ selected: 'music' });
    });
  });
});
