package com.pages.mobileLogin;

import com.darwinbox.framework.flutter.FlutterElement;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.parameters.helpsers.FlutterHelpers;
import org.openqa.selenium.By;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * Page object for mobile SDS login, onboarding, splash routing, and credential login.
 * <p>
 * Locators for TC-001 are intentionally empty — set {@code By.id(...)} / ValueKey strings
 * after inspecting the Flutter build.
 */
public class MobileLoginPage extends FlutterHelpers {

    private static final Logger logger = LoggerFactory.getLogger(MobileLoginPage.class);

    // -------------------------------------------------------------------------
    // TC-001 (CH-001): Splash → Onboarding S1.1 routing — fill before execution
    // -------------------------------------------------------------------------

    @SuppressWarnings("unused")
    private final By splashScreenLogo = By.id("");

    @SuppressWarnings("unused")
    private final By splashScreen = By.id("");

    @SuppressWarnings("unused")
    private final By onboardingScreenS11 = By.id("");

    @SuppressWarnings("unused")
    private final By onboardingScreenTitle = By.id("");

    @SuppressWarnings("unused")
    private final By onboardingPaginationDots = By.id("");

    @SuppressWarnings("unused")
    private final By recurringLoginScreen = By.id("");

    @SuppressWarnings("unused")
    private final By dashboardScreen = By.id("");

    /** ValueKey for splash / branding anchor (maps to {@link #splashScreen}). */
    private static final String SPLASH_SCREEN_KEY = "splash_screen_key";

    /** ValueKey for onboarding card S1.1 (maps to {@link #onboardingScreenS11}). */
    private static final String ONBOARDING_SCREEN_S11_KEY = "btn_get_started";

    /** ValueKey for recurring login screen 7 (maps to {@link #recurringLoginScreen}). */
    private static final String RECURRING_LOGIN_SCREEN_KEY = "recurring_login_screen_key";

    /** ValueKey for dashboard root (maps to {@link #dashboardScreen}). */
    private static final String DASHBOARD_SCREEN_KEY = "dashboard_screen_key";

    // -------------------------------------------------------------------------
    // TC-002 (CH-001): Returning user → Recurring Login Screen 7 (fill before execution)
    // -------------------------------------------------------------------------

    @SuppressWarnings("unused")
    private final By recurringLoginTenantLogo = By.id("");

    @SuppressWarnings("unused")
    private final By recurringLoginTitle = By.id("");

    @SuppressWarnings("unused")
    private final By recurringLoginSavedAccountCard = By.id("");

    @SuppressWarnings("unused")
    private final By recurringLoginSavedAccountName = By.id("");

    @SuppressWarnings("unused")
    private final By recurringLoginSavedAccountMaskedIdentifier = By.id("");

    @SuppressWarnings("unused")
    private final By recurringLoginBiometricCta = By.id("");

    @SuppressWarnings("unused")
    private final By recurringLoginOtherSignInOptionsCta = By.id("");

    /** ValueKey for tenant logo on Screen 7. */
    private static final String RECURRING_LOGIN_TENANT_LOGO_KEY = "";

    /** ValueKey for title text on Screen 7 (e.g., \"Let's Bring You Back\"). */
    private static final String RECURRING_LOGIN_TITLE_KEY = "";

    /** ValueKey for saved account card container on Screen 7. */
    private static final String RECURRING_LOGIN_SAVED_ACCOUNT_CARD_KEY = "";

    /** ValueKey for biometric CTA on Screen 7. */
    private static final String RECURRING_LOGIN_BIOMETRIC_CTA_KEY = "";

    /** ValueKey for Other Sign In Options CTA on Screen 7. */
    private static final String RECURRING_LOGIN_OTHER_SIGNIN_OPTIONS_CTA_KEY = "";

    // -------------------------------------------------------------------------
    // Legacy / credential login locators (existing automation)
    // -------------------------------------------------------------------------

    public FlutterElement getSplashScreenCarousel() {
        return getFinder().byValueKey("00000000-0000-03b9-ffff-ffff00000002");
    }

    public FlutterElement get1stCourosel() {
        return getFinder().byValueKey("Create Your Requests on, \\n the Go");
    }

    public FlutterElement get2ndCourosel() {
        return getFinder().byValueKey("Turn Insights Into Impact,\\n Everyday");
    }

    public FlutterElement get3rdCourosel() {
        return getFinder().byValueKey("Cultivated a Connected,\\n Worklife");
    }

    public FlutterElement get4thCourosel() {
        return getFinder().byValueKey("All-in-One App!,\\n Empowering Your Work, \\n Journey");
    }

