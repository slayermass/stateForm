import { StateFormValidatorIsSetType, StateFormValidatorPropertyType } from '../types';
import { isString, SafeAnyType } from '../../outerDependencies';
import { StateFormInputOptionsType } from '../..';

export type StateFormDataTypeTextType = string;
export type StateFormDataTypeFieldTextType = keyof typeof stateFormDataTypeTextValidators;
export type StateFormDataTypeTextSpecificProperties = {
  minLength: StateFormValidatorPropertyType<number>;
  maxLength: StateFormValidatorPropertyType<number>;
  minLengthMessage: string;
  maxLengthMessage: string;
};

const validators: {
  isSet: StateFormValidatorIsSetType;
  validate: (value: SafeAnyType, validationOptions: StateFormInputOptionsType) => string | boolean;
} = {
  isSet: (value) => isString(value) && value.trim().length > 0,
  validate: (value, validationOptions) => {
    if (!isString(value)) {
      return false;
    }

    if (validationOptions.minLength) {
      return value.trim().length >= validationOptions.minLength ? true : validationOptions.minLengthMessage || false;
    }

    if (validationOptions.maxLength) {
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
