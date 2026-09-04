package com.pages.recruitment;

import com.darwinbox.framework.flutter.FlutterElement;
import com.darwinbox.mobile.MobileTestBase.genericHelpers.parameters.helpsers.FlutterHelpers;
import org.openqa.selenium.By;

public class RecruitmentPage extends FlutterHelpers {

    private final ReferTabs referTabs = new ReferTabs();
    private final IJPTabs ijpTabs = new IJPTabs();
    private final JobDetails jobDetails = new JobDetails();
    private final ReferForm referForm = new ReferForm();
    private final ReferJobsListFilter referJobsListFilter = new ReferJobsListFilter();
    private final ViewApplication viewApplication = new ViewApplication();
    private final MyInterviewPage myInterviewPage = new MyInterviewPage();
    private final RequisitionTabs requisitionTabs = new RequisitionTabs();
    private final RaiseRequisitionForm raiseForm = new RaiseRequisitionForm();
    private final CommonElements commonElement = new CommonElements();
    private final NativeElements nativeElements = new NativeElements();

    public class ReferTabs {
        public FlutterElement openReferTabButton = finder.byValueKey("recruitmentHomeRefer");
        public FlutterElement referPageTitle = finder.byValueKey("");
        public FlutterElement referTabButton = finder.byValueKey("tabRefer");
        public FlutterElement myReferralTabButton = finder.byValueKey("tabMyReferral");
        public FlutterElement searchTextField = finder.byValueKey("searchRefer");
    }

    public class IJPTabs {
        public FlutterElement openIJPTabButton = finder.byValueKey("recruitmentHomeIjp");
        public FlutterElement appplyIJPButton = finder.byValueKey("buttonApply");
        public FlutterElement ijpAppliedTabButton = finder.byValueKey("tabMyReferral");
    }

    public class JobDetails {
        public FlutterElement designationOnCard = finder.byValueKey("jobRole");
        public FlutterElement jobDetailsPageTitle = finder.byValueKey("");
        public FlutterElement referButton = finder.byValueKey("buttonRefer");
        public FlutterElement shareButton = finder.byValueKey("buttonShare");
    }

    public class ReferForm {
        public FlutterElement referApplicationPageTitle = finder.byValueKey("");
        public FlutterElement resumeLabel = finder.byValueKey("");
        public FlutterElement submitButton = finder.byValueKey("buttonNext");
        public FlutterElement nextButton = finder.byValueKey("buttonNext");
        public FlutterElement previousButton = finder.byValueKey("buttonCancel");
        public FlutterElement cancelButton = finder.byValueKey("buttonCancel");
    }

    public class ReferJobsListFilter {
        public FlutterElement filterIcon = finder.byValueKey("");
        public FlutterElement companyDropdown = finder.byValueKey("");
        public FlutterElement companyOption = finder.byValueKey("");
        public FlutterElement businessUnitDropdown = finder.byValueKey("");
        public FlutterElement businessUnitOption = finder.byValueKey("");
        public FlutterElement departmentDropdown = finder.byValueKey("");
        public FlutterElement departmentOption = finder.byValueKey("");
        public FlutterElement locationDropdown = finder.byValueKey("");
        public FlutterElement locationOption = finder.byValueKey("");
        public FlutterElement employeeTypeDropdown = finder.byValueKey("");
        public FlutterElement employeeTypeOption = finder.byValueKey("");
        public FlutterElement postedDatePicker = finder.byValueKey("");
        public FlutterElement applyButton = finder.byValueKey("");
        public FlutterElement cancelButton = finder.byValueKey("");
        public FlutterElement submitButton = finder.byValueKey("");
        public FlutterElement resetButton = finder.byValueKey("");
    }

    public class ViewApplication {
        public FlutterElement searchMyReferral = finder.byValueKey("searchMyReferral");
        public FlutterElement viewApplicationButton = finder.byValueKey("viewApplication");
        public FlutterElement viewApplicationPageTitle = finder.byValueKey("");
        public FlutterElement nextButton = finder.byValueKey("buttonNext");
        public FlutterElement previousButton = finder.byValueKey("buttonCancel");
        public FlutterElement cancelButton = finder.byValueKey("buttonCancel");
        public FlutterElement doneButton = finder.byValueKey("buttonNext");
    }