    public FlutterElement getGetStartedButtonText() {
        return getFinder().byText("Get Started");
    }

    public FlutterElement getGetStartedButton() {
        return getFinder().byValueKey("Get Started");
    }

    public FlutterElement getIfYouAreAnExEmployee() {
        return getFinder().byText("If you're an ex-employee,");
    }

    public FlutterElement getSignInAsAlumniText() {
        return getFinder().byText("Sign In as Alumni");
    }

    public FlutterElement getSignInAsAlumni() {
        return getFinder().byValueKey("Sign In as Alumni");
    }

    public FlutterElement getTermsOfServiceText() {
        return getFinder().byText("Terms of Service");
    }

    public FlutterElement getTermsOfService() {
        return getFinder().byValueKey("Terms of Service");
    }

    public FlutterElement getPrivacyPolicyText() {
        return getFinder().byText("Privacy Policy");
    }

    public FlutterElement getPrivacyPolicy() {
        return getFinder().byValueKey("Privacy Policy");
    }

    public FlutterElement getServicePolicySeparator() {
        return getFinder().byValueKey("separator |");
    }

    public FlutterElement getMobileNumberField() {
        return getFinder().byValueKey("mobile_number");
    }

    public FlutterElement getOtpField() {
        return getFinder().byValueKey("otp_field");
    }

    public FlutterElement getVerifyButton() {
        return getFinder().byText("VERIFY");
    }

    public FlutterElement getForgotPasswordLink() {
        return getFinder().byText("Forgot Password?");
    }

    public FlutterElement getLoginWithPasswordLink() {
        return getFinder().byText("Login with Password");
    }

    public FlutterElement getLoginWithOtpLink() {
        return getFinder().byText("Login with OTP");
    }

    public FlutterElement getErrorToast() {
        return getFinder().byValueKey("snackbar_text");
    }

    public FlutterElement getLoginTitle() {
        return getFinder().byText("Login");
    }

    public FlutterElement getTenantField() {
        return getFinder().byValueKey("url_textbox");
    }

    public FlutterElement getUsernameField() {
        return getFinder().byValueKey("username_box");
    }

    public FlutterElement getPasswordField() {
        return getFinder().byValueKey("password_box");
    }

    public FlutterElement getSubmitButton() {
        return getFinder().byValueKey("submit_button");
    }

    public FlutterElement getDashboardAnchor() {
        return getFinder().byValueKey("dashboard_screen");
    }

    // -------------------------------------------------------------------------
    // TC-001 Flutter element accessors (ValueKey — fill SPLASH_SCREEN_KEY etc.)
    // -------------------------------------------------------------------------

    /**
     * Splash screen anchor shown during cold-launch routing evaluation.
     */
    public FlutterElement getSplashScreenElement() {
        return flutterByValueKey(SPLASH_SCREEN_KEY);
    }

    /**
     * Onboarding screen S1.1 — first onboarding card after fresh install.
     */
    public FlutterElement getOnboardingScreenS11Element() {
        return flutterByValueKey(ONBOARDING_SCREEN_S11_KEY);
    }

    /**
     * Recurring login / last login screen (Screen 7).
     */
    public FlutterElement getRecurringLoginScreenElement() {
        return flutterByValueKey(RECURRING_LOGIN_SCREEN_KEY);
    }

    /** Tenant logo element on recurring login screen (Screen 7). */
    public FlutterElement getRecurringLoginTenantLogoElement() {
        return flutterByValueKey(RECURRING_LOGIN_TENANT_LOGO_KEY);
    }

    /** Title element on recurring login screen (Screen 7). */
    public FlutterElement getRecurringLoginTitleElement() {
        return flutterByValueKey(RECURRING_LOGIN_TITLE_KEY);
    }

    /** Saved account card container on recurring login screen (Screen 7). */
    public FlutterElement getRecurringLoginSavedAccountCardElement() {
        return flutterByValueKey(RECURRING_LOGIN_SAVED_ACCOUNT_CARD_KEY);
    }

    /** Biometric CTA on recurring login screen (Screen 7). */
    public FlutterElement getRecurringLoginBiometricCtaElement() {
        return flutterByValueKey(RECURRING_LOGIN_BIOMETRIC_CTA_KEY);
    }

    /** Other Sign In Options CTA on recurring login screen (Screen 7). */
    public FlutterElement getRecurringLoginOtherSignInOptionsCtaElement() {
        return flutterByValueKey(RECURRING_LOGIN_OTHER_SIGNIN_OPTIONS_CTA_KEY);
    }

    /**
     * Dashboard root used to assert routing did not skip to home.
     */
    public FlutterElement getDashboardScreenElement() {
        return flutterByValueKey(DASHBOARD_SCREEN_KEY);
    }

