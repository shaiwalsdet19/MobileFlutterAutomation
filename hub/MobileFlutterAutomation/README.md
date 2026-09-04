# MobileFlutterAutomation

Appium + TestNG mobile automation framework for the Darwinbox HR Flutter application.

## Tech stack

| Component | Version / tool |
|-----------|----------------|
| Language | Java 21 |
| Build | Maven |
| Test runner | TestNG 7.8 |
| Mobile driver | Appium Java Client 8.6.0 (`automationName=Flutter`) |
| Reporting | ExtentReports |
| Cloud (optional) | BrowserStack (`-DbrowserStack=true`) |

See [TESTING-STRATEGY.md](TESTING-STRATEGY.md) for architecture and coverage goals.

## Project structure

```
src/main/java/com/pages/          # Page objects (POM), extend FlutterHelpers
src/test/java/com/tests/modules/  # Module test classes
src/test/resources/modules/       # JSON test data per module
testng/                           # smoke.xml, regression.xml
```

## Prerequisites

- JDK 21
- Maven 3.8+
- Appium 2.x with Flutter driver plugin
- Android emulator/device or iOS simulator/device with the HR app installed

## Run tests

```bash
# Full regression suite
mvn clean test

# Smoke suite
mvn clean test -DsuiteXmlFile=testng/smoke.xml

# Single module (Year In Review)
mvn clean test -Dtest=YearInReviewFunctional

# BrowserStack
mvn clean test -DbrowserStack=true
```

Reports are written under `test-output/` (ExtentReports HTML).

## Modules

| Module | Test class | Data |
|--------|------------|------|
| leave | `LeaveFunctional` | `src/test/resources/modules/leave/` |
| timesheet | — | `src/test/resources/modules/timesheet/` |
| yearinreview | `YearInReviewFunctional` | `src/test/resources/modules/yearinreview/YearInReviewFunctional.json` |

### Year In Review (MOBILE-6841)

65 data-driven test cases (TC-YR-001 … TC-YR-065) covering stories, gestures, audio, sharing, performance, badges, summary, and accessibility.

**Page objects**

- `YearInReviewPage` — entry / ring UI
- `StoryCarouselPage` — carousel, gestures, audio, stability, accessibility
- `BadgeStoryPage` — badge stories and share
- `SummaryPage` — year-end summary layouts

**StoryCarouselPage** (recent updates)

Methods added so `YearInReviewFunctional` compiles and runs:

- Stability: `isAppStable()`, `isStoryDisplayed()`
- Accessibility (TC-YR-058–061): `isStoryTitleAnnounced()`, `isStoryContentAnnounced()`, `isNavigationDescribed()`, `isTextScaled(int)`, `isContentReadable()`, `isTextTruncated()`, `getColorContrastRatio()`, `getCloseButtonSize()`, `getSkipButtonSize()`

Some checks use Flutter ValueKeys and accessibility attributes; contrast and memory helpers are placeholders until app semantics are wired.

More detail: [JAVA_TEST_GENERATION_SUMMARY.md](JAVA_TEST_GENERATION_SUMMARY.md).

## Locator strategy

Elements are found by Flutter **ValueKey** (mapped to `content-desc` on Android and `name` on iOS). Coordinate with the Flutter team so interactive widgets expose stable keys before automating flows.

## CI

GitLab CI/CD setup is documented under `skills/flutter-gitlab-cicd/`.

## Repository

```
https://gitlab.mgmt.darwinbox.io/shaiwal.s/mobileflutterautomation.git
```
