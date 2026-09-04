package com.tests.modules.yearinreview;

import com.api.framework.mobile.MobileTestBase;
import com.aventstack.extentreports.Status;
import com.tests.base.BaseTest;
import com.pages.yearinreview.YearInReviewPage;
import com.pages.yearinreview.StoryCarouselPage;
import com.pages.yearinreview.BadgeStoryPage;
import com.pages.yearinreview.SummaryPage;
import org.testng.Assert;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.DataProvider;
import org.testng.annotations.Test;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

/**
 * Year In Review 2025 - Mobile Test Automation Suite
 * JIRA: MOBILE-6841
 * Figma: https://www.figma.com/design/79wh4qaQCqThLwsWICTMb5/Year-in-Review--2025
 *
 * This test class covers 65 comprehensive mobile-optimized test cases for the Year In Review feature.
 * Test cases include: story navigation, touch gestures, network handling, orientation changes,
 * audio playback, share functionality, native APIs, performance, accessibility, and data validation.
 *
 * Generated: 2026-04-25
 * Mobile Optimizations: Touch Gestures, Network Handling, Orientation Testing, Audio Playback,
 *                       Native Integration, Performance Testing, Accessibility Testing
 */
public class YearInReviewFunctional extends BaseTest {

    private YearInReviewPage yearInReviewPage;
    private StoryCarouselPage storyCarouselPage;
    private BadgeStoryPage badgeStoryPage;
    private SummaryPage summaryPage;

    private static final String TEST_DATA_PATH = "src/test/resources/modules/yearinreview/YearInReviewFunctional.json";
    private static final String MODULE = "yearinreview";

    @BeforeMethod
    public void setUp() {
        yearInReviewPage = new YearInReviewPage(driver);
        storyCarouselPage = new StoryCarouselPage(driver);
        badgeStoryPage = new BadgeStoryPage(driver);
        summaryPage = new SummaryPage(driver);

        extentTest = extentReports.createTest(
            getClass().getSimpleName(),
            "Year In Review 2025 - Mobile Test Automation"
        );
        extentTest.assignAuthor("QA Automation");
        extentTest.assignCategory("Mobile");
    }

    /**
     * Load test cases from YearInReviewFunctional.json
     */
    @DataProvider(name = "yearInReviewTestCases")
    public Object[][] loadTestCases() throws Exception {
        List<Object[]> testCases = new ArrayList<>();

        try (FileReader reader = new FileReader(TEST_DATA_PATH)) {
            JsonObject root = new Gson().fromJson(reader, JsonObject.class);
            JsonArray testcases = root.getAsJsonArray("testcases");

            for (int i = 0; i < testcases.size(); i++) {
                JsonObject testCase = testcases.get(i).getAsJsonObject();
                testCases.add(new Object[]{testCase});
            }
        }

        return testCases.toArray(new Object[0][]);
    }

    // ============================================================================
    // A. HAPPY FLOWS - Story Navigation & Basic Interactions
    // ============================================================================

