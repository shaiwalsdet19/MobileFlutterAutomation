package com.pages.taskbox;

import com.darwinbox.framework.flutter.FlutterElement;
import com.darwinbox.mobile.AppiumDriverHolder;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.parameters.helpsers.FlutterHelpers;
import io.appium.java_client.AppiumDriver;
import io.appium.java_client.InteractsWithApps;
import io.appium.java_client.remote.SupportsRotation;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.ScreenOrientation;
import org.openqa.selenium.interactions.PointerInput;
import org.openqa.selenium.interactions.Sequence;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.File;
import java.time.Duration;
import java.util.Collections;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

/**
 * Page object for Taskbox bulk select / bulk approve-reject (MOBILE-9181).
 * <p>
 * ValueKeys map to Flutter {@code TaskboxAutomationKeys}.
 * Source: {@code docs/taskbox-automation-keys-mapping.md}
 * <p>
 * Category / screen keys use automation <em>slugs</em>
 * (e.g. {@code taskbox_category_leave_requests}), not backend categoryIds.
 */
public class TaskboxBulkActionPage extends FlutterHelpers {

    private static final Logger logger = LoggerFactory.getLogger(TaskboxBulkActionPage.class);

    // Navigation
    private static final String HOME_TASKBOX_ENTRY_KEY = "home_taskbox_entry";
    private static final String REQUEST_LIST_KEY = "taskbox_request_list";
    private static final String REQUEST_DETAIL_SCREEN_KEY = "taskbox_request_detail_screen";

    // Bulk select mode (TaskboxAutomationKeys)
    private static final String BULK_SELECT_APP_BAR_CTA_KEY = "taskbox_bulk_select_app_bar_cta";
    private static final String BULK_SELECT_MODE_CONTAINER_KEY = "taskbox_bulk_select_mode_container";
    private static final String BULK_EXIT_BACK_CTA_KEY = "taskbox_bulk_exit_back_cta";
    private static final String BULK_SELECT_ALL_CHECKBOX_KEY = "taskbox_bulk_select_all_checkbox";
    private static final String BULK_SELECT_ALL_LAZY_BANNER_KEY = "taskbox_bulk_select_all_lazy_banner";
    private static final String BULK_SELECTED_COUNT_LABEL_KEY = "taskbox_bulk_selected_count_label";
    private static final String BULK_APPROVE_CTA_KEY = "taskbox_bulk_approve_cta";
    private static final String BULK_REJECT_CTA_KEY = "taskbox_bulk_reject_cta";

    // Bulk comment modal
    private static final String BULK_COMMENT_MODAL_KEY = "taskbox_bulk_comment_modal";
    private static final String BULK_COMMENT_INPUT_KEY = "taskbox_bulk_comment_input";
    private static final String BULK_COMMENT_CANCEL_CTA_KEY = "taskbox_bulk_comment_cancel_cta";
    private static final String BULK_COMMENT_APPROVE_CTA_KEY = "taskbox_bulk_comment_approve_cta";
    private static final String BULK_COMMENT_REJECT_CTA_KEY = "taskbox_bulk_comment_reject_cta";
    /** Inline validation when reject reason is mandatory and Confirm is tapped with empty comment. */
    private static final String MANDATORY_COMMENT_INLINE_ERROR_TEXT = "Comment is mandatory";

    // Toasts / FRE
    private static final String BULK_SUCCESS_TOAST_KEY = "taskbox_bulk_success_toast";
    private static final String BULK_ERROR_TOAST_KEY = "taskbox_bulk_error_toast";
    private static final String BULK_PENDO_FRE_KEY = "taskbox_bulk_pendo_fre";

    // Selection-limit / lazy-load copy (byText — no dedicated ValueKeys beyond lazy banner)
    public static final String LAZY_LOAD_BANNER_TEXT = "Scroll to load more & view further.";
    public static final String LOADING_MORE_DATA_TEXT = "Loading more data";
    public static final String SELECTION_LIMIT_TOAST_TEXT =
            "Selection limit reached. Bulk actions are limited to 20 requests.";
    public static final String BULK_LIMIT_MODAL_TITLE = "Bulk action limited to 20 requests";
    public static final String BULK_LIMIT_MODAL_BODY = "Proceed with selection of first 20 Requests?";
    public static final String UNSELECT_ALL_LABEL = "Unselect all";
    public static final String SELECT_ALL_LABEL = "Select all";
    public static final String ATTENDANCE_ADJUSTMENT_TITLE = "Attendance Adjustment";
    public static final int BULK_SELECTION_LIMIT = 20;

    // Dynamic key patterns — ValueKeys use automation slugs (not backend categoryId).
    // See docs/taskbox-automation-keys-mapping.md (MOBILE-9181).
    private static final String CATEGORY_TILE_PREFIX = "taskbox_category_";
    private static final String REQUEST_TYPE_SCREEN_PREFIX = "taskbox_request_type_";
    private static final String REQUEST_TYPE_SCREEN_SUFFIX = "_screen";
    private static final String TASK_CARD_PREFIX = "taskbox_task_card_";
    private static final String BULK_CARD_CHECKBOX_PREFIX = "taskbox_bulk_card_checkbox_";

    /** Default leave category automation slug (ValueKey segment). */
    public static final String LEAVE_REQUESTS_SLUG = "leave_requests";

    /** Logical slug for Attendance Adjustment ({@code attendance_request}) — no category ValueKey. */
    public static final String ATTENDANCE_ADJUSTMENT_SLUG = "attendance_adjustment";

    /**
     * Automation slug → backend {@code categoryId} from TaskboxAutomationKeys mapping.
     * ValueKeys use the slug, not the backend id.
     */
    private static final Map<String, String> CATEGORY_SLUG_TO_BACKEND_ID = Map.ofEntries(
            Map.entry("leave_requests", "leave_task"),
            Map.entry("optional_holiday_requests", "leave_task_oh"),
            Map.entry("leave_encashment_requests", "leave_encashment"),
            Map.entry("check_in_requests", "attendance_checkin"),
            Map.entry("clock_in_requests", "attendance_task"),
            Map.entry("outduty_requests", "attendance_od"),
            Map.entry("overtime_requests", "compensation_request"),
            Map.entry("planned_overtime_requests", "compensation_request_planned"),
            Map.entry("reimbursement_approvals", "reimbursements_task"),
            Map.entry("reimbursement_advance_approvals", "reimbursement_advance_work_flow"),
            // No taskbox_category_* / request_type_*_screen ValueKeys — navigate by display name.
            Map.entry("attendance_adjustment", "attendance_request")
    );

    /** Backend categoryIds that receive category/screen automation ValueKeys (1:1). */
    public static final Set<String> APPLICABLE_REQUEST_CATEGORY_IDS = Set.of(
            "leave_task",
            "leave_task_oh",
            "leave_encashment",
            "attendance_checkin",
            "attendance_task",
            "attendance_od",
            "compensation_request",
            "compensation_request_planned",
            "reimbursements_task",
            "reimbursement_advance_work_flow"
    );

    // -------------------------------------------------------------------------
    // Element accessors
    // -------------------------------------------------------------------------

    public FlutterElement getHomeTaskboxEntryElement() {
        return byKey(HOME_TASKBOX_ENTRY_KEY);
    }

    /** True when Tasks bottom-nav item {@code home_taskbox_entry} is present. */
    public boolean isHomeTaskboxEntryVisible(int timeoutSec) {
        boolean visible = waitForElementPresence(getHomeTaskboxEntryElement(), timeoutSec);
        logger.info("home_taskbox_entry visible within {}s = {}", timeoutSec, visible);
        return visible;
    }

