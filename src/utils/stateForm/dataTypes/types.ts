import { SafeAnyType } from '../outerDependencies';
import { NullableUndefinable, StateFormEmptyValueType, StateFormInputOptionsType } from '../types';

export type StateFormValidatorType<V, P> = {
  isSet: (value: V | StateFormEmptyValueType) => boolean;
  validate: (
    value: V | StateFormEmptyValueType,
    validationOptions: P extends null ? StateFormInputOptionsType : StateFormInputOptionsType & NullableUndefinable<P>,
  ) => [string, Record<string, SafeAnyType>] | [string] | boolean;
};

export type StateFormBaseDataTypeType = {
  value: SafeAnyType;
  fields: SafeAnyType;
  specificProperties: Record<string, number | string> | null;
};