    private FlutterElement flutterByValueKey(String valueKey) {
        return getFinder().byValueKey(valueKey);
    }

    // -------------------------------------------------------------------------
    // TC-001 actions & verifications
    // -------------------------------------------------------------------------

    /**
     * Waits until the splash screen anchor is visible after cold launch.
     *
     * @param timeoutSeconds explicit wait duration in seconds
     * @return {@code true} if splash anchor appeared within the timeout
     */
    public boolean waitForSplashScreen(int timeoutSeconds) {
        logger.info("Waiting for splash screen (timeout={}s)", timeoutSeconds);
        return waitForElementPresence(getSplashScreenElement(), timeoutSeconds);
    }

    /**
     * Verifies splash screen was displayed (may already have routed past splash).
     *
     * @param timeoutSeconds wait for splash anchor
     * @return {@code true} if splash was observed
     */
    public boolean isSplashScreenDisplayed(int timeoutSeconds) {
        boolean visible = waitForSplashScreen(timeoutSeconds);
        logger.info("Splash screen visible={}", visible);
        return visible;
    }

    /**
     * Waits until onboarding screen S1.1 is the active destination.
     *
     * @param timeoutSeconds explicit wait duration in seconds
     * @return {@code true} if onboarding S1.1 anchor is displayed
     */
    public boolean waitForOnboardingScreenS11(int timeoutSeconds) {
        logger.info("Waiting for onboarding screen S1.1 (timeout={}s)", timeoutSeconds);
        return waitForElementPresence(getOnboardingScreenS11Element(), timeoutSeconds);
    }

    /**
     * @param timeoutSeconds wait duration in seconds
     * @return {@code true} when onboarding S1.1 is displayed
     */
    public boolean isOnboardingScreenS11Displayed(int timeoutSeconds) {
        boolean visible = waitForOnboardingScreenS11(timeoutSeconds);
        logger.info("Onboarding S1.1 visible={}", visible);
        return visible;
    }

    /**
     * Short check whether recurring login (Screen 7) is visible.
     *
     * @param timeoutSeconds wait duration in seconds
     * @return {@code true} if recurring login anchor is present
     */
    public boolean isRecurringLoginScreenDisplayed(int timeoutSeconds) {
        boolean visible = waitForElementPresence(getRecurringLoginScreenElement(), timeoutSeconds);
        logger.info("Recurring login screen visible={}", visible);
        return visible;
    }

    /**
     * Verifies the recurring login screen core UI elements for TC-002.
     *
     * @param timeoutSeconds wait duration in seconds for each element
     * @return {@code true} if all required elements are present
     */
    public boolean verifyRecurringLoginScreenUi(int timeoutSeconds) {
        boolean logo = waitForElementPresence(getRecurringLoginTenantLogoElement(), timeoutSeconds);
        boolean title = waitForElementPresence(getRecurringLoginTitleElement(), timeoutSeconds);
        boolean accountCard = waitForElementPresence(getRecurringLoginSavedAccountCardElement(), timeoutSeconds);
        boolean otherOptions = waitForElementPresence(getRecurringLoginOtherSignInOptionsCtaElement(), timeoutSeconds);

        logger.info(
                "Recurring login UI checks: logo={}, title={}, accountCard={}, otherOptions={}",
                logo, title, accountCard, otherOptions);

        return logo && title && accountCard && otherOptions;
    }

    /**
     * Short check whether dashboard is visible.
     *
     * @param timeoutSeconds wait duration in seconds
     * @return {@code true} if dashboard anchor is present
     */
    public boolean isDashboardScreenDisplayed(int timeoutSeconds) {
        boolean visible = waitForElementPresence(getDashboardScreenElement(), timeoutSeconds);
        logger.info("Dashboard screen visible={}", visible);
        return visible;
    }

    /**
     * Performs login with tenant URL and password credentials.
     *
     * @param tenantUrl tenant host (e.g. mobile2.qa.darwinbox.io)
     * @param username  employee id or email
     * @param password  password
     */
    public void login(String tenantUrl, String username, String password) {
        logger.info("Logging in with tenant={}, username={}", tenantUrl, username);
        sendKeys(getTenantField(), tenantUrl);
        sendKeys(getUsernameField(), username);
        sendKeys(getPasswordField(), password);
        clickAction(getSubmitButton());
        waitForPage(getDashboardAnchor());
    }

    /**
     * @return {@code true} when the credential login title is visible
     */
    public boolean isLoginScreenVisible() {
        return waitForElementPresence(getLoginTitle(), 5);
    }
}
