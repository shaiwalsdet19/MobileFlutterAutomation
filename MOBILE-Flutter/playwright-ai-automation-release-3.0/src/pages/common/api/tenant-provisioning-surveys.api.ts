import { Page, Response } from "@playwright/test";

type WaitOptions = {
  timeout?: number;
};

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

function hasPathname(response: Response, pathname: string): boolean {
  return new URL(response.url()).pathname === pathname;
}

async function waitForTenantProvisioningResponse(
  page: Page,
  method: "GET" | "POST",
  timeout = 30_000
): Promise<Response> {
  return page.waitForResponse(
    (response) =>
      response.request().method() === method &&
      hasPathname(response, TenantProvisioningSurveysApi.pagePath),
    { timeout }
  );
}

export const TenantProvisioningSurveysApi = {
  pagePath: "/settings/employees/tenantprovisioning",
  formId: "tenant_setting_level",

  getPageUrl(baseUrl: string): string {
    return `${normalizeBaseUrl(baseUrl)}${this.pagePath}`;
  },

  isTenantProvisioningResponse(response: Response | null): boolean {
    return response !== null && hasPathname(response, this.pagePath);
  },

  async waitForPageLoad(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForTenantProvisioningResponse(page, "GET", options.timeout);
  },

  async waitForSave(page: Page, options: WaitOptions = {}): Promise<Response> {
    return waitForTenantProvisioningResponse(page, "POST", options.timeout);
  },

  async parseHtml(response: Response): Promise<string> {
    return response.text();
  },
};
