package com.tests.modules.sdsmobilelogin;

import com.api.framework.mobile.MobileTestBase;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.pages.mobileLogin.MobileLoginPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;

import java.io.File;
import java.io.IOException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * SDS mobile login automation — driven by {@code MobileSDSLoginFunctional.json}.
 * <p>
 * TC-001: fresh-install cold launch routes from Splash to Onboarding S1.1.
 * TC-002: returning user (saved preferences, no active session) routes to Recurring Login Screen 7.
 */
public class MobileLoginSDS extends MobileTestBase {

    private static final Logger logger = LoggerFactory.getLogger(MobileLoginSDS.class);

    private static final String JSON_PATH =
            "src/test/resources/login/MobileSDSLoginFunctional.json";

    private MobileLoginPage mobileLoginPage;

    /**
     * Clears app storage once per class when TC-001 requires a fresh install.
     * Disable or narrow this hook when adding tests that need saved preferences.
     */
    @BeforeClass(alwaysRun = true)
    public void clearAppDataForFreshInstallSuite() {
        if (props == null) {
            logger.warn("device-config.properties not loaded; skipping app data clear");
            return;
        }
        String requireClear = System.getProperty("requireClearAppData", "true");
        if (!"true".equalsIgnoreCase(requireClear)) {
            logger.info("Skipping app data clear (requireClearAppData={})", requireClear);
            return;
        }
        String packageName = props.getProperty("appPackage", "com.dbox.dbox_flutter.host");
        clearAppStorage(packageName);
    }

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "setUp")
    public void initPageObjects() {
        mobileLoginPage = new MobileLoginPage();
    }

    /**
     * Loads test cases from {@link #JSON_PATH} and filters by {@code TestMethod} for the invoking test.
     */
    @DataProvider(name = "sdsLoginTestRuns")
    public Object[][] sdsLoginTestRuns(Method testMethod) {
        List<Map<String, String>> allCases = loadAllTestCases();
        List<Map<String, String>> matched = new ArrayList<>();
        String javaMethodName = testMethod.getName();

        for (Map<String, String> row : allCases) {
            String targetMethod = row.get("TestMethod");
            if (javaMethodName.equals(targetMethod)) {
                matched.add(row);
            }
        }

        if (matched.isEmpty()) {
            throw new RuntimeException(String.format(
                    "No test data found for method '%s' in %s. Set TestMethod in JSON.",
                    javaMethodName, JSON_PATH));
        }

        Object[][] data = new Object[matched.size()][1];
        for (int i = 0; i < matched.size(); i++) {
            data[i][0] = matched.get(i);
        }
        return data;
    }

    /**
     * TC-001: Splash routes a brand-new user (no session, no saved preferences) to Onboarding S1.1.
     */
    @Test(
            dataProvider = "sdsLoginTestRuns",
            groups = {"smoke", "regression", "sds-login"},
            description = "TC-001 — fresh install cold launch → Onboarding S1.1")
    public void verifyFreshInstallRoutesToOnboardingS11(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));

        int splashWait = parsePositiveInt(data.get("splashWaitSeconds"), 5);
        int onboardingWait = parsePositiveInt(data.get("onboardingWaitSeconds"), 5);
        int negativeCheck = parsePositiveInt(data.get("negativeCheckSeconds"), 5);

