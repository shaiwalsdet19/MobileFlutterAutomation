import path from 'path';
import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

const sampleSignaturePng = path.join(__dirname, '../../../test-assets/attachments/sample-signature.png');

test.describe('Picture Choices Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-picture-choices.html'));
    await page.waitForLoadState('networkidle');
    await page.getByTestId('sds-picture-choices-single').waitFor({ state: 'visible' });
  });

  test.describe('selectOptionByLabel', () => {
    test('should select a single option by label', async ({ page }) => {
      const pictureChoices = page.uiComponents.pictureChoices('sds-picture-choices-single');
      expect(await pictureChoices.isMulti()).toBe(false);

      await pictureChoices.selectOptionByLabel(['Option B']);
      expect(await pictureChoices.getValue()).toEqual(
        expect.objectContaining({ selected: 'opt-b' }),
      );
    });
  });

  test.describe('selectOptionByValue', () => {
    test('should select multiple options by value', async ({ page }) => {
      const pictureChoices = page.uiComponents.pictureChoices('sds-picture-choices-multi');
      expect(await pictureChoices.isMulti()).toBe(true);

      await pictureChoices.selectOptionByValue(['opt-a', 'opt-c']);
      expect(await pictureChoices.getValue()).toEqual(
        expect.objectContaining({
          selected: expect.arrayContaining(['opt-a', 'opt-c']),
        }),
      );
    });
  });

  test.describe('selectOtherOption', () => {
    test('should upload image and fill other text', async ({ page }) => {
      const pictureChoices = page.uiComponents.pictureChoices('sds-picture-choices-other');

      await pictureChoices.selectOtherOption(sampleSignaturePng, 'Custom');
      expect(await pictureChoices.getValue()).toEqual(
        expect.objectContaining({
          otherSelected: true,
          otherValue: expect.objectContaining({
            s3Key: 'playwright-tests/picture-choice-other.png',
            otherInputValue: 'Custom',
          }),
        }),
      );
    });
  });

  test.describe('State', () => {
    test('should detect disabled state', async ({ page }) => {
      const pictureChoices = page.uiComponents.pictureChoices('sds-picture-choices-disabled');
      expect(await pictureChoices.isDisabled()).toBe(true);
    });
  });

  test.describe('SDS namespace', () => {
    test('sdsComponents.pictureChoices should select by label', async ({ page }) => {
      const pictureChoices = page.uiComponents.sdsComponents.pictureChoices('sds-picture-choices-single');

      await pictureChoices.selectOptionByLabel(['Option A']);
      expect(await pictureChoices.getValue()).toEqual(
        expect.objectContaining({ selected: 'opt-a' }),
      );
    });
  });
});
