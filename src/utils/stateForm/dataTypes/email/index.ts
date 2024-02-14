import { isNumber, isString, isValidEmail } from '../../outerDependencies';
import { StateFormValidatorIsSetType, StateFormValidatorValidateType } from '../types';

export type StateFormDataTypeEmailType = string;
export type StateFormDataTypeFieldEmailType = keyof typeof stateFormDataTypeEmailValidators;
export type StateFormDataTypeEmailSpecificProperties = {
  minLength: number;
  maxLength: number;
  minLengthMessage: string;
  maxLengthMessage: string;
};

export const stateFormErrorsPatternEmailMessage = 'common.validation.emailInvalid';
export const stateFormErrorsEmailMinLengthMessage = 'common.validation.emailMinLength';
export const stateFormErrorsEmailMaxLengthMessage = 'common.validation.emailMaxLength';

const validators: {
  isSet: StateFormValidatorIsSetType;
  validate: StateFormValidatorValidateType;
} = {
  isSet: (value) => isString(value) && value.trim().length > 0,
  validate: (value, validationOptions, hasValidValue) => {
    if (hasValidValue && !isValidEmail(value.trim())) {
      return [stateFormErrorsPatternEmailMessage];
    }

    if (!isString(value)) {
      return false;
    }

    if (isNumber(validationOptions.minLength)) {
      return value.trim().length >= validationOptions.minLength
        ? true
        : [
            validationOptions.minLengthMessage || stateFormErrorsEmailMinLengthMessage,
            { minLength: validationOptions.minLength },
          ];
    }

    if (isNumber(validationOptions.maxLength)) {
      return value.trim().length <= validationOptions.maxLength
        ? true
        : [
            validationOptions.maxLengthMessage || stateFormErrorsEmailMaxLengthMessage,
            { maxLength: validationOptions.maxLength },
          ];
    }

    return true;
  },
};

export const stateFormDataTypeEmailValidators: {
  email: typeof validators;
} = {
  email: validators,
};
