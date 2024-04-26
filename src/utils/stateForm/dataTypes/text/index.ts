import { StateFormValidatorIsSetType, StateFormValidatorValidateType } from '../types';
import { isNumber, isString } from '../../outerDependencies';

export type StateFormDataTypeTextType = string;
export type StateFormDataTypeFieldTextType = keyof typeof stateFormDataTypeTextValidators;
export type StateFormDataTypeTextSpecificProperties = {
  minLength: number;
  maxLength: number;
  minLengthMessage: string;
  maxLengthMessage: string;
};

export const stateFormErrorsTextMinLengthMessage = 'common.validation.minLength';
export const stateFormErrorsTextMaxLengthMessage = 'common.validation.maxLength';

const validators: {
  isSet: StateFormValidatorIsSetType;
  validate: StateFormValidatorValidateType;
} = {
  isSet: (value) => isString(value) && value.trim().length > 0,
  validate: (value, validationOptions) => {
    if (validationOptions.disabled === true) {
      return true;
    }

    if (!isString(value) && validationOptions.required) {
      return false;
    }

    if (isNumber(validationOptions.minLength)) {
      return value.trim().length >= validationOptions.minLength
        ? true
        : [
            validationOptions.minLengthMessage || stateFormErrorsTextMinLengthMessage,
            { minLength: validationOptions.minLength },
          ];
    }

    if (isNumber(validationOptions.maxLength)) {
      return value.trim().length <= validationOptions.maxLength
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
