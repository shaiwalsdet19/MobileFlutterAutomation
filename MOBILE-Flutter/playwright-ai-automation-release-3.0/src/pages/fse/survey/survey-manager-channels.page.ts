import { expect, Locator as PlaywrightLocator } from "@playwright/test";
import { BasePage } from "../../base.page";
import { Locator } from "../../common/locators/common";
import { SurveyManagerChannelsApi } from "./api/survey-manager-channels.api";
import { SurveyManagerChannelsLocators } from "./locators/survey-manager-channels";

export class SurveyManagerChannelsPage extends BasePage {
  // ── Navigation ────────────────────────────────────────────────────────────

  /**
   * Navigates to the Channels (Add Channel) page for the given survey and
   * waits until the form is fully loaded.
   */
  async navigate(baseUrl: string, surveyId: string): Promise<void> {
    await this.goto(SurveyManagerChannelsApi.getPageUrl(baseUrl, surveyId));
    await this.waitForPageReady();
  }

  // ── Readiness ─────────────────────────────────────────────────────────────

  /**
   * Waits until the Add Channel form and its core fields are visible.
   */
  async waitForPageReady(): Promise<void> {
    await expect(this.resolve(SurveyManagerChannelsLocators.page)).toBeVisible({
      timeout: 30_000,
    });
    await expect(this.resolve(SurveyManagerChannelsLocators.channelNameInput)).toBeVisible({
      timeout: 15_000,
    });
  }

  // ── Header ────────────────────────────────────────────────────────────────

  /** Returns the survey name displayed in the shared header. */
  async getHeaderSurveyName(): Promise<string> {
    return this.text(SurveyManagerChannelsLocators.headerSurveyName);
  }

