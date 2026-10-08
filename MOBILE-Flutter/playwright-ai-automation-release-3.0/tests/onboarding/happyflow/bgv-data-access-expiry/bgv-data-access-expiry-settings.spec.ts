import { expect } from "@playwright/test";
import { test, InputsPage } from "../../../../src/fixtures/user-inputs.fixture";
import { getBaseUrl } from "../../../../data/instances";
import { getModuleData } from "../../../../data/modules";
import { loginToSystem } from "../../../../src/helpers/login";
import { OnboardingSettingsLocators } from "../../../../src/pages/onboarding/settings/locators/onboarding-settings";
import { OnboardingSettingsPage } from "../../../../src/pages/onboarding/settings/onboarding-settings.page";
import { waitForNetworkApis } from "../../../../src/helpers/network";

test.describe.configure({ mode: "serial", timeout: 240_000 });

const INSTANCE = process.env.INSTANCE ?? "ta6";
const BASE_URL = getBaseUrl(INSTANCE);
type OnboardingModuleData = {
  bgvDataAccessExpiry: {
    roles: {
      admin: string;
      onboardingAdmin: string;
    };
    values: {
      defaultDays: string;
      minimumDays: string;
    };
    messages: {
      tooltip: string;
    };
  };
};

const onboardingModuleData = getModuleData<OnboardingModuleData>("onboarding", "data");
const bgvDataAccessExpiryData = onboardingModuleData.bgvDataAccessExpiry;

async function openSettings(
  page: InputsPage,
  roleId: string = bgvDataAccessExpiryData.roles.admin
): Promise<OnboardingSettingsPage> {
  await loginToSystem(page, INSTANCE, roleId);
  await waitForNetworkApis(page);
  const onboardingSettingsPage = new OnboardingSettingsPage(page);
  await expect(page).toHaveURL(/dashboard|home/, { timeout: 30_000 });
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

test.describe("@onboarding-bgv-data-access-expiry-settings BGV Data Access Expiry Settings", () => {
  test("TC-009: should show the BGV data access expiry field group with the expected defaults", async ({
    page,
  }) => {
    const onboardingSettingsPage = await openSettings(page);

    if (!(await onboardingSettingsPage.isEnableBgvChecked())) {
      await onboardingSettingsPage.enableBgv();
      await saveAndWait(onboardingSettingsPage);
    }

    if (await onboardingSettingsPage.isBgvDataAccessExpiryChecked()) {
      await onboardingSettingsPage.disableBgvDataAccessExpiry();
      await saveAndWait(onboardingSettingsPage);
      await onboardingSettingsPage.navigate(BASE_URL);
    }

    await expect(
      byTestId(page, OnboardingSettingsLocators.enableBgvCheckbox.testId)
    ).toBeChecked();
    await expect(
      byTestId(page, OnboardingSettingsLocators.bgvDataAccessExpiryCheckbox.testId)
    ).not.toBeChecked();
    await expect(
      byTestId(page, OnboardingSettingsLocators.bgvDataAccessExpiryDaysInput.testId)
    ).toHaveValue(bgvDataAccessExpiryData.values.defaultDays);
    await expect(
      byTestId(page, OnboardingSettingsLocators.bgvDataAccessExpiryDaysInput.testId)
    ).toBeDisabled();

    await onboardingSettingsPage.assertBgvDataAccessExpiryTooltipVisible();
    await expect(
      await onboardingSettingsPage.getBgvDataAccessExpiryTooltipText()
    ).toBe(bgvDataAccessExpiryData.messages.tooltip);
  });

  test("TC-010: should enable the expiry input, save value 1, and persist it after reload", async ({
    page,
  }) => {
    const onboardingSettingsPage = await openSettings(page);

    await onboardingSettingsPage.enableBgvDataAccessExpiry();
    await expect(
      byTestId(page, OnboardingSettingsLocators.bgvDataAccessExpiryDaysInput.testId)
    ).toBeEnabled();

    await onboardingSettingsPage.setBgvDataAccessExpiryDays(
      bgvDataAccessExpiryData.values.minimumDays
    );
    await saveAndWait(onboardingSettingsPage);

    await onboardingSettingsPage.navigate(BASE_URL);
    await expect(
      byTestId(page, OnboardingSettingsLocators.bgvDataAccessExpiryCheckbox.testId)
    ).toBeChecked();
    await expect(
      byTestId(page, OnboardingSettingsLocators.bgvDataAccessExpiryDaysInput.testId)
    ).toHaveValue(bgvDataAccessExpiryData.values.minimumDays);
  });

  test("TC-016: should allow Onboarding Admin to update the expiry configuration and persist value 90", async ({
    page,
  }) => {
    const onboardingSettingsPage = await openSettings(
      page,
      bgvDataAccessExpiryData.roles.onboardingAdmin
    );

    if (!(await onboardingSettingsPage.isEnableBgvChecked())) {
      await onboardingSettingsPage.enableBgv();
      await saveAndWait(onboardingSettingsPage);
    }

    await onboardingSettingsPage.enableBgvDataAccessExpiry();
    await onboardingSettingsPage.setBgvDataAccessExpiryDays(
      bgvDataAccessExpiryData.values.defaultDays
    );
    await saveAndWait(onboardingSettingsPage);

    await onboardingSettingsPage.navigate(BASE_URL);
    await expect(
      byTestId(page, OnboardingSettingsLocators.bgvDataAccessExpiryCheckbox.testId)
    ).toBeChecked();
    await expect(
      byTestId(page, OnboardingSettingsLocators.bgvDataAccessExpiryDaysInput.testId)
    ).toHaveValue(bgvDataAccessExpiryData.values.defaultDays);
  });
});
