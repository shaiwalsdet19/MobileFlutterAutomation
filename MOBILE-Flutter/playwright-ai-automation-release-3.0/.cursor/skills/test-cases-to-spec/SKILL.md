---
name: test-cases-to-spec
description: >-
  Write Playwright spec files from an approved test script plan. Use when the user
  has a completed plan file and wants to generate executable specs — covering scope
  enforcement, beforeAll data setup, UI navigation, assertions, and file conventions.
---

# test-cases-to-spec

Translates an approved test script plan into executable Playwright spec files.

**Requires a completed, approved plan file before starting. Do not write specs without one.**

**Also read and apply `.cursor/skills/coding-guidelines/SKILL.md` before writing any code.**

---

## Steps before writing any spec

1. Read `.cursor/skills/coding-guidelines/SKILL.md`
2. Read `runs/test_cases/<module>-test-script-plan.md` fully
3. Read all `src` files listed under Reusable Assets in the plan
4. Write specs — in plan order, one case at a time

---

## Scope
- Write specs for executable in-scope cases only
- Skip blocked and out-of-scope cases

## Setup
- The plan is the authority — follow it fully, do not simplify or conservative-substitute
- Use existing `src` flows and APIs to satisfy plan preconditions; do not replace them with minimal inline steps
- `beforeAll` must be self-contained and never fail because of missing data
- Data contract for `beforeAll`: data present → reuse it; data missing → create it using `src` flows; creation fails → surface it as a real failure
- Do not write code that only checks for data existence without also creating it when absent
- Resolve instance from `process.env.INSTANCE`; derive `BASE_URL` and credentials at runtime — never hardcode them

## Navigation
- Navigate via UI interactions for every step a user would take through the UI
- `page.goto` is allowed only for the initial landing page
- When navigation to a settings page is required, always use `settingsNav.goTo('<key>')` from `src/fixtures/settings.fixture.ts` — never use `page.goto` or raw locator steps for settings navigation
  - Import: `import { test, expect } from '../../fixtures/settings.fixture';`
  - Usage: `await settingsNav.goTo('companyProfile');` (key from `SETTINGS_MAP`)

## Teardown
- `afterAll` must always use `src/helpers/collection-cleanup.ts` to clean up generated data
- If the collection name is not clear from the plan or `src`, ask the user before writing `afterAll`

## Error handling
- Every function in the spec file must be wrapped in a try/catch block

## src usage
- Reuse `src` abstractions only — no test-local locators
- Modify `src/` only if explicitly instructed and justified
- **NEVER EDIT files in src/**

## Assertions
- Assert exactly what the test case states — copy the expected result verbatim
- No additional assertions beyond what the test case defines

## File conventions
- Name spec files after the feature or behavior being tested
- Do not encode tenant, instance, environment, or runtime data in filenames

---

Deliverable: spec files in `tests/<module>/`
