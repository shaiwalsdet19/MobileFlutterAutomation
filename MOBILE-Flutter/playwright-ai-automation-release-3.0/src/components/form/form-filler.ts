import { Locator as PlaywrightLocator } from '@playwright/test';
import { Locator } from '../../pages/common/locators/common';
import { getFormDetailById } from '../../apis/fse/forms.api';
import { CookieAuthenticatedFlowInput } from '../../apis/common/cookie-auth.api';
import { getCookieString } from '../../helpers/network';
import { FORM_QUESTION_TYPES } from '../../pages/common/form.page';
import { ComponentPage } from '../../fixtures/ui-components.fixture';

export interface NestedQuestionInput {
  questionId: string;
  answer: any;
  comment?: string;
}

export interface FormFieldInput {
  questionId: string;
  answer: any;
  comment?: string;
  nestedQuestions?: NestedQuestionInput[];
}

export interface QuestionConfig {
  questionId: string;
  questionText: string;
  questionType: string;
  nestedQuestions: string[];
}

export interface QuestionMap {
  [questionText: string]: QuestionConfig;
}

interface FormFieldValue {
  answer: any;
  comment?: string;
  nestedQuestions?: NestedQuestionInput[];
}

const FORM_TESTID_PREFIX = 'db-form';

export function resolveLocator(page: ComponentPage, locator: Locator): PlaywrightLocator {
  return page.locator(`[data-testid="${locator.testId}"]`);
}

function getFieldTestId(formId: string, questionId: string): string {
  return `${FORM_TESTID_PREFIX}-${formId}-${questionId}`;
}

function getCommentTestId(formId: string, questionId: string): string {
  return `${FORM_TESTID_PREFIX}-${formId}-${questionId}-comment`;
}

async function fillComment(page: ComponentPage, formId: string, questionId: string, comment: string): Promise<void> {
  const commentTestId = getCommentTestId(formId, questionId);
  await page.uiComponents.textInput(commentTestId).fill(comment);
}

async function fillTextBox(page: ComponentPage, formId: string, questionId: string, value: FormFieldValue): Promise<void> {
  const fieldTestId = getFieldTestId(formId, questionId);
  await page.uiComponents.textInput(fieldTestId).fill(value.answer);
}

async function fillNumeric(page: ComponentPage, formId: string, questionId: string, value: FormFieldValue): Promise<void> {
  const fieldTestId = getFieldTestId(formId, questionId);
  await page.uiComponents.numericInput(fieldTestId).fill(value.answer);
}

async function fillDateTime(page: ComponentPage, formId: string, questionId: string, value: FormFieldValue): Promise<void> {
  const fieldTestId = getFieldTestId(formId, questionId);
  await page.uiComponents.datepicker(fieldTestId).typeDate(value.answer);
}

async function fillConsent(page: ComponentPage, formId: string, questionId: string, value: FormFieldValue): Promise<void> {
  const fieldTestId = getFieldTestId(formId, questionId);
  if (value.answer) {
    await page.uiComponents.consent(fieldTestId).accept();
  } else {
    await page.uiComponents.consent(fieldTestId).decline();
  }
}

async function fillDropdown(page: ComponentPage, formId: string, questionId: string, value: FormFieldValue): Promise<void> {
  const fieldTestId = getFieldTestId(formId, questionId);
  const answer = value.answer;
  if (Array.isArray(answer)) {
    await page.uiComponents.dropdown(fieldTestId).selectOptions(answer);
  } else {
    await page.uiComponents.dropdown(fieldTestId).selectOption(answer);
  }
}

async function fillChoices(page: ComponentPage, formId: string, questionId: string, value: FormFieldValue): Promise<void> {
  const fieldTestId = getFieldTestId(formId, questionId);
  await page.uiComponents.radioGroup(fieldTestId).selectOption(value.answer);
}

function getNestedFieldTestId(formId: string, questionId: string, nestedQuestionId: string): string {
  return `${FORM_TESTID_PREFIX}-${formId}-${questionId}-${nestedQuestionId}`;
}

async function fillReviewParameter(
  page: ComponentPage,
  formId: string,
  questionId: string,
  nestedQuestions: NestedQuestionInput[]
): Promise<void> {
  for (const nested of nestedQuestions) {
    const nestedTestId = getNestedFieldTestId(formId, questionId, nested.questionId);
    await page.uiComponents.rating(nestedTestId).selectByValue(nested.answer);

    if (nested.comment) {
      const commentTestId = `${nestedTestId}-comment`;
      await page.uiComponents.textInput(commentTestId).fill(nested.comment);
    }
  }
}

