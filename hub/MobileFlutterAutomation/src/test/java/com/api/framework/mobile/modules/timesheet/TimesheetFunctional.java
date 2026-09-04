package com.api.framework.mobile.modules.timesheet;

import com.api.framework.mobile.MobileTestBase;
import com.api.framework.mobile.util.TestDataProvider;
import com.pages.mobileLogin.MobileLoginPage;
import com.pages.timesheet.TimesheetPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Map;

public class TimesheetFunctional extends MobileTestBase {

    private static final Logger logger = LoggerFactory.getLogger(TimesheetFunctional.class);

    MobileLoginPage mobileLoginPage;
    TimesheetPage   timesheetPage;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "setUp")
    public void testSetup() {
        mobileLoginPage = new MobileLoginPage();
        timesheetPage   = new TimesheetPage();
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression", "smoke"})
    public void addTimesheetEntry(Map<String, String> data) throws InterruptedException {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        timesheetPage.waitForPageLoad();
        timesheetPage.addTimesheetEntry(data);

        assertTrueCheck(
            timesheetPage.isEntrySubmittedSuccessfully(),
            "Timesheet entry should be submitted successfully"
        );
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void verifyEmptyTimesheetValidations(Map<String, String> data) {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        timesheetPage.waitForPageLoad();
        timesheetPage.tapAddEntry();
        timesheetPage.submitEntry();

        assertTrueCheck(timesheetPage.isDateValidationShown(),    "Date required error expected");
        assertTrueCheck(timesheetPage.isProjectValidationShown(), "Project required error expected");
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void verifyTimeOverlapError(Map<String, String> data) throws InterruptedException {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        timesheetPage.waitForPageLoad();
        timesheetPage.addTimesheetEntry(data); // same time slot as existing entry

        assertTrueCheck(
            timesheetPage.isTimeOverlapErrorShown(),
            "Time overlap error should be shown for conflicting entries"
        );
    }

    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void verifyWeeklySwipeNavigation(Map<String, String> data) {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        timesheetPage.waitForPageLoad();
        timesheetPage.swipeToNextWeek();
        timesheetPage.swipeToPrevWeek();

        logger.info("Weekly view swipe navigation completed without crash");
    }
}
