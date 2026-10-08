import { Locator } from '@playwright/test';

export type SignatureTabType = 'type' | 'draw' | 'upload';

export type SignatureValue = {
  key?: string;
  timestamp?: string;
  signatureMode?: SignatureTabType;
};

export interface ISignatureUtils {
  getHost(): Locator;

  switchTabType(tab: SignatureTabType): Promise<ISignatureUtils>;
  typeSignature(inputText: string): Promise<ISignatureUtils>;
  uploadSignature(filePath: string): Promise<ISignatureUtils>;
  getValue(): Promise<SignatureValue | undefined>;
  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
