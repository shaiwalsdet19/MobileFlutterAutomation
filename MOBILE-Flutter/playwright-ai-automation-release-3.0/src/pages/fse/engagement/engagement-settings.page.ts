import { expect, Locator as PlaywrightLocator } from "@playwright/test";
import { BasePage } from "../../base.page";
import { Locator } from "../../common/locators/common";
import { EngagementSettingsApi } from "./api/engagement-settings.api";
import { EngagementSettingsLocators } from "./locators/engagement-settings";

export class EngagementSettingsPage extends BasePage {
  // ── Navigation ─────────────────────────────────────────────────────────────

  /**
   * Navigates to the Engagement Settings page and waits until it is fully
   * loaded (form and heading visible).
   */
  async navigate(baseUrl: string): Promise<void> {
    await this.goto(EngagementSettingsApi.getPageUrl(baseUrl));
    await this.waitForPageReady();
  }

  // ── Readiness ──────────────────────────────────────────────────────────────

  /**
   * Waits until the settings form and the page heading are both visible,
   * confirming the server-rendered page has fully loaded.
   */
  async waitForPageReady(): Promise<void> {
    await expect(this.resolve(EngagementSettingsLocators.page)).toBeVisible({
      timeout: 30_000,
    });
    await expect(this.resolve(EngagementSettingsLocators.heading)).toBeVisible({
      timeout: 15_000,
    });
    await expect(this.resolve(EngagementSettingsLocators.form)).toBeVisible({
      timeout: 15_000,
    });
  }

  // ── Breadcrumb ────────────────────────────────────────────────────────────

  /** Returns the text of the currently-active (last) breadcrumb item. */
  async getActiveBreadcrumbText(): Promise<string> {
    return this.text(EngagementSettingsLocators.breadcrumbSelected);
  }

  /** Returns all breadcrumb item texts in order. */
  async getAllBreadcrumbTexts(): Promise<string[]> {
    const items = this.resolve(EngagementSettingsLocators.breadcrumbItems);
    const count = await items.count();
    const texts: string[] = [];
    for (let i = 0; i < count; i++) {
      const raw = await items.nth(i).evaluate(
        (el) => (el.textContent ?? "").replace(/\s+/g, " ").trim()
      );
      texts.push(raw);
    }
    return texts;
  }

  // ── Save ──────────────────────────────────────────────────────────────────

