import { StateFormEmptyValueType } from 'src/utils/stateForm/index';
import { NullableUndefineable } from 'src/utils/types';
import {
  StateFormDataTypeDateSpecificProperties,
  StateFormDataTypeDateType,
  stateFormDataTypeDateValidators,
  StateFormDataTypeFieldDateType,
} from './dataTypes/date';
import {
  StateFormDataTypeFieldRichTextType,
  StateFormDataTypeRichTextType,
  stateFormDataTypeRichTextValidators,
} from './dataTypes/richText';
import {
  StateFormDataTypeEmailSpecificProperties,
  StateFormDataTypeEmailType,
  stateFormDataTypeEmailValidators,
  StateFormDataTypeFieldEmailType,
} from './dataTypes/email';
import {
  StateFormDataTypeFieldTextType,
  StateFormDataTypeTextSpecificProperties,
  StateFormDataTypeTextType,
  stateFormDataTypeTextValidators,
} from './dataTypes/text';

/**
 * include and customize data types here
 */

// TODO temporary until all data types are ready
export const stateFormInnerValidators: any = {
  ...stateFormDataTypeTextValidators,
  ...stateFormDataTypeEmailValidators,
  ...stateFormDataTypeRichTextValidators,
  ...stateFormDataTypeDateValidators,
};

export type StateFormPossibleValue =
  | StateFormDataTypeTextType
  | StateFormDataTypeEmailType
  | StateFormDataTypeRichTextType
  | StateFormDataTypeDateType
  | number
  | boolean
  | StateFormEmptyValueType
  | [string, string];

export type StateFormDataTypesSpecificPropertiesType = NullableUndefineable<StateFormDataTypeDateSpecificProperties> &
  NullableUndefineable<StateFormDataTypeTextSpecificProperties> &
  NullableUndefineable<StateFormDataTypeEmailSpecificProperties>;

export type StateFormDataTypesFieldsType =
  | StateFormDataTypeFieldTextType
  | StateFormDataTypeFieldEmailType
  | StateFormDataTypeFieldRichTextType
  | StateFormDataTypeFieldDateType;
