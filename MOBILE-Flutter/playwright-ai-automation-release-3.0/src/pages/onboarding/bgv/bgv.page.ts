import { expect, Locator as PlaywrightLocator, Response } from "@playwright/test";
import { getBaseUrl } from "../../../../data/instances";
import { BasePage } from "../../base.page";
import { Locator } from "../../common/locators/common";
import { BgvApi } from "./api/bgv.api";
import { BgvLocators } from "./locators/bgv";

function escapeForRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export class BgvPage extends BasePage {
  async navigate(baseUrl: string): Promise<void> {
    await Promise.all([
      BgvApi.waitForPageLoad(this.page).catch(() => null),
      BgvApi.waitForTranslations(this.page).catch(() => null),
      Promise.race([
        BgvApi.waitForPendingReviewsTable(this.page).catch(() => null),
        BgvApi.waitForPendingReviewsPagination(this.page).catch(() => null),
      ]),
      this.goto(BgvApi.getPageUrl(baseUrl)),
    ]);

    await this.waitForPageReady();
  }

  async navigateToBgv(instance: string): Promise<void> {
    await this.navigate(getBaseUrl(instance));
  }

  async waitForPageReady(): Promise<void> {
    await expect(this.page).toHaveURL(
      new RegExp(`${escapeForRegex(BgvApi.pagePath)}$`)
    );
    await expect(this.resolve(BgvLocators.logoLink)).toBeVisible();
    await expect(this.resolve(BgvLocators.logoutLink)).toBeVisible();
    await expect(this.resolve(BgvLocators.collapseNavButton)).toBeVisible();
    await expect(this.resolve(BgvLocators.pendingReviewsTab)).toBeVisible();
    await expect(this.resolve(BgvLocators.completedReviewsTab)).toBeVisible();
  }

  async waitForPendingReviewsData(): Promise<Response | null> {
    return Promise.race([
      BgvApi.waitForPendingReviewsTable(this.page).catch(() => null),
      BgvApi.waitForPendingReviewsPagination(this.page).catch(() => null),
    ]);
  }

  async clickCompletedReviewsTab(): Promise<void> {
    await Promise.all([
      BgvApi.waitForCompletedReviews(this.page).catch(() => null),
      this.click(this.resolve(BgvLocators.completedReviewsTab)),
    ]);
  }

  async clickPendingReviewsTab(): Promise<void> {
    await this.click(this.resolve(BgvLocators.pendingReviewsTab));
    await BgvApi.waitForCurrentPage(this.page).catch(() => null);
  }

  async clickLogout(): Promise<void> {
    await this.click(this.resolve(BgvLocators.logoutLink));
  }

  async clickCollapseNav(): Promise<void> {
    await this.click(this.resolve(BgvLocators.collapseNavButton));
  }

  async getLogoutText(): Promise<string> {
    return this.resolve(BgvLocators.logoutLink).innerText();
  }

  async isPendingReviewsTabVisible(): Promise<boolean> {
    return this.resolve(BgvLocators.pendingReviewsTab).isVisible().catch(() => false);
  }

  async isCompletedReviewsTabVisible(): Promise<boolean> {
    return this.resolve(BgvLocators.completedReviewsTab).isVisible().catch(() => false);
  }

  async assertPageChromeVisible(): Promise<void> {
    await expect(this.resolve(BgvLocators.logoLink)).toBeVisible();
    await expect(this.resolve(BgvLocators.logoutLink)).toBeVisible();
    await expect(this.resolve(BgvLocators.collapseNavButton)).toBeVisible();
    await expect(this.resolve(BgvLocators.pendingReviewsTab)).toBeVisible();
    await expect(this.resolve(BgvLocators.completedReviewsTab)).toBeVisible();
  }

  async assertPendingReviewsRoute(): Promise<void> {
    await expect(this.page).toHaveURL(
      new RegExp(`${escapeForRegex(BgvApi.pagePath)}$`)
    );
    await this.assertPageChromeVisible();
  }

  private resolve(locator: Locator): PlaywrightLocator {
    return this.page.getByTestId(locator.testId.trim());
  }
}
