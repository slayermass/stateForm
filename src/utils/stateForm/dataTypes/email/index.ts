import { isString, isValidEmail } from '../../outerDependencies';
import {
  StateFormValidatorCustomMessageType,
  StateFormValidatorMaxLengthType,
  StateFormValidatorMinLengthType,
  StateFormValidatorRequiredType
} from '../types';

export type StateFormDataTypeEmailType = string;
export type StateFormDataTypeFieldEmailType = keyof typeof stateFormDataTypeEmailValidators;

export const stateFormErrorsPatternEmailMessage = 'common.validation.emailInvalid';

const validators: {
  required: StateFormValidatorRequiredType;
  minLength: StateFormValidatorMinLengthType;
  maxLength: StateFormValidatorMaxLengthType;
  customMessage: StateFormValidatorCustomMessageType;
} = {
  required: (value) => isString(value) && value.trim().length > 0,
  minLength: (value, minLength) => isString(value) && value.trim().length >= minLength,
  maxLength: (value, maxLength) => isString(value) && value.trim().length <= maxLength,
  customMessage: (value) => {
    const trimmedValue = value.trim();

    return validators.required(value) && !isValidEmail(trimmedValue) && stateFormErrorsPatternEmailMessage;
  },
};

export const stateFormDataTypeEmailValidators: {
  email: typeof validators;
} = {
  email: validators,
};
