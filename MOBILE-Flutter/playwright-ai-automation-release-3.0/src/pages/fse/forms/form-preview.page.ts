import { expect, Locator as PlaywrightLocator } from "@playwright/test";
import { BasePage } from "../../base.page";
import { FormPreviewApi } from "./api/form-preview.api";
import { Locator } from "../../common/locators/common";
import { FormPreviewLocators } from "./locators/form-preview";

/**
 * Page object for the Form Preview page.
 *
 * This page displays a form in preview mode with format styling controls.
 * The main form content is rendered inside a `<db-form>` component.
 *
 * COVERAGE NOTE: Most interactive elements on this page (language dropdown,
 * view mode toggles, format style sliders, Reset/Save buttons) lack data-testid
 * attributes. Only header-level elements are currently exposed through this POM.
 * Additional data-testid attributes need to be added to the source components
 * to enable full automation coverage.
 */
export class FormPreviewPage extends BasePage {
  // ── Navigation ──────────────────────────────────────────────────────────────

  /**
   * Navigates to the form preview page for a specific form.
   * @param baseUrl - Base application URL
   * @param formId - Form identifier
   * @param version - Form version (default: 1)
   */
  async navigate(baseUrl: string, formId: string, version = 1): Promise<void> {
    await this.goto(FormPreviewApi.getPreviewUrl(baseUrl, formId, version));
    await this.waitForPageReady();
  }

  // ── Readiness ───────────────────────────────────────────────────────────────

  /**
   * Waits for the page to be fully loaded and ready for interaction.
   * Checks for presence of the header section.
   */
  async waitForPageReady(): Promise<void> {
    await expect(this.resolve(FormPreviewLocators.header)).toBeVisible({ timeout: 30_000 });
  }

  // ── Header ──────────────────────────────────────────────────────────────────

  /**
   * Checks if the preview header is visible.
   */
  async isHeaderVisible(): Promise<boolean> {
    return this.resolve(FormPreviewLocators.header).isVisible();
  }

  /**
   * Gets the text content of the header section.
   * Expected to contain "Preview Mode" and the current language.
   */
  async getHeaderText(): Promise<string> {
    return this.text(FormPreviewLocators.header);
  }

  // ── Bluebar ─────────────────────────────────────────────────────────────────

  /**
   * Checks if the top navigation bluebar is visible.
   */
  async isBluebarVisible(): Promise<boolean> {
    return this.resolve(FormPreviewLocators.bluebar).isVisible();
  }

  // ── Preview Form ────────────────────────────────────────────────────────────

  /**
   * Returns the Playwright locator for the preview form container.
   * Use this to interact with the form inside preview mode.
   */
  getPreviewFormLocator(): PlaywrightLocator {
    return this.resolve(FormPreviewLocators.previewForm);
  }

  /**
   * Waits for the preview form to be visible.
   */
  async waitForPreviewForm(): Promise<void> {
    await expect(this.resolve(FormPreviewLocators.previewForm)).toBeVisible({ timeout: 30_000 });
  }

  // ── Assertions (UI-only) ────────────────────────────────────────────────────

  async assertPageVisible(): Promise<void> {
    await expect(this.resolve(FormPreviewLocators.header)).toBeVisible();
  }

  async assertHeaderVisible(): Promise<void> {
    await expect(this.resolve(FormPreviewLocators.header)).toBeVisible();
  }

  async assertBluebarVisible(): Promise<void> {
    await expect(this.resolve(FormPreviewLocators.bluebar)).toBeVisible();
  }

  /**
   * Asserts that the header contains "Preview Mode" text.
   */
  async assertPreviewModeDisplayed(): Promise<void> {
    const headerText = await this.getHeaderText();
    expect(headerText).toContain("Preview Mode");
  }

  // ── Private Helpers ─────────────────────────────────────────────────────────

  private resolve(locator: Locator): PlaywrightLocator {
    const selector = locator.testId.trim();
    if (selector.startsWith("dbx-") || selector.startsWith("form-") || selector.startsWith("preview-")) {
      return this.page.locator(`[data-testid=${JSON.stringify(selector)}]`);
    }
    return this.page.locator(selector);
  }

  private async text(locator: Locator): Promise<string> {
    return (await this.resolve(locator).innerText()).replace(/\s+/g, " ").trim();
  }
}
