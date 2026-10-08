import { Locator } from '@playwright/test';

export type PictureChoiceValue = {
  otherSelected?: boolean;
  selected?: string | string[];
  otherValue?: { otherInputValue?: string; s3Key?: string };
};

export type PictureChoiceOption = {
  label: string;
  value: string;
  s3Key?: string;
};

export interface IPictureChoicesUtils {
  getHost(): Locator;

  selectOptionByLabel(labels: string[]): Promise<IPictureChoicesUtils>;
  selectOptionByValue(values: string[]): Promise<IPictureChoicesUtils>;
  selectOtherOption(uploadImage: string, otherText?: string): Promise<IPictureChoicesUtils>;
  getValue(): Promise<PictureChoiceValue>;
  isMulti(): Promise<boolean>;
  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