  /**
   * Clicks the Ribbon Save button and waits for the form POST to complete.
   */
  async clickSave(): Promise<void> {
    await this.click(this.resolve(EngagementSettingsLocators.ribbonSaveButton));
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  // ── Scale field ───────────────────────────────────────────────────────────

  /**
   * Returns the currently-selected value of the Scale Chosen dropdown.
   * Reads the visible label text from the Chosen single-select span.
   */
  async getScaleValue(): Promise<string> {
    return this.resolve(EngagementSettingsLocators.scaleChosenSingle)
      .locator("span")
      .first()
      .evaluate((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim());
  }

  /**
   * Opens the Scale Chosen dropdown by clicking its visible anchor.
   * Use `chooseScaleOption()` after this to select an item.
   */
  async openScaleDropdown(): Promise<void> {
    await this.click(this.resolve(EngagementSettingsLocators.scaleChosenSingle));
    await this.page.waitForTimeout(300);
  }

  /**
   * Selects a Scale option by its visible text via the Chosen dropdown.
   * Opens the dropdown if not already open.
   *
   * @param optionText  Exact or partial text of the option to select.
   */
  async chooseScaleOption(optionText: string): Promise<void> {
    await this.openScaleDropdown();
    await this.resolve(EngagementSettingsLocators.scaleChosenResults)
      .locator(`li:has-text("${optionText}")`)
      .first()
      .click();
  }

  // ── Primary Engagement Indicator ──────────────────────────────────────────

  /**
   * Returns the currently-selected Primary Engagement Indicator label.
   */
  async getPrimaryIndicatorValue(): Promise<string> {
    return this.resolve(EngagementSettingsLocators.indicatorChosenSingle)
      .locator("span")
      .first()
      .evaluate((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim());
  }

  /**
   * Selects a Primary Engagement Indicator option.
   * Accepted values: "Happiness" | "Moodometer" | "Theme" | "Custom Happiness" (as shown in UI).
   */
  async choosePrimaryIndicator(optionText: string): Promise<void> {
    await this.click(this.resolve(EngagementSettingsLocators.indicatorChosenSingle));
    await this.page.waitForTimeout(300);
    await this.resolve(EngagementSettingsLocators.indicatorChosenContainer)
      .locator(`.chosen-results li:has-text("${optionText}")`)
      .first()
      .click();
    await this.page.waitForTimeout(400);
  }

  // ── Theme (shown when Primary Indicator = "Theme") ────────────────────────

  /**
   * Returns the currently-selected Theme value.
   * Only meaningful when the Theme section is visible.
   */
  async getThemeValue(): Promise<string> {
    return this.resolve(EngagementSettingsLocators.themeChosenSingle)
      .locator("span")
      .first()
      .evaluate((el) => (el.textContent ?? "").replace(/\s+/g, " ").trim());
  }

  // ── Enable eNPS ───────────────────────────────────────────────────────────

  /**
   * Returns `true` if the "Enable eNPS on Engagement Dashboard" checkbox is
   * currently checked.
   */
  async isEnableNpsChecked(): Promise<boolean> {
    return this.resolve(EngagementSettingsLocators.enableNpsCheckbox).isChecked();
  }

  /**
   * Checks or unchecks the Enable eNPS checkbox.
   *
   * @param checked  Pass `true` to enable, `false` to disable.
   */
  async setEnableNps(checked: boolean): Promise<void> {
    const checkbox = this.resolve(EngagementSettingsLocators.enableNpsCheckbox);
    const current = await checkbox.isChecked();
    if (current !== checked) {
      await checkbox.click();
    }
  }

  // ── Minimum attribute size ────────────────────────────────────────────────

  /**
   * Returns the current value of the minimum attribute size input.
   */
  async getMinSizeValue(): Promise<string> {
    return this.resolve(
      EngagementSettingsLocators.minSizeInput
    ).inputValue();
  }

  /**
   * Clears and fills the minimum attribute size number input.
   */
  async fillMinSize(value: string): Promise<void> {
    const input = this.resolve(EngagementSettingsLocators.minSizeInput);
    await input.clear();
    await input.fill(value);
  }

  // ── Score calculation settings accordion ──────────────────────────────────

  /**
   * Returns `true` if the Score calculation settings accordion body is
   * expanded (has the CSS class `show` applied via Bootstrap collapse).
   */
  async isScoreSettingsExpanded(): Promise<boolean> {
    const body = this.resolve(EngagementSettingsLocators.scoreSettingsBody);
    const classes = await body.getAttribute("class");
    return (classes ?? "").includes("show");
  }

  /**
   * Toggles the Score calculation settings accordion.
   * Expands if collapsed; collapses if expanded.
   */
  async toggleScoreSettings(): Promise<void> {
    await this.click(
      this.resolve(EngagementSettingsLocators.scoreSettingsToggle)
    );
    await this.page.waitForTimeout(400);
  }

  /**
   * Returns the current slider value (as a string, e.g. `"1.0"`).
   */
  async getSliderValue(): Promise<string> {
    return this.resolve(
      EngagementSettingsLocators.responseVolumeSlider
    ).inputValue();
  }

  /**
   * Sets the response-volume slider to the given value.
   * Uses `fill()` which works on range inputs in Playwright.
   *
   * @param value  A string between "0.0" and "1.0" (step 0.1).
   */
  async setSliderValue(value: string): Promise<void> {
    const slider = this.resolve(EngagementSettingsLocators.responseVolumeSlider);
    await slider.fill(value);
    await slider.dispatchEvent("input");
  }

  /**
   * Returns the text of the slider value-pill (e.g. `"1.0"`).
   */
  async getSliderValuePillText(): Promise<string> {
    return (
      await this.resolve(
        EngagementSettingsLocators.sliderValuePill
      ).textContent() ?? ""
    ).trim();
  }

  // ── Survey Exclusion List ─────────────────────────────────────────────────

  /**
   * Returns the number of surveys currently selected in the Survey Exclusion
   * List Chosen multi-select (reads the `.search-choice` tags in the Chosen
   * widget, excluding the search-field itself).
   */
  async getSurveyExclusionCount(): Promise<number> {
    const container = this.resolve(
      EngagementSettingsLocators.surveyExclusionChosenContainer
    );
    const count = await container.count();
    if (count === 0) return 0;
    return container
      .locator(".search-choice:not(.search-choice-disabled)")
      .count();
  }

  /**
   * Returns the tooltip content attribute of the Survey Exclusion List info
   * icon (reads `data-bs-content` from the popover trigger anchor).
   */
  async getSurveyExclusionTooltipContent(): Promise<string> {
    const anchor = this.resolve(
      EngagementSettingsLocators.surveyExclusionInfoTooltip
    );
    const rawContent = (await anchor.getAttribute("data-bs-content")) ?? "";
    return rawContent.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  }

  /**
   * Returns the tooltip content of the Minimum attribute size info icon.
   */
  async getMinSizeTooltipContent(): Promise<string> {
    const anchor = this.resolve(
      EngagementSettingsLocators.minSizeInfoTooltip
    );
    return (await anchor.getAttribute("data-bs-content")) ?? "";
  }

  /**
   * Returns the tooltip content of the Dashboard Filters info icon.
   */
  async getFiltersTooltipContent(): Promise<string> {
    const anchor = this.resolve(EngagementSettingsLocators.filtersInfoTooltip);
    return (await anchor.getAttribute("data-bs-content")) ?? "";
  }

  // ── Score settings info modal ─────────────────────────────────────────────

  /**
   * Opens the score calculation info modal by clicking the info button.
   */
  async openInfoModal(): Promise<void> {
    await this.click(
      this.resolve(EngagementSettingsLocators.scoreSettingsInfoButton)
    );
    await this.page.waitForTimeout(300);
  }

  /**
   * Returns `true` if the score calculation info modal is currently open.
   * Checks for the `engagement-score-settings-modal--open` CSS class on the
   * outer wrapper element.
   */
  async isInfoModalOpen(): Promise<boolean> {
    const wrapper = this.resolve(
      EngagementSettingsLocators.infoModalWrapper
    );
    const classes = await wrapper.getAttribute("class");
    return (classes ?? "").includes("engagement-score-settings-modal--open");
  }

  /**
   * Closes the score calculation info modal via its × button.
   */
  async closeInfoModal(): Promise<void> {
    await this.click(
      this.resolve(EngagementSettingsLocators.infoModalCloseButton)
    );
    await this.page.waitForTimeout(300);
  }

  // ── Assertions ─────────────────────────────────────────────────────────────

  /** Asserts the root page section is visible. */
  async assertPageVisible(): Promise<void> {
    await expect(this.resolve(EngagementSettingsLocators.page)).toBeVisible();
  }

  /** Asserts the "Engagement Settings" heading is visible. */
  async assertHeadingVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.heading)
    ).toBeVisible();
  }

