import { expect, Locator as PlaywrightLocator, Page } from "@playwright/test";
import { TextInputUtils } from "../../components/ui-components/textInput/index.js";
import { BasePage } from "../base.page";

export const FORM_QUESTION_TYPES = {
  TEXT_BOX: "text-box",
  PHONE_BOX: "phone-box",
  CURRENCY: "currency",
  PRESET_DROPDOWN: "preset-dropdown",
  REVIEW_PARAMETER: "review-parameter",
  REVIEW_ASSESSMENT: "review-assessment",
  MULTI_SELECT_WEIGHTAGE: "multi-select-weightage",
  PRESET_DRPDOWN_DYNAMIC: "preset-dropdown-dynamic",
  IMAGE_TEXT_BOX: "image-text-box",
  NUMERIC: "numeric",
  CHOICES: "choices",
  EMAIL: "email",
  DATE_TIME: "date-time",
  CONSENT: "consent",
  PICTURE: "picture",
  PICTURE_MULTIPLE: "picture-multiple",
  CUSTOM_DROPDOWN: "custom-dropdown",
  CUSTOM_DROPDOWN_MULTIPLE: "custom-dropdown-multiple",
  SIGNATURE: "signature",
  ATTACHMENT: "attachment",
  MULTI_FILE_ATTACHMENT: "attachment_array",
  RATING: "rating",
  PRECONFIGURED_SURVEY_THEME: "preconfigured_survey_theme",
  SURVEY_PILLAR: "survey-pillar",
  SYSTEM_ATTRIBUTES: "system-attributes",
  SYSTEM_ATTRIBUTE_ARRAY: "sys-attr-array",
  RANK_ORDER: "rank-order",
  QUESTION_LOGIC: "question_logic",
  SCALE_MAPPING: "scale-mapping",
  MULTIPLE_CHOICE: "multiple-choice",
  PDFTRON_QUESTION: "pdftron-question",
  MESSAGE: "message",
  NPS_QUESTION: "nps-question",
  INTRODUCTION_PAGE: "introduction-page",
  EXTERNAL_RESPONDENT_FORM: "external-respondent-form",
  CUSTOM_THANKYOU_PAGE: "custom-thankyou-page",
  CUSTOM_SURVEY_EXPIRED_PAGE: "custom-survey-expired-page",
  EMPLOYEE_SEARCH: "employee-search",
  CHECKBOX: "checkbox",
  SINGLE_CHECKBOX: "single_checkbox",
  PEOPLE_SELECTOR: "people-selector",
  PRIMARY_ENGAGMENT_INDICATOR: "primary-engagment-indicator",
  DEPARTMENT_TREE_STRUCTURE: "department-tree-structure",
  WEIGHTAGE_SELECTION: "weightage-selection",
  TABLE: "table",
  ADD_FROM_QUESTION_BANK: "add-from-question-bank",
  SUMMARIZER: "summarizer",
  SMART_TAGS: "smart_tags",
  PMS_SCALE: "pms_scale",
  MASKED_FIELD: "masked_field",
} as const;

export type SupportedQuestionType =
  (typeof FORM_QUESTION_TYPES)[keyof typeof FORM_QUESTION_TYPES];

export interface OrderedQuestionResponse {
  questionId: string;
  type: SupportedQuestionType;
  answer: string;
}

export type OrderedQuestionResponses = OrderedQuestionResponse[];

export class FormPage extends BasePage {
  public readonly formReference: PlaywrightLocator;

  constructor(page: Page, private readonly formId: string) {
    super(page);

    this.formReference = this.page.locator(`[id="${formId}"], [form-id="${formId}"]`).first();
  }

  async waitForForm(timeout = 30_000): Promise<void> {
    await expect(this.formReference).toBeVisible({ timeout });
    const elementId = (await this.formReference.getAttribute("id")) ?? this.formId;

    await this.page.evaluate(
      ({ elementId, timeoutMs }) =>
        new Promise<void>((resolve, reject) => {
          const rootWindow = window as typeof window & {
            checkFormLoadedAndLoadCallback?: (
              formId: string,
              callback: () => void
            ) => void;
          };
          const formRef = document.getElementById(elementId) as
            | (HTMLElement & {
                formAlreadyLoaded?: () => boolean;
              })
            | null;

          if (!formRef) {
            reject(new Error(`Unable to locate form "${elementId}" in the DOM.`));
            return;
          }

          let settled = false;
          const settleSuccess = () => {
            if (settled) {
              return;
            }

            settled = true;
            clearTimeout(timer);
            resolve();
          };
          const settleFailure = () => {
            if (settled) {
              return;
            }

            settled = true;
            clearTimeout(timer);
            reject(new Error(`Timed out waiting for form "${elementId}" to finish loading.`));
          };
          const timer = window.setTimeout(settleFailure, timeoutMs);

          if (typeof formRef.formAlreadyLoaded === "function" && formRef.formAlreadyLoaded()) {
            settleSuccess();
            return;
          }

          if (typeof rootWindow.checkFormLoadedAndLoadCallback === "function") {
            rootWindow.checkFormLoadedAndLoadCallback(elementId, settleSuccess);
            return;
          }

          const handleLoaded = () => {
            formRef.removeEventListener("allFormDataLoaded", handleLoaded);
            settleSuccess();
          };

          formRef.addEventListener("allFormDataLoaded", handleLoaded);
        }),
      { elementId, timeoutMs: timeout }
    );
  }

  async fillTextBoxQuestion(questionId: string, response: string): Promise<void> {
    await this.waitForForm();
    const textInput = this.getTextBoxQuestionInput(questionId);
    await expect(textInput.getInput()).toBeVisible({ timeout: 10_000 });
    await textInput.fill(response);
  }

  async fillQuestionsInOrder(responses: OrderedQuestionResponses): Promise<void> {
    for (const response of responses) {
      switch (response.type) {
        case FORM_QUESTION_TYPES.TEXT_BOX:
          await this.fillTextBoxQuestion(response.questionId, String(response.answer ?? ""));
          break;
        default:
          throw new Error(`Unsupported question type "${String(response.type)}".`);
      }
    }
  }

  protected getTextBoxQuestionInput(questionId: string): TextInputUtils {
    return new TextInputUtils(this.page, this.getTextBoxQuestionTestId(questionId));
  }

  protected getTextBoxQuestionTestId(questionId: string): string {
    return `dbx-forms-input-textbox-${this.formId}-${questionId}`;
  }
}