    public FlutterElement getRequestListElement() {
        return byKey(REQUEST_LIST_KEY);
    }

    public FlutterElement getRequestDetailScreenElement() {
        return byKey(REQUEST_DETAIL_SCREEN_KEY);
    }

    public FlutterElement getBulkSelectAppBarCtaElement() {
        return byKey(BULK_SELECT_APP_BAR_CTA_KEY);
    }

    public FlutterElement getBulkSelectModeContainerElement() {
        return byKey(BULK_SELECT_MODE_CONTAINER_KEY);
    }

    public FlutterElement getBulkExitBackCtaElement() {
        return byKey(BULK_EXIT_BACK_CTA_KEY);
    }

    public FlutterElement getBulkSelectAllCheckboxElement() {
        return byKey(BULK_SELECT_ALL_CHECKBOX_KEY);
    }

    public FlutterElement getBulkSelectAllLazyBannerElement() {
        return byKey(BULK_SELECT_ALL_LAZY_BANNER_KEY);
    }

    public FlutterElement getBulkSelectedCountLabelElement() {
        return byKey(BULK_SELECTED_COUNT_LABEL_KEY);
    }

    public FlutterElement getBulkApproveCtaElement() {
        return byKey(BULK_APPROVE_CTA_KEY);
    }

    public FlutterElement getBulkRejectCtaElement() {
        return byKey(BULK_REJECT_CTA_KEY);
    }

    public FlutterElement getBulkCommentModalElement() {
        return byKey(BULK_COMMENT_MODAL_KEY);
    }

    public FlutterElement getBulkCommentInputElement() {
        return byKey(BULK_COMMENT_INPUT_KEY);
    }

    public FlutterElement getBulkCommentCancelCtaElement() {
        return byKey(BULK_COMMENT_CANCEL_CTA_KEY);
    }

    public FlutterElement getBulkCommentApproveCtaElement() {
        return byKey(BULK_COMMENT_APPROVE_CTA_KEY);
    }

    public FlutterElement getBulkCommentRejectCtaElement() {
        return byKey(BULK_COMMENT_REJECT_CTA_KEY);
    }

    public FlutterElement getBulkSuccessToastElement() {
        return byKey(BULK_SUCCESS_TOAST_KEY);
    }

    public FlutterElement getBulkErrorToastElement() {
        return byKey(BULK_ERROR_TOAST_KEY);
    }

    public FlutterElement getBulkPendoFreElement() {
        return byKey(BULK_PENDO_FRE_KEY);
    }

    public FlutterElement getCategoryTileElement(String categorySlug) {
        return byKey(categoryTileKey(categorySlug));
    }

    public FlutterElement getRequestTypeScreenElement(String categorySlug) {
        return byKey(requestTypeScreenKey(categorySlug));
    }

    public FlutterElement getTaskCardElement(String taskId) {
        return byKey(TASK_CARD_PREFIX + taskId);
    }

    public FlutterElement getBulkCardCheckboxElement(String selectionId) {
        return byKey(BULK_CARD_CHECKBOX_PREFIX + selectionId);
    }

    /** ValueKey: {@code taskbox_category_leave_requests} (slug, no {@code _tile} suffix). */
    public static String categoryTileKey(String categorySlug) {
        return CATEGORY_TILE_PREFIX + normalizeSlug(categorySlug);
    }

    /** ValueKey: {@code taskbox_request_type_leave_requests_screen}. */
    public static String requestTypeScreenKey(String categorySlug) {
        return REQUEST_TYPE_SCREEN_PREFIX + normalizeSlug(categorySlug) + REQUEST_TYPE_SCREEN_SUFFIX;
    }

    public static String resolveBackendCategoryId(String categorySlug, String fallback) {
        if (categorySlug == null || categorySlug.isBlank()) {
            return fallback != null && !fallback.isBlank() ? fallback : "leave_task";
        }
        String slug = normalizeSlug(categorySlug);
        return CATEGORY_SLUG_TO_BACKEND_ID.getOrDefault(slug, fallback != null ? fallback : slug);
    }

    /** @deprecated use {@link #resolveBackendCategoryId(String, String)} */
    public static String resolveCategoryId(String categorySlug, String fallback) {
        return resolveBackendCategoryId(categorySlug, fallback);
    }

    private static String normalizeSlug(String categorySlug) {
        if (categorySlug == null || categorySlug.isBlank()) {
            return LEAVE_REQUESTS_SLUG;
        }
        String slug = categorySlug.trim();
        // Accept either automation slug or backend categoryId.
        for (Map.Entry<String, String> entry : CATEGORY_SLUG_TO_BACKEND_ID.entrySet()) {
            if (entry.getValue().equals(slug)) {
                return entry.getKey();
            }
        }
        return slug;
    }

    // -------------------------------------------------------------------------
    // Navigation
    // -------------------------------------------------------------------------

    public void openTaskboxFromHome() {
        FlutterElement entry = getHomeTaskboxEntryElement();
        if (!waitForElementPresence(entry, 60)) {
            throw new RuntimeException("home_taskbox_entry not visible after login");
        }
        System.out.println("[CHECK] home_taskbox_entry IS visible on dashboard");

        // Proven path: flutter:getOffset (logical) × device density → adb tap.
        // Flutter WebElement.click() hangs on SDSAnimatedNavItem; %-tap can hit system nav.
        Object center = getElementOffset(entry, "center");
        System.out.println("[CHECK] flutter:getOffset center=" + center);
        tapAtFlutterCenterNatively(center);

        FlutterElement leaveTile = getCategoryTileElement(LEAVE_REQUESTS_SLUG);
        if (!waitForElementPresence(leaveTile, 12)) {
            System.out.println("[WARN] leave_requests tile absent after getOffset tap; retry %-tap");
            tapTasksBottomNavByScreenPercent(0.31, 0.89);
        }
        if (!waitForElementPresence(leaveTile, 20)) {
            System.out.println("[WARN] Still no Taskbox — retry getOffset tap");
            tapAtFlutterCenterNatively(getElementOffset(entry, "center"));
        }
        if (!waitForElementPresence(leaveTile, 25)) {
            throw new RuntimeException(
                    "Taskbox home did not open after tapping home_taskbox_entry "
                            + "(element was visible but tap did not open Taskbox; leave_requests tile absent)");
        }
        System.out.println("[CHECK] Taskbox opened — taskbox_category_leave_requests visible");
    }