  /** Asserts the settings form is visible. */
  async assertFormVisible(): Promise<void> {
    await expect(this.resolve(EngagementSettingsLocators.form)).toBeVisible();
  }

  /** Asserts the Ribbon Save button is visible. */
  async assertSaveButtonVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.ribbonSaveButton)
    ).toBeVisible();
  }

  /** Asserts the Scale Chosen dropdown wrapper is visible. */
  async assertScaleDropdownVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.scaleChosenContainer)
    ).toBeVisible();
  }

  /** Asserts the Primary Engagement Indicator Chosen wrapper is visible. */
  async assertIndicatorDropdownVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.indicatorChosenContainer)
    ).toBeVisible();
  }

  /** Asserts the Enable eNPS checkbox is visible. */
  async assertEnableNpsCheckboxVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.enableNpsCheckbox)
    ).toBeVisible();
  }

  /** Asserts the Intelligent clustering Chosen wrapper is visible. */
  async assertClusteringFieldsVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.clusteringChosenContainer)
    ).toBeVisible();
  }

  /** Asserts the Minimum attribute size number input is visible. */
  async assertMinSizeInputVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.minSizeInput)
    ).toBeVisible();
  }

  /** Asserts the Dashboard Filters Chosen wrapper is visible. */
  async assertFiltersDropdownVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.filtersChosenContainer)
    ).toBeVisible();
  }

  /** Asserts the Score calculation settings section is visible. */
  async assertScoreSettingsSectionVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.scoreSettingsSection)
    ).toBeVisible();
  }

  /** Asserts the Score calculation settings toggle button is visible. */
  async assertScoreSettingsToggleVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.scoreSettingsToggle)
    ).toBeVisible();
  }

  /** Asserts the response-volume range slider is visible. */
  async assertSliderVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.responseVolumeSlider)
    ).toBeVisible();
  }

  /** Asserts the Survey Exclusion List section container is visible. */
  async assertSurveyExclusionSectionVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.surveyExclusionSection)
    ).toBeVisible();
  }

  /** Asserts the Survey Exclusion List native <select> is attached in DOM. */
  async assertSurveyExclusionSelectAttached(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.surveyExclusionSelect)
    ).toBeAttached();
  }

  /**
   * Asserts the Survey Exclusion List tooltip anchor (ⓘ) is visible and
   * carries a non-empty `data-bs-content` attribute.
   */
  async assertSurveyExclusionTooltipVisible(): Promise<void> {
    const anchor = this.resolve(
      EngagementSettingsLocators.surveyExclusionInfoTooltip
    );
    await expect(anchor).toBeVisible();
    const content = (await anchor.getAttribute("data-bs-content")) ?? "";
    expect(content.length).toBeGreaterThan(0);
  }

  /** Asserts the Minimum attribute size tooltip anchor is visible. */
  async assertMinSizeTooltipVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.minSizeInfoTooltip)
    ).toBeVisible();
  }

  /** Asserts the Dashboard Filters tooltip anchor is visible. */
  async assertFiltersTooltipVisible(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.filtersInfoTooltip)
    ).toBeVisible();
  }

  /** Asserts the score settings info modal outer wrapper is present in DOM. */
  async assertInfoModalWrapperAttached(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.infoModalWrapper)
    ).toBeAttached();
  }

  /** Asserts the score settings info modal panel is present in the DOM. */
  async assertInfoModalPanelAttached(): Promise<void> {
    await expect(
      this.resolve(EngagementSettingsLocators.infoModalPanel)
    ).toBeAttached();
  }

  /** Asserts the active breadcrumb text equals the expected value. */
  async assertActiveBreadcrumb(expected: string): Promise<void> {
    const text = await this.getActiveBreadcrumbText();
    expect(text).toContain(expected);
  }

  // ── Private helpers ────────────────────────────────────────────────────────

  /**
   * Resolves a `Locator` definition to a Playwright locator.
   * - testIds starting with "dbx-" or "ribbon-" are wrapped in `[data-testid="…"]`
   * - All other values are used as raw CSS selectors.
   */
  private resolve(locator: Locator): PlaywrightLocator {
    const selector = locator.testId.trim();
    if (selector.startsWith("dbx-") || selector.startsWith("ribbon-")) {
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
