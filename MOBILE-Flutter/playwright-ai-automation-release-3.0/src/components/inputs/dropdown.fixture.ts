import { Page, Locator } from "@playwright/test";
import { BaseInputUtils } from "./types";

export class DropdownUtils extends BaseInputUtils {
  async getSelectedOptions(): Promise<string[]> {
    return this.getHost().evaluate((element) => {
      if (!(element instanceof HTMLSelectElement)) {
        return [];
      }
      return Array.from(element.selectedOptions)
        .map((option) => option.textContent?.replace(/\s+/g, " ").trim() ?? "")
        .filter(Boolean);
    });
  }

  async search(fillText: string): Promise<this> {
    const searchInput = this.getHost().locator(":scope + div input");
    await searchInput.fill("");
    await searchInput.pressSequentially(" ", { delay: 30 });
    await searchInput.focus({ timeout: 200 });
    await searchInput.pressSequentially(" " + fillText, { delay: 50 });
    return this;
  }

  async countAvailableOptions(filterText: string): Promise<number> {
    const resultsValue = this.getHost().locator(":scope + div .chosen-drop");
    await this.page.waitForTimeout(100);
    return resultsValue
      .locator(".chosen-results li:not(.result-selected)")
      .filter({ hasText: filterText })
      .count();
  }

  async selectOption(option: string): Promise<this> {
    const select = this.getHost();
    const chosenContainer = select.locator("+ .chosen-container");

    if ((await chosenContainer.count()) > 0) {
      await chosenContainer.click();
      await chosenContainer.locator(".chosen-results li").filter({ hasText: option }).first().click();
    } else {
      await select.selectOption({ label: option }, { force: true });
      await select.dispatchEvent("change");
    }
    return this;
  }

  async selectOptions(options: string[]): Promise<this> {
    const select = this.getHost();
    const chosenContainer = select.locator("+ .chosen-container");

    if ((await chosenContainer.count()) > 0) {
      for (const option of options) {
        await chosenContainer.click();
        await chosenContainer.locator(".chosen-results li").filter({ hasText: option }).first().click();
      }
    } else {
      await select.selectOption(options.map((label) => ({ label })), { force: true });
      await select.dispatchEvent("change");
    }
    return this;
  }

  async clearOption(option: string): Promise<this> {
    await this.getHost().evaluate(
      (element, optionLabel) => {
        if (!(element instanceof HTMLSelectElement)) {
          return;
        }

        const normalize = (value: string | null): string =>
          value?.replace(/\s+/g, " ").trim() ?? "";

        for (const currentOption of Array.from(element.options)) {
          if (normalize(currentOption.textContent) === normalize(optionLabel)) {
            currentOption.selected = false;
          }
        }

        element.dispatchEvent(new Event("change", { bubbles: true }));

        const maybeWindow = window as Window & {
          jQuery?: (node: Element) => { trigger: (eventName: string) => void };
        };

        if (typeof maybeWindow.jQuery === "function") {
          maybeWindow.jQuery(element).trigger("chosen:updated");
        }
      },
      option
    );
    return this;
  }

  async clearOptionById(optionId: string): Promise<this> {
    await this.getHost().evaluate(
      (element, targetOptionId) => {
        if (!(element instanceof HTMLSelectElement)) {
          return;
        }

        for (const currentOption of Array.from(element.options)) {
          if (currentOption.value === targetOptionId) {
            currentOption.selected = false;
          }
        }

        element.dispatchEvent(new Event("change", { bubbles: true }));

        const maybeWindow = window as Window & {
          jQuery?: (node: Element) => { trigger: (eventName: string) => void };
        };

        if (typeof maybeWindow.jQuery === "function") {
          maybeWindow.jQuery(element).trigger("chosen:updated");
        }
      },
      optionId
    );
    return this;
  }

  async clearAll(): Promise<this> {
    await this.getHost().evaluate((element) => {
      if (!(element instanceof HTMLSelectElement)) {
        return;
      }

      for (const currentOption of Array.from(element.options)) {
        currentOption.selected = false;
      }

      element.dispatchEvent(new Event("change", { bubbles: true }));

      const maybeWindow = window as Window & {
        jQuery?: (node: Element) => { trigger: (eventName: string) => void };
      };

      if (typeof maybeWindow.jQuery === "function") {
        maybeWindow.jQuery(element).trigger("chosen:updated");
      }
    });
    return this;
  }
}
