import { Page, Locator } from "@playwright/test";
import { BaseInputUtils } from "./types";

export class CheckboxUtils extends BaseInputUtils {
  async check(): Promise<this> {
    await this.getHost().check({ force: true });
    return this;
  }

  async uncheck(): Promise<this> {
    await this.getHost().uncheck({ force: true });
    return this;
  }

  async isChecked(): Promise<boolean> {
    return this.getHost().isChecked();
  }

  async toggle(checked: boolean): Promise<this> {
    await this.getHost().setChecked(checked, { force: true });
    return this;
  }
}
