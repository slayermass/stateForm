import { isStateFormValueEmpty } from 'src/utils/stateForm/types';
import { StateFormValidatorType } from '../types';
import { isNumber, isString } from '../../outerDependencies';

export const stateFormErrorsTextMinLengthMessage = 'common.validation.minLength';

export const stateFormErrorsTextMaxLengthMessage = 'common.validation.maxLength';

const validators: StateFormValidatorType<StateFormTextType['value'], StateFormTextType['specificProperties']> = {
  isSet: (value) => isString(value) && value.trim().length > 0,
  validate: (value, validationOptions) => {
    if (validationOptions.disabled === true) {
      return true;
    }

    if (validationOptions.required && !validators.isSet(value)) {
      return false;
    }

    if (!validationOptions.required) {
      if (isStateFormValueEmpty(value)) {
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
            validationOptions.minLengthMessage || stateFormErrorsTextMinLengthMessage,
            { minLength: validationOptions.minLength },
          ];
    }

    if (isNumber(validationOptions.maxLength)) {
      return value && value.trim().length <= validationOptions.maxLength
        ? true
        : [
            validationOptions.maxLengthMessage || stateFormErrorsTextMaxLengthMessage,
            { maxLength: validationOptions.maxLength },
          ];
    }

    return true;
  },
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

export type StateFormTextType = {
  value: string;
  fields: keyof typeof stateFormDataTypeTextValidators;
  specificProperties: {
    minLength: number;
    maxLength: number;
    minLengthMessage: string;
    maxLengthMessage: string;
  };
};
