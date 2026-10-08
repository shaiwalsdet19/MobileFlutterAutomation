import { Locator } from '@playwright/test';

export interface ChoiceValue {
  otherSelected: boolean;
  selected: Array<string> | string;
  otherText: string;
}

export interface IChoicesUtils {
  getHost(): Locator;
  getOptionInput(label: string): Promise<Locator>;
  getOtherToggleInput(): Locator;
  getOtherTextInput(): Locator;

  selectChoicesByLabel(labels: string[]): Promise<IChoicesUtils>;
  selectOtherChoice(): Promise<IChoicesUtils>;
  fillOtherChoiceTextBox(text: string): Promise<IChoicesUtils>;

  getValue(): Promise<ChoiceValue>;
  isMulti(): Promise<boolean>;
  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
