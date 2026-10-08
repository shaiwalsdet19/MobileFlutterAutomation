import { Locator } from '@playwright/test';

export interface IAccordionUtils {
  getHost(): Locator;
  getHeaderWrapper(): Locator;
  isOpen(): Promise<boolean>;
  isAccordionEnabled(): Promise<boolean>;
  expand(): Promise<IAccordionUtils>;
  collapse(): Promise<IAccordionUtils>;
  toggle(): Promise<IAccordionUtils>;
}
