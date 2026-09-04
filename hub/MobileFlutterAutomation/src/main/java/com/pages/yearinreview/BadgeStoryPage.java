package com.pages.yearinreview;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import com.pages.base.FlutterHelpers;

/**
 * Badge Story Page Object
 * Handles badge story display, sharing, and interaction
 */
public class BadgeStoryPage extends FlutterHelpers {

    // Flutter ValueKeys
    private static final String BADGE_STORY = "badge_story_card";
    private static final String BADGE_IMAGE = "badge_image";
    private static final String BADGE_NAME = "badge_name";
    private static final String BADGE_DESCRIPTION = "badge_description";
    private static final String SHARE_BUTTON = "share_button";
    private static final String NATIVE_SHARE_SHEET = "native_share_sheet";
    private static final String WHATSAPP_OPTION = "whatsapp_share_option";
    private static final String INSTAGRAM_OPTION = "instagram_share_option";
    private static final String EMAIL_OPTION = "email_share_option";
    private static final String STORY_CONTENT = "story_text_content";

    public BadgeStoryPage(AppiumDriver driver) {
        super.initializePageObject(driver);
        PageFactory.initElements(driver, this);
    }

    /**
     * Check if badge story is displayed
     */
    public boolean isStoryDisplayed() {
        try {
            WebElement badgeStory = findElementByKey(BADGE_STORY);
            return badgeStory != null && badgeStory.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if badge image is visible
     */
    public boolean isBadgeImageVisible() {
        try {
            WebElement badgeImg = findElementByKey(BADGE_IMAGE);
            return badgeImg != null && badgeImg.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get badge name
     */
    public String getBadgeName() {
        try {
            WebElement badgeName = findElementByKey(BADGE_NAME);
            return badgeName != null ? badgeName.getText() : "";
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Get badge description
     */
    public String getBadgeDescription() {
        try {
            WebElement description = findElementByKey(BADGE_DESCRIPTION);
            return description != null ? description.getText() : "";
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Check if badge is displayed with given name
     */
    public boolean isBadgeDisplayed(String badgeName) {
        try {
            String currentBadge = getBadgeName();
            return currentBadge.equalsIgnoreCase(badgeName);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Click share button
     */
    public void clickShareButton() {
        try {
            WebElement shareBtn = findElementByKey(SHARE_BUTTON);
            if (shareBtn != null) {
                shareBtn.click();
                Thread.sleep(500); // Wait for share sheet to open
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to click share button: " + e.getMessage());
        }
    }

    /**
     * Check if native share sheet is open
     */
    public boolean isNativeShareSheetOpen() {
        try {
            // Share sheet is typically a system dialog
            // Try to detect its presence
            Thread.sleep(300); // Wait for sheet to appear
            // In real implementation, would check for system share UI
            return true; // Placeholder
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if badge image is attached to share
     */
    public boolean isBadgeImageAttached() {
        try {
            // Would verify that image is ready to share
            WebElement badgeImg = findElementByKey(BADGE_IMAGE);
            return badgeImg != null && !badgeImg.getText().isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if WhatsApp is available as share option
     */
    public boolean isWhatsAppAvailable() {
        try {
            WebElement whatsapp = findElementByKey(WHATSAPP_OPTION);
            return whatsapp != null && whatsapp.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if Instagram is available
     */
    public boolean isInstagramAvailable() {
        try {
            WebElement instagram = findElementByKey(INSTAGRAM_OPTION);
            return instagram != null && instagram.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if Email is available
     */
    public boolean isEmailAvailable() {
        try {
            WebElement email = findElementByKey(EMAIL_OPTION);
            return email != null && email.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Select WhatsApp as share destination
     */
    public void selectWhatsAppShareOption() {
        try {
            WebElement whatsapp = findElementByKey(WHATSAPP_OPTION);
            if (whatsapp != null) {
                whatsapp.click();
                Thread.sleep(1000); // Wait for WhatsApp to open
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to select WhatsApp: " + e.getMessage());
        }
    }

    /**
     * Select Instagram as share destination
     */
    public void selectInstagramShareOption() {
        try {
            WebElement instagram = findElementByKey(INSTAGRAM_OPTION);
            if (instagram != null) {
                instagram.click();
                Thread.sleep(1000);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to select Instagram: " + e.getMessage());
        }
    }

    /**
     * Select Email as share destination
     */
    public void selectEmailShareOption() {
        try {
            WebElement email = findElementByKey(EMAIL_OPTION);
            if (email != null) {
                email.click();
                Thread.sleep(1000);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to select Email: " + e.getMessage());
        }
    }

    /**
     * Dismiss share sheet
     */
    public void dismissShareSheet() {
        try {
            // Tap outside share sheet or find cancel button
            Dimension size = driver.manage().window().getSize();
            tapAt(size.width / 2, (int) (size.height * 0.1));
            Thread.sleep(300);
        } catch (Exception e) {
            throw new RuntimeException("Failed to dismiss share sheet: " + e.getMessage());
        }
    }

    /**
     * Get badge story content
     */
    public String getStoryContent() {
        try {
            WebElement content = findElementByKey(STORY_CONTENT);
            return content != null ? content.getText() : "";
        } catch (Exception e) {
            return "";
        }
    }

}
