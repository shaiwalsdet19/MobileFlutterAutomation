package com.tests.base;

import com.api.framework.mobile.MobileTestBase;
import com.api.framework.mobile.util.ExtentReportManager;
import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.android.AndroidDriver;
import io.appium.java_client.remote.SupportsRotation;
import org.openqa.selenium.ScreenOrientation;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;

import java.util.HashMap;
import java.util.Map;

/**
 * Base Test Class for Mobile Automation
 * Provides common setup, teardown, and shared utilities for all test classes.
 * Extends MobileTestBase for Appium driver lifecycle and ExtentReports integration.
 */
public class BaseTest extends MobileTestBase {

    protected ExtentReports extentReports;
    protected ExtentTest extentTest;

    @BeforeClass(alwaysRun = true)
    public void setUpBase() {
        extentReports = ExtentReportManager.getInstance();
    }

    @AfterClass(alwaysRun = true)
    public void tearDownBase() {
        extentTest = null;
    }

    /**
     * Get the current platform (android/ios).
     */
    protected String getPlatform() {
        if (driver == null) {
            return "android";
        }
        Object platformName = driver.getCapabilities().getCapability("platformName");
        if (platformName == null) {
            platformName = driver.getCapabilities().getPlatformName();
        }
        String name = platformName != null ? platformName.toString() : "Android";
        return name.toLowerCase().contains("android") ? "android" : "ios";
    }

    /**
     * Run an adb shell command via Appium mobile:shell.
     */
    protected void executeMobileShell(String command) {
        if (driver == null || !isAndroid()) {
            return;
        }
        try {
            Map<String, String> args = new HashMap<>();
            args.put("command", command);
            driver.executeScript("mobile: shell", args);
        } catch (Exception e) {
            System.out.println("mobile:shell failed: " + e.getMessage());
        }
    }

    protected boolean isAndroid() {
        return "android".equals(getPlatform());
    }

    /**
     * Enable network throttling for testing slow networks
     */
    protected void enableNetworkThrottling(String condition) {
        try {
            switch (condition) {
                case "slow_3g":
                    // Network shaping is device/emulator specific; no-op unless configured externally
                    break;
                case "offline":
                    toggleAirplaneMode(true);
                    break;
                case "timeout":
                    break;
                default:
                    break;
            }
        } catch (Exception e) {
            System.out.println("Network throttling not supported: " + e.getMessage());
        }
    }

    /**
     * Disable network throttling
     */
    protected void disableNetworkThrottling() {
        try {
            toggleAirplaneMode(false);
        } catch (Exception e) {
            System.out.println("Error disabling network throttling: " + e.getMessage());
        }
    }

    protected void simulateNetworkTimeout(long timeout) {
        pause(timeout);
    }

    protected void simulateImageGenerationFailure() {
        // App-specific mock hook
    }

    protected void disableNetworkConnectivity() {
        toggleAirplaneMode(true);
    }

    protected void enableNetworkConnectivity() {
        toggleAirplaneMode(false);
    }

    private void toggleAirplaneMode(boolean enable) {
        if (!(driver instanceof AndroidDriver)) {
            return;
        }
        try {
            AndroidDriver androidDriver = (AndroidDriver) driver;
            boolean airplaneModeOn = Boolean.TRUE.equals(
                    androidDriver.getConnection().isAirplaneModeEnabled());
            if (enable != airplaneModeOn) {
                androidDriver.toggleAirplaneMode();
            }
        } catch (Exception e) {
            System.out.println("Error toggling airplane mode: " + e.getMessage());
        }
    }

    protected void muteDevice() {
        executeMobileShell("cmd notification set_interruption_filter 2");
    }

    protected void unmuteDevice() {
        executeMobileShell("cmd notification set_interruption_filter 1");
    }

    protected void simulateIncomingCall() {
        executeMobileShell("am start -a android.intent.action.CALL -d tel:+5551234567");
    }

    protected void completeCall() {
        executeMobileShell("input keyevent 6");
    }

    protected void setOrientation(String orientation) {
        if (driver == null) {
            return;
        }
        try {
            ScreenOrientation target = orientation.equalsIgnoreCase("landscape")
                    ? ScreenOrientation.LANDSCAPE
                    : ScreenOrientation.PORTRAIT;
            if (driver instanceof SupportsRotation) {
                ((SupportsRotation) driver).rotate(target);
            }
        } catch (Exception e) {
            System.out.println("Error setting orientation: " + e.getMessage());
        }
    }

    protected void enableScreenReader() {
        executeMobileShell(
                "settings put secure enabled_accessibility_services "
                        + "com.google.android.marvin.talkback/com.google.android.marvin.talkback.TalkBackService");
    }

    protected void disableScreenReader() {
        executeMobileShell("settings put secure enabled_accessibility_services \"\"");
    }

    protected void setTextScale(int percentage) {
        double scale = percentage / 100.0;
        executeMobileShell("settings put system font_scale " + scale);
    }

    protected void enableHighContrast() {
        executeMobileShell("settings put secure high_text_contrast_enabled 1");
    }

    protected void setLanguage(String languageCode) {
        executeMobileShell("setprop persist.sys.locale " + languageCode);
    }

    protected void setTenantAlias(String key, String value) {
        // App-specific configuration hook
    }

    protected void enableFeatureToggle(String toggleKey) {
        // App-specific feature flag hook
    }

    protected void disableFeatureToggle(String toggleKey) {
        // App-specific feature flag hook
    }

    protected void setLastRatingDateToDaysAgo(int days) {
        // App-specific shared preferences hook
    }

    protected void lockScreen() {
        executeMobileShell("input keyevent 26");
    }

    protected void unlockScreen() {
        executeMobileShell("input keyevent 82");
    }

    protected long getAppMemoryUsage() {
        if (!isAndroid()) {
            return 0;
        }
        try {
            Object result = driver.executeScript(
                    "mobile: shell",
                    Map.of("command", "dumpsys meminfo | grep TOTAL"));
            if (result != null) {
                String[] parts = result.toString().split("\\s+");
                if (parts.length > 1) {
                    return Long.parseLong(parts[1]) * 1024;
                }
            }
        } catch (Exception e) {
            System.out.println("Error getting memory usage: " + e.getMessage());
        }
        return 0;
    }

    protected boolean isWhatsAppOpened() {
        if (!(driver instanceof AndroidDriver)) {
            return false;
        }
        try {
            String currentPackage = ((AndroidDriver) driver).getCurrentPackage();
            return currentPackage != null && currentPackage.toLowerCase().contains("whatsapp");
        } catch (Exception e) {
            return false;
        }
    }

    protected void enableImageCaching() {
        // App-specific caching hook
    }

    protected void loginAsUser(String userProfile) {
        System.out.println("Logging in as user profile: " + userProfile);
    }

    protected void pause(long milliseconds) {
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}
