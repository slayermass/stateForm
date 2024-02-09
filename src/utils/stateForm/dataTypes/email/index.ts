import { isNumber, isString, isValidEmail } from '../../outerDependencies';
import {
  StateFormValidatorIsSetType,
  StateFormValidatorIsValidPatternType,
  StateFormValidatorValidateType,
} from '../types';

export type StateFormDataTypeEmailType = string;
export type StateFormDataTypeFieldEmailType = keyof typeof stateFormDataTypeEmailValidators;
export type StateFormDataTypeEmailSpecificProperties = {
  minLength: number;
  maxLength: number;
  minLengthMessage: string;
  maxLengthMessage: string;
};

export const stateFormErrorsPatternEmailMessage = 'common.validation.emailInvalid';

const validators: {
  isSet: StateFormValidatorIsSetType;
  validate: StateFormValidatorValidateType;
  isValidPattern: StateFormValidatorIsValidPatternType;
} = {
  isSet: (value) => isString(value) && value.trim().length > 0,
  isValidPattern: (value) => (isValidEmail(value.trim()) ? true : stateFormErrorsPatternEmailMessage),
  validate: (value, validationOptions) => {
    if (!isString(value)) {
      return false;
    }

    if (isNumber(validationOptions.minLength)) {
      return value.trim().length >= validationOptions.minLength ? true : validationOptions.minLengthMessage || false;
    }

    if (isNumber(validationOptions.maxLength)) {
      return value.trim().length <= validationOptions.maxLength ? true : validationOptions.maxLengthMessage || false;
    }

    return true;
  },
};

export const stateFormDataTypeEmailValidators: {
  email: typeof validators;
} = {
  email: validators,
};
