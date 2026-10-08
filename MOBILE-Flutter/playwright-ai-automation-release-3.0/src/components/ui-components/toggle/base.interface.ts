import { Locator } from '@playwright/test';

export interface IToggleUtils {
  getHost(): Locator;
  getToggleButton(): Locator;
  getValue(): Promise<boolean>;
  isOn(): Promise<boolean>;
  turnOn(): Promise<IToggleUtils>;
  turnOff(): Promise<IToggleUtils>;
  toggle(): Promise<IToggleUtils>;
  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
