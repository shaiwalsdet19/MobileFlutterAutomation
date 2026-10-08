import { expect } from "@playwright/test";
import { test, InputsPage } from "../../../src/fixtures/user-inputs.fixture";
import { getBaseUrl } from "../../../data/instances";
import { getModuleData } from "../../../data/modules";
import { loginToSystem } from "../../../src/helpers/login";
import { OnboardingSettingsLocators } from "../../../src/pages/onboarding/settings/locators/onboarding-settings";
import { OnboardingSettingsPage } from "../../../src/pages/onboarding/settings/onboarding-settings.page";
import { waitForNetworkApis } from "../../../src/helpers/network";

test.describe.configure({ mode: "serial", timeout: 240_000 });

const INSTANCE = process.env.INSTANCE ?? "ta6";
const BASE_URL = getBaseUrl(INSTANCE);
type OnboardingModuleData = {
  bgvDataAccessExpiry: {
    roles: {
      admin: string;
    };
    values: {
      minimumDays: string;
      invalidDecimalDays: string;
    };
    messages: {
      wholeNumberError: string;
      blankValueError: string;
    };
  };
};

const onboardingModuleData = getModuleData<OnboardingModuleData>("onboarding", "data");
const bgvDataAccessExpiryData = onboardingModuleData.bgvDataAccessExpiry;

async function openSettings(page: InputsPage): Promise<OnboardingSettingsPage> {
  await loginToSystem(page, INSTANCE, bgvDataAccessExpiryData.roles.admin);
  await waitForNetworkApis(page);
  const onboardingSettingsPage = new OnboardingSettingsPage(page);
  await onboardingSettingsPage.navigate(BASE_URL);
  
  return onboardingSettingsPage;
}

function byTestId(page: InputsPage, testId: string) {
  return page.getByTestId(testId);
}

async function saveAndWait(onboardingSettingsPage: OnboardingSettingsPage): Promise<void> {
  const response = await onboardingSettingsPage.clickSave();

  if (response) {
    expect(response.ok()).toBeTruthy();
  }

  await onboardingSettingsPage.waitForPageReady();
}

async function ensureEnableBgvOn(onboardingSettingsPage: OnboardingSettingsPage): Promise<void> {
  if (!(await onboardingSettingsPage.isEnableBgvChecked())) {
    await onboardingSettingsPage.enableBgv();
    await saveAndWait(onboardingSettingsPage);
  }
}

test.describe("@onboarding-bgv-data-access-expiry-validation BGV Data Access Expiry Validation", () => {
  test("TC-021: should hide the expiry field group when Enable BGV is turned off", async ({
    page,
  }) => {
    const onboardingSettingsPage = await openSettings(page);

    await onboardingSettingsPage.disableBgv();
    await saveAndWait(onboardingSettingsPage);

    await expect(
      byTestId(page, OnboardingSettingsLocators.enableBgvCheckbox.testId)
    ).not.toBeChecked();
    await expect(
      await onboardingSettingsPage.isBgvDataAccessExpiryVisible()
    ).toBeFalsy();
    await expect(
      await onboardingSettingsPage.isBgvDataAccessExpiryTooltipVisible()
    ).toBeFalsy();
  });

  test("TC-023: should show the required-days validation when the expiry field is blank", async ({
    page,
  }) => {
    const onboardingSettingsPage = await openSettings(page);

    await ensureEnableBgvOn(onboardingSettingsPage);
    await onboardingSettingsPage.enableBgvDataAccessExpiry();
    await onboardingSettingsPage.clearBgvDataAccessExpiryDays();
    await saveAndWait(onboardingSettingsPage);

    await onboardingSettingsPage.assertErrorSummaryVisible();
    await expect(await onboardingSettingsPage.getErrorSummaryText()).toContain(
      bgvDataAccessExpiryData.messages.blankValueError
    );
  });

  test("TC-024: should save without validation when the expiry checkbox is unchecked", async ({
    page,
  }) => {
    const onboardingSettingsPage = await openSettings(page);

    await ensureEnableBgvOn(onboardingSettingsPage);
    await onboardingSettingsPage.disableBgvDataAccessExpiry();
    await saveAndWait(onboardingSettingsPage);

    await onboardingSettingsPage.assertErrorSummaryHidden();
    await expect(
      byTestId(page, OnboardingSettingsLocators.bgvDataAccessExpiryCheckbox.testId)
    ).not.toBeChecked();
  });
});
