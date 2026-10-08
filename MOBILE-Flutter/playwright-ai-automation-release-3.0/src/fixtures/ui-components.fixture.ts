import { test as base, Page } from '@playwright/test';
import { TextInputUtils, SdsTextInputUtils, UiTextInputUtils } from '../components/ui-components/textInput/index.js';
import { NumericInputUtils, SdsNumericInputUtils, UiNumericInputUtils } from '../components/ui-components/numericInput/index.js';
import { DatepickerUtils, SdsDatepickerUtils, UiDatepickerUtils } from '../components/ui-components/datepicker/index.js';
import { CheckboxGroupUtils, SdsCheckboxGroupUtils, UiCheckboxGroupUtils } from '../components/ui-components/checkboxGroup/index.js';
import { RadioGroupUtils, SdsRadioGroupUtils, UiRadioGroupUtils } from '../components/ui-components/radioGroup/index.js';
import { DropdownUtils, SdsDropdownUtils, UiDropdownUtils } from '../components/ui-components/dropdown/index.js';
import { DaterangePickerUtils, SdsDaterangePickerUtils, UiDaterangePickerUtils } from '../components/ui-components/daterangePicker/index.js';
import { ToggleUtils, SdsToggleUtils, UiToggleUtils } from '../components/ui-components/toggle/index.js';
import { AccordionUtils, SdsAccordionUtils, UiAccordionUtils } from '../components/ui-components/accordion/index.js';
import { ConsentUtils } from '../components/ui-components/consent/index.js';
import { ButtonUtils } from '../components/ui-components/button/index.js';
import { MenuUtils } from '../components/ui-components/menu/index.js';
import { TabGroupUtils } from '../components/ui-components/tabGroup/index.js';
import { FiltersUtils } from '../components/ui-components/filters/index.js';
import { DialogUtils } from '../components/ui-components/dialog/index.js';
import { ConfirmationDialogUtils } from '../components/ui-components/confirmationDialog/index.js';
import { ChoicesUtils, SdsChoicesUtils } from '../components/ui-components/choices/index.js';
import { RatingUtils, SdsRatingUtils } from '../components/ui-components/rating/index.js';
import { CountryDropdownUtils, SdsCountryDropdownUtils } from '../components/ui-components/countryDropdown/index.js';
import { RankOrderUtils, SdsRankOrderUtils } from '../components/ui-components/rankOrder/index.js';
import { TimepickerUtils, SdsTimepickerUtils } from '../components/ui-components/timepicker/index.js';
import { TimepickerDropdownUtils, SdsTimepickerDropdownUtils } from '../components/ui-components/timepickerDropdown/index.js';
import { AttachmentUtils, SdsAttachmentUtils } from '../components/ui-components/attachment/index.js';
import { SignatureUtils, SdsSignatureUtils } from '../components/ui-components/signature/index.js';
import { PictureChoicesUtils, SdsPictureChoicesUtils } from '../components/ui-components/pictureChoices/index.js';
import { NpsUtils, SdsNpsUtils } from '../components/ui-components/nps/index.js';

interface SdsComponentsNamespace {
  textInput(testId: string): SdsTextInputUtils;
  numericInput(testId: string): SdsNumericInputUtils;
  datepicker(testId: string): SdsDatepickerUtils;
  radioGroup(testId: string): SdsRadioGroupUtils;
  checkboxGroup(testId: string): SdsCheckboxGroupUtils;
  dropdown(testId: string): SdsDropdownUtils;
  daterangePicker(testId: string): SdsDaterangePickerUtils;
  toggle(testId: string): SdsToggleUtils;
  accordion(testId: string): SdsAccordionUtils;
  choices(testId: string): SdsChoicesUtils;
  rating(testId: string): SdsRatingUtils;
  countryDropdown(testId: string): SdsCountryDropdownUtils;
  rankOrder(testId: string): SdsRankOrderUtils;
  timepicker(testId: string): SdsTimepickerUtils;
  timepickerDropdown(testId: string): SdsTimepickerDropdownUtils;
  attachment(testId: string): SdsAttachmentUtils;
  signature(testId: string): SdsSignatureUtils;
  pictureChoices(testId: string): SdsPictureChoicesUtils;
  nps(testId: string): SdsNpsUtils;
}

interface LegacyUiComponentsNamespace {
  textInput(testId: string): UiTextInputUtils;
  numericInput(testId: string): UiNumericInputUtils;
  datepicker(testId: string): UiDatepickerUtils;
  radioGroup(testId: string): UiRadioGroupUtils;
  checkboxGroup(testId: string): UiCheckboxGroupUtils;
  dropdown(testId: string): UiDropdownUtils;
  daterangePicker(testId: string): UiDaterangePickerUtils;
  toggle(testId: string): UiToggleUtils;
  accordion(testId: string): UiAccordionUtils;
}

interface DefaultComponentsNamespace {
  textInput(testId: string): TextInputUtils;
  checkboxGroup(testId: string): CheckboxGroupUtils;
  radioGroup(testId: string): RadioGroupUtils;
  datepicker(testId: string): DatepickerUtils;
  toggle(testId: string): ToggleUtils;
  consent(testId: string): ConsentUtils;
  dropdown(testId: string): DropdownUtils;
  button(testId: string): ButtonUtils;
  numericInput(testId: string): NumericInputUtils;
  menu(testId: string): MenuUtils;
  tabGroup(testId: string): TabGroupUtils;
  accordion(testId: string): AccordionUtils;
  daterangePicker(testId: string): DaterangePickerUtils;
  filters(testId: string): FiltersUtils;
  dialog(testId: string): DialogUtils;
  confirmationDialog(testId: string): ConfirmationDialogUtils;
  choices(testId: string): ChoicesUtils;
  rating(testId: string): RatingUtils;
  countryDropdown(testId: string): CountryDropdownUtils;
  rankOrder(testId: string): RankOrderUtils;
  timepicker(testId: string): TimepickerUtils;
  timepickerDropdown(testId: string): TimepickerDropdownUtils;
  attachment(testId: string): AttachmentUtils;
  signature(testId: string): SignatureUtils;
  pictureChoices(testId: string): PictureChoicesUtils;
  nps(testId: string): NpsUtils;
}

