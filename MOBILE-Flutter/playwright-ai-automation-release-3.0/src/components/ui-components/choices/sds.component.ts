import { Page, Locator } from '@playwright/test';
import { SdsCheckboxGroupUtils } from '../checkboxGroup/sds.component.js';
import { SdsRadioGroupUtils } from '../radioGroup/sds.component.js';
import { ChoiceValue, IChoicesUtils } from './base.interface.js';

export class SdsChoicesUtils implements IChoicesUtils {
  private groupUtilsPromise?: Promise<SdsCheckboxGroupUtils | SdsRadioGroupUtils>;

  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getOtherToggleInput(): Locator {
    return this.page.getByTestId(`${this.testId}-other-toggle-input`);
  }

  getOtherTextInput(): Locator {
    return this.page.getByTestId(`${this.testId}-other-textfield-input`);
  }

  private async getGroupUtils(): Promise<SdsCheckboxGroupUtils | SdsRadioGroupUtils> {
    if (!this.groupUtilsPromise) {
      this.groupUtilsPromise = this.getHost().evaluate((el: any) => el.isMulti === true).then(isMulti =>
        isMulti
          ? new SdsCheckboxGroupUtils(this.page, `${this.testId}-checkboxGroup`)
          : new SdsRadioGroupUtils(this.page, `${this.testId}-radioGroup`),
      );
    }
    return this.groupUtilsPromise;
  }

  async getOptionInput(label: string): Promise<Locator> {
    const groupUtils = await this.getGroupUtils();
    return groupUtils.getOptionInput(label);
  }

  async selectChoicesByLabel(labels: string[]): Promise<this> {
    const groupUtils = await this.getGroupUtils();

    if (groupUtils instanceof SdsCheckboxGroupUtils) {
      await groupUtils.selectOptions(labels);
      return this;
    }

    for (const label of labels) {
      await groupUtils.selectOption(label);
    }
    return this;
  }

  async selectOtherChoice(): Promise<this> {
    const toggle = this.getOtherToggleInput();
    if (!(await toggle.isChecked())) {
      await toggle.click();
    }
    return this;
  }

  async fillOtherChoiceTextBox(text: string): Promise<this> {
    await this.selectOtherChoice();
    await this.getOtherTextInput().fill(text);
    return this;
  }

  async getValue(): Promise<ChoiceValue> {
    return await this.getHost().evaluate((el: any) => el.value ?? { otherSelected: false, selected: [], otherText: '' });
  }

  async isMulti(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.isMulti === true);
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }
}
