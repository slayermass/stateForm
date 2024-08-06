import { StateFormCheckBoxGroupType, stateFormDataTypeCheckBoxGroupValidators } from './dataTypes/checkBoxGroup';
import { StateFormEmptyValueType } from './index';
import { stateFormDataTypeDateValidators, StateFormDateType } from './dataTypes/date';
import { stateFormDataTypeRichTextValidators, StateFormRichTextType } from './dataTypes/richText';
import { stateFormDataTypeEmailValidators, StateFormEmailType } from './dataTypes/email';
import { StateFormTextType, stateFormDataTypeTextValidators } from './dataTypes/text';
import { StateFormNumberType, stateFormDataTypeNumberValidators } from './dataTypes/number';

/**
 * include and customize data types here
 */

type AllTypes =
  | StateFormNumberType
  | StateFormTextType
  | StateFormEmailType
  | StateFormDateType
  | StateFormRichTextType
  | StateFormCheckBoxGroupType;

export type StateFormPossibleValue = Pick<AllTypes, 'value'>['value'] | StateFormEmptyValueType;
export type StateFormDataTypesSpecificPropertiesType = Pick<AllTypes, 'specificProperties'>['specificProperties'];

export type StateFormDataTypesFieldsType = Pick<AllTypes, 'fields'>['fields'];

/** validators from each data type */
export const stateFormInnerValidators = {
  ...stateFormDataTypeTextValidators,
  ...stateFormDataTypeEmailValidators,
  ...stateFormDataTypeRichTextValidators,
  ...stateFormDataTypeDateValidators,
  ...stateFormDataTypeNumberValidators,
  ...stateFormDataTypeCheckBoxGroupValidators,
};
