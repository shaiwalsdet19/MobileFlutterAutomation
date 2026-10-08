import {
  resolveCookieAuthenticatedFlowInput,
  type CookieAuthenticatedFlowInput,
} from "../../apis/common/cookie-auth.api";
import {
  extractBgvCompletedReviewIdentityText,
  extractBgvCompletedReviewRowText,
  fetchBgvCompletedReviewsPage,
  type BgvCompletedReviewRow,
} from "../../pages/onboarding/bgv/api/bgv-completed.api";

/**
 * Input contract for the completed-BGV-review search flow.
 *
 * This flow works on top of cookie-authenticated API access, so the caller can either
 * pass the raw cookie/session details directly or rely on a higher-level input that
 * `resolveCookieAuthenticatedFlowInput()` knows how to normalize.
 *
 * Search tuning options:
 * - `expectedCandidate`: candidate text that should appear in the response payload.
 * - `pageSize`: number of rows fetched per API request.
 * - `maxPages`: upper safety limit to stop pagination after a fixed number of pages.
 * - `matchScope`:
 *    - `identity`: search only the identity-specific text extracted from each row.
 *    - `row`: search across the full row text.
 * - `matchMode`:
 *    - `includes`: partial match after normalization.
 *    - `exact`: full-text equality after normalization.
 */
export interface FindCandidateInCompletedBgvReviewsInput
  extends CookieAuthenticatedFlowInput {
  expectedCandidate: string;
  pageSize?: number;
  maxPages?: number;
  matchScope?: "identity" | "row";
  matchMode?: "includes" | "exact";
}

/**
 * Search result returned by the flow.
 *
 * Besides `found`, this object also exposes debug-friendly metadata so test cases can
 * understand how much of the dataset was scanned and which row actually matched.
 */
export interface FindCandidateInCompletedBgvReviewsResult {
  found: boolean;
  expectedCandidate: string;
  pagesChecked: number;
  rowsChecked: number;
  matchedRow?: BgvCompletedReviewRow;
  matchedText?: string;
}

/**
 * Makes comparisons stable by:
 * 1. collapsing repeated whitespace,
 * 2. trimming leading/trailing spaces,
 * 3. lowercasing the final text.
 *
 * This avoids false mismatches caused by formatting differences in API responses.
 */
function normalizeText(value: string): string {
  return value.replace(/\s+/g, " ").trim().toLowerCase();
}

/**
 * Guards pagination inputs like `pageSize` and `maxPages`.
 * If the input is missing, invalid, or <= 0, the provided fallback is used.
 */
