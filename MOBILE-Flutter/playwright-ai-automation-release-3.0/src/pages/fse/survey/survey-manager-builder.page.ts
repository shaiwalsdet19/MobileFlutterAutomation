import { expect, Locator as PlaywrightLocator } from "@playwright/test";
import { BasePage } from "../../base.page";
import { Locator } from "../../common/locators/common";
import { SurveyManagerBuilderApi } from "./api/survey-manager-builder.api";
import {
  BuilderMainTab,
  BuilderMainTabLabels,
  QuestionEditorTab,
  QuestionEditorTabLabels,
  SurveyManagerBuilderLocators,
} from "./locators/survey-manager-builder";

export class SurveyManagerBuilderPage extends BasePage {
  // ── Navigation ────────────────────────────────────────────────────────────

  async navigate(
    baseUrl: string,
    surveyId: string,
    formId: string
  ): Promise<void> {
    await this.goto(
      SurveyManagerBuilderApi.getBuilderUrl(baseUrl, surveyId, formId)
    );
    await this.waitForPageReady();
  }

  // ── Readiness ─────────────────────────────────────────────────────────────

  async waitForPageReady(): Promise<void> {
    await expect(this.resolve(SurveyManagerBuilderLocators.page)).toBeVisible();
    await expect(this.resolve(SurveyManagerBuilderLocators.header)).toBeVisible();
    await expect(
      this.resolve(SurveyManagerBuilderLocators.mainTabGroup)
    ).toBeVisible();
    await expect(
      this.resolve(SurveyManagerBuilderLocators.sectionsContainer)
    ).toBeVisible();
  }

  async waitForBuilderLoad(): Promise<void> {
    await this.page.waitForLoadState("networkidle").catch(() => {});
  }

  // ── Header reads ──────────────────────────────────────────────────────────

  async getSurveyTitle(): Promise<string> {
    return (
      await this.resolve(SurveyManagerBuilderLocators.surveyTitle).innerText()
    )
      .replace(/\s+/g, " ")
      .trim();
  }

  async getDraftStatusText(): Promise<string> {
    return (
      await this.resolve(SurveyManagerBuilderLocators.savedAsDraftBadge).innerText()
    )
      .replace(/\s+/g, " ")
      .trim();
  }

  async isDraftBadgeVisible(): Promise<boolean> {
    return this.resolve(
      SurveyManagerBuilderLocators.savedAsDraftBadge
    ).isVisible();
  }

  // ── Header actions ────────────────────────────────────────────────────────

  /** Clicks the back (chevron-left) button; may trigger the discard dialog. */
  async clickBack(): Promise<void> {
    await this.click(this.resolve(SurveyManagerBuilderLocators.backButton));
  }

  async clickPreview(): Promise<void> {
    await this.click(this.resolve(SurveyManagerBuilderLocators.previewButton));
  }

  async clickActivate(): Promise<void> {
    await this.click(this.resolve(SurveyManagerBuilderLocators.activateButton));
  }

  async clickSave(): Promise<void> {
    await this.click(this.resolve(SurveyManagerBuilderLocators.saveButton));
    await this.waitForBuilderLoad();
  }

  // ── Left panel — main tab switching ───────────────────────────────────────

  async switchMainTab(tab: BuilderMainTab): Promise<void> {
    const locator =
      tab === "questions"
        ? SurveyManagerBuilderLocators.questionsTab
        : SurveyManagerBuilderLocators.customiseTab;
    await this.click(this.resolve(locator));
    await this.waitForBuilderLoad();
  }

  async getActiveMainTabLabel(): Promise<string> {
    const activeLink = this.resolve(SurveyManagerBuilderLocators.mainTabGroup)
      .locator("a.nav-link.active");
    return (await activeLink.innerText()).replace(/\s+/g, " ").trim();
  }

  // ── Left panel — question search ───────────────────────────────────────────

  async searchQuestions(query: string): Promise<void> {
    const input = this.resolve(SurveyManagerBuilderLocators.questionSearchInput);
    await input.clear();
    await input.fill(query);
    await this.page.waitForTimeout(500);
  }

  async clearQuestionSearch(): Promise<void> {
    await this.resolve(
      SurveyManagerBuilderLocators.questionSearchInput
    ).clear();
  }

  // ── Left panel — section reads ─────────────────────────────────────────────

  async getSectionCount(): Promise<number> {
    return this.resolve(SurveyManagerBuilderLocators.sectionContainers).count();
  }

  /**
   * Returns the title of a section by its zero-based index.
   * Scopes to the nth `.root-page-container` and reads the
   * `db-typography.body.defaultText` within it.
   */
  async getSectionTitleAt(sectionIndex: number): Promise<string> {
    const titleEl = this.resolve(
      SurveyManagerBuilderLocators.sectionContainers
    )
      .nth(sectionIndex)
      .locator("db-typography.body.defaultText")
      .first();
    return (await titleEl.innerText()).replace(/\s+/g, " ").trim();
  }

