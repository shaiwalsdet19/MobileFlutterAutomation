# Darwinbox Page To POM Reference

## Scope
Use this workflow when the user wants a Playwright POM for one Darwinbox page or one tightly related URL family.

Treat these as separate responsibilities:
- page file: user-facing actions and UI state reads
- locator file: all selectors
- API file: URL path, endpoint constants, waits, response parsing
- test file: flow validation through page methods

## Ground Rules
- Use headed Chromium for discovery unless the user explicitly wants otherwise.
- Reuse the repo login flow and the correct Darwinbox persona for the module.
- Keep the change surgical and repo-consistent.
- Do not invent UI or API coverage. Validate against the live page.
- Prefer `data-testid`; use stable fallback selectors only when no reliable test id exists.
- A page file can resolve locators, but must not define raw selectors inline.
- A test file must not define raw selectors inline.
- API waits are allowed for synchronization.
- Assertions must be UI-based only.
- If a test uses API data, use it to choose data or wait for load, not to prove correctness.

## Exploration Workflow
Explore before writing code. Cover both visible and hidden-on-interaction UI.

### Discovery checklist
- default page load state
- page shell, title, breadcrumb, header actions
- create buttons and primary CTAs
- tabs, chips, counters, badges
- search, filter, sort, pagination, infinite scroll, load more
- list, card, or table sections
- row actions and overflow menus
- hover-only UI
- dialogs, drawers, popovers, tooltips
- empty state, no-results state, loading state, error state
- linked navigation to details, create, edit, or library pages
- below-the-fold content after scrolling
- network calls fired on initial load and key actions

### Exploration method
1. Log in using the reusable helper already used by the repo.
2. Navigate by URL, not by side-menu wandering.
3. Wait for core page-load APIs if needed, then validate readiness by UI only.
4. Open every meaningful menu, tab, drawer, and dialog that belongs to the page.
5. Scroll if the page has lazy-loaded or below-the-fold sections.
6. Inspect `data-testid` values first.
7. If a control has no stable test id, choose the narrowest stable fallback and mark it as a fallback in your notes.
8. Record linked routes, but do not expand them into new POMs unless asked.

## File Responsibilities

## Locator File
Create the locator file first. This is the source of truth for selectors.

Rules:
- Keep all selectors here only.
- Use the repo locator shape: `{ testId, description }`.
- Group locators by page section.
- Give descriptions that explain intent, not just label text.
- Use dynamic locator factories for row-, card-, menu-, or id-based elements.
- Keep collection locators and item locators separate when both are useful.

Good patterns:
- static root/container locators
- section-level locators
- action button locators
- dynamic row locators like `surveyRow(id)`
- dynamic menu action locators like `surveyMenuViewDetails(id)`

Avoid:
- hiding raw CSS or text selectors in the page file
- using vague names like `button1`, `row2`, `menuOption`
- mixing unrelated URLs into one locator file

## Page File
The page file should model user behavior, not selector details.

Include:
- `navigate(baseUrl)` or equivalent route-based entrypoint
- `waitForPageReady()` with UI assertions only
- methods for meaningful user actions
- methods for reading important page state
- small helper methods that compose locator-backed interactions

Page file rules:
- no raw selectors inline
- no test assertions unrelated to page readiness
- no test-case branching or business scenario logic
- no cross-page expansion beyond simple navigation methods unless asked

`waitForPageReady()` guidance:
- it may run after API waits
- it must assert visible UI only
- it should check stable page landmarks, not volatile counters

Examples of good page methods:
- `openCreateDrawer()`
- `openRecentTab()`
- `clickRowMenuAction(id, "viewDetails")`
- `getVisibleRowIds()`
- `waitForRowVisible(id)`

## API File
The API file supports synchronization and response interpretation.

Include:
- page path constant
- `getPageUrl(baseUrl)` helper
- endpoint constants for load and action APIs
- wait helpers for relevant responses
- parsers or tiny response interpreters when useful

API file rules:
- no UI selectors
- no UI assertions
- no page object behavior
- no correctness assertions that tests should be proving in the UI

Good uses of API helpers:
- wait for dashboard list load
- wait for drawer-triggered fetch
- parse a response to choose a safe row id for the next UI action

Bad uses of API helpers:
- asserting that a page is correct because a response payload was correct
- replacing visible UI assertions with response-body assertions

## Tests
Add or update a spec only when it meaningfully validates the page contract.

Test rules:
- log in through the reusable helper
- use page objects, not raw selectors
- use API waits only to stabilize navigation or action timing
- use UI assertions for actual validation
- keep the test narrow and stable

Preferred validation shape:
1. login
2. navigate
3. wait on relevant API load calls if useful
4. call `waitForPageReady()`
5. assert visible UI state
6. perform one or two representative actions
7. assert resulting UI state or navigation

## Boundary Rules
Use this split consistently:

- locator file knows where elements are
- page file knows how to interact with them
- API file knows which requests matter
- test file knows what behavior to validate

If you catch a selector in a page or test file, move it into the locator file.

If you catch an API response being used as the final correctness check, replace it with a UI assertion.

If you catch multiple URL families inside one page bundle, split them unless the routes are clearly the same page family.

## Output Guidance
When returning a full page-to-POM result, keep the report ordered and explicit:
1. Page summary
2. Full UI inventory
3. Locator plan
4. API inventory
5. POM design
6. Coverage gaps / risks
7. Final code

Always call out:
- missing `data-testid` coverage
- selectors that are fallback-only
- elements you could not validate live
- flows intentionally not expanded into separate POMs
