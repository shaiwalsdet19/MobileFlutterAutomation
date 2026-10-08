

[REF: Onboarding Settings — flows/onboarding-settings.md]
---
uid: FLONB-C003
entity_name: "Onboarding Settings"
entity_type: policy_configuration
module: onboarding
cluster: flows
description: "Onboarding Settings is a policy_configuration in onboarding that controls tenant-wide toggles sitting above per-process Onboarding Process Configurations — OCR for document uploads, BGV defaults, auto-save behaviour, and the column configuration for onboarding form downloads."
is_optional: false
has_audit_trail: true
read_tool: get_onboarding_settings
write_tool: update_onboarding_settings
---

## Description

Onboarding Settings is the singleton tenant-level configuration that sits above per-process Onboarding Process Configurations. It captures the toggles that affect the entire onboarding module — OCR for document uploads, BGV defaults, auto-save behaviour, and the column configuration for onboarding form downloads.

## Knowledge Insight

Reach Onboarding Settings via **Admin > Settings > Flows > Onboarding > Advanced Settings** (breadcrumb: Flows / Onboarding / Advanced Settings [LIVE 2026-05-12]). The page exposes three sections: Other Settings, BGV Settings, and Onboarding Form Download Configuration [DOCS L2846].

The non-obvious boundary that admins repeatedly trip on: **tenant-level toggle vs per-process attribute**. Enable BGV Integration appears on both the tenant Other Settings (as a default) and on each Onboarding Process Configuration (as the actual operative value). When the per-process toggle is off, BGV is off for that process regardless of the tenant default.

The Onboarding Form Download Configuration table controls which columns appear in bulk onboarding data exports. The first two columns (Name, Candidate Id) are fixed-order and non-draggable; the remaining nine can be reordered by dragging and individually enabled or disabled. The Legal Entity column appears only when the Legal Entity module is enabled on the instance [SME 2026-05-12].

## Ideal Flow

1. **Initial setup** — Implementation team configures tenant-level defaults: enable OCR, set BGV default, toggle auto-save for onboarding forms.
2. **Download config setup** — Admin enables required columns and sets the order for Onboarding Form Download Configuration to match reporting needs. Enable the Legal Entity column only on instances where the Legal Entity module is active.
3. **Override per process** — When admins create Onboarding Process Configurations, the BGV default from Settings flows in but can be overridden per-process.
4. **Routine governance** — Admin returns to Settings whenever a tenant-wide change is needed (e.g., enable BGV globally, toggle OCR, adjust download columns).
5. **Audit** — All Settings changes appear in the platform audit trail.

## Constraints

- Singleton — exactly one record per tenant; cannot be deleted, only edited.
- Tenant BGV default flows into new Onboarding Process Configurations on creation; it does not retroactively change existing configurations.
- Settings changes are retroactive — platform reads current values at runtime; no version isolation for in-flight requests.
- Auto Save of Onboarding Form works only on the new-format onboarding form renderer; legacy form renderer is unaffected [HTML 2026-05-12 tooltip].
- Onboarding Form Download Configuration: Name and Candidate Id columns are fixed-order (non-draggable); remaining 9 columns can be reordered.
- Legal Entity column in the download config is only rendered when the Legal Entity module is enabled on the instance [SME 2026-05-12].

## Key Dependencies

**Upstream:** Tenant configuration. Legal Entity module availability (determines whether the `legal_entity_name` download column is visible).

**Downstream:** `onboarding-process-configuration` (inherits `enable_bgv_integration_default` on creation), `bgv-vendor` (BGV workflow activates when `enable_bgv_integration_default` is on), Onboarding Form Download exports (column set and order determined by `onboarding_form_download_configuration_order`).

============================================================
[REF: OnboardingProcessConfiguration — flows/onboarding-process-configuration.md]
---
uid: FLONB-C002
entity_name: OnboardingProcessConfiguration
entity_type: policy_configuration
module: onboarding
cluster: flows
description: "OnboardingProcessConfiguration is the master configuration entity of the Onboarding module — a policy_configuration that bundles forms, document clusters, verification packages, workflows, and automation rules into a single deployable experience scoped to a candidate population via User Assignments or Role scoping. Each configuration is versioned (auto-increments when building blocks are updated) and scoped by Applicability (Role Wise or Assignment Framework). When onboarding is initiated for a candidate, the system matches the candidate to the appropriate configuration and instantiates the bundled artifacts. Configurations support auto-initiation (triggered N days before Date of Joining), configurable completion criteria, SPOC auto-assignment, candidate reminders, and background verification integration."
is_optional: false
has_audit_trail: true
read_tool: read_onboarding_process
write_tool: SaveOnboardingProcess
---

## Form Fields
- `process_name` (required): [FORM 2026-05-08] [XHR 2026-05-08] [HTML 2026-05-15] 'Onboarding Process Name *' — required text field on Tab 1 (General Setup). Display name for the record (e.g., 'LN - Test Configuration'). Shown as the primary column in the list alongside version number (e.g., 'LN - Test Configuration (V30)'). API key: OnboardingProcessConfig[process_name]. HTML confirms minlength=5, maxlength=80.
- `version_number` (required): [LIVE 2026-05-08] Auto-incremented integer visible in list column as version suffix (e.g., 'V30', 'V25'). Increments whenever assigned forms, document clusters, or workflows are updated. In-progress candidates retain the version active at initiation — edits apply prospectively only. Not sent as a writable field in the Save payload — system-managed.
- `status` (required, enum: Active | Archived): [LIVE 2026-05-08] [XHR 2026-05-08] [SME 2026-05-08] Lifecycle status — two values only: Active and Archived. Active: config is live and used for onboarding initiation. Archived: deactivated; viewable via the Archived filter on the list page. No Draft state exists. New configs go directly to Active on creation. Transitions: Active→Archived via mode=archive; deletion via mode=delete (permanent removal). Default config cannot be deleted or archived.
- `applicability` (required, enum: 0 | 1): [FORM 2026-05-08] [XHR 2026-05-08] [SME 2026-05-08] [HTML 2026-05-15] 'Applicability' — radio button group on Tab 1. Stored as integer: 0 = 'Role Wise' (disabled in UI — deprecated); 1 = 'Assignment Framework' (active, only valid choice for new configs). Scopes the process via User Assignments — determines which candidate populations this config applies to. API key: OnboardingProcessConfig[assignment_type].
- `auto_initiation_trigger` (enum: 1 | 2): [FORM 2026-05-08] [XHR 2026-05-08] [HTML 2026-05-08] Trigger type for auto-initiation — dropdown next to the Days field in Tab 2. API key: initiation_attributes[auto_initiation][setting]. Full enum confirmed: 1 = 'Before Date of Joining'; 2 = 'After Adding to the Pending List'.
- `employee_activation_validation_mode` (enum: 2 | 3): [HTML 2026-05-08][HTML 2026-05-15][FORM 2026-05-15] Employee Activation validation mode — radio button group on Tab 4, visible when employee_activation_enabled is ON. API key: employee_activation[validation]. Stored as integer: 2 = 'All Fields in the Onboarding Form must be approved'; 3 = 'Onboarding must be completed'. Controls what must be true before the Activate button becomes clickable.
- `employee_activation_additional_validations` (enum: 4): [HTML 2026-05-08][HTML 2026-05-15][FORM 2026-05-15] Additional activation validation criteria — checkbox group on Tab 4. API key: employee_activation[additional_validations][]. Flat array of platform-fixed integer IDs. Only one option exists: '4' = 'All Mandatory Workflow Tasks must be completed'. Independent of the validation_mode radio — both conditions stack.

## Description

OnboardingProcessConfiguration is the master configuration entity of the Onboarding module — a policy_configuration that bundles forms, document clusters, verification packages, workflows, and automation rules into a single deployable experience scoped to a candidate population via User Assignments or Role scoping. Each configuration is versioned (auto-increments when building blocks are updated) and scoped by Applicability (Role Wise or Assignment Framework). When onboarding is initiated for a candidate, the system matches the candidate to the appropriate configuration and instantiates the bundled artifacts. Configurations support auto-initiation (triggered N days before Date of Joining), configurable completion criteria, SPOC auto-assignment, candidate reminders, employee data sync, and background verification integration.

### Knowledge Insight

Navigate to **Flows > Onboarding > Onboarding Process Configuration** (URL: `/onboarding/onboardingsettings/onboarding/onboardingprocessconfig`). Operate the live onboarding pipeline at **Admin Access > Onboarding** (`/ms/onboarding/yet-to-onboard`) — three tabs: Yet to Onboard / In Progress / Completed. Save action posts to `/onboarding/Onboardingsettings/SaveOnboardingProcess` via XHR.

The **#1 surprise:** process-config edits do NOT apply retroactively — candidates already in progress retain the config version active at initiation. The version_number suffix (V1, V13, V30...) in the list tracks this.

**Looks-like-a-bug behaviors:**
1. **Verification Package slot** — visibility controlled by `enable_bgv_integration` in OnboardingSettings (Advanced Settings on a separate page); editability of the Enable checkbox within the slot requires Onboarding Form slot to also be enabled in Tab 2. Two separate gates [SME 2026-05-15]. **ID Verification Package slot** — visibility gated on at least one ID verification vendor enabled in Studio; editability gated on Onboarding Form slot enabled in Tab 2 (HTML tooltip-confirmed [HTML 2026-05-08]). **Buddy Recommendation slot** — visibility gated on Buddy slot being enabled.
2. **Activate button greyed out** — employee_activation[validation] mode requires conditions not yet met, OR employee_activation_enabled is ON with unmet additional_validations.
3. **'No matching process config' error at initiation** — candidate's profile doesn't match any User Assignment linked to an Active config; admin must select manually.
4. **Standard Workflow → Custom Workflow migration is one-way** — cannot revert once changed.
5. **DOJ changes** auto-recalculate Custom Workflow trigger dates AND can silently reject all signed undertaking docs if 'Auto-Reject on DOJ Update' is ON on the linked undertaking cluster.
6. **Default config cannot be deleted or archived** — only Edit and Duplicate actions available on that row.

**Tab 2 slot structure (HTML+XHR confirmed):** 9 slots with independent Enable / Mandatory / Template Name sub-fields. Column semantics from HTML tooltips [HTML 2026-05-08]:
- **Enable**: "Only the attributes that are enabled below will be visible and used when initiating onboarding for candidates."
- **Mandatory**: "Onboarding cannot be initiated without the mandatory attributes. Auto-Initiation: auto-initiation will fail if templates are not assigned to mandatory attributes. Manual Initiation: user can initiate only if templates are assigned to all mandatory attributes."
- **Template Name**: "During auto-initiation, the selected template will automatically be assigned to the candidate. For manual initiation, the template fields will be pre-populated, but the initiator has the option to override them."
- **Buddy**: "A departmental peer who offers operational support, practical advice, and role-specific insights to ensure a smooth transition for new joiners."
- **Buddy Recommendation** row is a dependent child of Buddy — hidden until Buddy is enabled (`class="work_buddy_dep_row"`). Has only Enable, no Mandatory or Template.
- `work_buddy` has Enable + Mandatory but no Template (buddy is toggled, not templated).
- `verification_package` and `idv_package` are gated on Onboarding Form being enabled (HTML tooltip: "To enable this option, enable the Onboarding form.").

**Tab 4 fields (XHR-confirmed, UI not yet walked):** Employee Activation (enable + validation mode integer + additional_validations array), Auto-assignment of Onboarding SPOC, Candidate Reminder (enable + days + email template), Sync Data from Employee Profile.

## Ideal Flow

1. **Build blocks first** — Admin creates Onboarding Forms, Document Clusters (Sign-Off / Reference / Undertaking types), Onboarding Workflow, Verification Package (if BGV enabled). Welcome Page is scoped separately via its own User Assignment configuration — it is not assigned through OnboardingProcessConfiguration [SME 2026-05-15].
2. **Create config — Tab 1 (General Setup)** — Open Flows > Onboarding > Onboarding Process Configuration > Create Onboarding Process. Enter process name, optional description. Select Applicability (Role Wise or Assignment Framework). Link User Assignments if Assignment Framework selected.
3. **Configure initiation — Tab 2 (Onboarding Initiation)** — Enable/configure each slot via the slot table (Onboarding Form, Sign-Off / Undertaking / Reference Document Clusters, Onboarding Workflow, Verification Package, ID Verification Package, Buddy, Buddy Recommendation). Each slot has Enable + Mandatory + Template selectors. Configure Auto Initiation (enable + days + trigger setting).
4. **Set completion rules — Tab 3 (Onboarding Completion)** — Toggle which criteria must be met (form approved, sign-off signed, undertaking approved, workflow tasks completed, verification completed). Enable Auto Completion if desired.
5. **Additional settings — Tab 4 (Additional Configurations)** — Configure Employee Activation (enable, validation mode, additional validations), SPOC auto-assignment, Candidate Reminder (days + email template), Sync Data from Employee Profile.
6. **Save → Active** — Configs are Active immediately on creation (no Draft state). Only Active configs trigger onboarding initiation. New candidates matched to this config receive the bundled experience; in-progress candidates retain their original version.

### Constraints

