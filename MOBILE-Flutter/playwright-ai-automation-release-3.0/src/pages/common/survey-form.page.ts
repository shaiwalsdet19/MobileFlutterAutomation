import { expect, Page } from "@playwright/test";
import { FormPage, OrderedQuestionResponses } from "./form.page";

export const SURVEY_FORM_TEST_IDS = {
  START_BUTTON: "dbx-surveys-btn-participant-start",
  SUBMIT_BUTTON: "dbx-surveys-btn-participant-submit",
} as const;

export class SurveyFormPage extends FormPage {
  constructor(page: Page, formId: string) {
    super(page, formId);
  }

  async startIfPresent(timeout = 5_000): Promise<boolean> {
    const startButton = this.getByTestId(SURVEY_FORM_TEST_IDS.START_BUTTON);
    const isVisible = await startButton
      .waitFor({ state: "visible", timeout })
      .then(() => true)
      .catch(() => false);
    if (!isVisible) {
      return false;
    }

    await startButton.click();
    await expect(startButton).toBeHidden({ timeout: 30_000 });
    return true;
  }

  async fillSurveyResponses(responses: OrderedQuestionResponses): Promise<void> {
    const didStart = await this.startIfPresent();
    if (didStart && responses.length > 0 && responses[0].type === "text-box") {
      await expect(this.getTextBoxQuestionInput(responses[0].questionId).getInput()).toBeVisible({
        timeout: 30_000,
      });
    }

    await this.fillQuestionsInOrder(responses);
  }

  async submit(timeout = 30_000): Promise<void> {
    const submitButton = this.getByTestId(SURVEY_FORM_TEST_IDS.SUBMIT_BUTTON);
    await expect(submitButton).toBeVisible({ timeout });
    await submitButton.click();
  }

  async completeSurvey(responses: OrderedQuestionResponses): Promise<void> {
    await this.fillSurveyResponses(responses);
    await this.submit();
  }
}
