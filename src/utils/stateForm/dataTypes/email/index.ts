import { isValidEmail } from '../../outerDependencies';
import {
  StateFormValidatorMaxLengthType,
  StateFormValidatorMinLengthType,
  StateFormValidatorRequiredType,
} from '../types';
import { stateFormDataTypeCommonValidators } from '../common';

export type StateFormDataTypeEmailType = string;
export type StateFormDataTypeFieldEmailType = keyof typeof stateFormDataTypeEmailValidators;

export const stateFormErrorsPatternEmailMessage = 'common.validation.emailInvalid';

const validators: {
  required: StateFormValidatorRequiredType;
  minLength: StateFormValidatorMinLengthType;
  maxLength: StateFormValidatorMaxLengthType;
  pattern: (value: string) => void;
} = {
  required: stateFormDataTypeCommonValidators.required,
  minLength: stateFormDataTypeCommonValidators.minLength,
  maxLength: stateFormDataTypeCommonValidators.maxLength,
  pattern: (value) => {
    const trimmedValue = value.trim();

    return validators.required(value) && !isValidEmail(trimmedValue) && stateFormErrorsPatternEmailMessage;
  },
};

export const stateFormDataTypeEmailValidators: {
  email: typeof validators;
} = {
  email: validators,
};
