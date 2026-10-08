import { expect, Locator as PlaywrightLocator } from "@playwright/test";
import { BasePage } from "../../base.page";
import { Locator } from "../../common/locators/common";
import { SurveyManagerSummaryApi } from "./api/survey-manager-summary.api";
import {
  SurveyDetailField,
  SurveyDetailFieldLabels,
  SurveyManagerSummaryLocators,
} from "./locators/survey-manager-summary";

export class SurveyManagerSummaryPage extends BasePage {
  // ── Navigation ─────────────────────────────────────────────────────────────

  /**
   * Navigates to the Summary page for the given survey and waits until
   * the page is fully loaded.
   */
  async navigate(baseUrl: string, surveyId: string): Promise<void> {
    await this.goto(SurveyManagerSummaryApi.getPageUrl(baseUrl, surveyId));
    await this.waitForPageReady();
  }

  // ── Readiness ──────────────────────────────────────────────────────────────

  /**
   * Waits until the Summary page container and the Survey Details card are
   * both visible, signalling that the page data has finished loading.
   */
  async waitForPageReady(): Promise<void> {
    await expect(this.resolve(SurveyManagerSummaryLocators.page)).toBeVisible({
      timeout: 30_000,
    });
    await expect(
      this.resolve(SurveyManagerSummaryLocators.detailsSection)
    ).toBeVisible({ timeout: 15_000 });
  }

  // ── Header ─────────────────────────────────────────────────────────────────

  /** Returns the survey name shown in the shared header. */
  async getHeaderSurveyName(): Promise<string> {
    return this.text(SurveyManagerSummaryLocators.headerSurveyName);
  }

  /** Clicks the Back arrow button in the shared header. */
  async clickBack(): Promise<void> {
    await this.click(this.resolve(SurveyManagerSummaryLocators.headerBackButton));
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  /** Clicks the Previous button to return to the Channels wizard step. */
  async clickPrevious(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerSummaryLocators.headerPreviousButton)
    );
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  /**
   * Returns the text label of the primary activate button
   * ("Activate" when survey is draft, "Deactivate" when active).
   */
  async getActivateButtonLabel(): Promise<string> {
    return (
      await this.resolve(
        SurveyManagerSummaryLocators.headerActivateNativeButton
      ).innerText()
    )
      .replace(/\s+/g, " ")
      .trim();
  }

