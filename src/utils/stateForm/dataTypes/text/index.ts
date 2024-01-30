import {
  StateFormValidatorRequiredType,
  StateFormValidatorMinLengthType,
  StateFormValidatorMaxLengthType,
} from '../types';
import { stateFormDataTypeCommonValidators } from '../common';

export type StateFormDataTypeTextType = string;
export type StateFormDataTypeFieldTextType = keyof typeof stateFormDataTypeTextValidators;

const validators: {
  required: StateFormValidatorRequiredType;
  minLength: StateFormValidatorMinLengthType;
  maxLength: StateFormValidatorMaxLengthType;
} = {
  required: stateFormDataTypeCommonValidators.required,
  minLength: stateFormDataTypeCommonValidators.minLength,
  maxLength: stateFormDataTypeCommonValidators.maxLength,
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
