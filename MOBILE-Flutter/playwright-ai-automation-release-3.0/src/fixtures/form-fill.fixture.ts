import { test as sdsTest } from './ui-components.fixture';
import { Locator } from '../pages/common/locators/common';
import {
  FormFieldInput,
  NestedQuestionInput,
  QuestionConfig,
  QuestionMap,
  resolveLocator,
  getFormConfig,
  fillQuestion,
} from '../components/form/form-filler';

export { FormFieldInput, NestedQuestionInput, QuestionConfig, QuestionMap };

export interface FormFillFixture {
  fillForm: (locator: Locator, data: FormFieldInput[]) => Promise<void>;
  validateForm: (locator: Locator, data: FormFieldInput[]) => Promise<boolean>;
}

export const test = sdsTest.extend<FormFillFixture>({
  fillForm: async ({ page }, use) => {
    const fillForm = async (locator: Locator, data: FormFieldInput[]): Promise<void> => {
      const formLocator = resolveLocator(page, locator);
      const formId = await formLocator.getAttribute('form-id');

      if (!formId) {
        throw new Error('Form element does not have a form-id attribute');
      }

      const questionMap = await getFormConfig(page, formId);

      for (const field of data) {
        const questionConfig = questionMap[field.questionId];

        if (!questionConfig) {
          continue;
        }
        await fillQuestion(page, formId, questionConfig.questionId, questionConfig.questionType, {
          answer: field.answer,
          comment: field.comment,
          nestedQuestions: field.nestedQuestions,
        });
      }
    };

    await use(fillForm);
  },

  validateForm: async ({ page }, use) => {
    const validateForm = async (locator: Locator, data: FormFieldInput[]): Promise<boolean> => {
      const formLocator = resolveLocator(page, locator);
      // TODO: Add business logic here
      return true;
    };

    await use(validateForm);
  },
});

export { expect } from './ui-components.fixture';
