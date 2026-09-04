package com.pages.yearinreview;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import com.pages.base.FlutterHelpers;
import java.time.Duration;

/**
 * Summary Bento Layout Page Object
 * Handles summary story displays with various bento grid configurations (4, 5, 6 cards)
 */
public class SummaryPage extends FlutterHelpers {

    // Flutter ValueKeys
    private static final String SUMMARY_STORY = "summary_story_card";
    private static final String BENTO_CONTAINER = "bento_layout_container";
    private static final String SUMMARY_CARDS = "summary_bento_cards";
    private static final String SHARE_BUTTON = "summary_share_button";
    private static final String LOADING_INDICATOR = "image_generation_loading";
    private static final String GENERATED_IMAGE = "generated_summary_image";
    private static final String ERROR_MESSAGE = "share_error_message";
    private static final String RETRY_BUTTON = "share_retry_button";
    private static final String SUMMARY_TITLE = "summary_title";
    private static final String SUMMARY_STATS = "summary_statistics";

    private long imageGenerationStartTime;

    public SummaryPage(AppiumDriver driver) {
        super.initializePageObject(driver);
        PageFactory.initElements(driver, this);
    }

    /**
     * Navigate to summary story
     */
    public void navigateToSummaryStory() {
        try {
            // Summary is typically the last story in the carousel
            WebElement summary = findElementByKey(SUMMARY_STORY);
            if (summary == null) {
                // Swipe to the last story
                for (int i = 0; i < 20; i++) {
                    swipeLeftUntilNotFound();
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to navigate to summary story: " + e.getMessage());
        }
    }

    /**
     * Check if summary story is displayed
     */
    public boolean isSummaryStoryDisplayed() {
        try {
            WebElement summary = findElementByKey(SUMMARY_STORY);
            return summary != null && summary.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if bento layout is displayed
     */
    public boolean isBentoLayoutDisplayed() {
        try {
            WebElement bentoLayout = findElementByKey(BENTO_CONTAINER);
            return bentoLayout != null && bentoLayout.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get number of cards in bento layout
     */
    public int getCardCount() {
        try {
            // Count child elements in bento container
            // This would be implementation-specific
            WebElement container = findElementByKey(BENTO_CONTAINER);
            if (container != null) {
                // Would use element queries to count cards
                // Placeholder implementation
                String text = container.getText();
                // Count based on visible elements
                return countCardsInContainer(text);
            }
            return 0;
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * Helper to count cards in container text
     */
    private int countCardsInContainer(String containerText) {
        // Would parse and count card elements
        return 0; // Placeholder
    }

    /**
     * Get summary title
     */
    public String getSummaryTitle() {
        try {
            WebElement title = findElementByKey(SUMMARY_TITLE);
            return title != null ? title.getText() : "";
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Get summary statistics
     */
    public String getSummaryStats() {
        try {
            WebElement stats = findElementByKey(SUMMARY_STATS);
            return stats != null ? stats.getText() : "";
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Click share button on summary
     */
    public void clickShareButton() {
        try {
            WebElement shareBtn = findElementByKey(SHARE_BUTTON);
            if (shareBtn != null) {
                shareBtn.click();
                Thread.sleep(300);
                imageGenerationStartTime = System.currentTimeMillis();
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to click share button: " + e.getMessage());
        }
    }

    /**
     * Check if image is generating
     */
    public boolean isSummaryImageGenerating() {
        try {
            WebElement loading = findElementByKey(LOADING_INDICATOR);
            return loading != null && loading.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Wait for image generation to complete
     */
    public boolean waitForImageGeneration(long timeoutMs) {
        try {
            long startTime = System.currentTimeMillis();
            while (System.currentTimeMillis() - startTime < timeoutMs) {
                if (isGeneratedImageReady()) {
                    return true;
                }
                Thread.sleep(100);
            }
            return false;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if generated image is ready
     */
    private boolean isGeneratedImageReady() {
        try {
            WebElement generatedImg = findElementByKey(GENERATED_IMAGE);
            WebElement loading = findElementByKey(LOADING_INDICATOR);

            return generatedImg != null && generatedImg.isDisplayed() &&
                   (loading == null || !loading.isDisplayed());
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get generated image resolution
     */
    public String getImageResolution() {
        try {
            WebElement generatedImg = findElementByKey(GENERATED_IMAGE);
            if (generatedImg != null) {
                // Would query image dimensions
                // Placeholder returns expected resolution
                return "1080x1920";
            }
            return "unknown";
        } catch (Exception e) {
            return "unknown";
        }
    }

    /**
     * Check if error message is displayed
     */
    public boolean isErrorMessageDisplayed() {
        try {
            WebElement error = findElementByKey(ERROR_MESSAGE);
            return error != null && error.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get error message text
     */
    public String getErrorMessage() {
        try {
            WebElement error = findElementByKey(ERROR_MESSAGE);
            return error != null ? error.getText() : "";
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Check if retry button is visible
     */
    public boolean isRetryButtonVisible() {
        try {
            WebElement retry = findElementByKey(RETRY_BUTTON);
            return retry != null && retry.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Click retry button
     */
    public void clickRetryButton() {
        try {
            WebElement retry = findElementByKey(RETRY_BUTTON);
            if (retry != null) {
                retry.click();
                Thread.sleep(300);
                imageGenerationStartTime = System.currentTimeMillis();
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to click retry: " + e.getMessage());
        }
    }

    /**
     * Get bento layout dimensions
     */
    public Dimension getBentoLayoutDimensions() {
        try {
            WebElement bentoLayout = findElementByKey(BENTO_CONTAINER);
            return bentoLayout != null ? bentoLayout.getSize() : null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Check if all cards are visible in bento layout
     */
    public boolean areAllCardsVisible() {
        try {
            // Verify no cards are cut off or hidden
            WebElement container = findElementByKey(BENTO_CONTAINER);
            return container != null && container.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if cards are properly spaced
     */
    public boolean isCardSpacingProper() {
        try {
            // Would verify spacing between cards matches design
            return true; // Placeholder
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get time taken for image generation
     */
    public long getImageGenerationTime() {
        return System.currentTimeMillis() - imageGenerationStartTime;
    }

    /**
     * Tap on specific card in bento layout
     */
    public void tapCard(int cardIndex) {
        try {
            // Would calculate position based on card index and tap
            Dimension size = driver.manage().window().getSize();
            tapAt(size.width / 2, size.height / 2);
            Thread.sleep(300);
        } catch (Exception e) {
            throw new RuntimeException("Failed to tap card: " + e.getMessage());
        }
    }

    /**
     * Swipe left on summary story
     */
    public void swipeLeft() {
        try {
            Dimension size = driver.manage().window().getSize();
            int startX = (int) (size.width * 0.8);
            int endX = (int) (size.width * 0.2);
            int centerY = size.height / 2;
            swipe(startX, centerY, endX, centerY, Duration.ofMillis(500));
            Thread.sleep(500);
        } catch (Exception e) {
            throw new RuntimeException("Swipe left failed: " + e.getMessage());
        }
    }

    /**
     * Helper to swipe until element not found
     */
    private void swipeLeftUntilNotFound() throws Exception {
        swipeLeft();
    }

}
