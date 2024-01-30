import { isValidEmail } from '../../outerDependencies';
import {
  StateFormValidatorRequiredType,
  StateFormValidatorMinLengthType,
  StateFormValidatorMaxLengthType,
} from '../types';

export type StateFormDataTypeEmailType = string;
export type StateFormDataTypeFieldEmailType = keyof typeof stateFormDataTypeEmailValidators;

export const stateFormErrorsRequiredEmailMessage = 'common.validation.emailInvalid';

const validators: {
  required: StateFormValidatorRequiredType;
  minLength: StateFormValidatorMinLengthType;
  maxLength: StateFormValidatorMaxLengthType;
} = {
  required: (value) => {
    const trimmedValue = value.trim();

    return isValidEmail(trimmedValue) && trimmedValue.length > 0 ? true : stateFormErrorsRequiredEmailMessage;
  },
  minLength: (value, minLength) => {
    const trimmedValue = value.trim();

    return isValidEmail(trimmedValue) && trimmedValue.length >= minLength;
  },
  maxLength: (value, maxLength) => {
    const trimmedValue = value.trim();

    return isValidEmail(trimmedValue) && trimmedValue.length <= maxLength;
  },
};

export const stateFormDataTypeEmailValidators: {
  email: typeof validators;
} = {
  email: validators,
};
