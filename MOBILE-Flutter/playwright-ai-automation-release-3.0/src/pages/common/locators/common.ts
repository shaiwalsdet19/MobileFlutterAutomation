export interface Locator {
  testId: string;
  description: string;
}

export const LoginLocators = {
  page: { testId: "dbx-common-section-login-page", description: "Root container for the login page" } as Locator,
  form: { testId: "dbx-common-form-login", description: "Login form container" } as Locator,
  usernameInput: { testId: "dbx-common-input-login-username", description: "Input field for username or employee ID" } as Locator,
  passwordInput: { testId: "dbx-common-input-login-password", description: "Input field for user password" } as Locator,
  emailInput: { testId: "dbx-common-input-login-email", description: "Input field for email address (OTP login)" } as Locator,
  otpInput: { testId: "dbx-common-input-login-otp", description: "Input field for OTP code" } as Locator,
  submitBtn: { testId: "dbx-common-btn-login-submit", description: "Button to submit login credentials" } as Locator,
  sendOtpBtn: { testId: "dbx-common-btn-login-send-otp", description: "Button to send OTP to email" } as Locator,
  forgotPasswordLink: { testId: "dbx-common-link-login-forgot-password", description: "Link to navigate to password recovery page" } as Locator,
  rememberMeCheckbox: { testId: "dbx-common-checkbox-login-remember-me", description: "Checkbox to remember user session" } as Locator,
  redirectDropdown: { testId: "dbx-common-dropdown-login-redirect", description: "Dropdown to select landing page after login" } as Locator,
  logoIcon: { testId: "dbx-common-icon-login-logo", description: "Company logo image on login page" } as Locator,
};
