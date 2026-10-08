---
name: src-coverage-plan
description: >-
  Review existing src abstractions against a set of test cases and produce a structured
  test script plan. Use when the user provides test case files and wants to know what
  is in scope, what src already covers, what is missing, and what blocks execution —
  before any test scripts are written.
---

# src-coverage-plan

Produces a plan that answers: what can be scripted today, what is blocked, and what src gaps must be closed first.

**Does not generate test scripts.** Script writing happens only after this plan is approved and blockers are resolved.

---

## Inputs required

- Test case files (JSON or equivalent)
- Target instance folder (for `roles.json` and base URL)
- Current `src` (pages, locators, APIs, flows, helpers)
- Scope decisions from the user (which areas are in scope, which are not)

---

## Process

### 1. Review the suite
- Read all test case files
- Count total cases
- Group by UI surface / area, not by file
- Identify cases that share the same pages or flows

### 2. Lock scope
- Produce one clean in-scope list and one out-of-scope list with reasons
- No case may appear in both lists
- Blocked cases stay in In scope — do not move them to Out of scope
- Remove audit, env, or tenant-level cases only if user says so

### 3. Map personas
- Read instance `roles.json`
- Map test personas to real credentials
- Default mapping: `HRBP` → `Admin`, `HR Admin` → `Admin`, no-access user → `Employee`
- Note any credentials still missing

### 4. Classify data
- What comes from `roles.json` (base URL, tenant ID, credentials) — no fixtures needed
- What is generated in setup flows (`Date.now()` names, derived search terms) — not blockers
- What truly needs static user-provided data — flag only these

### 5. Map reusable assets
- List only `src` pages, locators, APIs, flows, and helpers that are actually useful for this suite
- For each group, state what it provides concretely
- If any test case requires navigating to a settings page, include `src/fixtures/settings.fixture.ts` (`SettingsNavigator`) — it covers all L1/L2/L3 settings navigation and is never a gap

### 6. Classify setup needs
For each precondition, classify as one of:
- **Existing reusable flow** — `src` already has a named helper that does the whole thing
- **Inline setup step** — possible in 1–3 lines using existing `src` primitives; not a gap
- **Missing flow** — tests will be messy or duplicated without a shared helper

Do not create gaps for: generated names, search prefixes, one-off values, steps already possible with existing helpers.

### 7. Identify real src gaps
Before declaring any interaction pattern a gap, check `src/pages/common/` for shared utilities that already cover it. A gap only exists if nothing in common *or* page-specific `src` can produce clean test steps.

Only call something a gap if tests cannot be written cleanly without it:
- Missing locator
- Missing page method
- Missing page object
- Missing API wait helper

Not gaps: generated values, inline setup steps, agreed persona mapping, interactions already covered by shared helpers in `src/pages/common/`.

### 8. Build the checklist
One item per genuine gap, grouped by page/area.
- Mark `[ ]` for pending, `[x]` for done — never remove items.

### 9. Define blockers
Final blockers = missing credentials OR missing src support only.
Do not include out-of-scope cases, inline setup values, or already available roles.

### 10. Compute executability
`executable in-scope cases ÷ total in-scope cases`
- In-scope only, current repo state only, no test-local workarounds.

---

## Output

Once the review is complete, read [references/plan-format.md](references/plan-format.md) and write the plan following that structure.

Plan file naming:
- Name the file after the feature or module being tested, not the instance
- Format: `runs/test_cases/<feature>-test-script-plan.md`
- Use the feature or module name — never an instance, tenant, or environment identifier

---

## Writing rules

- Short, structured, no long explanations, no duplicated sections
- No speculative blockers — only real missing src artifacts
- Update counts whenever scope or execution status changes
- Do not generate test scripts as part of this skill
- Precondition setup may use direct URL routing; all actual test steps must navigate via UI only — state this explicitly in the plan Goals and in any reusable asset description that mentions navigation
