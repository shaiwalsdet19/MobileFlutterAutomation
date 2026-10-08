import { test, expect } from '../../../src/fixtures/ui-components.fixture.js';
import { getDboxUILibraryBasePath } from '../../../data/instances/index.js';

test.describe('Country Dropdown Wrapper Utils', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(getDboxUILibraryBasePath('playwright-tests/playwright-country-dropdown.html'));
    await page.waitForLoadState('networkidle');
    await page.getByTestId('sds-country-phone').waitFor({ state: 'visible' });
  });

  test.describe('Phone mode', () => {
    test('should expose supported options with phone metadata', async ({ page }) => {
      const countryDropdown = page.uiComponents.countryDropdown('sds-country-phone');
      expect(await countryDropdown.isPhone()).toBe(true);

      const options = await countryDropdown.getSupportedOptions();
      const india = options.find(option => option.countryCode === 'IN');

      expect(india).toBeDefined();
      expect(india?.phoneCode).toBe('+91');
      expect(india?.label).toBeTruthy();
    });

    test('should select country by phone code', async ({ page }) => {
      const countryDropdown = page.uiComponents.countryDropdown('sds-country-phone');

      await countryDropdown.selectCountryByPhoneCode('+91');
      expect((await countryDropdown.getValue())?.countryCode).toBe('IN');
    });

    test('should select country by phone code and fill input', async ({ page }) => {
      const countryDropdown = page.uiComponents.countryDropdown('sds-country-phone');

      await countryDropdown.selectCountryByPhoneCode('+91', '9876543210');
      const value = await countryDropdown.getValue();

      expect(value?.countryCode).toBe('IN');
      expect(value?.value).toBe('9876543210');
    });

    test('should select country by country code with numeric value', async ({ page }) => {
      const countryDropdown = page.uiComponents.countryDropdown('sds-country-phone');

      await countryDropdown.selectCountryByCountryCode('IN', '9876543210');
      const value = await countryDropdown.getValue();

      expect(value?.countryCode).toBe('IN');
      expect(value?.value).toBe('9876543210');
    });
  });

  test.describe('Currency mode', () => {
    test('should select country by currency code', async ({ page }) => {
      const countryDropdown = page.uiComponents.countryDropdown('sds-country-currency');
      expect(await countryDropdown.isPhone()).toBe(false);

      await countryDropdown.selectCountryByCurrencyCode('INR');
      expect((await countryDropdown.getValue())?.countryCode).toBe('IN');
    });
  });

  test.describe('Input', () => {
    test('should fill input after selecting country', async ({ page }) => {
      const countryDropdown = page.uiComponents.countryDropdown('sds-country-phone');

      await countryDropdown.selectCountryByPhoneCode('+91');
      await countryDropdown.fillInput('1234567890');
      expect((await countryDropdown.getValue())?.value).toBe('1234567890');
    });
  });

  test.describe('Allowed countries', () => {
    test('should only expose allowed supported options', async ({ page }) => {
      const countryDropdown = page.uiComponents.countryDropdown('sds-country-allowed');
      const options = await countryDropdown.getSupportedOptions();

      expect(options.every(option => ['IN', 'US'].some(code => option.countryCode.includes(code)))).toBe(true);
    });

    test('should reject unsupported phone codes', async ({ page }) => {
      const countryDropdown = page.uiComponents.countryDropdown('sds-country-allowed');

      await expect(countryDropdown.selectCountryByPhoneCode('+44')).rejects.toThrow(/No supported option found/);
    });

    test('should select allowed country by phone code', async ({ page }) => {
      const countryDropdown = page.uiComponents.countryDropdown('sds-country-allowed');

      await countryDropdown.selectCountryByPhoneCode('+91');
      expect((await countryDropdown.getValue())?.countryCode).toBe('IN');
    });
  });

  test.describe('State', () => {
    test('should detect disabled state', async ({ page }) => {
      const countryDropdown = page.uiComponents.countryDropdown('sds-country-disabled');
      expect(await countryDropdown.isDisabled()).toBe(true);
    });

    test('should detect read-only state', async ({ page }) => {
      const countryDropdown = page.uiComponents.countryDropdown('sds-country-readonly');
      expect(await countryDropdown.isReadOnly()).toBe(true);
      await expect(countryDropdown.getReadOnly()).toBeVisible();
    });
  });

  test.describe('SDS namespace', () => {
    test('sdsComponents.countryDropdown should behave the same', async ({ page }) => {
      const countryDropdown = page.uiComponents.sdsComponents.countryDropdown('sds-country-phone');

      await countryDropdown.selectCountryByPhoneCode('+91', '9876543210');
      const value = await countryDropdown.getValue();

      expect(value?.countryCode).toBe('IN');
      expect(value?.value).toBe('9876543210');
    });
  });
});
