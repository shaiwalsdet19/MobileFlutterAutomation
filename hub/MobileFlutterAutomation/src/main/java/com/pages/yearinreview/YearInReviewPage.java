package com.pages.yearinreview;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import com.pages.base.FlutterHelpers;

/**
 * Year In Review Landing Page Object
 * Handles dashboard entry point and overall feature state
 */
public class YearInReviewPage extends FlutterHelpers {

    // Flutter ValueKeys for Year In Review elements
    private static final String ENTRY_POINT = "year_in_review_entry_point";
    private static final String INTRO_CARD = "year_in_review_intro_card";
    private static final String INTRO_TITLE = "intro_title";
    private static final String INTRO_MESSAGE = "intro_message";
    private static final String COMPLETION_RING = "year_in_review_completion_ring";
    private static final String FEATURE_DISABLED_MESSAGE = "feature_disabled_message";

    public YearInReviewPage(AppiumDriver driver) {
        super.initializePageObject(driver);
        PageFactory.initElements(driver, this);
    }

    /**
     * Check if intro card is visible (first app launch or no eligible stories)
     */
    public boolean isIntroCardVisible() {
        try {
            WebElement introCard = findElementByValueKey(INTRO_CARD);
            return introCard != null && introCard.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if story title is present in intro
     */
    public boolean isStoryTitlePresent() {
        try {
            WebElement title = findElementByValueKey(INTRO_TITLE);
            return title != null && !title.getText().isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if welcome message is displayed
     */
    public boolean isWelcomeMessagePresent() {
        try {
            WebElement message = findElementByValueKey(INTRO_MESSAGE);
            return message != null && message.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get intro message text (for validation of specific messages)
     */
    public String getIntroMessage() {
        try {
            WebElement message = findElementByValueKey(INTRO_MESSAGE);
            return message != null ? message.getText() : "";
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Check if dashboard is displayed (after closing stories)
     */
    public boolean isDashboardDisplayed() {
        // This would check for dashboard-specific elements
        try {
            Thread.sleep(500); // Wait for transition
            // Check if story view is gone
            return !isStoryViewDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if story view is currently displayed
     */
    private boolean isStoryViewDisplayed() {
        try {
            WebElement storyView = findElementByValueKey("story_carousel_container");
            return storyView != null && storyView.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if Year In Review entry point is visible on dashboard
     */
    public boolean isEntryPointVisible() {
        try {
            WebElement entryPoint = findElementByValueKey(ENTRY_POINT);
            return entryPoint != null && entryPoint.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if completion ring indicator is visible
     */
    public boolean isCompletionRingVisible() {
        try {
            WebElement ring = findElementByValueKey(COMPLETION_RING);
            return ring != null && ring.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get the current color of the completion ring
     */
    public String getEntryPointRingColor() {
        try {
            WebElement ring = findElementByValueKey(COMPLETION_RING);
            if (ring != null) {
                // Extract color from element's computed style
                String color = ring.getAttribute("fill");
                if (color != null) {
                    return color.toLowerCase();
                }
                // Fallback to semantic color if available
                String semanticColor = ring.getAttribute("semantic_color");
                return semanticColor != null ? semanticColor.toLowerCase() : "unknown";
            }
            return "unknown";
        } catch (Exception e) {
            return "unknown";
        }
    }

    /**
     * Click on Year In Review entry point to start viewing stories
     */
    public void clickEntryPoint() {
        try {
            WebElement entryPoint = findElementByValueKey(ENTRY_POINT);
            if (entryPoint != null) {
                entryPoint.click();
                Thread.sleep(500); // Wait for transition to story view
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to click entry point: " + e.getMessage());
        }
    }

    /**
     * Scroll to Year In Review entry point on dashboard
     */
    public void scrollToEntryPoint() {
        try {
            scrollToElement(ENTRY_POINT);
        } catch (Exception e) {
            throw new RuntimeException("Failed to scroll to entry point: " + e.getMessage());
        }
    }
}
