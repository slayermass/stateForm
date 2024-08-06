import { NullableUndefineable, SafeAnyType } from '../outerDependencies';
import { StateFormEmptyValueType, StateFormInputOptionsType } from '..';

export type StateFormValidatorType<V, P> = {
  isSet: (value: V | StateFormEmptyValueType) => boolean;
  validate: (
    value: V | StateFormEmptyValueType,
    validationOptions: P extends null ? StateFormInputOptionsType : StateFormInputOptionsType & NullableUndefineable<P>,
    hasValidValue: boolean,
  ) => [string, Record<string, SafeAnyType>] | [string] | boolean;
};

// export type StateFormBaseDataTypeType = {
//   value: SafeAnyType;
//   fields: SafeAnyType;
//   specificProperties: Record<string, number | string> | null;
// };
