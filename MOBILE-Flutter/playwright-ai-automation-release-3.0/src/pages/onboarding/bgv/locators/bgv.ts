import { Locator } from "../../../common/locators/common";

// https://ta6.qa.darwinbox.io/onboarding/onboarding/bgvemployees
//
// Live exploration summary from headed Chromium:
// - The route renders the BGV employee review shell with the "Pending reviews"
//   tab active by default.
// - Only five automation-relevant elements expose stable `data-testid`
//   attributes on the live page, even after exploring the page-level drawers.
// - The search box, toolbar drawers, table grid, empty state, and pagination
//   controls currently do not expose `data-testid`, so they are intentionally
//   excluded to keep this locator file strictly testid-only.
// - The "Completed reviews" tab is part of the same onboarding BGV route family
//   and is treated as downstream navigation rather than a separate POM.

export const BgvLocators = {
  logoLink: {
    testId: "dbx-onboarding-link-logo",
    description: "Tenant logo link shown in the BGV review shell header",
  } as Locator,

  logoutLink: {
    testId: "dbx-onboarding-link-logout",
    description: "Logout link rendered in the header for the signed-in BGV user",
  } as Locator,

  collapseNavButton: {
    testId: "dbx-onboarding-btn-collapse-nav",
    description: "Button that collapses or expands the left onboarding navigation rail",
  } as Locator,

  pendingReviewsTab: {
    testId: "dbx-onboarding-tab-pending-reviews",
    description: "Tab link for the default Pending reviews view on the BGV employee route",
  } as Locator,

  completedReviewsTab: {
    testId: "dbx-onboarding-tab-completed-reviews",
    description: "Tab link that navigates to the Completed reviews view for this BGV route family",
  } as Locator,
} as const;
