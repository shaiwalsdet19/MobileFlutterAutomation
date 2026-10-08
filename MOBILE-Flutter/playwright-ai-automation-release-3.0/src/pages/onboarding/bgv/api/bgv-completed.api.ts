import {
  CookieAuthenticatedFlowInput,
  formRequest,
  type JsonRecord,
} from "../../../../apis/common/cookie-auth.api";
import { BgvApi } from "./bgv.api";

export interface BgvCompletedReviewRow extends JsonRecord {
  employee_id: string;
  designation?: string;
  department?: string;
  business_unit?: string;
  office_location?: string;
  type?: string;
  additional_email_onb?: string;
  pending_with?: string;
  doj?: string;
  verification_package_name?: string;
  bgv_assigned_on?: string;
  bgv_completed_on?: string;
}

export interface BgvCompletedReviewsPaginationResponse extends JsonRecord {
  status?: string | number;
  draw?: string | number;
  recordsTotal?: string | number;
  recordsFiltered?: string | number;
  data?: BgvCompletedReviewRow[];
}

export interface BgvCompletedReviewsPaginationInput
  extends CookieAuthenticatedFlowInput {
  draw?: number;
  start?: number;
  length?: number;
  searchText?: string;
  sortColumn?: string;
  sortOrder?: "asc" | "desc";
}

type ColumnConfig = {
  data: string;
  name: string;
  searchable: boolean;
  orderable: boolean;
};

const COMPLETED_REVIEW_COLUMNS: ReadonlyArray<ColumnConfig> = [
  { data: "employee_id", name: "employee_id", searchable: true, orderable: true },
  { data: "designation", name: "designation", searchable: true, orderable: true },
  { data: "department", name: "department", searchable: true, orderable: true },
  { data: "business_unit", name: "business_unit", searchable: true, orderable: true },
  { data: "office_location", name: "office_location", searchable: true, orderable: true },
  { data: "type", name: "type", searchable: true, orderable: true },
  {
    data: "additional_email_onb",
    name: "additional_email_onb",
    searchable: true,
    orderable: false,
  },
  { data: "pending_with", name: "pending_with", searchable: true, orderable: true },
  { data: "doj", name: "doj", searchable: true, orderable: true },
  {
    data: "verification_package_name",
    name: "verification_package_name",
    searchable: true,
    orderable: true,
  },
  {
    data: "bgv_assigned_on",
    name: "bgv_assigned_on",
    searchable: true,
    orderable: true,
  },
  {
    data: "bgv_completed_on",
    name: "bgv_completed_on",
    searchable: true,
    orderable: true,
  },
] as const;

function getSortColumnIndex(sortColumn: string): number {
  const sortColumnIndex = COMPLETED_REVIEW_COLUMNS.findIndex(
    (column) => column.data === sortColumn || column.name === sortColumn
  );
  return sortColumnIndex >= 0 ? sortColumnIndex : 11;
}

function decodeHtmlEntities(value: string): string {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(value: string): string {
  return decodeHtmlEntities(value).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

export function extractBgvCompletedReviewIdentityText(
  row: Pick<BgvCompletedReviewRow, "employee_id">
): string {
  return stripHtml(row.employee_id ?? "");
}

export function extractBgvCompletedReviewRowText(row: BgvCompletedReviewRow): string {
  return Object.values(row)
    .map((value) => (typeof value === "string" ? stripHtml(value) : ""))
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildBgvCompletedReviewsPaginationForm(
  input: Pick<
    BgvCompletedReviewsPaginationInput,
    "draw" | "start" | "length" | "searchText" | "sortColumn" | "sortOrder" | "pbqBeYWPUn"
  > = {}
): Record<string, string | number | boolean> {
  const sortColumn = input.sortColumn ?? "bgv_completed_on";
  const sortOrder = input.sortOrder ?? "desc";

  const form: Record<string, string | number | boolean> = {
    draw: input.draw ?? 1,
    start: input.start ?? 0,
    length: input.length ?? 100,
    "search[text]": input.searchText ?? "",
    searchText: input.searchText ?? "",
    sort_column: sortColumn,
    sort_order: sortOrder,
    "order[0][column]": getSortColumnIndex(sortColumn),
    "order[0][dir]": sortOrder,
    "order[0][name]": sortColumn,
  };

  COMPLETED_REVIEW_COLUMNS.forEach((column, index) => {
    form[`columns[${index}][data]`] = column.data;
    form[`columns[${index}][name]`] = column.name;
    form[`columns[${index}][searchable]`] = column.searchable;
    form[`columns[${index}][orderable]`] = column.orderable;
    form[`columns[${index}][search][value]`] = "";
    form[`columns[${index}][search][regex]`] = false;
  });

  if (input.pbqBeYWPUn?.trim()) {
    form.pbqBeYWPUn = input.pbqBeYWPUn.trim();
  }

  return form;
}

export async function fetchBgvCompletedReviewsPage(
  input: BgvCompletedReviewsPaginationInput
): Promise<BgvCompletedReviewsPaginationResponse> {
  return formRequest<BgvCompletedReviewsPaginationResponse>(
    input,
    BgvApi.endpoints.completedReviewsPagination,
    buildBgvCompletedReviewsPaginationForm(input)
  );
}
