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
import { StateFormTextType, stateFormDataTypeTextValidators } from './dataTypes/text';
import { StateFormNumberType, stateFormDataTypeNumberValidators } from './dataTypes/number';

/**
 * include and customize data types here
 */

// export interface StateFormBaseType {
//   value: SafeAnyType;
//   fields: SafeAnyType;
//   specificProperties: Record<string, number | string>;
// }

export type StateFormBaseType = {
  value: SafeAnyType;
  fields: SafeAnyType;
  specificProperties: Record<string, number | string>;
};

type AllTypes = StateFormNumberType | StateFormTextType;

export type StateFormPossibleValueNEW = Pick<AllTypes, 'value'>['value'];
export type StateFormDataTypesSpecificPropertiesTypeNEW = Pick<AllTypes, 'specificProperties'>['specificProperties'];
export type StateFormDataTypesFieldsTypeNEW = Pick<AllTypes, 'fields'>['fields'];

const val: StateFormPossibleValueNEW = BigInt(1);

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
  | StateFormTextType['value']
  | StateFormDataTypeEmailType
  | StateFormDataTypeRichTextType
  | StateFormDataTypeDateType
  | StateFormNumberType['value']
  | StateFormDataTypeCheckBoxGroupType
  | StateFormEmptyValueType;

/** possible properties to each data type */
export type StateFormDataTypesSpecificPropertiesType = NullableUndefineable<StateFormDataTypeDateSpecificProperties> &
  NullableUndefineable<StateFormTextType['specificProperties']> &
  NullableUndefineable<StateFormDataTypeEmailSpecificProperties> &
  NullableUndefineable<StateFormNumberType['specificProperties']> &
  NullableUndefineable<StateFormDataTypeCheckBoxGroupSpecificProperties>;

/** possible types of values */
export type StateFormDataTypesFieldsType =
  | StateFormTextType['fields']
  | StateFormDataTypeFieldEmailType
  | StateFormDataTypeFieldRichTextType
  | StateFormDataTypeFieldDateType
  | StateFormNumberType['fields']
  | StateFormDataTypeFieldCheckBoxGroupType;
