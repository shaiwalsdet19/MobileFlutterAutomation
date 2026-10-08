import { Page, Locator } from '@playwright/test';
import {
  ITimepickerDropdownUtils,
  TimePickerDropdownInput,
  TimePickerDropdownValue,
} from './base.interface.js';
import { SdsTimepickerDropdownUtils } from './sds.component.js';
import { SdsInternalDropdownUtils } from '../dropdown/sds-internal.component.js';

export class TimepickerDropdownUtils implements ITimepickerDropdownUtils {
  private impl: SdsTimepickerDropdownUtils;

  constructor(page: Page, testId: string) {
    this.impl = new SdsTimepickerDropdownUtils(page, testId);
  }

  getHost(): Locator {
    return this.impl.getHost();
  }

  getDropdown(): SdsInternalDropdownUtils {
    return this.impl.getDropdown();
  }

  async selectTime(input: TimePickerDropdownInput): Promise<this> {
    await this.impl.selectTime(input);
    return this;
  }

  async getValue(): Promise<TimePickerDropdownValue | Date | null | undefined> {
    return this.impl.getValue();
  }

  async isTwentyFourHourFormat(): Promise<boolean> {
    return this.impl.isTwentyFourHourFormat();
  }

  async isDisabled(): Promise<boolean> {
    return this.impl.isDisabled();
  }

  async isReadOnly(): Promise<boolean> {
    return this.impl.isReadOnly();
  }
}

export { SdsTimepickerDropdownUtils } from './sds.component.js';
export type {
  ITimepickerDropdownUtils,
  TimePickerDropdownInput,
  TimePickerDropdownValue,
} from './base.interface.js';
