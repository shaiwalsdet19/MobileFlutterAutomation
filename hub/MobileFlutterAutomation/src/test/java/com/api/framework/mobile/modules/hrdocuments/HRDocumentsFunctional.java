package com.api.framework.mobile.modules.hrdocuments;

import com.api.framework.mobile.MobileTestBase;
import com.api.framework.mobile.util.TestDataProvider;
import com.pages.hrdocuments.HRDocumentsPage;
import com.pages.mobileLogin.MobileLoginPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Map;

public class HRDocumentsFunctional extends MobileTestBase {

    private static final Logger logger = LoggerFactory.getLogger(HRDocumentsFunctional.class);

    MobileLoginPage  mobileLoginPage;
    HRDocumentsPage  hrDocumentsPage;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "setUp")
    public void testSetup() {
        mobileLoginPage = new MobileLoginPage();
        hrDocumentsPage = new HRDocumentsPage();
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression", "smoke"})
    public void verifyDocumentsListLoads(Map<String, String> data) {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        hrDocumentsPage.waitForPageLoad();

        assertTrueCheck(
            hrDocumentsPage.waitForElementPresence(hrDocumentsPage.getFirstDocumentItem(), 10),
            "HR Documents list should load with at least one document"
        );
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void searchDocumentByKeyword(Map<String, String> data) {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        hrDocumentsPage.waitForPageLoad();
        hrDocumentsPage.searchDocument(data.get("Search Keyword"));

        assertTrueCheck(
            hrDocumentsPage.waitForElementPresence(hrDocumentsPage.getFirstDocumentItem(), 5),
            "Search should return at least one document"
        );
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void verifyNoResultsForInvalidSearch(Map<String, String> data) {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        hrDocumentsPage.waitForPageLoad();
        hrDocumentsPage.searchDocument(data.get("Search Keyword")); // non-existent keyword

        assertTrueCheck(
            hrDocumentsPage.isNoDocumentsMessageShown(),
            "'No documents found' message should appear for empty results"
        );
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void verifyDocumentDetailExpandCollapse(Map<String, String> data) {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        hrDocumentsPage.waitForPageLoad();
        hrDocumentsPage.tapFirstDocument();

        hrDocumentsPage.expandDocumentDetail();
        assertTrueCheck(hrDocumentsPage.isDetailExpanded(), "Document detail should be expanded");

        hrDocumentsPage.collapseDocumentDetail();
        assertFalseCheck(hrDocumentsPage.isDetailExpanded(), "Document detail should be collapsed");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void downloadDocument(Map<String, String> data) {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        hrDocumentsPage.waitForPageLoad();
        hrDocumentsPage.tapFirstDocument();
        hrDocumentsPage.downloadDocument();

        assertTrueCheck(hrDocumentsPage.isDocumentDownloaded(), "Document download success should appear");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void scrollDocumentList(Map<String, String> data) {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        hrDocumentsPage.waitForPageLoad();
        hrDocumentsPage.scrollDocumentList();

        logger.info("Document list scroll completed without crash");
    }
}