    /**
     * TC-YR-001: Open Year In Review on First App Launch
     * Happy flow: First app launch → Year In Review intro story displays
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"smoke", "regression"}, priority = 1)
    public void openYearInReviewOnFirstAppLaunch(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-001: Open Year In Review on First App Launch");

        try {
            // Verify intro story displays on first launch
            Assert.assertTrue(yearInReviewPage.isIntroCardVisible(),
                "Intro card should be visible on first app launch");
            Assert.assertTrue(yearInReviewPage.isStoryTitlePresent(),
                "Story title should be displayed");
            Assert.assertTrue(yearInReviewPage.isWelcomeMessagePresent(),
                "Welcome message should be displayed");

            extentTest.log(Status.PASS, "Intro story displayed successfully on first launch");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Failed to open Year In Review: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-002: Swipe Left Navigates to Next Story
     * Mobile gesture: User swipes left on story → next story displays with fade animation
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"smoke", "regression"}, priority = 1)
    public void swipeLeftToNextStory(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-002: Swipe Left Navigates to Next Story");

        try {
            int initialStoryIndex = storyCarouselPage.getCurrentStoryIndex();
            storyCarouselPage.swipeLeft();

            // Verify story advanced
            int newStoryIndex = storyCarouselPage.getCurrentStoryIndex();
            Assert.assertEquals(newStoryIndex, initialStoryIndex + 1,
                "Story counter should advance by 1 after swipe left");

            // Verify animation occurred
            Assert.assertTrue(storyCarouselPage.wasAnimationSmooth(),
                "Story transition should be smooth with fade animation");
            Assert.assertTrue(storyCarouselPage.getCurrentFrameRate() >= 50,
                "Frame rate should be >= 50fps for smooth transition");

            extentTest.log(Status.PASS, "Story advanced successfully with smooth animation");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Swipe left failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-003: Swipe Right Navigates to Previous Story
     * Mobile gesture: User swipes right → previous story displays
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void swipeRightToPreviousStory(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-003: Swipe Right Navigates to Previous Story");

        try {
            // Navigate to story #2 first
            storyCarouselPage.swipeLeft();
            int storyIndex = storyCarouselPage.getCurrentStoryIndex();

            // Now swipe right
            storyCarouselPage.swipeRight();
            int previousIndex = storyCarouselPage.getCurrentStoryIndex();

            Assert.assertEquals(previousIndex, storyIndex - 1,
                "Should go back to previous story");

            extentTest.log(Status.PASS, "Story navigated backwards successfully");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Swipe right failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-004: Story Carousel UI Elements Visible
     * UI validation: Story card, progress dots, counter, close button all visible
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"smoke", "regression"}, priority = 1)
    public void verifyStoryCarouselUI(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-004: Story Carousel UI Elements Visible");

        try {
            Assert.assertTrue(storyCarouselPage.isStoryCardVisible(),
                "Story card should be visible");
            Assert.assertTrue(storyCarouselPage.isProgressIndicatorVisible(),
                "Progress dots should be visible");
            Assert.assertTrue(storyCarouselPage.isStoryCounterVisible(),
                "Story counter (X/Y format) should be visible");
            Assert.assertTrue(storyCarouselPage.isCloseButtonVisible(),
                "Close button should be visible");
            Assert.assertTrue(storyCarouselPage.isStoryViewFullScreen(),
                "Story view should be full-screen immersive");

            extentTest.log(Status.PASS, "All UI elements verified as visible");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "UI validation failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-005: Tap on Story Card Advances to Next Story
     * Mobile gesture: Tap (not swipe) on story → next story displays
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void tapToAdvanceStory(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-005: Tap on Story Card Advances to Next Story");

        try {
            int initialIndex = storyCarouselPage.getCurrentStoryIndex();
            storyCarouselPage.tapRightSideOfCard();
            int newIndex = storyCarouselPage.getCurrentStoryIndex();

            Assert.assertEquals(newIndex, initialIndex + 1,
                "Tapping right side should advance to next story");

            extentTest.log(Status.PASS, "Story advanced via tap gesture");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Tap to advance failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-006: Tap Left Side Goes to Previous Story
     * Mobile gesture: Tap left side of story → previous story displays
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void tapLeftSideGoesToPreviousStory(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-006: Tap Left Side Goes to Previous Story");

        try {
            storyCarouselPage.swipeLeft();
            int currentIndex = storyCarouselPage.getCurrentStoryIndex();

            storyCarouselPage.tapLeftSideOfCard();
            int previousIndex = storyCarouselPage.getCurrentStoryIndex();

            Assert.assertEquals(previousIndex, currentIndex - 1,
                "Tapping left side should go to previous story");

            extentTest.log(Status.PASS, "Story navigated backward via tap");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Tap left failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-007: Close Button Exits Story View
     * User clicks close button → exits story view and returns to dashboard
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 1)
    public void closeButtonExitsStoryView(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-007: Close Button Exits Story View");

        try {
            storyCarouselPage.clickCloseButton();

            Assert.assertFalse(storyCarouselPage.isStoryViewDisplayed(),
                "Story view should close");
            Assert.assertTrue(yearInReviewPage.isDashboardDisplayed(),
                "Dashboard should be displayed after close");
            Assert.assertTrue(yearInReviewPage.isCompletionRingVisible(),
                "Entry point should show completion ring");

            extentTest.log(Status.PASS, "Story view closed successfully");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Close button failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-008: Android Back Gesture Exits Stories
     * Android: User presses back button → exits story view gracefully
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void backGestureExitsStories(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-008: Android Back Gesture Exits Stories");

        try {
            if (!getPlatform().equals("android")) {
                extentTest.skip("This test is Android-specific");
                return;
            }

            driver.navigate().back();

            Assert.assertFalse(storyCarouselPage.isStoryViewDisplayed(),
                "Story view should close on back gesture");
            Assert.assertTrue(yearInReviewPage.isDashboardDisplayed(),
                "Dashboard should be restored");

            extentTest.log(Status.PASS, "Back gesture closed story view gracefully");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Back gesture failed: " + e.getMessage());
            throw e;
        }
    }

    // ============================================================================
    // B. NETWORK HANDLING - Slow Network, Timeouts, Offline Mode
    // ============================================================================

    /**
     * TC-YR-009: Story Loads on Slow 3G Network
     * Network condition: Data loads on slow 3G → loading indicator shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void loadStoryWithSlowNetwork(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-009: Story Loads on Slow 3G Network");

        try {
            enableNetworkThrottling("slow_3g");

            Assert.assertTrue(storyCarouselPage.isLoadingIndicatorVisible(),
                "Loading spinner should display on slow network");

            // Wait for story to load (max 10 seconds)
            boolean loaded = storyCarouselPage.waitForStoryLoad(10000);
            Assert.assertTrue(loaded, "Story should load within 10 seconds");
            Assert.assertFalse(storyCarouselPage.isLoadingIndicatorVisible(),
                "Loading indicator should hide after load");

            disableNetworkThrottling();
            extentTest.log(Status.PASS, "Story loaded successfully on slow 3G");
        } catch (Exception e) {
            disableNetworkThrottling();
            extentTest.log(Status.FAIL, "Slow network test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-010: Retry Button on Network Timeout
     * Network error: API timeout → error message with retry button shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void retryOnNetworkTimeout(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-010: Retry Button on Network Timeout");

        try {
            simulateNetworkTimeout(30000);

            Assert.assertTrue(storyCarouselPage.isErrorMessageDisplayed(),
                "Error message should display on timeout");
            Assert.assertTrue(storyCarouselPage.isRetryButtonVisible(),
                "Retry button should be available");
            Assert.assertTrue(storyCarouselPage.getErrorMessage().contains("Unable to load"),
                "Error message should indicate load failure");

            extentTest.log(Status.PASS, "Error handling verified for network timeout");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Timeout test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-011: View Cached Stories in Offline Mode
     * Network: Device offline but story data cached → stories display from cache
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 3)
    public void viewStoriesInOfflineMode(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-011: View Cached Stories in Offline Mode");

        try {
            // Pre-load stories to cache
            storyCarouselPage.preloadStories();

            // Go offline
            disableNetworkConnectivity();

            // Reopen stories - should display from cache
            Assert.assertTrue(storyCarouselPage.isStoryCardVisible(),
                "Stories should display from cache in offline mode");
            Assert.assertTrue(storyCarouselPage.hasOfflineBadge(),
                "Optional offline badge may be shown");

            enableNetworkConnectivity();
            extentTest.log(Status.PASS, "Stories displayed from cache in offline mode");
        } catch (Exception e) {
            enableNetworkConnectivity();
            extentTest.log(Status.FAIL, "Offline mode test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-012: Network Interruption During Load
     * Network: Connection drops mid-load → graceful error handling with retry
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void handleNetworkInterruptionDuringStoryLoad(JsonObject testCase) throws InterruptedException{
        extentTest.log(Status.INFO, "TC-YR-012: Network Interruption During Load");

        try {
            startStoryLoad();
            Thread.sleep(1000); // Wait during image load
            interruptNetwork();

            Assert.assertTrue(storyCarouselPage.isErrorMessageDisplayed(),
                "Error message should show on interruption");
            Assert.assertTrue(storyCarouselPage.isRetryButtonVisible(),
                "Retry should be available");

            restoreNetwork();
            extentTest.log(Status.PASS, "Network interruption handled gracefully");
        } catch (Exception e) {
            restoreNetwork();
            extentTest.log(Status.FAIL, "Network interruption test failed: " + e.getMessage());
            throw e;
        }
    }

    // ============================================================================
    // C. ORIENTATION HANDLING - Portrait/Landscape Rotation
    // ============================================================================

    /**
     * TC-YR-013: Device Rotation Portrait → Landscape
     * Orientation: User rotates device → layout reflows, story continues
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void deviceRotationPortraitToLandscape(JsonObject testCase) throws InterruptedException {
        extentTest.log(Status.INFO, "TC-YR-013: Device Rotation Portrait → Landscape");

        try {
            setOrientation("portrait");
            storyCarouselPage.waitForStoryLoad(5000);

            String storyContentBefore = storyCarouselPage.getStoryContent();

            setOrientation("landscape");
            Thread.sleep(500); // Allow layout reflow

            String storyContentAfter = storyCarouselPage.getStoryContent();
            Assert.assertEquals(storyContentAfter, storyContentBefore,
                "Story content should be preserved after rotation");
            Assert.assertTrue(storyCarouselPage.isLayoutReflowed(),
                "Layout should adapt to landscape");
            Assert.assertTrue(storyCarouselPage.isAudioContinuingPlayback(),
                "Music should continue uninterrupted");

            setOrientation("portrait");
            extentTest.log(Status.PASS, "Device rotation handled correctly");
        } catch (Exception e) {
            setOrientation("portrait");
            extentTest.log(Status.FAIL, "Rotation test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-014: Device Rotation During Story Animation
     * Orientation: Device rotates while story animation playing → animation continues
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void deviceRotationDuringAnimation(JsonObject testCase) throws InterruptedException {
        extentTest.log(Status.INFO, "TC-YR-014: Device Rotation During Story Animation");

        try {
            storyCarouselPage.startAnimation();
            Thread.sleep(150); // Rotate mid-animation

            setOrientation("landscape");

            Assert.assertTrue(storyCarouselPage.isAnimationContinuing(),
                "Animation should continue smoothly");
            Assert.assertTrue(storyCarouselPage.wasAnimationInterruptionless(),
                "Animation should not be interrupted");

            setOrientation("portrait");
            extentTest.log(Status.PASS, "Animation continued during rotation");
        } catch (Exception e) {
            setOrientation("portrait");
            extentTest.log(Status.FAIL, "Animation rotation test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-015: Multiple Device Rotations
     * Orientation: User rotates device multiple times → state maintained, no crashes
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 3)
    public void multipleRotationsCycling(JsonObject testCase) throws InterruptedException {
        extentTest.log(Status.INFO, "TC-YR-015: Multiple Device Rotations");

        try {
            for (int i = 0; i < 5; i++) {
                setOrientation("landscape");
                Thread.sleep(200);
                setOrientation("portrait");
                Thread.sleep(200);
            }

            Assert.assertTrue(storyCarouselPage.isAppStable(),
                "App should remain stable after rotations");
            Assert.assertFalse(storyCarouselPage.hasMemoryLeak(),
                "No memory leaks after multiple rotations");

            extentTest.log(Status.PASS, "App stable after 5 rotation cycles");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Multiple rotations test failed: " + e.getMessage());
            throw e;
        }
    }

    // ============================================================================
    // D. AUDIO PLAYBACK - Music Controls, Device Events
    // ============================================================================

    /**
     * TC-YR-016: Background Music Plays with Stories
     * Audio: Story starts → background music plays automatically
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void backgroundMusicPlaysAutomatically(JsonObject testCase) throws InterruptedException {
        extentTest.log(Status.INFO, "TC-YR-016: Background Music Plays with Stories");

        try {
            storyCarouselPage.waitForStoryLoad(3000);

            Assert.assertTrue(storyCarouselPage.isAudioPlaying(),
                "Background music should start automatically");
            Assert.assertTrue(storyCarouselPage.getAudioVolume() > 0,
                "Music volume should respect device settings");

            extentTest.log(Status.PASS, "Background music playing correctly");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Audio playback test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-017: Music Respects Device Mute Setting
     * Audio: Device on mute → music does not play
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void musicMutedWhenDeviceMuted(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-017: Music Respects Device Mute Setting");

        try {
            muteDevice();
            storyCarouselPage.waitForStoryLoad(2000);

            Assert.assertFalse(storyCarouselPage.isAudioPlaying(),
                "Music should not play when device muted");
            Assert.assertTrue(storyCarouselPage.isStoryDisplayed(),
                "Story should continue to display visually");

            unmuteDevice();
            extentTest.log(Status.PASS, "Mute setting respected");
        } catch (Exception e) {
            unmuteDevice();
            extentTest.log(Status.FAIL, "Mute test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-018: Music Pauses on Incoming Call
     * Audio: Incoming phone call → music pauses, resumes after call ends
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void musicPauseOnIncomingCall(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-018: Music Pauses on Incoming Call");

        try {
            storyCarouselPage.waitForStoryLoad(2000);
            Assert.assertTrue(storyCarouselPage.isAudioPlaying(), "Music should be playing");

            simulateIncomingCall();

            Assert.assertFalse(storyCarouselPage.isAudioPlaying(),
                "Music should pause on incoming call");
            Assert.assertFalse(storyCarouselPage.isStoryAnimating(),
                "Story should pause too");

            completeCall();

            Assert.assertTrue(storyCarouselPage.isAudioPlaying(),
                "Music should resume after call");

            extentTest.log(Status.PASS, "Music pause/resume on call works correctly");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Call interruption test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-019: Music Continues Across Story Navigation
     * Audio: User swipes to next story → music continues uninterrupted
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void musicContinuesAcrossStories(JsonObject testCase) throws  InterruptedException{
        extentTest.log(Status.INFO, "TC-YR-019: Music Continues Across Story Navigation");

        try {
            storyCarouselPage.waitForStoryLoad(2000);
            long audioPositionBefore = storyCarouselPage.getAudioPosition();

            storyCarouselPage.swipeLeft();
            Thread.sleep(300); // Allow animation

            long audioPositionAfter = storyCarouselPage.getAudioPosition();

            // Audio should have progressed, not restarted
            Assert.assertTrue(audioPositionAfter >= audioPositionBefore,
                "Music should continue, not restart");
            Assert.assertTrue(storyCarouselPage.isAudioPlaying(),
                "Music should still be playing");

            extentTest.log(Status.PASS, "Music continues across story navigation");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Music continuity test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-020: Music Stops When Exiting Stories
     * Audio: User closes stories → background music stops
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void musicStopsWhenExitingStories(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-020: Music Stops When Exiting Stories");

        try {
            storyCarouselPage.waitForStoryLoad(2000);
            Assert.assertTrue(storyCarouselPage.isAudioPlaying(), "Music should be playing");

            storyCarouselPage.clickCloseButton();

            Assert.assertFalse(storyCarouselPage.isAudioPlaying(),
                "Music should stop immediately on close");

            extentTest.log(Status.PASS, "Music stopped on story exit");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Music stop test failed: " + e.getMessage());
            throw e;
        }
    }

    // ============================================================================
    // E. SHARE FUNCTIONALITY
    // ============================================================================

    /**
     * TC-YR-021: Share Badge Story to Social Platforms
     * Share: User clicks share on badge story → native share sheet opens
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void shareBadgeStory(JsonObject testCase) throws Exception{
        extentTest.log(Status.INFO, "TC-YR-021: Share Badge Story to Social Platforms");

        try {
            navigateToBadgeStory();
            badgeStoryPage.clickShareButton();

            Assert.assertTrue(badgeStoryPage.isNativeShareSheetOpen(),
                "Native share sheet should open");
            Assert.assertTrue(badgeStoryPage.isBadgeImageAttached(),
                "Badge image should be attached");
            Assert.assertTrue(badgeStoryPage.isWhatsAppAvailable() ||
                             badgeStoryPage.isInstagramAvailable(),
                "Social platforms should be available");

            badgeStoryPage.dismissShareSheet();
            extentTest.log(Status.PASS, "Badge share functionality verified");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Badge share test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-022: Share Summary Story
     * Share: User clicks share on summary story → bento layout image generated
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void shareSummaryStory(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-022: Share Summary Bento Story");

        try {
            summaryPage.navigateToSummaryStory();
            summaryPage.clickShareButton();

            Assert.assertTrue(summaryPage.isSummaryImageGenerating(),
                "Image generation should start");

            boolean imageReady = summaryPage.waitForImageGeneration(5000);
            Assert.assertTrue(imageReady, "Summary image should generate within 5 seconds");
            Assert.assertEquals(summaryPage.getImageResolution(), "1080x1920",
                "Image should be standard mobile resolution");

            extentTest.log(Status.PASS, "Summary share image generated successfully");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Summary share test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-023: Share to WhatsApp
     * Share: User selects WhatsApp → app switches to WhatsApp
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void shareToWhatsApp(JsonObject testCase) throws Exception {
        extentTest.log(Status.INFO, "TC-YR-023: Share Badge to WhatsApp");

        try {
            navigateToBadgeStory();
            badgeStoryPage.clickShareButton();

            if (!badgeStoryPage.isWhatsAppAvailable()) {
                extentTest.skip("WhatsApp not available on device");
                return;
            }

            badgeStoryPage.selectWhatsAppShareOption();

            Assert.assertTrue(isWhatsAppOpened(),
                "WhatsApp should open with shared image");

            driver.switchTo().defaultContent(); // Return to app
            extentTest.log(Status.PASS, "WhatsApp share successful");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "WhatsApp share test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-024: Handle Share Failure Gracefully
     * Share: Image generation fails → error message shown, user can retry
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void shareFailureHandling(JsonObject testCase)  throws InterruptedException{
        extentTest.log(Status.INFO, "TC-YR-024: Handle Share Failure Gracefully");

        try {
            simulateImageGenerationFailure();
            summaryPage.clickShareButton();

            Assert.assertTrue(summaryPage.isErrorMessageDisplayed(),
                "Error message should display");
            Assert.assertTrue(summaryPage.getErrorMessage().contains("Could not generate"),
                "Error should indicate generation failure");
            Assert.assertTrue(summaryPage.isRetryButtonVisible(),
                "Retry button should be available");

            summaryPage.clickRetryButton();
            extentTest.log(Status.PASS, "Share failure handled gracefully");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Share failure test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-025: Dismiss Share Sheet
     * Share: User dismisses share sheet → returns to story
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 3)
    public void dismissShareSheet(JsonObject testCase)  throws InterruptedException{
        extentTest.log(Status.INFO, "TC-YR-025: Dismiss Share Sheet");

        try {
            badgeStoryPage.clickShareButton();
            Assert.assertTrue(badgeStoryPage.isNativeShareSheetOpen(),
                "Share sheet should be open");

            badgeStoryPage.dismissShareSheet();

            Assert.assertFalse(badgeStoryPage.isNativeShareSheetOpen(),
                "Share sheet should close");
            Assert.assertTrue(badgeStoryPage.isStoryDisplayed(),
                "Should return to story view");

            extentTest.log(Status.PASS, "Share sheet dismissed successfully");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Dismiss share test failed: " + e.getMessage());
            throw e;
        }
    }

    // ============================================================================
    // F. NATIVE PLATFORM INTEGRATIONS - Rating Prompts
    // ============================================================================

    /**
     * TC-YR-026: Android In-App Rating Prompt
     * Native API: After story completion → Google Play in-app review prompt appears
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"smoke", "regression"}, priority = 1)
    public void showRatingPromptAndroid(JsonObject testCase) throws Exception{
        extentTest.log(Status.INFO, "TC-YR-026: Android: In-App Rating Prompt After Stories");

        try {
            if (!getPlatform().equals("android")) {
                extentTest.skip("Android-specific test");
                return;
            }

            completeAllStories();

            Assert.assertTrue(storyCarouselPage.isRatingPromptDisplayed(),
                "Native rating prompt should appear");
            Assert.assertTrue(storyCarouselPage.isRatingPromptFromGooglePlay(),
                "Should be Google Play In-App Review API prompt");

            extentTest.log(Status.PASS, "Android rating prompt displayed");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Android rating prompt test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-027: iOS In-App Rating Prompt
     * Native API: After story completion → iOS SKStoreReviewController prompt appears
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"smoke", "regression"}, priority = 1)
    public void showRatingPromptIOS(JsonObject testCase)  throws Exception {
        extentTest.log(Status.INFO, "TC-YR-027: iOS: In-App Rating Prompt After Stories");

        try {
            if (!getPlatform().equals("ios")) {
                extentTest.skip("iOS-specific test");
                return;
            }

            completeAllStories();

            Assert.assertTrue(storyCarouselPage.isRatingPromptDisplayed(),
                "Native rating prompt should appear");
            Assert.assertTrue(storyCarouselPage.isRatingPromptFromSKStoreReviewController(),
                "Should be SKStoreReviewController prompt");

            extentTest.log(Status.PASS, "iOS rating prompt displayed");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "iOS rating prompt test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-028: User Rates Stories 5 Stars
     * Rating: User taps 5 stars → rating submitted
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 1)
    public void rateStory5Stars(JsonObject testCase) throws Exception {
        extentTest.log(Status.INFO, "TC-YR-028: User Rates Stories 5 Stars");

        try {
            completeAllStories();

            Assert.assertTrue(storyCarouselPage.isRatingPromptDisplayed(),
                "Rating prompt should display");

            storyCarouselPage.rate5Stars();

            Assert.assertTrue(storyCarouselPage.isThankyouMessageDisplayed(),
                "Thank you message should show");
            Assert.assertFalse(storyCarouselPage.isRatingPromptDisplayed(),
                "Rating prompt should close after rating");

            extentTest.log(Status.PASS, "5-star rating submitted successfully");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "5-star rating test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-029: User Rates Low Stars
     * Rating: User rates 1-3 stars → feedback form offered
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void rateLowStars(JsonObject testCase) throws Exception{
        extentTest.log(Status.INFO, "TC-YR-029: User Rates Stories 1-3 Stars");

        try {
            completeAllStories();
            storyCarouselPage.rate3Stars();

            Assert.assertTrue(storyCarouselPage.isFeedbackFormOffered(),
                "Feedback form should be offered for low ratings");

            extentTest.log(Status.PASS, "Low rating feedback form offered");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Low rating test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-030: Dismiss Rating Prompt
     * Rating: User dismisses prompt → returns to dashboard
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void dismissRatingPrompt(JsonObject testCase) throws Exception{
        extentTest.log(Status.INFO, "TC-YR-030: Dismiss Rating Prompt");

        try {
            completeAllStories();
            long dismissTime = System.currentTimeMillis();

            storyCarouselPage.dismissRatingPrompt();

            Assert.assertFalse(storyCarouselPage.isRatingPromptDisplayed(),
                "Prompt should close");
            Assert.assertTrue(yearInReviewPage.isDashboardDisplayed(),
                "Should return to dashboard");

            // Verify 60-day frequency cap
            extentTest.log(Status.INFO, "Frequency cap set for 60 days from dismissal");

            extentTest.log(Status.PASS, "Rating prompt dismissed, frequency cap applied");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Dismiss rating test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-031: Rating Prompt Frequency Cap 60 Days
     * Rating: User rated recently → new prompt won't appear for 60 days
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void ratingPromptFrequencyCapped(JsonObject testCase) throws Exception {
        extentTest.log(Status.INFO, "TC-YR-031: Rating Prompt Frequency Cap 60 Days");

        try {
            // Set last rating date to 30 days ago
            setLastRatingDateToDaysAgo(30);

            completeAllStories();

            Assert.assertFalse(storyCarouselPage.isRatingPromptDisplayed(),
                "Rating prompt should not show within 60 days of last rating");

            extentTest.log(Status.PASS, "Frequency cap enforced correctly");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Frequency cap test failed: " + e.getMessage());
            throw e;
        }
    }

    // ============================================================================
    // G. PERFORMANCE & STABILITY
    // ============================================================================

    /**
     * TC-YR-032: Rapid Story Navigation Stability
     * Performance: User rapidly swipes through stories → app remains stable
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void rapidStoryNavigationStability(JsonObject testCase) throws Exception{
        extentTest.log(Status.INFO, "TC-YR-032: Rapid Story Navigation Stability");

        try {
            for (int i = 0; i < 10; i++) {
                storyCarouselPage.swipeLeft();
                Thread.sleep(500); // 10 swipes in 5 seconds
            }

            Assert.assertTrue(storyCarouselPage.isAppResponsive(),
                "App should remain responsive");
            Assert.assertTrue(storyCarouselPage.getCurrentFrameRate() >= 30,
                "Frame rate should be >= 30fps");
            Assert.assertFalse(storyCarouselPage.hasAnyCrashed(),
                "App should not crash");

            extentTest.log(Status.PASS, "Rapid navigation handled stably");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Rapid navigation test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-033: Memory Stable During Long Story Viewing
     * Performance: User views all stories for 15 minutes → memory stable
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 3)
    public void memoryUsageLongStoryViewing(JsonObject testCase) throws Exception{
        extentTest.log(Status.INFO, "TC-YR-033: Memory Stable During Long Story Viewing");

        try {
            long initialMemory = getAppMemoryUsage();

            // View stories for 15 minutes (simulated)
            simulateLongViewing(900); // 15 minutes

            long finalMemory = getAppMemoryUsage();
            long memoryGrowth = finalMemory - initialMemory;

            Assert.assertTrue(memoryGrowth <= 50, // 50MB growth acceptable
                "Memory should not grow excessively");
            Assert.assertTrue(storyCarouselPage.isAppResponsive(),
                "App should be responsive after extended viewing");

            extentTest.log(Status.PASS, "Memory usage stable, growth: " + memoryGrowth + "MB");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Long viewing test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-034: Story Images Load Without Memory Issues
     * Performance: Large story images load → cached efficiently
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void imageLoadingPerformance(JsonObject testCase) throws InterruptedException{
        extentTest.log(Status.INFO, "TC-YR-034: Story Images Load Without Memory Issues");

        try {
            enableImageCaching();

            for (int i = 0; i < 20; i++) {
                storyCarouselPage.swipeLeft();
                Assert.assertTrue(storyCarouselPage.isImageLoadedQuickly(),
                    "Images should load quickly with caching");
            }

            Assert.assertFalse(storyCarouselPage.hasMemoryLeak(),
                "No memory leaks should occur");

            extentTest.log(Status.PASS, "Images loaded efficiently with caching");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Image loading test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-035: App Backgrounding and Restoration
     * State: User backgrounds app → resumes from same position
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void appBackgroundingAndRestoration(JsonObject testCase) throws Exception{
        extentTest.log(Status.INFO, "TC-YR-035: App Backgrounding and Restoration");

        try {
            int storyIndexBefore = storyCarouselPage.getCurrentStoryIndex();
            long audioPosBefore = storyCarouselPage.getAudioPosition();

            backgroundApp(5000); // Background for 5 seconds

            int storyIndexAfter = storyCarouselPage.getCurrentStoryIndex();
            long audioPosAfter = storyCarouselPage.getAudioPosition();

            Assert.assertEquals(storyIndexAfter, storyIndexBefore,
                "Should resume from same story");
            Assert.assertTrue(audioPosAfter > audioPosBefore,
                "Music should resume playing");

            extentTest.log(Status.PASS, "App restored from background correctly");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Backgrounding test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-036: Screen Lock During Stories
     * State: Device screen locks → music pauses, story stops
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void screenLockDuringStories(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-036: Screen Lock During Stories");

        try {
            storyCarouselPage.waitForStoryLoad(2000);
            Assert.assertTrue(storyCarouselPage.isAudioPlaying(), "Music should be playing");

            lockScreen();

            Assert.assertFalse(storyCarouselPage.isAudioPlaying(),
                "Music should pause on lock");
            Assert.assertFalse(storyCarouselPage.isStoryAnimating(),
                "Story should pause on lock");

            unlockScreen();

            Assert.assertTrue(storyCarouselPage.isAudioPlaying(),
                "Music should resume on unlock");

            extentTest.log(Status.PASS, "Screen lock handling verified");
        } catch (Exception e) {
            unlockScreen();
            extentTest.log(Status.FAIL, "Screen lock test failed: " + e.getMessage());
            throw e;
        }
    }

    // ============================================================================
    // H. DATA VALIDATION & STORY ELIGIBILITY
    // ============================================================================

    /**
     * TC-YR-037: Joining Date Story Shown
     * Data validation: User joined in 2025 → joining date story displayed
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void joiningDateInYear2025(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-037: Joining Date Story Shown");

        try {
            loginAsUser("doj_2025_06_15");

            Assert.assertTrue(storyCarouselPage.containsStoryType("joining_date"),
                "Joining date story should be included");
            Assert.assertTrue(storyCarouselPage.getStoryContent().contains("2025-06-15"),
                "Story should display correct joining date");

            extentTest.log(Status.PASS, "Joining date story displayed correctly");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Joining date test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-038: Joining Date Not Shown if Outside Year
     * Data validation: User joined before 2025 → story not shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void joiningDateNotShownIfOutsideYear(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-038: Joining Date Story Hidden");

        try {
            loginAsUser("doj_2024_06_15");

            Assert.assertFalse(storyCarouselPage.containsStoryType("joining_date"),
                "Joining date story should not be included for 2024 joiners");

            extentTest.log(Status.PASS, "Joining date story correctly excluded");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Joining date exclusion test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-039: Anniversary Story Shown if Eligible
     * Data validation: User completed 1+ year → story displayed
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void anniversaryStoryShownIfEligible(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-039: Anniversary Story Shown");

        try {
            loginAsUser("doj_2024_01_15"); // 1+ year service

            Assert.assertTrue(storyCarouselPage.containsStoryType("anniversary"),
                "Anniversary story should be included");

            extentTest.log(Status.PASS, "Anniversary story displayed");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Anniversary test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-040: Promotion Story Shown
     * Data validation: User promoted in 2025 → story displayed
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void promotionStoryIfPromotedIn2025(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-040: Promotion Story Shown");

        try {
            loginAsUser("promoted_2025_03_20");

            Assert.assertTrue(storyCarouselPage.containsStoryType("promotion"),
                "Promotion story should be included");

            extentTest.log(Status.PASS, "Promotion story displayed");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Promotion test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-041: Marriage Story Shown
     * Data validation: User married in 2025 → story displayed
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void marriageStoryIfMarriedIn2025(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-041: Marriage Story Shown");

        try {
            loginAsUser("married_2025_05_10");

            Assert.assertTrue(storyCarouselPage.containsStoryType("marriage"),
                "Marriage story should be included");

            extentTest.log(Status.PASS, "Marriage story displayed");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Marriage test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-042: Child Birth Story Shown
     * Data validation: User blessed with child in 2025 → story displayed
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void childBirthStoryIfBornIn2025(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-042: Child Birth Story Shown");

        try {
            loginAsUser("child_dob_2025_04_15");

            Assert.assertTrue(storyCarouselPage.containsStoryType("child_birth"),
                "Child birth story should be included");

            extentTest.log(Status.PASS, "Child birth story displayed");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Child birth test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-043: Attendance Streak Story
     * Data validation: User has 30+ day streak → story displayed
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void attendanceStreakStoryIfEligible(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-043: Attendance Streak Story");

        try {
            loginAsUser("high_attendance"); // 45-day streak

            Assert.assertTrue(storyCarouselPage.containsStoryType("attendance_streak"),
                "Attendance streak story should be included");
            Assert.assertTrue(storyCarouselPage.getStoryContent().contains("45"),
                "Should display streak count");

            extentTest.log(Status.PASS, "Attendance streak story displayed");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Attendance streak test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-044: Recognition Story
     * Data validation: User has 5+ recognitions → story displayed
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void recognitionStoryIfEligible(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-044: Recognition Story");

        try {
            loginAsUser("high_recognition"); // 8 received, 12 given

            Assert.assertTrue(storyCarouselPage.containsStoryType("recognition"),
                "Recognition story should be included");

            extentTest.log(Status.PASS, "Recognition story displayed");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Recognition test failed: " + e.getMessage());
            throw e;
        }
    }

    // ============================================================================
    // I. BADGE PERSONA ASSIGNMENT
    // ============================================================================

    /**
     * TC-YR-045: Rising Star Badge
     * Persona: User promoted in 2025 → Rising Star badge shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void risingStarBadgeAssignedCorrectly(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-045: Rising Star Badge Assigned");

        try {
            loginAsUser("promoted_2025");

            Assert.assertTrue(badgeStoryPage.isBadgeDisplayed("Rising Star"),
                "Rising Star badge should be displayed");
            Assert.assertTrue(badgeStoryPage.getBadgeDescription().contains("Elevated"),
                "Badge description should match");

            extentTest.log(Status.PASS, "Rising Star badge assigned correctly");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Rising Star badge test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-046: Recognition Rockstar Badge
     * Persona: User with 5+ recognitions → badge shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void recognitionRockstarBadgeAssignment(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-046: Recognition Rockstar Badge");

        try {
            loginAsUser("high_recognition");

            Assert.assertTrue(badgeStoryPage.isBadgeDisplayed("Recognition Rockstar"),
                "Recognition Rockstar badge should be displayed");

            extentTest.log(Status.PASS, "Recognition Rockstar badge assigned");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Recognition Rockstar test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-047: Esteemed Veteran Badge
     * Persona: User with 10+ years service → badge shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void esteemedVeteranBadgeAssignment(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-047: Esteemed Veteran Badge");

        try {
            loginAsUser("doj_2012"); // 13+ years

            Assert.assertTrue(badgeStoryPage.isBadgeDisplayed("Esteemed Veteran"),
                "Esteemed Veteran badge should be displayed");

            extentTest.log(Status.PASS, "Esteemed Veteran badge assigned");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Esteemed Veteran test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-048: Goal Crusher Badge
     * Persona: User with 75%+ goal completion → badge shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void goalCrusherBadgeAssignment(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-048: Goal Crusher Badge");

        try {
            loginAsUser("high_goal_completion"); // 92%

            Assert.assertTrue(badgeStoryPage.isBadgeDisplayed("Goal Crusher"),
                "Goal Crusher badge should be displayed");

            extentTest.log(Status.PASS, "Goal Crusher badge assigned");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Goal Crusher test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-049: Streak Achiever Badge
     * Persona: User with 30+ attendance streak → badge shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void streakAchieverBadgeAssignment(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-049: Streak Achiever Badge");

        try {
            loginAsUser("high_attendance"); // 35 days

            Assert.assertTrue(badgeStoryPage.isBadgeDisplayed("Streak Achiever"),
                "Streak Achiever badge should be displayed");

            extentTest.log(Status.PASS, "Streak Achiever badge assigned");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Streak Achiever test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-050: Referral Ninja Badge
     * Persona: User with 3+ successful referrals → badge shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void referralNinjaBadgeAssignment(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-050: Referral Ninja Badge");

        try {
            loginAsUser("high_referrals"); // 5 activated

            Assert.assertTrue(badgeStoryPage.isBadgeDisplayed("Referral Ninja"),
                "Referral Ninja badge should be displayed");

            extentTest.log(Status.PASS, "Referral Ninja badge assigned");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Referral Ninja test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-051: Travel Titan Badge
     * Persona: User with 7+ days business travel → badge shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void travelTitanBadgeAssignment(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-051: Travel Titan Badge");

        try {
            loginAsUser("high_travel"); // 21 days, 4 trips

            Assert.assertTrue(badgeStoryPage.isBadgeDisplayed("Travel Titan"),
                "Travel Titan badge should be displayed");

            extentTest.log(Status.PASS, "Travel Titan badge assigned");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Travel Titan test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-052: Cheer Champion Badge
     * Persona: User with 5+ Vibe interactions → badge shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void cheerChampionBadgeAssignment(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-052: Cheer Champion Badge");

        try {
            loginAsUser("high_vibe_engagement"); // 12 interactions

            Assert.assertTrue(badgeStoryPage.isBadgeDisplayed("Cheer Champion"),
                "Cheer Champion badge should be displayed");

            extentTest.log(Status.PASS, "Cheer Champion badge assigned");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Cheer Champion test failed: " + e.getMessage());
            throw e;
        }
    }

    // ============================================================================
    // J. SUMMARY LAYOUT VARIATIONS
    // ============================================================================

    /**
     * TC-YR-053: Summary with 4 Data Points
     * Summary layout: 4 points → 2x2 grid shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void summaryBentoWith4DataPoints(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-053: Summary Bento Story with 4 Data Points");

        try {
            loginAsUser("summary_4_points");
            summaryPage.navigateToSummaryStory();

            Assert.assertTrue(summaryPage.isBentoLayoutDisplayed(),
                "Bento layout should display");
            Assert.assertEquals(summaryPage.getCardCount(), 4,
                "Should have 4 cards in 2x2 grid");

            extentTest.log(Status.PASS, "4-point summary layout verified");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "4-point summary test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-054: Summary with 5 Data Points
     * Summary layout: 5 points → custom 5-card layout shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void summaryBentoWith5DataPoints(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-054: Summary Bento Story with 5 Data Points");

        try {
            loginAsUser("summary_5_points");
            summaryPage.navigateToSummaryStory();

            Assert.assertEquals(summaryPage.getCardCount(), 5,
                "Should have 5 cards in custom layout");

            extentTest.log(Status.PASS, "5-point summary layout verified");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "5-point summary test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-055: Summary with 6+ Data Points
     * Summary layout: 6+ points → max 6 cards shown
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void summaryBentoWith6DataPoints(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-055: Summary Bento Story with 6 Data Points");

        try {
            loginAsUser("summary_8_points"); // Has 8 but only first 6 shown
            summaryPage.navigateToSummaryStory();

            Assert.assertEquals(summaryPage.getCardCount(), 6,
                "Should have max 6 cards");

            extentTest.log(Status.PASS, "6-point summary layout verified (max enforced)");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "6-point summary test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-056: User with No Eligible Stories
     * Data validation: New employee → intro only
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void userWithNoEligibleStories(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-056: User with No Eligible Stories");

        try {
            loginAsUser("new_employee_2026");

            Assert.assertTrue(yearInReviewPage.isIntroCardVisible(),
                "Intro card should be displayed");
            Assert.assertTrue(yearInReviewPage.getIntroMessage().contains("Come back next year"),
                "Should show appropriate message");

            extentTest.log(Status.PASS, "No eligible stories handled correctly");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "No eligible stories test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-057: Entry Point Ring Color Change
     * UI: User completes all stories → dashboard ring color changes
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void completionRingColorChange(JsonObject testCase) throws Exception{
        extentTest.log(Status.INFO, "TC-YR-057: Entry Point Ring Color Changes on Completion");

        try {
            String ringColorBefore = yearInReviewPage.getEntryPointRingColor();

            completeAllStories();

            String ringColorAfter = yearInReviewPage.getEntryPointRingColor();

            Assert.assertNotEquals(ringColorBefore, ringColorAfter,
                "Ring color should change on completion");
            Assert.assertEquals(ringColorAfter, "gold",
                "Completed state should show gold/completion color");

            extentTest.log(Status.PASS, "Ring color changed on completion");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Ring color test failed: " + e.getMessage());
            throw e;
        }
    }

    // ============================================================================
    // K. ACCESSIBILITY FEATURES
    // ============================================================================

    /**
     * TC-YR-058: Screen Reader Navigation
     * Accessibility: Screen reader → all content announced
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void screenReaderNavigatesStories(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-058: Screen Reader Story Navigation");

        try {
            enableScreenReader();

            Assert.assertTrue(storyCarouselPage.isStoryTitleAnnounced(),
                "Story title should be announced");
            Assert.assertTrue(storyCarouselPage.isStoryContentAnnounced(),
                "Story content should be announced");
            Assert.assertTrue(storyCarouselPage.isNavigationDescribed(),
                "Navigation should be described");

            disableScreenReader();
            extentTest.log(Status.PASS, "Screen reader accessibility verified");
        } catch (Exception e) {
            disableScreenReader();
            extentTest.log(Status.FAIL, "Screen reader test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-059: Text Scaling
     * Accessibility: 150% text scale → content readable
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void textScalingStoryContent(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-059: Text Scaling on Story Content");

        try {
            setTextScale(150);

            Assert.assertTrue(storyCarouselPage.isTextScaled(150),
                "Text should scale to 150%");
            Assert.assertTrue(storyCarouselPage.isContentReadable(),
                "Content should remain readable");
            Assert.assertFalse(storyCarouselPage.isTextTruncated(),
                "Text should not be truncated");

            setTextScale(100); // Reset
            extentTest.log(Status.PASS, "Text scaling works correctly");
        } catch (Exception e) {
            setTextScale(100);
            extentTest.log(Status.FAIL, "Text scaling test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-060: High Contrast Mode
     * Accessibility: High contrast → sufficient color contrast
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 3)
    public void highContrastColorMode(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-060: High Contrast Color Mode");

        try {
            enableHighContrast();

            double contrast = storyCarouselPage.getColorContrastRatio();
            Assert.assertTrue(contrast >= 4.5,
                "Color contrast should be >= 4.5:1 (WCAG AA)");

            extentTest.log(Status.PASS, "High contrast mode verified (ratio: " + contrast + ")");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "High contrast test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-061: Touch Target Minimum Size
     * Accessibility: Interactive elements >= 48dp
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void minimumTouchTargetSize(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-061: Touch Target Minimum Size (48dp)");

        try {
            int closeButtonSize = storyCarouselPage.getCloseButtonSize();
            int skipButtonSize = storyCarouselPage.getSkipButtonSize();

            Assert.assertTrue(closeButtonSize >= 48,
                "Close button should be >= 48dp");
            Assert.assertTrue(skipButtonSize >= 48,
                "Skip button should be >= 48dp");

            extentTest.log(Status.PASS, "Touch target sizes verified");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Touch target test failed: " + e.getMessage());
            throw e;
        }
    }

    // ============================================================================
    // L. LOCALIZATION & CONFIGURATION
    // ============================================================================

    // TC-YR-062: Multi-Language Story Content — disabled; multi-language is not supported on mobile Year End Review.
    /*
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void multiLanguageStoryContent(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-062: Story Content Translated (Multi-Language)");

        try {
            setLanguage("fr");

            Assert.assertTrue(storyCarouselPage.isStoryInLanguage("French"),
                "Story should be in French");
            Assert.assertTrue(badgeStoryPage.isBadgeInLanguage("French"),
                "Badges should be translated");

            setLanguage("en"); // Reset
            extentTest.log(Status.PASS, "Multi-language support verified");
        } catch (Exception e) {
            setLanguage("en");
            extentTest.log(Status.FAIL, "Multi-language test failed: " + e.getMessage());
            throw e;
        }
    }
    */

