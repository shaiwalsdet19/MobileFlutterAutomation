import { expect, Locator as PlaywrightLocator } from "@playwright/test";
import { BasePage } from "../base.page";
import { Locator } from "../common/locators/common";
import { VibeAdminHomeApi } from "./api/vibe-admin-home.api";
import { VibeAdminHomeLocators } from "./locators/vibe-admin-home";

type CreateGroupType = "work" | "interest";
type CreateGroupPrivacy = "public" | "private" | "hidden";
type CreateGroupMembershipMode = "manual" | "automatic";
type GroupContentPermission = "posts" | "polls" | "events" | "knowledge";
type PostTemplate = "post" | "poll" | "ask_forum" | "pet_pics" | "epic_reads";

export class VibeAdminHomePage extends BasePage {
  async navigateToAllPosts(baseUrl: string): Promise<void> {
    await this.goto(VibeAdminHomeApi.getAllPostsUrl(baseUrl));
    await this.waitForAllPostsPageReady();
  }

  async navigateToReportedPosts(baseUrl: string): Promise<void> {
    await this.goto(VibeAdminHomeApi.getReportedPostsUrl(baseUrl));
    await this.waitForReportedPostsPageReady();
  }

  async navigateToAwardsLanding(baseUrl: string): Promise<void> {
    await this.goto(VibeAdminHomeApi.getAwardsLandingUrl(baseUrl));
    await this.waitForAwardsLandingPageReady();
  }

  async navigateToGroupDetails(baseUrl: string, groupId: string, fromGroupModal = true): Promise<void> {
    await this.goto(VibeAdminHomeApi.getGroupDetailsUrl(baseUrl, groupId, fromGroupModal));
    await this.waitForGroupDetailsPageReady();
  }