- Default (V1) configuration cannot be deleted or archived — Edit and Duplicate actions only.
- `version_number` auto-increments on building block changes; in-progress candidates retain their initiation-time version.
- `work_buddy_recommendation` slot has no Mandatory or Template fields — enable-only (unlike all other slots).
- Auto Initiation will not fire if the candidate has no DOJ set.
- Auto-Reject on DOJ Update on linked Undertaking clusters silently rejects all signed undertaking docs on any DOJ change.
- `process_name` must be between 5 and 80 characters (HTML minlength/maxlength confirmed [HTML 2026-05-15]).
- `applicability` stored as integer: 0 = Role Wise (deprecated, disabled in UI), 1 = Assignment Framework. All new configurations must use value 1 [SME 2026-05-08][HTML 2026-05-15].
- Process-config edits apply prospectively to new onboardings only — in-progress candidates retain their initiation-time version.
- Multiple Active configurations prioritized by creation/modification timestamp — **most recently created or modified** matching config wins on auto-match [SME 2026-05-15].
- Tab 2 slot table: each slot independently configurable; configuring one does not affect others.
- **Tab 3 completion — auto-locked criteria [SME + HTML 2026-05-08]:** When Onboarding Form is enabled in Tab 2, "All Fields in the Onboarding Form must be approved" is automatically enabled AND locked (non-editable). Same auto-lock applies for Sign-Off → "All Sign-off Documents must be signed" and Undertaking → "All Undertaking Documents must be approved". These are system-enforced, not admin choices.
- **Tab 3 completion — manual criteria [SME 2026-05-08]:** "All Mandatory Workflow Tasks must be completed" is unlocked when Onboarding Workflow is enabled in Tab 2, but the admin must explicitly toggle it ON — it does not auto-enable. "E-Verify must be completed" follows the same pattern (manual, gated on E-Verify slot).
- **Verification Package gate [SME 2026-05-08][SME 2026-05-15]:** Two independent gates — do not conflate. (1) VISIBILITY: `enable_bgv_integration` must be ON in OnboardingSettings (Advanced Settings) for the slot to appear in Tab 2 at all. (2) EDITABILITY: once visible, the Enable checkbox within the slot can only be toggled ON when the Onboarding Form slot is also enabled in Tab 2. Visibility is controlled by a global setting on a separate entity; editability is a local Tab 2 slot dependency.
- `employee_activation[validation]=2` (form approval gate) requires `onboarding_form` slot to be enabled in Tab 2 — greyed out otherwise (tooltip-confirmed [HTML 2026-05-08]).
- `employee_activation[additional_validations][]=4` (workflow tasks gate) requires `workflow` slot to be enabled in Tab 2 — greyed out otherwise (tooltip-confirmed [HTML 2026-05-08]).
- `sync_data_from_employee_profile` requires `onboarding_form` slot to be enabled in Tab 2 (tooltip-confirmed [HTML 2026-05-08]). When ON, employee profile is the primary prefill source (employee profile → candidate profile → blank). When OFF, only the candidate profile (from recruitment) is used. Candidate profile prefill occurs regardless; this setting only controls whether employee core profile is also consulted as the priority source [SME 2026-05-15].
- `enable_auto_assignment_of_onboarding_spoc`: auto-assignment silently fails when multiple SPOCs match the candidate — HR must assign manually (tooltip-confirmed [HTML 2026-05-08]).
- `reminder_to_candidate_days` accepts integers 1–99 only (HTML min/max attributes confirmed).
- `idv_package` slot visibility requires **at least one ID verification vendor enabled in Studio** — if no vendor is configured, the slot does not appear in Tab 2 at all. When visible, also requires Onboarding Form to be enabled (tooltip gate). [SME 2026-05-08]
- `everify` slot visibility requires **at least one E-Verify app connection created under E-Verify in Studio** — if no app connection exists, the slot does not appear in Tab 2 at all. [SME 2026-05-08]

### Key Dependencies

**Upstream:** `user-assignment.md` (foundation) — scopes candidate audience when applicability = Assignment Framework. `onboarding-form.md`, `document-cluster.md` (sign-off / reference / undertaking), `onboarding-workflow.md`, `verification-package.md` — building blocks configured in Tab 2. `onboarding-permissions.md` — gates admin access.

**Downstream:** Onboarding Dashboard (`/ms/onboarding/yet-to-onboard`, `/ms/onboarding/inprogress`) — initiates candidates against this config. `onboarding-settings.md` (Advanced Settings — feature gates for BGV, ID Verification, Buddy slots; likely owns `enable_bgv_integration`). `onboarding-email-template.md` — referenced by `reminder_to_candidate_email_template`. SPOC auto-assignment (Tab 4 of this entity — rules configured here, not a separate entity), `onboarding-task-category.md` — fire in context of active Process Config. Employee activation — controlled by `employee_activation_*` fields.

============================================================
[REF: User Assignment — platform/user-assignment.md]
---
uid: PLPLT-M008
entity_name: "User Assignment"
entity_type: master_data
module: user-management
cluster: platform
ai_note: >
description: "Universal policy targeting mechanism in Darwinbox that defines attribute-based employee grouping rules with AND/OR logic on 200+ organizational predicates. Every module's policies (Leave, Payroll, Attendance, Performance, Onboarding, Travel, Reimbursement) are assigned to employees via User Assignments. This is the policy scope predicate engine that determines which employees receive which configurations. User Assignments are dynamically evaluated — membership updates automatically as employee attributes change (within ~6-hour propagation window)."
is_optional: false
has_audit_trail: true
read_tool: list_user_assignments   # [LIVE 2026-05-12 S20+S21] [XHR 2026-05-12 S22] GET /settings/company/assignment — server-side rendered HTML with all rows inline-embedded as a DataTables `data:` array (serverSide=false confirmed via dt.settings()[0].oFeatures.bServerSide=false). Production tenant instance8: aoData.length=910 (S19-S21 stable). Sandbox tenant corep.qa: aoData.length=25 (S22 baseline). Display: 3 columns ASSIGNMENT NAME, ASSIGNMENT CODE, ACTIONS; per-row 4 actions = Edit (.edit-bus), Delete (.delete-bus), Download Users (.users_tagged.employees-des), Policies tagged (.policies_tagged). Pagination client-side (10/25/50/100 per page). Companion ImportCenter route: /importCenter/index?import_type=assignmentframework. **Per-record read XHR (NEW S22 discovery):** GET /settings/getAssignment?pbqBeYWPUn=<csrf>&_=<unix_ms> 200 OK — fetches single assignment JSON when edit modal opens; CSRF passed as query parameter (UA-DRIFT-023 — anomalous for a write-CSRF pattern; explicitly a non-mutating GET so query-param CSRF is acceptable but inconsistent with POST conventions). **Companion audit-trail XHR (NEW S22):** POST /settings/activity 200 OK — fired after write operations, logs entity create/update/delete to audit trail (confirms has_audit_trail:true).
write_tool: save_user_assignment   # [XHR 2026-05-12 S22] [LIVE 2026-05-12 S21] [FORM 2026-05-12 S20+S21+S22] PATH A EXECUTED ON SANDBOX. **POST /settings/editassignment 200 OK** [XHR 2026-05-12 S22 corep.qa.darwinbox.io] — captured live on Gold-lift session by creating test record DBWALK_TEST_2026-05-12_UserAssignment with payload: TenantAssignmentFramework[name]=DBWALK_TEST_2026-05-12_UserAssignment, [description]=<dbwalk marker>, [applicable_for_process][]=[1] (Default), [attribute][0]=employee_type, [type][0]=include, [employee_type][]=[TYP_a623303de8b3d8] (Full Time), CSRF pbqBeYWPUn=<88-char base64>, mode=edit (always edit despite Create context — Yii controller routes), yt0=Create. Server response: 200 OK + redirect-back to /settings/company/assignment. Record persisted with auto-assigned code UAS_40 (next monotonic in tenant). Yii model prefix: TenantAssignmentFramework[...]. Form id="edit_com_bus_form" (legacy from Business Unit origin — UA-DRIFT-010). Method=post. Hidden `mode` is ALWAYS `edit` (not a real toggle — only the submit button value text varies: "Create" in create context, "Update" in edit context, UA-DRIFT-018). Submit button id=update_comp_bus_btn name=yt0. Payload shape: TenantAssignmentFramework[id] (base64-encoded internal PK), TenantAssignmentFramework[name], TenantAssignmentFramework[description], TenantAssignmentFramework[applicable_for_process][] (multi-select array of numeric tokens 1-66 non-contiguous). Predicate rows: TenantAssignmentFramework[attribute][N] (predicate-dimension token e.g. employee_type, department, grade) + TenantAssignmentFramework[type][N] (∈{include,exclude}) + per-attribute-keyed VALUE array `TenantAssignmentFramework[{attribute_key}][]` (e.g. `TenantAssignmentFramework[employee_type][]` carries selected employee_type IDs in `TYP_<hex>` format — captured: TYP_a623303de8b3d8=Full Time). Per-row VALUE field name is keyed by the chosen attribute, NOT generic `[value][N]` (UA-DRIFT-009 refinement, S21+S22 confirmed). Dynamic-name CSRF hidden field (`pbqBeYWPUn=<88-char base64>`) — NAME is PLATFORM-stable (UA-DRIFT-017 + UA-DRIFT-024: identical across instance8 production AND corep.qa sandbox); VALUE rotates per session. Companion XHRs captured S22: (a) **DELETE via POST /settings/EditAssignment** (CamelCase variant — UA-DRIFT-022) 200 OK — same controller, presumably with `delete` action param; (b) **GET /settings/getAssignment?pbqBeYWPUn=<csrf>&_=<ts>** 200 OK — per-record read XHR (NEW, refines read_tool: list page = GET /settings/company/assignment HTML, per-record fetch = GET /settings/getAssignment JSON with CSRF as query param — UA-DRIFT-023 anomalous CSRF-as-query-param); (c) **POST /settings/activity** 200 OK — audit-trail logging XHR (validates has_audit_trail:true). UA-CLEANUP-002 RETIRED 2026-05-12 S22 — sandbox tenant provided by user, full cleanup verified (25→26→25 record count, DBWALK_TEST search returns 0 rows post-cleanup).
---

## Form Fields
- `assignment_name` (required): Unique display name for the User Assignment (e.g., 'Sales Team Delhi', 'Engineering Managers'). Mandatory at create; tenant-customisable; appears as the label in every consumer module's reference picker dropdown. [KB-PRESERVED 2026-05-09] [DERIVED 2026-05-09 from reference:UserAssignment usage in 8+ consumer entities] [FORM 2026-05-12] visible label 'Assignment Name *', input id=`TenantAssignmentFramework_name`, name=`TenantAssignmentFramework[name]`, type=text, mandatory marker `*` confirmed.
- `applicable_for_process` (required, enum: 1=Default | 2=Confirmation | 3=Separation | 4=Contract | 5=Disciplinary Policy | 6=Notice Period | 7=Retirement Period | 8=Custom Flows | 9=Permissions | 58=Standard Permissions | 10=Email Digest | 15=Recognition | 13=Vibe | 14=Pulse | 25=Travel | 26=Expense | 31=Data Purge (Inactive Employees) | 32=Data Purge (Candidates) | 33=Employee ID Auto Numbering | 53=Leave | 36=New Goal Plan Framework | 37=Review Cycle | 38=Map N-Grid | 39=Team Goal | 40=Feedback | 41=Talent Review Cycle | 42=Review Parameter Mapping | 43=Performance Calibration | 55=Restrict User Assignments from Universal Search | 50=Learning | 51=Career and Development alias framework | 46=Talent Nomination Rule | 47=Talent Succession Plan | 48=Skill Endorsement Rule | 52=Skill Setting | 44=Studio | 57=Local Alias for Profile fields | 56=Position Custom Field | 63=Bank Policy | 60=Talent Calibration | 62=Platform Theme Settings | 66=Dashboard Banner Configuration | 59=Scheduling | 65=Visiting Card Settings | 16=Helpdesk | 29=Jobs | 61=Raise Requisition Scope | 17=Confidential Letters | 19=Employee Onboarding Letters | 24=Employee Separation Letters | 20=Company Custom Letters | 21=During the course of employment Letters | 22=HR Policies | 23=Letter Generation Settings | 28=Additional Assignments | 27=Onboarding | 34=Payroll | 35=Chatbot | 54=Surveys | 45=Engagement): Process(es) this assignment is available for. Scopes which modules can use this assignment as a target predicate. Multi-select; the special token '55=Restrict User Assignments from Universal Search' acts as a UI scoping flag rather than a process category. Filters the visibility of this UAF in downstream module policy edit pickers (e.g., a UAF with applicable_for_process=Leave[53] does NOT appear in PayrollPolicy.user_assignment dropdown). [KB-PRESERVED description 2026-05-09] [HTML 2026-05-12] all 60 stored-value tokens re-confirmed (S20 independent re-walk of S19 capture). Token format: `{numeric_id}={display_label}`. Stored token = numeric integer (1–66 non-contiguous); display label = English UI string. UA-DRIFT-013 raised: 3 tokens had display label shortening between 2026-05-10 and 2026-05-12 (37: 'Review Alias Cycle'→'Review Cycle'; 39: 'Team Goal Alias'→'Team Goal'; 40: 'Continuous Feedback'→ 'Feedback'). Stored numeric IDs unchanged. The 'All' meta-token is NOT present as a stored value — multi-select with all 60 = effective 'all'. UA-DRIFT-007 disposition stable (KB 15 labels → live 60 stored tokens, 4× under-coverage gap preserved for guardian).
- `include_predicates` (required): JSON rule-builder configuration defining attribute-based inclusion conditions with AND logic at the dimension level and OR logic within a single dimension's value set (e.g., Department IN [Engineering, Product] AND Grade IN [L3, L4]). Supports 228 predicate dimensions on instance8 (varies per tenant) — see predicate_dimensions attribute for the full taxonomy. Stored as serialised JSON; rendered in the UI via the rule-builder widget. Predicates are dynamic — when an org entity referenced in a predicate (Department, Grade, Location) is renamed or restructured, the predicate auto-re-evaluates against the new state. [KB-PRESERVED 2026-05-09] [LIVE 2026-05-10] [LIVE 2026-05-12] [FORM 2026-05-12] form-side representation re-confirmed: the Create/Edit UI exposes a SINGLE attribute table with repeating rows; each row carries `TenantAssignmentFramework[attribute][N]` (predicate dimension token), `TenantAssignmentFramework[type][N]` (`include`|`exclude`), `TenantAssignmentFramework[value][N]` (the matched value). Backend de-multiplexes form rows by `type` into 2 storage-side JSON arrays (this `include_predicates` field + the `exclude_predicates` sibling field). UA-DRIFT-009 remains raised to schema-guardian — disambiguation gated on read-XHR DB-shape capture (deferred under carve-out).
- `status` (required, enum: Active | Inactive): Whether the User Assignment is currently active. Inactive UAFs are hidden from consumer policy edit pickers but historical assignments using the UAF are preserved. Toggle controlled via Activate/Deactivate row action. [KB-PRESERVED 2026-05-09]. [LIVE 2026-05-12] note: no Active/Inactive filter chip visible on list page (S19 narrative summary claim disconfirmed — UA-DRIFT-014); status enum is per-record state, surfaced only on Edit (not exercised in S20).