interface UiComponentsRootNamespace extends DefaultComponentsNamespace {
  sdsComponents: SdsComponentsNamespace;
  legacyUi: LegacyUiComponentsNamespace;
}

export interface ComponentPage extends Page {
  uiComponents: UiComponentsRootNamespace;
}

function extendPage(page: Page): ComponentPage {
  const extendedPage = page as ComponentPage;

  extendedPage.uiComponents = {
    textInput: (testId: string) => new TextInputUtils(page, testId),
    checkboxGroup: (testId: string) => new CheckboxGroupUtils(page, testId),
    radioGroup: (testId: string) => new RadioGroupUtils(page, testId),
    datepicker: (testId: string) => new DatepickerUtils(page, testId),
    toggle: (testId: string) => new ToggleUtils(page, testId),
    consent: (testId: string) => new ConsentUtils(page, testId),
    dropdown: (testId: string) => new DropdownUtils(page, testId),
    button: (testId: string) => new ButtonUtils(page, testId),
    numericInput: (testId: string) => new NumericInputUtils(page, testId),
    menu: (testId: string) => new MenuUtils(page, testId),
    tabGroup: (testId: string) => new TabGroupUtils(page, testId),
    accordion: (testId: string) => new AccordionUtils(page, testId),
    daterangePicker: (testId: string) => new DaterangePickerUtils(page, testId),
    filters: (testId: string) => new FiltersUtils(page, testId),
    dialog: (testId: string) => new DialogUtils(page, testId),
    confirmationDialog: (testId: string) => new ConfirmationDialogUtils(page, testId),
    choices: (testId: string) => new ChoicesUtils(page, testId),
    rating: (testId: string) => new RatingUtils(page, testId),
    countryDropdown: (testId: string) => new CountryDropdownUtils(page, testId),
    rankOrder: (testId: string) => new RankOrderUtils(page, testId),
    timepicker: (testId: string) => new TimepickerUtils(page, testId),
    timepickerDropdown: (testId: string) => new TimepickerDropdownUtils(page, testId),
    attachment: (testId: string) => new AttachmentUtils(page, testId),
    signature: (testId: string) => new SignatureUtils(page, testId),
    pictureChoices: (testId: string) => new PictureChoicesUtils(page, testId),
    nps: (testId: string) => new NpsUtils(page, testId),
    sdsComponents: {
      textInput: (testId: string) => new SdsTextInputUtils(page, testId),
      numericInput: (testId: string) => new SdsNumericInputUtils(page, testId),
      datepicker: (testId: string) => new SdsDatepickerUtils(page, testId),
      radioGroup: (testId: string) => new SdsRadioGroupUtils(page, testId),
      checkboxGroup: (testId: string) => new SdsCheckboxGroupUtils(page, testId),
      dropdown: (testId: string) => new SdsDropdownUtils(page, testId),
      daterangePicker: (testId: string) => new SdsDaterangePickerUtils(page, testId),
      toggle: (testId: string) => new SdsToggleUtils(page, testId),
      accordion: (testId: string) => new SdsAccordionUtils(page, testId),
      choices: (testId: string) => new SdsChoicesUtils(page, testId),
      rating: (testId: string) => new SdsRatingUtils(page, testId),
      countryDropdown: (testId: string) => new SdsCountryDropdownUtils(page, testId),
      rankOrder: (testId: string) => new SdsRankOrderUtils(page, testId),
      timepicker: (testId: string) => new SdsTimepickerUtils(page, testId),
      timepickerDropdown: (testId: string) => new SdsTimepickerDropdownUtils(page, testId),
      attachment: (testId: string) => new SdsAttachmentUtils(page, testId),
      signature: (testId: string) => new SdsSignatureUtils(page, testId),
      pictureChoices: (testId: string) => new SdsPictureChoicesUtils(page, testId),
      nps: (testId: string) => new SdsNpsUtils(page, testId),
    },
    legacyUi: {
      textInput: (testId: string) => new UiTextInputUtils(page, testId),
      numericInput: (testId: string) => new UiNumericInputUtils(page, testId),
      datepicker: (testId: string) => new UiDatepickerUtils(page, testId),
      radioGroup: (testId: string) => new UiRadioGroupUtils(page, testId),
      checkboxGroup: (testId: string) => new UiCheckboxGroupUtils(page, testId),
      dropdown: (testId: string) => new UiDropdownUtils(page, testId),
      daterangePicker: (testId: string) => new UiDaterangePickerUtils(page, testId),
      toggle: (testId: string) => new UiToggleUtils(page, testId),
      accordion: (testId: string) => new UiAccordionUtils(page, testId),
    },
  };

  return extendedPage;
}

export const test = base.extend<{ page: ComponentPage }>({
  page: async ({ page }, use) => {
    const extendedPage = extendPage(page);
    await use(extendedPage);
  },
});

export { expect } from '@playwright/test';