  async waitForAllPostsPageReady(): Promise<void> {
    await expect(this.resolve(VibeAdminHomeLocators.landingRoot)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.postsParent)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.userProfileSection)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.selfViewTab)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.createPostSection)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.feedSection)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.noticeBoardSection)).toBeVisible();
  }

  async waitForReportedPostsPageReady(): Promise<void> {
    await expect(this.resolve(VibeAdminHomeLocators.landingRoot)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.postsParent)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.adminViewTab)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.feedToolbar)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.feedSection)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.noticeBoardSection)).toBeVisible();
  }

  async waitForAwardsLandingPageReady(): Promise<void> {
    await expect(this.resolve(VibeAdminHomeLocators.landingRoot)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.awardsBreadcrumb)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.viewEligibilityButton)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.awardsPageSection)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.awardsYearFilterDropdown)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.awardsSortDropdown)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.myAwardsTab)).toBeVisible();
  }

  async waitForGroupDetailsPageReady(): Promise<void> {
    await expect(this.resolve(VibeAdminHomeLocators.landingRoot)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.groupDetailsBreadcrumb)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.groupDetailsSection)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.createPostSection)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.feedSection)).toBeVisible();
  }

  async getUserName(): Promise<string> {
    return this.text(VibeAdminHomeLocators.userNameButton);
  }

  async getFeedSummaryText(): Promise<string> {
    return this.text(VibeAdminHomeLocators.feedSection);
  }

  async getNoticeBoardText(): Promise<string> {
    return this.text(VibeAdminHomeLocators.noticeBoardSection);
  }

  async getAwardsWidgetText(): Promise<string> {
    return this.text(VibeAdminHomeLocators.awardsSection);
  }

  async getAwardsLandingSummaryText(): Promise<string> {
    return this.text(VibeAdminHomeLocators.awardsPageSection);
  }

  async getGroupDetailsSummaryText(): Promise<string> {
    return this.text(VibeAdminHomeLocators.groupDetailsSection);
  }

  async openGroupsModal(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.groupsViewAllButton));
    await this.waitForGroupsModalVisible();
  }

  async waitForGroupsModalVisible(): Promise<void> {
    await expect(this.resolve(VibeAdminHomeLocators.groupsModal)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.groupsModalSearchInput)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.groupsModalCreateGroupButton)).toBeVisible();
  }

  async searchGroupsModal(groupName: string): Promise<void> {
    const input = this.resolve(VibeAdminHomeLocators.groupsModalSearchInput);
    await input.fill("");
    await input.fill(groupName);
  }

  async openCreateGroupModal(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.groupsModalCreateGroupButton));
    await this.waitForCreateGroupModalVisible();
  }

  async waitForCreateGroupModalVisible(): Promise<void> {
    await expect(this.resolve(VibeAdminHomeLocators.createGroupModal)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.createGroupNameInput)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.createGroupDescriptionInput)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.createGroupSubmitButton)).toBeVisible();
  }

  async fillCreateGroupName(groupName: string): Promise<void> {
    await this.fill(this.resolve(VibeAdminHomeLocators.createGroupNameInput), groupName);
  }

  async fillCreateGroupDescription(description: string): Promise<void> {
    await this.fill(this.resolve(VibeAdminHomeLocators.createGroupDescriptionInput), description);
  }

  async toggleCreateGroupEnableContest(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.createGroupEnableContestToggle));
  }

  async selectCreateGroupType(type: CreateGroupType): Promise<void> {
    await this.click(this.resolve(this.groupTypeOption(type)));
  }

  async selectCreateGroupPrivacy(privacy: CreateGroupPrivacy): Promise<void> {
    await this.click(this.resolve(this.groupPrivacyOption(privacy)));
  }

  async selectCreateGroupMembershipMode(mode: CreateGroupMembershipMode): Promise<void> {
    await this.click(this.resolve(this.groupMembershipModeOption(mode)));
  }

  async toggleCreateGroupContentPermission(permission: GroupContentPermission): Promise<void> {
    await this.click(this.resolve(this.groupContentPermission(permission)));
  }

  async discardCreateGroup(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.createGroupDiscardButton));
  }

  async submitCreateGroup(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.createGroupSubmitButton));
  }

  async closeCreateGroupModal(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.createGroupCloseButton));
  }

  async openGroupFromGroupsModal(groupId: string): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.groupsModalViewButton(groupId)));
  }

  async openCreatePostTemplatePicker(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.createPostInput));
    await this.waitForCreatePostTemplatePickerVisible();
  }

  async waitForCreatePostTemplatePickerVisible(): Promise<void> {
    await expect(this.resolve(VibeAdminHomeLocators.createPostTemplatesDialog)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.postTemplatesSection)).toBeVisible();
  }

  async selectCreatePostTemplate(template: PostTemplate): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.postTemplateCard(template)));
  }

  async openNewPostComposer(): Promise<void> {
    await this.openCreatePostTemplatePicker();
    await this.selectCreatePostTemplate("post");
    await this.waitForPostComposerVisible();
  }

  async waitForPostComposerVisible(): Promise<void> {
    await expect(this.resolve(VibeAdminHomeLocators.createPostForm)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.mediaUploadSection)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.postContentInput)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.postAsDropdown)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.shareWithDropdown)).toBeVisible();
    await expect(this.resolve(VibeAdminHomeLocators.submitPostButton)).toBeVisible();
  }

  async getCreatePostFormText(): Promise<string> {
    return this.text(VibeAdminHomeLocators.createPostForm);
  }

  async fillPostContent(content: string): Promise<void> {
    const input = this.resolve(VibeAdminHomeLocators.postContentInput);
    await input.click();

    try {
      await input.fill(content);
      return;
    } catch {
      await this.page.keyboard.press("ControlOrMeta+A").catch(() => {});
      await this.page.keyboard.insertText(content);
    }
  }

  async openPostAsDropdown(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.postAsDropdown));
  }

  async toggleAllowComments(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.allowCommentsToggle));
  }

  async openShareWithDropdown(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.shareWithDropdown));
  }

  async openShareVisibilityDropdown(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.shareVisibilityDropdown));
  }

  async clickAddMoreAudience(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.addMoreAudienceButton));
  }

  async discardPostComposer(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.discardPostButton));
  }

  async submitPostComposer(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.submitPostButton));
  }

  async getVisiblePostIds(): Promise<string[]> {
    const cards = this.resolve(VibeAdminHomeLocators.postCards);
    const count = await cards.count();
    const ids: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const card = cards.nth(index);
      if (!(await card.isVisible().catch(() => false))) {
        continue;
      }

      const testId = await card.getAttribute("data-testid");
      if (testId) {
        ids.push(testId.replace("dbx-vibe-card-post-", ""));
      }
    }

    return ids;
  }

  async getFirstVisiblePostId(): Promise<string | null> {
    const visibleIds = await this.getVisiblePostIds();
    return visibleIds[0] ?? null;
  }

  async getVisibleAwardProgramIds(): Promise<string[]> {
    const cards = this.resolve(VibeAdminHomeLocators.awardCards);
    const count = await cards.count();
    const ids: string[] = [];

    for (let index = 0; index < count; index += 1) {
      const card = cards.nth(index);
      if (!(await card.isVisible().catch(() => false))) {
        continue;
      }

      const testId = await card.getAttribute("data-testid");
      if (testId) {
        ids.push(testId.replace("dbx-vibe-card-award-", ""));
      }
    }

    return ids;
  }

  async getFirstVisibleAwardProgramId(): Promise<string | null> {
    const visibleIds = await this.getVisibleAwardProgramIds();
    return visibleIds[0] ?? null;
  }

  async getPostCardText(postId: string): Promise<string> {
    return this.text(VibeAdminHomeLocators.postCard(postId));
  }

  async getAwardCardText(programId: string): Promise<string> {
    return this.text(VibeAdminHomeLocators.awardCard(programId));
  }

  async openPostOptions(postId: string): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.postOptionsMenuButton(postId)));
  }

  async openPostComments(postId: string): Promise<void> {
    const commentsButton = this.resolve(VibeAdminHomeLocators.postCommentsButton(postId));
    if ((await commentsButton.count()) > 0 && (await commentsButton.first().isVisible().catch(() => false))) {
      await this.click(commentsButton.first());
      return;
    }

    await this.click(this.resolve(VibeAdminHomeLocators.postCommentsToggleIcon(postId)));
  }

  async openReportedPostAction(postId: string): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.postReportActionButton(postId)));
  }

  async clickNominateIndividual(programId: string): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.nominateIndividualButton(programId)));
  }

  async clickViewEligibility(): Promise<void> {
    await this.click(this.resolve(VibeAdminHomeLocators.viewEligibilityButton));
  }

  async isCommentsSectionVisible(): Promise<boolean> {
    return this.resolve(VibeAdminHomeLocators.commentsSection).isVisible().catch(() => false);
  }

  async hasReportedIssueBadge(postId: string, index = 0): Promise<boolean> {
    return this.resolve(VibeAdminHomeLocators.postReportIssueBadge(postId, index))
      .isVisible()
      .catch(() => false);
  }

  async waitForPostCardVisible(postId: string): Promise<void> {
    await expect(this.resolve(VibeAdminHomeLocators.postCard(postId))).toBeVisible({ timeout: 30_000 });
  }

  async waitForAwardCardVisible(programId: string): Promise<void> {
    await expect(this.resolve(VibeAdminHomeLocators.awardCard(programId))).toBeVisible({ timeout: 30_000 });
  }

  private groupContentPermission(permission: GroupContentPermission): Locator {
    switch (permission) {
      case "posts":
        return VibeAdminHomeLocators.createGroupAllowPostsCheckbox;
      case "polls":
        return VibeAdminHomeLocators.createGroupAllowPollsCheckbox;
      case "events":
        return VibeAdminHomeLocators.createGroupAllowEventsCheckbox;
      case "knowledge":
        return VibeAdminHomeLocators.createGroupAllowKnowledgeCheckbox;
    }
  }

  private groupTypeOption(type: CreateGroupType): Locator {
    switch (type) {
      case "work":
        return VibeAdminHomeLocators.createGroupTypeWorkOption;
      case "interest":
        return VibeAdminHomeLocators.createGroupTypeInterestOption;
    }
  }

  private groupPrivacyOption(privacy: CreateGroupPrivacy): Locator {
    switch (privacy) {
      case "public":
        return VibeAdminHomeLocators.createGroupPrivacyPublicOption;
      case "private":
        return VibeAdminHomeLocators.createGroupPrivacyPrivateOption;
      case "hidden":
        return VibeAdminHomeLocators.createGroupPrivacyHiddenOption;
    }
  }

  private groupMembershipModeOption(mode: CreateGroupMembershipMode): Locator {
    switch (mode) {
      case "manual":
        return VibeAdminHomeLocators.createGroupMembershipManualOption;
      case "automatic":
        return VibeAdminHomeLocators.createGroupMembershipAutomaticOption;
    }
  }

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
