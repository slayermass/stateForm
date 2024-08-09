import { stateFormIsValueInnerEmpty } from 'src/utils/stateForm/types';
import { isNumber, isString, isValidEmail } from '../../outerDependencies';
import { StateFormValidatorType } from '../types';

export const stateFormErrorsEmailMinLengthMessage = 'common.validation.emailMinLength';

export const stateFormErrorsEmailMaxLengthMessage = 'common.validation.emailMaxLength';

const validators: StateFormValidatorType<StateFormEmailType['value'], StateFormEmailType['specificProperties']> = {
  isSet: (value) => isString(value) && value.trim().length > 0 && isValidEmail(value),
  validate: (value, validationOptions) => {
    if (validationOptions.disabled === true) {
      return true;
    }

    if (validationOptions.required && !validators.isSet(value)) {
      return false;
    }

    if (!validationOptions.required) {
      if (stateFormIsValueInnerEmpty(value)) {
        return true;
      }
      if (!validators.isSet(value)) {
        return false;
      }
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
