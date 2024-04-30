import {
  StateFormDataTypeCheckBoxGroupSpecificProperties,
  StateFormDataTypeCheckBoxGroupType,
  stateFormDataTypeCheckBoxGroupValidators,
  StateFormDataTypeFieldCheckBoxGroupType,
} from 'src/utils/stateForm/dataTypes/checkBoxGroup';
import { StateFormEmptyValueType } from './index';
import { NullableUndefineable, SafeAnyType } from './outerDependencies';
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
import {
  StateFormDataTypeFieldNumberType,
  StateFormDataTypeNumberSpecificProperties,
  StateFormDataTypeNumberType,
  stateFormDataTypeNumberValidators,
} from './dataTypes/number';

/**
 * include and customize data types here
 */

// TODO temporary until all data types are ready
/** validators from each data type */
export const stateFormInnerValidators: SafeAnyType = {
  ...stateFormDataTypeTextValidators,
  ...stateFormDataTypeEmailValidators,
  ...stateFormDataTypeRichTextValidators,
  ...stateFormDataTypeDateValidators,
  ...stateFormDataTypeNumberValidators,
  ...stateFormDataTypeCheckBoxGroupValidators,
};

/** possible values */
export type StateFormPossibleValue =
  | StateFormDataTypeTextType
  | StateFormDataTypeEmailType
  | StateFormDataTypeRichTextType
  | StateFormDataTypeDateType
  | StateFormDataTypeNumberType
  | StateFormDataTypeCheckBoxGroupType
  | StateFormEmptyValueType;

/** possible properties to each data type */
export type StateFormDataTypesSpecificPropertiesType = NullableUndefineable<StateFormDataTypeDateSpecificProperties> &
  NullableUndefineable<StateFormDataTypeTextSpecificProperties> &
  NullableUndefineable<StateFormDataTypeEmailSpecificProperties> &
  NullableUndefineable<StateFormDataTypeNumberSpecificProperties> &
  NullableUndefineable<StateFormDataTypeCheckBoxGroupSpecificProperties>;

/** possible types of values */
export type StateFormDataTypesFieldsType =
  | StateFormDataTypeFieldTextType
  | StateFormDataTypeFieldEmailType
  | StateFormDataTypeFieldRichTextType
  | StateFormDataTypeFieldDateType
  | StateFormDataTypeFieldNumberType
  | StateFormDataTypeFieldCheckBoxGroupType;