    public class MyInterviewPage {
        public FlutterElement openMyInterviewPage = finder.byValueKey("recruitmentHomeMyInterview");
        public FlutterElement searchField = finder.byValueKey("search");
        public FlutterElement filterIconButton = finder.byValueKey("buttonFilter");
        public FlutterElement dropdownStatus = finder.byValueKey("dropdownStatus");
        public FlutterElement dropdownJobTitle = finder.byValueKey("dropdownJobTitle");
        public FlutterElement dropdownDepartment = finder.byValueKey("dropdownDepartment");
        public FlutterElement interviewDate = finder.byValueKey("interviewFromDate");
        public FlutterElement interviewDidNotHappenCheckbox = finder.byValueKey("checkboxInterviewDidNotHappen");
        public FlutterElement reviewerCommentField = finder.byValueKey("reviewerComment");
        public FlutterElement closeButton = finder.byValueKey("close");
    }

    public FlutterElement interviewCard(int index) {
        return finder.byValueKey("interviewCard_" + index);
    }

    public FlutterElement openInterviewCard(int index, String element) {
        return finder.byDescendant(interviewCard(index), dynamic("", element), false, true);
    }

    public class RequisitionTabs {
        public FlutterElement openRequisitionTabButton = finder.byValueKey("recruitmentHomeRequisition");
        public FlutterElement requisitionDashboardTitle = finder.byValueKey("Requisition");
        public FlutterElement openTabButton = finder.byText("Open");
        public FlutterElement closedTabButton = finder.byText("Closed");
    }

    FlutterElement getJobCard(int index) {
        return finder.byValueKey("jobcard_" + index);
    }

    FlutterElement openJobCard(int index, String element) {
        return finder.byDescendant(getJobCard(index), dynamic("", element), false, true);
    }

    public FlutterElement dynamic(String param, String dynamic) {
        return finder.byValueKey(param + dynamic);
    }

    public FlutterElement dynamicElement(String param, String dynamic) {
        return finder.byValueKey(param + dynamic);
    }

    public FlutterElement dynamicElementByText(String text) {
        return finder.byText(text);
    }

    public FlutterElement dynamicText(String text) {
        return finder.byText(text);
    }

    public FlutterElement dropdownSearchField = finder.byValueKey("dropdownSearchField");

    public class CommonElements {
        public FlutterElement datePickerEditIconButton = finder.byToolTip("Switch to input");
        public FlutterElement datePickerTextField = finder.byText("");
        public FlutterElement perviousIconButton = finder.byToolTip("Previous month");
        public FlutterElement dateSelect = finder.byText("10");
        public FlutterElement datePickerOkButton = finder.byText("OK");
        public FlutterElement datePickerCancelButton = finder.byValueKey("");
        public FlutterElement goBackArrowIconButton = finder.byValueKey("buttonBack");
    }

    public FlutterElement SaveButton = finder.byText("Save");

