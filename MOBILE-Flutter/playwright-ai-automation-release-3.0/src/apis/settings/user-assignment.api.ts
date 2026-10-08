import {
  CookieAuthenticatedFlowInput,
  getCsrfToken,
  parseJsonResponse,
  withRequestContext,
} from "../common/cookie-auth.api";

export const UserAssignmentProcess = {
  DEFAULT: 1,
  CONFIRMATION: 2,
  SEPARATION: 3,
  CONTRACT: 4,
  DISCIPLINARY_POLICY: 5,
  NOTICE_PERIOD: 6,
  RETIREMENT_PERIOD: 7,
  CUSTOM_FLOWS: 8,
  PERMISSIONS: 9,
  EMAIL_DIGEST: 10,
  TALENT_MANAGEMENT: 12,
  VIBE: 13,
  PULSE: 14,
  RECOGNITION: 15,
  HELPDESK: 16,
  CONFIDENTIAL_LETTERS: 17,
  EMPLOYEE_ONBOARDING_LETTERS: 19,
  COMPANY_CUSTOM_LETTERS: 20,
  DURING_THE_COURSE_OF_EMPLOYMENT_LETTERS: 21,
  HR_POLICIES: 22,
  LETTER_GENERATION_SETTINGS: 23,
  EMPLOYEE_SEPARATION_LETTERS: 24,
  TRAVEL: 25,
  EXPENSE: 26,
  ONBOARDING: 27,
  ADDITIONAL_ASSIGNMENTS: 28,
  JOBS: 29,
  DATA_ARCHIVAL_USER_INACTIVE_EMP: 31,
  DATA_ARCHIVAL_USER_CANDIDATE: 32,
  EMP_ID_AUTO_NUMBERING: 33,
  PAYROLL: 34,
  CHATBOT: 35,
  GOAL_PLAN_FRAMEWORK: 36,
  REVIEW_CYCLE: 37,
  MAP_N_GRID: 38,
  TEAM_GOALS: 39,
  CONTINUOUS_FEEDBACK: 40,
  TALENT_REVIEW_CYCLE: 41,
  REVIEW_PARAMETER_MAPPING: 42,
  PERFORMANCE_CALIBRATION: 43,
  STUDIO: 44,
  ENGAGEMENT: 45,
  TALENT_NOMINATION_RULE: 46,
  SUCCESSION_PLANNING: 47,
  SKILL_ENDORSEMENT_RULE: 48,
  JOB_DESCRIPTION: 49,
  LEARNING: 50,
  CAREER_AND_DEVELOPMENT_FRAMEWORK: 51,
  SKILL_SETTING: 52,
  LEAVE: 53,
  SURVEY: 54,
  RESTRICT_USER_ASSIGNMENT_FROM_UNIVERSAL_SEARCH: 55,
  POSITION_CUSTOM_FIELD: 56,
  LOCAL_ALIAS: 57,
  STANDARD_PERMISSIONS: 58,
  SCHEDULING: 59,
  TALENT_CALIBRATION: 60,
  RAISE_REQUISITION_SCOPE: 61,
  PLATFORM_THEME_SETTINGS: 62,
  BANK_POLICY: 63,
  HELIX: 64,
  VISITING_CARD_SETTINGS: 65,
  DASHBOARD_BANNER_CONFIGURATION: 66,
} as const;

export type UserAssignmentProcessId = (typeof UserAssignmentProcess)[keyof typeof UserAssignmentProcess];
export type UserAssignmentRuleType = "include" | "exclude";

export interface UserAssignmentApiResponse {
  status?: number | string;
  message?: string;
  error?: unknown;
  update?: string;
  values?: unknown;
  ismodal?: boolean;
  [key: string]: unknown;
}

export interface UserAssignmentFieldOption {
  value: string;
  label: string;
}

export interface UserAssignmentListResponse {
  aaData?: unknown[][];
  [key: string]: unknown;
}

export interface UserAssignmentListItem {
  id: string;
  name: string;
  code: string;
  actionsHtml: string;
}

export interface UserAssignmentRule {
  attribute: string;
  type?: UserAssignmentRuleType;
  /**
   * For simple dropdown / multiselect assignment attributes, the backend accepts a JSON
   * array string in `TenantAssignmentFramework[<attribute>]`.
   */
  selectedValues?: string[];
}

