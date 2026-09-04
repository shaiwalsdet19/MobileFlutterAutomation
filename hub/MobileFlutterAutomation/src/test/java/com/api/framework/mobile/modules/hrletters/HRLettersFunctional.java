package com.api.framework.mobile.modules.hrletters;

import com.api.framework.mobile.MobileTestBase;
import com.api.framework.mobile.util.TestDataProvider;
import com.pages.hrletters.HRLettersPage;
import com.pages.mobileLogin.MobileLoginPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Map;

public class HRLettersFunctional extends MobileTestBase {

    private static final Logger logger = LoggerFactory.getLogger(HRLettersFunctional.class);

    MobileLoginPage mobileLoginPage;
    HRLettersPage   hrLettersPage;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "setUp")
    public void testSetup() {
        mobileLoginPage = new MobileLoginPage();
        hrLettersPage   = new HRLettersPage();
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression", "smoke"})
    public void requestEmploymentLetter(Map<String, String> data) throws InterruptedException {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        hrLettersPage.waitForPageLoad();
        hrLettersPage.requestLetter(data);

        assertTrueCheck(
            hrLettersPage.isRequestSubmittedSuccessfully(),
            "Letter request should be submitted successfully"
        );
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void requestUrgentSalaryCertificate(Map<String, String> data) throws InterruptedException {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        hrLettersPage.waitForPageLoad();
        hrLettersPage.requestLetter(data); // Urgent=true in JSON

        assertTrueCheck(
            hrLettersPage.isRequestSubmittedSuccessfully(),
            "Urgent salary certificate request should be submitted"
        );
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void verifyLetterPendingStatus(Map<String, String> data) throws InterruptedException {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        hrLettersPage.waitForPageLoad();
        hrLettersPage.requestLetter(data);
        hrLettersPage.scrollLettersList();

        assertTrueCheck(
            hrLettersPage.isLetterPending(),
            "Newly submitted letter should show 'Pending' status"
        );
    }
}
