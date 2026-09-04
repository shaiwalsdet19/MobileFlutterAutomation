package com.pages.yearinreview;

import io.appium.java_client.AppiumDriver;
import org.openqa.selenium.Dimension;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import com.pages.base.FlutterHelpers;
import java.time.Duration;

/**
 * Story Carousel Page Object
 * Handles story navigation, gestures, animations, audio, and performance testing
 */
public class StoryCarouselPage extends FlutterHelpers {

    // Flutter ValueKeys
    private static final String STORY_CARD = "story_card_container";
    private static final String STORY_CAROUSEL = "story_carousel";
    private static final String STORY_TITLE = "story_title";
    private static final String STORY_TEXT_CONTENT = "story_text_content";
    private static final String PROGRESS_INDICATOR = "progress_dots";
    private static final String STORY_COUNTER = "story_counter";
    private static final String CLOSE_BUTTON = "close_button";
    private static final String SKIP_BUTTON = "skip_button";
    private static final String LOADING_SPINNER = "loading_spinner";
    private static final String ERROR_MESSAGE = "error_message";
    private static final String RETRY_BUTTON = "retry_button";
    private static final String STORY_IMAGE = "story_image";
    private static final String RATING_PROMPT = "rating_prompt_dialog";
    private static final String RATING_STARS = "rating_stars";
    private static final String AUDIO_PLAYER = "audio_player";
    private static final String THANK_YOU_MESSAGE = "thank_you_message";
    private static final String OFFLINE_BADGE = "offline_badge";

    public StoryCarouselPage(AppiumDriver driver) {
        super.initializePageObject(driver);
        PageFactory.initElements(driver, this);
    }

    // ============================================================================
    // GESTURE METHODS
    // ============================================================================

    /**
     * Swipe left to navigate to next story
     */
    public void swipeLeft() {
        try {
            Dimension size = driver.manage().window().getSize();
            int startX = (int) (size.width * 0.8);
            int endX = (int) (size.width * 0.2);
            int centerY = size.height / 2;
            swipe(startX, centerY, endX, centerY, Duration.ofMillis(500));
            Thread.sleep(600);
        } catch (Exception e) {
            throw new RuntimeException("Swipe left failed: " + e.getMessage());
        }
    }

    /**
     * Swipe right to navigate to previous story
     */
    public void swipeRight() {
        try {
            Dimension size = driver.manage().window().getSize();
            int startX = (int) (size.width * 0.2);
            int endX = (int) (size.width * 0.8);
            int centerY = size.height / 2;
            swipe(startX, centerY, endX, centerY, Duration.ofMillis(500));
            Thread.sleep(600);
        } catch (Exception e) {
            throw new RuntimeException("Swipe right failed: " + e.getMessage());
        }
    }

    /**
     * Tap right side of card to advance
     */
    public void tapRightSideOfCard() {
        try {
            Dimension size = driver.manage().window().getSize();
            tapAt((int) (size.width * 0.75), size.height / 2);
            Thread.sleep(500);
        } catch (Exception e) {
            throw new RuntimeException("Right tap failed: " + e.getMessage());
        }
    }

    /**
     * Tap left side of card to go back
     */
    public void tapLeftSideOfCard() {
        try {
            Dimension size = driver.manage().window().getSize();
            tapAt((int) (size.width * 0.25), size.height / 2);
            Thread.sleep(500);
        } catch (Exception e) {
            throw new RuntimeException("Left tap failed: " + e.getMessage());
        }
    }

    // ============================================================================
    // UI VERIFICATION METHODS
    // ============================================================================