## Description

<!-- [KB-PRESERVED 2026-05-09] -->
Universal policy targeting mechanism in Darwinbox that defines attribute-based employee grouping rules with AND/OR logic on 200+ organizational predicates. Every module's policies (Leave, Payroll, Attendance, Performance, Onboarding, Travel, Reimbursement) are assigned to employees via User Assignments. This is the policy scope predicate engine that determines which employees receive which configurations. User Assignments are dynamically evaluated — membership updates automatically as employee attributes change.

### Knowledge Insight

<!-- [KB-PRESERVED 2026-05-09] -->
User Assignment (UAF) is the policy targeting engine — it defines predicate-based audience rules (by Department, Grade, Band, Employee Type, etc.) used by Leave, Payroll, Attendance, Performance, and other modules to apply configurations to the right employees. Issues occur when a User Assignment's predicate references an org entity (Department, Grade) that is renamed, archived, or restructured — the predicate silently becomes stale and may over-include or exclude employees from the policy, with changes propagating with up to a 6-hour delay. To review User Assignment configurations, go to Settings > Platform > User Assignments > [UAF name] and verify all predicate dimension values are current.

## Ideal Flow

<!-- [KB-PRESERVED 2026-05-09] -->
1. **Access User Assignments:** Navigate to Admin Access > Settings > Platform > Additional Configurations > User Assignments
2. **Create Assignment:** Click 'Create Assignment' and enter Assignment Name and optional Description
3. **Select Applicable Process:** Choose the process(es) this assignment applies to (Leave, Attendance, Payroll, Flow, All, etc.)
4. **Define Include Predicates:** Configure attribute-based rules using the rule builder (e.g., "Department = Engineering AND Grade >= L3")
   - Multiple values within same attribute work as OR (Department = {Eng, Sales})
   - Multiple attributes work as AND
5. **Add Exclusions (Optional):** Configure exclusion rules to subtract employees from the include set
6. **Add Specific Employees (Optional):** Manually add individual employees outside rule logic
7. **Verify Assignment:** Click 'Download' to preview matched employees before activating
8. **Activate:** Save the assignment; it automatically propagates to policy configurations

**Preconditions:** Organizational entities (Department, Grade, Location, Employee Type, etc.) must exist before being used in predicates.

**Activation:** User Assignment takes effect within 6 hours; policies matching the assignment are automatically applied to qualifying employees.

### Constraints

<!-- [KB-PRESERVED 2026-05-09] -->
1. **No Effective Dating:** User Assignments are not effective-dated — changes take effect immediately (within 6-hour propagation window) for all policies using the assignment
2. **Immutability of Auto-Generated Code:** User Assignment Code (UAS_N) is auto-generated with non-reusable deleted codes — once a code is deleted, the number is never reused
3. **Predicate Staleness Risk:** Deleted org entities (Departments, Grades, Locations) referenced in predicates are not automatically cleaned up — stale predicates silently fail to match intended employees
4. **Single Applicable Policy Per Role Per Employee:** When multiple User Assignment policies exist for the same role, the first-created policy applies to the employee; overlap is not supported

### Key Dependencies

<!-- [KB-PRESERVED 2026-05-09] -->
**Upstream (Prerequisites):**
- **Organization Entities** — Department, Grade, Band, Location, Business Unit, Designation, etc. must exist before being used as predicate dimensions
- **Employee (ORCOR-X001)** — Employees must exist to be evaluated against User Assignment predicates
- **Custom Fields (PLPLT-M003)** — Custom employee profile fields can be used as predicate dimensions if configured

**Downstream (Dependents):**
- **Leave Policies** — Leave policies are assigned to employees via User Assignments for differential applicability
- **Payroll Policies** — Payroll components and tax rules are targeted via User Assignments
- **Attendance Policies** — Attendance rules and shifts are scoped to User Assignments
- **Flows** — Workflow initiation and routing can be conditional on User Assignment membership
- **Performance Cycles** — PMS cycles target employees via User Assignments
- **MSF Cycles** — 360 / multi-source feedback cycles target via UAF
- **Talent Reviews & Career Development** — `reference:UserAssignment` confirmed in talent/review-cycle, talent/talent-review, talent/individual-development-plan, talent/learning-setup-wizard, talent/career-development-framework, talent/verification-package
- **Access Control** — Permissions and role policies can scope access by User Assignment
- **Onboarding & Offboarding** — Lifecycle workflows use User Assignments for process targeting
- **Travel & Reimbursement Policies** — Policy applicability is determined by User Assignment
- **Reports** — User Assignments appear as filtering dimensions in organizational and policy reports

============================================================
[REF: VerificationPackage — platform/verification-package.md]
---
uid: PLPLT-C011
entity_name: "VerificationPackage"
entity_type: policy_configuration
module: platform-config
cluster: platform
description: "VerificationPackage is a policy_configuration in platform that bundles verification types (Education, Employment, Criminal, Address, Identity, Reference, Credit, Drug Test, etc.) with a specific BGV Vendor for background-verification checks. Each package applies to an Onboarding or Pre-Offer context and is scoped to a candidate population via User Assignment. Packages are consumed by Onboarding Process Configurations to drive BGV during onboarding or pre-offer screening."
is_optional: true
has_audit_trail: true
read_tool: "verificationSettings/GetVerificationPackages"  # [XHR 2026-05-11] confirmed from live curl: GET /verificationSettings/GetVerificationPackages
write_tool: "verificationSettings/EditVerificationPackages"  # [XHR 2026-05-11] confirmed from live curl: POST /verificationSettings/EditVerificationPackages; mode param = create|update; form-encoded
---

## Form Fields
- `package_name` (required): Display name of the verification package. Admin-assigned at creation.
- `applicable_for` (required, enum: {'label': 'Onboarding', 'stored_value': '2'} | {'label': 'Pre-Offer', 'stored_value': '1'}): Context in which this package applies. Onboarding (stored: 2): package fires during the onboarding process. Pre-Offer (stored: 1): package fires for pre-offer screening before offer issuance. Controls which additional fields are visible: Pre-Offer shows the 'Applicable To' user assignment scoping field; Onboarding does not. Immutable after creation — this field is set once at create time and becomes read-only on the edit form.
- `verification_type` (required, enum: {'label': 'Onboarding BGV', 'stored_value': '1'} | {'label': 'ID Verification', 'stored_value': '2'} | {'label': 'Trigger Verification', 'stored_value': '3'}): The mechanism by which this package performs verification. Onboarding BGV (1): vendor-managed BGV during onboarding, requires Verification Partner from tenant-created vendors (hex IDs). ID Verification (2): document-to-system field mapping verification, requires Verification Partner from platform-seeded vendors only (singpass/equal/trublu) + document mapping rows. Trigger Verification (3): on-demand field-based verification, requires Allowed Fields configuration, no partner required. Controls conditional visibility of dependent fields. Immutable after creation — this field is set once at create time and becomes read-only on the edit form.

## Description

VerificationPackage is a policy_configuration that bundles verification types (Education, Employment, Criminal, Address, Identity, Reference, Credit, Drug Test, etc.) with a specific BGV Vendor for background-verification checks. Each package applies to an Onboarding or Pre-Offer context and is scoped to a candidate population via User Assignment. Packages are consumed by Onboarding Process Configurations to drive BGV during onboarding or pre-offer screening.

## Knowledge Insight

Configure at Platform > Additional Configurations > Verification Packages (admin URL `/VerificationSettings/verification/verificationpackages`). The whole entity is gated by 'Enable BGV' in Settings > Flows > Onboarding > Advanced Settings > BGV Settings — when BGV is OFF, the Verification Package slot in Process Config is hidden and this settings page may not even appear. The most common BGV-not-triggering escalation has three root causes to check in order: (1) package is assigned in the matching Process Config, (2) package's User Assignment includes the candidate, (3) BGV Vendor has valid login credentials. Looks-like-a-bug: a vendor deletion silently invalidates every Verification Package referencing it — admins should always update vendor references first. Applicable For determines whether the package fires during onboarding (post-offer) or pre-offer screening — the same package cannot serve both contexts; create separate packages.

**Verification Type determines available partners:** Onboarding BGV packages draw from all tenant-configured vendors; ID Verification packages draw exclusively from platform-integrated vendors (Singpass, Equal, TruBlu). This means an admin cannot use a custom BGV vendor for ID Verification — they must use one of the three platform-integrated partners. [LIVE 2026-05-15]

## Ideal Flow

1. Admin enables 'Enable BGV' at Settings > Flows > Onboarding > Advanced Settings > BGV Settings.
2. Admin creates / verifies the BGV Vendor at Platform > Additional Configurations > BGV Vendors with valid login credentials.
3. Admin opens Platform > Additional Configurations > Verification Packages and clicks 'Create Verification Package'.
4. Admin selects Applicable For (Onboarding or Pre-Offer), enters Verification Package Name, optionally enters Verification Package ID, then selects Verification Type.
5. Based on Verification Type: Onboarding BGV → select Verification Partner (from tenant vendors); Trigger Verification → select Allowed Fields (required) + optionally Reporting Field; ID Verification → select Verification Partner (platform-seeded: Singpass/Equal/TruBlu only) + add document field mapping rows.
6. If Applicable For = Pre-Offer, optionally scope to a User Assignment via the Applicable To field.
7. Admin saves. Package becomes available for selection in Onboarding Process Configuration > Tab 2 > BGV slot. At candidate initiation, BGV is triggered for matched candidates.

## Constraints

- Entire entity is gated by 'Enable BGV' toggle in Advanced Settings — without BGV enabled, the Verification Package slot is hidden in Process Config and this settings page may not appear.
- Verification Partner (BGV Vendor) must have valid login credentials configured before a package can function.
- Applicable For determines context: Onboarding packages are used during onboarding; Pre-Offer packages are used before offer issuance — the same package cannot serve both.
- **Applicable For and Verification Type are immutable after creation.** Once a package is saved, these two fields are locked and cannot be changed on the edit form. If the wrong values were set at create time, the package must be deleted and recreated. [SME 2026-05-18]
- Deleting a BGV Vendor invalidates all Verification Packages referencing it.
- Package configuration changes apply to future verifications; in-progress BGV checks are not affected.
- For ID Verification packages, only platform-seeded vendors (Singpass, Equal, TruBlu) are available — tenant-created custom vendors cannot be used for ID Verification. [LIVE 2026-05-15]
- Changing Applicable For resets the Verification Type selection. [HTML 2026-05-15]

## Key Dependencies

**Upstream:** `bgv-vendor.md` — supplies the verification partner; vendor credentials are required for the package to function. `user-assignment.md` (foundation) — scopes which candidates receive this BGV check.

**Downstream:** `onboarding-process.md` — consumes Verification Packages in Tab 2's BGV slot. Per-candidate BGV records instantiated from this package at onboarding initiation. Onboarding Dashboard > In Progress — surfaces BGV verification status per candidate.

============================================================
[REF: BGV Vendor — platform/bgv-vendor.md]
---
uid: PLPLT-M010
entity_name: "BGV Vendor"
module: platform
cluster: platform
entity_type: master_data
description: "BGV Vendor is a master_data in platform that represents an external background-verification partner registered in the system. Each vendor receives portal credentials, a country/timezone scope, and optionally a logo; tenants assign vendors to Verification Packages used during onboarding initiation."
is_optional: true
has_audit_trail: true
read_tool: list_bgv_vendors
write_tool: create_bgv_vendor
admin_url: "https://instance8.darwinbox.in/VerificationSettings/verification/bgvvendor"
---

