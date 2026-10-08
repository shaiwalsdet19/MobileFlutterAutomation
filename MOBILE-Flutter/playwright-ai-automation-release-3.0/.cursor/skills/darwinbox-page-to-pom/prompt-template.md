# Darwinbox Page-To-POM Prompt Template

Use this template when you want a full page-to-POM pass for another Darwinbox page.

```markdown
Create a complete Playwright POM for this Darwinbox page:
<FULL_PAGE_URL>

Use the correct login persona from:
`data/instances/<instance>/roles.json`

Reuse the existing login pattern from:
- `src/helpers/login.ts`
- `src/pages/common/login.page.ts`

Follow existing repo style exactly:
- lean page object
- locator map with `{ testId, description }`
- clear naming
- no overengineering
- repo-consistent structure

## Files to create
1. `src/pages/<module>/<page-name>.page.ts`
2. `src/pages/<module>/locators/<page-name>.ts`
3. `src/pages/<module>/api/<page-name>.api.ts`
4. `tests/<module>/<type>/<page-name>.spec.ts` (type = `happyflow`, `basic_settings`, or `e2e`)

## Goal
I want full coverage for this single page / URL family only.

## Deliverables

### 1. Page object
Create a production-ready page class with:
- navigation method
- page-ready / load assertion method using UI assertions only
- methods for every meaningful user action
- methods for reading important page state
- reusable helpers where needed
- no test logic inside the page file
- no direct selectors inside the page file; consume locators from the locator file only

### 2. Locators
Create a complete locator file in the same format as `src/pages/common/locators/common.ts`.

Requirements:
- cover all visible and interactive UI elements on the page
- prefer `data-testid`
- if `data-testid` is missing, use the most stable fallback selector
- every locator must include a useful `description`
- group locators logically by section
- put all selectors in this file only, including dynamic row/menu/card locators

### 3. API layer
Create API mapping/helper code in:
`src/pages/<module>/api/<page-name>.api.ts`

Requirements:
- identify relevant API/network calls for this page
- include page-load APIs and action-triggered APIs
- expose reusable helpers/constants for waits, route patterns, and response interpretation
- use API waits for synchronization only
- do not put UI logic in the API file
- do not use API responses as the final correctness assertion for the page

### 4. Validation spec
Create a focused validation spec only if it materially validates the page contract.

Requirements:
- login via reusable helper
- use page-object methods, not raw selectors
- actual assertions must be UI-based only
- API waits may be used only to stabilize the flow

## Coverage requirements
Do not stop at visible happy-path elements only. Cover the full page, including:
- page shell
- title / header / breadcrumbs
- primary CTA buttons
- search
- filters
- tabs
- chips / badges / counters
- list/table/card container
- headers / labels
- sorting
- pagination / infinite scroll / load more
- row actions
- kebab / overflow menus
- bulk actions
- dropdowns
- toggles
- checkboxes
- radios
- tooltips
- date pickers
- empty state
- no-results state
- loading / skeleton state
- error state
- permission-based visibility
- modals
- drawers
- confirmation dialogs
- toast / snackbar messages
- navigation links to create / edit / detail pages
- lazy-loaded sections
- below-the-fold UI after scrolling

## Exploration requirements
Validate against the live page in headed Chromium. Do not invent elements.

While exploring, explicitly inspect:
- default load state
- hover-only UI
- click-open menus
- dialogs and drawers
- scroll-revealed content
- row-level actions
- action-triggered network calls
- any linked create/edit/details navigation starting from this page

## Constraints
- keep changes surgical
- maintain repo conventions
- do not overabstract
- do not invent UI or APIs
- mention assumptions explicitly
- keep this POM focused on this page only
- maintain 1:1 mapping between this URL family and its page/locator/API files
- if linked pages open from this page, list them but do not expand them into separate POMs unless I ask

## Output format
Return results in this exact order:
1. Page summary
2. Full UI inventory
3. Locator plan
4. API inventory
5. POM design
6. Coverage gaps / risks
7. Final code
```