export interface CreateUserAssignmentParams {
  applicableProcessIds: Array<UserAssignmentProcessId | number | string>;
  name?: string;
  description?: string;
  rules: UserAssignmentRule[];
}

export interface CreateUserAssignmentForFieldUsingAvailableValuesParams {
  applicableProcessIds: Array<UserAssignmentProcessId | number | string>;
  field: string;
  type?: UserAssignmentRuleType;
  name?: string;
  description?: string;
}

const UserAssignmentApiEndpoints = {
  editAssignment: "/settings/editassignment",
  extraAttributesInAssignment: "/CoreSettings/extraAttributesInAssignment",
  getAssignment: "/settings/getAssignment",
} as const;

function createRandomUserAssignmentName(): string {
  return `PW User Assignment ${Date.now()}`;
}

export function extractUserAssignmentCodeFromMessage(message: string | undefined): string {
  if (!message) {
    return "";
  }

  const codeMatch = message.match(/\(([^()]+)\)\s*$/);
  return codeMatch?.[1]?.trim() ?? "";
}

function stripHtml(value: string): string {
  return value.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
}

export function extractUserAssignmentIdFromHtml(html: string): string {
  const idMatch = html.match(/\bid=(?:"([^"]+)"|'([^']+)')/i);
  return (idMatch?.[1] ?? idMatch?.[2] ?? "").trim();
}

export function extractUserAssignmentFieldOptionsFromHtml(html: string): UserAssignmentFieldOption[] {
  const optionPattern = /<option\b[^>]*value=(?:"([^"]*)"|'([^']*)'|([^>\s]+))[^>]*>([\s\S]*?)<\/option>/gi;
  const options: UserAssignmentFieldOption[] = [];
  let match: RegExpExecArray | null;

  while ((match = optionPattern.exec(html)) !== null) {
    const rawValue = match[1] ?? match[2] ?? match[3] ?? "";
    const value = rawValue.trim();
    const label = stripHtml(match[4] ?? "");

    if (!value) {
      continue;
    }

    options.push({ value, label });
  }

  return options;
}

export function extractUserAssignmentsFromListResponse(
  response: UserAssignmentListResponse
): UserAssignmentListItem[] {
  const rows = Array.isArray(response.aaData) ? response.aaData : [];

  return rows
    .map((row) => {
      const columns = Array.isArray(row) ? row : [];
      const name = String(columns[0] ?? "").trim();
      const code = String(columns[1] ?? "").trim();
      const actionsHtml = String(columns[2] ?? "");
      const id = extractUserAssignmentIdFromHtml(actionsHtml);

      return {
        id,
        name,
        code,
        actionsHtml,
      };
    })
    .filter((assignment) => Boolean(assignment.id || assignment.name || assignment.code));
}

/**
 * Loads the HTML fragment used by the assignment modal for a given attribute field, such as
 * `parent_company_id`, `department`, or `locations`.
 */
export async function getUserAssignmentExtraAttributes(
  input: CookieAuthenticatedFlowInput,
  field: string
): Promise<UserAssignmentApiResponse> {
  return withRequestContext(input, async (context) => {
    const csrfToken = await getCsrfToken(input, context);
    const formBody = new URLSearchParams();
    formBody.set("field", field);
    formBody.set("pbqBeYWPUn", csrfToken);

    const response = await context.post(UserAssignmentApiEndpoints.extraAttributesInAssignment, {
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
      },
      data: formBody.toString(),
    });

    return parseJsonResponse<UserAssignmentApiResponse>(
      response,
      `POST ${UserAssignmentApiEndpoints.extraAttributesInAssignment}`
    );
  });
}

/**
 * Returns parsed dropdown option values from the HTML fragment delivered by
 * `/CoreSettings/extraAttributesInAssignment`.
 */
export async function getUserAssignmentFieldOptions(
  input: CookieAuthenticatedFlowInput,
  field: string
): Promise<UserAssignmentFieldOption[]> {
  const response = await getUserAssignmentExtraAttributes(input, field);
  return extractUserAssignmentFieldOptionsFromHtml(String(response.update ?? ""));
}

/**
 * Returns the assignment listing used by Settings > Company > Assignment. The row actions
 * HTML contains the backend assignment id, which is required while wiring assignments to
 * survey channels.
 */