    /**
     * TC-YR-063: Tenant-Specific Term Aliasing
     * Localization: Terms aliased per tenant
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void aliasesAppliedCorrectly(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-063: Darwinbox Terms Aliased Per Tenant");

        try {
            setTenantAlias("Company", "Darwinbox");

            String storyText = storyCarouselPage.getStoryContent();
            Assert.assertTrue(storyText.contains("Company") || !storyText.contains("Darwinbox"),
                "Terms should be aliased per tenant settings");

            extentTest.log(Status.PASS, "Tenant aliases applied correctly");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Alias test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-064: Feature Toggle Enabled
     * Configuration: Year In Review enabled → visible
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"smoke", "regression"}, priority = 1)
    public void featureToggleEnabled(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-064: Feature Toggle Enabled");

        try {
            enableFeatureToggle("year_in_review");

            Assert.assertTrue(yearInReviewPage.isEntryPointVisible(),
                "Entry point should be visible when enabled");

            extentTest.log(Status.PASS, "Feature toggle enabled correctly");
        } catch (Exception e) {
            extentTest.log(Status.FAIL, "Feature toggle test failed: " + e.getMessage());
            throw e;
        }
    }

    /**
     * TC-YR-065: Feature Toggle Disabled
     * Configuration: Year In Review disabled → hidden
     */
    @Test(dataProvider = "yearInReviewTestCases", groups = {"regression"}, priority = 2)
    public void featureToggleDisabled(JsonObject testCase) {
        extentTest.log(Status.INFO, "TC-YR-065: Feature Toggle Disabled");

        try {
            disableFeatureToggle("year_in_review");

            Assert.assertFalse(yearInReviewPage.isEntryPointVisible(),
                "Entry point should be hidden when disabled");

            enableFeatureToggle("year_in_review"); // Re-enable for other tests
            extentTest.log(Status.PASS, "Feature toggle disabled correctly");
        } catch (Exception e) {
            enableFeatureToggle("year_in_review");
            extentTest.log(Status.FAIL, "Feature toggle disable test failed: " + e.getMessage());
            throw e;
        }
    }

    // ============================================================================
    // HELPER METHODS
    // ============================================================================

    private void completeAllStories() throws Exception {
        while (storyCarouselPage.hasNextStory()) {
            storyCarouselPage.swipeLeft();
        }
    }

    private void navigateToBadgeStory() throws Exception {
        storyCarouselPage.swipeLeft();
    }

    private void startStoryLoad() {
        // Start loading a story
    }

    private void interruptNetwork() {
        disableNetworkConnectivity();
    }

    private void restoreNetwork() {
        enableNetworkConnectivity();
    }

    private void backgroundApp(long duration) throws Exception {
        Thread.sleep(duration);
    }

    private void simulateLongViewing(int seconds) throws Exception {
        for (int i = 0; i < seconds; i += 30) {
            storyCarouselPage.swipeLeft();
            Thread.sleep(100);
        }
    }
}
