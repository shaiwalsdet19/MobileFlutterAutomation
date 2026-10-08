import { Page, Locator } from '@playwright/test';
import { ChoiceValue, IChoicesUtils } from './base.interface.js';
import { SdsChoicesUtils } from './sds.component.js';

export class ChoicesUtils implements IChoicesUtils {
  private impl: SdsChoicesUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsChoicesUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  getOptionInput(label: string): Promise<Locator> {
    return this.impl.getOptionInput(label);
  }

  getOtherToggleInput(): Locator {
    return this.impl.getOtherToggleInput();
  }

  getOtherTextInput(): Locator {
    return this.impl.getOtherTextInput();
  }

  async selectChoicesByLabel(labels: string[]): Promise<this> {
    await this.impl.selectChoicesByLabel(labels);
    return this;
  }

  async selectOtherChoice(): Promise<this> {
    await this.impl.selectOtherChoice();
    return this;
  }

  async fillOtherChoiceTextBox(text: string): Promise<this> {
    await this.impl.fillOtherChoiceTextBox(text);
    return this;
  }

  async getValue(): Promise<ChoiceValue> {
    return this.impl.getValue();
  }

  async isMulti(): Promise<boolean> {
    return this.impl.isMulti();
  }

  async isDisabled(): Promise<boolean> {
    return this.impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    return this.impl.isReadOnly();
  }
}

export { SdsChoicesUtils } from './sds.component.js';
export type { IChoicesUtils, ChoiceValue } from './base.interface.js';