    /** Quiet sleep helper for tap retries. */
    private static void Thread_sleepQuiet(long ms) {
        try {
            Thread.sleep(ms);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    /**
     * Tap Tasks bottom-nav via adb using physical screen percentages.
     * Layout: Dashboard | Tasks | + | Apps | My Hub → Tasks ≈ 28% from left, ~93% from top.
     */
    private void tapTasksBottomNavByScreenPercent() {
        tapTasksBottomNavByScreenPercent(0.28, 0.93);
    }

    private void tapTasksBottomNavByScreenPercent(double xPct, double yPct) {
        int[] size = readPhysicalScreenSize();
        int x = (int) Math.round(size[0] * xPct);
        int y = (int) Math.round(size[1] * yPct);
        System.out.println("[CHECK] Tasks bottom-nav adb tap at (" + x + "," + y
                + ") pct=(" + xPct + "," + yPct + ") screen=" + size[0] + "x" + size[1]);
        adbTap(x, y);
        try {
            Thread.sleep(1200);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private int[] readPhysicalScreenSize() {
        try {
            String udid = String.valueOf(AppiumDriverHolder.getDriver().getCapabilities().getCapability("appium:udid"));
            File adbBin = new File(System.getenv("LOCALAPPDATA") + "\\Android\\Sdk\\platform-tools\\adb.exe");
            String adb = adbBin.isFile() ? adbBin.getAbsolutePath() : "adb";
            ProcessBuilder pb = new ProcessBuilder(adb, "-s", udid, "shell", "wm", "size");
            pb.redirectErrorStream(true);
            Process p = pb.start();
            String out = new String(p.getInputStream().readAllBytes());
            p.waitFor(5, java.util.concurrent.TimeUnit.SECONDS);
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(\\d+)x(\\d+)").matcher(out);
            if (m.find()) {
                return new int[] {Integer.parseInt(m.group(1)), Integer.parseInt(m.group(2))};
            }
        } catch (Exception e) {
            System.out.println("[WARN] Could not read wm size: " + e.getMessage());
        }
        return new int[] {1080, 2400};
    }

    /**
     * Tap Tasks bottom-nav via native context. Flutter ValueKeys are exposed as
     * Android {@code content-desc} / accessibility id for {@code home_taskbox_entry}.
     */
    private boolean tapHomeTaskboxEntryNatively() {
        AppiumDriver driver = AppiumDriverHolder.getDriver();
        String previous = null;
        try {
            previous = switchToNativeContext(driver);
            org.openqa.selenium.WebElement nav = null;
            try {
                nav = driver.findElement(io.appium.java_client.AppiumBy.accessibilityId(HOME_TASKBOX_ENTRY_KEY));
            } catch (Exception ignored) {
                // fall through
            }
            if (nav == null) {
                try {
                    nav = driver.findElement(org.openqa.selenium.By.id(HOME_TASKBOX_ENTRY_KEY));
                } catch (Exception ignored) {
                    // fall through
                }
            }
            if (nav == null) {
                tapTasksBottomNavByScreenPercent();
                return true;
            }
            System.out.println("[CHECK] Native click on home_taskbox_entry via " + nav.getTagName()
                    + " loc=" + nav.getLocation() + " size=" + nav.getSize());
            nav.click();
            return true;
        } catch (Exception e) {
            System.out.println("[WARN] Native tap for home_taskbox_entry failed: " + e.getMessage());
            return false;
        } finally {
            if (previous != null) {
                restoreFlutterContext(driver, previous);
            }
        }
    }

    /**
     * appium-flutter-driver supports {@code flutter:getOffset} (not getCenter/getBottomLeft aliases).
     */
    private Object getElementOffset(FlutterElement element, String offsetType) {
        return AppiumDriverHolder.getDriver().executeScript(
                "flutter:getOffset",
                element,
                Map.of("offsetType", offsetType));
    }

    private void tapAtFlutterCenterNatively(Object center) {
        int[] xy = parseFlutterCenter(center);
        tapAtLogicalCoords(xy[0], xy[1]);
    }

    private void tapAtLogicalCoords(int logicalX, int logicalY) {
        int[] screen = readPhysicalScreenSize();
        int x = logicalX;
        int y = logicalY;
        if (logicalX < screen[0] / 2 && logicalY < screen[1] / 2) {
            double dpr = readDevicePixelRatio();
            x = (int) Math.round(logicalX * dpr);
            y = (int) Math.round(logicalY * dpr);
            System.out.println("[CHECK] Scaled tap logical=(" + logicalX + "," + logicalY
                    + ") dpr=" + dpr + " physical=(" + x + "," + y + ")");
        } else {
            System.out.println("[CHECK] Physical tap (no scale) at (" + x + "," + y + ")");
        }
        adbTap(x, y);
        try {
            Thread.sleep(500);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private double readDevicePixelRatio() {
        try {
            String udid = String.valueOf(AppiumDriverHolder.getDriver().getCapabilities().getCapability("appium:udid"));
            File adbBin = new File(System.getenv("LOCALAPPDATA") + "\\Android\\Sdk\\platform-tools\\adb.exe");
            String adb = adbBin.isFile() ? adbBin.getAbsolutePath() : "adb";
            ProcessBuilder pb = new ProcessBuilder(adb, "-s", udid, "shell", "wm", "density");
            pb.redirectErrorStream(true);
            Process p = pb.start();
            String out = new String(p.getInputStream().readAllBytes());
            p.waitFor(5, java.util.concurrent.TimeUnit.SECONDS);
            // "Physical density: 420" → dpr = 420/160
            java.util.regex.Matcher m = java.util.regex.Pattern.compile("(\\d+)").matcher(out);
            if (m.find()) {
                int density = Integer.parseInt(m.group(1));
                return density / 160.0;
            }
        } catch (Exception e) {
            System.out.println("[WARN] Could not read wm density: " + e.getMessage());
        }
        return 2.625; // common Samsung mid-range fallback
    }

    private static int[] parseFlutterCenter(Object center) {
        if (!(center instanceof Map<?, ?> map)) {
            throw new IllegalArgumentException("Unexpected center payload: " + center);
        }
        Object dxObj = map.containsKey("dx") ? map.get("dx") : map.get("x");
        Object dyObj = map.containsKey("dy") ? map.get("dy") : map.get("y");
        double dx = Double.parseDouble(String.valueOf(dxObj));
        double dy = Double.parseDouble(String.valueOf(dyObj));
        return new int[] {(int) Math.round(dx), (int) Math.round(dy)};
    }

    private String switchToNativeContext(AppiumDriver driver) {
        if (driver instanceof io.appium.java_client.remote.SupportsContextSwitching ctx) {
            String previous = ctx.getContext();
            ctx.context("NATIVE_APP");
            return previous != null ? previous : "FLUTTER";
        }
        throw new RuntimeException("Driver does not support context switching");
    }

    private void restoreFlutterContext(AppiumDriver driver, String previousContext) {
        String target = (previousContext != null && !previousContext.isBlank()
                && !"NATIVE_APP".equals(previousContext))
                ? previousContext
                : "FLUTTER";
        if (driver instanceof io.appium.java_client.remote.SupportsContextSwitching ctx) {
            try {
                ctx.context(target);
            } catch (Exception e) {
                logger.warn("Could not restore Flutter context: {}", e.getMessage());
            }
        }
    }

    private void adbTap(int x, int y) {
        String udid = String.valueOf(AppiumDriverHolder.getDriver().getCapabilities().getCapability("appium:udid"));
        if (udid == null || udid.isBlank() || "null".equals(udid)) {
            udid = String.valueOf(AppiumDriverHolder.getDriver().getCapabilities().getCapability("udid"));
        }
        File adbBin = new File(System.getenv("LOCALAPPDATA") + "\\Android\\Sdk\\platform-tools\\adb.exe");
        String adb = adbBin.isFile() ? adbBin.getAbsolutePath() : "adb";
        ProcessBuilder pb = new ProcessBuilder(
                adb, "-s", udid, "shell", "input", "tap", String.valueOf(x), String.valueOf(y));
        pb.redirectErrorStream(true);
        try {
            Process p = pb.start();
            if (!p.waitFor(10, java.util.concurrent.TimeUnit.SECONDS) || p.exitValue() != 0) {
                throw new RuntimeException("adb tap exited with code " + p.exitValue());
            }
        } catch (Exception e) {
            throw new RuntimeException("adb input tap failed at (" + x + "," + y + "): " + e.getMessage(), e);
        }
    }

    /**
     * Opens a request category by automation slug (e.g. {@code leave_requests}).
     * Categories without tile ValueKeys (e.g. Attendance Adjustment) must use
     * {@link #openRequestCategoryByDisplayName(String)}.
     */
    public void openRequestCategory(String categorySlug) {
        String slug = normalizeSlug(categorySlug);
        if (ATTENDANCE_ADJUSTMENT_SLUG.equals(slug) || "attendance_request".equals(categorySlug)) {
            openRequestCategoryByDisplayName(ATTENDANCE_ADJUSTMENT_TITLE);
            return;
        }
        clickAction(getCategoryTileElement(slug));
        // flutter:waitForIdle is not supported by this appium-flutter-driver version
        if (!waitForElementPresence(getRequestTypeScreenElement(slug), 30)) {
            throw new RuntimeException("Request type screen not visible for slug=" + slug);
        }
    }

    /**
     * Opens a category tile by visible title (for categories without {@code taskbox_category_*} keys).
     * Scrolls Taskbox home until the label is visible, then waits for the request list.
     */
    public void openRequestCategoryByDisplayName(String displayName) {
        if (displayName == null || displayName.isBlank()) {
            throw new IllegalArgumentException("Category display name is required");
        }
        FlutterElement tile = byText(displayName.trim());
        boolean found = waitForElementPresence(tile, 5);
        for (int i = 0; !found && i < 8; i++) {
            swipeUp();
            found = waitForElementPresence(tile, 3);
        }
        if (!found) {
            throw new RuntimeException("Category tile not found by text: " + displayName);
        }
        clickAction(tile);
        if (!waitForRequestList(30)) {
            // Header may show "Attendance Adjustment (N)" before list key settles
            if (!waitForElementPresence(byText(displayName.trim()), 10)
                    && !headerTitleContains(displayName.trim(), 5)) {
                throw new RuntimeException("Request list did not open for category: " + displayName);
            }
        }
        System.out.println("[CHECK] Opened category by display name: " + displayName);
    }

    public void navigateToLeaveRequests() {
        openTaskboxFromHome();
        openRequestCategory(LEAVE_REQUESTS_SLUG);
    }

    public void navigateToRequestCategory(String categorySlug, String fallbackCategoryId) {
        openTaskboxFromHome();
        String slug = categorySlug;
        if (slug == null || slug.isBlank()) {
            slug = normalizeSlug(fallbackCategoryId);
        }
        openRequestCategory(slug);
    }

    public void navigateToCategoryByDisplayName(String displayName) {
        openTaskboxFromHome();
        openRequestCategoryByDisplayName(displayName);
    }

    public boolean waitForRequestList(int timeoutSec) {
        return waitForElementPresence(getRequestListElement(), timeoutSec);
    }

    // -------------------------------------------------------------------------
    // Bulk-select actions
    // -------------------------------------------------------------------------

    public void enterBulkSelectViaAppBar() {
        clickAction(getBulkSelectAppBarCtaElement());
        waitForBulkSelectMode(15);
    }

    public void exitBulkSelectViaBack() {
        FlutterElement back = getBulkExitBackCtaElement();
        if (!waitForElementPresence(back, 15)) {
            throw new RuntimeException("taskbox_bulk_exit_back_cta not visible");
        }
        // ValueKey may wrap the whole app bar — Flutter click often misses the back icon.
        // Tap the left side of the keyed region (back chevron), then fall back to device back.
        try {
            Object topLeft = getElementOffset(back, "topLeft");
            Object center = getElementOffset(back, "center");
            int[] tl = parseFlutterCenter(topLeft);
            int[] c = parseFlutterCenter(center);
            int logicalX = tl[0] + 28;
            int logicalY = c[1];
            System.out.println("[CHECK] exit bulk adb-tap near back icon logical=("
                    + logicalX + "," + logicalY + ")");
            tapAtLogicalCoords(logicalX, logicalY);
        } catch (Exception e) {
            System.out.println("[WARN] getOffset exit-back failed, trying Flutter click: " + e.getMessage());
            clickAction(back);
        }
        if (!waitForBulkSelectModeAbsent(8)) {
            System.out.println("[WARN] Still in bulk mode after exit CTA — pressing device back");
            pressBackButton();
        }
        if (!waitForBulkSelectModeAbsent(10)) {
            throw new RuntimeException("Bulk-select mode still active after exit back");
        }
    }

    public boolean waitForBulkSelectMode(int timeoutSec) {
        return waitForElementPresence(getBulkSelectModeContainerElement(), timeoutSec);
    }

    public boolean waitForBulkSelectModeAbsent(int timeoutSec) {
        // flutter:waitForAbsent Map-args is unreliable on this driver — invert short waitFor polls.
        long deadline = System.currentTimeMillis() + Math.max(timeoutSec, 1) * 1000L;
        FlutterElement mode = getBulkSelectModeContainerElement();
        while (System.currentTimeMillis() < deadline) {
            try {
                AppiumDriverHolder.getDriver().executeScript("flutter:waitFor", mode, 1200);
                try {
                    Thread.sleep(250);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return false;
                }
            } catch (Exception e) {
                System.out.println("[CHECK] bulk_select_mode_container absent");
                return true;
            }
        }
        System.out.println("[WARN] bulk_select_mode_container still present after " + timeoutSec + "s");
        return false;
    }

    public void longPressFirstVisibleTaskCard(String taskId, int durationMs) {
        String resolved = resolveTaskCardId(taskId);
        if (resolved != null) {
            System.out.println("[CHECK] Long-press task card id=" + resolved);
            longPressElement(getTaskCardElement(resolved), durationMs);
        } else {
            System.out.println("[CHECK] No TaskId — long-press first card via request-list geometry");
            longPressFirstCardByListGeometry(durationMs);
        }
        if (!waitForBulkSelectMode(15)) {
            throw new RuntimeException("Bulk-select mode did not activate after long-press");
        }
    }

    /**
     * Resolves a real task card ValueKey id. Placeholder {@code TASK_ID_TODO} triggers
     * discovery from {@code flutter:getRenderTree}.
     */
    public String resolveTaskCardId(String taskId) {
        if (taskId != null && !taskId.isBlank() && !"TASK_ID_TODO".equalsIgnoreCase(taskId.trim())) {
            return taskId.trim();
        }
        return discoverFirstTaskCardIdFromRenderTree();
    }

    public String discoverFirstTaskCardIdFromRenderTree() {
        java.util.List<String> ids = discoverTaskCardIdsFromRenderTree(1);
        return ids.isEmpty() ? null : ids.get(0);
    }

    /** Unique task card ids in list order from the Flutter render tree. */
    public java.util.List<String> discoverTaskCardIdsFromRenderTree(int limit) {
        java.util.LinkedHashSet<String> ids = new java.util.LinkedHashSet<>();
        try {
            Object tree = AppiumDriverHolder.getDriver().executeScript("flutter:getRenderTree");
            if (tree == null) {
                return java.util.List.of();
            }
            java.util.regex.Matcher m = java.util.regex.Pattern
                    .compile("taskbox_task_card_([A-Za-z0-9_\\-]+)")
                    .matcher(String.valueOf(tree));
            while (m.find() && ids.size() < Math.max(1, limit)) {
                String id = m.group(1);
                if (!"TASK_ID_TODO".equalsIgnoreCase(id)) {
                    ids.add(id);
                }
            }
            System.out.println("[CHECK] Discovered taskbox_task_card_ ids=" + ids);
        } catch (Exception e) {
            System.out.println("[WARN] getRenderTree failed: " + e.getMessage());
        }
        return new java.util.ArrayList<>(ids);
    }

    private void longPressFirstCardByListGeometry(int durationMs) {
        FlutterElement list = getRequestListElement();
        if (!waitForElementPresence(list, 20)) {
            throw new RuntimeException("taskbox_request_list not visible for long-press fallback");
        }
        // First card sits just below the list top; use a point inside the first tile body
        // (avoid Reject/Approve buttons at the bottom of the card).
        Object topLeft = getElementOffset(list, "topLeft");
        int[] tl = parseFlutterCenter(topLeft); // dx/dy also used for corners
        Object topRight = getElementOffset(list, "topRight");
        int[] tr = parseFlutterCenter(topRight);
        int logicalX = (tl[0] + tr[0]) / 2;
        int logicalY = tl[1] + 90; // ~first card body below list top
        adbLongPressScaled(logicalX, logicalY, durationMs);
    }

    public void tapTaskCard(String taskId) {
        String resolved = resolveTaskCardId(taskId);
        if (resolved == null) {
            throw new RuntimeException("No taskbox_task_card_* found to tap (TaskId missing/placeholder)");
        }
        System.out.println("[CHECK] tapTaskCard id=" + resolved);
        clickAction(getTaskCardElement(resolved));
    }

    public void tapBulkCardCheckbox(String selectionId) {
        String resolved = resolveTaskCardId(selectionId);
        if (resolved == null) {
            throw new RuntimeException("No taskbox_bulk_card_checkbox_* target found (SelectionId missing/placeholder)");
        }
        System.out.println("[CHECK] tapBulkCardCheckbox id=" + resolved);
        clickAction(getBulkCardCheckboxElement(resolved));
    }

    public void tapSelectAllCheckbox() {
        clickAction(getBulkSelectAllCheckboxElement());
    }

    /**
     * Taps Select-all even when the control is disabled (product shows the 20-limit modal).
     * Does not require {@code flutter:waitForTappable}.
     */
    public void tapDisabledSelectAllCheckbox() {
        FlutterElement checkbox = getBulkSelectAllCheckboxElement();
        if (!waitForElementPresence(checkbox, 10)) {
            throw new RuntimeException("taskbox_bulk_select_all_checkbox not present");
        }
        clickAction(checkbox);
    }

    public void tapBulkApprove() {
        clickAction(getBulkApproveCtaElement());
    }

    public void tapBulkReject() {
        clickAction(getBulkRejectCtaElement());
    }

    public void enterBulkComment(String comment) {
        enterText(getBulkCommentInputElement(), comment);
    }

    public void confirmBulkApproveInModal() {
        clickAction(getBulkCommentApproveCtaElement());
    }

    public void confirmBulkRejectInModal() {
        clickAction(getBulkCommentRejectCtaElement());
    }

    /** Taps Confirm on the bulk reject comment modal ({@code taskbox_bulk_comment_reject_cta}). */
    public void tapBulkCommentRejectCta() {
        confirmBulkRejectInModal();
    }

    public void cancelBulkCommentModal() {
        clickAction(getBulkCommentCancelCtaElement());
    }

    public void dismissPendoFreIfPresent() {
        if (waitForElementPresence(getBulkPendoFreElement(), 3)) {
            logger.info("Pendo FRE overlay visible — tapping outside to dismiss if possible");
            try {
                pressBackButton();
            } catch (Exception e) {
                logger.debug("Could not dismiss Pendo FRE via back: {}", e.getMessage());
            }
        }
    }

    public void selectFirstNCheckboxes(String[] selectionIds, int count) {
        java.util.List<String> resolved = new java.util.ArrayList<>();
        if (selectionIds != null) {
            for (String id : selectionIds) {
                if (id != null && !id.isBlank() && !"TASK_ID_TODO".equalsIgnoreCase(id.trim())) {
                    resolved.add(id.trim());
                }
            }
        }
        if (resolved.size() < count) {
            resolved = discoverTaskCardIdsFromRenderTree(count);
        }
        int limit = Math.min(count, resolved.size());
        if (limit < count) {
            throw new RuntimeException(
                    "Need " + count + " task cards to select but only found " + limit);
        }
        for (int i = 0; i < limit; i++) {
            tapBulkCardCheckbox(resolved.get(i));
        }
    }

    public void completeBulkApproveWithOptionalComment(String comment) {
        tapBulkApprove();
        if (waitForElementPresence(getBulkCommentModalElement(), 10)) {
            if (comment != null && !comment.isBlank()) {
                enterBulkComment(comment);
            }
            confirmBulkApproveInModal();
        }
    }

    public void completeBulkRejectWithOptionalComment(String comment) {
        tapBulkReject();
        if (waitForElementPresence(getBulkCommentModalElement(), 10)) {
            if (comment != null && !comment.isBlank()) {
                enterBulkComment(comment);
            }
            confirmBulkRejectInModal();
        } else {
            logger.info("Comment modal not shown — direct reject processing expected");
        }
    }

    // -------------------------------------------------------------------------
    // Verifications
    // -------------------------------------------------------------------------

    public boolean isBulkSelectCtaVisible(int timeoutSec) {
        FlutterElement cta = getBulkSelectAppBarCtaElement();
        if (!waitForElementPresence(cta, timeoutSec)) {
            return false;
        }
        // Presence in the tree is not enough — CTA may be Offstage when count < 2.
        try {
            AppiumDriverHolder.getDriver().executeScript(
                    "flutter:waitForTappable", cta, Math.max(timeoutSec, 1) * 1000);
            return true;
        } catch (Exception e) {
            System.out.println("[CHECK] bulk_select CTA present but not tappable: " + e.getMessage());
            return false;
        }
    }

    public boolean isBulkSelectCtaAbsent(int timeoutSec) {
        FlutterElement cta = getBulkSelectAppBarCtaElement();
        // flutter:waitForAbsent Map-args format returns 500 on this driver; invert waitFor/tappable.
        try {
            Thread.sleep(400);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
        try {
            AppiumDriverHolder.getDriver().executeScript("flutter:waitFor", cta, 2500);
        } catch (Exception e) {
            System.out.println("[CHECK] taskbox_bulk_select_app_bar_cta not in tree → absent");
            return true;
        }
        try {
            AppiumDriverHolder.getDriver().executeScript("flutter:waitForTappable", cta, 2000);
            System.out.println("[CHECK] taskbox_bulk_select_app_bar_cta is tappable → NOT absent");
            return false;
        } catch (Exception e) {
            System.out.println("[CHECK] taskbox_bulk_select_app_bar_cta in tree but not tappable → absent");
            return true;
        }
    }

    public boolean isBulkSelectModeActive(int timeoutSec) {
        return waitForElementPresence(getBulkSelectModeContainerElement(), timeoutSec);
    }

    public boolean isRequestDetailVisible(int timeoutSec) {
        if (waitForElementPresence(getRequestDetailScreenElement(), Math.min(timeoutSec, 8))) {
            return true;
        }
        // Leave request detail may not expose taskbox_request_detail_screen (TM-only key).
        // Detail UI shows "Approval Flow"; list cards do not.
        int fallback = Math.max(timeoutSec - 8, 5);
        if (waitForElementPresence(byText("Approval Flow"), fallback)) {
            System.out.println("[CHECK] Request detail inferred via 'Approval Flow' text");
            return true;
        }
        // Title without pending count, e.g. "Leave Requests" vs "Leave Requests (3)"
        if (waitForElementPresence(byText("Leave Requests"), 2)
                && !waitForElementPresence(getRequestListElement(), 2)) {
            System.out.println("[CHECK] Request detail inferred — list gone, Leave Requests title present");
            return true;
        }
        return false;
    }

    public boolean isCommentModalVisible(int timeoutSec) {
        return waitForElementPresence(getBulkCommentModalElement(), timeoutSec);
    }

    public boolean isCommentModalAbsent(int timeoutSec) {
        return waitForAbsent(getBulkCommentModalElement(), timeoutSec);
    }

    public boolean isMandatoryCommentInlineErrorVisible(int timeoutSec) {
        return waitForElementPresence(byText(MANDATORY_COMMENT_INLINE_ERROR_TEXT), timeoutSec);
    }

    public boolean isMandatoryCommentInlineErrorAbsent(int timeoutSec) {
        // flutter:waitForAbsent Map-args format returns 500 on this driver; invert short waitFor polls.
        long deadline = System.currentTimeMillis() + Math.max(timeoutSec, 1) * 1000L;
        FlutterElement errorText = byText(MANDATORY_COMMENT_INLINE_ERROR_TEXT);
        while (System.currentTimeMillis() < deadline) {
            try {
                AppiumDriverHolder.getDriver().executeScript("flutter:waitFor", errorText, 1200);
                try {
                    Thread.sleep(250);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return false;
                }
            } catch (Exception e) {
                System.out.println("[CHECK] mandatory comment inline error absent");
                return true;
            }
        }
        System.out.println("[WARN] mandatory comment inline error still visible after " + timeoutSec + "s");
        return false;
    }

    public boolean isSuccessToastVisible(int timeoutSec) {
        return waitForElementPresence(getBulkSuccessToastElement(), timeoutSec);
    }

    public boolean isErrorToastVisible(int timeoutSec) {
        return waitForElementPresence(getBulkErrorToastElement(), timeoutSec);
    }

    public String getSelectedCountText() {
        FlutterElement label = getBulkSelectedCountLabelElement();
        if (!waitForElementPresence(label, 15)) {
            return "";
        }
        String viaScript = readFlutterText(label);
        if (viaScript != null && !viaScript.isBlank()) {
            return viaScript;
        }
        // Capped formats from render tree: "20/20 Selected", "20/40 Selected"
        try {
            Object tree = AppiumDriverHolder.getDriver().executeScript("flutter:getRenderTree");
            if (tree != null) {
                java.util.regex.Matcher m = java.util.regex.Pattern
                        .compile("(\\d+\\s*/\\s*\\d+\\s*Selected)", java.util.regex.Pattern.CASE_INSENSITIVE)
                        .matcher(String.valueOf(tree));
                if (m.find()) {
                    return m.group(1).replaceAll("\\s+", " ").trim();
                }
            }
        } catch (Exception e) {
            System.out.println("[WARN] selected-count renderTree probe failed: " + e.getMessage());
        }
        for (String variant : new String[] {
                "20/20 Selected", "20/40 Selected", "20/60 Selected", "0 Selected"
        }) {
            if (waitForElementPresence(byText(variant), 1)) {
                return variant;
            }
        }
        // UI copy is typically "N Selected" — probe common variants when getText is unsupported.
        for (int n = 0; n <= 20; n++) {
            for (String variant : new String[] {n + " Selected", n + " selected"}) {
                if (waitForElementPresence(byText(variant), 1)) {
                    return variant;
                }
            }
        }
        return "";
    }

    public String getSuccessToastText() {
        FlutterElement toast = getBulkSuccessToastElement();
        if (!waitForElementPresence(toast, 5)) {
            return "";
        }
        return readFlutterText(toast);
    }

    public String getErrorToastText() {
        return readFlutterText(getBulkErrorToastElement());
    }

    public boolean selectedCountContains(String expectedFragment) {
        if (expectedFragment == null || expectedFragment.isBlank()) {
            return false;
        }
        String actual = getSelectedCountText();
        if (actual != null && actual.toLowerCase(Locale.ROOT).contains(expectedFragment.toLowerCase(Locale.ROOT))) {
            return true;
        }
        String digits = expectedFragment.replaceAll("[^0-9]", "");
        if (!digits.isBlank()) {
            for (String variant : new String[] {digits + " Selected", digits + " selected"}) {
                if (waitForElementPresence(byText(variant), 2)) {
                    return true;
                }
            }
        }
        return waitForElementPresence(byText(expectedFragment), 2);
    }

    /**
     * Verifies success toast copy quickly while the short-lived SDSToast is still on screen.
     * Avoids long multi-variant probing (toast disappears before those finish).
     */
    public boolean successToastContains(String expectedFragment) {
        if (expectedFragment == null || expectedFragment.isBlank()) {
            return false;
        }
        String trimmed = expectedFragment.trim();

        // Exact expected copy first (with/without checkmark glyph).
        for (String variant : successToastTextVariants(trimmed)) {
            if (waitForElementPresence(byText(variant), 3)) {
                System.out.println("[CHECK] success toast matched byText: " + variant);
                return true;
            }
        }

        // One-shot render-tree search — covers split Text widgets / semantics labels.
        if (renderTreeContainsIgnoreCase(trimmed)) {
            System.out.println("[CHECK] success toast matched in render tree: " + trimmed);
            return true;
        }

        String viaScript = getSuccessToastText();
        if (viaScript != null && viaScript.toLowerCase(Locale.ROOT).contains(trimmed.toLowerCase(Locale.ROOT))) {
            System.out.println("[CHECK] success toast matched flutter:getText: " + viaScript);
            return true;
        }
        System.out.println("[CHECK] success toast did not contain: " + trimmed);
        return false;
    }

    /**
     * Waits for success toast ValueKey, then immediately asserts expected copy before toast auto-dismisses.
     */
    public boolean isSuccessToastMatching(String expectedFragment, int timeoutSec) {
        if (!isSuccessToastVisible(timeoutSec)) {
            return false;
        }
        return successToastContains(expectedFragment);
    }

    private static java.util.List<String> successToastTextVariants(String fragment) {
        java.util.LinkedHashSet<String> variants = new java.util.LinkedHashSet<>();
        variants.add(fragment);
        String plain = fragment.replace("✓", "").trim();
        if (!plain.isEmpty()) {
            variants.add(plain);
            variants.add("✓ " + plain);
            variants.add("✓" + plain);
        }
        return new java.util.ArrayList<>(variants);
    }

    private boolean renderTreeContainsIgnoreCase(String fragment) {
        try {
            Object tree = AppiumDriverHolder.getDriver().executeScript("flutter:getRenderTree");
            if (tree == null) {
                return false;
            }
            return String.valueOf(tree).toLowerCase(Locale.ROOT).contains(fragment.toLowerCase(Locale.ROOT));
        } catch (Exception e) {
            System.out.println("[WARN] renderTreeContains failed: " + e.getMessage());
            return false;
        }
    }

    /** Prefer {@code flutter:getText}; Selenium getText/getAttribute are unimplemented on Flutter driver. */
    private String readFlutterText(FlutterElement element) {
        if (element == null) {
            return "";
        }
        try {
            Object text = AppiumDriverHolder.getDriver().executeScript("flutter:getText", element);
            return text != null ? String.valueOf(text) : "";
        } catch (Exception e) {
            System.out.println("[WARN] flutter:getText failed: " + e.getMessage());
            return "";
        }
    }

    public boolean isCtaEnabled(FlutterElement element) {
        if (!waitForElementPresence(element, 10)) {
            return false;
        }
        try {
            AppiumDriverHolder.getDriver().executeScript("flutter:waitForTappable", element, 3000);
            return true;
        } catch (Exception e) {
            System.out.println("[CHECK] CTA not tappable (treated as disabled): " + e.getMessage());
            return false;
        }
    }

    /**
     * Reliable disabled check for docked Approve/Reject when selection count is 0.
     * <p>
     * {@link #isCtaEnabled(FlutterElement)} uses {@code flutter:waitForTappable}, which still
     * succeeds on greyed SDSButtons (hittable but no-op). This method verifies:
     * <ol>
     *   <li>selected count shows 0</li>
     *   <li>tapping Approve does not open the comment modal</li>
     *   <li>tapping Reject does not open the comment modal</li>
     * </ol>
     */
    public boolean areDockedBulkCtasDisabledForZeroSelection() {
        if (!selectedCountContains("0")) {
            System.out.println("[CHECK] Expected 0 Selected before disabled-CTA check");
            return false;
        }
        if (!waitForElementPresence(getBulkApproveCtaElement(), 10)
                || !waitForElementPresence(getBulkRejectCtaElement(), 10)) {
            System.out.println("[CHECK] Docked Approve/Reject CTAs not present");
            return false;
        }

        tapBulkApprove();
        if (isCommentModalVisible(3)) {
            System.out.println("[CHECK] Approve opened comment modal — CTA is effectively enabled");
            cancelBulkCommentModalIfOpen();
            return false;
        }

        tapBulkReject();
        if (isCommentModalVisible(3)) {
            System.out.println("[CHECK] Reject opened comment modal — CTA is effectively enabled");
            cancelBulkCommentModalIfOpen();
            return false;
        }

        System.out.println("[CHECK] Docked Approve/Reject CTAs blocked with 0 Selected");
        return true;
    }

    private void cancelBulkCommentModalIfOpen() {
        try {
            if (isCommentModalVisible(2)) {
                cancelBulkCommentModal();
            }
        } catch (Exception e) {
            System.out.println("[WARN] Could not cancel comment modal: " + e.getMessage());
            try {
                pressBackButton();
            } catch (Exception ignored) {
                // best-effort cleanup
            }
        }
    }

    public void scrollRequestListDown() {
        swipeUp();
    }

    // -------------------------------------------------------------------------
    // Selection limit / lazy-load helpers (MOBILE-9181 enhancements)
    // -------------------------------------------------------------------------

    /** Banner ValueKey and/or copy after Select All when more pages exist. */
    public boolean isLazyLoadBannerVisible(int timeoutSec) {
        if (waitForElementPresence(getBulkSelectAllLazyBannerElement(), Math.max(2, timeoutSec / 2))) {
            return true;
        }
        return waitForElementPresence(byText(LAZY_LOAD_BANNER_TEXT), timeoutSec);
    }

    public boolean isLazyLoadBannerTextVisible(int timeoutSec) {
        return waitForElementPresence(byText(LAZY_LOAD_BANNER_TEXT), timeoutSec);
    }

    public boolean isUnselectAllLabelVisible(int timeoutSec) {
        return waitForElementPresence(byText(UNSELECT_ALL_LABEL), timeoutSec);
    }

    public boolean isLoadingMoreDataVisible(int timeoutSec) {
        return waitForElementPresence(byText(LOADING_MORE_DATA_TEXT), timeoutSec);
    }

    public boolean isSelectionLimitToastVisible(int timeoutSec) {
        if (waitForElementPresence(byText(SELECTION_LIMIT_TOAST_TEXT), timeoutSec)) {
            return true;
        }
        return renderTreeContainsIgnoreCase(SELECTION_LIMIT_TOAST_TEXT);
    }

    public boolean isBulkLimitModalVisible(int timeoutSec) {
        if (waitForElementPresence(byText(BULK_LIMIT_MODAL_TITLE), timeoutSec)) {
            return true;
        }
        return waitForElementPresence(byText(BULK_LIMIT_MODAL_BODY), Math.max(2, timeoutSec / 2));
    }

    public boolean isBulkLimitModalAbsent(int timeoutSec) {
        long deadline = System.currentTimeMillis() + Math.max(timeoutSec, 1) * 1000L;
        FlutterElement title = byText(BULK_LIMIT_MODAL_TITLE);
        while (System.currentTimeMillis() < deadline) {
            try {
                AppiumDriverHolder.getDriver().executeScript("flutter:waitFor", title, 1200);
                try {
                    Thread.sleep(250);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    return false;
                }
            } catch (Exception e) {
                System.out.println("[CHECK] bulk limit modal absent");
                return true;
            }
        }
        return false;
    }

    public void tapBulkLimitModalCancel() {
        if (!isBulkLimitModalVisible(5)) {
            throw new RuntimeException("Bulk limit modal not visible before Cancel");
        }
        clickAction(byText("Cancel"));
    }

    public void tapBulkLimitModalConfirm() {
        if (!isBulkLimitModalVisible(5)) {
            throw new RuntimeException("Bulk limit modal not visible before Confirm");
        }
        clickAction(byText("Confirm"));
    }

    /** True when Select-all is present but not tappable (disabled after loading past the 20-cap). */
    public boolean isSelectAllCheckboxDisabled(int timeoutSec) {
        FlutterElement checkbox = getBulkSelectAllCheckboxElement();
        if (!waitForElementPresence(checkbox, timeoutSec)) {
            return false;
        }
        return !isCtaEnabled(checkbox);
    }

    /**
     * Parses pending count from a header like {@code Attendance Adjustment (67)}.
     * Returns -1 when the parenthesized count cannot be resolved.
     */
    public int getHeaderPendingCount(String categoryTitlePrefix) {
        String prefix = categoryTitlePrefix == null ? "" : categoryTitlePrefix.trim();
        try {
            Object tree = AppiumDriverHolder.getDriver().executeScript("flutter:getRenderTree");
            if (tree != null) {
                java.util.regex.Matcher m = java.util.regex.Pattern
                        .compile(java.util.regex.Pattern.quote(prefix) + "\\s*\\((\\d+)\\)")
                        .matcher(String.valueOf(tree));
                if (m.find()) {
                    int count = Integer.parseInt(m.group(1));
                    System.out.println("[CHECK] Header pending count from render tree: " + count);
                    return count;
                }
            }
        } catch (Exception e) {
            System.out.println("[WARN] getHeaderPendingCount renderTree failed: " + e.getMessage());
        }
        // Exact title probe for a few likely values is too brittle; rely on contains + regex elsewhere.
        return -1;
    }

    public boolean headerPendingCountExceeds(String categoryTitlePrefix, int minExclusive) {
        int count = getHeaderPendingCount(categoryTitlePrefix);
        if (count > minExclusive) {
            return true;
        }
        return headerTitleContains(categoryTitlePrefix, 5)
                && renderTreeMatchesPendingCountGreaterThan(categoryTitlePrefix, minExclusive);
    }

    public boolean headerTitleContains(String fragment, int timeoutSec) {
        if (fragment == null || fragment.isBlank()) {
            return false;
        }
        if (waitForElementPresence(byText(fragment.trim()), timeoutSec)) {
            return true;
        }
        return renderTreeContainsIgnoreCase(fragment.trim());
    }

    private boolean renderTreeMatchesPendingCountGreaterThan(String prefix, int minExclusive) {
        try {
            Object tree = AppiumDriverHolder.getDriver().executeScript("flutter:getRenderTree");
            if (tree == null) {
                return false;
            }
            java.util.regex.Matcher m = java.util.regex.Pattern
                    .compile(java.util.regex.Pattern.quote(prefix) + "\\s*\\((\\d+)\\)")
                    .matcher(String.valueOf(tree));
            return m.find() && Integer.parseInt(m.group(1)) > minExclusive;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Scrolls the request list until {@code Loading more data} appears or {@code minLoadedCards}
     * unique task cards are discoverable in the render tree.
     *
     * @return discovered card count after scrolling
     */
    public int scrollUntilMoreDataLoaded(int minLoadedCards, int maxScrollAttempts) {
        int target = Math.max(minLoadedCards, BULK_SELECTION_LIMIT + 1);
        int loaded = discoverTaskCardIdsFromRenderTree(target + 10).size();
        boolean sawLoading = false;
        for (int i = 0; i < Math.max(1, maxScrollAttempts) && loaded < target; i++) {
            scrollRequestListDown();
            if (isLoadingMoreDataVisible(2)) {
                sawLoading = true;
                System.out.println("[CHECK] Loading more data visible on scroll attempt " + (i + 1));
                try {
                    Thread.sleep(1500);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            } else {
                try {
                    Thread.sleep(800);
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                    break;
                }
            }
            loaded = Math.max(loaded, discoverTaskCardIdsFromRenderTree(target + 10).size());
            // Selection count "20/40 Selected" also proves more pages loaded
            if (selectedCountMatchesLoadedCap(BULK_SELECTION_LIMIT, target)) {
                loaded = Math.max(loaded, target);
                break;
            }
        }
        System.out.println("[CHECK] After scroll: discoveredCards=" + loaded + " sawLoadingMore=" + sawLoading);
        return loaded;
    }

    /** True when selected-count label matches {@code selected/total Selected} (e.g. 20/40). */
    public boolean selectedCountMatchesLoadedCap(int selected, int minTotal) {
        String actual = getSelectedCountText();
        if (actual != null && !actual.isBlank()) {
            java.util.regex.Matcher m = java.util.regex.Pattern
                    .compile("(\\d+)\\s*/\\s*(\\d+)\\s*Selected", java.util.regex.Pattern.CASE_INSENSITIVE)
                    .matcher(actual);
            if (m.find()) {
                int sel = Integer.parseInt(m.group(1));
                int total = Integer.parseInt(m.group(2));
                return sel == selected && total >= minTotal;
            }
        }
        for (int total : new int[] {minTotal, 40, 60, 80, BULK_SELECTION_LIMIT * 2}) {
            if (total < minTotal) {
                continue;
            }
            String variant = selected + "/" + total + " Selected";
            if (waitForElementPresence(byText(variant), 1)) {
                return true;
            }
        }
        return renderTreeContainsIgnoreCase(selected + "/")
                && renderTreeContainsIgnoreCase("Selected");
    }

    /**
     * After Select All on the first page, finds a newly loaded card id (the "21st") and taps its checkbox.
     *
     * @param firstPageIds card ids known before / during the first Select All page
     * @return tapped id, or null if none found
     */
    public String tapTwentyFirstLoadedCardCheckbox(java.util.Collection<String> firstPageIds) {
        java.util.Set<String> known = new java.util.HashSet<>();
        if (firstPageIds != null) {
            known.addAll(firstPageIds);
        }
        java.util.List<String> after = discoverTaskCardIdsFromRenderTree(60);
        String target = null;
        for (String id : after) {
            if (!known.contains(id)) {
                target = id;
                break;
            }
        }
        if (target == null && after.size() > BULK_SELECTION_LIMIT) {
            target = after.get(BULK_SELECTION_LIMIT);
        }
        if (target == null && !after.isEmpty()) {
            // Last resort: tap the last visible card (newly loaded after scroll)
            target = after.get(after.size() - 1);
        }
        if (target == null) {
            return null;
        }
        System.out.println("[CHECK] Tapping 21st+/newly-loaded card checkbox id=" + target);
        tapBulkCardCheckbox(target);
        return target;
    }

    public void backgroundAppBriefly(int seconds) {
        AppiumDriver driver = AppiumDriverHolder.getDriver();
        if (driver instanceof InteractsWithApps mobileDriver) {
            mobileDriver.runAppInBackground(Duration.ofSeconds(seconds));
        } else {
            throw new IllegalStateException("Driver does not support backgroundApp");
        }
    }

    public void rotateToLandscape() {
        rotateDevice(ScreenOrientation.LANDSCAPE);
    }

    public void rotateToPortrait() {
        rotateDevice(ScreenOrientation.PORTRAIT);
    }

    private void rotateDevice(ScreenOrientation orientation) {
        AppiumDriver driver = AppiumDriverHolder.getDriver();
        if (driver instanceof SupportsRotation rotation) {
            rotation.rotate(orientation);
        } else {
            throw new IllegalStateException("Driver does not support rotation");
        }
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    private FlutterElement byKey(String valueKey) {
        return getFinder().byValueKey(valueKey);
    }

    private void longPressElement(FlutterElement element, int durationMs) {
        if (!waitForElementPresence(element, 30)) {
            throw new RuntimeException("Cannot long-press — element not present");
        }
        // Flutter driver does not implement getLocation/getRect; use getOffset + adb.
        Object center = getElementOffset(element, "center");
        System.out.println("[CHECK] longPress getOffset center=" + center);
        int[] xy = parseFlutterCenter(center);
        adbLongPressScaled(xy[0], xy[1], durationMs);
    }

    private void adbLongPressScaled(int logicalX, int logicalY, int durationMs) {
        int[] screen = readPhysicalScreenSize();
        int x = logicalX;
        int y = logicalY;
        if (logicalX < screen[0] / 2 && logicalY < screen[1] / 2) {
            double dpr = readDevicePixelRatio();
            x = (int) Math.round(logicalX * dpr);
            y = (int) Math.round(logicalY * dpr);
            System.out.println("[CHECK] Long-press scaled logical=(" + logicalX + "," + logicalY
                    + ") dpr=" + dpr + " physical=(" + x + "," + y + ") ms=" + durationMs);
        } else {
            System.out.println("[CHECK] Long-press physical (no scale) at (" + x + "," + y
                    + ") ms=" + durationMs);
        }
        adbLongPress(x, y, durationMs);
    }

    /** Same-point swipe acts as a long-press on Android. */
    private void adbLongPress(int x, int y, int durationMs) {
        String udid = String.valueOf(AppiumDriverHolder.getDriver().getCapabilities().getCapability("appium:udid"));
        if (udid == null || udid.isBlank() || "null".equals(udid)) {
            udid = String.valueOf(AppiumDriverHolder.getDriver().getCapabilities().getCapability("udid"));
        }
        File adbBin = new File(System.getenv("LOCALAPPDATA") + "\\Android\\Sdk\\platform-tools\\adb.exe");
        String adb = adbBin.isFile() ? adbBin.getAbsolutePath() : "adb";
        int hold = Math.max(durationMs, 800);
        ProcessBuilder pb = new ProcessBuilder(
                adb, "-s", udid, "shell", "input", "swipe",
                String.valueOf(x), String.valueOf(y),
                String.valueOf(x), String.valueOf(y),
                String.valueOf(hold));
        pb.redirectErrorStream(true);
        try {
            Process p = pb.start();
            if (!p.waitFor(20, java.util.concurrent.TimeUnit.SECONDS) || p.exitValue() != 0) {
                throw new RuntimeException("adb long-press exited with code " + p.exitValue());
            }
        } catch (Exception e) {
            throw new RuntimeException("adb long-press failed at (" + x + "," + y + "): " + e.getMessage(), e);
        }
    }
}
