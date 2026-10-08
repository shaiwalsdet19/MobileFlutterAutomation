import { Page, Response } from "@playwright/test";

// ── Response Types ────────────────────────────────────────────────────────────

export interface FormDetail {
  form_id: string;
  form_name: string;
  form_type: string;
  status: number;
  version: number;
}

export interface FormDetailResponse {
  data: FormDetail;
  status: number;
  message: string;
}

// ── Internal Helpers ──────────────────────────────────────────────────────────

type WaitOptions = { timeout?: number };

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function hasPathname(response: Response, pathname: string): boolean {
  return new URL(response.url()).pathname === pathname;
}

async function waitForPost(page: Page, pathname: string, timeout = 30_000): Promise<Response> {
  return page.waitForResponse(
    (r) => r.request().method() === "POST" && hasPathname(r, pathname),
    { timeout }
  );
}

// ── Public API Object ─────────────────────────────────────────────────────────

export const FormPreviewApi = {
  /**
   * URL path pattern for the Form Preview page.
   * Format: /ms/formbuilder/settings/preview/:formId/:version
   */
  previewPathPattern: /^\/ms\/formbuilder\/settings\/preview\/[^/]+\/\d+$/,

  /**
   * API endpoints consumed by this page.
   */
  endpoints: {
    /** POST — fetches form details by ID */
    getFormDetailById: "/formsapi/getFormDetailById",
    /** POST — fetches form field values for preview */
    getDetailsValues: "/formsapi/getdetailsvalues",
    /** GET — fetches translations for form builder */
    getTranslations: "/TranslationApi/GetTranslations",
  } as const,

  // ── URL Helpers ─────────────────────────────────────────────────────────────

  /**
   * Constructs the full preview URL for a given form.
   * @param baseUrl - Base application URL (e.g., https://forms4.qa.darwinbox.io)
   * @param formId - Form identifier
   * @param version - Form version number (default: 1)
   */
  getPreviewUrl(baseUrl: string, formId: string, version = 1): string {
    return `${normalizeBaseUrl(baseUrl)}/ms/formbuilder/settings/preview/${formId}/${version}`;
  },

  /**
   * Checks if a response URL matches the preview page pattern.
   */
  isPageResponse(response: Response | null): boolean {
    if (!response) return false;
    const pathname = new URL(response.url()).pathname;
    return this.previewPathPattern.test(pathname);
  },

  // ── API Wait Helpers ────────────────────────────────────────────────────────

  /**
   * Waits for the form detail API response.
   * Fired on page load to fetch form configuration.
   */
  async waitForFormDetail(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getFormDetailById, options.timeout);
  },

  /**
   * Waits for the form values API response.
   * Fired after form detail loads to populate preview data.
   */
  async waitForFormValues(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForPost(page, this.endpoints.getDetailsValues, options.timeout);
  },

  // ── Response Parsers ────────────────────────────────────────────────────────

  async parseFormDetail(response: Response): Promise<FormDetailResponse> {
    return response.json() as Promise<FormDetailResponse>;
  },

  // ── Domain Helpers ──────────────────────────────────────────────────────────

  isSuccessStatus(status: number | string | undefined): boolean {
    return status === 1 || status === "success";
  },
};