export async function getUserAssignments(
  input: CookieAuthenticatedFlowInput
): Promise<UserAssignmentListItem[]> {
  return withRequestContext(input, async (context) => {
    const csrfToken = await getCsrfToken(input, context);
    const query = new URLSearchParams({
      pbqBeYWPUn: csrfToken,
      _: String(Date.now()),
    });
    const response = await context.get(`${UserAssignmentApiEndpoints.getAssignment}?${query.toString()}`, {
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "X-Requested-With": "XMLHttpRequest",
      },
    });
    const payload = await parseJsonResponse<UserAssignmentListResponse>(
      response,
      `GET ${UserAssignmentApiEndpoints.getAssignment}`
    );

    return extractUserAssignmentsFromListResponse(payload);
  });
}

export async function getUserAssignmentByCodeOrName(
  input: CookieAuthenticatedFlowInput,
  match: {
    code?: string;
    name?: string;
  }
): Promise<UserAssignmentListItem | undefined> {
  const assignments = await getUserAssignments(input);
  const expectedCode = match.code?.trim();
  const expectedName = match.name?.trim();

  return assignments.find((assignment) => {
    if (expectedCode && expectedName) {
      return assignment.code === expectedCode && assignment.name === expectedName;
    }

    if (expectedCode) {
      return assignment.code === expectedCode;
    }

    if (expectedName) {
      return assignment.name === expectedName;
    }

    return false;
  });
}

/**
 * Creates or updates a user assignment through `/settings/editassignment`.
 * This helper focuses on the common include/exclude dropdown-style attributes and lets the
 * caller parameterize the applicable processes plus one or more attribute rules.
 */
export async function createUserAssignment(
  input: CookieAuthenticatedFlowInput,
  params: CreateUserAssignmentParams
): Promise<UserAssignmentApiResponse> {
  return withRequestContext(input, async (context) => {
    const csrfToken = await getCsrfToken(input, context);
    const formBody = new URLSearchParams();

    formBody.set("pbqBeYWPUn", csrfToken);
    formBody.set("mode", "edit");
    formBody.set("TenantAssignmentFramework[id]", "");
    formBody.set("TenantAssignmentFramework[name]", params.name ?? createRandomUserAssignmentName());
    formBody.set("TenantAssignmentFramework[description]", params.description ?? "");

    for (const processId of params.applicableProcessIds) {
      formBody.append("TenantAssignmentFramework[applicable_for_process][]", String(processId));
    }

    params.rules.forEach((rule, index) => {
      formBody.append(`TenantAssignmentFramework[attribute][${index}]`, rule.attribute);
      formBody.append(`TenantAssignmentFramework[type][${index}]`, rule.type ?? "include");

      if (rule.selectedValues?.length) {
        formBody.append(
          `TenantAssignmentFramework[${rule.attribute}]`,
          JSON.stringify(rule.selectedValues)
        );
      }
    });

    const response = await context.post(UserAssignmentApiEndpoints.editAssignment, {
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "X-Requested-With": "XMLHttpRequest",
      },
      data: formBody.toString(),
    });

    return parseJsonResponse<UserAssignmentApiResponse>(
      response,
      `POST ${UserAssignmentApiEndpoints.editAssignment}`
    );
  });
}

/**
 * Convenience helper for the common case where the assignment should target all currently
 * available values for a field such as `parent_company_id`.
 */
export async function createUserAssignmentForFieldUsingAvailableValues(
  input: CookieAuthenticatedFlowInput,
  params: CreateUserAssignmentForFieldUsingAvailableValuesParams
): Promise<{
  fieldOptions: UserAssignmentFieldOption[];
  assignment: UserAssignmentApiResponse;
  assignmentName: string;
  assignmentCode: string;
}> {
  const fieldOptions = await getUserAssignmentFieldOptions(input, params.field);
  const fieldValueIds = fieldOptions.map((option) => option.value);
  const assignmentName = params.name ?? createRandomUserAssignmentName();

  const assignment = await createUserAssignment(input, {
    applicableProcessIds: params.applicableProcessIds,
    name: assignmentName,
    description: params.description,
    rules: [
      {
        attribute: params.field,
        type: params.type ?? "include",
        selectedValues: fieldValueIds,
      },
    ],
  });

  return {
    fieldOptions,
    assignment,
    assignmentName,
    assignmentCode: extractUserAssignmentCodeFromMessage(String(assignment.message ?? "")),
  };
}
