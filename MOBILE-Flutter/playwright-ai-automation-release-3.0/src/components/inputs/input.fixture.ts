import { Page, Locator } from "@playwright/test";
import { BaseInputUtils } from "./types";

export class InputUtils extends BaseInputUtils {
  async fill(value: string): Promise<this> {
    await this.getHost().fill(value);
    return this;
  }

  async clear(): Promise<this> {
    await this.getHost().clear();
    return this;
  }

  async getValue(): Promise<string> {
    return this.getHost().inputValue();
  }
}
