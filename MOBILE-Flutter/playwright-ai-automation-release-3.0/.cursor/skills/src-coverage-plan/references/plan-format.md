# Plan output format

Write the plan to `runs/test_cases/<module>-test-script-plan.md`.

```
# <module> Test Script Plan

## Overview
Reviewed suites | Total cases | Executability %
Goals

---

## Scope
### In scope — N cases
Executable today (n): list
Blocked (n): list + reason

### Out of scope — N cases
Table: case(s) | reason

---

## Persona Mapping
Table: plan persona | instance role

---

## Data Strategy
### Source: <file or flow>
What it provides and how it is used

### Preconditions arranged in beforeAll
Bullet list of states created during setup

---

## Reusable Assets
### <area>
Files + what they provide

---

## Test Areas
### 1. <area name>
Cases | Pages | Flows

---

## Required src Changes
### Checklist — <area>
- [ ] pending item
- [x] completed item

---

## Execution Status
### Confirmed passed — user runs (n)
### Confirmed passed — agent runs (n)
### Blocked — not yet executed (n)
### Not yet executed (n)

---

## Blockers
## Success Condition
```

See `runs/test_cases/forms1-test-script-plan.md` as a completed reference example.
