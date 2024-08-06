import { isNumber, isString, isValidEmail } from '../../outerDependencies';
import { StateFormValidatorType } from '../types';

export const stateFormErrorsPatternEmailMessage = 'common.validation.emailInvalid';
export const stateFormErrorsEmailMinLengthMessage = 'common.validation.emailMinLength';
export const stateFormErrorsEmailMaxLengthMessage = 'common.validation.emailMaxLength';

const validators: StateFormValidatorType<StateFormEmailType['value'], StateFormEmailType['specificProperties']> = {
  isSet: (value) => isString(value) && value.trim().length > 0,
  validate: (value, validationOptions, hasValidValue) => {
    if (hasValidValue && !isValidEmail((value || '').trim())) {
      return [stateFormErrorsPatternEmailMessage];
    }

    if (!isString(value) && validationOptions.required) {
      return false;
    }

    if (isNumber(validationOptions.minLength)) {
      return value && value.trim().length >= validationOptions.minLength
        ? true
        : [
            validationOptions.minLengthMessage || stateFormErrorsEmailMinLengthMessage,
            { minLength: validationOptions.minLength },
          ];
    }

    if (isNumber(validationOptions.maxLength)) {
      return value && value.trim().length <= validationOptions.maxLength
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

export type StateFormEmailType = {
  value: string;
  fields: keyof typeof stateFormDataTypeEmailValidators;
  specificProperties: {
    minLength: number;
    maxLength: number;
    minLengthMessage: string;
    maxLengthMessage: string;
  };
};
