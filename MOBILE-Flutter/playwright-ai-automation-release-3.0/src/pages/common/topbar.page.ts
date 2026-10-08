import { Locator } from "@playwright/test";
import { BasePage } from "../base.page";
import { TopBarLocators } from "./locators/topbar";

export class TopBarPage extends BasePage {

    get root(): Locator {
        return this.getByTestId(TopBarLocators.root.testId);
    }

    get searchInput(): Locator {
        return this.getByTestId(TopBarLocators.searchInput.testId);
    }

    get searchBtn(): Locator {
        return this.getByTestId(TopBarLocators.searchBtn.testId);
    }

    get notificationBtn(): Locator {
        return this.getByTestId(TopBarLocators.notificationBtn.testId);
    }

    get profileBtn(): Locator {
        return this.getByTestId(TopBarLocators.profileBtn.testId);
    }

    get logoutBtn(): Locator {
        return this.getByTestId(TopBarLocators.logoutBtn.testId);
    }

    get sidebarAppsBtn(): Locator {
        return this.getByTestId(TopBarLocators.sidebarAppsBtn.testId);
    }

    async searchSetting(
        searchText: string,
        searchResultTestId: string,
        click = true
    ): Promise<void> {
        await this.fill(this.searchInput, searchText);
        if (click) {
            await this.click(this.getByTestId(searchResultTestId));
        }
    }

    async navigateToMenu(menuTestId: string): Promise<void> {
        await this.click(this.getByTestId(menuTestId));
    }

    async openNotifications(): Promise<void> {
        await this.click(this.notificationBtn);
    }

    async openProfileMenu(): Promise<void> {
        await this.click(this.profileBtn);
    }

    async logout(): Promise<void> {
        await this.openProfileMenu();
        await this.click(this.logoutBtn);
    }

    async toggleSidebarApps(): Promise<void> {
        await this.click(this.sidebarAppsBtn);
    }

    async navigateToApp(appTestId: string): Promise<void> {
        await this.toggleSidebarApps();
        await this.click(this.getByTestId(appTestId));
    }
}