  // ── Left panel — section actions ───────────────────────────────────────────

  async toggleSectionAt(sectionIndex: number): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerBuilderLocators.sectionContainers)
        .nth(sectionIndex)
        .locator(".collapse-icon-padding")
        .first()
    );
  }

  // ── Left panel — question rows ─────────────────────────────────────────────

  /**
   * Returns the number of question rows within a specific section.
   */
  async getQuestionCountInSection(sectionIndex: number): Promise<number> {
    return this.resolve(SurveyManagerBuilderLocators.sectionContainers)
      .nth(sectionIndex)
      .locator(".each-page-selector .each-question.flex-row")
      .count();
  }

  async getTotalVisibleQuestionCount(): Promise<number> {
    return this.resolve(SurveyManagerBuilderLocators.sectionQuestions).count();
  }

  /**
   * Clicks a question row by section index and question index (both zero-based).
   * After clicking, the right panel updates with the question editor.
   */
  async selectQuestionAt(
    sectionIndex: number,
    questionIndex: number
  ): Promise<void> {
    const question = this.resolve(
      SurveyManagerBuilderLocators.sectionContainers
    )
      .nth(sectionIndex)
      .locator(".each-page-selector .each-question.flex-row")
      .nth(questionIndex);
    await this.click(question);
    await this.page.waitForTimeout(300);
  }

  async isQuestionSelected(): Promise<boolean> {
    return this.resolve(
      SurveyManagerBuilderLocators.selectedQuestion
    ).isVisible();
  }

  // ── Left panel — add buttons ───────────────────────────────────────────────

  async clickAddSection(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerBuilderLocators.addSectionButton)
    );
  }

  async clickAddQuestion(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerBuilderLocators.addQuestionButton)
    );
  }

  // ── Right panel — editor tab switching ────────────────────────────────────

  async switchEditorTab(tab: QuestionEditorTab): Promise<void> {
    const locatorMap: Record<QuestionEditorTab, Locator> = {
      editor: SurveyManagerBuilderLocators.editorTab,
      logic: SurveyManagerBuilderLocators.logicTab,
      viewer: SurveyManagerBuilderLocators.viewerTab,
    };
    await this.click(this.resolve(locatorMap[tab]));
    await this.page.waitForTimeout(300);
  }

  async getActiveEditorTabLabel(): Promise<string> {
    const activeLink = this.resolve(
      SurveyManagerBuilderLocators.editorTabGroup
    ).locator("a.nav-link.active");
    return (await activeLink.innerText()).replace(/\s+/g, " ").trim();
  }

  // ── Right panel — question metadata reads ─────────────────────────────────

  /** Returns the question ID label text (e.g. `'ID: f1'`). */
  async getQuestionIdLabel(): Promise<string> {
    return (
      await this.resolve(
        SurveyManagerBuilderLocators.questionIdLabel
      ).innerText()
    )
      .replace(/\s+/g, " ")
      .trim();
  }

  // ── CUSTOMISE tab ─────────────────────────────────────────────────────────

  async clickAddLanguage(): Promise<void> {
    await this.switchMainTab("customise");
    await this.click(
      this.resolve(SurveyManagerBuilderLocators.addLanguageButton)
    );
  }

  // ── Modal — questions moved ────────────────────────────────────────────────

  async waitForMoveQuestionsModal(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.moveQuestionsModal)
    ).toBeVisible({ timeout: 10_000 });
  }

  async confirmMoveQuestions(): Promise<void> {
    await this.click(
      this.resolve(
        SurveyManagerBuilderLocators.moveQuestionsModalContinueButton
      )
    );
  }

  async cancelMoveQuestions(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerBuilderLocators.moveQuestionsModalCancelButton)
    );
  }

  // ── Modal — delete section ─────────────────────────────────────────────────

  async waitForDeleteSectionModal(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.deleteSectionModal)
    ).toBeVisible({ timeout: 10_000 });
  }

  async confirmDeleteSection(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerBuilderLocators.deleteSectionModalDeleteButton)
    );
  }

  async cancelDeleteSection(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerBuilderLocators.deleteSectionModalCancelButton)
    );
  }

  // ── Modal — change question type ───────────────────────────────────────────

  async waitForChangeQuestionTypeModal(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.changeQuestionTypeModal)
    ).toBeVisible({ timeout: 10_000 });
  }

  async confirmChangeQuestionType(): Promise<void> {
    await this.click(
      this.resolve(
        SurveyManagerBuilderLocators.changeQuestionTypeModalProceedButton
      )
    );
  }

  async cancelChangeQuestionType(): Promise<void> {
    await this.click(
      this.resolve(
        SurveyManagerBuilderLocators.changeQuestionTypeModalCancelButton
      )
    );
  }

  // ── Modal — bulk delete questions ─────────────────────────────────────────

  async waitForDeleteQuestionsModal(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.deleteQuestionsModal)
    ).toBeVisible({ timeout: 10_000 });
  }

  async confirmDeleteQuestions(): Promise<void> {
    await this.click(
      this.resolve(
        SurveyManagerBuilderLocators.deleteQuestionsModalConfirmButton
      )
    );
  }

  async cancelDeleteQuestions(): Promise<void> {
    await this.click(
      this.resolve(
        SurveyManagerBuilderLocators.deleteQuestionsModalCancelButton
      )
    );
  }

  // ── Discard dialog ────────────────────────────────────────────────────────

  async waitForDiscardDialog(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.discardDialog)
    ).toBeVisible({ timeout: 10_000 });
  }

  async stayInBuilder(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerBuilderLocators.discardDialogStayButton)
    );
  }

  async discardAndLeave(): Promise<void> {
    await this.click(
      this.resolve(SurveyManagerBuilderLocators.discardDialogLeaveButton)
    );
  }

  // ── Assertions (UI-only) ──────────────────────────────────────────────────

  async assertPageVisible(): Promise<void> {
    await expect(this.resolve(SurveyManagerBuilderLocators.page)).toBeVisible();
  }

  async assertHeaderVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.header)
    ).toBeVisible();
  }

  async assertSurveyTitleVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.surveyTitle)
    ).toBeVisible();
  }

  async assertSurveyTitleIs(expectedTitle: string): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.surveyTitle)
    ).toHaveText(expectedTitle);
  }

  async assertDraftBadgeVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.savedAsDraftBadge)
    ).toBeVisible();
  }

  async assertDraftBadgeText(expectedText: string): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.savedAsDraftBadge)
    ).toHaveText(expectedText);
  }

  async assertSaveButtonVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.saveButton)
    ).toBeVisible();
  }

  async assertPreviewButtonVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.previewButton)
    ).toBeVisible();
  }

  async assertActivateButtonVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.activateButton)
    ).toBeVisible();
  }

  async assertStepperVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.stepper)
    ).toBeVisible();
  }

  async assertMainTabGroupVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.mainTabGroup)
    ).toBeVisible();
  }

  async assertMainTabActive(tab: BuilderMainTab): Promise<void> {
    const activeSpan = this.resolve(
      SurveyManagerBuilderLocators.mainTabGroup
    ).locator("a.nav-link.active span");
    await expect(activeSpan).toHaveText(BuilderMainTabLabels[tab]);
  }

  async assertSectionsContainerVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.sectionsContainer)
    ).toBeVisible();
  }

  async assertSectionCountIs(expectedCount: number): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.sectionContainers)
    ).toHaveCount(expectedCount);
  }

  async assertAddSectionButtonVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.addSectionButton)
    ).toBeVisible();
  }

  async assertAddQuestionButtonVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.addQuestionButton)
    ).toBeVisible();
  }

  async assertEditorTabGroupVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.editorTabGroup)
    ).toBeVisible();
  }

  async assertEditorTabActive(tab: QuestionEditorTab): Promise<void> {
    const activeSpan = this.resolve(
      SurveyManagerBuilderLocators.editorTabGroup
    ).locator("a.nav-link.active span");
    await expect(activeSpan).toHaveText(QuestionEditorTabLabels[tab]);
  }

  async assertQuestionSearchInputVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.questionSearchInput)
    ).toBeVisible();
  }

  async assertMoveQuestionsModalVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.moveQuestionsModal)
    ).toBeVisible();
  }

  async assertDeleteSectionModalVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.deleteSectionModal)
    ).toBeVisible();
  }

  async assertChangeQuestionTypeModalVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.changeQuestionTypeModal)
    ).toBeVisible();
  }

  async assertDeleteQuestionsModalVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.deleteQuestionsModal)
    ).toBeVisible();
  }

  async assertDiscardDialogVisible(): Promise<void> {
    await expect(
      this.resolve(SurveyManagerBuilderLocators.discardDialog)
    ).toBeVisible();
  }

  // ── Private helpers ───────────────────────────────────────────────────────

  /**
   * Resolves a `Locator` definition to a Playwright locator.
   *
   * Rules:
   *  - `testId` starting with `dbx-` → wrapped as `[data-testid="..."]`
   *  - otherwise              → treated as a raw CSS / combinatorial selector
   */
  private resolve(locator: Locator): PlaywrightLocator {
    const selector = locator.testId.trim();
    if (selector.startsWith("dbx-")) {
      return this.page.locator(`[data-testid=${JSON.stringify(selector)}]`);
    }
    return this.page.locator(selector);
  }
}
