import { Page, Locator } from "@playwright/test";
import { BaseInputUtils } from "./types";

export class ButtonUtils extends BaseInputUtils {
  async click(): Promise<this> {
    await this.getHost().click();
    return this;
  }

  async isEnabled(): Promise<boolean> {
    return this.getHost().isEnabled();
  }

  async isVisible(): Promise<boolean> {
    return this.getHost().isVisible();
  }
}
