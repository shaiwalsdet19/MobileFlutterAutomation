import { expect, Locator as PlaywrightLocator } from "@playwright/test";
import { BasePage } from "../../base.page";
import { Locator } from "../../common/locators/common";
import { SurveyManagerFormSelectionApi } from "./api/survey-manager-form-selection.api";
import { SurveyManagerFormSelectionLocators } from "./locators/survey-manager-form-selection";

export class SurveyManagerFormSelectionPage extends BasePage {
  // ── Navigation ────────────────────────────────────────────────────────────

  /**
   * Navigates to the Form Selection page for the given survey and waits for
   * the page to be fully interactive.
   */
  async navigate(baseUrl: string, surveyId: string): Promise<void> {
    await this.goto(SurveyManagerFormSelectionApi.getPageUrl(baseUrl, surveyId));
    await this.waitForPageReady();
  }

  // ── Readiness ─────────────────────────────────────────────────────────────

  /**
   * Waits until the page container and the two create-option cards are visible.
   * Call after navigation or after any action that reloads the page.
   */
  async waitForPageReady(): Promise<void> {
    await expect(this.resolve(SurveyManagerFormSelectionLocators.page)).toBeVisible({
      timeout: 30_000,
    });
    await expect(this.resolve(SurveyManagerFormSelectionLocators.createFromScratchCard)).toBeVisible({
      timeout: 15_000,
    });
  }

  // ── Header ────────────────────────────────────────────────────────────────

  /**
   * Returns the survey name as displayed in the page header.
   */
  async getHeaderSurveyName(): Promise<string> {
    return this.text(SurveyManagerFormSelectionLocators.headerSurveyName);
  }

  /**
   * Clicks the back button in the survey header, returning to the previous page.
   */
  async clickBack(): Promise<void> {
    await this.click(this.resolve(SurveyManagerFormSelectionLocators.headerBackButton));
  }

  // ── Create options ────────────────────────────────────────────────────────

