---
name: darwinbox-page-to-pom
description: Build or refine Darwinbox Playwright page objects from a live Darwinbox URL, including one page file, one locator file, one API file, and optional validation specs. Use when the user asks to create a POM, locator map, API mapping, page coverage, selector cleanup, or page-validation tests for a Darwinbox page, dashboard, details page, or flow reached from a Darwinbox URL.
---
# Darwinbox Page To POM

Use this skill for a single Darwinbox page or one tightly related URL family.

## Quick Start
1. Start from one concrete page URL.
2. Explore the live page in headed Chromium before finalizing code.
3. Keep a strict split:
   - page file: actions, navigation, UI state readers
   - locator file: all selectors only
   - API file: route patterns, waits, response parsing
4. Use API waits for synchronization only.
5. Use UI assertions only for readiness and test validation.

## Non-Negotiable Rules
- Keep 1:1 mapping between the URL family and its page/locator/API files.
- Do not define ad hoc selectors in tests.
- Do not define ad hoc selectors in page files.
- Put every locator in the locator file, including dynamic row or menu locators.
- **Only add locators that have a `data-testid` attribute. If a UI element has no `data-testid`, skip it entirely — do not add it using any other selector strategy.**
- Page files may consume locators and expose methods, but they must not embed raw selector strings.
- API files must not contain UI assertions or page-specific interaction logic.
- Tests should use page methods and UI assertions, not raw selectors and not API correctness assertions.
- If linked pages are discovered, list them as downstream navigation only unless the user asked for separate POMs.

## Workflow
1. Explore the live page and inventory default, hover, click-open, modal, drawer, tab, menu, and scroll-revealed UI.
2. Capture API endpoints that drive the page or user actions.
3. Draft the locator map first.
4. Build the page file around user actions and UI state reads.
5. Build the API file around route constants, waits, and parsers.
6. Add a focused validation spec only if it materially checks the page contract.
7. Call out any coverage gaps, missing test ids, or unstable areas.

## Required Output Shape
When the user asks for a full page-to-POM pass, return results in this order:
1. Page summary
2. Full UI inventory
3. Locator plan
4. API inventory
5. POM design
6. Coverage gaps / risks
7. Final code

## Additional Resources
- Detailed workflow: [reference.md](reference.md)
- Reusable request template: [prompt-template.md](prompt-template.md)
