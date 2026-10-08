---
name: coding-guidelines
description: Playwright script generation guidelines. Use when writing, reviewing, or editing Playwright specs or page objects.
license: MIT
---

# Playwright Script Guidelines

## 1. Clarify Before Writing

- If the test case is ambiguous, ask. Don't guess.
- If a locator or flow is unclear, say so before proceeding.
- If a simpler approach exists, propose it.

## 2. Use Existing Abstractions

- Use POMs, locator files, and helpers already in `src/`. Don't reinvent.
- Don't add new page methods unless the test genuinely needs them.
- Don't create new utilities for one-off use.

## 3. Write Only What Was Asked

- One spec per task unless explicitly told otherwise.
- No extra assertions, no bonus edge cases, no "nice to have" coverage.
- No hardcoded waits (`page.waitForTimeout`) unless asked.
- No comments that restate what the code already says.

## 4. Keep Tests Readable and Stable

- Use `page.getByRole`, `page.getByLabel`, or locators from the locator file — in that order of preference.
- Each test must have a clear `expect`. No action-only tests.
- `beforeAll` / `beforeEach` only for shared setup. Don't repeat navigation in every test.
- Tests must be independent — no shared mutable state between them.

## 5. Surgical Edits

- When editing existing specs, touch only the failing or requested block.
- Don't reformat unrelated tests or rename locators you didn't introduce.
- If you see a broken pattern elsewhere, mention it — don't fix it silently.