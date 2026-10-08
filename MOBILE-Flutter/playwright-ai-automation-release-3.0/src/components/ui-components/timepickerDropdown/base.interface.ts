import { Locator } from '@playwright/test';
import { SdsInternalDropdownUtils } from '../dropdown/sds-internal.component.js';

export type TimePickerDropdownValue = {
  hour?: number;
  minutes?: number;
};

export type TimePickerDropdownInput = Date | TimePickerDropdownValue;

export interface ITimepickerDropdownUtils {
  getHost(): Locator;
  getDropdown(): SdsInternalDropdownUtils;

  selectTime(input: TimePickerDropdownInput): Promise<ITimepickerDropdownUtils>;
  getValue(): Promise<TimePickerDropdownValue | Date | null | undefined>;
  isTwentyFourHourFormat(): Promise<boolean>;
  isDisabled(): Promise<boolean>;
  isReadOnly(): Promise<boolean>;
}
