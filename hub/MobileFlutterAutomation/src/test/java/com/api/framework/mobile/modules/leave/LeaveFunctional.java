package com.api.framework.mobile.modules.leave;

import com.api.framework.mobile.MobileTestBase;
import com.api.framework.mobile.util.TestDataProvider;
import com.pages.leave.LeaveCreatePage;
import com.pages.leave.LeaveHomePage;
import com.pages.mobileLogin.MobileLoginPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Map;

/**
 * LeaveFunctional — All Leave module test cases.
 *
 * FRAMEWORK PATTERN (identical to AttendanceFunctional):
 *   1. Class extends MobileTestBase
 *   2. @BeforeMethod depends on "setUp" (which is in MobileTestBase)
 *   3. Page objects are created in @BeforeMethod (after driver is ready)
 *   4. Each @Test receives data from TestDataProvider via JSON file
 *   5. JSON file lives at: src/test/resources/modules/leave/LeaveFunctional.json
 *   6. TestMethod in JSON maps exactly to the Java method name here
 *
 * TEST DATA FLOW:
 *   JSON["TestMethod": "applyAnnualLeave"] → runs applyAnnualLeave(Map data)
 *   data.get("Leave Type") → "Annual Leave" (from JSON)
 */
public class LeaveFunctional extends MobileTestBase {

    private static final Logger logger = LoggerFactory.getLogger(LeaveFunctional.class);

    // Page objects — initialised in @BeforeMethod after driver is ready
    MobileLoginPage mobileLoginPage;
    LeaveHomePage leaveHomePage;
    LeaveCreatePage leaveCreatePage;

    /**
     * @BeforeMethod runs AFTER MobileTestBase.setUp() (which starts the driver).
     * dependsOnMethods = "setUp" ensures driver is ready before page objects are created.
     */
    @BeforeMethod(alwaysRun = true, dependsOnMethods = "setUp")
    public void testSetup() {
        mobileLoginPage = new MobileLoginPage();
        leaveHomePage   = new LeaveHomePage();
        leaveCreatePage = new LeaveCreatePage();
    }

    // ========================================================
    // HAPPY FLOW TESTS
    // ========================================================

    /**
     * TC-L-001: Apply Annual Leave (full day) → success toast appears.
     *
     * JSON keys used: tenant, Employee, Password, Leave Type, Start Day, End Day, Reason
     */
    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression", "smoke"})
    public void applyAnnualLeave(Map<String, String> data) throws InterruptedException {
        logger.info("Running: {}", data.get("TestCaseName"));

        // Step 1: Login
        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));

        // Step 2: Navigate to Leave module
        leaveHomePage.waitForPageLoad();

        // Step 3: Apply leave
        leaveCreatePage = leaveHomePage.tapApplyLeave();
        leaveCreatePage.applyLeave(data);

        // Step 4: Verify success
        assertTrueCheck(
            leaveCreatePage.isLeaveSubmittedSuccessfully(),
            "Annual leave should be submitted successfully"
        );
    }

    /**
     * TC-L-002: Apply Half-Day Sick Leave → success toast appears.
     */
    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void applyHalfDaySickLeave(Map<String, String> data) throws InterruptedException {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        leaveHomePage.waitForPageLoad();
        leaveCreatePage = leaveHomePage.tapApplyLeave();
        leaveCreatePage.applyLeave(data); // Half Day=true in JSON

        assertTrueCheck(
            leaveCreatePage.isLeaveSubmittedSuccessfully(),
            "Half-day sick leave should be submitted successfully"
        );
    }

    // ========================================================
    // UI VALIDATION TESTS
    // ========================================================

    /**
     * TC-L-003: Submit empty Leave form → required field validations appear.
     */
    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void verifyEmptyFormValidations(Map<String, String> data) {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        leaveHomePage.waitForPageLoad();
        leaveCreatePage = leaveHomePage.tapApplyLeave();

        // Submit without filling anything
        leaveCreatePage.submitLeave();

        assertTrueCheck(
            leaveCreatePage.isLeaveTypeValidationShown(),
            "Leave type required validation should appear"
        );
        assertTrueCheck(
            leaveCreatePage.isStartDateValidationShown(),
            "Start date required validation should appear"
        );
    }

    /**
     * TC-L-004: Duplicate leave dates → error message shown on popup.
     */
    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void verifyDuplicateLeaveError(Map<String, String> data) throws InterruptedException {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        leaveHomePage.waitForPageLoad();
        leaveCreatePage = leaveHomePage.tapApplyLeave();
        leaveCreatePage.applyLeave(data);

        assertTrueCheck(
            leaveCreatePage.isDuplicateLeaveErrorShown() || leaveCreatePage.isDateOverlapErrorShown(),
            "Duplicate or date overlap error should be shown"
        );
    }

    /**
     * TC-L-005: Leave Balance expand/collapse via chevron.
     */
    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void verifyLeaveBalanceExpandCollapse(Map<String, String> data) {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        leaveHomePage.waitForPageLoad();

        leaveHomePage.expandLeaveBalance();
        assertTrueCheck(leaveHomePage.isLeaveBalanceVisible(), "Leave balance should be expanded");

        leaveHomePage.collapseLeaveBalance();
        assertFalseCheck(leaveHomePage.isLeaveBalanceVisible(), "Leave balance should be collapsed");
    }

    /**
     * TC-L-006: Leave list scroll — no crash.
     */
    @Test(dataProvider = "TestRuns", dataProviderClass = TestDataProvider.class, groups = {"regression"})
    public void verifyLeaveListScroll(Map<String, String> data) {
        logger.info("Running: {}", data.get("TestCaseName"));

        mobileLoginPage.login(data.get("tenant"), data.get("Employee"), data.get("Password"));
        leaveHomePage.waitForPageLoad();
        leaveHomePage.scrollLeaveList();

        logger.info("Leave list scroll completed without crash");
    }
}
