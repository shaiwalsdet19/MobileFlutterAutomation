package com.pages.timesheet;

import com.darwinbox.framework.flutter.FlutterElement;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.parameters.helpsers.FlutterHelpers;

import java.util.Map;

/**
 * TimesheetPage — handles both the list view and entry creation form
 * for the Timesheet module.
 *
 * Field types covered:
 *   - Date field (date picker)
 *   - Project / Task dropdowns
 *   - Description text field
 *   - Start Time / End Time (time picker spinners)
 *   - Submit button
 *   - Weekly view swipe navigation
 *   - Toast / error message verification
 */
public class TimesheetPage extends FlutterHelpers {

    // ---- Navigation ----
    public FlutterElement getPageTitle()          { return getFinder().byText("Timesheet"); }
    public FlutterElement getAddEntryButton()     { return getFinder().byValueKey("add_timesheet_entry"); }

    // ---- Entry Form ----
    public FlutterElement getDateField()          { return getFinder().byValueKey("timesheet_date_field"); }
    public FlutterElement getProjectDropdown()    { return getFinder().byValueKey("timesheet_project_dropdown"); }
    public FlutterElement getTaskDropdown()       { return getFinder().byValueKey("timesheet_task_dropdown"); }
    public FlutterElement getDescriptionField()   { return getFinder().byValueKey("timesheet_description_field"); }
    public FlutterElement getStartTimeField()     { return getFinder().byValueKey("timesheet_start_time"); }
    public FlutterElement getEndTimeField()       { return getFinder().byValueKey("timesheet_end_time"); }
    public FlutterElement getSubmitButton()       { return getFinder().byValueKey("timesheet_submit_btn"); }
    public FlutterElement getOkButton()           { return getFinder().byText("OK"); }

    // ---- Weekly view swipe ----
    public FlutterElement getWeeklyContainer()    { return getFinder().byValueKey("timesheet_weekly_view"); }

    // ---- Validation errors ----
    public FlutterElement getDateError()          { return getFinder().byValueKey("timesheet_date_error"); }
    public FlutterElement getProjectError()       { return getFinder().byValueKey("timesheet_project_error"); }
    public FlutterElement getTimeError()          { return getFinder().byValueKey("timesheet_time_error"); }

    // ---- Confirmations ----
    public FlutterElement getSuccessToast()       { return getFinder().byText("Timesheet submitted"); }
    public FlutterElement getOverlapError()       { return getFinder().byText("Time overlap"); }

    // ========================================================
    // Actions
    // ========================================================

    public void waitForPageLoad() {
        waitForPage(getPageTitle());
    }

    public TimesheetPage tapAddEntry() {
        clickAction(getAddEntryButton());
        waitForPage(getSubmitButton());
        return this;
    }

    public TimesheetPage selectDate(String day) {
        clickAction(getDateField());
        clickAction(getFinder().byText(day));
        clickAction(getOkButton());
        return this;
    }

    public TimesheetPage selectProject(String project) {
        selectDropdownByText(getProjectDropdown(), project);
        return this;
    }

    public TimesheetPage selectTask(String task) {
        selectDropdownByText(getTaskDropdown(), task);
        return this;
    }

    public TimesheetPage enterDescription(String description) {
        enterText(getDescriptionField(), description);
        return this;
    }

    public TimesheetPage selectStartTime(String time) {
        clickAction(getStartTimeField());
        // Time picker: tap the time text then OK
        clickAction(getFinder().byText(time));
        clickAction(getOkButton());
        return this;
    }

    public TimesheetPage selectEndTime(String time) {
        clickAction(getEndTimeField());
        clickAction(getFinder().byText(time));
        clickAction(getOkButton());
        return this;
    }

    public void submitEntry() {
        clickAction(getSubmitButton());
        waitForAbsent(getFinder().byValueKey("loading_indicator"), 30);
    }

    /** Swipe left on weekly container = next week */
    public void swipeToNextWeek() {
        swipeOnElement(getWeeklyContainer(), "left");
    }

    /** Swipe right on weekly container = previous week */
    public void swipeToPrevWeek() {
        swipeOnElement(getWeeklyContainer(), "right");
    }

    /** Full happy flow entry from JSON data */
    public void addTimesheetEntry(Map<String, String> data) {
        tapAddEntry();
        selectDate(data.get("Day"));
        selectProject(data.get("Project"));
        selectTask(data.get("Task"));
        enterDescription(data.get("Description"));
        selectStartTime(data.get("Start Time"));
        selectEndTime(data.get("End Time"));
        submitEntry();
    }

    // ========================================================
    // Verifications
    // ========================================================

    public boolean isEntrySubmittedSuccessfully() { return waitForElementPresence(getSuccessToast(), 10); }
    public boolean isTimeOverlapErrorShown()      { return waitForElementPresence(getOverlapError(), 5); }
    public boolean isDateValidationShown()        { return waitForElementPresence(getDateError(), 3); }
    public boolean isProjectValidationShown()     { return waitForElementPresence(getProjectError(), 3); }
    public boolean isTimeValidationShown()        { return waitForElementPresence(getTimeError(), 3); }
}
