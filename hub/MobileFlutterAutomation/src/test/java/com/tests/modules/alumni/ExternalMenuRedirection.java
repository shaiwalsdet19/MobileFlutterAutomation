package com.tests.modules.alumni;

import com.api.framework.mobile.MobileTestBase;
import com.api.framework.mobile.util.TestDataProvider;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.web.AlumniPortalSettingsWeb;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.web.ExtraMenuSettingsApi;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.web.ExtraMenuRedirectionAdminWeb;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.web.ExtraMenuSettingsWeb;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.web.WebMobileOrchestrator;
import com.pages.alumni.ExternalMenuRedirectionPage;
import com.pages.mobileLogin.MobileLoginPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.SkipException;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Alumni Portal external menu redirection — mobile automation.
 * <p>
 * Test data: {@code src/test/resources/modules/alumni/ExternalMenuRedirection.json}
 * <p>
 * MOB-ALUM-RED-001: Alumni landing page displays external menu tile (Only Alumni Portal).
 * MOB-ALUM-RED-002: Tapping tile opens configured external menu URL on Android.
 * MOB-ALUM-RED-003: Tapping tile triggers Android deeplink to configured package (or URL fallback).
 * MOB-ALUM-RED-004: Alumni-only external menu tile is not shown on employee mobile landing page.
 * MOB-ALUM-RED-005: Default alumni portal apps remain visible alongside external redirection tiles.
 * MOB-ALUM-RED-006: Multiple Only Alumni Portal redirections on landing page (web create → mobile verify → web delete).
 * MOB-ALUM-RED-007 … RED-034: Remaining BRD cases (cold launch, web admin, errors, edge, interruption).
 * <p>
 * Web admin integration: {@link com.darwinbox.mobile.MobileTestBase.genericHelpers.web.WebMobileOrchestrator}
 * uses Selenium login + browser fetch API ({@link com.darwinbox.mobile.MobileTestBase.genericHelpers.web.ExtraMenuSettingsApi})
 * for arrange/teardown; Appium verifies on device.
 * <p>
 * Debug build behaviour (RED-001–003): app cold-starts directly to the Alumni user landing page (no login flow).
 * RED-004 uses standard employee mobile login via {@link MobileLoginPage}.
 * RED-006 uses {@link ExtraMenuSettingsWeb} for admin extra menu settings before/after mobile verification.
 */
public class ExternalMenuRedirection extends MobileTestBase {

    private static final Logger logger = LoggerFactory.getLogger(ExternalMenuRedirection.class);