  /**
   * Clicks the "Start From Scratch" card and waits for the browser to navigate
   * to the form builder URL (`/builder/{formId}`).
   *
   * The API fires `POST /formsapi/formCreateUpdate` which returns the new
   * `form_id`. Navigation to `/builder/{formId}` confirms success.
   */
  async clickStartFromScratch(): Promise<void> {
    await this.click(this.resolve(SurveyManagerFormSelectionLocators.createFromScratchCard));
    await this.page.waitForURL(/\/builder\//, { timeout: 30_000 });
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  /**
   * Returns true when the AI survey card is visible and carries the
   * "Coming Soon" badge (indicating it is disabled).
   */
  async isAiSurveyComingSoon(): Promise<boolean> {
    return this.resolve(SurveyManagerFormSelectionLocators.createWithAiComingSoonBadge)
      .isVisible()
      .catch(() => false);
  }

  // ── Recommended Templates section ─────────────────────────────────────────

  /**
   * Returns the number of template cards currently rendered in the
   * Recommended Templates grid.
   */
  async getTemplateCardCount(): Promise<number> {
    return this.resolve(SurveyManagerFormSelectionLocators.templateCards).count();
  }

  /**
   * Returns the display titles of all visible template cards.
   * Uses `evaluate(el => el.textContent)` to bypass Shadow DOM text rendering.
   */
  async getTemplateCardTitles(): Promise<string[]> {
    const cards = this.resolve(SurveyManagerFormSelectionLocators.templateCardTitles);
    const count = await cards.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const raw = await cards.nth(i).evaluate((el) => el.textContent ?? "");
      titles.push(raw.replace(/\s+/g, " ").trim());
    }
    return titles;
  }

  /**
   * Clicks the template card at the given zero-based index in the Recommended
   * Templates grid.
   */
  async clickTemplateCardAt(index: number): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerFormSelectionLocators.templateCards).nth(index)
    );
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  /**
   * Clicks the first template card whose title matches the given string.
   * The match is case-insensitive and trims whitespace.
   */
  async clickTemplateCardByTitle(title: string): Promise<void> {
    const cards = this.resolve(SurveyManagerFormSelectionLocators.templateCards);
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const raw = await cards.nth(i).evaluate((el) => el.textContent ?? "");
      if (raw.toLowerCase().includes(title.toLowerCase())) {
        await this.click(cards.nth(i));
        await this.page.waitForLoadState("networkidle").catch(() => {});
        return;
      }
    }
    throw new Error(`Template card with title matching "${title}" not found.`);
  }

  /**
   * Clicks the "View All" button in the Recommended Templates section header.
   */
  async clickTemplatesViewAll(): Promise<void> {
    await this.click(this.resolve(SurveyManagerFormSelectionLocators.templatesViewAllButton));
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  // ── Existing Forms section ─────────────────────────────────────────────────

  /**
   * Returns the number of existing-form cards currently rendered.
   */
  async getFormCardCount(): Promise<number> {
    return this.resolve(SurveyManagerFormSelectionLocators.formCards).count();
  }

  /**
   * Returns the display titles of all visible existing-form cards.
   * Uses `evaluate(el => el.textContent)` to bypass Shadow DOM text rendering.
   */
  async getFormCardTitles(): Promise<string[]> {
    const cards = this.resolve(SurveyManagerFormSelectionLocators.formCardTitles);
    const count = await cards.count();
    const titles: string[] = [];
    for (let i = 0; i < count; i++) {
      const raw = await cards.nth(i).evaluate((el) => el.textContent ?? "");
      titles.push(raw.replace(/\s+/g, " ").trim());
    }
    return titles;
  }

  /**
   * Clicks the existing-form card at the given zero-based index.
   */
  async clickFormCardAt(index: number): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerFormSelectionLocators.formCards).nth(index)
    );
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  /**
   * Clicks the first existing-form card whose title matches the given string.
   */
  async clickFormCardByTitle(title: string): Promise<void> {
    const cards = this.resolve(SurveyManagerFormSelectionLocators.formCards);
    const count = await cards.count();
    for (let i = 0; i < count; i++) {
      const raw = await cards.nth(i).evaluate((el) => el.textContent ?? "");
      if (raw.toLowerCase().includes(title.toLowerCase())) {
        await this.click(cards.nth(i));
        await this.page.waitForLoadState("networkidle").catch(() => {});
        return;
      }
    }
    throw new Error(`Existing form card with title matching "${title}" not found.`);
  }

  /**
   * Clicks the "View All" button in the Existing Forms section header.
   */
  async clickFormsViewAll(): Promise<void> {
    await this.click(this.resolve(SurveyManagerFormSelectionLocators.formsViewAllButton));
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  // ── Activate / deactivate dialog ──────────────────────────────────────────

  /**
   * Returns the text body of the activate/deactivate confirmation dialog.
   */
  async getActivateDialogMessage(): Promise<string> {
    return this.text(SurveyManagerFormSelectionLocators.activateDialogMessage);
  }

  /**
   * Confirms the activate/deactivate action by clicking the Confirm button.
   */
  async confirmActivateDialog(): Promise<void> {
    await this.click(this.resolve(SurveyManagerFormSelectionLocators.activateDialogConfirmButton));
  }

  /**
   * Cancels the activate/deactivate dialog.
   */
  async cancelActivateDialog(): Promise<void> {
    await this.click(this.resolve(SurveyManagerFormSelectionLocators.activateDialogCancelButton));
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /** Asserts that the main page container is visible. */
  async assertPageVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerFormSelectionLocators.page)).toBeVisible();
  }

  /** Asserts that the header section is visible with the correct survey name. */
  async assertHeaderVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerFormSelectionLocators.header)).toBeVisible();
    await expect(this.resolve(SurveyManagerFormSelectionLocators.headerBackButton)).toBeVisible();
    await expect(this.resolve(SurveyManagerFormSelectionLocators.headerSurveyName)).toBeVisible();
  }

  /** Asserts that both create-option cards are visible. */
  async assertCreateOptionsVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerFormSelectionLocators.createFromScratchCard)).toBeVisible();
    await expect(this.resolve(SurveyManagerFormSelectionLocators.createWithAiCard)).toBeVisible();
  }

  /** Asserts that the Recommended Templates section heading and cards are present. */
  async assertTemplatesSectionVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerFormSelectionLocators.templatesSectionHeading)).toBeVisible();
    await expect(this.resolve(SurveyManagerFormSelectionLocators.templatesViewAllButton)).toBeVisible();
    const count = await this.getTemplateCardCount();
    expect(count).toBeGreaterThan(0);
  }

  /** Asserts that the Existing Forms section heading and cards are present. */
  async assertFormsSectionVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerFormSelectionLocators.formsSectionHeading)).toBeVisible();
    await expect(this.resolve(SurveyManagerFormSelectionLocators.formsViewAllButton)).toBeVisible();
    const count = await this.getFormCardCount();
    expect(count).toBeGreaterThan(0);
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  /**
   * Resolves a `Locator` definition to a Playwright `Locator`.
   *
   * Rules:
   * - If `testId` starts with "dbx-" it is a bare component/element name and is
   *   wrapped in `[data-testid="…"]`.
   * - Otherwise the `testId` is treated as a raw CSS selector and passed directly
   *   to `page.locator()`.
   */
  private resolve(locator: Locator): PlaywrightLocator {
    const selector = locator.testId.trim();
    if (selector.startsWith("dbx-")) {
      return this.page.locator(`[data-testid=${JSON.stringify(selector)}]`);
    }
    return this.page.locator(selector);
  }

  private async text(locator: Locator): Promise<string> {
    return (await this.resolve(locator).innerText()).replace(/\s+/g, " ").trim();
  }
}
