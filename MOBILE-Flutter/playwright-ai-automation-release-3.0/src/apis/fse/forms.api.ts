import {
  CookieAuthenticatedFlowInput,
  JsonRecord,
  jsonRequest,
} from "../common/cookie-auth.api";

export interface FormsApiResponse<T = JsonRecord> {
  status?: number | string;
  message?: string;
  error?: unknown;
  errors?: unknown;
  data?: T;
  [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────────────────────
// Form Details API Response Types (getFormDetailById)
// ─────────────────────────────────────────────────────────────────────────────

export interface FormFieldConfig {
  edit?: boolean;
  isMandatory?: boolean;
  hide?: boolean;
  disableRolesFor?: boolean;
  exception?: boolean;
  enabledForVerification?: boolean;
}

export interface ExpressionBuilderEntry {
  inputText?: string | null;
  outputText?: string | null;
  isDataFetched?: boolean;
}

export interface ExpressionBuilderData {
  criticalityLogic?: ExpressionBuilderEntry;
  displayLogic?: ExpressionBuilderEntry;
  referenceLogic?: ExpressionBuilderEntry;
  calculationLogic?: ExpressionBuilderEntry;
  workFlowSkipLogic?: ExpressionBuilderEntry;
}

export interface QuestionLogic {
  useCode?: boolean;
  people?: unknown[];
  assignments?: unknown[];
  isAllowExternal?: boolean;
  skipTo?: string | null;
  type?: string;
  isLogicValid?: boolean;
  workFlowSkip?: string;
  criticalLogicType?: string;
  calculationType?: string;
  referenceType?: string;
  displayLogic?: string | null;
  calculationLogic?: string | null;
  referenceLogic?: string | null;
  workFlowSkipLogic?: string | null;
  criticalityLogic?: string | null;
  useDecisionMatrix?: boolean;
  useDecisionMatrixValues?: unknown[];
  enableChoiceBasedLogic?: boolean;
  optionLogicArray?: unknown[];
  expressionBuilderData?: ExpressionBuilderData;
}

export interface QuestionConfig {
  question?: string;
  questionId?: string;
  questionText?: string;
  questionType?: string;
  questionStatus?: boolean;
  rawHtmlContent?: string | null;
  rawHtmlContentAlternate?: string | null;
  alternateQuestion?: string | null;
  alternateQuestionControl?: unknown | null;
  resolveVariables?: unknown[];
  hidden?: boolean;
  prioritizeInSummary?: boolean;
  old_id?: string | null;
  isCritical?: boolean;
  isMandatory?: boolean;
  isConfidential?: boolean | null;
  instructions?: string | null;
  displayOnSameRow?: boolean | null;
  toolTipMessage?: string | null;
  addCommentField?: boolean | null;
  commentFieldTitle?: string;
  commentFieldPlaceHolder?: string;
  commentsMandatory?: boolean;
  confidentialTags?: unknown[];
  commentConfidentialTags?: unknown[];
  confidentialTagsEnable?: boolean;
  allowDataTable?: boolean;
  tableConfig?: unknown[];
  addOutLine?: boolean;
  hideTableHeader?: boolean;
  disableRolesFor?: unknown[];
  disableRolesForFlagEnabled?: boolean;
  translations?: unknown | null;
  smartTag?: unknown | null;
  minAttachments?: number;
  maxAttachments?: number;
  fileFormats?: unknown | null;
  allowAttachments?: boolean;
  questionBankId?: string | null;
  questionBankType?: string | null;
  exception?: boolean;
  enabledForVerification?: boolean;
  followUpConfig?: unknown | null;
  profilePermissions?: unknown[];
  profileSettings?: unknown[];
  minCommentCharacters?: number | null;
  maxCommentCharacters?: number | null;
  validationMessage?: string;
  validateResponse?: unknown | null;
  advanced?: unknown | null;
  applyRestrictions?: boolean;
  sentimentAnalysis?: boolean;

  // sys-attr-array specific
  attributeType?: string;
  array?: unknown | null;
  field?: unknown | null;
  eventType?: string;
  companyChange?: boolean;
  isPromotion?: boolean;
  isDemotion?: boolean;
  allowedCompanyChange?: boolean;
  allowedPromotionChange?: boolean;
  allowedDemotionChange?: boolean;
  systemAttributesSettingsDataModalVersion?: number;
  fieldType?: string | null;
  isEditAllowed?: boolean;
  updateInProfile?: boolean;
  showToRespondant?: boolean | null;
  config?: unknown[];
  fieldConfig?: Record<string, FormFieldConfig>;
  enableCopyPermanentAddressToEmergency?: boolean;
  enableArrayLevelConfig?: boolean;
  allowEditingFor?: unknown | null;
  enableFieldLevelConfig?: boolean;
  enableArrayLevelFilter?: boolean;
  arrayLevelFilterBy?: string;
  usePeopleSelector?: unknown | null;
  peopleSelectorQuestionAttached?: unknown | null;
  peopleSelectorReferenceQuestion?: unknown | null;
  peopleSelectorExcludeFor?: unknown | null;

  // date-time specific
  isMandatoryDTQuestion?: boolean;
  isQuestionDeletionDisallowed?: boolean;
  isIncludeTime?: boolean;
  dontAllowConfidential?: boolean;
  dateFormat?: string;
  isMeridian?: boolean;
  dateMinimum?: string;
  dateMaximum?: string;
  timeMinimum?: string;
  timeMaximum?: string;
  zone?: string;
  minusCurrent?: unknown | null;
  plusCurrent?: unknown | null;

  // text-box specific
  textBoxType?: boolean;
  placeHolder?: string;
  prefix?: string | null;
  suffix?: string | null;
  minimumCharacters?: number;
  maximumCharacters?: number;
  pattern?: string | null;
  validationType?: string | null;
  validationText?: string | null;
  enableDigitalSignature?: boolean;
  signatureVariable?: unknown | null;
  signatureProvider?: unknown | null;
  isSummary?: unknown | null;

  [key: string]: unknown;
}

export interface FormQuestion {
  name: string;
  question_type: string;
  order: number;
  custom_id: string;
  tagged_into_page: string;
  tagged_into_section?: string | null;
  logic?: QuestionLogic;
  config: QuestionConfig;
}

export interface FormSection {
  name?: string;
  order?: number;
  custom_id?: string;
  [key: string]: unknown;
}

export interface FormPage {
  name: string;
  order: number;
  custom_id: string;
  sections?: FormSection[];
}

export interface DependentRules {
  dependentValues?: Record<string, {
    custom_object?: string;
    systemAttributes?: unknown;
    presetDropdown?: unknown;
    presetDropdownDynamic?: unknown;
    scaleMapping?: unknown;
    surveyPillar?: unknown;
    [key: string]: unknown;
  }>;
  dependent_questions?: unknown[];
}

export interface FormConfig {
  questionIdCounter?: number;
  pageIdCounter?: number;
  is_after_revamp_form?: boolean;
  templateId?: string | null;
  signatureProvider?: unknown | null;
  settings?: JsonRecord;
  introduction?: JsonRecord;
  externalRepondent?: JsonRecord;
  thankYouPage?: JsonRecord;
  surveyExpiredPage?: JsonRecord;
  isValid?: boolean;
  [key: string]: unknown;
}

export interface AttachedToFlows {
  undertaking_clusters?: unknown[];
  onboarding_process_config?: unknown[];
  tenant_idp_plans?: unknown[];
  [key: string]: unknown;
}

export interface FormDetails {
  form_id: string;
  custom_workflow_id?: string | null;
  type?: string | null;
  dynamic_config?: unknown | null;
  token?: string | null;
  isOldForm?: boolean;
  user_id?: string | null;
  user_language?: string;
  pbqBeYWPUn?: string;
  code?: string;
  form_name: string;
  description?: string;
  form_type: string;
  use_in?: string[];
  form_config?: FormConfig;
  dependent_rules?: DependentRules;
  pages?: FormPage[];
  questions?: FormQuestion[];
  version?: number;
  form_status?: number;
  for_module?: string;
  module_transaction?: unknown | null;
  module?: string;
  calculation_formulae?: unknown[];
  [key: string]: unknown;
}

export interface FormDetailsApiResponse {
  status: number;
  message: string;
  form_details: FormDetails;
  attached_flows?: unknown[];
  attached_to_flows?: AttachedToFlows;
  user_language?: string;
  previous_form_details?: FormDetails | null;
  reference_form_details?: FormDetails | null;
}

/**
 * Represents the payload shape used by `/formsapi/formCreateUpdate`.
 *
 * The backend stores forms as a document with a few important top-level blocks:
 * - `form_name`, `description`, `form_type`, `use_in`, `module`, `for_module`
 * - `form_config`, which usually contains builder counters like `questionIdCounter`
 *   and `pageIdCounter`
 * - `pages`, where each page contains ordered `sections`
 * - `questions`, where each question carries both placement metadata and its full
 *   `config` object
 * - `dependent_rules`, which maps question ids to cross-field dependencies such as
 *   preset dropdowns, scale mappings, survey pillars, system attributes, and array fields
 *
 * Practical conventions taken from real form JSON:
 * - Question ids follow a generated pattern like `f1`, `f2`, `f3`, and are usually
 *   stored in both `questions[].custom_id` and `questions[].config.questionId`
 * - `form_config.questionIdCounter` should stay aligned with the highest generated
 *   question id so newly added questions do not collide with existing ones
 * - Page ids are usually string-based like `"1"` and questions are linked back through
 *   `tagged_into_page` and optionally `tagged_into_section`
 * - `dependent_rules.dependentValues` is keyed by question id, so changing a question id
 *   means the matching dependency entry must also be updated
 *
 * Special builder convention:
 * - When a profile-updating form has `updateInProfile` enabled for applicable questions,
 *   the builder generally includes an `Effective Date` field on `f0`
 * - Because of that, callers should treat `f0` as a reserved starter id pattern in
 *   update-in-profile scenarios and begin normal generated business questions from `f1`
 *
 * Common question metadata:
 * Every entry inside `questions[]` usually contains:
 * - `name`: builder display name such as `Text Box`, `Date & Time`, `Rating`
 * - `question_type`: backend/frontend type key such as `text-box`, `date-time`,
 *   `choices`, `system-attributes`, `survey-pillar`
 * - `order`: numeric order in the rendered form
 * - `custom_id`: generated id such as `f1`, `f2`, `f3`
 * - `tagged_into_page`: page id, usually a string like `"1"`
 * - `tagged_into_section`: section id or `null`
 * - optional `logic`: expression-builder and display/reference/calculation rules
 * - `config`: the actual question configuration payload described below
 *
 * Common `config` fields automatically added by the builder:
 * The builder service injects a broad shared base across many question types. Depending
 * on the control, you will commonly see some or many of these keys:
 * - identity/display: `questionId`, `questionText`, `questionType`, `questionStatus`,
 *   `rawHtmlContent`, `rawHtmlContentAlternate`, `alternateQuestion`,
 *   `alternateQuestionControl`, `translations`
 * - generic UX: `instructions`, `toolTipMessage`, `placeHolder`, `displayOnSameRow`,
 *   `hidden`, `addOutLine`, `columnSpread`
 * - validation/behavior: `isMandatory`, `validationMessage`, `validateResponse`,
 *   `applyRestrictions`, `exception`, `enabledForVerification`
 * - confidentiality/governance: `isConfidential`, `isCritical`, `confidentialTags`,
 *   `commentConfidentialTags`, `confidentialTagsEnable`, `disableRolesFor`,
 *   `disableRolesForFlagEnabled`
 * - comments/follow-ups: `addCommentField`, `commentFieldTitle`,
 *   `commentFieldPlaceHolder`, `commentsMandatory`, `minCommentCharacters`,
 *   `maxCommentCharacters`, `followUpConfig`
 * - attachments/table/bank metadata: `allowAttachments`, `minAttachments`,
 *   `maxAttachments`, `fileFormats`, `allowDataTable`, `tableConfig`,
 *   `questionBankId`, `questionBankType`, `smartTag`
 * - compatibility/migration: `old_id`, `prioritizeInSummary`, `resolveVariables`
 *
 * Question-type-specific configuration families from `src/shared/controls.service.ts`:
 *
 * 1. Text-like inputs
 * - `text-box`: `textBoxType`, `minimumCharacters`, `maximumCharacters`, `pattern`,
 *   `prefix`, `suffix`, `enableDigitalSignature`, `validationType`, `validationText`
 * - `numeric`: `min`, `max`, `minDecimal`, `maxDecimal`, `noDecimalsAllowed`,
 *   `decimalsAllowed`, `noNegativeNumber`, `separatorType`, slider-related keys
 * - `email`: email-flavored text config with `isEmail`
 * - `phone-box`: phone defaults such as `defaultValue`, `selectedCodes`, `countries`
 * - `currency`: currency selection plus `selectedCodes`, `validationsList`,
 *   and number validation behavior
 *
 * 2. Date/time inputs
 * - `date-time`: `isIncludeTime`, `dateFormat`, `zone`, `dateMinimum`, `dateMaximum`,
 *   `timeMinimum`, `timeMaximum`, `minusCurrent`, `plusCurrent`,
 *   `isMandatoryDTQuestion`, `isQuestionDeletionDisallowed`
 * - This is also the shape used for the reserved `f0` effective-date question in
 *   update-in-profile flows
 *
 * 3. Choice-based questions
 * - `choices`, `multiple-choice`, `picture`, `picture-multiple`, `rank-order`
 *   generally use a `choices` array of option objects
 * - Each option usually follows the builder option model:
 *   `id`, `value`, `label`, `hidden`, `checked`, `placeHolder`, `s3Key`,
 *   `actualMarks`, `scaleMarks`, `unique_id`
 * - These types can also carry `randomChoices`, `addOtherChoice`, `otherChoice`,
 *   `otherPlaceHolder`, `minChoices`, `maxChoices`, `isMultiChoices`, `isHorizontal`
 *
 * 4. Dropdown-style questions
 * - `custom-dropdown`, `custom-dropdown-multiple` typically store choices as a newline
 *   separated `choices` string, along with `defaultChoice`, `defaultChoiceCheckbox`,
 *   `showInSameBox`, `isMultiChoices`, `minChoices`, `maxChoices`
 * - `preset-dropdown`, `preset-dropdown-dynamic` usually store a selected source object
 *   in `select`, for example `{ label, id, value, name }`, plus dynamic source flags
 *   like `stdOptionArray`, `enableDesignationTitleSelection`, etc.
 *
 * 5. Scale and survey analytics questions
 * - `rating`: `ratingType`, `ratingLength`, `enableNonApplicable`,
 *   `ratingLabels`, `leftLabel`, `rightLabel`
 * - `scale-mapping`: `selectScaleType`, `selectedScaleName`, `selectedScales`,
 *   `selectOutputType`, `scaleLength`, and a `choices` array for scale prompts
 * - `survey-pillar`: `surveyPillar`, `title`, `weightage`, `pillarWeightage`,
 *   `surveyPillarClusterId`, `isAutoAdjustWeightage`
 *
 * 6. System-driven questions
 * - `system-attributes`: `attributeType`, `array`, `field`, `fieldType`,
 *   `isEditAllowed`, `updateInProfile`, `showToRespondant`, `isReadOnly`,
 *   `usePeopleSelector`, plus separation-field configuration when applicable
 * - `sys-attr-array`: `attributeType`, `array`, `eventType`, `fieldConfig`,
 *   `enableArrayLevelConfig`, `enableFieldLevelConfig`,
 *   `enableCopyPermanentAddressToEmergency`, `allowEditingFor`
 * - For many of these, `dependent_rules.dependentValues[fX]` stores companion metadata
 *   such as `systemAttributes`, `presetDropdown`, `presetDropdownDynamic`,
 *   `scaleMapping`, or `surveyPillar`
 *
 * 7. People, consent, signature, attachment, and content blocks
 * - `people-selector`: `peopleType`, `peopleStatus`, `userAssignments`,
 *   `doNotAllowOnNotice`, `isMultiChoices`
 * - `attachment`: `isEditAllowed`, `maxFileSize`, `fileFormats`
 * - `signature`: signature-specific toggles like `includeCheckBox`, `isSignatoryEnabled`,
 *   `signatory`, `message`
 * - `consent`: `checkboxMessage`, `hideQuestion`
 * - `image-text-box`: content-style blocks such as `headingValue`, `imageSrc`,
 *   `imageKey`, `uploadedFiles`
 *
 * Logic block notes:
 * If a question has conditional display/reference/calculation behavior, the builder
 * usually stores an adjacent `logic` object with fields like `displayLogic`,
 * `calculationLogic`, `referenceLogic`, `workFlowSkipLogic`, `criticalityLogic`,
 * `useDecisionMatrix`, `optionLogicArray`, and `expressionBuilderData`.
 *
 * Important update guidance:
 * - When cloning or updating an existing form, preserve `pages`, `sections`, question
 *   ids, section ids, and `dependent_rules` relationships unless you intentionally want
 *   to rebuild those references
 * - The API layer keeps this type intentionally broad because different question types
 *   add different `config` keys, but callers should still model payloads in the same
 *   overall document structure as the sample form JSON returned by `getFormDetailById`
 */
export interface FormCreateUpdatePayload extends JsonRecord {
  form_name: string;
  description: string;
  form_type: string;
  use_in: string | string[];
  form_config: JsonRecord;
  dependent_rules: unknown[] | JsonRecord | null;
  pages: unknown[];
  questions: unknown[];
  status?: number;
  [key: string]: unknown;
}

export interface CreateSurveyFormTextQuestionParams {
  questionId: string;
  order: number;
  questionText: string;
  pageId?: string;
  sectionId?: string | null;
  configOverrides?: JsonRecord;
}

export interface BuildSurveyFormPayloadFromTextQuestionsParams {
  formName: string;
  formDescription?: string;
  questionTexts: string[];
  formConfigOverrides?: JsonRecord;
  payloadOverrides?: Partial<FormCreateUpdatePayload>;
  questionConfigOverrides?: JsonRecord;
}

const FormsApiEndpoints = {
  formsDetails: "/formsapi/getDetails",
  formsCreateOrUpdate: "/formsapi/formCreateUpdate",
  formsDetailById: "/formsapi/getFormDetailById",
} as const;

const DEFAULT_SURVEY_FORM_SETTINGS: JsonRecord = {
  displayProgBar: true,
  questionCount: true,
  barPostion: "top",
  completePercentage: false,
  custButtonLabel: null,
  nextType: null,
  mandateField: null,
  customButtonColor: null,
  isCustomSurveyBgEnabled: null,
  customBGType: null,
  customBgImgOpacity: null,
  customBGColor: null,
  customBGImageS3Key: null,
  loginMandate: null,
  enableAutoSave: null,
  enablePreviousPage: null,
  saveNdCont: true,
  translations: null,
  surveyLanguage: null,
  chatSurveyIcon: null,
  showChatLogoName: false,
  chatLogoName: "Darwinbox Chat",
  showChatIntroText: false,
  chatIntroText: "Hi, Hope you have a lovely day. I would like you to answer a few questions.",
  greetingMessage: "Let's kick things off-answer a few quick questions to help us improve.",
  endingMessgage: "Almost done! You're one click away from submitting your responses.",
};

const DEFAULT_SURVEY_FORM_INTRODUCTION: JsonRecord = {
  heading: "We value your perspective.",
  subHeading: "Welcome to the #survey_name#",
  description:
    "Answer a few short questions to help us focus on what matters most. It takes just a few minutes and directly shapes what we improve next.",
  enableIntroductionPage: true,
  termConditions: false,
  label: "Terms and Conditions",
  url: "https://darwinbox.com/terms-of-use",
  customRadio: true,
  tmcCheckbox: false,
  buttonLabel: "Get Started",
  imageSrc: null,
  pageAlignment: "left",
  translations: null,
  enable: true,
};

const DEFAULT_SURVEY_FORM_EXTERNAL_RESPONDENT: JsonRecord = {
  pageTitle: null,
  description: null,
  fname: {
    label: null,
    checked: null,
    answer: null,
  },
  lname: {
    label: null,
    checked: null,
    answer: null,
  },
  gender: {
    label: null,
    checked: null,
    answer: null,
  },
  email: {
    label: null,
    checked: null,
    answer: null,
  },
  phNum: {
    label: null,
    checked: null,
    answer: {
      code: null,
      number: null,
    },
  },
  company: {
    label: null,
    checked: null,
    answer: null,
  },
  address: {
    label: null,
    checked: null,
    answer: null,
  },
  address2: {
    label: null,
    checked: null,
    answer: null,
  },
  city: {
    label: null,
    checked: null,
    answer: null,
  },
  state: {
    label: null,
    checked: null,
    answer: null,
  },
  zip: {
    label: null,
    checked: null,
    answer: null,
  },
  country: {
    label: null,
    checked: null,
    answer: null,
  },
  translations: null,
  enable: false,
};

const DEFAULT_SURVEY_FORM_THANK_YOU_PAGE: JsonRecord = {
  heading: "Thank You for Sharing Your Feedback",
  description: "We appreciate your thoughts-they'll help us make work better for everyone",
  includeButton: null,
  personalizedThankYouEnabled: false,
  personalizedMessageType: "favourability",
  positiveThreshold: 80,
  negativeThreshold: 30,
  neutralMinThreshold: 30,
  neutralMaxThreshold: 80,
  positiveFeedback: {
    heading: "Thank You for Your Valuable Feedback!",
    description:
      "<span style=\"color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; letter-spacing: -0.08px; white-space-collapse: preserve;\">We're thrilled to hear your experience was positive! Knowing we met your expectations helps us continue enhancing our services. Your feedback is invaluable, and we're grateful for your support!</span>",
  },
  neutralFeedback: {
    heading: "Thanks for Sharing Your Thoughts",
    description:
      "<span style=\"color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; letter-spacing: -0.08px; white-space-collapse: preserve;\">Thank you for your honest feedback. It helps us understand what's working and where we can improve. We're committed to creating a better experience for you, and your input is essential in guiding us forward.</span>",
  },
  negativeFeedback: {
    heading: "We're Here to Listen and Improve",
    description:
      "<span style=\"color: rgb(23, 43, 77); font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, Roboto, Oxygen, Ubuntu, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; letter-spacing: -0.08px; white-space-collapse: preserve;\">Thank you for your feedback. We're sorry to hear your experience didn't meet your expectations and are committed to addressing concerns. Your input guides us in improving, and we appreciate the chance to do better.</span>",
  },
  primaryButton: "GO BACK TO DASHBOARD",
  secondaryButton: "BUTTON LABEL 2",
  redirectLink: null,
  secondRedirectLink: null,
  imageSrc: null,
  pageAlignment: "left",
  translations: null,
  enable: true,
};

const DEFAULT_SURVEY_FORM_EXPIRED_PAGE: JsonRecord = {
  heading: null,
  description: null,
  includeButton: null,
  primaryButton: "GO BACK TO DASHBOARD",
  secondaryButton: "BUTTON LABEL 2",
  redirectLink: null,
  secondRedirectLink: null,
  imageKey: null,
  pageAlignment: "left",
  translations: null,
  enable: true,
};

function buildDefaultSurveyFormConfig(questionCount: number): JsonRecord {
  return {
    is_after_revamp_form: true,
    templateId: null,
    signatureProvider: null,
    settings: DEFAULT_SURVEY_FORM_SETTINGS,
    introduction: DEFAULT_SURVEY_FORM_INTRODUCTION,
    externalRepondent: DEFAULT_SURVEY_FORM_EXTERNAL_RESPONDENT,
    thankYouPage: DEFAULT_SURVEY_FORM_THANK_YOU_PAGE,
    surveyExpiredPage: DEFAULT_SURVEY_FORM_EXPIRED_PAGE,
    isValid: true,
    questionIdCounter: questionCount,
    pageIdCounter: 1,
  };
}

function isPlainObject(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeJsonRecords(base: JsonRecord, overrides?: JsonRecord): JsonRecord {
  if (!overrides) {
    return { ...base };
  }

  const merged: JsonRecord = { ...base };

  for (const [key, overrideValue] of Object.entries(overrides)) {
    const baseValue = merged[key];

    if (isPlainObject(baseValue) && isPlainObject(overrideValue)) {
      merged[key] = mergeJsonRecords(baseValue, overrideValue);
      continue;
    }

    merged[key] = overrideValue as JsonRecord[keyof JsonRecord];
  }

  return merged;
}

function sanitizeSurveyTextQuestions(questionTexts: string[]): string[] {
  const sanitizedQuestionTexts = questionTexts
    .map((questionText) => questionText.trim())
    .filter(Boolean);

  if (!sanitizedQuestionTexts.length) {
    throw new Error("Survey form creation expects at least one non-empty text question.");
  }

  return sanitizedQuestionTexts;
}

/**
 * Builds a text-question definition in the same document shape expected by the form builder
 * API, while still allowing callers to override specific config keys when a tenant needs
 * extra metadata on top of the standard text-box configuration.
 */
export function createSurveyFormTextQuestion(
  params: CreateSurveyFormTextQuestionParams
): JsonRecord {
  const pageId = params.pageId ?? "1";

  return {
    name: "Text Box",
    question_type: "text-box",
    order: params.order,
    custom_id: params.questionId,
    tagged_into_page: pageId,
    tagged_into_section: params.sectionId ?? null,
    config: {
      question: params.questionText,
      questionId: params.questionId,
      questionText: params.questionText,
      questionType: "text-box",
      questionStatus: true,
      instructions: null,
      rawHtmlContent: `<p id="p-tag-wrapper" data-placeholder="Enter here" style="margin: 0px;padding: 0.75rem;">${params.questionText}</p>`,
      rawHtmlContentAlternate: "",
      alternateQuestion: "",
      alternateQuestionControl: null,
      placeHolder: "Enter here",
      resolveVariables: [],
      hidden: false,
      isMandatory: false,
      isConfidential: false,
      displayOnSameRow: false,
      toolTipMessage: null,
      addCommentField: false,
      commentFieldTitle: "Any Comments?",
      commentFieldPlaceHolder: "Enter comments here",
      validationMessage: "Please enter valid response",
      old_id: "",
      textBoxType: true,
      minimumCharacters: 0,
      maximumCharacters: 200,
      pattern: null,
      validationType: null,
      validationText: null,
      applyRestrictions: true,
      commentsMandatory: false,
      confidentialTags: [],
      confidentialTagsEnable: false,
      allowDataTable: false,
      tableConfig: [],
      addOutLine: false,
      hideTableHeader: false,
      disableRolesFor: [],
      disableRolesForFlagEnabled: false,
      translations: null,
      ...params.configOverrides,
    },
  };
}

/**
 * Assembles a survey form payload from simple text-question inputs so callers can create
 * a valid survey form without hand-authoring the full builder document every time.
 */
export function buildSurveyFormPayloadFromTextQuestions(
  params: BuildSurveyFormPayloadFromTextQuestionsParams
): FormCreateUpdatePayload {
  const questionTexts = sanitizeSurveyTextQuestions(params.questionTexts);
  const questions = questionTexts.map((questionText, index) =>
    createSurveyFormTextQuestion({
      questionId: `f${index + 1}`,
      order: index + 1,
      questionText,
      configOverrides: params.questionConfigOverrides,
    })
  );

  return {
    form_name: params.formName,
    description: params.formDescription ?? "",
    form_type: "2",
    use_in: [],
    form_config: mergeJsonRecords(
      buildDefaultSurveyFormConfig(questions.length),
      params.formConfigOverrides
    ),
    dependent_rules: {
      dependentValues: {},
      dependent_questions: [],
    },
    pages: [
      {
        name: "Initial Page",
        order: 0,
        custom_id: "1",
      },
    ],
    questions,
    ...params.payloadOverrides,
  } as FormCreateUpdatePayload;
}

/**
 * Convenience helper that builds a text-question survey form payload and immediately sends
 * it to the Forms API using the shared create endpoint.
 */
export async function createSurveyFormFromTextQuestions(
  input: CookieAuthenticatedFlowInput,
  params: BuildSurveyFormPayloadFromTextQuestionsParams
): Promise<FormsApiResponse> {
  const payload = buildSurveyFormPayloadFromTextQuestions(params);
  return createSurveyForm(input, payload);
}

/**
 * Loads the form-builder bootstrap payload that powers survey form creation. This is
 * usually the first forms API call in setup code because it exposes the tenant-specific
 * builder metadata needed to construct valid form creation or edit payloads.
 */
export async function getFormBuilderDetails(
  input: CookieAuthenticatedFlowInput,
  body: JsonRecord = {}
): Promise<FormsApiResponse> {
  return jsonRequest<FormsApiResponse>(input, FormsApiEndpoints.formsDetails, { body });
}

/**
 * Fetches a saved form definition by id so callers can inspect the exact pages,
 * questions, and builder configuration before deciding how to update that form.
 */
export async function getFormDetailById(
  input: CookieAuthenticatedFlowInput,
  formId: string,
  extraBody: JsonRecord = {}
): Promise<FormDetailsApiResponse> {
  return jsonRequest<FormDetailsApiResponse>(input, FormsApiEndpoints.formsDetailById, {
    body: {
      form_id: formId,
      ...extraBody,
    },
  });
}

/**
 * Creates a new survey-linked form through the Forms API. The payload stays flexible
 * because form schemas differ by template, moment, question types, and tenant features,
 * so the API layer should not over-constrain the caller's builder payload.
 */
export async function createSurveyForm(
  input: CookieAuthenticatedFlowInput,
  payload: FormCreateUpdatePayload
): Promise<FormsApiResponse> {
  return jsonRequest<FormsApiResponse>(input, FormsApiEndpoints.formsCreateOrUpdate, {
    body: payload,
  });
}

/**
 * Updates an existing form by sending the target `form_id` back to the same create/update
 * endpoint used by the builder UI. This keeps edit behavior aligned with backend versioning
 * rules instead of splitting create and update into unrelated code paths.
 */
export async function updateSurveyForm(
  input: CookieAuthenticatedFlowInput,
  formId: string,
  payload: FormCreateUpdatePayload
): Promise<FormsApiResponse> {
  return createSurveyForm(input, {
    ...payload,
    form_id: formId,
  });
}
