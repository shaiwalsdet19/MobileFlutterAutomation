import { Page, Locator } from '@playwright/test';
import { SdsInternalDropdownUtils } from '../dropdown/sds-internal.component.js';
import { ITimepickerUtils, TimePickerInput, TimePickerValue } from './base.interface.js';

type StepConfig = {
  hours?: number;
  minutes?: number;
  seconds?: number;
};

export class SdsTimepickerUtils implements ITimepickerUtils {
  constructor(private page: Page, private testId: string) {}

  getHost(): Locator {
    return this.page.getByTestId(this.testId);
  }

  getHourDropdown(): SdsInternalDropdownUtils {
    return new SdsInternalDropdownUtils(this.page, `${this.testId}-hour`);
  }

  getMinuteDropdown(): SdsInternalDropdownUtils {
    return new SdsInternalDropdownUtils(this.page, `${this.testId}-minute`);
  }

  getSecondDropdown(): SdsInternalDropdownUtils {
    return new SdsInternalDropdownUtils(this.page, `${this.testId}-second`);
  }

  getSuffixDropdown(): SdsInternalDropdownUtils {
    return new SdsInternalDropdownUtils(this.page, `${this.testId}-suffix`);
  }

  async selectTime(input: TimePickerInput): Promise<this> {
    const { hour, minutes, second } = this.normalizeTimeInput(input);
    const is24hr = await this.isTwentyFourHourFormat();
    const showSec = await this.showSeconds();
    const stepConfig = await this.getStepConfig();

    this.assertStepAligned(hour, stepConfig.hours ?? 1, 'hour');
    this.assertStepAligned(minutes, stepConfig.minutes ?? 1, 'minutes');
    if (showSec) {
      this.assertStepAligned(second, stepConfig.seconds ?? 1, 'second');
    }

    await this.getHourDropdown().selectOption(this.resolveHourLabel(hour, is24hr));
    await this.getMinuteDropdown().selectOption(minutes.toString().padStart(2, '0'));

    if (showSec) {
      await this.getSecondDropdown().selectOption(second.toString().padStart(2, '0'));
    }

    if (!is24hr) {
      await this.getSuffixDropdown().selectOption(this.resolveSuffix(hour));
    }

    return this;
  }

  async getValue(): Promise<TimePickerValue | Date | null | undefined> {
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

  async showSeconds(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.showSeconds !== false);
  }

  async isDisabled(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.disabled === true);
  }

  async isReadOnly(): Promise<boolean> {
    return await this.getHost().evaluate((el: any) => el.readOnly === true);
  }

  private async getStepConfig(): Promise<StepConfig> {
    return await this.getHost().evaluate((el: any) => el.stepConfig ?? { hours: 1, minutes: 1, seconds: 1 });
  }

  private normalizeTimeInput(input: TimePickerInput): Required<TimePickerValue> {
    if (input instanceof Date) {
      return {
        hour: input.getHours(),
        minutes: input.getMinutes(),
        second: input.getSeconds(),
      };
    }

    return {
      hour: input.hour ?? 0,
      minutes: input.minutes ?? 0,
      second: input.second ?? 0,
    };
  }

  private resolveHourLabel(hour24: number, is24hr: boolean): string {
    if (is24hr) {
      return hour24.toString().padStart(2, '0');
    }

    const display = hour24 === 0 || hour24 === 12 ? 12 : hour24 % 12;
    return display.toString().padStart(2, '0');
  }

  private resolveSuffix(hour24: number): 'AM' | 'PM' {
    return hour24 < 12 ? 'AM' : 'PM';
  }

  private assertStepAligned(value: number, step: number, field: string): void {
    if (value % step !== 0) {
      throw new Error(
        `Timepicker ${field} value ${value} is not aligned to step ${step}. Available options are generated at step intervals.`,
      );
    }
  }
}
