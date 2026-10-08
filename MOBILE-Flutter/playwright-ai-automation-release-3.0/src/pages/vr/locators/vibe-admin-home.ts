import { Locator } from "../../common/locators/common";

export const VibeAdminHomeLocators = {
  landingRoot: {
    testId: "dbx-vibe-section-landing-page-root",
    description: "Root container shared by the Vibe home admin routes",
  } as Locator,
  postsParent: {
    testId: "dbx-vibe-section-posts-parent",
    description: "Root content section for the Vibe posts routes",
  } as Locator,
  postsBreadcrumb: {
    testId: "dbx-vibe-btn-posts-parent-breadcrumb",
    description: "Breadcrumb shown on the Vibe posts routes",
  } as Locator,
  postsParentTabs: {
    testId: "dbx-vibe-tab-posts-parent",
    description: "Top-level tab group for the Vibe posts routes",
  } as Locator,
  userProfileSection: {
    testId: "dbx-vibe-section-user-profile",
    description: "Sidebar user profile section on the Vibe home pages",
  } as Locator,
  userAvatar: {
    testId: "dbx-vibe-icon-user-avatar",
    description: "User avatar shown in the Vibe home sidebar",
  } as Locator,
  userNameButton: {
    testId: "dbx-vibe-btn-user-name",
    description: "User name entry in the Vibe home sidebar",
  } as Locator,
  feedToolbar: {
    testId: "dbx-vibe-section-feed-toolbar",
    description: "Toolbar above the post feed",
  } as Locator,
  feedFilterDropdown: {
    testId: "dbx-vibe-dropdown-feed-filter",
    description: "Dropdown that controls the feed filter",
  } as Locator,
  feedSearchInput: {
    testId: "dbx-vibe-input-search-posts",
    description: "Search input for filtering posts in the feed",
  } as Locator,
  feedSearchSubmitButton: {
    testId: "dbx-vibe-btn-search-submit",
    description: "Submit button for the feed search input",
  } as Locator,
  feedFilterOpenButton: {
    testId: "dbx-vibe-btn-feed-filter-open",
    description: "Button that opens the feed filter flyout",
  } as Locator,
  feedSection: {
    testId: "dbx-vibe-section-feed",
    description: "Main feed section for posts on the page",
  } as Locator,
  commentsSection: {
    testId: "dbx-vibe-section-comments",
    description: "Expanded comments section for the active post",
  } as Locator,
  addCommentInput: {
    testId: "dbx-vibe-input-add-comment",
    description: "Input used to add a comment to the active post",
  } as Locator,
  commentEmojiButton: {
    testId: "dbx-vibe-btn-comment-emoji",
    description: "Emoji picker trigger for the active comment composer",
  } as Locator,
  commentGifButton: {
    testId: "dbx-vibe-btn-comment-gif",
    description: "GIF picker trigger for the active comment composer",
  } as Locator,
  submitCommentButton: {
    testId: "dbx-vibe-btn-submit-comment",
    description: "Submit button for the active comment composer",
  } as Locator,

  selfViewTab: {
    testId: "dbx-vibe-tab-self-view",
    description: "Self-view tab group shown on the All Posts route",
  } as Locator,
  groupsSection: {
    testId: "dbx-vibe-section-groups",
    description: "Suggested groups section on the All Posts route",
  } as Locator,
  groupsCardSection: {
    testId: "dbx-vibe-section-groups-card",
    description: "Container holding suggested group cards",
  } as Locator,
  groupsViewAllButton: {
    testId: "dbx-vibe-btn-groups-view-all",
    description: "View All button for the groups widget",
  } as Locator,
  groupsModal: {
    testId: "dbx-vibe-modal-all-groups",
    description: "Root dialog for the Groups modal opened from the All Posts page",
  } as Locator,
  groupsModalSearchInput: {
    testId: "dbx-vibe-input-search-groups",
    description: "Search input inside the Groups modal",
  } as Locator,
  groupsModalCreateGroupButton: {
    testId: "dbx-vibe-btn-create-group",
    description: "Create Group button inside the Groups modal",
  } as Locator,
  createPostSection: {
    testId: "dbx-vibe-section-create-post",
    description: "Create Post composer shortcut section",
  } as Locator,
  createPostInput: {
    testId: "dbx-vibe-input-create-post",
    description: "Primary create-post input area",
  } as Locator,
  petPicsShortcutButton: {
    testId: "dbx-vibe-btn-shortcut-pet_pics",
    description: "Shortcut for the pet pictures post template",
  } as Locator,
  epicReadsShortcutButton: {
    testId: "dbx-vibe-btn-shortcut-epic_reads",
    description: "Shortcut for the epic reads post template",
  } as Locator,
  askForumShortcutButton: {
    testId: "dbx-vibe-btn-shortcut-ask_forum",
    description: "Shortcut for the ask forum post template",
  } as Locator,
  createPostTemplatesDialog: {
    testId: "dbx-vibe-modal-create-post",
    description: "Template picker dialog that opens before creating a post",
  } as Locator,
  postTemplatesSection: {
    testId: "dbx-vibe-section-post-templates",
    description: "Section listing post creation templates",
  } as Locator,
  createPostForm: {
    testId: "dbx-vibe-form-create-post",
    description: "Main create-post form after selecting a template",
  } as Locator,
  mediaUploadSection: {
    testId: "dbx-vibe-section-media-upload",
    description: "Media upload section within the create-post form",
  } as Locator,
  postContentInput: {
    testId: "dbx-vibe-input-post-content",
    description: "Primary content input for the create-post form",
  } as Locator,
  postAsDropdown: {
    testId: "dbx-vibe-dropdown-post-as",
    description: "Dropdown to choose which identity the post is created as",
  } as Locator,
  allowCommentsToggle: {
    testId: "dbx-vibe-toggle-allow-comments",
    description: "Toggle that enables or disables comments on the post",
  } as Locator,
  shareWithDropdown: {
    testId: "dbx-vibe-dropdown-share-with",
    description: "Dropdown to choose the audience bucket for the post",
  } as Locator,
  shareVisibilityDropdown: {
    testId: "dbx-vibe-dropdown-share-visibility",
    description: "Dropdown to choose visibility rules for the post",
  } as Locator,
  shareVisibilityCaret: {
    testId: "dbx-vibe-icon-share-visibility-caret",
    description: "Caret icon inside the share visibility dropdown",
  } as Locator,
  addMoreAudienceButton: {
    testId: "dbx-vibe-btn-add-more-audience",
    description: "Button to add more audience targets to the post",
  } as Locator,
  discardPostButton: {
    testId: "dbx-vibe-btn-discard-post",
    description: "Discard button for the create-post form",
  } as Locator,
  submitPostButton: {
    testId: "dbx-vibe-btn-submit-post",
    description: "Submit button for the create-post form",
  } as Locator,
  createGroupModal: {
    testId: "dbx-vibe-modal-create-group",
    description: "Create Group modal opened from the Groups modal",
  } as Locator,
  createGroupNameInput: {
    testId: "dbx-vibe-input-group-name",
    description: "Group name input inside the Create Group modal",
  } as Locator,
  createGroupThumbnailInput: {
    testId: "dbx-vibe-input-group-thumbnail",
    description: "Thumbnail upload input inside the Create Group modal",
  } as Locator,
  createGroupDescriptionInput: {
    testId: "dbx-vibe-input-group-description",
    description: "Description input inside the Create Group modal",
  } as Locator,
  createGroupEnableContestToggle: {
    testId: "dbx-vibe-toggle-group-enable-contest",
    description: "Enable Contest toggle inside the Create Group modal",
  } as Locator,
  createGroupTypeSection: {
    testId: "dbx-vibe-select-group-type",
    description: "Group type section inside the Create Group modal",
  } as Locator,
  createGroupTypeWorkOption: {
    testId: "dbx-vibe-select-group-type-option-Work ( For example, a team / department / project, etc.)",
    description: "Generated radio option test ID for selecting Work as the group type",
  } as Locator,
  createGroupTypeInterestOption: {
    testId: "dbx-vibe-select-group-type-option-Interest - (For example, book club / sports / art club, etc.)",
    description: "Generated radio option test ID for selecting Interest as the group type",
  } as Locator,
  createGroupPrivacySection: {
    testId: "dbx-vibe-select-group-privacy",
    description: "Privacy settings section inside the Create Group modal",
  } as Locator,
  createGroupPrivacyPublicOption: {
    testId: "dbx-vibe-select-group-privacy-option-Public: Anyone can join",
    description: "Generated radio option test ID for choosing Public privacy",
  } as Locator,
  createGroupPrivacyPrivateOption: {
    testId: "dbx-vibe-select-group-privacy-option-Private: Anyone can request to join, and invited people can join directly.",
    description: "Generated radio option test ID for choosing Private privacy",
  } as Locator,
  createGroupPrivacyHiddenOption: {
    testId: "dbx-vibe-select-group-privacy-option-Hidden: Only Admins can add people.",
    description: "Generated radio option test ID for choosing Hidden privacy",
  } as Locator,
  createGroupMembershipModeSection: {
    testId: "dbx-vibe-select-group-membership-mode",
    description: "Membership mode section inside the Create Group modal",
  } as Locator,
  createGroupMembershipManualOption: {
    testId: "dbx-vibe-select-group-membership-mode-option-Manual: Approve or add people manually",
    description: "Generated radio option test ID for choosing Manual membership mode",
  } as Locator,
  createGroupMembershipAutomaticOption: {
    testId: "dbx-vibe-select-group-membership-mode-option-Automatic: Approval and addition based on selected “user assignment”",
    description: "Generated radio option test ID for choosing Automatic membership mode",
  } as Locator,
  createGroupAllowPostsCheckbox: {
    testId: "dbx-vibe-checkbox-group-allow-posts",
    description: "Checkbox to allow group members to create posts",
  } as Locator,
  createGroupAllowPollsCheckbox: {
    testId: "dbx-vibe-checkbox-group-allow-polls",
    description: "Checkbox to allow group members to create polls",
  } as Locator,
  createGroupAllowEventsCheckbox: {
    testId: "dbx-vibe-checkbox-group-allow-events",
    description: "Checkbox to allow group members to create events",
  } as Locator,
  createGroupAllowKnowledgeCheckbox: {
    testId: "dbx-vibe-checkbox-group-allow-knowledge",
    description: "Checkbox to allow group members to share knowledge base articles",
  } as Locator,
  createGroupDiscardButton: {
    testId: "dbx-vibe-modal-create-group-footer-discard",
    description: "Discard button inside the Create Group modal",
  } as Locator,
  createGroupSubmitButton: {
    testId: "dbx-vibe-modal-create-group-footer-create",
    description: "Create button inside the Create Group modal",
  } as Locator,
  createGroupCloseButton: {
    testId: "dbx-vibe-modal-create-group-back-button",
    description: "Back button in the Create Group modal header",
  } as Locator,
  leaderboardSection: {
    testId: "dbx-vibe-section-leaderboard",
    description: "Recognition leaderboard section on the All Posts route",
  } as Locator,
  appreciateNowButton: {
    testId: "dbx-vibe-btn-appreciate-now",
    description: "Primary CTA inside the recognition leaderboard section",
  } as Locator,
  teamRecognitionsSection: {
    testId: "dbx-vibe-section-team-recognitions",
    description: "Team recognitions widget on the All Posts route",
  } as Locator,
  teamRecognitionsViewAllButton: {
    testId: "dbx-vibe-btn-team-recognitions-view-all",
    description: "View All button for the team recognitions widget",
  } as Locator,
  awardsSection: {
    testId: "dbx-vibe-section-awards",
    description: "Awards widget shown on the All Posts route",
  } as Locator,
  awardsViewAllButton: {
    testId: "dbx-vibe-btn-awards-view-all",
    description: "View All button for the awards widget",
  } as Locator,
  awardsNominateIndividualButton: {
    testId: "dbx-vibe-btn-nominate-individual",
    description: "Nominate Individual CTA inside the All Posts awards widget",
  } as Locator,
  noticeBoardSection: {
    testId: "dbx-vibe-section-notice-board",
    description: "Notice board widget shown on Vibe home routes",
  } as Locator,
  noticeViewAllButton: {
    testId: "dbx-vibe-btn-notice-view-all",
    description: "View All button for the notice board widget on All Posts",
  } as Locator,
  milestonesSection: {
    testId: "dbx-vibe-section-milestones",
    description: "Milestones and events widget on the All Posts route",
  } as Locator,
  milestonesTabGroup: {
    testId: "dbx-vibe-tab-milestones-events",
    description: "Tab group for milestones and events",
  } as Locator,

  adminViewTab: {
    testId: "dbx-vibe-tab-admin-view",
    description: "Admin-view tab group shown on the Reported Posts route",
  } as Locator,
  noticeAddButton: {
    testId: "dbx-vibe-btn-notice-add",
    description: "Add Notice button on the reported posts admin route",
  } as Locator,
  noticeAdminViewAllButton: {
    testId: "dbx-vibe-btn-notice-admin-view-all",
    description: "Admin View All button for the notice board widget",
  } as Locator,

  awardsBreadcrumb: {
    testId: "dbx-vibe-btn-awards-breadcrumb",
    description: "Breadcrumb shown on the awards landing route",
  } as Locator,
  viewEligibilityButton: {
    testId: "dbx-vibe-btn-view-eligibility",
    description: "Button that opens the awards eligibility view",
  } as Locator,
  awardsPageSection: {
    testId: "dbx-vibe-section-awards-page",
    description: "Primary page section for the awards landing route",
  } as Locator,
  groupDetailsBreadcrumb: {
    testId: "dbx-vibe-btn-group-details-breadcrumb",
    description: "Breadcrumb shown on the group details page",
  } as Locator,
  groupDetailsOptionsMenu: {
    testId: "dbx-vibe-menu-group-details-options",
    description: "Overflow options menu on the group details page",
  } as Locator,
  groupDetailsSection: {
    testId: "dbx-vibe-section-group-details",
    description: "Primary details section for the selected group view",
  } as Locator,
  awardsYearFilterDropdown: {
    testId: "dbx-vibe-dropdown-awards-filter-year",
    description: "Year filter dropdown on the awards landing route",
  } as Locator,
  awardsSortDropdown: {
    testId: "dbx-vibe-dropdown-awards-sort",
    description: "Sort dropdown on the awards landing route",
  } as Locator,
  myAwardsTab: {
    testId: "dbx-vibe-tab-my-awards",
    description: "My Awards tab group on the awards landing route",
  } as Locator,
  myAwardsViewAllButton: {
    testId: "dbx-vibe-btn-my-awards-view-all",
    description: "View All button for the My Awards widget",
  } as Locator,

  postCards: {
    testId: '[data-testid^="dbx-vibe-card-post-"]',
    description: "Collection of visible post cards in the active feed",
  } as Locator,
  awardCards: {
    testId: '[data-testid^="dbx-vibe-card-award-"]',
    description: "Collection of award program cards on the awards landing route",
  } as Locator,

  postCard: (postId: string): Locator => ({
    testId: `dbx-vibe-card-post-${postId}`,
    description: `Post card for post ${postId}`,
  }),
  postHeading: (postId: string): Locator => ({
    testId: `dbx-vibe-link-post-heading-${postId}`,
    description: `Heading block for post ${postId}`,
  }),
  postOptionsMenuButton: (postId: string): Locator => ({
    testId: `dbx-vibe-menu-post-options-${postId}`,
    description: `Overflow menu trigger for post ${postId}`,
  }),
  postCommentsButton: (postId: string): Locator => ({
    testId: `dbx-vibe-btn-comments-${postId}`,
    description: `Comments button for post ${postId}`,
  }),
  postCommentsToggleIcon: (postId: string): Locator => ({
    testId: `dbx-vibe-icon-toggle-comments-${postId}`,
    description: `Comments toggle icon for post ${postId}`,
  }),
  postBookmarkButton: (postId: string): Locator => ({
    testId: `dbx-vibe-btn-bookmark-${postId}`,
    description: `Bookmark button for post ${postId}`,
  }),
  postReportActionButton: (postId: string): Locator => ({
    testId: `dbx-vibe-btn-act-reported-${postId}`,
    description: `Primary admin action button for reported post ${postId}`,
  }),
  postReportIssueBadge: (postId: string, index = 0): Locator => ({
    testId: `dbx-vibe-badge-post-report-issue-${postId}-${index}`,
    description: `Issue badge ${index} for reported post ${postId}`,
  }),
  postMenuItem: (postId: string, action: string): Locator => ({
    testId: `dbx-vibe-item-post-menu-${postId}-${action}`,
    description: `Menu action ${action} for post ${postId}`,
  }),
  postTemplateCard: (templateId: string): Locator => ({
    testId: `dbx-vibe-card-template-${templateId}`,
    description: `Creation template card for post template ${templateId}`,
  }),
  groupCard: (groupId: string): Locator => ({
    testId: `dbx-vibe-card-group-${groupId}`,
    description: `Group suggestion card for group ${groupId}`,
  }),
  groupNavigateButton: (groupId: string): Locator => ({
    testId: `dbx-vibe-btn-group-navigate-${groupId}`,
    description: `Navigation button for group ${groupId}`,
  }),
  groupsModalViewButton: (groupId: string): Locator => ({
    testId: `dbx-vibe-btn-group-modal-navigate-${groupId}`,
    description: `Primary navigation button for group ${groupId} inside the Groups modal`,
  }),
  commentOptionsMenuButton: (commentId: string): Locator => ({
    testId: `dbx-vibe-menu-comment-options-${commentId}`,
    description: `Overflow menu trigger for comment ${commentId}`,
  }),
  replyButton: (commentId: string): Locator => ({
    testId: `dbx-vibe-btn-reply-${commentId}`,
    description: `Reply button for comment ${commentId}`,
  }),
  noticeItem: (noticeId: string): Locator => ({
    testId: `dbx-vibe-item-notice-${noticeId}`,
    description: `Notice board item ${noticeId}`,
  }),
  awardCard: (programId: string): Locator => ({
    testId: `dbx-vibe-card-award-${programId}`,
    description: `Award program card for program ${programId}`,
  }),
  nominateIndividualButton: (programId: string): Locator => ({
    testId: `dbx-vibe-btn-nominate-individual-${programId}`,
    description: `Nominate Individual CTA for program ${programId}`,
  }),
  teamRecognitionsUser: (userId: string): Locator => ({
    testId: `dbx-vibe-link-team-recognitions-user-${userId}`,
    description: `Team recognitions user link for user ${userId}`,
  }),
  groupMemberProfileLink: (userId: string): Locator => ({
    testId: `dbx-vibe-link-user-profile-${userId}`,
    description: `Member profile link for user ${userId} on the group details page`,
  }),
} as const;