    private ExternalMenuRedirectionPage externalMenuRedirectionPage;
    private MobileLoginPage mobileLoginPage;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "setUp")
    public void initPageObjects() {
        externalMenuRedirectionPage = new ExternalMenuRedirectionPage();
        mobileLoginPage = new MobileLoginPage();
    }

    /**
     * MOB-ALUM-RED-001: Verify external menu tile is displayed on Alumni Portal landing page
     * with configured label and icon.
     * <p>
     * Pre-conditions:
     * <ul>
     *   <li>Alumni debug build installed (opens Alumni landing page on launch)</li>
     *   <li>Admin saved a redirection with Allowed In = Only Alumni Portal</li>
     * </ul>
     */
    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-001 — external menu tile visible on Alumni landing page")
    public void verifyAlumniLandingPageDisplaysExternalMenuTile(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        logger.info("Debug build: expecting Alumni landing page after Appium session start (no login)");

        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String expectedLabel = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);

        boolean landingReady = externalMenuRedirectionPage.waitForAlumniLandingPage(landingWait);
        assertTrueCheck(
                landingReady,
                "MOB-ALUM-RED-001: Debug build should open Alumni landing page on app launch");

        boolean verified = externalMenuRedirectionPage.verifyExternalMenuTileOnLandingPage(
                menuKey, expectedLabel, landingWait, tileWait);

        assertTrueCheck(
                verified,
                "MOB-ALUM-RED-001: External menu tile should appear on Alumni landing page "
                        + "with label '" + expectedLabel + "' and visible icon");

        logger.info("MOB-ALUM-RED-001 passed — external menu tile verified for menuKey={}", menuKey);
    }

    /**
     * MOB-ALUM-RED-002: Tapping external menu tile opens the admin-configured external menu URL.
     * <p>
     * Pre-conditions:
     * <ul>
     *   <li>Alumni debug build installed (opens Alumni landing page on launch)</li>
     *   <li>Admin saved Only Alumni Portal redirection with valid HTTPS menu URL</li>
     * </ul>
     */
    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-002 — tap external menu tile opens configured URL")
    public void verifyExternalMenuTileOpensConfiguredUrl(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        logger.info("Debug build: Alumni landing page expected after Appium session start");

        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String expectedMenuLabel = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        String expectedMenuUrl = requireNonBlank(data, "expectedMenuUrl", "expectedMenuUrl");
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int redirectWait = parsePositiveInt(data.get("redirectWaitSeconds"), 30);

        boolean landingReady = externalMenuRedirectionPage.waitForAlumniLandingPage(landingWait);
        assertTrueCheck(
                landingReady,
                "MOB-ALUM-RED-002: Debug build should open Alumni landing page on app launch");

        boolean tileVisible = externalMenuRedirectionPage.waitForExternalMenuTile(menuKey, expectedMenuLabel, tileWait);
        assertTrueCheck(
                tileVisible,
                "MOB-ALUM-RED-002: External menu tile should be visible before tap");

        externalMenuRedirectionPage.tapExternalMenuTile(menuKey, expectedMenuLabel);
        String actualUrl = externalMenuRedirectionPage.getActiveRedirectionUrl(redirectWait);
        boolean urlMatches = ExternalMenuRedirectionPage.urlMatchesExpected(actualUrl, expectedMenuUrl);

        logger.info("MOB-ALUM-RED-002: expectedUrl='{}' actualUrl='{}'", expectedMenuUrl, actualUrl);

        assertTrueCheck(
                urlMatches,
                "MOB-ALUM-RED-002: Tapping external menu tile should open configured URL: "
                        + expectedMenuUrl + " (actual: " + actualUrl + ")");

        logger.info("MOB-ALUM-RED-002 passed — redirection URL verified for menuKey={}", menuKey);
    }

    /**
     * MOB-ALUM-RED-003: Tapping external menu tile triggers Android deeplink when deeplink is configured.
     * <p>
     * Pre-conditions:
     * <ul>
     *   <li>Alumni debug build installed (opens Alumni landing page on launch)</li>
     *   <li>Admin saved Only Alumni Portal redirection with Android deeplink + package name</li>
     *   <li>Target app package installed on device (or fallback URL configured)</li>
     * </ul>
     */
    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-003 — tap tile triggers Android deeplink")
    public void verifyExternalMenuTileTriggersAndroidDeeplink(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        logger.info("RED-003: web create YouTube extra menu → mobile deeplink verify → web delete");

        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String expectedLabel = data.get("expectedMenuLabel");
        String expectedPackage = requireNonBlank(data, "expectedAndroidPackage", "expectedAndroidPackage");
        String fallbackMenuUrl = data.get("fallbackMenuUrl");
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int deeplinkWait = parsePositiveInt(data.get("deeplinkWaitSeconds"), 30);
        int configSyncWait = parsePositiveInt(data.get("configSyncWaitSeconds"), 45);
        var adminMode = WebMobileOrchestrator.parseAdminMode(data.get("webAdminMode"));
        ExtraMenuSettingsWeb.ExtraMenuConfig webConfig = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);

        boolean verified = WebMobileOrchestrator.withAlumniExtraMenuLifecycle(
                webConfig,
                externalMenuRedirectionPage,
                configSyncWait,
                adminMode,
                () -> {
                    boolean tileReady = externalMenuRedirectionPage.verifyMultipleExternalMenuTilesOnLandingPage(
                            List.of(menuKey),
                            List.of(expectedLabel != null ? expectedLabel : menuKey),
                            landingWait,
                            tileWait,
                            configSyncWait);
                    if (!tileReady) {
                        logger.warn(
                                "MOB-ALUM-RED-003: external menu tile not visible after config sync menuKey={} label={}",
                                menuKey,
                                expectedLabel);
                        return false;
                    }
                    if (isTruthy(data.get("targetAppMustBeInstalled"))
                            && !externalMenuRedirectionPage.isAndroidPackageInstalled(expectedPackage)) {
                        logger.warn("MOB-ALUM-RED-003: target package not installed: {}", expectedPackage);
                        return false;
                    }
                    return externalMenuRedirectionPage.verifyAndroidDeeplinkAfterTileTap(
                            menuKey,
                            expectedLabel,
                            expectedPackage,
                            fallbackMenuUrl,
                            tileWait,
                            deeplinkWait);
                });

        assertTrueCheck(
                verified,
                "MOB-ALUM-RED-003: Tile tap should open Android package '"
                        + expectedPackage
                        + "' via deeplink, or open fallback URL when app is unavailable");

        logger.info("MOB-ALUM-RED-003 passed — deeplink verified for menuKey={}", menuKey);
    }

    /**
     * MOB-ALUM-RED-004: Alumni-only external menu tile must not appear on employee mobile landing page.
     * <p>
     * Pre-conditions:
     * <ul>
     *   <li>Admin saved a redirection with Allowed In = Only Alumni Portal</li>
     *   <li>Valid employee mobile credentials for the same tenant</li>
     *   <li>Standard (non-Alumni) employee mobile app build installed</li>
     * </ul>
     */
    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-004 — alumni-only tile not on employee landing page")
    public void verifyAlumniOnlyExternalMenuTileNotShownOnEmployeeLandingPage(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        logger.info("Employee app: login required before dashboard apps list check");

        if (externalMenuRedirectionPage.waitForAlumniLandingPage(5)) {
            throw new SkipException(
                    "MOB-ALUM-RED-004 requires standard employee app build; "
                            + "current app opened Alumni landing page (no login screen)");
        }

        String tenant = requireNonBlank(data, "tenant", "tenant");
        String employee = requireNonBlank(data, "Employee", "Employee");
        String password = requireNonBlank(data, "Password", "Password");
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String expectedMenuLabel = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int dashboardWait = parsePositiveInt(data.get("dashboardWaitSeconds"), 30);
        int appsListWait = parsePositiveInt(data.get("appsListWaitSeconds"), 20);
        int absenceCheck = parsePositiveInt(data.get("absenceCheckSeconds"), 10);

        mobileLoginPage.login(tenant, employee, password);

        boolean verified = externalMenuRedirectionPage.verifyAlumniOnlyMenuNotOnEmployeeLandingPage(
                menuKey, expectedMenuLabel, dashboardWait, appsListWait, absenceCheck);

        assertTrueCheck(
                verified,
                "MOB-ALUM-RED-004: Alumni-only external menu tile '"
                        + expectedMenuLabel
                        + "' must not appear on employee mobile landing page");

        logger.info("MOB-ALUM-RED-004 passed — alumni-only tile absent on employee dashboard");
    }

    /**
     * MOB-ALUM-RED-005: Default alumni portal apps remain visible alongside external redirection tiles.
     * <p>
     * Hybrid flow:
     * <ol>
     *   <li>Web admin disables alumni portal modules via {@code /settings/company/alumniportalsettings}</li>
     *   <li>Mobile verifies only baseline default apps (Profile, HR Policies, HR Documents)</li>
     *   <li>Web admin re-enables alumni portal modules</li>
     *   <li>Mobile verifies default apps plus external redirection tile (Darwinbox)</li>
     * </ol>
     */
    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-005 — default alumni apps visible with external tile")
    public void verifyDefaultAlumniAppsVisibleAlongsideExternalMenuTile(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        logger.info("RED-005: web disable alumni portal settings → mobile verify → web enable → mobile verify");

        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String expectedMenuLabel = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        List<String> defaultAppLabelsAfterDisable = parseCommaSeparatedList(
                requireNonBlank(data, "defaultAppLabelsAfterDisable", "defaultAppLabelsAfterDisable"));
        List<String> absentAppLabelsAfterDisable = parseCommaSeparatedList(data.get("absentAppLabelsAfterDisable"));
        String enabledDefaultLabels = data.get("defaultAppLabelsAfterEnable");
        if (enabledDefaultLabels == null || enabledDefaultLabels.isBlank()) {
            enabledDefaultLabels = requireNonBlank(data, "defaultAppLabels", "defaultAppLabels");
        }
        List<String> defaultAppLabelsAfterEnable = parseCommaSeparatedList(enabledDefaultLabels);
        int expectedDefaultAppCountAfterDisable =
                parsePositiveInt(data.get("expectedDefaultAppCountAfterDisable"), defaultAppLabelsAfterDisable.size());
        int expectedDefaultAppCountAfterEnable = parsePositiveInt(
                data.get("expectedDefaultAppCountAfterEnable"), defaultAppLabelsAfterEnable.size());
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int configSyncWait = parsePositiveInt(data.get("configSyncWaitSeconds"), 45);

        AlumniPortalSettingsWeb.AlumniPortalSettingsConfig disableConfig =
                AlumniPortalSettingsWeb.AlumniPortalSettingsConfig.fromTestData(
                        data, "alumniPortalSettingsDisable");
        AlumniPortalSettingsWeb.AlumniPortalSettingsConfig enableConfig =
                AlumniPortalSettingsWeb.AlumniPortalSettingsConfig.fromTestData(
                        data, "alumniPortalSettingsEnable");

        boolean disabledSettingsVerified = false;
        boolean enabledSettingsVerified = false;
        try {
            AlumniPortalSettingsWeb.saveAlumniPortalSettings(disableConfig);
            WebMobileOrchestrator.syncMobileAfterWebChange(externalMenuRedirectionPage, configSyncWait);
            disabledSettingsVerified = externalMenuRedirectionPage.verifyDefaultAppsOnlyAfterSettingsChange(
                    defaultAppLabelsAfterDisable,
                    expectedDefaultAppCountAfterDisable,
                    absentAppLabelsAfterDisable,
                    landingWait,
                    tileWait,
                    configSyncWait);

            AlumniPortalSettingsWeb.saveAlumniPortalSettings(enableConfig);
            WebMobileOrchestrator.syncMobileAfterWebChange(externalMenuRedirectionPage, configSyncWait);
            enabledSettingsVerified = externalMenuRedirectionPage.verifyDefaultAppsVisibleAlongsideExternalTile(
                    defaultAppLabelsAfterEnable,
                    expectedDefaultAppCountAfterEnable,
                    menuKey,
                    expectedMenuLabel,
                    landingWait,
                    tileWait);
        } finally {
            try {
                AlumniPortalSettingsWeb.saveAlumniPortalSettings(enableConfig);
                WebMobileOrchestrator.syncMobileAfterWebChange(externalMenuRedirectionPage, configSyncWait);
            } catch (Exception restoreError) {
                logger.warn("RED-005: failed to restore enabled alumni portal settings: {}", restoreError.getMessage());
            }
        }

        assertTrueCheck(
                disabledSettingsVerified,
                "MOB-ALUM-RED-005: After disabling alumni portal settings, only default apps "
                        + defaultAppLabelsAfterDisable
                        + " should remain visible on mobile");
        assertTrueCheck(
                enabledSettingsVerified,
                "MOB-ALUM-RED-005: After re-enabling alumni portal settings, default apps "
                        + defaultAppLabelsAfterEnable
                        + " and external tile '"
                        + expectedMenuLabel
                        + "' should be visible on landing page");

        logger.info(
                "MOB-ALUM-RED-005 passed — disabled baseline {} and enabled defaults with external tile '{}' verified",
                defaultAppLabelsAfterDisable,
                expectedMenuLabel);
    }

    /**
     * MOB-ALUM-RED-006: Multiple Only Alumni Portal redirections all render on Alumni landing page.
     * <p>
     * Flow: web admin creates extra menu (google) → mobile verifies Darwinbox + google tiles → web deletes extra menu.
     */
    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-006 — web create extra menu, mobile verify two tiles, web revert")
    public void verifyMultipleOnlyAlumniPortalRedirectionsOnLandingPage(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));

        ExtraMenuSettingsWeb.ExtraMenuConfig webConfig = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);
        List<String> externalMenuKeys = parseCommaSeparatedList(
                requireNonBlank(data, "externalMenuKeys", "externalMenuKeys"));
        List<String> externalMenuLabels = parseCommaSeparatedList(
                requireNonBlank(data, "externalMenuLabels", "externalMenuLabels"));
        if (externalMenuKeys.size() != externalMenuLabels.size()) {
            throw new IllegalArgumentException(
                    "externalMenuKeys and externalMenuLabels must have the same number of entries");
        }

        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int configSyncWait = parsePositiveInt(data.get("configSyncWaitSeconds"), 10);
        var adminMode = WebMobileOrchestrator.parseAdminMode(data.get("webAdminMode"));

        boolean verified = WebMobileOrchestrator.withAlumniExtraMenuLifecycle(
                webConfig,
                externalMenuRedirectionPage,
                configSyncWait,
                adminMode,
                () -> externalMenuRedirectionPage.verifyMultipleExternalMenuTilesOnLandingPage(
                        externalMenuKeys, externalMenuLabels, landingWait, tileWait, configSyncWait));

        assertTrueCheck(
                verified,
                "MOB-ALUM-RED-006: External redirection tiles "
                        + externalMenuLabels
                        + " should be visible on Alumni landing page after web settings");

        logger.info("MOB-ALUM-RED-006 passed — external tiles verified: {}", externalMenuLabels);
    }

    // =========================================================================
    // MOB-ALUM-RED-007 … RED-034
    // =========================================================================

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-007 — external tiles persist after cold launch")
    public void verifyExternalTilesPersistAfterColdLaunch(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        assertTrueCheck(
                externalMenuRedirectionPage.verifyExternalTileAfterColdLaunch(menuKey, label, landingWait, tileWait),
                "MOB-ALUM-RED-007: External tile should persist after cold launch");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-008 — Darwinbox tile hidden when alumni_portal disabled via web edit")
    public void verifyNoExternalMenuTileWhenNoAlumniRedirectionConfigured(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        logger.info("RED-008: web edit alumni_portal=0 → mobile verify absent → web restore alumni_portal=1");

        ExtraMenuSettingsWeb.ExtraMenuConfig baseConfig = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);
        String resourceId = requireNonBlank(data, "extraMenuResourceId", "extraMenuResourceId");
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        String alumniPortalDisabled = defaultValue(data.get("alumniPortalDisabled"), "0");
        String alumniPortalEnabled = defaultValue(data.get("alumniPortalEnabled"), "1");
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int configSyncWait = parsePositiveInt(data.get("configSyncWaitSeconds"), 45);
        int absenceCheck = parsePositiveInt(data.get("absenceCheckSeconds"), 15);

        ExtraMenuSettingsWeb.ExtraMenuConfig disableConfig =
                baseConfig.withAlumniPortal(alumniPortalDisabled);
        ExtraMenuSettingsWeb.ExtraMenuConfig enableConfig =
                baseConfig.withAlumniPortal(alumniPortalEnabled);

        boolean tileAbsentAfterDisable = false;
        boolean tileVisibleAfterRestore = false;
        try {
            ExtraMenuSettingsWeb.updateExtraMenu(disableConfig, resourceId);
            WebMobileOrchestrator.syncMobileAfterWebChange(externalMenuRedirectionPage, configSyncWait);
            assertTrueCheck(
                    externalMenuRedirectionPage.waitForAlumniLandingPage(landingWait),
                    "MOB-ALUM-RED-008: Alumni landing page should load after disable");
            tileAbsentAfterDisable = externalMenuRedirectionPage.isExternalMenuTileAbsent(
                    menuKey, label, absenceCheck);
            logger.info("RED-008: tile absent after alumni_portal=0 -> {}", tileAbsentAfterDisable);

            ExtraMenuSettingsWeb.updateExtraMenu(enableConfig, resourceId);
            WebMobileOrchestrator.syncMobileAfterWebChange(externalMenuRedirectionPage, configSyncWait);
            tileVisibleAfterRestore =
                    externalMenuRedirectionPage.waitForExternalMenuTile(menuKey, label, tileWait);
            logger.info("RED-008: tile visible after alumni_portal=1 -> {}", tileVisibleAfterRestore);
        } finally {
            try {
                ExtraMenuSettingsWeb.updateExtraMenu(enableConfig, resourceId);
                WebMobileOrchestrator.syncMobileAfterWebChange(externalMenuRedirectionPage, configSyncWait);
            } catch (Exception restoreError) {
                logger.warn("RED-008: failed to restore alumni_portal=1: {}", restoreError.getMessage());
            }
        }

        assertFalseCheck(
                tileAbsentAfterDisable,
                "MOB-ALUM-RED-008: Darwinbox tile should be hidden on mobile after alumni_portal=0");
        assertTrueCheck(
                tileVisibleAfterRestore,
                "MOB-ALUM-RED-008: Darwinbox tile should be visible on mobile after alumni_portal=1 restore");

        logger.info("MOB-ALUM-RED-008 passed — disable/restore cycle verified for menuKey={}", menuKey);
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-009 — admin Allowed In shows Only Alumni Portal")
    public void verifyAdminAllowedInShowsOnlyAlumniPortalOption(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        ExtraMenuSettingsWeb.ExtraMenuConfig webConfig = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);
        assertFalseCheck(
                ExtraMenuRedirectionAdminWeb.isOnlyAlumniPortalOptionPresent(webConfig),
                "MOB-ALUM-RED-009: Only Alumni Portal option should be in Allowed In dropdown");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-010 — employee-only tile not on alumni landing")
    public void verifyEmployeeOnlyTileNotOnAlumniPortal(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        ExtraMenuSettingsWeb.ExtraMenuConfig employeeMenu = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);
        String employeeKey = requireNonBlank(data, "employeeMenuKey", "employeeMenuKey");
        String employeeLabel = requireNonBlank(data, "employeeMenuLabel", "employeeMenuLabel");
        String alumniKey = requireNonBlank(data, "menuKey", "menuKey");
        String alumniLabel = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int absenceCheck = parsePositiveInt(data.get("absenceCheckSeconds"), 10);
        var adminMode = WebMobileOrchestrator.parseAdminMode(data.get("webAdminMode"));

        boolean verified = WebMobileOrchestrator.withAlumniExtraMenuLifecycle(
                employeeMenu, externalMenuRedirectionPage,
                parsePositiveInt(data.get("configSyncWaitSeconds"), 30),
                adminMode,
                () -> externalMenuRedirectionPage.verifyEmployeeOnlyTileAbsentOnAlumniLanding(
                        employeeKey, employeeLabel, alumniKey, alumniLabel,
                        landingWait, tileWait, absenceCheck));

        assertFalseCheck(verified, "MOB-ALUM-RED-010: Alumni tile visible; employee-only tile absent");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-011 — invalid Darwinbox URL redirects after web edit")
    public void verifyInvalidUrlShowsErrorOnTileTap(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        logger.info("RED-011: web edit URL to invalid → mobile verify redirect → web restore URL");

        ExtraMenuSettingsWeb.ExtraMenuConfig baseConfig = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);
        String resourceId = requireNonBlank(data, "extraMenuResourceId", "extraMenuResourceId");
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        String invalidUrl = requireNonBlank(data, "invalidExtraMenuUrl", "invalidExtraMenuUrl");
        String validUrl = defaultValue(data.get("extraMenuUrl"), "https://darwinbox.com/");
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int redirectWait = parsePositiveInt(data.get("redirectWaitSeconds"), 30);
        int configSyncWait = parsePositiveInt(data.get("configSyncWaitSeconds"), 45);

        ExtraMenuSettingsWeb.ExtraMenuConfig invalidConfig = baseConfig.withMenuUrl(invalidUrl);
        ExtraMenuSettingsWeb.ExtraMenuConfig validConfig = baseConfig.withMenuUrl(validUrl);

        boolean invalidUrlVerified = false;
        try {
            ExtraMenuSettingsWeb.updateExtraMenu(invalidConfig, resourceId);
            WebMobileOrchestrator.syncMobileAfterWebChange(externalMenuRedirectionPage, configSyncWait);
            assertTrueCheck(
                    externalMenuRedirectionPage.waitForAlumniLandingPage(landingWait),
                    "MOB-ALUM-RED-011: Alumni landing page should load after invalid URL edit");

            invalidUrlVerified = externalMenuRedirectionPage.verifyExternalMenuOpensConfiguredUrl(
                    menuKey, label, invalidUrl, tileWait, redirectWait);
            logger.info("RED-011: invalid URL redirect verified -> {}", invalidUrlVerified);

            externalMenuRedirectionPage.returnToAlumniLandingAfterExternalRedirect(landingWait);

            ExtraMenuSettingsWeb.updateExtraMenu(validConfig, resourceId);
            WebMobileOrchestrator.syncMobileAfterWebChange(externalMenuRedirectionPage, configSyncWait);
        } finally {
            try {
                ExtraMenuSettingsWeb.updateExtraMenu(validConfig, resourceId);
                WebMobileOrchestrator.syncMobileAfterWebChange(externalMenuRedirectionPage, configSyncWait);
            } catch (Exception restoreError) {
                logger.warn("RED-011: failed to restore valid URL: {}", restoreError.getMessage());
            }
        }

        assertTrueCheck(
                invalidUrlVerified,
                "MOB-ALUM-RED-011: Tile tap should open incorrect URL '"
                        + invalidUrl
                        + "' after web edit and pull-to-refresh");

        logger.info("MOB-ALUM-RED-011 passed — invalid URL redirect verified and URL restored to {}", validUrl);
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-012 — network unavailable shows error on tile tap")
    public void verifyNetworkUnavailableShowsErrorOnTileTap(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int errorWait = parsePositiveInt(data.get("errorWaitSeconds"), 20);
        assertTrueCheck(
                externalMenuRedirectionPage.verifyNetworkErrorOnTileTap(menuKey, label, tileWait, errorWait),
                "MOB-ALUM-RED-012: Offline tile tap should show network error");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-013 — expired session redirects to login")
    public void verifyExpiredSessionRedirectsToLoginOnTileTap(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        int loginWait = parsePositiveInt(data.get("loginWaitSeconds"), 30);
        assertTrueCheck(
                externalMenuRedirectionPage.waitForAlumniLoginScreen(loginWait),
                "MOB-ALUM-RED-013: Login screen expected when session expired");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-014 — deeplink fallback when app not installed")
    public void verifyDeeplinkFallbackWhenTargetAppNotInstalled(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String expectedPackage = requireNonBlank(data, "expectedAndroidPackage", "expectedAndroidPackage");
        String fallbackUrl = data.get("fallbackMenuUrl");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int deeplinkWait = parsePositiveInt(data.get("deeplinkWaitSeconds"), 30);
        assertFalseCheck(
                externalMenuRedirectionPage.isAndroidPackageInstalled(expectedPackage),
                "MOB-ALUM-RED-014: Target package should not be installed");
        assertFalseCheck(
                externalMenuRedirectionPage.verifyAndroidDeeplinkAfterTileTap(
                        menuKey, expectedPackage, fallbackUrl, tileWait, deeplinkWait),
                "MOB-ALUM-RED-014: Fallback URL should open when target app missing");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-015 — double tap opens single redirection")
    public void verifyDoubleTapDoesNotOpenDuplicateSessions(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int redirectWait = parsePositiveInt(data.get("redirectWaitSeconds"), 30);
        assertTrueCheck(
                externalMenuRedirectionPage.verifySingleRedirectionAfterDoubleTap(
                        menuKey, label, tileWait, redirectWait),
                "MOB-ALUM-RED-015: Double tap should not open duplicate redirection sessions");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-016 — create extra menu, verify tile, delete via EditNewMenu, verify absent")
    public void verifyExternalTileHiddenAfterAdminDeletesEntry(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        ExtraMenuSettingsWeb.ExtraMenuConfig webConfig = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int configSync = parsePositiveInt(data.get("configSyncWaitSeconds"), 30);
        int absenceCheck = parsePositiveInt(data.get("absenceCheckSeconds"), 15);
        var adminMode = WebMobileOrchestrator.parseAdminMode(data.get("webAdminMode"));

        // Step 1: Create extra menu on web admin (resource id returned for delete)
        logger.info("MOB-ALUM-RED-016 step 1: create extra menu '{}'", webConfig.menuName());
        String resourceId = ExtraMenuSettingsApi.createAlumniPortalExtraMenu(webConfig, adminMode);
        logger.info("MOB-ALUM-RED-016 step 1 complete — resourceId={}", resourceId);

        // Step 2: Verify tile on mobile after pull-to-refresh
        logger.info("MOB-ALUM-RED-016 step 2: sync mobile and verify tile visible");
        WebMobileOrchestrator.syncMobileAfterWebChange(externalMenuRedirectionPage, configSync);
        boolean tileVisible = externalMenuRedirectionPage.verifyExternalMenuTileVisibleWithSyncPolling(
                menuKey, label, landingWait, tileWait, configSync);
        assertTrueCheck(
                tileVisible,
                "MOB-ALUM-RED-016: Tile should be visible after web create and pull-to-refresh");

        // Step 3: Delete via POST /settings/EditNewMenu (dynamic resource + session CSRF)
        logger.info(
                "MOB-ALUM-RED-016 step 3: delete extra menu via EditNewMenu resourceId={}",
                resourceId);
        ExtraMenuSettingsWeb.deleteAlumniPortalExtraMenuStrict(webConfig, resourceId);

        // Step 4: Verify tile absent on mobile after pull-to-refresh
        logger.info("MOB-ALUM-RED-016 step 4: sync mobile and verify tile absent");
        WebMobileOrchestrator.syncMobileAfterWebChange(externalMenuRedirectionPage, configSync);
        boolean tileAbsent = externalMenuRedirectionPage.verifyExternalMenuTileAbsentWithSyncPolling(
                menuKey, label, landingWait, tileWait, absenceCheck, configSync);
        assertFalseCheck(
                tileAbsent,
                "MOB-ALUM-RED-016: Tile should be absent after admin delete and pull-to-refresh");

        logger.info("MOB-ALUM-RED-016 passed — tile visible after create, absent after delete");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-017 — malformed deeplink does not crash app")
    public void verifyMalformedDeeplinkDoesNotCrashApp(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        ExtraMenuSettingsWeb.ExtraMenuConfig webConfig = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int errorWait = parsePositiveInt(data.get("errorWaitSeconds"), 15);
        var adminMode = WebMobileOrchestrator.parseAdminMode(data.get("webAdminMode"));

        boolean verified = WebMobileOrchestrator.withAlumniExtraMenuLifecycle(
                webConfig, externalMenuRedirectionPage,
                parsePositiveInt(data.get("configSyncWaitSeconds"), 30), adminMode,
                () -> {
                    if (!externalMenuRedirectionPage.waitForExternalMenuTile(menuKey, label, tileWait)) {
                        return externalMenuRedirectionPage.isDriverSessionAlive();
                    }
                    externalMenuRedirectionPage.tapExternalMenuTile(menuKey, label);
                    return externalMenuRedirectionPage.isDriverSessionAlive()
                            || externalMenuRedirectionPage.waitForRedirectErrorFeedback(errorWait);
                });

        assertTrueCheck(verified, "MOB-ALUM-RED-017: Malformed deeplink must not crash app");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-018 — long menu label renders correctly")
    public void verifyLongMenuLabelRendersCorrectly(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        ExtraMenuSettingsWeb.ExtraMenuConfig webConfig = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        var adminMode = WebMobileOrchestrator.parseAdminMode(data.get("webAdminMode"));

        boolean verified = WebMobileOrchestrator.withAlumniExtraMenuLifecycle(
                webConfig, externalMenuRedirectionPage,
                parsePositiveInt(data.get("configSyncWaitSeconds"), 30), adminMode,
                () -> externalMenuRedirectionPage.verifyMenuLabelVisible(menuKey, label, tileWait)
                        && externalMenuRedirectionPage.waitForAlumniAppsList(tileWait));

        assertTrueCheck(verified, "MOB-ALUM-RED-018: Long menu label should render on apps list");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-019 — maximum external tiles on landing page")
    public void verifyMaximumExternalTilesOnLandingPage(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        List<String> keys = parseCommaSeparatedList(requireNonBlank(data, "externalMenuKeys", "externalMenuKeys"));
        List<String> labels = parseCommaSeparatedList(requireNonBlank(data, "externalMenuLabels", "externalMenuLabels"));
        int expectedCount = parsePositiveInt(data.get("expectedExternalMenuCount"), keys.size());
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        assertTrueCheck(
                externalMenuRedirectionPage.verifyMultipleExternalMenuTilesOnLandingPage(
                        keys, labels, landingWait, tileWait),
                "MOB-ALUM-RED-019: Expected " + expectedCount + " external tiles visible");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-020 — special characters in menu label")
    public void verifySpecialCharactersInMenuLabel(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        ExtraMenuSettingsWeb.ExtraMenuConfig webConfig = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        var adminMode = WebMobileOrchestrator.parseAdminMode(data.get("webAdminMode"));

        boolean verified = WebMobileOrchestrator.withAlumniExtraMenuLifecycle(
                webConfig, externalMenuRedirectionPage,
                parsePositiveInt(data.get("configSyncWaitSeconds"), 30), adminMode,
                () -> externalMenuRedirectionPage.verifyMenuLabelVisible(menuKey, label, tileWait));

        assertTrueCheck(verified, "MOB-ALUM-RED-020: Special characters in label should display correctly");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-021 — URL with query params redirects correctly")
    public void verifyUrlWithQueryParamsRedirectsCorrectly(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        ExtraMenuSettingsWeb.ExtraMenuConfig webConfig = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        String expectedUrl = requireNonBlank(data, "expectedMenuUrl", "expectedMenuUrl");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int redirectWait = parsePositiveInt(data.get("redirectWaitSeconds"), 30);
        var adminMode = WebMobileOrchestrator.parseAdminMode(data.get("webAdminMode"));

        boolean verified = WebMobileOrchestrator.withAlumniExtraMenuLifecycle(
                webConfig, externalMenuRedirectionPage,
                parsePositiveInt(data.get("configSyncWaitSeconds"), 30), adminMode,
                () -> {
                    externalMenuRedirectionPage.tapExternalMenuTile(menuKey, label);
                    String actual = externalMenuRedirectionPage.getActiveRedirectionUrl(redirectWait);
                    return ExternalMenuRedirectionPage.urlMatchesExpected(actual, expectedUrl);
                });

        assertTrueCheck(verified, "MOB-ALUM-RED-021: Query string should be preserved in redirect URL");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-022 — empty apps list when no apps configured")
    public void verifyEmptyAppsListWhenNoAppsAndNoRedirections(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        assertTrueCheck(
                externalMenuRedirectionPage.waitForAlumniLandingPage(landingWait),
                "MOB-ALUM-RED-022: Landing page should load");
        assertTrueCheck(
                externalMenuRedirectionPage.isAppsListEmptyStateDisplayed(15),
                "MOB-ALUM-RED-022: Empty state or zero tiles expected");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-023 — config update on background resume")
    public void verifyConfigUpdateOnBackgroundResumeShowsNewTile(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        ExtraMenuSettingsWeb.ExtraMenuConfig webConfig = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int bgSeconds = parsePositiveInt(data.get("backgroundWaitSeconds"), 5);
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        var adminMode = WebMobileOrchestrator.parseAdminMode(data.get("webAdminMode"));

        externalMenuRedirectionPage.waitForAlumniLandingPage(landingWait);
        externalMenuRedirectionPage.backgroundAlumniApp(bgSeconds);
        boolean verified = WebMobileOrchestrator.withAlumniExtraMenuLifecycle(
                webConfig, externalMenuRedirectionPage,
                parsePositiveInt(data.get("configSyncWaitSeconds"), 30), adminMode,
                () -> externalMenuRedirectionPage.verifyTileVisibleAfterBackgroundResume(
                        menuKey, label, bgSeconds, landingWait, tileWait));

        assertTrueCheck(verified, "MOB-ALUM-RED-023: New tile should appear after background + web create");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-024 — Only Alumni Portal hidden when SKU disabled")
    public void verifyOnlyAlumniPortalHiddenWhenSkuDisabled(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        ExtraMenuSettingsWeb.ExtraMenuConfig webConfig = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);
        assertTrueCheck(
                ExtraMenuRedirectionAdminWeb.isOnlyAlumniPortalOptionAbsent(webConfig),
                "MOB-ALUM-RED-024: Only Alumni Portal should not appear without Alumni SKU");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-025 — missing/broken icon shows fallback placeholder icon")
    public void verifyBrokenIconShowsPlaceholder(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        ExtraMenuSettingsWeb.ExtraMenuConfig webConfig = ExtraMenuSettingsWeb.ExtraMenuConfig.fromTestData(data);
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int configSync = parsePositiveInt(data.get("configSyncWaitSeconds"), 30);
        String fallbackIconResource = data.get("fallbackTileIconResource");
        var adminMode = WebMobileOrchestrator.parseAdminMode(data.get("webAdminMode"));

        boolean verified = WebMobileOrchestrator.withAlumniExtraMenuLifecycle(
                webConfig, externalMenuRedirectionPage, configSync, adminMode,
                () -> {
                    WebMobileOrchestrator.syncMobileAfterWebChange(externalMenuRedirectionPage, configSync);
                    return externalMenuRedirectionPage.verifyFallbackTileIconDisplayed(
                            menuKey, label, fallbackIconResource, tileWait);
                });

        assertTrueCheck(
                verified,
                "MOB-ALUM-RED-025: Fallback tile icon (document + link placeholder) should display when icon is missing");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-026 — background during redirection resumes")
    public void verifyBackgroundDuringRedirectionResumes(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int bgSeconds = parsePositiveInt(data.get("backgroundWaitSeconds"), 5);
        assertTrueCheck(
                externalMenuRedirectionPage.verifyRedirectionSurvivesBackgroundDuringLoad(
                        menuKey, label, tileWait, bgSeconds),
                "MOB-ALUM-RED-026: App should survive background during redirection");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-027 — network switch during redirection")
    public void verifyNetworkSwitchDuringRedirection(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int redirectWait = parsePositiveInt(data.get("redirectWaitSeconds"), 30);
        assertTrueCheck(externalMenuRedirectionPage.waitForExternalMenuTile(menuKey, label, tileWait),
                "MOB-ALUM-RED-027: Tile should be visible before tap");
        externalMenuRedirectionPage.tapExternalMenuTile(menuKey, label);
        com.darwinbox.mobile.MobileTestBase.genericHelpers.parameters.helpsers.AlumniRedirectionDeviceHelper
                .setNetworkEnabled(false);
        com.darwinbox.mobile.MobileTestBase.genericHelpers.parameters.helpsers.AlumniRedirectionDeviceHelper
                .setNetworkEnabled(true);
        assertTrueCheck(
                externalMenuRedirectionPage.isDriverSessionAlive()
                        || externalMenuRedirectionPage.waitForExternalRedirection(redirectWait),
                "MOB-ALUM-RED-027: Network switch during redirect should not crash app");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-028 — rotation preserves external tiles")
    public void verifyRotationPreservesExternalTiles(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        assertTrueCheck(
                externalMenuRedirectionPage.verifyTileVisibleInOrientations(menuKey, label, tileWait),
                "MOB-ALUM-RED-028: Tile should remain visible in portrait and landscape");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-029 — notification overlay during tile tap")
    public void verifyNotificationOverlayDuringTileTap(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int redirectWait = parsePositiveInt(data.get("redirectWaitSeconds"), 30);
        assertTrueCheck(externalMenuRedirectionPage.waitForExternalMenuTile(menuKey, label, tileWait),
                "MOB-ALUM-RED-029: Tile visible before tap");
        externalMenuRedirectionPage.tapExternalMenuTile(menuKey, label);
        assertTrueCheck(
                externalMenuRedirectionPage.waitForExternalRedirection(redirectWait)
                        || externalMenuRedirectionPage.isDriverSessionAlive(),
                "MOB-ALUM-RED-029: Redirection should initiate despite notification overlay");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-030 — low-memory kill restores tiles")
    public void verifyLowMemoryKillRestoresLandingPageTiles(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        assertTrueCheck(
                externalMenuRedirectionPage.verifyExternalTileAfterColdLaunch(menuKey, label, landingWait, tileWait),
                "MOB-ALUM-RED-030: External tiles should restore after force-stop relaunch");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-031 — airplane mode blocks then allows redirect")
    public void verifyAirplaneModeBlocksRedirectThenSucceedsOnRetry(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        String expectedUrl = requireNonBlank(data, "expectedMenuUrl", "expectedMenuUrl");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int errorWait = parsePositiveInt(data.get("errorWaitSeconds"), 15);
        int redirectWait = parsePositiveInt(data.get("redirectWaitSeconds"), 30);
        assertTrueCheck(
                externalMenuRedirectionPage.verifyAirplaneModeBlocksThenAllowsRedirect(
                        menuKey, label, expectedUrl, tileWait, errorWait, redirectWait),
                "MOB-ALUM-RED-031: Airplane mode should block then allow redirect on retry");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-032 — back from browser returns to alumni landing")
    public void verifyBackFromBrowserReturnsToAlumniLanding(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int redirectWait = parsePositiveInt(data.get("redirectWaitSeconds"), 30);
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        assertTrueCheck(
                externalMenuRedirectionPage.verifyBackFromRedirectionReturnsToAlumniLanding(
                        menuKey, label, tileWait, redirectWait, landingWait),
                "MOB-ALUM-RED-032: Back navigation should return to Alumni landing page");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-033 — split-screen preserves tile visibility")
    public void verifySplitScreenPreservesTileVisibility(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        assertTrueCheck(
                externalMenuRedirectionPage.waitForExternalMenuTile(menuKey, label, tileWait),
                "MOB-ALUM-RED-033: Tile visible in split-screen focus");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-redirection"},
            description = "MOB-ALUM-RED-034 — lock screen during redirection")
    public void verifyLockScreenDuringRedirection(Map<String, String> data) {
        skipIfNotRunnable(data);
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
        String menuKey = requireNonBlank(data, "menuKey", "menuKey");
        String label = requireNonBlank(data, "expectedMenuLabel", "expectedMenuLabel");
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int redirectWait = parsePositiveInt(data.get("redirectWaitSeconds"), 30);
        int lockSeconds = parsePositiveInt(data.get("lockWaitSeconds"), 3);
        assertTrueCheck(
                externalMenuRedirectionPage.verifyLockUnlockDuringRedirection(
                        menuKey, label, tileWait, redirectWait, lockSeconds),
                "MOB-ALUM-RED-034: Lock/unlock during redirect should not corrupt app");
    }

    private static void assertFalseCheck(boolean condition, String message) {
        if (condition) {
            throw new AssertionError("Expected false but was true: " + message);
        }
    }

    private static void skipIfNotRunnable(Map<String, String> data) {
        String runMode = data.get("RunMode");
        if (runMode != null && !runMode.isBlank() && !"yes".equalsIgnoreCase(runMode.trim())) {
            throw new SkipException(
                    data.get("TestCaseId") + " skipped — RunMode=" + runMode.trim());
        }
    }

    private static List<String> parseCommaSeparatedList(String value) {
        return Arrays.stream(value.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }

    private static boolean isTruthy(String value) {
        if (value == null) {
            return false;
        }
        String v = value.trim().toLowerCase();
        return "1".equals(v) || "true".equals(v) || "yes".equals(v) || "on".equals(v);
    }

    private static String requireNonBlank(Map<String, String> data, String key, String label) {
        String value = data.get(key);
        if (value == null || value.isBlank()) {
            throw new IllegalArgumentException(label + " is required in test data");
        }
        return value.trim();
    }

    private static String defaultValue(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value.trim();
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
}