  /** Clicks the back button in the shared header. */
  async clickBack(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.headerBackButton));
  }

  /** Clicks the Previous button to navigate to the preceding wizard step. */
  async clickPrevious(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.headerPreviousButton));
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  /** Clicks the Next button to navigate to the next wizard step (Summary). */
  async clickNext(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.headerNextButton));
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  // ── Channel name ──────────────────────────────────────────────────────────

  /**
   * Fills the channel name field.
   * The field is a `<dbx-ds-text-input>` web component – the actual `<input>`
   * lives inside its Shadow DOM, so we chain `.locator("input")` to pierce it.
   */
  async fillChannelName(name: string): Promise<void> {
    const input = this.resolve(SurveyManagerChannelsLocators.channelNameInput).locator("input");
    await input.fill(name);
  }

  /** Reads the current value of the channel name field. */
  async getChannelNameValue(): Promise<string> {
    const input = this.resolve(SurveyManagerChannelsLocators.channelNameInput).locator("input");
    return (await input.inputValue()) ?? "";
  }

  // ── Respondent type ───────────────────────────────────────────────────────

  /**
   * Clicks the Internal respondent type card.
   * After clicking, the card's `id` attribute becomes `"active"`.
   */
  async selectInternalRespondents(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.internalCard));
  }

  /**
   * Clicks the External respondent type card.
   */
  async selectExternalRespondents(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.externalCard));
  }

  /**
   * Returns `"internal"` or `"external"` depending on which card currently
   * has `id="active"`, or `"none"` if neither is active.
   */
  async getSelectedRespondentType(): Promise<"internal" | "external" | "none"> {
    const internalId = await this.resolve(SurveyManagerChannelsLocators.internalCard)
      .getAttribute("id").catch(() => "");
    if (internalId === "active") return "internal";
    const externalId = await this.resolve(SurveyManagerChannelsLocators.externalCard)
      .getAttribute("id").catch(() => "");
    if (externalId === "active") return "external";
    return "none";
  }

  // ── Response collection type ──────────────────────────────────────────────

  /**
   * Selects the "Send Survey to Respondents" radio option.
   */
  async selectSendSurveyOption(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerChannelsLocators.responseTypeSendSurveyInput)
    );
  }

  /**
   * Selects the "Import Responses" radio option.
   */
  async selectImportResponsesOption(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerChannelsLocators.responseTypeImportInput)
    );
  }

  // ── Include respondents ───────────────────────────────────────────────────

  /**
   * Clicks the Include Respondents dropdown head to open it.
   */
  async openIncludeRespondentsDropdown(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.includeRespondentsDropdownHead));
    await this.page.waitForTimeout(400);
  }

  /**
   * Searches within the opened Include Respondents dropdown.
   */
  async searchIncludeRespondents(query: string): Promise<void> {
    const search = this.resolve(SurveyManagerChannelsLocators.includeRespondentsSearch);
    await search.fill(query);
    await this.page.waitForTimeout(500);
  }

  /** Clicks the "+ Condition" button to add a respondent filter condition. */
  async clickAddCondition(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.addConditionButton));
  }

  // ── Authenticate via ──────────────────────────────────────────────────────

  /**
   * Clicks the Internal Auth (Authenticate via) dropdown head to open it.
   */
  async openInternalAuthDropdown(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.internalAuthDropdownHead));
    await this.page.waitForTimeout(400);
  }

  /**
   * Returns the current text of the Internal Auth dropdown head
   * (e.g. "Credentials").
   */
  async getInternalAuthValue(): Promise<string> {
    return this.text(SurveyManagerChannelsLocators.internalAuthDropdownHead);
  }

  // ── Exclude respondents ───────────────────────────────────────────────────

  /** Clicks the Exclude Respondents dropdown head to open it. */
  async openExcludeRespondentsDropdown(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.excludeRespondentsDropdownHead));
    await this.page.waitForTimeout(400);
  }

  // ── Auto-reminder ─────────────────────────────────────────────────────────

  /** Clicks the auto-reminder toggle switch to enable or disable it. */
  async toggleAutoReminder(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.autoReminderToggleButton));
  }

  // ── Share options ─────────────────────────────────────────────────────────

  /**
   * Clicks the "Configure" link on the Email share row, opening the Invites
   * notification configuration panel.
   */
  async clickEmailConfigure(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.shareEmailConfigureLink));
    await this.page.waitForTimeout(600);
  }

  /**
   * Clicks the "Configure" link on the Teams share row.
   */
  async clickTeamsConfigure(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.shareTeamsConfigureLink));
    await this.page.waitForTimeout(600);
  }

  /**
   * Clicks the "Enable" link on the WhatsApp share row.
   */
  async clickWhatsAppEnable(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.shareWhatsAppEnableLink));
  }

  /**
   * Clicks the "Enable" link on the SMS share row.
   */
  async clickSmsEnable(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.shareSmsEnableLink));
  }

  // ── Invites panel ─────────────────────────────────────────────────────────

  /** Closes the Invites configuration panel via the × button. */
  async closeInvitesPanel(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.invitesCloseButton));
    await this.page.waitForTimeout(400);
  }

  /** Saves the Invites configuration via the Save button. */
  async saveInvitesPanel(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.invitesSaveButton));
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  // ── Form actions ──────────────────────────────────────────────────────────

  /** Clicks the Cancel button to discard the new channel. */
  async cancelChannel(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.cancelButton));
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  /**
   * Clicks the Add / Submit button to save the channel.
   * Waits for the network to settle after submission.
   */
  async submitChannel(): Promise<void> {
    await this.click(this.resolve(SurveyManagerChannelsLocators.submitButton));
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  /** Asserts the main Add Channel form container is visible. */
  async assertPageVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerChannelsLocators.page)).toBeVisible();
  }

  /** Asserts the shared survey header is visible with its navigation buttons. */
  async assertHeaderVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerChannelsLocators.header)).toBeVisible();
    await expect(this.resolve(SurveyManagerChannelsLocators.headerBackButton)).toBeVisible();
    await expect(this.resolve(SurveyManagerChannelsLocators.headerSurveyName)).toBeVisible();
    await expect(this.resolve(SurveyManagerChannelsLocators.headerPreviousButton)).toBeVisible();
    await expect(this.resolve(SurveyManagerChannelsLocators.headerNextButton)).toBeVisible();
  }

  /** Asserts the creation stepper is visible. */
  async assertStepperVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerChannelsLocators.stepper)).toBeVisible();
  }

  /** Asserts the channel name input is visible and editable. */
  async assertChannelNameInputVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerChannelsLocators.channelNameInput)).toBeVisible();
  }

  /** Asserts the respondent type section and both cards are visible. */
  async assertRespondentTypeSectionVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerChannelsLocators.respondentTypeSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerChannelsLocators.internalCard)).toBeVisible();
    await expect(this.resolve(SurveyManagerChannelsLocators.externalCard)).toBeVisible();
  }

  /** Asserts the response collection type radio group is visible. */
  async assertResponseTypeRadioVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerChannelsLocators.responseTypeRadio)).toBeVisible();
  }

  /** Asserts the Include Respondents and Exclude Respondents dropdowns are visible. */
  async assertRespondentDropdownsVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerChannelsLocators.includeRespondentsDropdown)).toBeVisible();
    await expect(this.resolve(SurveyManagerChannelsLocators.excludeRespondentsDropdown)).toBeVisible();
  }

  /** Asserts the auto-reminder section is visible. */
  async assertAutoReminderSectionVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerChannelsLocators.autoReminderSection)).toBeVisible();
    await expect(this.resolve(SurveyManagerChannelsLocators.autoReminderToggle)).toBeVisible();
  }

  /** Asserts all share-option rows (Email, Teams, WhatsApp, SMS) are visible. */
  async assertShareOptionsVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerChannelsLocators.shareEmailRow)).toBeVisible();
    await expect(this.resolve(SurveyManagerChannelsLocators.shareTeamsRow)).toBeVisible();
    await expect(this.resolve(SurveyManagerChannelsLocators.shareWhatsAppRow)).toBeVisible();
    await expect(this.resolve(SurveyManagerChannelsLocators.shareSmsRow)).toBeVisible();
  }

  /** Asserts the Cancel and Submit buttons are visible. */
  async assertFormActionsVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerChannelsLocators.cancelButton)).toBeVisible();
    await expect(this.resolve(SurveyManagerChannelsLocators.submitButton)).toBeVisible();
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  /**
   * Resolves a `Locator` definition to a Playwright `Locator`.
   * - testIds that start with "dbx-" are wrapped in `[data-testid="…"]`.
   * - All other testIds are treated as raw CSS selectors.
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