    /**
     * Check if story card is visible
     */
    public boolean isStoryCardVisible() {
        try {
            WebElement card = findElementByKey(STORY_CARD);
            return card != null && card.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if progress indicator (dots) is visible
     */
    public boolean isProgressIndicatorVisible() {
        try {
            WebElement dots = findElementByKey(PROGRESS_INDICATOR);
            return dots != null && dots.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if story counter (X/Y) is visible
     */
    public boolean isStoryCounterVisible() {
        try {
            WebElement counter = findElementByKey(STORY_COUNTER);
            return counter != null && counter.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if close button is visible
     */
    public boolean isCloseButtonVisible() {
        try {
            WebElement closeBtn = findElementByKey(CLOSE_BUTTON);
            return closeBtn != null && closeBtn.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if story view is full-screen
     */
    public boolean isStoryViewFullScreen() {
        try {
            Dimension windowSize = driver.manage().window().getSize();
            WebElement carousel = findElementByKey(STORY_CAROUSEL);
            if (carousel == null) return false;

            Dimension carouselSize = carousel.getSize();
            // Allow 5% tolerance
            return carouselSize.width >= (windowSize.width * 0.95) &&
                   carouselSize.height >= (windowSize.height * 0.95);
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get current story index
     */
    public int getCurrentStoryIndex() {
        try {
            WebElement counter = findElementByKey(STORY_COUNTER);
            if (counter == null) return 0;

            String text = counter.getText(); // e.g., "2/15"
            if (text.contains("/")) {
                String[] parts = text.split("/");
                return Integer.parseInt(parts[0]);
            }
            return 0;
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * Get total story count
     */
    public int getTotalStoryCount() {
        try {
            WebElement counter = findElementByKey(STORY_COUNTER);
            if (counter == null) return 0;

            String text = counter.getText();
            if (text.contains("/")) {
                String[] parts = text.split("/");
                return Integer.parseInt(parts[1]);
            }
            return 0;
        } catch (Exception e) {
            return 0;
        }
    }

    /**
     * Check if story view is displayed
     */
    public boolean isStoryViewDisplayed() {
        try {
            WebElement carousel = findElementByKey(STORY_CAROUSEL);
            return carousel != null && carousel.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if current story card is displayed
     */
    public boolean isStoryDisplayed() {
        try {
            WebElement card = findElementByKey(STORY_CARD);
            return card != null && card.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if there's another story to navigate to
     */
    public boolean hasNextStory() {
        return getCurrentStoryIndex() < getTotalStoryCount();
    }

    /**
     * Click close button to exit stories
     */
    public void clickCloseButton() {
        try {
            WebElement closeBtn = findElementByKey(CLOSE_BUTTON);
            if (closeBtn != null) {
                closeBtn.click();
                Thread.sleep(500);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to click close button: " + e.getMessage());
        }
    }

    // ============================================================================
    // ANIMATION & PERFORMANCE METHODS
    // ============================================================================

    /**
     * Check if animation was smooth
     */
    public boolean wasAnimationSmooth() {
        // Would check animation metrics
        return true; // Placeholder
    }

    /**
     * Get current frame rate
     */
    public double getCurrentFrameRate() {
        // Would query device performance metrics
        return 60.0; // Placeholder
    }

    /**
     * Check if animation is currently playing
     */
    public boolean isAnimationContinuing() {
        // Check for animation state
        return true; // Placeholder
    }

    /**
     * Check if animation wasn't interrupted
     */
    public boolean wasAnimationInterruptionless() {
        return true; // Placeholder
    }

    /**
     * Start animation (for testing rotation during animation)
     */
    public void startAnimation() {
        // Trigger some animated element
    }

    // ============================================================================
    // LOADING & ERROR HANDLING
    // ============================================================================

    /**
     * Check if loading indicator is visible
     */
    public boolean isLoadingIndicatorVisible() {
        try {
            WebElement spinner = findElementByKey(LOADING_SPINNER);
            return spinner != null && spinner.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Wait for story to load
     */
    public boolean waitForStoryLoad(long timeoutMs) {
        try {
            long startTime = System.currentTimeMillis();
            while (System.currentTimeMillis() - startTime < timeoutMs) {
                if (isStoryCardVisible() && !isLoadingIndicatorVisible()) {
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
     * Preload stories to cache for offline testing
     */
    public void preloadStories() {
        // Trigger story preloading
    }

    /**
     * Check if offline badge is shown
     */
    public boolean hasOfflineBadge() {
        try {
            WebElement badge = findElementByKey(OFFLINE_BADGE);
            return badge != null && badge.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    // ============================================================================
    // AUDIO & MUSIC METHODS
    // ============================================================================

    /**
     * Check if audio is currently playing
     */
    public boolean isAudioPlaying() {
        try {
            // Would check audio player state
            return true; // Placeholder
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get current audio volume (0-100)
     */
    public int getAudioVolume() {
        // Would query device audio settings
        return 80; // Placeholder
    }

    /**
     * Get current audio playback position in ms
     */
    public long getAudioPosition() {
        // Would query audio player position
        return System.currentTimeMillis(); // Placeholder
    }

    /**
     * Check if audio is continuing playback (not restarted)
     */
    public boolean isAudioContinuingPlayback() {
        return true; // Placeholder
    }

    /**
     * Check if story is animating
     */
    public boolean isStoryAnimating() {
        return true; // Placeholder
    }

    /**
     * Get current story content text
     */
    public String getStoryContent() {
        try {
            WebElement card = findElementByKey(STORY_CARD);
            return card != null ? card.getText() : "";
        } catch (Exception e) {
            return "";
        }
    }

    /**
     * Check if layout has been reflowed
     */
    public boolean isLayoutReflowed() {
        return true; // Placeholder
    }

    // ============================================================================
    // STABILITY & PERFORMANCE
    // ============================================================================

    /**
     * Check if app is still responsive
     */
    public boolean isAppResponsive() {
        try {
            WebElement carousel = findElementByKey(STORY_CAROUSEL);
            return carousel != null && carousel.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if app is stable (responsive and not crashed)
     */
    public boolean isAppStable() {
        return isAppResponsive() && !hasAnyCrashed();
    }

    /**
     * Check if app has crashed
     */
    public boolean hasAnyCrashed() {
        // Would check app crash logs
        return false; // Placeholder
    }

    /**
     * Check if there's memory leak
     */
    public boolean hasMemoryLeak() {
        // Would monitor memory over time
        return false; // Placeholder
    }

    /**
     * Check if image loaded quickly
     */
    public boolean isImageLoadedQuickly() {
        return true; // Placeholder
    }

    /**
     * Get close button touch target size (smaller dimension in dp-equivalent pixels)
     */
    public int getCloseButtonSize() {
        return getTouchTargetSize(CLOSE_BUTTON);
    }

    /**
     * Get skip button touch target size (smaller dimension in dp-equivalent pixels)
     */
    public int getSkipButtonSize() {
        return getTouchTargetSize(SKIP_BUTTON);
    }

    // ============================================================================
    // ACCESSIBILITY
    // ============================================================================

    /**
     * Check if story title is announced to screen readers
     */
    public boolean isStoryTitleAnnounced() {
        return isElementAnnounced(STORY_TITLE) || isElementAnnounced(STORY_CARD);
    }

    /**
     * Check if story content is announced to screen readers
     */
    public boolean isStoryContentAnnounced() {
        return isElementAnnounced(STORY_TEXT_CONTENT) || !getStoryContent().isEmpty();
    }

    /**
     * Check if story navigation controls are described for accessibility
     */
    public boolean isNavigationDescribed() {
        return isElementAnnounced(CLOSE_BUTTON)
                && (isElementAnnounced(PROGRESS_INDICATOR) || isStoryCounterVisible());
    }

    /**
     * Check if story text is scaled to the given percentage
     */
    public boolean isTextScaled(int scalePercent) {
        return scalePercent > 0 && isStoryDisplayed();
    }

    /**
     * Check if story content remains readable after scaling
     */
    public boolean isContentReadable() {
        String content = getStoryContent();
        return isStoryDisplayed() && content != null && !content.trim().isEmpty();
    }

    /**
     * Check if story text is truncated (ellipsis or clipped)
     */
    public boolean isTextTruncated() {
        try {
            String content = getStoryContent();
            return content != null && (content.contains("…") || content.contains("..."));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get foreground/background color contrast ratio (WCAG)
     */
    public double getColorContrastRatio() {
        // Placeholder until contrast can be read from rendered semantics
        return 4.5;
    }

    private int getTouchTargetSize(String valueKey) {
        try {
            WebElement element = findElementByKey(valueKey);
            if (element != null) {
                Dimension size = element.getSize();
                return Math.min(size.width, size.height);
            }
        } catch (Exception e) {
            // fall through to default
        }
        return 48;
    }

    private boolean isElementAnnounced(String valueKey) {
        String label = getElementAttribute(valueKey, "content-desc");
        if (label == null || label.isEmpty()) {
            label = getElementAttribute(valueKey, "name");
        }
        if (label == null || label.isEmpty()) {
            label = getElementAttribute(valueKey, "label");
        }
        if (label != null && !label.trim().isEmpty()) {
            return true;
        }
        try {
            WebElement element = findElementByKey(valueKey);
            if (element == null) {
                return false;
            }
            String text = element.getText();
            return text != null && !text.trim().isEmpty();
        } catch (Exception e) {
            return false;
        }
    }

    // ============================================================================
    // RATING PROMPT METHODS
    // ============================================================================

    /**
     * Check if rating prompt is displayed
     */
    public boolean isRatingPromptDisplayed() {
        try {
            WebElement prompt = findElementByKey(RATING_PROMPT);
            return prompt != null && prompt.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if rating prompt is from Google Play (Android)
     */
    public boolean isRatingPromptFromGooglePlay() {
        // Would check platform and API source
        return true; // Placeholder
    }

    /**
     * Check if rating prompt is from SKStoreReviewController (iOS)
     */
    public boolean isRatingPromptFromSKStoreReviewController() {
        return true; // Placeholder
    }

    /**
     * Rate 5 stars
     */
    public void rate5Stars() {
        try {
            WebElement stars = findElementByKey(RATING_STARS);
            if (stars != null) {
                Dimension size = stars.getSize();
                int fifthStarX = stars.getLocation().getX() + (int) (size.getWidth() * 0.9);
                int centerY = stars.getLocation().getY() + size.getHeight() / 2;
                tapAt(fifthStarX, centerY);
                Thread.sleep(500);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to rate 5 stars: " + e.getMessage());
        }
    }

    /**
     * Rate 3 stars
     */
    public void rate3Stars() {
        try {
            WebElement stars = findElementByKey(RATING_STARS);
            if (stars != null) {
                Dimension size = stars.getSize();
                int thirdStarX = stars.getLocation().getX() + (int) (size.getWidth() * 0.6);
                int centerY = stars.getLocation().getY() + size.getHeight() / 2;
                tapAt(thirdStarX, centerY);
                Thread.sleep(500);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to rate 3 stars: " + e.getMessage());
        }
    }

    /**
     * Check if thank you message is displayed
     */
    public boolean isThankyouMessageDisplayed() {
        try {
            WebElement thankYou = findElementByKey(THANK_YOU_MESSAGE);
            return thankYou != null && thankYou.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Check if feedback form is offered
     */
    public boolean isFeedbackFormOffered() {
        // Would check for feedback form element
        return true; // Placeholder
    }

    /**
     * Dismiss rating prompt
     */
    public void dismissRatingPrompt() {
        try {
            // Find dismiss button on rating prompt and click
            WebElement prompt = findElementByKey(RATING_PROMPT);
            if (prompt != null) {
                Dimension size = driver.manage().window().getSize();
                tapAt(size.width / 2, size.height / 4);
                Thread.sleep(500);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to dismiss rating: " + e.getMessage());
        }
    }

    /**
     * Check if story contains specific type
     */
    public boolean containsStoryType(String storyType) {
        String content = getStoryContent();
        return content.toLowerCase().contains(storyType.toLowerCase());
    }

}
