package com.api.framework.mobile.modules.overtime;

import com.api.framework.mobile.MobileTestBase;
import com.api.framework.mobile.util.TestDataProvider;
import com.pages.mobileLogin.MobileLoginPage;
import com.pages.overtime.OvertimePage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Map;

public class OvertimeFunctional extends MobileTestBase {

    private static final Logger logger = LoggerFactory.getLogger(OvertimeFunctional.class);

    MobileLoginPage mobileLoginPage;
    OvertimePage    overtimePage;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "setUp")
    public void testSetup() {
        mobileLoginPage = new MobileLoginPage();
        overtimePage    = new OvertimePage();
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression", "smoke"})
    public void applyOvertimeRequest(Map<String, String> data) throws InterruptedException {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        overtimePage.waitForPageLoad();
        overtimePage.applyOvertime(data);

        assertTrueCheck(
            overtimePage.isSubmittedSuccessfully(),
            "Overtime request should be submitted successfully"
        );
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void verifyEmptyOvertimeValidations(Map<String, String> data) {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        overtimePage.waitForPageLoad();
        overtimePage.tapRequestOvertime();
        overtimePage.submitOvertime();

        assertTrueCheck(overtimePage.isDateValidationShown(),   "Date required error expected");
        assertTrueCheck(overtimePage.isTimeValidationShown(),   "Time required error expected");
        assertTrueCheck(overtimePage.isReasonValidationShown(), "Reason required error expected");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void verifyOvertimeDuplicateError(Map<String, String> data) throws InterruptedException {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        overtimePage.waitForPageLoad();
        overtimePage.applyOvertime(data);

        assertTrueCheck(
            overtimePage.isOvertimeOverlapShown(),
            "Duplicate overtime error should appear"
        );
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void verifyCompensatoryCheckbox(Map<String, String> data) throws InterruptedException {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        overtimePage.waitForPageLoad();
        overtimePage.tapRequestOvertime();
        overtimePage.checkCompensatoryLeave();

        logger.info("Compensatory leave checkbox checked successfully");
    }
}
