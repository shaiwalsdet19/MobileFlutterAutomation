import { Locator } from "../../../common/locators/common";

/**
 * Locators for the Form Preview page.
 *
 * COVERAGE NOTE: Most UI elements on this page lack data-testid attributes.
 * Only elements with data-testid are included here per project standards.
 * Elements missing data-testid and NOT included:
 *   - Language dropdown (selector for preview language)
 *   - View mode buttons (desktop/tablet/mobile toggle)
 *   - Format Styles panel title and collapse button
 *   - All padding/margin/font-size sliders
 *   - Reset button
 *   - Save button
 *   - "Powered by" footer branding
 */
export const FormPreviewLocators = {
  // ── Page Shell ──────────────────────────────────────────────────────────────

  /**
   * Top navigation bluebar component (DBX-DS-BLUEBAR web component).
   * Contains search, notifications, and profile menu.
   */
  bluebar: {
    testId: "dbx-ds-bluebar",
    description: "Top navigation bluebar component",
  } as Locator,

  // ── Header ──────────────────────────────────────────────────────────────────

  /**
   * Preview mode header section.
   * Contains "Preview Mode" title and language selector.
   */
  header: {
    testId: "form-header",
    description: "Preview mode header section with title and language dropdown",
  } as Locator,

  /**
   * Form inside preview mode.
   */
  previewForm: {
    testId: "preview-form",
    description: "Form inside preview mode",
  } as Locator,
};
