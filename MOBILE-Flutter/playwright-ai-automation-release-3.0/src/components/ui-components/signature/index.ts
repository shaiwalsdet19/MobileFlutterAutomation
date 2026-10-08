import { Page, Locator } from '@playwright/test';
import { ISignatureUtils, SignatureTabType, SignatureValue } from './base.interface.js';
import { SdsSignatureUtils } from './sds.component.js';

export class SignatureUtils implements ISignatureUtils {
  private impl: SdsSignatureUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsSignatureUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  async switchTabType(tab: SignatureTabType): Promise<this> {
    await this.impl.switchTabType(tab);
    return this;
  }

  async typeSignature(inputText: string): Promise<this> {
    await this.impl.typeSignature(inputText);
    return this;
  }

  async uploadSignature(filePath: string): Promise<this> {
    await this.impl.uploadSignature(filePath);
    return this;
  }

  async getValue(): Promise<SignatureValue | undefined> {
    return this.impl.getValue();
  }

  async isDisabled(): Promise<boolean> {
    return this.impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    return this.impl.isReadOnly();
  }
}

export { SdsSignatureUtils } from './sds.component.js';
export type { ISignatureUtils, SignatureTabType, SignatureValue } from './base.interface.js';
