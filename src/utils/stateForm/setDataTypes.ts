import { stateFormDataTypeDateRangeValidators, StateFormDateRangeType } from 'src/utils/stateForm/dataTypes/dateRange';
import { StateFormEmptyValueType, StateFormFieldsType, StateFormSpread } from './types';
import { StateFormCheckBoxGroupType, stateFormDataTypeCheckBoxGroupValidators } from './dataTypes/checkBoxGroup';
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
  | StateFormCheckBoxGroupType
  | StateFormDateRangeType;

export type StateFormPossibleValue = Pick<AllTypes, 'value'>['value'] | StateFormEmptyValueType;

export type StateFormDataTypesSpecificPropertiesType = StateFormSpread<
  NonNullable<Pick<AllTypes, 'specificProperties'>['specificProperties']>
>;

export type StateFormDataTypesFieldsType = Pick<AllTypes, 'fields'>['fields'];
// export type StateFormOmitArrayTypes = Extract<StateFormPossibleValue, SafeAnyType[]>;

export const stateFormValuesOfArrayType: StateFormFieldsType[] = ['dateRange'];

// todo improve
/** validators from each data type */
export const stateFormInnerValidators = {
  ...stateFormDataTypeTextValidators,
  ...stateFormDataTypeEmailValidators,
  ...stateFormDataTypeRichTextValidators,
  ...stateFormDataTypeDateValidators,
  ...stateFormDataTypeNumberValidators,
  ...stateFormDataTypeCheckBoxGroupValidators,
  ...stateFormDataTypeDateRangeValidators,
};