export async function fillQuestion(
  page: ComponentPage,
  formId: string,
  questionId: string,
  questionType: string,
  value: FormFieldValue
): Promise<void> {
  switch (questionType) {
    case FORM_QUESTION_TYPES.TEXT_BOX:
    case FORM_QUESTION_TYPES.EMAIL:
      await fillTextBox(page, formId, questionId, value);
      break;

    case FORM_QUESTION_TYPES.PHONE_BOX:
      // TODO: Implement phone box fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.CURRENCY:
      // TODO: Implement currency fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.PRESET_DROPDOWN:
      // TODO: Implement preset dropdown fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.PRESET_DRPDOWN_DYNAMIC:
      // TODO: Implement preset dropdown dynamic fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.NUMERIC:
      await fillNumeric(page, formId, questionId, value);
      break;


    case FORM_QUESTION_TYPES.REVIEW_PARAMETER:
    case FORM_QUESTION_TYPES.REVIEW_ASSESSMENT:
      if (value.nestedQuestions && value.nestedQuestions.length > 0) {
        await fillReviewParameter(page, formId, questionId, value.nestedQuestions);
      }
      break;

    case FORM_QUESTION_TYPES.CHOICES:
      // TODO: Implement choices fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.MULTIPLE_CHOICE:
      // TODO: Implement multiple choice fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.DATE_TIME:
      await fillDateTime(page, formId, questionId, value);
      break;

    case FORM_QUESTION_TYPES.CONSENT:
      await fillConsent(page, formId, questionId, value);
      break;

    case FORM_QUESTION_TYPES.PICTURE:
      // TODO: Implement picture fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.PICTURE_MULTIPLE:
      // TODO: Implement picture multiple fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.CUSTOM_DROPDOWN:
    case FORM_QUESTION_TYPES.CUSTOM_DROPDOWN_MULTIPLE:
      await fillDropdown(page, formId, questionId, value);
      break;

    case FORM_QUESTION_TYPES.SIGNATURE:
      // TODO: Implement signature fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.ATTACHMENT:
      // TODO: Implement attachment fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.MULTI_FILE_ATTACHMENT:
      // TODO: Implement multi file attachment fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.RATING:
      // TODO: Implement rating fill
      throw new Error(`Question type "${questionType}" not yet implemented`);


    case FORM_QUESTION_TYPES.RANK_ORDER:
      // TODO: Implement rank order fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.SCALE_MAPPING:
      // TODO: Implement scale mapping fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.SURVEY_PILLAR:
      // TODO: Implement survey pillar fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.NPS_QUESTION:
      // TODO: Implement NPS question fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    case FORM_QUESTION_TYPES.EMPLOYEE_SEARCH:
    case FORM_QUESTION_TYPES.PEOPLE_SELECTOR:
      await fillDropdown(page, formId, questionId, value);
      break;

    case FORM_QUESTION_TYPES.CHECKBOX:
    case FORM_QUESTION_TYPES.SINGLE_CHECKBOX:
      await fillConsent(page, formId, questionId, value);
      break;


    case FORM_QUESTION_TYPES.MASKED_FIELD:
      // TODO: Implement masked field fill
      throw new Error(`Question type "${questionType}" not yet implemented`);

    // Non-fillable question types (display only)
    case FORM_QUESTION_TYPES.IMAGE_TEXT_BOX:
    case FORM_QUESTION_TYPES.MESSAGE:
    case FORM_QUESTION_TYPES.INTRODUCTION_PAGE:
    case FORM_QUESTION_TYPES.EXTERNAL_RESPONDENT_FORM:
    case FORM_QUESTION_TYPES.CUSTOM_THANKYOU_PAGE:
    case FORM_QUESTION_TYPES.CUSTOM_SURVEY_EXPIRED_PAGE:
    case FORM_QUESTION_TYPES.PRECONFIGURED_SURVEY_THEME:
    case FORM_QUESTION_TYPES.QUESTION_LOGIC:
    case FORM_QUESTION_TYPES.ADD_FROM_QUESTION_BANK:
    case FORM_QUESTION_TYPES.SUMMARIZER:
    case FORM_QUESTION_TYPES.SMART_TAGS:
    case FORM_QUESTION_TYPES.REVIEW_ASSESSMENT:
    case FORM_QUESTION_TYPES.MULTI_SELECT_WEIGHTAGE:
    case FORM_QUESTION_TYPES.PRIMARY_ENGAGMENT_INDICATOR:
    case FORM_QUESTION_TYPES.PMS_SCALE:
    case FORM_QUESTION_TYPES.PDFTRON_QUESTION:
      // Skip non-fillable question types
      break;

    default:
      throw new Error(`Unknown question type: "${questionType}" for question "${questionId}"`);
  }

  // Fill comment if provided
  if (value.comment) {
    await fillComment(page, formId, questionId, value.comment);
  }
}

export async function getFormConfig(page: ComponentPage, formId: string): Promise<QuestionMap> {
  const baseUrl = page.url().split('/ms/')[0];
  const cookie = await getCookieString(page);

  const input: CookieAuthenticatedFlowInput = { baseUrl, cookie };
  const response = await getFormDetailById(input, formId);

  const questionMap: QuestionMap = {};
  const questions = response.form_details.questions;

  questions?.forEach((question) => {
    const config = (question.config ?? {});
    const questionId = (question.custom_id ?? config.questionId) as string;
    const questionText = (config.questionText ?? config.question ?? '') as string;
    const questionType = (question.question_type ?? config.questionType) as string;
    console.log("questionMapquestionMap", questionMap);
    
    if (questionId) {
      questionMap[questionId] = {
        questionId,
        questionText,
        questionType: questionType ?? '',
        nestedQuestions: [],
      };
    }
  });
  return questionMap;
}