  /**
   * Clicks the primary Activate / Deactivate button to open the confirmation
   * dialog.
   */
  async clickActivate(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerSummaryLocators.headerActivateButton)
    );
    await this.page.waitForTimeout(400);
  }

  /**
   * Clicks the split-button caret to open the Activate/Deactivate dropdown
   * menu.
   */
  async openActivateSplitMenu(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerSummaryLocators.headerActivateSplitCaret)
    );
    await this.page.waitForTimeout(300);
  }

  /**
   * Clicks the More Options (⋮) overflow button to open its menu.
   */
  async openMoreOptions(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerSummaryLocators.headerMoreOptionsButton)
    );
    await this.page.waitForTimeout(300);
  }

  // ── Activate / deactivate confirmation dialog ──────────────────────────────

  /**
   * Returns the body message text of the activate/deactivate confirmation dialog.
   */
  async getActivateDialogMessage(): Promise<string> {
    return this.text(SurveyManagerSummaryLocators.activateDialogMessage);
  }

  /**
   * Confirms the activate/deactivate action inside the confirmation dialog.
   * Waits for the network to settle after submission.
   */
  async confirmActivateDialog(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerSummaryLocators.activateDialogConfirmButton)
    );
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  /**
   * Cancels the activate/deactivate confirmation dialog.
   */
  async cancelActivateDialog(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerSummaryLocators.activateDialogCancelButton)
    );
    await this.page.waitForTimeout(300);
  }

  // ── Survey Details card ────────────────────────────────────────────────────

  /**
   * Reads the value of a named field in the Survey Details grid.
   *
   * Iterates through all field cells, matches by label text, then reads the
   * value text from the `span#dbx-overflow-span` inside the `dbx-text-overflow`
   * web component (or falls back to the plain `.tw-text-sm` value div).
   *
   * @param field  Key from `SurveyDetailField` (e.g. `"surveyTitle"`)
   * @returns The trimmed value string, or `""` if not found.
   *
   * @example
   * const title = await summaryPage.getSurveyDetailValue("surveyTitle");
   */
  async getSurveyDetailValue(field: SurveyDetailField): Promise<string> {
    const targetLabel = SurveyDetailFieldLabels[field];
    const cells = this.resolve(SurveyManagerSummaryLocators.detailFieldCells);
    const count = await cells.count();

    for (let i = 0; i < count; i++) {
      const cell = cells.nth(i);
      const labelText = await cell
        .locator(".tw-text-xs")
        .first()
        .evaluate((el) => el.textContent ?? "")
        .catch(() => "");

      if (labelText.trim() === targetLabel) {
        const valueSpan = cell.locator("#dbx-overflow-span").first();
        const spanCount = await valueSpan.count();
        if (spanCount > 0) {
          const raw = await valueSpan.evaluate((el) => el.textContent ?? "");
          return raw.replace(/\s+/g, " ").trim();
        }
        const valueTxt = await cell
          .locator(".tw-text-sm")
          .first()
          .evaluate((el) => el.textContent ?? "")
          .catch(() => "");
        return valueTxt.replace(/\s+/g, " ").trim();
      }
    }
    return "";
  }

  /**
   * Returns all label/value pairs from the Survey Details grid as a map.
   *
   * @example
   * const details = await summaryPage.getAllSurveyDetails();
   * console.log(details["Survey Title"]); // "My Survey"
   */
  async getAllSurveyDetails(): Promise<Record<string, string>> {
    const cells = this.resolve(SurveyManagerSummaryLocators.detailFieldCells);
    const count = await cells.count();
    const result: Record<string, string> = {};

    for (let i = 0; i < count; i++) {
      const cell = cells.nth(i);
      const label = await cell
        .locator(".tw-text-xs")
        .first()
        .evaluate((el) => (el.textContent ?? "").trim())
        .catch(() => "");
      if (!label) continue;

      const valueSpan = cell.locator("#dbx-overflow-span").first();
      const spanCount = await valueSpan.count();
      let value = "";
      if (spanCount > 0) {
        value = await valueSpan.evaluate((el) => (el.textContent ?? "").trim());
      } else {
        value = await cell
          .locator(".tw-text-sm")
          .first()
          .evaluate((el) => (el.textContent ?? "").trim())
          .catch(() => "");
      }
      result[label] = value;
    }
    return result;
  }

  // ── Channels card ──────────────────────────────────────────────────────────

  /**
   * Searches the channels table using the search input.
   * Pierces the `<dbx-ds-text-input>` Shadow DOM to reach the inner `<input>`.
   *
   * @param query  Text to type into the search box.
   */
  async searchChannels(query: string): Promise<void> {
    const inputEl = this.resolve(
      SurveyManagerSummaryLocators.channelsTableSearchInput
    ).locator("input");
    await inputEl.clear();
    await inputEl.fill(query);
    await this.page.waitForTimeout(600);
  }

  /**
   * Returns the number of visible rows in the channels table.
   * Returns 0 when the table shows "No Records Found".
   */
  async getChannelRowCount(): Promise<number> {
    return this.resolve(SurveyManagerSummaryLocators.channelsTableRows).count();
  }

  // ── Invites / Reminder panel ───────────────────────────────────────────────

  /** Closes the Invites/Reminder panel via the header × button. */
  async closeInvitesPanel(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerSummaryLocators.invitesCloseButton)
    );
    await this.page.waitForTimeout(400);
  }

  /** Clicks the Save Reminder button in the Invites panel footer. */
  async saveReminderInvites(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerSummaryLocators.invitesSaveReminderButton)
    );
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  /** Clicks the footer Close button to dismiss the Invites panel. */
  async closeInvitesPanelViaFooter(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerSummaryLocators.invitesFooterCloseButton)
    );
    await this.page.waitForTimeout(400);
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /** Asserts the root Summary page container is visible. */
  async assertPageVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerSummaryLocators.page)).toBeVisible();
  }

  /** Asserts the shared survey header and its key buttons are visible. */
  async assertHeaderVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerSummaryLocators.header)
    ).toBeVisible();
    await expect(
      this.resolve(SurveyManagerSummaryLocators.headerBackButton)
    ).toBeVisible();
    await expect(
      this.resolve(SurveyManagerSummaryLocators.headerSurveyName)
    ).toBeVisible();
    await expect(
      this.resolve(SurveyManagerSummaryLocators.headerPreviousButton)
    ).toBeVisible();
    await expect(
      this.resolve(SurveyManagerSummaryLocators.headerActivateButton)
    ).toBeVisible();
  }

  /** Asserts the survey creation stepper is visible. */
  async assertStepperVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerSummaryLocators.stepper)
    ).toBeVisible();
  }

  /** Asserts the Survey Details card container is visible. */
  async assertDetailsSectionVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerSummaryLocators.detailsSection)
    ).toBeVisible();
  }

  /**
   * Asserts that the Survey Details grid contains at least one field cell,
   * confirming the grid data has rendered.
   */
  async assertDetailsGridPopulated(): Promise<void> {
    const count = await this.resolve(
      SurveyManagerSummaryLocators.detailFieldCells
    ).count();
    expect(count).toBeGreaterThan(0);
  }

  /** Asserts the Channels section card container is visible. */
  async assertChannelsSectionVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerSummaryLocators.channelsSection)
    ).toBeVisible();
  }

  /** Asserts the channels dbox-table element is visible. */
  async assertChannelsTableVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerSummaryLocators.channelsTable)
    ).toBeVisible();
  }

  /**
   * Asserts the channels table search input is visible and editable.
   * The input is identified by placeholder text; no data-testid is present.
   * A longer timeout is used because the dbox-table replaces a skeleton loader
   * asynchronously after the initial page load.
   */
  async assertChannelsSearchInputVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerSummaryLocators.channelsTableSearchInput)
    ).toBeVisible({ timeout: 20_000 });
  }

  /** Asserts the Activate / Deactivate confirmation dialog is present in DOM. */
  async assertActivateDialogAttached(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerSummaryLocators.activateDialog)
    ).toBeAttached();
  }

  /** Asserts the Invites/Reminder panel close button is present in DOM. */
  async assertInvitesPanelAttached(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerSummaryLocators.invitesCloseButton)
    ).toBeAttached();
  }

  /** Asserts the Save Reminder button is present in DOM. */
  async assertInvitesSaveReminderAttached(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerSummaryLocators.invitesSaveReminderButton)
    ).toBeAttached();
  }

  /** Asserts the Invites errors element is present in DOM. */
  async assertInvitesErrorsAttached(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerSummaryLocators.invitesErrors)
    ).toBeAttached();
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  /**
   * Resolves a `Locator` definition to a Playwright `Locator`.
   * - testIds starting with "dbx-" are wrapped in `[data-testid="…"]`.
   * - All other values are treated as raw CSS selectors.
   */
  private resolve(locator: Locator): PlaywrightLocator {
    const selector = locator.testId.trim();
    if (selector.startsWith("dbx-")) {
      return this.page.locator(`[data-testid=${JSON.stringify(selector)}]`);
    }
    return this.page.locator(selector);
  }

  private async text(locator: Locator): Promise<string> {
    return (await this.resolve(locator).innerText())
      .replace(/\s+/g, " ")
      .trim();
  }
}
