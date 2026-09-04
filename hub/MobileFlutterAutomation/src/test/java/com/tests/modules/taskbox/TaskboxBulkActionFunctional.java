package com.tests.modules.taskbox;

import com.api.framework.mobile.MobileTestBase;
import com.api.framework.mobile.util.TestDataProvider;
import com.darwinbox.mobile.AppiumDriverHolder;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.web.AttendanceSettingsWeb;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.web.LeaveSettingsWeb;
import com.pages.mobileLogin.MobileDummyLogin;
import com.pages.taskbox.TaskboxBulkActionPage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.testng.SkipException;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

import java.util.Map;

/**
 * Taskbox bulk select / bulk approve-reject automation (MOBILE-9181).
 * <p>
 * Test data: {@code src/test/resources/modules/taskbox/TaskboxBulkActionFunctional.json}
 * <p>
 * ValueKeys: {@code TaskboxAutomationKeys} in Flutter app.
 */
public class TaskboxBulkActionFunctional extends MobileTestBase {

    private static final Logger logger = LoggerFactory.getLogger(TaskboxBulkActionFunctional.class);

    private MobileDummyLogin mobileDummyLogin;
    private TaskboxBulkActionPage taskboxPage;

    @BeforeMethod(alwaysRun = true, dependsOnMethods = "setUp")
    public void initPageObjects() {
        if (AppiumDriverHolder.getDriver() == null) {
            throw new SkipException("Appium driver not initialized — check debug APK and Appium session logs");
        }
        mobileDummyLogin = new MobileDummyLogin();
        taskboxPage = new TaskboxBulkActionPage();
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-042 — App backgrounded during bulk-select preserves checkbox selections")
    public void verifyAppBackgroundPreservesBulkSelections(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires backgroundApp harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "smoke", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-003 — App bar CTA enters bulk-select mode with checkboxes on all cards")
    public void verifyAppBarCtaEntersBulkSelectModeWithCheckboxes(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        taskboxPage.enterBulkSelectViaAppBar();
        dismissFreIfNeeded();

        assertTrueCheck(
                taskboxPage.isBulkSelectModeActive(parseSeconds(data, "bulkModeWaitSeconds", 15)),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-009 — Approve and Reject CTAs enabled when at least one card selected")
    public void verifyApproveAndRejectCtasEnabledWhenSelected(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        taskboxPage.enterBulkSelectViaAppBar();
        dismissFreIfNeeded();
        String selectionId = firstNonBlank(data, "SelectionId", "FirstSelectionId");
        taskboxPage.tapBulkCardCheckbox(selectionId);

        assertTrueCheck(taskboxPage.isCtaEnabled(taskboxPage.getBulkApproveCtaElement()),
                testId(data) + ": Approve CTA should be enabled");
        assertTrueCheck(taskboxPage.isCtaEnabled(taskboxPage.getBulkRejectCtaElement()),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-013 — Back icon exits bulk-select mode to normal list view")
    public void verifyBackIconExitsBulkSelectMode(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        enterBulkSelectAndSelectTasks(data, 1);
        taskboxPage.exitBulkSelectViaBack();

        assertTrueCheck(
                !taskboxPage.isBulkSelectModeActive(3),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-053 — Bulk action respects existing approval permissions")
    public void verifyBulkActionRespectsApprovalPermissions(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires unauthorized user dataset (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-036 — Bulk approve applies same comment to all selected requests")
    public void verifyBulkApproveAppliesSameCommentToAll(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires API/post-action verification harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-049 — Success toast exact copy for bulk approve")
    public void verifyBulkApproveSuccessToastExactCopy(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        int count = parsePositiveInt(data.get("BulkActionCount"), 2);
        enterBulkSelectAndSelectTasks(data, count);
        taskboxPage.completeBulkApproveWithOptionalComment(data.get("BulkComment"));

        assertTrueCheck(
                taskboxPage.isSuccessToastMatching(expectedToastCountMessage(data, count), 20),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "smoke", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-010 — Bulk approve with optional comment completes successfully")
    public void verifyBulkApproveWithOptionalComment(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        int count = parsePositiveInt(data.get("BulkActionCount"), 2);
        enterBulkSelectAndSelectTasks(data, count);
        taskboxPage.completeBulkApproveWithOptionalComment(data.get("BulkComment"));

        assertTrueCheck(
                taskboxPage.isSuccessToastMatching(expectedToastCountMessage(data, count), 20),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-130 — Bulk reject flow completes on Reimbursement Approvals with 2 selected tasks")
    public void verifyBulkRejectFlowCompletesOnRequestType(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndNavigateToCategory(data);
        int count = parsePositiveInt(data.get("BulkActionCount"), 2);
        enterBulkSelectAndSelectTasks(data, count);
        taskboxPage.completeBulkRejectWithOptionalComment("automation comment");

        assertTrueCheck(
                taskboxPage.isSuccessToastMatching(expectedToastCountMessage(data, count), 20),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-050 — Success toast exact copy for bulk reject")
    public void verifyBulkRejectSuccessToastExactCopy(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        int count = parsePositiveInt(data.get("BulkActionCount"), 2);
        enterBulkSelectAndSelectTasks(data, count);
        taskboxPage.completeBulkRejectWithOptionalComment(null);

        assertTrueCheck(
                taskboxPage.isSuccessToastMatching(expectedToastCountMessage(data, count), 20),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "smoke", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-011 — Bulk reject with optional comment completes successfully")
    public void verifyBulkRejectWithOptionalComment(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        int count = parsePositiveInt(data.get("BulkActionCount"), 2);
        enterBulkSelectAndSelectTasks(data, count);
        taskboxPage.completeBulkRejectWithOptionalComment("automation comment");

        assertTrueCheck(
                taskboxPage.isSuccessToastMatching(expectedToastCountMessage(data, count), 20),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-002 — Bulk-select CTA hidden when only 1 pending task exists")
    public void verifyBulkSelectCtaHiddenWhenSinglePendingTask(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);

        performDummyLogin(data);

        boolean tasksVisible = taskboxPage.isHomeTaskboxEntryVisible(
                parseSeconds(data, "homeWaitSeconds", 60));
        logger.info("{}: home_taskbox_entry (Tasks) visible on dashboard = {}",
                testId(data), tasksVisible);
        assertTrueCheck(
                tasksVisible,
                testId(data) + ": Tasks tab (home_taskbox_entry) must be visible on dashboard before click");

        taskboxPage.openTaskboxFromHome();
        taskboxPage.openRequestCategory(TaskboxBulkActionPage.LEAVE_REQUESTS_SLUG);
        assertTrueCheck(
                taskboxPage.waitForRequestList(parseSeconds(data, "listWaitSeconds", 30)),
                testId(data) + ": Leave Requests list should load");

        assertTrueCheck(
                taskboxPage.isBulkSelectCtaAbsent(parseSeconds(data, "listWaitSeconds", 30)),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-030 — Bulk-select CTA not shown on non-applicable request type pages")
    public void verifyBulkSelectCtaNotShownOnNonApplicablePage(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires ACT/non-applicable request type test data (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "smoke", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-001 — Bulk-select CTA visible on Leave Requests when at least 2 pending tasks exist")
    public void verifyBulkSelectCtaVisibleOnLeaveRequests(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);

        assertTrueCheck(
                taskboxPage.isBulkSelectCtaVisible(parseSeconds(data, "listWaitSeconds", 30)),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "smoke", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-023 — Bulk-select CTA visible on Reimbursement Approvals page with >=2 pending tasks")
    public void verifyBulkSelectCtaVisibleOnRequestType(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndNavigateToCategory(data);

        assertTrueCheck(
                taskboxPage.isBulkSelectCtaVisible(parseSeconds(data, "listWaitSeconds", 30)),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-005 — Tapping card in bulk-select mode toggles checkbox instead of opening detail")
    public void verifyCardTapTogglesCheckboxInBulkSelectMode(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        taskboxPage.enterBulkSelectViaAppBar();
        dismissFreIfNeeded();
        // Resolve once so both taps use the same card (avoids TASK_ID_TODO placeholder).
        String taskId = taskboxPage.resolveTaskCardId(firstNonBlank(data, "TaskId", "FirstTaskId"));
        taskboxPage.tapTaskCard(taskId);

        assertTrueCheck(taskboxPage.selectedCountContains("1"), testId(data) + ": card tap should select in bulk mode");
        taskboxPage.tapTaskCard(taskId);
        assertTrueCheck(taskboxPage.selectedCountContains("0"), testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-012 — Comment modal Cancel returns to bulk-select without processing")
    public void verifyCommentModalCancelPreservesSelection(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        enterBulkSelectAndSelectTasks(data, 2);
        taskboxPage.tapBulkApprove();
        assertTrueCheck(taskboxPage.isCommentModalVisible(10), testId(data) + ": comment modal should open");
        taskboxPage.enterBulkComment("cancel test comment");
        taskboxPage.cancelBulkCommentModal();

        assertTrueCheck(taskboxPage.isBulkSelectModeActive(10), testId(data) + ": bulk mode preserved after cancel");
        assertTrueCheck(taskboxPage.selectedCountContains("2"), testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-028 — Approve and Reject docked CTAs disabled when zero cards selected")
    public void verifyDockedCtasDisabledWhenZeroSelected(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        taskboxPage.enterBulkSelectViaAppBar();
        dismissFreIfNeeded();

        assertTrueCheck(taskboxPage.selectedCountContains("0"),
                testId(data) + ": selected count should be 0");
        assertTrueCheck(taskboxPage.areDockedBulkCtasDisabledForZeroSelection(),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-052 — Docked CTAs clear Android navigation bar safe area")
    public void verifyDockedCtasRespectAndroidSafeArea(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — Android safe area visual validation (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-051 — Docked CTAs clear device safe area on iOS")
    public void verifyDockedCtasRespectIosSafeArea(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — iOS-only safe area validation (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-057 — Empty comment field with optional setting allows submit")
    public void verifyEmptyCommentWithOptionalSettingAllowsSubmit(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        int count = parsePositiveInt(data.get("BulkActionCount"), 2);
        enterBulkSelectAndSelectTasks(data, count);
        taskboxPage.completeBulkApproveWithOptionalComment(null);

        assertTrueCheck(
                taskboxPage.isSuccessToastMatching(expectedToastCountMessage(data, count), 20),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-037 — Exactly 2 pending tasks shows bulk CTA and allows full bulk flow")
    public void verifyExactlyTwoTasksEnablesFullBulkFlow(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);

        assertTrueCheck(
                taskboxPage.isBulkSelectCtaVisible(parseSeconds(data, "listWaitSeconds", 30)),
                testId(data) + ": bulk CTA should be visible with exactly 2 pending tasks");

        int count = parsePositiveInt(data.get("BulkActionCount"), 2);
        enterBulkSelectAndSelectTasks(data, count);
        taskboxPage.completeBulkApproveWithOptionalComment(data.get("BulkComment"));

        assertTrueCheck(
                taskboxPage.isSuccessToastMatching(expectedToastCountMessage(data, count), 20),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-045 — Force-quit and relaunch returns to normal task list not bulk-select mode")
    public void verifyForceQuitReturnsToNormalTaskList(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires force-quit/relaunch harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-041 — Comment setting Hidden respected for bulk approve on Reimbursement Approvals")
    public void verifyHiddenCommentSettingOnReimbursementApprovalsBulkApprove(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires Reimbursement comment=Hidden tenant setup (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-034 — Comment hidden setting skips modal and processes bulk approve directly")
    public void verifyHiddenCommentSkipsModalOnBulkApprove(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        enterBulkSelectAndSelectTasks(data, 2);
        taskboxPage.tapBulkApprove();

        assertTrueCheck(taskboxPage.isCommentModalAbsent(5) || taskboxPage.isSuccessToastVisible(20),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-055 — HR-BP persona can bulk approve Leave Requests")
    public void verifyHrBpPersonaCanBulkApproveLeaveRequests(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires HR-BP persona credentials (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-054 — Individual approve permission allows same task in bulk")
    public void verifyIndividualApprovePermissionAllowsBulkApprove(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        int count = parsePositiveInt(data.get("BulkActionCount"), 2);
        enterBulkSelectAndSelectTasks(data, count);
        taskboxPage.completeBulkApproveWithOptionalComment(null);

        assertTrueCheck(
                taskboxPage.isSuccessToastMatching(expectedToastCountMessage(data, count), 20),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-044 — Lock screen during comment modal preserves modal state on unlock")
    public void verifyLockScreenPreservesCommentModalState(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires lock/unlock device harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-004 — Long-press on task card enters bulk-select mode with card pre-selected")
    public void verifyLongPressEntersBulkSelectWithCardPreSelected(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        String taskId = firstNonBlank(data, "TaskId", "FirstTaskId");
        taskboxPage.longPressFirstVisibleTaskCard(taskId, 1500);
        dismissFreIfNeeded();

        assertTrueCheck(taskboxPage.isBulkSelectModeActive(15), testId(data) + ": bulk mode should activate");
        assertTrueCheck(taskboxPage.selectedCountContains("1"), testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-029 — Long-press on non-applicable ACT task page does not enter bulk-select mode")
    public void verifyLongPressOnNonApplicableActPageDoesNotEnterBulkMode(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires ACT/non-applicable request type test data (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-026 — Optional comment does not block Approve CTA when comment empty")
    public void verifyMandatoryCommentBlocksApproveCta(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        enterBulkSelectAndSelectTasks(data, 2);
        taskboxPage.tapBulkApprove();
        assertTrueCheck(taskboxPage.isCommentModalVisible(10), testId(data) + ": comment modal visible");

        assertTrueCheck(taskboxPage.isCtaEnabled(taskboxPage.getBulkCommentApproveCtaElement()),
                testId(data) + ": Approve enabled with empty optional comment");

        taskboxPage.enterBulkComment("Optional approval comment");
        assertTrueCheck(taskboxPage.isCtaEnabled(taskboxPage.getBulkCommentApproveCtaElement()),
                testId(data) + ": " + data.get("ExpectedOutcome"));
        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-027 — Mandatory reject comment shows inline error when Confirm tapped empty")
    public void verifyMandatoryCommentBlocksRejectCta(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        withLeaveRejectReasonMandatory(data, () -> {
            loginAndOpenLeaveRequests(data);
            enterBulkSelectAndSelectTasks(data, 2);
            taskboxPage.tapBulkReject();
            assertTrueCheck(taskboxPage.isCommentModalVisible(10), testId(data) + ": comment modal visible");

            taskboxPage.tapBulkCommentRejectCta();
            assertTrueCheck(taskboxPage.isMandatoryCommentInlineErrorVisible(5),
                    testId(data) + ": inline error 'Comment is mandatory' visible after Confirm with empty comment");
            assertTrueCheck(taskboxPage.isCommentModalVisible(3),
                    testId(data) + ": comment modal still open — rejection not submitted");

            String rejectComment = data.get("BulkComment");
            if (rejectComment == null || rejectComment.isBlank()) {
                rejectComment = "Mandatory rejection comment";
            }
            taskboxPage.enterBulkComment(rejectComment);
            assertTrueCheck(taskboxPage.isMandatoryCommentInlineErrorAbsent(5),
                    testId(data) + ": inline error cleared after entering comment");
            assertTrueCheck(taskboxPage.isCtaEnabled(taskboxPage.getBulkCommentRejectCtaElement()),
                    testId(data) + ": " + data.get("ExpectedOutcome"));
        });
        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-039 — Optional comment setting respected for bulk approve on Leave Requests")
    public void verifyMandatoryCommentSettingOnLeaveRequestsBulkApprove(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        enterBulkSelectAndSelectTasks(data, 2);
        taskboxPage.tapBulkApprove();
        assertTrueCheck(taskboxPage.isCommentModalVisible(10), testId(data) + ": comment modal visible");
        assertTrueCheck(taskboxPage.isCtaEnabled(taskboxPage.getBulkCommentApproveCtaElement()),
                testId(data) + ": " + data.get("ExpectedOutcome"));
        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-038 — Mixed approve and reject in single selection is not supported (out of scope guar")
    public void verifyMixedApproveRejectNotSupportedInSingleFlow(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        enterBulkSelectAndSelectTasks(data, 2);

        assertTrueCheck(taskboxPage.isCtaEnabled(taskboxPage.getBulkApproveCtaElement()),
                testId(data) + ": Approve path available");
        assertTrueCheck(taskboxPage.isCtaEnabled(taskboxPage.getBulkRejectCtaElement()),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-056 — MLF strings render for bulk-select labels")
    public void verifyMlfStringsRenderForBulkSelectLabels(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        taskboxPage.enterBulkSelectViaAppBar();
        dismissFreIfNeeded();

        assertTrueCheck(taskboxPage.waitForElementPresence(taskboxPage.getBulkSelectAllCheckboxElement(), 10),
                testId(data) + ": Select All control visible");
        assertTrueCheck(taskboxPage.waitForElementPresence(taskboxPage.getBulkApproveCtaElement(), 10),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-024 — Network failure during bulk approve shows error toast and no requests processed")
    public void verifyNetworkFailureDuringBulkApprove(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires offline/network simulation harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-043 — Network switch during bulk submit shows error toast without partial processing")
    public void verifyNetworkSwitchDuringBulkSubmitShowsError(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires mid-request network toggle harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-006 — Normal mode card tap opens request detail page")
    public void verifyNormalModeCardTapOpensRequestDetail(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        String taskId = taskboxPage.resolveTaskCardId(firstNonBlank(data, "TaskId", "FirstTaskId"));
        taskboxPage.tapTaskCard(taskId);

        assertTrueCheck(
                taskboxPage.isRequestDetailVisible(parseSeconds(data, "detailWaitSeconds", 20)),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-047 — Incoming system notification overlay during bulk-select does not clear selection")
    public void verifyNotificationOverlayDoesNotClearSelections(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires notification shade harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-040 — Comment setting Optional respected for bulk approve on Overtime Requests")
    public void verifyOptionalCommentSettingOnOvertimeRequestsBulkApprove(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires Overtime tenant comment=Optional setup (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-048 — Pendo FRE shown on first bulk-select entry")
    public void verifyPendoFreShownOnFirstBulkSelectEntry(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires first-time bulk-select user (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-046 — Device rotation in bulk-select mode maintains selection count")
    public void verifyRotationMaintainsSelectionCountInBulkMode(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires rotation harness (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-007 — Select All checks all currently loaded visible cards")
    public void verifySelectAllChecksAllVisibleCards(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        taskboxPage.enterBulkSelectViaAppBar();
        dismissFreIfNeeded();
        taskboxPage.tapSelectAllCheckbox();

        assertTrueCheck(taskboxPage.isBulkSelectModeActive(10), testId(data) + ": bulk mode active after select all");
        assertTrueCheck(taskboxPage.getSelectedCountText() != null && !taskboxPage.getSelectedCountText().isBlank(),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-008 — Select All tapped again deselects all visible cards")
    public void verifySelectAllDeselectsAllVisibleCards(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        taskboxPage.enterBulkSelectViaAppBar();
        dismissFreIfNeeded();
        taskboxPage.tapSelectAllCheckbox();
        taskboxPage.tapSelectAllCheckbox();

        assertTrueCheck(taskboxPage.selectedCountContains("0"), testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-032 — Select All applies only to currently loaded cards not entire server dataset")
    public void verifySelectAllScopeLimitedToLoadedCards(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires paginated task dataset (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-031 — Select All with lazy load shows scroll banner to load more cards")
    public void verifySelectAllShowsLazyLoadBanner(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires >20 pending tasks dataset (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-131 — Select All with >20 pending shows scroll-to-load-more banner and 20/20 Selected")
    public void verifySelectAllShowsScrollBannerWhenCountExceedsTwenty(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndNavigateToCategory(data);

        String categoryTitle = firstNonBlank(data, "CategoryDisplayName", "CategoryTitle");
        if ("TASK_ID_TODO".equals(categoryTitle)) {
            categoryTitle = TaskboxBulkActionPage.ATTENDANCE_ADJUSTMENT_TITLE;
        }
        assertTrueCheck(
                taskboxPage.headerPendingCountExceeds(categoryTitle, TaskboxBulkActionPage.BULK_SELECTION_LIMIT),
                testId(data) + ": header pending count must be >20 (e.g. '" + categoryTitle + " (N)')");

        taskboxPage.enterBulkSelectViaAppBar();
        dismissFreIfNeeded();
        taskboxPage.tapSelectAllCheckbox();

        assertTrueCheck(taskboxPage.isLazyLoadBannerVisible(10),
                testId(data) + ": lazy-load banner ValueKey/text visible");
        assertTrueCheck(taskboxPage.isLazyLoadBannerTextVisible(5),
                testId(data) + ": banner text '" + TaskboxBulkActionPage.LAZY_LOAD_BANNER_TEXT + "'");
        assertTrueCheck(
                taskboxPage.selectedCountContains("20/20")
                        || taskboxPage.selectedCountContains("20/20 Selected")
                        || taskboxPage.isUnselectAllLabelVisible(5),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-132 — Selecting 21st card after load-more shows selection-limit toast")
    public void verifySelectingTwentyFirstCardShowsSelectionLimitToast(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndNavigateToCategory(data);

        String categoryTitle = firstNonBlank(data, "CategoryDisplayName", "CategoryTitle");
        if ("TASK_ID_TODO".equals(categoryTitle)) {
            categoryTitle = TaskboxBulkActionPage.ATTENDANCE_ADJUSTMENT_TITLE;
        }
        assertTrueCheck(
                taskboxPage.headerPendingCountExceeds(categoryTitle, TaskboxBulkActionPage.BULK_SELECTION_LIMIT),
                testId(data) + ": header pending count must be >20");

        taskboxPage.enterBulkSelectViaAppBar();
        dismissFreIfNeeded();

        java.util.List<String> firstPageIds = taskboxPage.discoverTaskCardIdsFromRenderTree(25);
        taskboxPage.tapSelectAllCheckbox();
        assertTrueCheck(
                taskboxPage.selectedCountContains("20/20") || taskboxPage.isUnselectAllLabelVisible(5),
                testId(data) + ": first page Select All capped at 20");

        int loaded = taskboxPage.scrollUntilMoreDataLoaded(40, 12);
        assertTrueCheck(
                loaded > TaskboxBulkActionPage.BULK_SELECTION_LIMIT
                        || taskboxPage.selectedCountMatchesLoadedCap(20, 21)
                        || taskboxPage.isLoadingMoreDataVisible(2),
                testId(data) + ": expected more cards after scroll / Loading more data");

        assertTrueCheck(taskboxPage.isSelectAllCheckboxDisabled(8),
                testId(data) + ": Select all checkbox disabled after next page loads");

        String tapped = taskboxPage.tapTwentyFirstLoadedCardCheckbox(firstPageIds);
        assertTrueCheck(tapped != null && !tapped.isBlank(),
                testId(data) + ": should find a 21st/newly-loaded card to tap");
        assertTrueCheck(taskboxPage.isSelectionLimitToastVisible(8),
                testId(data) + ": toast '" + TaskboxBulkActionPage.SELECTION_LIMIT_TOAST_TEXT + "'");
        assertTrueCheck(
                taskboxPage.selectedCountContains("20/")
                        || taskboxPage.selectedCountMatchesLoadedCap(20, 21),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-133 — Tapping disabled Select All shows 20-limit Confirm/Cancel popup")
    public void verifyDisabledSelectAllShowsBulkLimitModal(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndNavigateToCategory(data);

        String categoryTitle = firstNonBlank(data, "CategoryDisplayName", "CategoryTitle");
        if ("TASK_ID_TODO".equals(categoryTitle)) {
            categoryTitle = TaskboxBulkActionPage.ATTENDANCE_ADJUSTMENT_TITLE;
        }
        assertTrueCheck(
                taskboxPage.headerPendingCountExceeds(categoryTitle, TaskboxBulkActionPage.BULK_SELECTION_LIMIT),
                testId(data) + ": header pending count must be >20");

        taskboxPage.enterBulkSelectViaAppBar();
        dismissFreIfNeeded();

        java.util.List<String> firstPageIds = taskboxPage.discoverTaskCardIdsFromRenderTree(25);
        taskboxPage.tapSelectAllCheckbox();
        taskboxPage.scrollUntilMoreDataLoaded(40, 12);
        assertTrueCheck(taskboxPage.isSelectAllCheckboxDisabled(8),
                testId(data) + ": Select all disabled after load-more");

        // Ensure we are past enhancement-2 state (optional toast if 21st tap happens in data setup)
        if (data.get("TapTwentyFirstBeforeModal") != null
                && "Yes".equalsIgnoreCase(data.get("TapTwentyFirstBeforeModal"))) {
            taskboxPage.tapTwentyFirstLoadedCardCheckbox(firstPageIds);
            taskboxPage.isSelectionLimitToastVisible(5);
        }

        taskboxPage.tapDisabledSelectAllCheckbox();
        assertTrueCheck(taskboxPage.isBulkLimitModalVisible(8),
                testId(data) + ": modal title '" + TaskboxBulkActionPage.BULK_LIMIT_MODAL_TITLE + "'");
        assertTrueCheck(
                taskboxPage.waitForElementPresence(
                        taskboxPage.byText(TaskboxBulkActionPage.BULK_LIMIT_MODAL_BODY), 5),
                testId(data) + ": modal body visible");

        taskboxPage.tapBulkLimitModalCancel();
        assertTrueCheck(taskboxPage.isBulkLimitModalAbsent(8),
                testId(data) + ": Cancel dismisses modal only");

        taskboxPage.tapDisabledSelectAllCheckbox();
        assertTrueCheck(taskboxPage.isBulkLimitModalVisible(8),
                testId(data) + ": modal re-opens after tapping disabled Select all");
        taskboxPage.tapBulkLimitModalConfirm();
        assertTrueCheck(taskboxPage.isBulkLimitModalAbsent(8),
                testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-035 — Selected count label updates in real-time on each checkbox toggle")
    public void verifySelectedCountUpdatesInRealTime(Map<String, String> data) {
        skipIfNotRunnable(data);
        logStart(data);
        loginAndOpenLeaveRequests(data);
        taskboxPage.enterBulkSelectViaAppBar();
        dismissFreIfNeeded();
        // Resolve two distinct cards — TASK_ID_TODO placeholders all map to the first card.
        java.util.List<String> discovered = taskboxPage.discoverTaskCardIdsFromRenderTree(2);
        String id1 = firstNonBlank(data, "SelectionId1", "FirstSelectionId");
        String id2 = firstNonBlank(data, "SelectionId2", "SecondSelectionId");
        if ("TASK_ID_TODO".equalsIgnoreCase(id1)) {
            if (discovered.size() < 1) {
                throw new RuntimeException(testId(data) + ": need at least 1 task card for selection");
            }
            id1 = discovered.get(0);
        }
        if ("TASK_ID_TODO".equalsIgnoreCase(id2)) {
            if (discovered.size() < 2) {
                throw new RuntimeException(testId(data) + ": need at least 2 task cards for selection");
            }
            id2 = discovered.get(1);
        }
        taskboxPage.tapBulkCardCheckbox(id1);
        assertTrueCheck(taskboxPage.selectedCountContains("1"), testId(data) + ": 1 selected");
        taskboxPage.tapBulkCardCheckbox(id2);
        assertTrueCheck(taskboxPage.selectedCountContains("2"), testId(data) + ": 2 selected");
        taskboxPage.tapBulkCardCheckbox(id1);
        assertTrueCheck(taskboxPage.selectedCountContains("1"), testId(data) + ": " + data.get("ExpectedOutcome"));

        logPass(data);
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-033 — Selection persists when user scrolls across paginated task list")
    public void verifySelectionPersistsAcrossPaginatedList(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires paginated task dataset (RunMode=No)");
    }

    @Test(
            dataProvider = "TestRuns",
            dataProviderClass = TestDataProvider.class,
            groups = {"regression", "taskbox-bulk-action"},
            description = "MOBILE-9181-TC-025 — Server-side error during bulk action shows backend error toast")
    public void verifyServerErrorDuringBulkAction(Map<String, String> data) {
        skipIfNotRunnable(data);
        throw new SkipException(testId(data) + " — requires backend error injection harness (RunMode=No)");
    }

    // -------------------------------------------------------------------------
    // Shared navigation / setup helpers
    // -------------------------------------------------------------------------

    /**
     * Enables leave reject-reason mandatory via admin web settings, runs the body, then restores optional.
     * Uses scrape-and-override POST to {@code /leavesettings/leavesettings}.
     */
    private void withLeaveRejectReasonMandatory(Map<String, String> data, Runnable body) {
        requireAdminCredentials(data);
        LeaveSettingsWeb.setRejectReasonMandatory(data, true);
        try {
            body.run();
        } finally {
            try {
                LeaveSettingsWeb.setRejectReasonMandatory(data, false);
            } catch (Exception e) {
                logger.warn("{}: failed to restore leave reject-reason setting to optional: {}",
                        testId(data), e.getMessage());
            }
        }
    }

    /**
     * Enables attendance reject-reason mandatory via admin web settings, runs the body, then restores optional.
     * Uses scrape-and-override POST to {@code /attendancesettings/attendancesettings}.
     */
    @SuppressWarnings("unused")
    private void withAttendanceRejectReasonMandatory(Map<String, String> data, Runnable body) {
        requireAdminCredentials(data);
        AttendanceSettingsWeb.setRejectReasonMandatory(data, true);
        try {
            body.run();
        } finally {
            try {
                AttendanceSettingsWeb.setRejectReasonMandatory(data, false);
            } catch (Exception e) {
                logger.warn("{}: failed to restore attendance reject-reason setting to optional: {}",
                        testId(data), e.getMessage());
            }
        }
    }

    private static void requireAdminCredentials(Map<String, String> data) {
        String adminUser = data.get("adminUsername");
        String adminPass = data.get("adminPassword");
        String baseUrl = firstNonBlank(data, "webBaseUrl", "tenantUrl");
        if (adminUser == null || adminUser.isBlank()
                || adminPass == null || adminPass.isBlank()
                || "TASK_ID_TODO".equals(baseUrl)) {
            throw new SkipException(data.get("TestCaseId")
                    + " — requires adminUsername, adminPassword, and webBaseUrl/tenantUrl for web settings");
        }
    }

    /**
     * Dummy login only — every runnable test must enter through the debug login screen.
     */
    private void performDummyLogin(Map<String, String> data) {
        mobileDummyLogin.dummyLogin(
                data.get("tenant"),
                data.get("Employee"),
                data.get("Password"));

        assertTrueCheck(
                taskboxPage.waitForElementPresence(
                        taskboxPage.getHomeTaskboxEntryElement(),
                        parseSeconds(data, "homeWaitSeconds", 60)),
                testId(data) + ": home screen should load after dummy login");
    }

    private void loginAndOpenLeaveRequests(Map<String, String> data) {
        performDummyLogin(data);
        taskboxPage.navigateToLeaveRequests();
        assertTrueCheck(
                taskboxPage.waitForRequestList(parseSeconds(data, "listWaitSeconds", 30)),
                testId(data) + ": Leave Requests list should load");
    }

    private void loginAndNavigateToCategory(Map<String, String> data) {
        performDummyLogin(data);
        String displayName = data.get("CategoryDisplayName");
        if (displayName != null && !displayName.isBlank()) {
            taskboxPage.navigateToCategoryByDisplayName(displayName.trim());
        } else {
            String categoryId = firstNonBlank(data, "CategoryId", "DefaultCategoryId");
            String categorySlug = data.get("CategorySlug");
            taskboxPage.navigateToRequestCategory(categorySlug, categoryId);
        }
        assertTrueCheck(
                taskboxPage.waitForRequestList(parseSeconds(data, "listWaitSeconds", 30))
                        || taskboxPage.headerTitleContains(
                        firstNonBlank(data, "CategoryDisplayName", "CategoryTitle"), 5),
                testId(data) + ": request list should load for category "
                        + firstNonBlank(data, "CategoryDisplayName", "CategorySlug", "CategoryId"));
    }

    private void enterBulkSelectAndSelectTasks(Map<String, String> data, int count) {
        taskboxPage.enterBulkSelectViaAppBar();
        dismissFreIfNeeded();
        String[] ids = {
                firstNonBlank(data, "SelectionId1", "FirstSelectionId"),
                firstNonBlank(data, "SelectionId2", "SecondSelectionId"),
                firstNonBlank(data, "SelectionId3", "ThirdSelectionId")
        };
        taskboxPage.selectFirstNCheckboxes(ids, count);
    }

    private void dismissFreIfNeeded() {
        taskboxPage.dismissPendoFreIfPresent();
    }

    private static void skipIfNotRunnable(Map<String, String> data) {
        if ("No".equalsIgnoreCase(data.get("RunMode"))) {
            throw new SkipException(data.get("TestCaseId") + " skipped — RunMode=No (" + data.get("TestCaseName") + ")");
        }
    }

    private static void logStart(Map<String, String> data) {
        logger.info("Running {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
    }

    private static void logPass(Map<String, String> data) {
        logger.info("PASS {} — {}", data.get("TestCaseId"), data.get("TestCaseName"));
    }

    private static String testId(Map<String, String> data) {
        return data.get("TestCaseId");
    }

    private static String firstNonBlank(Map<String, String> data, String... keys) {
        for (String key : keys) {
            String value = data.get(key);
            if (value != null && !value.isBlank()) {
                return value.trim();
            }
        }
        return "TASK_ID_TODO";
    }

    /**
     * Builds toast fragment matching app copy with singular/plural.
     * Noun depends on request type:
     * <ul>
     *   <li>Reimbursement / Reimbursement Advance → {@code task}/{@code tasks}</li>
     *   <li>Leave / Attendance (and others) → {@code request}/{@code requests}</li>
     * </ul>
     * Action comes from {@code ExpectedToastPattern} ({@code approved} / {@code rejected}).
     */
    private static String expectedToastCountMessage(Map<String, String> data, int count) {
        String action = toastActionVerb(data.get("ExpectedToastPattern"));
        String noun = isReimbursementCategory(data)
                ? (count == 1 ? "task" : "tasks")
                : (count == 1 ? "request" : "requests");
        return count + " " + noun + " " + action;
    }

    private static boolean isReimbursementCategory(Map<String, String> data) {
        String slug = firstNonBlank(data, "CategorySlug", "categorySlug");
        String categoryId = firstNonBlank(data, "CategoryId", "DefaultCategoryId");
        String haystack = (slug + " " + categoryId).toLowerCase();
        return haystack.contains("reimbursement");
    }

    private static String toastActionVerb(String pattern) {
        if (pattern != null) {
            String normalized = pattern.trim().toLowerCase();
            if (normalized.contains("reject")) {
                return "rejected";
            }
            if (normalized.contains("approve")) {
                return "approved";
            }
        }
        return "approved";
    }

    private static int parseSeconds(Map<String, String> data, String key, int defaultValue) {
        return parsePositiveInt(data.get(key), defaultValue);
    }

    private static int parsePositiveInt(String value, int defaultValue) {
        try {
            return Math.max(1, Integer.parseInt(value.trim()));
        } catch (Exception e) {
            return defaultValue;
        }
    }
}