function toPositiveInteger(value: number | undefined, fallback: number): number {
  if (value === undefined || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return Math.floor(value);
}

/**
 * Parses server counters such as `recordsFiltered`/`recordsTotal`.
 * The API can return numbers or numeric strings, so this helper normalizes them into a
 * non-negative integer. If parsing fails, we fall back to a safe caller-provided value.
 */
function toNonNegativeInteger(
  value: string | number | undefined,
  fallback: number
): number {
  const numericValue = Number(value);
  return Number.isFinite(numericValue) && numericValue >= 0 ? Math.floor(numericValue) : fallback;
}

/**
 * Chooses the text representation used for matching.
 *
 * `identity` keeps the search strict to candidate identity details.
 * `row` broadens the search to the entire row payload when identity-only matching is not enough.
 */
function getRowMatchText(
  row: BgvCompletedReviewRow,
  matchScope: "identity" | "row"
): string {
  return matchScope === "row"
    ? extractBgvCompletedReviewRowText(row)
    : extractBgvCompletedReviewIdentityText(row);
}

function isExpectedCandidateMatch(
  expectedCandidate: string,
  candidateText: string,
  matchMode: "includes" | "exact"
): boolean {
  const normalizedExpectedCandidate = normalizeText(expectedCandidate);
  const normalizedCandidateText = normalizeText(candidateText);

  if (!normalizedExpectedCandidate || !normalizedCandidateText) {
    return false;
  }

  return matchMode === "exact"
    ? normalizedCandidateText === normalizedExpectedCandidate
    : normalizedCandidateText.includes(normalizedExpectedCandidate);
}

/**
 * Searches the completed BGV reviews listing through the backend pagination API.
 *
 * Flow overview:
 * 1. Validate that the caller supplied a non-empty `expectedCandidate`.
 * 2. Resolve authentication/cookie details into the final API-ready input.
 * 3. Normalize optional controls like page size, page limit, match scope, and match mode.
 * 4. Call the completed-reviews API page by page using DataTable-style pagination:
 *    - `draw` increments for each request,
 *    - `start` tracks the row offset,
 *    - `length` controls page size.
 * 5. For every row returned:
 *    - extract the text based on `matchScope`,
 *    - normalize both actual and expected text,
 *    - compare them using `includes` or `exact`.
 * 6. Return immediately on the first match with diagnostic metadata.
 * 7. If the API returns no rows or pagination reaches the known total, return `found: false`.
 *
 * This function is designed for flow reuse in tests where the caller needs more than a boolean,
 * such as the matched row payload or the number of scanned pages.
 */
export async function findCandidateInCompletedBgvReviews(
  input: FindCandidateInCompletedBgvReviewsInput
): Promise<FindCandidateInCompletedBgvReviewsResult> {
  const expectedCandidate = input.expectedCandidate.trim();

  if (!expectedCandidate) {
    throw new Error("expectedCandidate is required to search completed BGV reviews.");
  }

  const flowInput = await resolveCookieAuthenticatedFlowInput(input);
  const pageSize = toPositiveInteger(input.pageSize, 100);
  const maxPages = toPositiveInteger(input.maxPages, Number.MAX_SAFE_INTEGER);
  const matchScope = input.matchScope ?? "identity";
  const matchMode = input.matchMode ?? "includes";

  // `pagesChecked` and `rowsChecked` are returned to the caller so the flow can be
  // debugged easily when a candidate is unexpectedly missing.
  let pagesChecked = 0;
  let rowsChecked = 0;

  // `start` is the row offset expected by the paginated API.
  // `totalRows` begins as an effectively-unbounded value and is tightened once the
  // first response tells us how many rows exist on the server.
  let start = 0;
  let totalRows = Number.MAX_SAFE_INTEGER;

  while (pagesChecked < maxPages && start < totalRows) {
    // Fetch one page from the completed BGV reviews dataset.
    const response = await fetchBgvCompletedReviewsPage({
      ...flowInput,
      draw: pagesChecked + 1,
      start,
      length: pageSize,
    });
    const rows = Array.isArray(response.data) ? response.data : [];

    pagesChecked += 1;
    rowsChecked += rows.length;

    // Prefer `recordsFiltered` because it reflects the currently queryable result set.
    // If it is unavailable, fall back to `recordsTotal`. If both are unusable, use
    // `rowsChecked` so the loop can still progress safely without becoming infinite.
    totalRows = toNonNegativeInteger(
      response.recordsFiltered ?? response.recordsTotal,
      rowsChecked
    );

    // Scan the current page row-by-row and stop immediately once the candidate matches.
    for (const row of rows) {
      const candidateText = getRowMatchText(row, matchScope);
      if (isExpectedCandidateMatch(expectedCandidate, candidateText, matchMode)) {
        return {
          found: true,
          expectedCandidate,
          pagesChecked,
          rowsChecked,
          matchedRow: row,
          matchedText: candidateText,
        };
      }
    }

    // An empty page means there is nothing more to scan, even if the reported totals
    // were inaccurate or stale.
    if (!rows.length) {
      break;
    }

    // Move the pagination window to the next chunk of rows.
    start += pageSize;
  }

  return {
    found: false,
    expectedCandidate,
    pagesChecked,
    rowsChecked,
  };
}

/**
 * Lightweight wrapper for callers that only care about presence/absence.
 * Internally it reuses the richer flow and returns just the boolean flag.
 */
export async function isCandidatePresentInCompletedBgvReviews(
  input: FindCandidateInCompletedBgvReviewsInput
): Promise<boolean> {
  return (await findCandidateInCompletedBgvReviews(input)).found;
}
