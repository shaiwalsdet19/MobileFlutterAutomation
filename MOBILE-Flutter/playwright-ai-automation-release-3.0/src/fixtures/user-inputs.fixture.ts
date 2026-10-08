import { test as base, Page } from "@playwright/test";
import { DropdownUtils } from "../components/inputs/dropdown.fixture";
import { InputUtils } from "../components/inputs/input.fixture";
import { CheckboxUtils } from "../components/inputs/checkbox.fixture";
import { DatepickerUtils } from "../components/inputs/datepicker.fixture";
import { ButtonUtils } from "../components/inputs/button.fixture";

export interface InputsPage extends Page {
  dropdown(testId: string): DropdownUtils;
  input(testId: string): InputUtils;
  checkbox(testId: string): CheckboxUtils;
  datepicker(testId: string): DatepickerUtils;
  button(testId: string): ButtonUtils;
}

function extendPage(page: Page): InputsPage {
  const extendedPage = page as InputsPage;

  extendedPage.dropdown = (testId: string) => new DropdownUtils(page, testId);
  extendedPage.input = (testId: string) => new InputUtils(page, testId);
  extendedPage.checkbox = (testId: string) => new CheckboxUtils(page, testId);
  extendedPage.datepicker = (testId: string) => new DatepickerUtils(page, testId);
  extendedPage.button = (testId: string) => new ButtonUtils(page, testId);

  return extendedPage;
}

export const test = base.extend<{ page: InputsPage }>({
  page: async ({ page }, use) => {
    const extendedPage = extendPage(page);
    await use(extendedPage);
  },
});

export { expect } from "@playwright/test";
export { DropdownUtils, InputUtils, CheckboxUtils, DatepickerUtils, ButtonUtils };
