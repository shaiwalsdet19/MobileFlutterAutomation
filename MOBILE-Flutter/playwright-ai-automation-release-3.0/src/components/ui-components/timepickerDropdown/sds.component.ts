import { Page, Locator } from '@playwright/test';
import { SdsInternalDropdownUtils } from '../dropdown/sds-internal.component.js';
import {
  ITimepickerDropdownUtils,
  TimePickerDropdownInput,
  TimePickerDropdownValue,
} from './base.interface.js';

type TimeRangeConfig = {
  interval: number;
  startTime: TimePickerDropdownValue;
  endTime: TimePickerDropdownValue;
};

export class SdsTimepickerDropdownUtils implements ITimepickerDropdownUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getDropdown(): SdsInternalDropdownUtils {
    return new SdsInternalDropdownUtils(this.page, `${this.testId}-dropdown`);
  }

  async selectTime(input: TimePickerDropdownInput): Promise<this> {
    const { hour, minutes } = this.normalizeTimeInput(input);
    const is24hr = await this.isTwentyFourHourFormat();
    const rangeConfig = await this.getRangeConfig();

    this.assertIntervalAligned(hour, minutes, rangeConfig);
    await this.getDropdown().selectOption(this.resolveOptionLabel(hour, minutes, is24hr));

    return this;
  }

  async getValue(): Promise<TimePickerDropdownValue | Date | null | undefined> {
    return await this.getHost().evaluate(async (el: any) => {
      if (typeof el.getValue === 'function') {
        return el.getValue();
      }
      return el.value;
    });
  }

  async isTwentyFourHourFormat(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.isTwentyFourHourFormat === true);
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }

  private async getRangeConfig(): Promise<TimeRangeConfig> {
    return await this.getHost().evaluate((el: any) => ({
      interval: el.interval ?? 30,
      startTime: el.startTime ?? { hour: 0, minutes: 0 },
      endTime: el.endTime ?? { hour: 24, minutes: 0 },
    }));
  }

  private normalizeTimeInput(input: TimePickerDropdownInput): Required<TimePickerDropdownValue> {
    if (input instanceof Date) {
      return {
        hour: input.getHours(),
        minutes: input.getMinutes(),
      };
    }

    return {
      hour: input.hour ?? 0,
      minutes: input.minutes ?? 0,
    };
  }

  private resolveOptionLabel(hour: number, minutes: number, is24hr: boolean): string {
    const formatted24h = `${String(hour).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;

    if (is24hr) {
      return formatted24h;
    }

    let displayHour = hour;
    const minutePart = String(minutes).padStart(2, '0');
    const suffix = hour >= 12 ? 'PM' : 'AM';

    displayHour = hour % 12;
    if (displayHour === 0) {
      displayHour = 12;
    }

    return `${displayHour}:${minutePart} ${suffix}`;
  }

  private assertIntervalAligned(hour: number, minutes: number, config: TimeRangeConfig): void {
    const totalMinutes = hour * 60 + minutes;
    const startMinutes = (config.startTime.hour ?? 0) * 60 + (config.startTime.minutes ?? 0);
    const endMinutes = (config.endTime.hour ?? 24) * 60 + (config.endTime.minutes ?? 0);

    if (totalMinutes < startMinutes || totalMinutes >= endMinutes) {
      throw new Error(
        `Timepicker dropdown value ${hour}:${minutes} is outside the allowed range (${config.startTime.hour}:${config.startTime.minutes} – ${config.endTime.hour}:${config.endTime.minutes}).`,
      );
    }

    if ((totalMinutes - startMinutes) % config.interval !== 0) {
      throw new Error(
        `Timepicker dropdown value ${hour}:${minutes} is not aligned to interval ${config.interval}. Available options are generated at interval steps.`,
      );
    }
  }
}
