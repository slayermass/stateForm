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

const validators: {
  isSet: StateFormValidatorIsSetType;
  validate: StateFormValidatorValidateType;
} = {
  isSet: (value) => isString(value) && value.trim().length > 0,
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

export const stateFormDataTypeTextValidators: {
  text: typeof validators;
  textarea: typeof validators;
  password: typeof validators;
} = {
  text: validators,
  textarea: validators,
  password: validators,
};
