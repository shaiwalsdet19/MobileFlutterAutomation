package com.pages.overtime;

import com.darwinbox.framework.flutter.FlutterElement;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.parameters.helpsers.FlutterHelpers;

import java.util.Map;

/**
 * OvertimePage — handles the Overtime request module.
 *
 * Field types covered:
 *   - Date field, Overtime Type dropdown
 *   - Start/End time fields
 *   - Reason text field
 *   - Compensatory Leave checkbox
 *   - Attachment button
 *   - Submit button + confirmations
 */
public class OvertimePage extends FlutterHelpers {

    // ---- Screen ----
    public FlutterElement getPageTitle()              { return getFinder().byText("Overtime"); }
    public FlutterElement getRequestOTButton()        { return getFinder().byValueKey("request_overtime_btn"); }

    // ---- Form fields ----
    public FlutterElement getDateField()              { return getFinder().byValueKey("overtime_date_field"); }
    public FlutterElement getOTTypeDropdown()         { return getFinder().byValueKey("overtime_type_dropdown"); }
    public FlutterElement getStartTimeField()         { return getFinder().byValueKey("overtime_start_time"); }
    public FlutterElement getEndTimeField()           { return getFinder().byValueKey("overtime_end_time"); }
    public FlutterElement getReasonField()            { return getFinder().byValueKey("overtime_reason_field"); }
    public FlutterElement getCompensatoryCheckbox()   { return getFinder().byValueKey("overtime_compensatory_checkbox"); }
    public FlutterElement getAttachmentButton()       { return getFinder().byValueKey("overtime_attachment_btn"); }
    public FlutterElement getSubmitButton()           { return getFinder().byValueKey("overtime_submit_btn"); }
    public FlutterElement getOkButton()               { return getFinder().byText("OK"); }

    // ---- Validation ----
    public FlutterElement getDateError()              { return getFinder().byValueKey("overtime_date_error"); }
    public FlutterElement getTimeError()              { return getFinder().byValueKey("overtime_time_error"); }
    public FlutterElement getReasonError()            { return getFinder().byValueKey("overtime_reason_error"); }

    // ---- Confirmations ----
    public FlutterElement getSuccessToast()           { return getFinder().byText("Overtime request submitted"); }
    public FlutterElement getPendingToast()           { return getFinder().byText("Pending approval"); }
    public FlutterElement getOverlapError()           { return getFinder().byText("Overtime already exists"); }

    // ========================================================
    // Actions
    // ========================================================

    public void waitForPageLoad() { waitForPage(getPageTitle()); }

    public OvertimePage tapRequestOvertime() {
        clickAction(getRequestOTButton());
        waitForPage(getSubmitButton());
        return this;
    }

    public OvertimePage selectDate(String day) {
        clickAction(getDateField());
        clickAction(getFinder().byText(day));
        clickAction(getOkButton());
        return this;
    }

    public OvertimePage selectOTType(String type) {
        selectDropdownByText(getOTTypeDropdown(), type);
        return this;
    }

    public OvertimePage selectStartTime(String time) {
        clickAction(getStartTimeField());
        clickAction(getFinder().byText(time));
        clickAction(getOkButton());
        return this;
    }

    public OvertimePage selectEndTime(String time) {
        clickAction(getEndTimeField());
        clickAction(getFinder().byText(time));
        clickAction(getOkButton());
        return this;
    }

    public OvertimePage enterReason(String reason) {
        enterText(getReasonField(), reason);
        return this;
    }

    public OvertimePage checkCompensatoryLeave() {
        clickAction(getCompensatoryCheckbox());
        return this;
    }

    public OvertimePage tapAttachment() {
        clickAction(getAttachmentButton());
        return this;
    }

    public void submitOvertime() {
        clickAction(getSubmitButton());
        waitForAbsent(getFinder().byValueKey("loading_indicator"), 30);
    }

    /** Full happy flow from JSON data */
    public void applyOvertime(Map<String, String> data) {
        tapRequestOvertime();
        selectDate(data.get("Day"));
        selectOTType(data.get("OT Type"));
        selectStartTime(data.get("Start Time"));
        selectEndTime(data.get("End Time"));
        enterReason(data.get("Reason"));
        if ("true".equalsIgnoreCase(data.get("Compensatory"))) {
            checkCompensatoryLeave();
        }
        submitOvertime();
    }

    // ========================================================
    // Verifications
    // ========================================================

    public boolean isSubmittedSuccessfully()  { return waitForElementPresence(getSuccessToast(), 10)
                                                     || waitForElementPresence(getPendingToast(), 10); }
    public boolean isOvertimeOverlapShown()   { return waitForElementPresence(getOverlapError(), 5); }
    public boolean isDateValidationShown()    { return waitForElementPresence(getDateError(), 3); }
    public boolean isTimeValidationShown()    { return waitForElementPresence(getTimeError(), 3); }
    public boolean isReasonValidationShown()  { return waitForElementPresence(getReasonError(), 3); }
}
