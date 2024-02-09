import { StateFormEmptyValueType } from './index';
import { NullableUndefineable } from './outerDependencies';
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
  StateFormDataTypeNumberType,
  stateFormDataTypeNumberValidators
} from './dataTypes/number';

/**
 * include and customize data types here
 */

// TODO temporary until all data types are ready
/** validators from each data type */
export const stateFormInnerValidators: any = {
  ...stateFormDataTypeTextValidators,
  ...stateFormDataTypeEmailValidators,
  ...stateFormDataTypeRichTextValidators,
  ...stateFormDataTypeDateValidators,
  ...stateFormDataTypeNumberValidators,
};

/** possible values */
export type StateFormPossibleValue =
  | StateFormDataTypeTextType
  | StateFormDataTypeEmailType
  | StateFormDataTypeRichTextType
  | StateFormDataTypeDateType
  | StateFormDataTypeNumberType
  | boolean
  | StateFormEmptyValueType
  | [string, string];

/** possible properties to each data type */
export type StateFormDataTypesSpecificPropertiesType = NullableUndefineable<StateFormDataTypeDateSpecificProperties> &
  NullableUndefineable<StateFormDataTypeTextSpecificProperties> &
  NullableUndefineable<StateFormDataTypeEmailSpecificProperties>;

/** possible types of values */
export type StateFormDataTypesFieldsType =
  | StateFormDataTypeFieldTextType
  | StateFormDataTypeFieldEmailType
  | StateFormDataTypeFieldRichTextType
  | StateFormDataTypeFieldDateType
  | StateFormDataTypeFieldNumberType;
