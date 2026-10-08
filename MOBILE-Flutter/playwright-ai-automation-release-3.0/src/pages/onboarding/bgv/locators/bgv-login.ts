import { Locator } from "../../../common/locators/common";

// https://ta6.qa.darwinbox.io/onboarding/onboarding/bgv
//
// Live exploration summary:
// - The route renders the public BGV sign-in shell for this onboarding URL family.
// - Exactly six automation-relevant elements expose `data-testid` on the live page.
// - After valid credentials are entered, the same form can reveal the OTP step before the
//   flow continues to the downstream `/onboarding/onboarding/bgvemployees` page.
// - Non-testid elements such as the password-visibility icon and OTP countdown are omitted
//   to keep the locator file strictly testid-only.

export const BgvLoginLocators = {
  form: {
    testId: "dbx-onboarding-form-bgv-login",
    description: "BGV sign-in form rendered on the onboarding BGV route",
  } as Locator,

  emailInput: {
    testId: "dbx-onboarding-input-email",
    description: "Email address input used for the BGV sign-in flow",
  } as Locator,

  passwordInput: {
    testId: "dbx-onboarding-input-password",
    description: "Password input used for the BGV sign-in flow",
  } as Locator,

  otpInput: {
    testId: "dbx-onboarding-input-otp",
    description: "OTP input that becomes visible once the credential step advances",
  } as Locator,

  resendOtpButton: {
    testId: "dbx-onboarding-btn-resend-otp",
    description: "Resend OTP button shown on the OTP step and initially disabled during countdown",
  } as Locator,

  signInButton: {
    testId: "dbx-onboarding-btn-sign-in",
    description: "Primary submit control used to continue the BGV sign-in flow",
  } as Locator,
} as const;
