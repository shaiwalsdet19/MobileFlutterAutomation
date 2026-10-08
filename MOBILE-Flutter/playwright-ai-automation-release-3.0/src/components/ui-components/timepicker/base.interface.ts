import { Locator } from '@playwright/test';
import { SdsInternalDropdownUtils } from '../dropdown/sds-internal.component.js';

export type TimePickerValue = {
  hour?: number;
  minutes?: number;
  second?: number;
};

export type TimePickerInput = Date | TimePickerValue;

export interface ITimepickerUtils {
  getHost(): Locator;
  getHourDropdown(): SdsInternalDropdownUtils;
  getMinuteDropdown(): SdsInternalDropdownUtils;
  getSecondDropdown(): SdsInternalDropdownUtils;
  getSuffixDropdown(): SdsInternalDropdownUtils;

  selectTime(input: TimePickerInput): Promise<ITimepickerUtils>;
  getValue(): Promise<TimePickerValue | Date | null | undefined>;
  isTwentyFourHourFormat(): Promise<boolean>;
  showSeconds(): Promise<boolean>;
  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
