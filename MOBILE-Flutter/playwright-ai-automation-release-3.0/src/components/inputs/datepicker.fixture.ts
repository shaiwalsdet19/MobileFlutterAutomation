import { Page, Locator } from "@playwright/test";
import { BaseInputUtils } from "./types";

export class DatepickerUtils extends BaseInputUtils {
  async fill(date: string): Promise<this> {
    await this.getHost().click();
    await this.getHost().fill(date);
    await this.getHost().press("Escape");
    return this;
  }
}
