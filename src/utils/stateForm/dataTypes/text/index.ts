import {
  StateFormValidatorIsSetType,
  StateFormValidatorMinLengthType,
  StateFormValidatorMaxLengthType,
} from '../types';
import { isString } from '../../outerDependencies';

export type StateFormDataTypeTextType = string;
export type StateFormDataTypeFieldTextType = keyof typeof stateFormDataTypeTextValidators;

const validators: {
  isSet: StateFormValidatorIsSetType;
  minLength: StateFormValidatorMinLengthType;
  maxLength: StateFormValidatorMaxLengthType;
} = {
  isSet: (value) => isString(value) && value.trim().length > 0,
  minLength: (value, minLength) => isString(value) && value.trim().length >= minLength,
  maxLength: (value, maxLength) => isString(value) && value.trim().length <= maxLength,
};

export const stateFormDataTypeTextValidators: {
  text: typeof validators;
  textarea: typeof validators;
  password: typeof validators;
} = {
  text: validators,
  textarea: validators,
  password: validators,
};
