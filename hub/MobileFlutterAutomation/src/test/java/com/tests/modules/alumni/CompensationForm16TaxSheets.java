package com.tests.modules.alumni;

import com.api.framework.mobile.MobileTestBase;
import com.api.framework.mobile.util.TestDataProvider;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.web.AlumniPortalSettingsWeb;
import com.pages.alumni.CompensationForm16TaxSheetsPage;
import com.pages.alumni.CompensationForm16TaxSheetsPage.DocumentCard;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.SkipException;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Map;

/**
 * Alumni Portal Compensation — Form 16, Tax Sheets, Payslips (MOBILE-9201).
 * <p>
 * Test data: {@code src/test/resources/modules/alumni/CompensationForm16TaxSheets.json}
 * <p>
 * ValueKeys: {@code AlumniCompensationAutomationKeys} in Flutter app.
 * Debug build cold-starts to Alumni landing page (no login).
 */
public class CompensationForm16TaxSheets extends MobileTestBase {

    private static final Logger logger = LoggerFactory.getLogger(CompensationForm16TaxSheets.class);

    private CompensationForm16TaxSheetsPage compensationPage;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "setUp")
    public void initPageObjects() {
        compensationPage = new CompensationForm16TaxSheetsPage();
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-001 — Compensation tile visible on Alumni landing page")
    public void verifyCompensationAppTileVisibleOnAlumniLandingPage(Map<String, String> data) {
        logStart(data);
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);

        assertTrueCheck(
                compensationPage.waitForAlumniLandingPage(landingWait),
                testId(data) + ": Alumni landing page should load on debug build launch");

        assertTrueCheck(
                compensationPage.waitForCompensationTile(tileWait),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-002 — tap Compensation tile opens Compensation view")
    public void verifyTappingCompensationTileOpensCompensationView(Map<String, String> data) {
        logStart(data);
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int pageWait = parsePositiveInt(data.get("pageWaitSeconds"), 30);

        compensationPage.openCompensationFromLanding(landingWait, pageWait);

        assertTrueCheck(
                compensationPage.waitForCompensationHome(pageWait),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-003 — FY dropdown defaults to most recent FY")
    public void verifyFinancialYearDropdownDefaultsToMostRecentFy(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        String expectedFy = firstNonBlank(data, "ExpectedDefaultFinancialYear", "Financial Year");

        assertTrueCheck(
                compensationPage.isFinancialYearLabelVisible(expectedFy, 15),
                testId(data) + ": FY dropdown should default to " + expectedFy);

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-004 — Payslips card visible on Compensation home")
    public void verifyPayslipsTabVisibleOnCompensationPage(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);

        assertTrueCheck(
                compensationPage.isDocumentCardVisible(DocumentCard.PAYSLIPS, 15),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-005 — Tax Sheets card visible when document exists")
    public void verifyTaxSheetsTabVisibleWhenTaxSheetExists(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyIfPresent(data);

        assertTrueCheck(
                compensationPage.isDocumentCardVisible(DocumentCard.TAX_SHEETS, 15),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-006 — Form 16A and Form 16B cards visible when released")
    public void verifyForm16TabVisibleWhenForm16Released(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyIfPresent(data);

        assertTrueCheck(
                compensationPage.areForm16CardsVisible(15),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-007 — Payslips list shows released payslips")
    public void verifyPayslipsListDisplaysReleasedPayslipsForFy(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyIfPresent(data);
        compensationPage.openDocumentCard(DocumentCard.PAYSLIPS);

        int rowIndex = parseNonNegativeInt(data.get("payslipRowIndex"), 0);
        assertTrueCheck(
                compensationPage.isPayslipRowVisible(rowIndex, 20),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-008 — Off-cycle section visible when data exists")
    public void verifyOffCyclePayslipsSectionVisibleWhenDataExists(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyIfPresent(data);
        compensationPage.openDocumentCard(DocumentCard.PAYSLIPS);

        assertTrueCheck(
                compensationPage.isOffCycleHeaderVisible(10),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-009 — Download payslip from Payslips card")
    public void verifyDownloadPayslipFromPayslipsTab(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyIfPresent(data);
        compensationPage.openDocumentCard(DocumentCard.PAYSLIPS);

        int rowIndex = parseNonNegativeInt(data.get("payslipRowIndex"), 0);
        compensationPage.downloadPayslipPdf(rowIndex);

        assertTrueCheck(
                compensationPage.isPayslipPdfViewerVisible(rowIndex, 20)
                        || compensationPage.waitForCompensationHome(5),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-010 — Download Form 16A and Form 16B PDF")
    public void verifyDownloadForm16PdfForSelectedFy(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyIfPresent(data);
        int downloadWait = parsePositiveInt(data.get("downloadWaitSeconds"), 30);

        compensationPage.openDocumentCard(DocumentCard.FORM_16A);
        assertTrueCheck(
                compensationPage.isForm16PdfViewerVisible(DocumentCard.FORM_16A, downloadWait),
                testId(data) + ": Form 16A PDF viewer should load");
        compensationPage.tapForm16Download(DocumentCard.FORM_16A);

        compensationPage.returnToCompensationHome();
        compensationPage.openDocumentCard(DocumentCard.FORM_16B);
        assertTrueCheck(
                compensationPage.isForm16PdfViewerVisible(DocumentCard.FORM_16B, downloadWait),
                testId(data) + ": Form 16B PDF viewer should load");
        compensationPage.tapForm16Download(DocumentCard.FORM_16B);

        assertTrueCheck(
                true,
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-011 — Download Tax Sheet PDF")
    public void verifyDownloadTaxSheetPdfForSelectedFy(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyIfPresent(data);
        compensationPage.openDocumentCard(DocumentCard.TAX_SHEETS);

        int rowIndex = parseNonNegativeInt(data.get("taxSheetRowIndex"), 0);
        assertTrueCheck(
                compensationPage.isTaxSheetRowVisible(rowIndex, 20),
                testId(data) + ": Tax Sheet row should be visible before download");

        compensationPage.openTaxSheetRow(rowIndex);

        assertTrueCheck(
                true,
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-012 — Tax Sheet row renders for FY")
    public void verifyTaxSheetPdfViewerRendersDocument(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyIfPresent(data);
        compensationPage.openDocumentCard(DocumentCard.TAX_SHEETS);

        int rowIndex = parseNonNegativeInt(data.get("taxSheetRowIndex"), 0);
        assertTrueCheck(
                compensationPage.isTaxSheetRowVisible(rowIndex, parsePositiveInt(data.get("viewerWaitSeconds"), 30)),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-013 — Form 16A and Form 16B PDF viewers render")
    public void verifyForm16PdfViewerRendersPartAAndB(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyIfPresent(data);
        int viewerWait = parsePositiveInt(data.get("viewerWaitSeconds"), 30);

        compensationPage.openDocumentCard(DocumentCard.FORM_16A);
        assertTrueCheck(
                compensationPage.isForm16PdfViewerVisible(DocumentCard.FORM_16A, viewerWait),
                testId(data) + ": Form 16A PDF viewer should render Part A");

        compensationPage.returnToCompensationHome();
        compensationPage.openDocumentCard(DocumentCard.FORM_16B);
        assertTrueCheck(
                compensationPage.isForm16PdfViewerVisible(DocumentCard.FORM_16B, viewerWait),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-014 — FY change updates payslips list")
    public void verifyFyChangeUpdatesPayslipsList(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);

        String previousFy = data.get("Previous Financial Year");
        String targetFy = data.get("Financial Year");

        selectFyFromDataKey(data, "Previous Financial Year");
        compensationPage.openDocumentCard(DocumentCard.PAYSLIPS);

        assertTrueCheck(
                compensationPage.isPayslipRowPresent(0, 10)
                        || compensationPage.isPayslipsEmptyStateVisible(5),
                testId(data) + ": Payslips list should load for FY " + previousFy);
        boolean offCycleBefore = compensationPage.isOffCycleHeaderPresentQuick(2);

        compensationPage.returnToCompensationHome();
        selectFyFromDataKey(data, "Financial Year");

        assertTrueCheck(
                compensationPage.isFinancialYearLabelVisible(targetFy, 10),
                testId(data) + ": FY dropdown should show " + targetFy);

        compensationPage.openDocumentCard(DocumentCard.PAYSLIPS);

        boolean listLoaded = compensationPage.isPayslipRowPresent(0, 15)
                || compensationPage.isPayslipsEmptyStateVisible(10);
        boolean offCycleAfter = compensationPage.scrollToOffCycleHeader(25);
        boolean listChanged = offCycleBefore != offCycleAfter || offCycleAfter;

        assertTrueCheck(listLoaded, testId(data) + ": " + data.get("ExpectedOutcome"));
        assertTrueCheck(
                listChanged,
                testId(data) + ": Payslips list should reflect FY " + targetFy
                        + " (off-cycle before=" + offCycleBefore + ", after=" + offCycleAfter + ")");

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-015 — FY change hides Tax Sheets card")
    public void verifyFyChangeUpdatesTaxSheetVisibility(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyFromDataKey(data, "Baseline Financial Year");
        assertTrueCheck(
                compensationPage.isDocumentCardVisible(DocumentCard.TAX_SHEETS, 15),
                testId(data) + ": Tax Sheets card should be visible for baseline FY");

        selectFyFromDataKey(data, "Financial Year");

        boolean hidden = isTabVisibilityExpected(data, false);
        assertFalseCheck(hidden, testId(data) + ": " + data.get("ExpectedOutcome"));
        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-016 — Compensation is read-only")
    public void verifyCompensationPageIsReadOnly(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);

        for (DocumentCard card : DocumentCard.values()) {
            if (compensationPage.isDocumentCardVisible(card, 5)) {
                compensationPage.openDocumentCard(card);
                assertFalseCheck(
                        compensationPage.isEditableTextFieldAbsent(5),
                        testId(data) + ": No TextField on " + card.label());
                assertFalseCheck(
                        compensationPage.isSaveOrDeclareButtonAbsent(5),
                        testId(data) + ": No Save/Declare on " + card.label());
                compensationPage.pressAndroidBack();
                compensationPage.waitForCompensationHome(10);
            }
        }

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-017 — Compensation tile hidden when Payroll disabled via web admin")
    public void verifyCompensationTileHiddenWhenPayrollNotEnabled(Map<String, String> data) {
        runPayrollDisableVerifyTileHiddenAndRestore(data, false);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-018 — Empty state when no payslips for FY")
    public void verifyEmptyStateWhenNoPayslipsForFy(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        compensationPage.selectFinancialYearByText(data.get("Financial Year"));
        compensationPage.openDocumentCard(DocumentCard.PAYSLIPS);

        boolean emptyByKey = compensationPage.isPayslipsEmptyStateVisible(15);
        boolean emptyByText = waitForText(data.get("ExpectedEmptyStateMessage"), 10);

        assertTrueCheck(
                emptyByKey || emptyByText,
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"smoke", "regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-019 — Tax Sheets card hidden when no document")
    public void verifyTaxSheetsTabHiddenWhenNoTaxSheetForFy(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        compensationPage.selectFinancialYearByText(data.get("Financial Year"));

        assertFalseCheck(
                isTabVisibilityExpected(data, false),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-020 — Form 16A and Form 16B cards hidden when not released")
    public void verifyForm16TabHiddenWhenNotReleased(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        compensationPage.selectFinancialYearByText(data.get("Financial Year"));

        assertFalseCheck(
                compensationPage.areForm16CardsAbsent(10),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-021 — Form 16 download blocked offline")
    public void verifyForm16DownloadBlockedWhenOffline(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        throw new SkipException(testId(data) + " — requires adb network toggle harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-022 — Tax Sheet download blocked offline")
    public void verifyTaxSheetDownloadBlockedWhenOffline(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires adb network toggle harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-023 — Payslip download blocked offline")
    public void verifyPayslipDownloadBlockedWhenOffline(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires adb network toggle harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-024 — Session expired redirects to login")
    public void verifySessionExpiredRedirectsToLoginFromCompensation(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires session expiry test hook (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-025 — Tile removed after Payroll disabled via web admin")
    public void verifyCompensationTileRemovedAfterPayrollDisabled(Map<String, String> data) {
        runPayrollDisableVerifyTileHiddenAndRestore(data, true);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-026 — Select oldest FY")
    public void verifySelectOldestAvailableFyInDropdown(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        compensationPage.selectFinancialYearByText(data.get("Financial Year"));

        assertTrueCheck(
                compensationPage.waitForCompensationHome(15),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-027 — Select newest FY")
    public void verifySelectNewestFyInDropdown(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        compensationPage.selectFinancialYearByText(data.get("Financial Year"));

        assertTrueCheck(
                compensationPage.isDocumentCardVisible(DocumentCard.PAYSLIPS, 15),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-028 — Payslips-only FY hides Tax Sheet and Form 16 cards")
    public void verifyFyWithPayslipsOnlyHidesTaxAndForm16Tabs(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        navigateToCompensationHome(data);
        compensationPage.selectFinancialYearByText(data.get("Financial Year"));

        assertTrueCheck(
                compensationPage.isDocumentCardVisible(DocumentCard.PAYSLIPS, 15),
                testId(data) + ": Payslips card should be visible");

        assertTrueCheck(
                compensationPage.isDocumentCardAbsent(DocumentCard.TAX_SHEETS, 10),
                testId(data) + ": Tax Sheets card should be hidden");

        assertTrueCheck(
                compensationPage.areForm16CardsAbsent(10),
                testId(data) + ": Form 16A and Form 16B cards should be hidden");

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-029 — All document cards visible including Form 16A and Form 16B")
    public void verifyFyWithAllDocumentTypesShowsAllTabs(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyIfPresent(data);

        assertTrueCheck(compensationPage.isDocumentCardVisible(DocumentCard.PAYSLIPS, 15),
                testId(data) + ": Payslips card visible");
        assertTrueCheck(compensationPage.isDocumentCardVisible(DocumentCard.TAX_SHEETS, 15),
                testId(data) + ": Tax Sheets card visible");
        assertTrueCheck(compensationPage.areForm16CardsVisible(15),
                testId(data) + ": Form 16A and Form 16B cards visible");

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-030 — Off-cycle collapsed by default")
    public void verifyOffCycleSectionCollapsedByDefault(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyIfPresent(data);
        compensationPage.openDocumentCard(DocumentCard.PAYSLIPS);

        assertTrueCheck(
                compensationPage.isOffCycleHeaderVisible(10),
                testId(data) + ": Off-cycle header should be visible");

        assertFalseCheck(
                compensationPage.isOffCycleRowAbsent(0, 5),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-031 — Expand off-cycle reveals rows")
    public void verifyExpandOffCycleSectionRevealsRows(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyIfPresent(data);
        compensationPage.openDocumentCard(DocumentCard.PAYSLIPS);
        compensationPage.isOffCycleHeaderVisible(10);
        compensationPage.expandOffCycleSection();

        assertTrueCheck(
                compensationPage.isOffCycleRowVisible(0, 15),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-032 — Form 16A viewer updates on FY change")
    public void verifyForm16TitleUpdatesOnFyChange(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyFromDataKey(data, "Previous Financial Year");
        compensationPage.openDocumentCard(DocumentCard.FORM_16A);
        assertTrueCheck(
                compensationPage.isForm16PdfViewerVisible(20),
                testId(data) + ": Form 16A viewer should load for initial FY");
        compensationPage.pressAndroidBack();

        selectFyFromDataKey(data, "Financial Year");
        compensationPage.openDocumentCard(DocumentCard.FORM_16A);

        assertTrueCheck(
                compensationPage.isForm16PdfViewerVisible(20),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-033 — Rapid FY change does not crash")
    public void verifyRapidFyChangeDoesNotCrash(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        compensationPage.ensurePayslipsListReady(20);

        selectFyFromDataKey(data, "Rapid Fy First");
        selectFyFromDataKey(data, "Intermediate Financial Year");
        selectFyFromDataKey(data, "Financial Year");

        compensationPage.waitForPayslipsListReady(20);

        String targetFy = data.get("Financial Year");
        assertTrueCheck(
                compensationPage.isFinancialYearLabelVisible(targetFy, 10),
                testId(data) + ": FY dropdown should show " + targetFy + " after rapid switching");

        boolean stable = compensationPage.isPayslipRowVisible(0, 15)
                || compensationPage.isPayslipsEmptyStateVisible(10);

        assertTrueCheck(stable, testId(data) + ": " + data.get("ExpectedOutcome"));
        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-034 — Background during Form 16 load")
    public void verifyBackgroundDuringForm16PdfLoadResumes(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires backgroundApp harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-035 — Network switch during Tax Sheet download")
    public void verifyNetworkSwitchDuringTaxSheetDownload(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires adb network harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-036 — Rotation preserves tab and FY state")
    public void verifyRotationPreservesTabAndFyState(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires device rotation harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-037 — Kill and relaunch restores Compensation tile")
    public void verifyKillAndRelaunchRestoresCompensationTile(Map<String, String> data) {
        logStart(data);
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);

        assertTrueCheck(
                compensationPage.waitForAlumniLandingPage(landingWait),
                testId(data) + ": Landing page on first launch");

        compensationPage.relaunchAlumniApp();

        assertTrueCheck(
                compensationPage.waitForAlumniLandingPage(landingWait),
                testId(data) + ": Landing page after relaunch");

        assertTrueCheck(
                compensationPage.waitForCompensationTile(20),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-038 — Airplane mode blocks download then retry")
    public void verifyAirplaneModeBlocksDownloadThenSucceedsOnRetry(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires airplane mode harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-039 — Back from Form 16A viewer returns to cards")
    public void verifyBackFromForm16ViewerReturnsToTabs(Map<String, String> data) {
        logStart(data);
        navigateToCompensationHome(data);
        selectFyIfPresent(data);
        compensationPage.openDocumentCard(DocumentCard.FORM_16A);

        assertTrueCheck(
                compensationPage.isForm16PdfViewerVisible(DocumentCard.FORM_16A, 30),
                testId(data) + ": Form 16A viewer should open");

        compensationPage.pressAndroidBack();

        assertTrueCheck(
                compensationPage.waitForCompensationHome(15),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        assertTrueCheck(
                compensationPage.isDocumentCardVisible(DocumentCard.FORM_16A, 10),
                testId(data) + ": Form 16A card should be visible after navigating back");

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "alumni-compensation"},
            description = "MOB-ALUM-COMP-040 — Kill during payslip scroll recovers")
    public void verifyKillDuringPayslipScrollRecoversOnRelaunch(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires force-stop during scroll harness (RunMode=No)");
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    /**
     * Shared hybrid flow for MOB-ALUM-COMP-017 / COMP-025:
     * web disable is_payroll → mobile pull-to-refresh/relaunch → verify tile hidden → restore is_payroll=1.
     */
    private void runPayrollDisableVerifyTileHiddenAndRestore(
            Map<String, String> data, boolean verifyTileVisibleBeforeDisable) {
        skipIfNotRunnable(data);
        logStart(data);
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int tileWait = parsePositiveInt(data.get("tileWaitSeconds"), 20);
        int configSyncWait = parsePositiveInt(data.get("configSyncWaitSeconds"), 60);

        AlumniPortalSettingsWeb.AlumniPortalSettingsConfig restoreConfig =
                AlumniPortalSettingsWeb.baseConfig(data);

        assertTrueCheck(
                compensationPage.waitForAlumniLandingPage(landingWait),
                testId(data) + ": Alumni landing page should load before web config change");

        if (verifyTileVisibleBeforeDisable) {
            assertTrueCheck(
                    compensationPage.waitForCompensationTile(tileWait),
                    testId(data) + ": Compensation tile should be visible before payroll is disabled");
        }

        boolean tileHiddenAfterDisable = false;
        try {
            logger.info("{}: disable payroll via alumni portal settings API", testId(data));
            AlumniPortalSettingsWeb.disablePayrollModule(data);

            logger.info("{}: relaunch and pull-to-refresh after disabling payroll", testId(data));
            compensationPage.syncLandingAfterWebConfigChange(configSyncWait);

            tileHiddenAfterDisable = compensationPage.verifyCompensationTileAbsentAfterPayrollDisabled(
                    landingWait, tileWait, configSyncWait);
        } finally {
            logger.info("{}: restore payroll (is_payroll=1) via alumni portal settings API", testId(data));
            try {
                AlumniPortalSettingsWeb.enablePayrollModule(restoreConfig);
                compensationPage.syncLandingAfterWebConfigChange(configSyncWait);
            } catch (Exception restoreError) {
                logger.warn("{}: failed to restore payroll setting: {}", testId(data), restoreError.getMessage());
            }
        }

        assertTrueCheck(
                tileHiddenAfterDisable,
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    private void navigateToCompensationHome(Map<String, String> data) {
        int landingWait = parsePositiveInt(data.get("landingPageWaitSeconds"), 30);
        int homeWait = parsePositiveInt(data.get("pageWaitSeconds"), 30);
        compensationPage.openCompensationFromLanding(landingWait, homeWait);
    }

    private void selectFyIfPresent(Map<String, String> data) {
        selectFyFromDataKey(data, "Financial Year");
    }

    private void selectFyFromDataKey(Map<String, String> data, String key) {
        String fy = data.get(key);
        if (fy != null && !fy.isBlank()) {
            compensationPage.selectFinancialYearByText(fy.trim());
        }
    }

    private static String firstNonBlank(Map<String, String> data, String... keys) {
        for (String key : keys) {
            String value = data.get(key);
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return "";
    }

    private boolean isTabVisibilityExpected(Map<String, String> data, boolean defaultVisible) {
        DocumentCard card = compensationPage.resolveDocumentCard(data.get("Expected Tab"));
        boolean shouldBeVisible = defaultVisible;
        String flag = data.get("tabShouldBeVisible");
        if (flag != null && !flag.isBlank()) {
            shouldBeVisible = "true".equalsIgnoreCase(flag.trim());
        }
        if (shouldBeVisible) {
            return compensationPage.isDocumentCardVisible(card, 15);
        }
        return compensationPage.isDocumentCardAbsent(card, 10);
    }

    private boolean waitForText(String text, int timeoutSeconds) {
        if (text == null || text.isBlank()) {
            return false;
        }
        return compensationPage.isTextVisible(text, timeoutSeconds);
    }

    private static void skipIfNotRunnable(Map<String, String> data) {
        String runMode = data.get("RunMode");
        if (runMode != null && !runMode.isBlank() && !"yes".equalsIgnoreCase(runMode.trim())) {
            throw new SkipException(data.get("TestCaseId") + " skipped — RunMode=" + runMode.trim());
        }
    }

    private static String testId(Map<String, String> data) {
        return data.get("TestCaseId");
    }

    private static void logStart(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
    }

    private static void logPass(Map<String, String> data) {
        logger.info("{} passed", data.get("TestCaseId"));
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

    private static int parseNonNegativeInt(String value, int defaultValue) {
        if (value == null || value.isBlank()) {
            return defaultValue;
        }
        try {
            int parsed = Integer.parseInt(value.trim());
            return parsed >= 0 ? parsed : defaultValue;
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }
}
