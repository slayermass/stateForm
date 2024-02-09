import { StateFormValidatorIsSetType, StateFormValidatorValidateType } from '../types';
import { isBigInt, isNumber } from '../../outerDependencies';

export type StateFormDataTypeNumberType = number | bigint;
export type StateFormDataTypeFieldNumberType = keyof typeof stateFormDataTypeNumberValidators;

const validators: {
  isSet: StateFormValidatorIsSetType;
  validate: StateFormValidatorValidateType;
} = {
  isSet: (value) => isNumber(value) || isBigInt(value),
  validate: (value) => (isBigInt(value) ? true : Number.isFinite(value)),
};

export const stateFormDataTypeNumberValidators: {
  number: typeof validators;
} = {
  number: validators,
};
