import { StateFormValidatorIsSetType, StateFormValidatorIsValidPatternType } from '../types';
import { isBigInt, isNumber } from '../../outerDependencies';

export type StateFormDataTypeNumberType = number | bigint;
export type StateFormDataTypeFieldNumberType = keyof typeof stateFormDataTypeNumberValidators;

const validators: {
  isSet: StateFormValidatorIsSetType;
  isValidPattern: StateFormValidatorIsValidPatternType;
} = {
  isSet: (value) => isNumber(value) || isBigInt(value),
  isValidPattern: (value) => isBigInt(value) ? true : Number.isFinite(value),
};

export const stateFormDataTypeNumberValidators: {
  number: typeof validators;
} = {
  number: validators,
};