    public class RaiseRequisitionForm {
        public FlutterElement raiseRequisitionButton = finder.byValueKey("raise_requisition_button");
        public FlutterElement raiseRequisitionPageTitle = finder.byValueKey("RaiseRequisition");
        public FlutterElement companyDropdown = finder.byValueKey("SelectCompany");
        public FlutterElement searchTextField = finder.byValueKey("SearchText");
        public FlutterElement companyOption = finder.byText("");
        public FlutterElement businessUnitDropdown = finder.byValueKey("SelectBusinessUnit");
        public FlutterElement businessUnitOption = finder.byValueKey("");
        public FlutterElement departmentDropdown = finder.byValueKey("SelectDepartment");
        public FlutterElement departmentOption = finder.byValueKey("");
        public FlutterElement designationDropdown = finder.byValueKey("SelectDesignation");
        public FlutterElement designationOption = finder.byValueKey("");
        public FlutterElement projectDropdown = finder.byValueKey("");
        public FlutterElement projectOption = finder.byValueKey("");
        public FlutterElement requisitionLocationDropdown = finder.byValueKey("SelectRequisitionLocation");
        public FlutterElement requisitionLocationOption = finder.byValueKey("");
        public FlutterElement addNewPositionButton = finder.byValueKey("addNewPosition");
        public FlutterElement removeNewPositionButton = finder.byValueKey("removeNewPosition");
        public FlutterElement addReplacementPositionButton = finder.byValueKey("addReplacementPosition");
        public FlutterElement removeReplacementPositionButton = finder.byValueKey("removeReplacementPosition");
        public FlutterElement expandPositionDetailsButton = finder.byValueKey("");
        public FlutterElement functionalAreaDropdown = finder.byValueKey("FunctionalAreaDropField");
        public FlutterElement locationDropdown = finder.byValueKey("LocationDropField");
        public FlutterElement reportingManagerDropdown = finder.byValueKey("ReportingManagerDropField");
        public FlutterElement hrbpDropdown = finder.byValueKey("HRBPDropField");
        public FlutterElement dottedLineManagerDropdown = finder.byValueKey("DottedLineManagerDropField");
        public FlutterElement standardRole1Dropdown = finder.byValueKey("StandardRole1DropField");
        public FlutterElement standardRole2Dropdown = finder.byValueKey("StandardRole2DropField");
        public FlutterElement standardRole3Dropdown = finder.byValueKey("StandardRole3DropField");
        public FlutterElement assignmentOneDropdown = finder.byValueKey("AssignmentOneDropField");
        public FlutterElement assignmentTwoDropdown = finder.byValueKey("AssignmentTwoDropField");
        public FlutterElement assignmentThreeDropdown = finder.byValueKey("AssignmentThreeDropField");
        public FlutterElement contributionLevelDropdown = finder.byValueKey("ContributionLevelDropField");
        public FlutterElement employeeTypeDropdown = finder.byValueKey("EmployeeTypeDropField");
        public FlutterElement employeeSubTypeDropdown = finder.byValueKey("EmployeeSubTypeDropField");
        public FlutterElement designationAliasInputField = finder.byValueKey("DesignationAliasTextField");
        public FlutterElement designationTitleDropdown = finder.byValueKey("DesignationTitleDropField");
        public FlutterElement jobLevelDropdown = finder.byValueKey("");
        public FlutterElement nextButton = finder.byValueKey("");
        public FlutterElement experienceRangeSelector = finder.byValueKey("");
        public FlutterElement salaryRangeSelector = finder.byValueKey("");
        public FlutterElement recruitmentStartDatePicker = finder.byValueKey("");
        public FlutterElement hiringLeadDropdown = finder.byValueKey("");
        public FlutterElement commentsInstructionField = finder.byValueKey("");
        public FlutterElement assetRequirementField = finder.byValueKey("");
        public FlutterElement mandatoryFieldsMessage = finder.byValueKey("");
        public FlutterElement genericDropdownOption = finder.byValueKey("");
    }

    public class NativeElements {
        public By multiselectOption = By.xpath("");
        public By jobCardElementNative = By.xpath("//*[contains(@text, 'QA_manual')]");
    }

    public ReferTabs referTabs() {
        return referTabs;
    }

    public IJPTabs ijpTabs() {
        return ijpTabs;
    }

    public JobDetails jobDetails() {
        return jobDetails;
    }

    public ReferForm referForm() {
        return referForm;
    }

    public ReferJobsListFilter referJobsListFilter() {
        return referJobsListFilter;
    }

    public ViewApplication viewApplication() {
        return viewApplication;
    }

    public MyInterviewPage myInterviewPage() {
        return myInterviewPage;
    }

    public RequisitionTabs requisitionTabs() {
        return requisitionTabs;
    }

    public RaiseRequisitionForm raiseForm() {
        return raiseForm;
    }

    public CommonElements commonElements() {
        return commonElement;
    }

    public NativeElements nativeElements() {
        return nativeElements;
    }
}
