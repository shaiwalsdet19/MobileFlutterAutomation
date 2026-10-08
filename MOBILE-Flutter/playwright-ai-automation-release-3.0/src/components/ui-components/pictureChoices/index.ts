import { Page, Locator } from '@playwright/test';
import {
  IPictureChoicesUtils,
  PictureChoiceValue,
} from './base.interface.js';
import { SdsPictureChoicesUtils } from './sds.component.js';

export class PictureChoicesUtils implements IPictureChoicesUtils {
  private impl: SdsPictureChoicesUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsPictureChoicesUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  async selectOptionByLabel(labels: string[]): Promise<this> {
    await this.impl.selectOptionByLabel(labels);
    return this;
  }

  async selectOptionByValue(values: string[]): Promise<this> {
    await this.impl.selectOptionByValue(values);
    return this;
  }

  async selectOtherOption(uploadImage: string, otherText?: string): Promise<this> {
    await this.impl.selectOtherOption(uploadImage, otherText);
    return this;
  }

  async getValue(): Promise<PictureChoiceValue> {
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

export { SdsPictureChoicesUtils } from './sds.component.js';
export type {
  IPictureChoicesUtils,
  PictureChoiceOption,
  PictureChoiceValue,
} from './base.interface.js';
