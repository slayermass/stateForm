import { StateFormValidatorIsSetType, StateFormValidatorIsValidPatternType } from '../types';
import { isNumber } from '../../outerDependencies';

export type StateFormDataTypeNumberType = string;
export type StateFormDataTypeFieldNumberType = keyof typeof stateFormDataTypeNumberValidators;

const validators: {
  isSet: StateFormValidatorIsSetType;
  isValidPattern: StateFormValidatorIsValidPatternType;
} = {
  isSet: (value) => isNumber(value),
  isValidPattern: (value) => Number.isFinite(value),
};

export const stateFormDataTypeNumberValidators: {
  number: typeof validators;
} = {
  number: validators,
};