//        boolean splashSeen = mobileLoginPage.isSplashScreenDisplayed(splashWait);
//        assertTrueCheck(
//                splashSeen,
//                "TC-001: Splash screen should appear briefly on cold launch");

        boolean onboardingVisible = mobileLoginPage.isOnboardingScreenS11Displayed(onboardingWait);
        assertTrueCheck(
                onboardingVisible,
                "TC-001: App should route to Onboarding Screen S1.1 after splash routing");

        boolean recurringLoginVisible =
                mobileLoginPage.isRecurringLoginScreenDisplayed(negativeCheck);
        assertFalseCheck(
                recurringLoginVisible,
                "TC-001: Recurring Login screen must NOT be shown for a fresh install");

        boolean dashboardVisible = mobileLoginPage.isDashboardScreenDisplayed(negativeCheck);
        assertFalseCheck(
                dashboardVisible,
                "TC-001: Dashboard must NOT be shown before onboarding for a fresh install");

        logger.info(
                "TC-001 passed — destination matches expected: {}",
                data.get("ExpectedDestination"));
    }

    /**
     * TC-002: Splash routes a returning user (no active session, saved preferences exist)
     * to the Recurring Login / Last Login screen (Screen 7) on cold launch.
     */
    @Test(
            dataProvider = "sdsLoginTestRuns",
            groups = {"smoke", "regression", "sds-login"},
            description = "TC-002 — returning user cold launch → Recurring Login Screen 7")
    public void verifyReturningUserRoutesToRecurringLoginScreen7(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));

        int splashWait = parsePositiveInt(data.get("splashWaitSeconds"), 5);
        int recurringWait = parsePositiveInt(data.get("recurringLoginWaitSeconds"), 30);
        int negativeCheck = parsePositiveInt(data.get("negativeCheckSeconds"), 5);
        int uiCheck = parsePositiveInt(data.get("uiCheckSeconds"), 10);

        // Optional: splash might be extremely brief; treat as best-effort.
        boolean splashSeen = mobileLoginPage.isSplashScreenDisplayed(splashWait);
        logger.info("TC-002: Splash observed={}", splashSeen);

        boolean recurringVisible = mobileLoginPage.isRecurringLoginScreenDisplayed(recurringWait);
        assertTrueCheck(
                recurringVisible,
                "TC-002: App should route to Recurring Login Screen 7 for returning user with saved preferences");

        boolean onboardingVisible = mobileLoginPage.isOnboardingScreenS11Displayed(negativeCheck);
        assertFalseCheck(
                onboardingVisible,
                "TC-002: Onboarding must NOT be shown for a returning user with saved preferences");

        boolean dashboardVisible = mobileLoginPage.isDashboardScreenDisplayed(negativeCheck);
        assertFalseCheck(
                dashboardVisible,
                "TC-002: Dashboard must NOT be shown when no active session exists");

        boolean recurringUiOk = mobileLoginPage.verifyRecurringLoginScreenUi(uiCheck);
        assertTrueCheck(
                recurringUiOk,
                "TC-002: Recurring Login Screen 7 should display tenant logo, title, saved account card, and 'Other Sign In Options' CTA");

        logger.info(
                "TC-002 passed — destination matches expected: {}",
                data.get("ExpectedDestination"));
    }

    private static List<Map<String, String>> loadAllTestCases() {
        ObjectMapper mapper = new ObjectMapper();
        File file = new File(JSON_PATH);
        if (!file.exists()) {
            throw new RuntimeException("Test data file not found: " + file.getAbsolutePath());
        }
        try {
            JsonNode root = mapper.readTree(file);
            JsonNode testcases = root.get("testcases");
            if (testcases == null || !testcases.isArray()) {
                throw new RuntimeException("Missing 'testcases' array in " + JSON_PATH);
            }
            List<Map<String, String>> rows = new ArrayList<>();
            for (JsonNode testcase : testcases) {
                Map<String, String> map = new HashMap<>();
                Iterator<Map.Entry<String, JsonNode>> fields = testcase.fields();
                while (fields.hasNext()) {
                    Map.Entry<String, JsonNode> entry = fields.next();
                    map.put(entry.getKey(), entry.getValue().asText());
                }
                rows.add(map);
            }
            return rows;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read " + JSON_PATH, e);
        }
    }

    private static int parsePositiveInt(String value, int defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        try {
            int parsed = Integer.parseInt(value.trim());
            return parsed > 0 ? parsed : defaultValue;
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    private static void clearAppStorage(String packageName) {
        logger.info("Clearing app data for package: {}", packageName);
        try {
            Process process = new ProcessBuilder("adb", "shell", "pm", "clear", packageName)
                    .redirectErrorStream(true)
                    .start();
            int exitCode = process.waitFor();
            if (exitCode != 0) {
                logger.warn("adb pm clear exited with code {} for {}", exitCode, packageName);
            } else {
                logger.info("App data cleared successfully for {}", packageName);
            }
        } catch (IOException | InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new RuntimeException(
                    "Failed to clear app data via adb. Ensure device is connected and adb is on PATH.",
                    e);
        }
    }
}
