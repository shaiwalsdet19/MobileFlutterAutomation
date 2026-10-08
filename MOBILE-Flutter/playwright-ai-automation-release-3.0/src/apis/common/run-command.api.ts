import {
  CookieAuthenticatedFlowInput,
  getCsrfToken,
  normalizeBaseUrl,
  parseJsonResponse,
  withRequestContext,
} from "./cookie-auth.api";

export interface RunInternalCommandParams extends CookieAuthenticatedFlowInput {
  /**
   * Backend command class or command identifier to execute, for example
   * `SurveySQSEmailsTask`.
   */
  command: string;
  /**
   * Positional command arguments passed as repeated `arguments[]` form fields in
   * the same order expected by the backend command handler.
   */
  arguments?: Array<string | number | boolean>;
  /**
   * CSRF/session-style token expected by the internal run command endpoint. In the
   * sample request this is passed both as a cookie value and as a POST body field.
   */
  pbqBeYWPUn?: string;
  /**
   * Optional referer path override if a tenant uses a variant route. Defaults to the
   * standard Run Commands page used by the browser request.
   */
  refererPath?: string;
  timeoutMs?: number;
}

export interface RunInternalCommandResponse {
  status?: number | string;
  message?: string;
  error?: unknown;
  data?: unknown;
  [key: string]: unknown;
}

export const RunCommandApi = {
  endpointPath: "/internal/runcommands",
  defaultRefererPath: "/internal/RunCommands",
};

function buildRunCommandFormBody(
  command: string,
  args: Array<string | number | boolean>,
  pbqBeYWPUn: string
): string {
  const formData = new URLSearchParams();
  formData.set("command", command);

  for (const arg of args) {
    formData.append("arguments[]", String(arg));
  }

  formData.set("pbqBeYWPUn", pbqBeYWPUn);
  return formData.toString();
}

/**
 * Calls Darwinbox's internal run-command endpoint using the same request shape as the
 * browser-originated `curl` example:
 * - cookie-authenticated request context
 * - `application/x-www-form-urlencoded` payload
 * - repeated `arguments[]` fields for positional command arguments
 * - `pbqBeYWPUn` included in the POST body because the endpoint expects it explicitly
 *
 * Use this helper for backend/admin commands that are triggered through
 * `/internal/runcommands`, for example queueing survey mail commands or other internal
 * operational tasks available on the Run Commands screen.
 */
export async function runInternalCommand(
  params: RunInternalCommandParams
): Promise<RunInternalCommandResponse> {
  const baseUrl = normalizeBaseUrl(params.baseUrl);

  return withRequestContext(params, async (context) => {
    const formBody = buildRunCommandFormBody(
      params.command,
      params.arguments ?? [],
      params.pbqBeYWPUn ?? (await getCsrfToken(params, context))
    );
    const response = await context.post(RunCommandApi.endpointPath, {
      headers: {
        Accept: "application/json, text/javascript, */*; q=0.01",
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        Origin: baseUrl,
        Referer: `${baseUrl}${params.refererPath ?? RunCommandApi.defaultRefererPath}`,
        "X-Requested-With": "XMLHttpRequest",
      },
      data: formBody,
      timeout: params.timeoutMs ?? 120_000,
    });

    return parseJsonResponse<RunInternalCommandResponse>(
      response,
      `POST ${RunCommandApi.endpointPath}`
    );
  });
}
