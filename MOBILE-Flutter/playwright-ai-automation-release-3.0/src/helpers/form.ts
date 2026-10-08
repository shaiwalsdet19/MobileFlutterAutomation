import { Page } from "@playwright/test";
import { FormPage, OrderedQuestionResponses } from "../pages/common/form.page";

export interface FillFormResponsesInput {
  formId: string;
  responses: OrderedQuestionResponses;
}

/**
 * Waits for a rendered form instance and fills the provided responses in order.
 * Returns the initialized `FormPage` so callers can continue with follow-up actions
 * like submit, save-as-draft, or additional assertions on the same form.
 */
export async function fillFormResponses(
  page: Page,
  input: FillFormResponsesInput
): Promise<FormPage> {
  const formPage = new FormPage(page, input.formId);
  await formPage.waitForForm();
  await formPage.fillQuestionsInOrder(input.responses);
  return formPage;
}
