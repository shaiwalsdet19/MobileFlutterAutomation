import { Page, Locator } from '@playwright/test';
import { ITimepickerUtils, TimePickerInput, TimePickerValue } from './base.interface.js';
import { SdsTimepickerUtils } from './sds.component.js';
import { SdsInternalDropdownUtils } from '../dropdown/sds-internal.component.js';

export class TimepickerUtils implements ITimepickerUtils {
  private impl: SdsTimepickerUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsTimepickerUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  getHourDropdown(): SdsInternalDropdownUtils {
    return this.impl.getHourDropdown();
  }

  getMinuteDropdown(): SdsInternalDropdownUtils {
    return this.impl.getMinuteDropdown();
  }

  getSecondDropdown(): SdsInternalDropdownUtils {
    return this.impl.getSecondDropdown();
  }

  getSuffixDropdown(): SdsInternalDropdownUtils {
    return this.impl.getSuffixDropdown();
  }

  async selectTime(input: TimePickerInput): Promise<this> {
    await this.impl.selectTime(input);
    return this;
  }

  async getValue(): Promise<TimePickerValue | Date | null | undefined> {
    return this.impl.getValue();
  }

  async isTwentyFourHourFormat(): Promise<boolean> {
    return this.impl.isTwentyFourHourFormat();
  }

  async showSeconds(): Promise<boolean> {
    return this.impl.showSeconds();
  }

  async isDisabled(): Promise<boolean> {
    return this.impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    return this.impl.isReadOnly();
  }
}

export { SdsTimepickerUtils } from './sds.component.js';
export type { ITimepickerUtils, TimePickerInput, TimePickerValue } from './base.interface.js';