## Form Fields
- `bgv_name` (required): Display name of the BGV vendor, shown in the BGV Vendors list and in the Select BGV Vendor dropdown during Onboarding Initiation.
- `bgv_email` (required): Vendor's login email for the BGV Portal. Acts as the username during sign-in. Must be unique across all vendor records.
- `bgv_password` (required): Initial password set by the admin when creating the vendor. Stored hashed. Present in the Add BGV Vendor (create) form and in the Reset BGV Vendor Password modal — absent from the standard Edit flow. Cannot be changed via Edit BGV Vendor.
- `bgv_country` (enum: Afghanistan | Albania | Algeria | American Samoa | Andorra | Angola | Anguilla | Antarctica | Antigua and Barbuda | Argentina | Armenia | Aruba | Australia | Austria | Azerbaijan | Bahamas | Bahrain | Bangladesh | Barbados | Belarus | Belgium | Belize | Benin | Bermuda | Bhutan | Bolivarian Republic of Venezuela | Bosnia and Herzegovina | Botswana | Bouvet Island | Brazil | British Indian Ocean Territory | Brunei Darussalam | Bulgaria | Burkina Faso | Burundi | Cambodia | Cameroon | Canada | Cape Verde | Cayman Islands | Central African Republic | Chad | Chile | China | Christmas Island | Cocos (Keeling) Islands | Colombia | Comoros | Congo | Cook Islands | Costa Rica | Croatia | Cuba | Cyprus | Czech Republic | Democratic People's Republic of Korea | Denmark | Djibouti | Dominica | Dominican Republic | Ecuador | Egypt | El Salvador | Equatorial Guinea | Eritrea | Estonia | Ethiopia | Falkland Islands (Malvinas) | Faroe Islands | Federated States of Micronesia | Fiji | Finland | France | French Guiana | French Polynesia | French Southern Territories | Gabon | Gambia | Georgia | Germany | Ghana | Gibraltar | Greece | Greenland | Grenada | Guadeloupe | Guam | Guatemala | Guernsey | Guinea | Guinea-Bissau | Guyana | Haiti | Heard Island and McDonald Islands | Honduras | Hong Kong | Hungary | Iceland | India | Indonesia | Iraq | Ireland | Islamic Republic of Iran | Isle of Man | Israel | Italy | Ivory Coast | Jamaica | Japan | Jersey | Jordan | Kazakhstan | Kenya | Kiribati | Kosovo | Kuwait | Kyrgyzstan | Laos | Latvia | Lebanon | Lesotho | Liberia | Libya | Liechtenstein | Lithuania | Luxembourg | Macau | Macedonia | Madagascar | Malawi | Malaysia | Maldives | Mali | Malta | Marshall Islands | Martinique | Mauritania | Mauritius | Mayotte | Mexico | Monaco | Mongolia | Montenegro | Montserrat | Morocco | Mozambique | Myanmar | Namibia | Nauru | Nepal | Netherlands | Netherlands Antilles | New Caledonia | New Zealand | Nicaragua | Niger | Nigeria | Niue | Norfolk Island | Northern Mariana Islands | Norway | Oman | Pakistan | Palau | Panama | Papua New Guinea | Paraguay | Peru | Philippines | Pitcairn Islands | Plurinational State of Bolivia | Poland | Portugal | Puerto Rico | Qatar | Republic of Korea | Republic of Moldova | Republic of South Sudan | Romania | Russian Federation | Rwanda | Réunion | Saint Helena | Saint Kitts and Nevis | Saint Lucia | Saint Martin | Saint Pierre and Miquelon | Saint Vincent and the Grenadines | Samoa | San Marino | Sao Tome and Principe | Saudi Arabia | Senegal | Serbia | Seychelles | Sierra Leone | Singapore | Slovakia | Slovenia | Solomon Islands | Somalia | South Africa | South Georgia and the South Sandwich Islands | South Sudan | Spain | Sri Lanka | State of Palestine | Suriname | Svalbard and Jan Mayen | Swaziland | Sweden | Switzerland | Syrian Arab Republic | Taiwan | Tajikistan | Thailand | The Democratic Republic of the Congo | Timor-Leste | Togo | Tokelau | Tonga | Trinidad and Tobago | Tunisia | Turkey | Turkmenistan | Turks and Caicos Islands | Tuvalu | Uganda | Ukraine | United Arab Emirates | United Kingdom | United Republic of Tanzania | United States | United States Minor Outlying Islands | Uruguay | Uzbekistan | Vanuatu | Vatican City State | Vietnam | Virgin Islands, British | Virgin Islands, U.S. | Wallis and Futuna | Western Sahara | Yemen | Zambia | Zimbabwe | Åland Islands): Country in which the BGV vendor operates, selected from the 'BGV Country' dropdown (249 platform-fixed countries). Optional — no asterisk on Add or Edit forms.
- `time_zone` (enum: +270|Kabul | +180|Kuwait | +240|Dubai | +180|Baghdad | -180|Buenos Aires | +600|Melbourne | +240|Baku | +360|Dhaka | +180|Minsk | -60|Cape Verde Is. | +240|Yerevan | -360|Central Time (US & Canada) | 360|Qostanay | +60|Belgrade | +60|Sarajevo | 660|Efate | -360|Mexico City | +480|Hong Kong | +180|Nairobi | -300|Toronto | +120|Cairo | +120|Jerusalem | 120|Tripoli | +720|Fiji | +120|Helsinki | +240|Tbilisi | +00|Greenwich Mean Time : Dublin | +00|Monrovia | +120|Athens | -600|Rarotonga | +330|Kolkata | +210|Tehran | +540|Seoul | 240|Mahe | +00|Casablanca | +390|Rangoon | +345|Kathmandu | +720|Auckland | -180|Montevideo | -480|Pacific Time (US & Canada) | +300|Karachi | -240|Asuncion | +60|Brussels | -180|Cayenne | -300|Bogota | -240|La Paz | 780|Apia | +420|Bangkok | 480|Brunei | +480|Kuala Lumpur | +480|Manila | +480|Singapore | +120|Harare | +330|Sri Jayawardenepura | +480|Taipei | +540|Tokyo | +780|Nuku'alofa | +120|Istanbul | +480|Ulaan Bataar | -660|Midway Island | -270|Caracas | +60|West Central Africa | +60|Amsterdam | 300|Ashgabat | +600|Guam | -240|Atlantic Time (Canada) | 720|Nauru | -120|South_Georgia | 120|Windhoek | +240|Moscow | 840|Kiritimati | -360|Denver | 180|Amman | 180|Beirut | 180|Damascus | 180|Uzhgorod | -180|Greenland | -240|Santiago | -180|Brasilia | -120|Miquelon | -420|Mazatlan | -420|Mountain Time (US & Canada) | -120|Mid-Atlantic | -60|Azores | +360|Ekaterinburg | +420|Novosibirsk | +480|Perth | +570|Adelaide | +570|Darwin | +600|Brisbane | +720|Kamchatka | -540|Alaska | -540|Gambier | -420|Whitehorse | -360|Regina | -240|Campo_Grande | -240|Grand_Turk | -180|Araguaina | -180|Bahia | -180|Punta_Arenas | -180|Rothera | +600|Hobart | -360|Easter | 360|Bishkek | 180|Juba | -480|Tijuana | +540|Irkutsk | +180|Volgograd | -300|Cancun | -240|Port-au-Prince | -240|Havana | 180|Chisinau | -420|Chihuahua | -360|Costa_Rica | +00|London | -150|St_Johns | 360|Omsk | -480|Pitcairn | -240|Norfolk | -540|Adak | -570|Marquesas | 525|Eucla | 630|Lord_Howe | 765|Chatham | 120|Khartoum): Vendor's operating time zone, shown as 'Timezone' in the UI. Platform-fixed list of ~115 timezones. Optional — no asterisk on Add or Edit forms.

## Description

BGV Vendor is the master record for an external background-verification partner. Each vendor has a self-service login on the BGV Portal where they verify candidate data; the platform manages credentials, logo, country, and time zone. Despite being consumed by the Onboarding workflow, this entity lives under Platform → Additional Configurations in the admin menu.

## Knowledge Insight

Manage BGV Vendors at **Admin > Platform > Additional Configurations > BGV Vendor** ([LIVE 2026-05-11] URL: `/VerificationSettings/verification/bgvvendor`). Note that despite being a verification entity used in onboarding, the master record sits under Platform, not Onboarding [DOCS L1594, L1609].

Two operational surprises:
1. The **Edit BGV Vendor** flow does **not** permit password changes. Password resets go through a separate **Reset BGV Vendor Password** modal [DOCS L1633].
2. BGV Portal login enforces **Two-Factor Authentication** by platform default — this is non-negotiable due to PI-data exposure [DOCS L1584]. Vendors authenticate at `<instance>/onboarding/onboarding/bgv` and only see candidate fields where "Enabled for Verification" is toggled on.

The Download Translations button on the BGV Vendors list page allows exporting label translations for the vendor list.

A third operational surprise: **permissions follow the Onboarding module, not Platform**. Despite the entity living under Platform → Additional Configurations, access is controlled by the Onboarding permission sub-module (`onboarding.onboarding`). The relevant permission codes are `manage_onboarding_bgv` (add/edit/delete/reset) and `view_onboarding_details_bgv_report` (read-only BGV report access). Confirmed from permissions-catalog.md [CSV 2026-04-25].

**Recruitment downstream:** BGV Vendors with `enable_recruitment=1` surface in two Recruitment contexts [LIVE 2026-05-11 SME]: (1) **Hiring Workflow Templates** (Settings > Hiring Workflow > Verification step > "Select Vendor") — vendor selected alongside a Verification Package; (2) **Job-level Requisition stage config** (Recruitment > Requisition stage edit > Verification type > "Select BGV Vendor"). Vendors with `enable_recruitment=0` are invisible in these surfaces and available only during Onboarding Initiation. `activation_flag` is **not applicable** — BGV Vendor records are always accessible once created; the "Enable BGV" toggle in Onboarding Settings controls the onboarding BGV feature but does not gate the vendor master records [SME 2026-05-11].

## Ideal Flow

1. **Add Vendor** — Admin navigates to Platform > Additional Configurations > BGV Vendor and clicks **Add BGV Vendor**.
2. **Capture details** — Enter BGV Name, Email, Password, upload Logo (optional), select BGV Country and Time Zone.
3. **Save** — Vendor record created; vendor now appears in the Onboarding Initiation page's **Select BGV Vendor** dropdown.
4. **Reset password if needed** — Use the dedicated **Reset BGV Vendor Password** modal (separate from Edit) when the vendor forgets or compromises their credentials [DOCS L1633].
5. **Edit other attributes** — Use the Edit icon (✏️) to update name, email, country, time zone, logo. Password field is excluded from the Edit modal.
6. **View vendor details** — Use the View icon (🔍) for read-only inspection.
7. **Delete vendor** — Use the Delete icon (🗑️) to remove a vendor. Avoid deleting vendors with active candidate assignments — in-progress BGV checks will break.
8. **Export vendors** — Use the ⋮ ellipsis menu → **Export BGV Vendor** to bulk-export the vendor list as a file download. Routed through the Import Center: `GET /import/exportData/type/bgv_vendor`.

## Constraints

- BGV Email must be unique across all vendor records — it is the portal login key.
- Editing a vendor record cannot change the password; use the **Reset BGV Vendor Password** action [DOCS L1633].
- Two-Factor Authentication is enforced for all BGV Portal logins regardless of tenant-level 2FA settings [DOCS L1584].
- A vendor with active candidate assignments should not be deleted — in-progress background verification checks will lose their vendor association.
- The vendor login URL is platform-fixed: `<instance>/onboarding/onboarding/bgv` [DOCS L1583].
- BGV Vendor selection in Onboarding Initiation is only available when the BGV feature is enabled (via Enable BGV toggle in Onboarding Settings). The vendor master records themselves are always accessible regardless of this toggle.
- A BGV Vendor only appears in Hiring Workflow Templates and job-level Verification stages when `enable_recruitment=1` is set on the vendor record. Vendors with `enable_recruitment=0` are onboarding-only. <!-- 2026-05-18: "Recruitment Hiring Workflow" (TAREC-P009) deprecated as duplicate; reference now to HiringWorkflow (TAREC-P005, hiring-workflow.md) -->

## Key Dependencies

**Upstream:** Platform 2FA service, API Configuration entity (for api_configuration reference), Custom Field records (for initiation_custom_fields multi-select). Country and Timezone are platform-fixed enums embedded directly in the schema (not separate entities).

**Downstream:** `verification-package.md` (Verification Packages reference BGV Vendors), Onboarding Initiation page (Select BGV Vendor dropdown), Onboarding Initiation Templates → Verification Package Name surface, Onboarding Initiation Logs (vendor changes audited per DOCS L5159–L5161). When `enable_recruitment=1` [SME 2026-05-11]: (1) Hiring Workflow Templates → Verification step → “Select Vendor” dropdown (`/settings/OpenHiringWorkflowTemplate/id/{id}`); (2) Job-level Requisition Stage edit → Verification type → “Select BGV Vendor” dropdown (`/recruitment/recruitment/requisitionstagethree/id/{id}/edit/1`).

============================================================
[REF: DocumentCluster — flows/document-cluster.md]
---
uid: FLONB-C001
entity_name: "DocumentCluster"
entity_type: policy_configuration
module: onboarding
cluster: flows
description: "DocumentCluster is a policy_configuration in the onboarding module that groups individual Onboarding Documents by interaction type (Sign-Off, Reference, or Undertaking) and exposes them as a single bundle that an Onboarding Process Configuration can assign to candidates."
is_optional: true
activation_flag: null  # No activation flag — DocumentCluster has no draft/inactive state; clusters are active immediately on creation. [SME 2026-05-12]
has_audit_trail: true
read_tool: GetDocsCluster
write_tool: editDocumentCluster
cross_field_validations:
---

## Form Fields
- `cluster_name` (required): Display name of the document cluster. Mandatory on create and edit. Mutable — can be changed after creation. [LIVE 2026-05-12]
- `select_type` (required, enum: Sign-Off | Reference | Undertaking): Cluster type determining candidate interaction. Sign-Off = candidate reviews and acknowledges/signs (no upload). Reference = read-only documents shown to candidate. Undertaking = candidate fills and digitally signs (may include digital signature via Form Builder PDF Forms).

## Description

DocumentCluster is a policy_configuration in the Onboarding module that groups individual Onboarding Documents by interaction type (Sign-Off, Reference, Undertaking) and exposes them as a single bundle that the Onboarding Process Configuration can assign to candidates. Each cluster has a type, a multi-select of underlying documents, and an optional auto-reject-on-DOJ-change behavior for undertaking documents.

## Knowledge Insight

Configure clusters at Settings > Flows > Onboarding > Document Clusters (admin URL `/onboarding/onboardingsettings/onboarding/docclusters`). The #1 surprise: when Auto-Reject on DOJ Update is ON for an Undertaking cluster, ANY change to a candidate's Date of Joining silently rejects every signed undertaking document and forces re-signature — admins frequently report this as a candidate "losing" their signed docs. Looks-like-a-bug: documents disappear from a cluster after archive — by design, archiving an Onboarding Document automatically removes it from every cluster it was in. Mandatory is per-document inside the cluster, not a cluster-level setting, which surprises admins who configured mandatory-vs-optional at the wrong level.

**[LIVE 2026-05-12] Additional operational notes:** The edit modal is titled "Edit Onboarding Template" (not "Edit Document Cluster") — use this label in user-facing documentation. Select Type is locked after creation — an Undertaking cluster cannot be converted to Reference; admins must archive and recreate. Bulk operations (Export / Import Document Clusters) are available from the ⋮ menu on the list page. Clusters not linked to any Onboarding Process Configuration can be permanently deleted; clusters in use can only be archived.

**[SME + HTML 2026-05-12] Critical architectural difference by type:** Undertaking clusters do NOT use regular OnboardingDocuments — they link to documents from two separate modules via a single combined picker. The Select Documents picker switches entirely based on Select Type: Reference/Sign-Off shows the OnboardingDocument picker (`OnBoardingDocsClusters[documents][]`); Undertaking shows a combined picker (`documents[]`) with two optgroups:
- **HTML Forms** → sourced from **HR Documents > Undertaking Documents** (HTML undertaking templates, 14-char hex IDs)
- **PDF Forms** → sourced from **Form Builder > PDF Forms** (PDF form templates, mixed 14/23-char hex IDs)

This means Undertaking cluster setup requires both HR Documents configuration (for HTML undertaking templates) and Form Builder configuration (for PDF forms), while Reference/Sign-Off documents are static uploads managed in Settings > Onboarding > Onboarding Documents.

## Ideal Flow

**For Reference / Sign-Off clusters:**
1. Admin creates Onboarding Documents at Settings > Flows > Onboarding > Onboarding Documents.
2. Admin opens Document Clusters and clicks Create. Chooses Select Type (Reference or Sign-Off) and enters Cluster Name.
3. Multi-selects Active OnboardingDocuments for this cluster.
4. For Sign-Off clusters: optionally configures Display to BGV Vendor (ON by default) and Disable download of documents (OFF by default).
5. Saves. Cluster becomes available in Onboarding Process Configuration for its respective slot.

**For Undertaking clusters:**
1. Admin sets up HR Documents > Undertaking Documents (HTML forms) in the HR Documents module for any HTML undertaking templates needed.
2. Admin creates PDF forms in Form Builder > PDF Forms for any PDF undertaking forms.
3. Admin opens Document Clusters and clicks Create. Chooses Select Type = Undertaking and enters Cluster Name.
4. Multi-selects forms from the combined picker (HTML Forms optgroup from HR Documents + PDF Forms optgroup from Form Builder).
5. Optionally enables Auto-Reject on DOJ Update (OFF by default); Display to BGV Vendor is ON by default.
6. Saves. Cluster available in Onboarding Process Configuration > Undertaking slot; cluster edits auto-propagate to linked Process Configs.

## Constraints

- **No draft state** — clusters go live immediately on Save. There is no draft or inactive intermediate state; the cluster is Active and available for assignment from the moment of creation. `[SME 2026-05-12]`
- Auto-Reject on DOJ Update is only available for Undertaking type clusters — hidden for Sign-Off and Reference. When enabled, **only documents within the cluster that contain a Date of Joining field** are auto-rejected on DOJ change; documents without a DOJ field in the same cluster are unaffected. The toggle is cluster-level but rejection is document-level (field-presence check). `[SME 2026-05-12]` `[LIVE 2026-05-12 confirmed]`
- Documents multi-select only shows Active Onboarding Documents — archived documents are excluded.
- Mandatory toggle is per-document within the cluster, not a cluster-level setting.
- **Select Type is immutable after creation** — the field is read-only in the edit modal. An Undertaking cluster cannot be converted to Reference or Sign-Off. `[LIVE 2026-05-12 new finding]`
- Clusters in use by any Onboarding Process Configuration cannot be permanently deleted — archive instead. Clusters with no linked process can be deleted via the Delete action. `[LIVE 2026-05-12 — delete action confirmed for unused clusters]`
- Hidden reasons (Hide Reason for Candidate = ON on the Onboarding Exception Reason) cannot trigger candidate reminders for documents in this cluster.

## Key Dependencies

**Upstream:** `onboarding-document.md` — provides the documents this cluster groups for Reference/Sign-Off types; archiving a document auto-removes it from the cluster. HR Documents > Undertaking Documents and Form Builder > PDF Forms for Undertaking type.

**Downstream:** `onboarding-process-configuration.md` (FLONB-C002) — consumes Document Clusters in its Sign-Off / Reference / Undertaking slots; deletion is blocked while in use. `platform/reason.md` (Onboarding Exception Reason, type 11) — exception reasons from the platform Reason List can be invoked on mandatory documents inside this cluster. **BGV Vendor** — when `display_to_bgv_vendor = true`, the cluster's documents are shared with the configured BGV vendor during background verification (see `bgv-vendor.md`, FLONB-M001).

============================================================
[REF: OnboardingEmailTemplate — flows/onboarding-email-template.md]
---
uid: FLONB-C004
entity_name: "OnboardingEmailTemplate"
entity_type: policy_configuration
module: onboarding
cluster: flows
uniqueness_model:
description: "OnboardingEmailTemplate is a policy_configuration in onboarding that defines custom email notification templates used during the onboarding lifecycle; each template carries a name, subject line, and rich-text body with merge-variable support, stored simultaneously across 21 platform-defined language variants per record."
is_optional: true
activation_flag: false  # templates have no enabled/disabled toggle; they exist or are deleted
has_audit_trail: false
read_tool: read_onboarding_email_template
write_tool: write_onboarding_email_template
---

## Form Fields
- `name` (required): Human-readable display name for the template. Shown as the list row label and in the edit modal title ('Edit Email Template - {name}'). Also used as prefix in the compound templatecode key.
- `template_category` (required, enum: onboarding_work_flow): Platform-fixed category token that classifies this template as an onboarding workflow email template. Submitted as a routing/scoping parameter in all list, delete, and preview API requests. Not user-configurable — always 'onboarding_work_flow' for this entity type.
- `subject` (required): Email subject line for this template. Stored per language using bracket notation; the logical field maps to all 21 language variants simultaneously. Display: the edit form shows a single subject input that switches language context via the language dropdown.
- `content` (required): Rich-text email body for this template. Stored per language using bracket notation; all 21 language variants are submitted simultaneously on save. DB Sense AI auto-translates the English content to all other languages. Supports merge variables for personalization.

## Description

OnboardingEmailTemplate defines the email communication layer for Darwinbox's onboarding module. Each template is a named, reusable email configuration that carries a subject line, rich-text body, CC recipient configuration, sender profile override, and a channel toggle. A single template record simultaneously stores content for all 21 platform-defined language variants — DB Sense AI auto-translates the primary English content to other languages on save. Digest variants (`digest_title` and `digest_content`) exist as English-only supplements for digest notification delivery.

Templates are tenant-wide in scope, not scoped to a specific onboarding process or workflow. Any template can be referenced from any onboarding configuration in the tenant. When configured, templates are triggered at specific events in the onboarding lifecycle by being referenced in the process or workflow notification settings.

## Knowledge Insight

- **Multi-language architecture (OET-DRIFT-002, GREEN):** One template record carries 21 language variants. Subject and content use bracket notation `EmailTemplate[field][email_notification][{lang_code}]`. The "Translate and Save" action posts all 21 language keys in a single save request. DB Sense AI translates from English to all other languages server-side. Digest variants (`digestContent`, `digestTitle`) are the exception — English-only, sent only with the `[en]` bracket key.
- **Shared notification controller:** The `notificationtemplates` controller handles list, edit, preview, and validation across multiple email template categories. The category token `onboarding_work_flow` scopes the onboarding templates. The delete endpoint is the exception — it uses a distinct onboarding controller path: `POST /onboarding/onboard/deleteWorkflowEmailtemplate`.
- **Hard deletion:** Template deletion is permanent (no soft-delete, no recycle bin). The `status=1` parameter in the delete XHR is a routing/confirmation param, not a state toggle. Record count confirmed: 16→15 on deletion. A client-side confirmation modal ("Are you sure you want to delete this template?") fires first.
- **Sender profile override:** `custom_sender_id` overrides the tenant's default SMTP sender. Stored as sequential opaque string IDs (`custom_sender_id{N}`), not named entity references. Display labels (e.g., "CTO1", "CEO") are tenant-configured sender profile names resolved at runtime.
- **CC mechanism triad:** Three independent CC mechanisms coexist per template: `cc_users_list` (specific employee IDs, comma-separated string), `cc_roles` (org-hierarchy role slugs or tenant-custom roles, array), and `cc_email` (free-text email address). All three are optional and additive.
- **No activation toggle:** Templates have no enabled/disabled state. They are either present in the list (active) or permanently deleted. `activation_flag: false` confirms no toggle exists in the UI.
- **Template name non-uniqueness:** Template names are not enforced as unique. The server-assigned hex fragment in the compound `templatecode` guarantees uniqueness across templates with identical names.
- **Two-step save:** Save follows a validation-then-write pattern: `POST /notificationtemplates/ValidateTemplate` (validation XHR) followed by `POST /notificationtemplates/editTemplate` (write XHR). Create (`is_new=1`) and edit (`is_new=0`) use the same endpoint with the `is_new` flag as discriminator.

## Ideal Flow

1. Admin navigates to Flows / Onboarding / Onboarding Email Templates (`/onboarding/onboardingsettings/onboarding/onboardingemailtemplate`) — requires `onboarding_admin` permission.
2. List loads via POST `/notificationtemplates/emailtemp` with `templatecategory=onboarding_work_flow`. Default view shows 10 records per page; pagination navigates remaining records.
3. Admin clicks **Create** (top-right).
4. Edit modal opens. Admin fills: **Name** (required, free text), **Subject** (required, per-language), **Content body** (rich text editor, required, per-language), and optionally: Do Not Show Logo checkbox, Cc Users (employee tag picker), Recipient Context CC Role (role multi-select), Cc Email (free text), Choose Sender Profile (dropdown), email channel toggle.
5. Admin inputs primary English content. "Translate and Save" is clicked — a single save request posts content to all 21 language bracket-keys simultaneously. DB Sense AI translates English to all other languages server-side.
6. Optionally, admin selects another language from the language dropdown to review or manually override translated content, then saves again.
7. Save flow: POST `/notificationtemplates/ValidateTemplate` (validation) → POST `/notificationtemplates/editTemplate` (`is_new=1`). Server assigns a new hex ID; the compound `templatecode` is client-computed as `{templatename}_{templatecategory}_{hex_fragment}`.
8. Template appears in the list. Admin can preview (eye icon) — preview modal shows a language switcher and **SEND TEST NOTIFICATION** button.
9. Admin can edit (pencil icon, same form with `is_new=0`) or delete (trash icon, confirmation modal, then POST to `deleteWorkflowEmailtemplate`). Deletion is hard and permanent.
10. Template is subsequently referenced in OnboardingProcess or OnboardingWorkflow notification configuration to trigger at specific candidate lifecycle events.

## Constraints

- **Name non-uniqueness:** Multiple templates can share the same display name. The server-assigned hex ID is the only true unique key — name alone cannot identify a template.
- **Hard deletion:** Deletion is permanent with no recovery mechanism. The client-side confirmation modal is the sole safeguard against accidental deletion.
- **Email-only channel:** The onboarding email template edit form exposes only the email channel toggle. Push, bell, WhatsApp, and SMS channels are not configurable at this template level — email is the sole delivery channel.
- **`cc_roles[]` payload exclusion:** When no CC roles are selected, the `cc_roles[]` parameter is completely absent from the save payload (not sent as an empty array). API consumers must handle its optional absence.
- **Digest English-only:** `digestContent` and `digestTitle` are submitted only for the `[en]` locale and do not participate in the 21-language translation flow.
- **Sender profile opacity:** `custom_sender_id` stores opaque sequential IDs (`custom_sender_id{N}`). Tenant-friendly sender profile display names are resolved at runtime from Notification Centre settings — they are not stored in this entity.
- **`is_workflow` routing param:** The `is_workflow=1` field in the editTemplate API is a routing parameter distinguishing workflow email templates from standard notifications at the controller level; it is NOT a stored attribute of this entity.
- **CSRF requirement:** All write XHRs require a CSRF token (field name `pbqBeYWPUn` observed).

## Key Dependencies

- **NotificationTemplates controller** (`POST /notificationtemplates/emailtemp`, `/notificationtemplates/editTemplate`, `/notificationtemplates/ValidateTemplate`, `/notificationtemplates/previewTemplate`): shared API layer for email template CRUD and preview. The `templatecategory=onboarding_work_flow` token scopes requests to this entity type.
- **Onboarding module permissions** (`onboarding_admin`, sub_module_ref `onboarding.onboarding`): the permission gate for accessing and administering the configuration surface. Super admins and users with the onboarding_admin custom permission (Onboarding Settings) can access. [SME 2026-05-15]
- **OnboardingProcess** (FLONB-P001, if entity exists): downstream consumer that references these templates for onboarding lifecycle event notifications.
- **OnboardingWorkflow** (FLONB-P002): downstream consumer that may reference these templates for workflow task notification triggers.
- **DB Sense AI translation service:** server-side component invoked on save to auto-translate English content to all 21 language variants.
- **Sender Profiles** (Notification Centre / SMTP settings): `custom_sender_id` values map to sender profiles configured in Notification Centre. Profiles supply the override SMTP sender name and address.

============================================================
[REF: Flow — flows/flow.md]
---
uid: FLFLW-P008
entity_name: "Flow"
entity_type: process_configuration
module: lifecycle
cluster: flows
description: "Flow is a process_configuration in flows that defines the end-to-end automation template — orchestrating approvals, tasks, notifications, and document generation for any business transaction. The core unit of the Darwinbox workflow engine; every module routes its transactional processes through a Flow."
is_optional: false
has_audit_trail: true
read_tool: getFlowFromId       # [XHR 2026-05-11] POST /flows/flowsConfig/getFlowFromId
write_tool: activateFlow      # [XHR 2026-05-11] POST /flows/flowsConfig/activateFlow (200) — confirmed by no-change Update on CF_3151; toast "Flow has been updated successfully"; updated_on timestamp moved 02:23:16 -> 02:28:02
uniqueness_model:
---

## Form Fields
- `flow_name` (required): Display name of the flow as entered in Step 1 (Basic Details) of the Create Flow wizard. Not unique-enforced across the tenant.
- `module_transaction` (required, enum: Employee | PositionUpdate | AdditionalAssignment | NewHire | Onboarding | DigitalSignature | HRLettersPublishing | Helpdesk | Imports | Loan | RecognitionNomination | RecognitionTeamRegistration | RecognitionRedemption | OfferLetter | RaiseRequisition | Candidate | SkillValidation | TalentNomination | Travel | Reimbursement): Module transaction type selected in Step 2 (Flow Initiation). Determines available wizard steps and configurable fields. Structurally immutable after flow creation — changing the module transaction requires rebuilding the entire flow. [DOCS Flows-en.txt]
- `creation_method` (required, enum: Manual | DBSense | Template): How the flow was created: Manual (full config by admin), DBSense (AI-generated), Template (pre-built template). Configured at flow creation entry point. [DOCS Flows-en.txt]
- `trigger_type` (required, enum: Manual | Scheduled | SubFlow): How the flow is triggered. Configured in Step 2 (Flow Initiation) for most module_transactions. Manual: employee-initiated via self-service; Scheduled: time-based auto-trigger; SubFlow: triggered programmatically by a parent flow. UI groups as 'Manual/Auto' and 'System Events'. For Onboarding module_transaction, only Manual and SubFlow are available — Scheduled is not offered. [LIVE instance8.darwinbox.in 2026-04-12; FORM 2026-05-13]
- `triggering_event` (enum: BusinessFlow | CompensationChange | TaxDeclaration | InterCompanyTransferBusinessFlow | VisitorManagement): System event that triggers this flow automatically. Applicable when trigger_type = SubFlow or system-event-based trigger. Values are module-specific — valid values depend on module_transaction; Employee module values confirmed [LIVE]; Onboarding module confirmed N/A (field absent from wizard) [FORM 2026-05-13]; other module_transaction values are content gap pending live walk. [LIVE instance8.darwinbox.in 2026-04-12]
- `restriction_condition` (enum: Or | And): Logic operator for combining multiple User Assignment conditions: Or (any condition matches) or And (all conditions must match). Configured alongside applicability_id in Step 2. [DOCS Flows-en.txt]
- `initiation_type` (required, enum: Self | Manager | HRBP | Admin): Ordered list of who can initiate this flow. At least one initiator required; multiple initiators supported with defined order. Configured in Step 2 (Initiator Details) via 'Order | Initiator' table with '+ Initiator' to add rows. Not applicable to Onboarding module_transaction. [LIVE instance8.darwinbox.in 2026-04-12]
- `cool_off_duration_type` (enum: Calendar | Working): Unit type for the cool-off period — Calendar days or Working days. Configured alongside cool_off_period_days in Step 4. [LIVE instance8.darwinbox.in 2026-04-12]
- `status` (required, enum: enabled | disabled): Lifecycle state of the flow. [LIVE 2026-05-11] Live list shows binary 'Enabled' badge (green); kebab action 'Disable' toggles to disabled. Possible underlying 3-state model (Draft/Active/Archived per states[] block) not conclusively confirmed — Draft records may be filtered from default list view. possible_values corrected to live-observed binary per schema-guardian 2026-05-14; states[] block retained pending re-walk verification. [DOCS Flows-en.txt]
- `created_date` (required): Timestamp when the flow record was created.

## Description

Flow is a process_configuration in flows that defines the end-to-end automation template — orchestrating approvals, tasks, notifications, and document generation for any business transaction. The core unit of the Darwinbox workflow engine; every module routes its transactional processes through a Flow.


### Knowledge Insight

<!-- [DERIVED + LIVE 2026-05-11] Synthesized from full 5-step wizard walk and entity attribute structure. Flow's job: orchestrate one transaction's full lifecycle. -->
A Flow is the **orchestration template** — distinct from the ApprovalFlow (which is just the routing piece) and the Workflow (which is the post-approval task engine). A Flow wires together: (1) an initiation form per initiator type, (2) one or more ApprovalFlows for routing, (3) Workflows triggered on approval/rejection, (4) SLA settings for time enforcement, (5) Skip rules for stage suppression, (6) auto-numbering for request IDs, (7) notifications per lifecycle event, and (8) help content (FAQs / Reference Documents / Support Team) for end-user self-service. Each Flow is scoped to one Module Transaction (Employee / Travel / Reimbursement / etc.) which determines available wizard fields — module_transaction is **immutable after create**.

Operational behaviour:
- **In-flight isolation lives at FlowRequest snapshot time, not Flow.** Editing an Active Flow takes effect immediately for new requests; in-flight requests continue against the snapshot taken at initiation. Flow itself does not version (audit_trail records structural changes).
- **Status is binary live: Enabled / Disabled.** Confirmation modal text on Disable: *"Disabling this flow will prevent new instances from being initiated. Any transactions currently in progress will continue to execute until completion."* Save-as-Draft on Create form may persist a third Draft state (not yet evidenced — deferred).
- **Linked entities must be Active.** A Flow fails silently if a referenced ApprovalFlow / Workflow / SLASetting / SkipSetting is in Draft or Disabled — no task is created, no error is shown to the initiator.
- **Per-initiator overrides:** Step 2 wrench-icon panel lets each initiator type (Self / Manager / Admin / etc.) have its own Confidential role-set, Edit Initiator Form override, and Notification config (events × recipients × template). Flow-level Notification config (Step 4) is the global fallback.
- **Field visibility is conditional on module_transaction.** Travel module shows ~5 Step 1 fields; Employee module shows ~10. The Triggering Event / Trigger / IJP / Nominee / User Assignments fields are conditional.

To debug a failing Flow: open at /ms/flows/config/flow-config/flows, click pencil → walk the 4 Edit-mode steps. Verify (a) Status badge is Enabled (not silently Disabled), (b) all linked Approval Flows / Workflows / SLA / Skip Settings show Active, (c) per-initiator routes have valid Form + Approval Flow, (d) User Assignment includes the subject, (e) Cool-Off Period hasn't blocked a retry, (f) Triggering Event / Trigger conditions are met for the request type.

## Ideal Flow: Flow Setup (5-Step Wizard)

1. **Step 1: Basic Details**
   - Fill Flow Title (display name) — required
   - Select Flow Category (optional, classification via FlowCategory master data)
   - Fill Description (optional)
   - Select Auto Numbering Series (optional, e.g., TR_2024_001)
   - System assigns flow_code at record creation
   - Precondition: Flow Title required

2. **Step 2: Flow Initiation**
   - Select Module Transaction (determines available fields for all subsequent steps)
   - Select Trigger Type (Manual / Scheduled / SubFlow)
   - Configure Triggering Event (module-specific event, if applicable)
   - Add Initiators in order (Self, Manager, HRBP, Admin) via "+ Initiator" button in Initiator Details table
   - Configure User Assignments (employees who can initiate / be subject of flow)
   - Optional: Open Additional Settings panel → set Confidential, Edit Initiator Form, Configure Notifications (3 events: Flow is Initiated, Flow is Revoked, Flow is Completed; columns: Template, Default Recipients, Additional Recipients, Email CC Recipient Users, Email CC Recipient Roles)
   - Optional: Enable Nominee-Based Flows, Applicable to IJP
   - Precondition: At least one module transaction and one initiator required

3. **Step 3: Workflow and Approval Flows**
   - Select global Approval Flow (multi-level approval chain)
   - Configure per-initiator Approval Flow mappings (conditional approval by initiator type)
   - Select Approval Flow on Revoke
   - Select Workflow (post-approval task execution)
   - Select Workflow on Rejection (alternative post-processing on rejection outcome)
   - Precondition: At least one of approval flow or workflow required

4. **Step 4: Notification and Advanced Settings**
   - SLA Settings (flow-level time enforcement)
   - Skip Settings (conditions for flow bypass)
   - Cool-off Period (days + duration type)
   - Delegation Policy (restrict_task_delegation, restrict_approval_delegation)
   - Sensitivity, Revoke settings, Frequency and concurrency limits
   - Precondition: All referenced entities must exist and be Active

5. **Step 5: Help Configuration**
   - Configure FAQ Items (question-answer pairs for employee help panel)
   - Link HR Policies, Reference Documents
   - Designate Support Team Roles and Support Team Employees
   - Preview full configuration and Activate (Draft → Active)


### Constraints

<!-- [LIVE 2026-05-11] -->
- **Module Transaction immutable after create.** Greyed on Edit form. To change module_transaction, archive and create a new Flow.
- **Edit mode shows only 4 steps, no Preview.** Create has 5 steps; Edit drops Preview. Edit's last step (Step 4) shows an "Update" button (no Save as Draft).
- **Save modes differ by mode:**
  - Create / Step 5 Preview: `Save and Enable` (split button) + `Save as Draft` (alternative)
  - Edit / Step 4: `Update` only
  - Steps 1-4 in Create: `Save as Draft` + `Next`
- **Status is binary live: Enabled / Disabled.** Disable is reversible; in-flight transactions continue. KB had Draft/Active/Archived 3-state — drift raised pending Draft-state verification.
- **Field visibility conditional on Module Transaction.** Step 1 Travel module shows fewer fields than Employee module — EVOL-008 territory at the field-presence level, not just enum-value level.
- **Step 4 accordion structure differs:** Create shows 3 (Configure Notifications + Advanced Configurations + Delegation Settings); Edit may strip Advanced Configurations for some module types (observed Travel-mode Edit had only 2 accordions).
- **Per-initiator wrench panel duplicates flow-level structures:** Confidential, Edit Initiator Form, and Configure Notifications are configurable both flow-globally (Step 4) AND per-initiator (Step 2 wrench panel). Per-initiator overrides flow-global. Schema needs InitiatorConfigDef extension to model this — drift raised.
- **Templates Gallery and DB Sense are entry-point options for Create only**, not surfaced on Edit. 47 prebuilt templates categorised by Flow Category.
- **Deletion not blocked at this entity:** trash icon visible on every kebab. Whether deletion is blocked when in-flight requests exist is not confirmed (deferred).
- **Linked-entity activation precondition:** Flow cannot be Enabled until all referenced ApprovalFlows / Workflows / SLASettings / SkipSettings are themselves Active. Failure modes: silent — no error is shown.

### Key Dependencies

<!-- [LIVE 2026-05-11] -->
**Upstream (Prerequisites):**
- **ApprovalFlow (FLFLW-P007)** — referenced via `approval_flow_id` per-initiator + global. Must be Active for Flow to be Enabled.
- **Workflow (FLFLW-P017)** — referenced via `workflow_id` (on approval) and `workflow_on_rejection_id`. Must be Active.
- **SLASetting (FLFLW-P015)** — referenced via `sla_setting_id` per-stage. Must be Active.
- **SkipSetting (FLFLW-P014)** — referenced via `skip_setting_id`. Must be Active.
- **FlowCategory (FLFLW-M002)** — `flow_category_id` classification. Required field.
- **FlowAutoNumbering (FDFLW-C001)** — `auto_numbering_series_id` for request ID format. Default `System Generated` if unset.
- **StandardForm (PLFRM-P001)** — `initiation_form_id` (global) and per-initiator `form_id` (override). Required for non-Manual triggers.
- **UserAssignment (PLPLT-M008)** — `applicability_id` defines who can initiate. Default "All Employees".
- **StandardRole (ORPRM-M004)** — `confidential` multi-select role-set + `hide_from_roles` + `hide_skipped_steps_from_roles` + per-initiator Confidential override.
- **Employee (ORCOR-X001)** — `created_by` author reference and runtime initiator/subject.
- **DecisionMatrix (PLPLT-P002)** — referenced indirectly via stage-level decision_matrix_id when ApprovalFlow uses dynamic routing.

**Downstream (Dependents):**
- **FlowRequest** — created at trigger time; captures snapshot of Flow + ApprovalFlow + Workflow + SLA + Skip configs. SLA clock and skip rules run against this snapshot.
- **NotificationEventDef** (nested) — Step 2 per-initiator wrench panel + Step 4 flow-global both use this Def for the 7-column event-recipient-template table.
- **InitiatorConfigDef** (nested) — Step 2 Initiator Details rows; per-row Form + ApprovalFlow + Confidential + Edit Initiator Form override.
- **ContentVariantDef** (nested) — Step 1 Help and Support → FAQs sub-tab uses this Def for help_faq_items.

**Sibling discovery (not upstream/downstream but adjacent):**
- **FlowTemplate** (separate entity not yet in KB) — 47 prebuilt templates surfaced via Templates Gallery at /ms/flows/config/flow-config/templates. Each has a Flow Category. Likely a separate entity; deferred to a dedicated walk.
- **DB Sense** (AI-driven flow creation) — separate platform feature surfaced as alternative entry point on Create. Likely powered by a separate AI agent entity; out of scope for Flow.

============================================================
[REF: OrgViewSettings — organization/org-view-settings.md]
---
uid: ORCOR-C014
entity_name: "OrgViewSettings"
entity_type: policy_configuration
module: core
cluster: organization
description: >
is_optional: false
has_audit_trail: false  # confirmed [LIVE 2026-05-13] — no audit trail link visible on settings page
read_tool: null   # server-side rendered settings page; GET endpoint not exposed; form loads via standard page render
write_tool: "POST /settings/employees/orgsettings"  # [XHR 2026-05-13] form id=tenant_setting_level; confirmed from form action attribute
---

## Form Fields
- `primary_name_attributes` (enum: {'value': '1', 'label': '{First Name}'} | {'value': '2', 'label': '{First Name} {Last Name}'} | {'value': '4', 'label': '{First Name} {Last Name} {Suffix}'} | {'value': '13', 'label': '{First Name} {Middle Name} {Last Name}'} | {'value': '3', 'label': '{First Name} {Middle Name} {Last Name} {Suffix}'} | {'value': '9', 'label': '{Local First Name} {Local Middle Name} {Local Last Name}'} | {'value': '10', 'label': '{Local First Name} {Local Last Name}'} | {'value': '11', 'label': '{Known As Name}'} | {'value': '12', 'label': '{Legal Name}'}): Configures the name format for the Primary Name used across all of Darwinbox — Employee Profile, Table listings, Hover configurations, Notifications, Reports, and wherever 'Employee Full Name' is displayed. Changes affect all areas in Darwinbox including newly generated reports. Update propagation takes up to 6 hours; a status message 'In progress' is shown until complete. [DOCS 2026-05-13]
- `secondary_name_attributes` (enum: {'value': '1', 'label': '{First Name}'} | {'value': '2', 'label': '{First Name} {Last Name}'} | {'value': '4', 'label': '{First Name} {Last Name} {Suffix}'} | {'value': '13', 'label': '{First Name} {Middle Name} {Last Name}'} | {'value': '3', 'label': '{First Name} {Middle Name} {Last Name} {Suffix}'} | {'value': '9', 'label': '{Local First Name} {Local Middle Name} {Local Last Name}'} | {'value': '10', 'label': '{Local First Name} {Local Last Name}'} | {'value': '11', 'label': '{Known As Name}'} | {'value': '12', 'label': '{Legal Name}'}): Configures the name format for the Secondary Name displayed in Org View and Employee Profile. Update propagation takes up to 6 hours; a status message 'In progress' is shown until complete. [DOCS 2026-05-13]
- `search_name_attributes` (enum: {'value': '1', 'label': '{First Name}'} | {'value': '2', 'label': '{First Name} {Last Name}'} | {'value': '4', 'label': '{First Name} {Last Name} {Suffix}'} | {'value': '13', 'label': '{First Name} {Middle Name} {Last Name}'} | {'value': '3', 'label': '{First Name} {Middle Name} {Last Name} {Suffix}'} | {'value': '9', 'label': '{Local First Name} {Local Middle Name} {Local Last Name}'} | {'value': '10', 'label': '{Local First Name} {Local Last Name}'} | {'value': '11', 'label': '{Known As Name}'} | {'value': '12', 'label': '{Legal Name}'}): Configures the name format used in Elastic Search across all areas where search is enabled. Changes affect all search surfaces in Darwinbox. Update propagation takes up to 6 hours; a status message 'In progress' is shown until complete. [DOCS 2026-05-13]

## Description

OrgViewSettings is the platform-wide configuration page for Darwinbox's Org View feature — the org chart and hierarchy discovery tool available to employees, managers, and admins. It controls every display and access aspect of three distinct structural views: the Organizational Structure (employee reporting hierarchy), the Functional Structure (company → group company → business unit → department hierarchy), and the Position Structure (position-based hierarchy, only available when Position Management is enabled). Through four settings tabs — Org View Settings, Functional View Settings, Position View Settings, and Advanced Settings — admins configure which attributes appear on org chart cards, who can see which structures, how search behaves, how exclusions and span-of-control restrictions are applied, and how employee names are formatted and indexed platform-wide. [KB-PRESERVED]

## Knowledge Insight

Navigate to **Settings → Organization → Employee Data → Org View Settings** (`/settings/employees/orgsettings`) to reach this configuration page. The page contains four horizontal tab sections on a single form, each independently editable and saved together with the top-right Save button. Data is stored across three platform model objects: `OrgStructureSettings` (most display and restriction settings), `TenantProfile` (default access grants and a few advanced toggles), and `TenanatEmployeeEditDetails` (name format keys — note the platform-side typo in the object name). The most frequently misunderstood behaviour is that `disable_org_structure_for_employees` only removes Org View from the Employee Profile page — it does not prevent employees from accessing Org View from the main Dashboard. A second common confusion is the cascading exclusion in `excluded_user_assignments`: when an employee is excluded, every employee who reports to them (directly or indirectly) is also hidden from all Org Views. The `primary_name_attributes` setting has the broadest platform impact of any setting on this page — it propagates to reports, notifications, profile, tables, and hover cards across all of Darwinbox with a 6-hour lag. [KB-PRESERVED]

## Ideal Flow

**Prerequisites:** Company, Group Company, Business Unit, and Department organizational units must be configured. Reporting Manager relationships must be established for Organizational Structure to display correctly. Position Management must be enabled and positions must be created before Position View Settings take effect.

1. Admin navigates to Settings → Organization → Employee Data → Org View Settings (`/settings/employees/orgsettings`).
2. In **Org View Settings** tab: select up to 2 attributes for compact card view (defaults to Company and Department), up to 3 for detailed view, and additional fields for the Additional Details tab (field visibility subject to Employee Attribute Report permissions per employee). Configure any User Assignment exclusions and search restrictions. Set span-of-control restrictions if applicable. Expand 'Additional Settings' accordion to toggle the org structure default access grant.
3. In **Functional View Settings** tab: configure attribute display for Company, BU, and Department cards independently across compact and detailed views. Enable `show_bu_under_company` to add BU as a structural layer. Enable `restrict_functional_visibility_by_span` to limit what non-HOD employees can see. Expand 'Additional Settings' to toggle span-of-control.
4. In **Position View Settings** tab (only if Position Management is enabled): configure Position card attributes, enable position status counts, and set span-of-control restrictions at the position level. Expand 'Additional Settings' to toggle reportee count display.
5. In **Advanced Settings** tab: configure name format attributes (primary, secondary, search) with caution — changes propagate platform-wide within 6 hours. Enable elastic search sync from Org View settings if compact view attributes should also drive search display columns. Configure elastic search fields if fine-grained control is needed.
6. Click Save (top-right). Changes to name format attributes trigger a background job with 'In progress' badge shown on the field until propagation completes.

[KB-PRESERVED]

## Constraints

1. **Position View Settings are gated by Position Management:** All Position View Settings attributes are inactive if Position Management is not enabled on the instance. [KB-PRESERVED]
2. **Tree view auto-disable at 3000 departments:** Both `enable_designation_tree_view` and `disable_department_tree_view_assignment` are automatically overridden (tree view disabled) when the count of active departments exceeds 3000 — no admin action or notification occurs. [KB-PRESERVED]
3. **Cascading exclusion from `excluded_user_assignments`:** Excluding a User Assignment hides not only its members but also all employees reporting to those members at any depth in the reporting hierarchy. [KB-PRESERVED]
4. **`restricted_search_assignments` prerequisite:** The UserAssignment must separately have 'Restrict user assignments from universal search' enabled in its own Applicable For Process configuration. [KB-PRESERVED]
5. **Name format propagation lag:** Changes to `primary_name_attributes`, `secondary_name_attributes`, and `search_name_attributes` take up to 6 hours to propagate across all Darwinbox surfaces. Existing reports retain the old format; only newly generated reports use the updated format. [KB-PRESERVED]
6. **`disable_department_hierarchy_profile` and `disable_functional_area_hierarchy_profile` are legacy settings:** Both apply only to the Common Profile (legacy profile experience) and have no effect on the Revised Employee Profile Experience. [KB-PRESERVED]
7. **`show_org_structure_by_default`, `show_functional_structure_by_default`, and `show_position_structure_by_default` can be overridden per employee:** Employee-level access configured via Employees Data import takes precedence over these global defaults. [KB-PRESERVED]
8. **Form object split:** Settings POST to three different model objects (OrgStructureSettings, TenantProfile, TenanatEmployeeEditDetails) in a single form submission — all settings are saved atomically on Save. [LIVE 2026-05-13]

## Key Dependencies

**Upstream:**
- **UserAssignment** — required for `excluded_user_assignments` and `restricted_search_assignments`; the UserAssignment entity must have 'Restrict user assignments from universal search' enabled for the latter to function.
- **Position** and Position Management activation — required for all Position View Settings to be active.
- **Succession module** — required for `show_person_position_succession_details`, `show_role_succession_details`, `position_show_person_position_succession`, and `position_show_role_succession`.
- **Profile View Settings (ORCOR-C008)** — `additional_details_fields` and `compact_view_fields` draw from the attribute pool configured in Profile View Settings; only attributes enabled in PVS AND permitted via Employee Attribute Report permissions are visible to end users.
- **Organizational Units (Company, Group Company, Business Unit, Department)** — Functional Structure cannot display correctly without org units configured.
- **Reporting Manager mappings (Employment Details)** — Organizational Structure reflects reporting hierarchy; inaccurate or missing manager mappings produce an incomplete or flat structure.

**Downstream:**
- **Org View (employee-facing org chart)** — all display and access settings in this entity directly drive what employees and managers see when they open Org View.
- **Elastic Search (platform-wide)** — `elastic_search_sync_from_org_view`, `configure_elastic_search_params`, `elastic_search_fields`, and all three name attribute settings cascade to platform-wide search behaviour and display.
- **Employee Profile (all surfaces)** — `primary_name_attributes` controls the Primary Name format across profile, reports, notifications, hover cards, and table listings.
- **Reports** — newly generated reports reflect the current `primary_name_attributes` and `search_name_attributes` settings.
- **Focus View** — `focus_view_roles` directly populates the additional role cards shown in Focus View.

[KB-PRESERVED]

============================================================
[REF: EmploymentDetailsSettings — organization/employment-details-settings.md]
---
name: "employment-details-settings"
uid: ORCOR-C004
entity_name: "EmploymentDetailsSettings"
entity_type: policy_configuration
module: core
cluster: organization
description: "EmploymentDetailsSettings is a policy_configuration in core that governs the Employment Details section of every employee profile, combining a fixed-schema collection of ~26 pre-defined rows — one per employment attribute (Manager, Designation, Band, Grade, Cost Center, Legal Entity, Assignments, Standard Roles, etc.) — with ~12 instance-wide global platform toggles. Each row controls visibility, label alias, display order, mandatory flag, and view/edit permissions for that attribute on the employee profile. Rows cannot be added or deleted by tenants — the platform owns the list. Singleton — one configuration per tenant."
is_optional: false
has_audit_trail: true
read_tool: null   # [LIVE 2026-05-15 dbwalk] URL confirmed: GET /settings/employees/employmentdetailssettings returns 200 OK (bodyLen: 150447). No separate public API endpoint observed — page-form PRG pattern. read_tool intentionally null; no programmatic read surface confirmed by SME.
write_tool: null  # [LIVE 2026-05-15 dbwalk] Save endpoint: POST /settings/employees/employmentdetailssettings (self-referential PRG). Form name: tenant_setting_level. Save button: #setting_create_btn.hidden-ribbon. 244 form inputs confirmed. write_tool null retained (no JSON API surface; form-POST only).
uniqueness_model:
---

## Description

EmploymentDetailsSettings is the singleton admin configuration for the Employment Details section of every employee profile. It combines two structurally different things on one page: a fixed-schema collection of about 26 pre-defined rows — one per employment attribute (Manager, Designation, Band, Grade, Cost Center, Legal Entity, Assignments One/Two/Three, Standard Roles, Designation Title, Contribution Level, FTE, etc.) — and a set of about 12 instance-wide global platform toggles (Enable Location Hierarchy, Enable Effective Dating of Core Attributes, Enable Digital Signature for Dotted Manager, and so on). For each row, admins control whether the field appears at all, its display order, its label alias, whether it is mandatory, and which permission tokens can see or edit it. Rows cannot be added or deleted — the platform owns the list — only configured. The global toggles apply instance-wide and some of them (notably Enable Effective Dating of Core Attributes) are effectively irreversible after go-live.

**Navigation Path:** `Settings > Organization > Employee Data > Employment Details Settings`. Access requires Admin role OR the dedicated custom permission `employeement_details_settings` (catalog: `Core > Employee Data Management > Settings > Employment Detail Settings`). Note the catalog code carries a typo (double-e: "employeement") — that's the real code to assign in custom roles.

**Scope clarification:** EDS governs **only** the Employment Details section of the employee profile. The Common Profile and Personal Details sections are governed separately by **Profile View Settings** — a frequent source of support-ticket confusion.

## Knowledge Insight

EmploymentDetailsSettings is the activation gate for most of the core foundation entities — Assignment One, Assignment Two, Assignment Three, Designation Title, Band, Grade, Cost Center, Contribution Level, FTE, and Asset Management all render on the employee profile if and only if their corresponding row here has `row_is_enabled = true`. This is why these gated entities carry an `activation_flag` reference back to their corresponding EDS row in their v7 spec: the entity can exist as master data and still be invisible to employees and HR if EDS has switched its row off. Issues show up in three common shapes: (1) "Why isn't this field showing on the profile?" — the row is disabled in EDS; (2) "Why is this field mandatory for everyone?" — an unscoped `row_is_mandatory=true` is blocking saves for groups it wasn't meant for (scope via User Assignment or Employee Sub-Type); (3) "Why is the label wrong?" — someone edited `row_alias` instance-wide.

**EDS Field Surfacing Taxonomy (PM-confirmed 2026-05-18):** Not all Employment Details rows behave the same way. There are three structurally distinct categories of field surfacing — understanding which category a field belongs to is essential for diagnosing "why isn't this field showing?" tickets and for implementation planning.

**Category 1 — EDS-gated (`row_can_be_disabled = true`).** The EDS `row_is_enabled` toggle is the sole surfacing gate. When the row is disabled, the field is completely absent from the employee profile — master data for that entity may exist but is invisible. When enabled, the field surfaces for all employees in scope. EDS also controls `row_is_mandatory`, `row_visible_to`, and `row_edit_access` for these fields. Fields in this category: **FTE, Job Level, Contribution Level, Assignment One, Assignment Two, Assignment Three, Standard Role 1, Standard Role 2, Standard Role 3, Asset Management, Additional Assignment, Recruitment Details, Disciplinary.** Implementation note: these fields are off by default for new tenants and must be explicitly enabled during configuration.

**Category 2 — Tagging-dependent (`row_can_be_disabled = false`, but appearance is tag-driven).** These fields are platform-locked (cannot be disabled via EDS), but they do NOT always appear on every employee's profile. Instead, the field surfaces only when the relevant entity is tagged to the employee's Designation or Role at the master-data level. The EDS row's `row_is_enabled` toggle is blocked for these fields — it reads as enabled but the enable/disable lever does nothing. EDS controls `row_is_mandatory`, `row_visible_to`, and `row_edit_access` only. Fields in this category: **Designation Title** (appears only when the employee's Designation has at least one Designation Title tagged to it — ORCOR-M009), **Functional Area** (appears only when a Functional Area is tagged to the employee's Designation or Role — ORORG-M008). Implementation note: if a customer asks why Designation Title or Functional Area isn't appearing, the answer is NEVER "enable the EDS row" — it's "tag the entity to the relevant Designation or Role in its master-data configuration."

**Category 3 — Always-on (`row_can_be_disabled = false`, unconditional surfacing).** These fields are permanently enabled on every employee's Employment Details tab. They cannot be disabled or hidden via EDS, and they do not require any tagging or feature flag to appear. EDS controls `row_is_mandatory`, `row_visible_to`, and `row_edit_access` only. Fields in this category: **Manager, Designation, Band, Grade, Legal Entity, Current Office Location, Employee Type, Employee Sub Type, Cost Center, Projects, Contract** (plus any row where `row_can_be_disabled = false` that is not tagging-dependent). Implementation note: "Why can't I hide this field?" — if it's in Category 3, EDS cannot hide it; workarounds require row_visible_to scoping rather than outright disabling.

A key architectural subtlety: `row_alias` is not an independent label source. It is a write-through mirror of Platform Aliases (FDPLT-M002), which is the master label-substitution catalogue for the entire instance. Editing either surface updates the same underlying record — they stay bidirectionally in sync. Platform Aliases also covers ~180+ additional canonical fields that do NOT appear on Employment Details (leave terms, payroll terms, recognition terms, HR documents, etc.). When a support ticket says "the label on the Employment Details tab is wrong", the fix can be applied on either surface — both update the master record.

Instance8 carries observable operational garbage in both alias values and permission-token dropdowns: 'Assignment two' (lowercase 'two'), 'Standard Role 3' typo on the Standard Role 2 row, 'JV Cost center' (lowercase 'center'), permission tokens literally named 'redis session' and '1963_custom permission role'. These are real configuration values, not data errors, and they leak into employee-facing UI until cleaned up.

**Staffing-model overrides on edit access** (per product docx 2026-05-09): the per-row `row_edit_access` configured here does NOT win when certain staffing-model toggles are active. (a) When **Position Management** is enabled WITHOUT "allow overwriting", attributes like Location, Employee Type, etc. cannot be edited from the profile regardless of EDS edit_access — Position Management owns those fields. (b) When **Project-based Staffing** is enabled, Projects, Work Role, and Location cannot be edited from the profile — Project-based assignments own them. EDS row_edit_access becomes effectively read-only for these fields. Document this contract for any HR-ops audit that asks "why can't role X edit this field even though the EDS table says they should?".

**Job Level vs Band/Grade mutual exclusion**: when the `Job Level` row is enabled, **Band and Grade fields are no longer displayed in the Work Role section** — Job Level supersedes them visually. EDS still tracks all three rows independently, but the rendered employee profile shows Job Level instead of Band/Grade when both are configured. Tenants migrating from Band/Grade to Job Level should expect the Work Role grouping to silently swap.

**Employee Sub Type edit access is derived, not independent**: although the entity has a `row_edit_access` field for Employee Sub Type, the live behaviour is that Sub Type's edit access mirrors the **parent Employee Type** row's configuration. Setting Sub Type edit_access independently has no effect — the parent governs.

**Recruitment Details is deprecated** (per docx 2026-05-09): the Recruitment Process Details row is documented as `(deprecated)`. New tenants should not enable it; existing tenants should plan migration off this row as part of a future consolidation. Keep the row enabled if existing employee profiles depend on it for historical data display.

**Intercompany Transfer Business Flow** (when `enable_intercompany_transfer_during_role_changes=true`): the platform creates a new employee profile for the transferred employee and **deactivates** the old profile — not an in-place edit. If `assign_same_employee_id_after_transfer=true`, the new profile retains the original Employee ID and the old profile's ID is renamed to `transfer_<unique_user_id>_<existing_employee_id>` to free the original ID. Plan this carefully for tenants that key external integrations off Employee ID — the rename can break audit trails.

## Ideal Flow

1. **Navigate:** Settings > Employee > Employment Details Settings.
2. **Review the fixed row collection.** Rows are pre-defined — do not look for a Create button. Scroll through all ~26 rows to see current state.
3. **Enable/disable rows via row_is_enabled.** Disabling a row completely removes the attribute from employee profiles (web, mobile, Forms Builder, imports, reports). Platform-locked rows (Manager, Designation, Band, Grade, Legal Entity, Current Office Location, Employee Type, Employee Sub Type, Functional Area, Designation Title, Cost Center, Projects, Contract) cannot be disabled.
4. **Set row_display_order.** Drag-reorder or edit numeric sequence to control top-to-bottom rendering on the Employment Details tab.
5. **Configure row_alias** (label override) if the default system label is wrong for the instance. This is the correct place to rename a field instance-wide — changes sync bidirectionally with Platform Aliases (FDPLT-M002).
6. **Set row_is_mandatory** thoughtfully. Unscoped mandatory rules block saves for all employee groups — scope via User Assignment or Employee Sub-Type for targeted rules.
7. **Configure row_visible_to and row_edit_access** per role. Blank edit_access = read-only for all. Verify the permission-token vocabulary on the instance before selecting.
8. **Review the global toggles panel** at the bottom. Pay particular attention to `enable_effective_dating_of_core_attributes` — this is functionally irreversible post go-live. Confirm `enable_location_hierarchy` matches the Location master strategy.
9. **Save.** Changes apply immediately to all employee profiles, Forms Builder imports, reports, and the employee directory.
10. **Verify on a test employee profile** that the intended fields appear / disappear / reorder as expected and that a test save respects mandatory and permission changes.

## Constraints

**Singleton — one per instance.** No create, no delete, no duplicate. The configuration exists once and is edited in place. Audit trail captures changes but there is no versioning.

**Rows are platform-fixed.** The row collection is defined by the platform, not by admins. Admins cannot add a new row for a custom field — custom fields are configured through a separate mechanism (Custom Fields, FDPLT-M003) and do not appear here.

**`row_is_enabled` is the platform-level gate for optional core entities.** Disabling a row while the underlying entity still has employee assignments does not lose data — it hides the field. Re-enabling restores visibility with data intact.

**Global toggles are instance-wide and some are irreversible.** `enable_effective_dating_of_core_attributes` is an architecture decision — once in-flight transfers, promotions, and reorganizations depend on effective-dated versions, disabling it would require data migration. Decide before go-live, not after.

**Unscoped mandatory rules block all employees.** `row_is_mandatory=true` without a scope via User Assignment or Employee Sub-Type blocks saves for every employee group. Scope intentionally.

**Cascade is immediate and broad.** Changes propagate on save to: web employee profile, mobile app, Forms Builder import mappings, bulk import validation, reports, employee directory cards, and org chart hovercards. Schedule EDS edits during low-traffic windows.

**Mandatory + hidden is incoherent.** A field hidden via `row_is_enabled=false` but flagged `row_is_mandatory=true` cannot be filled. Either enable + mandatory, or disable + non-mandatory.

**Label aliases do not cascade into APIs.** `row_alias` changes the UI label only. Import templates, report column headers, and API responses continue to use system field names.

**Reorder rules** (per docx 2026-05-09): the **Reorder** button enables drag-rearrange of rows, with three constraints. (1) **Recruitment Details and Disciplinary cannot be reordered** — they have fixed positions. (2) **Employee Type and Employee Sub Type move together as a single unit** — they cannot be split apart in the display order. (3) **Designation, Band, and Grade are grouped under the "Work Role" section and move as one unit** — these three travel together. The updated order applies immediately to employee profiles on save.

**Tenant-level feature dependencies**: certain row visibility is gated by instance-level features outside EDS. (a) `Legal Entity` row appears only if **Enable Legal Entity-based Organization** is true — and when present, Legal Entity becomes mandatory and cannot be disabled. (b) `Projects` row depends on **Allow staffing rules at project level** (Project-based Staffing). (c) `Disciplinary` row requires **Enable Disciplinary Management**. (d) `Contract` row requires **Enable Contract Management**. If the underlying tenant feature is OFF, the row may not function or may be invisible in the EDS configuration page itself — admin must enable the platform feature first.

**System Administrator override**: regardless of any `row_visible_to` or `row_edit_access` configuration, the System Administrator role always has access to all attributes in the employee profile. EDS does not gate System Admin.

## Key Dependencies

**Upstream (Prerequisites):**
- **Employee (FDCOR-E002)** — the entity whose profile page this configuration governs.
- **Employee Sub-Type** — used to scope `row_is_mandatory` rules.
- **User Assignment (E018)** — used to scope `row_is_mandatory` rules (note: "Applicable Type" in the scope UI refers to UserAssignment, NOT Assignment One/Two/Three — common source of confusion).
- **Permission catalog / Standard Roles** — token vocabulary used by `row_visible_to` and `row_edit_access`.
- **Alias (FDPLT-M002)** — master label substitution catalogue. `row_alias` is a write-through mirror of Platform Aliases records. Editing either surface updates the same underlying value.

**Downstream (entities gated by a row here):**
- Assignment One (FDCOR-M001), Assignment Two (FDCOR-M003), Assignment Three (FDCOR-M002) — via `row[Assignment *].row_is_enabled`
- Band (FDCOR-M004), Grade — via their respective rows
- Cost Center (FDCOR-M010) — also gated by `enable_cost_center_in_employment_details` global toggle
- Designation Title, Contribution Level, FTE, Asset Management, Job Level, Standard Roles 1/2/3 — all gated by their respective rows

**Downstream (consumers of global toggles):**
- All work_role cluster entities — `enable_effective_dating_of_core_attributes` determines whether changes are versioned or in-place.
- Location master (FDCOR-M025) — `enable_location_hierarchy` determines flat list vs. parent-child tree.
- Cost Center (FDCOR-M010) — `allow_multiple_cost_centers` + `additional_cost_centers_limit` drive the percentage-allocation model.
- Forms Builder / Import Center — respect `row_is_enabled`, `row_is_mandatory`, and label aliases when generating import templates.
- Employee directory / Org chart — respect `row_visible_to` and `enable_show_reporting_manager_on_employee_directory`.