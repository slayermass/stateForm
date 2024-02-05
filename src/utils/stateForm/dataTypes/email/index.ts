import { isString, isValidEmail } from '../../outerDependencies';
import {
  StateFormValidatorIsValidPatternType,
  StateFormValidatorPropertyType,
  StateFormValidatorIsSetType,
} from '../types';

export type StateFormDataTypeEmailType = string;
export type StateFormDataTypeFieldEmailType = keyof typeof stateFormDataTypeEmailValidators;

export const stateFormErrorsPatternEmailMessage = 'common.validation.emailInvalid';

const validators: {
  isSet: StateFormValidatorIsSetType;
  minLength: StateFormValidatorPropertyType<number>;
  maxLength: StateFormValidatorPropertyType<number>;
  isValidPattern: StateFormValidatorIsValidPatternType;
} = {
  isSet: (value) => isString(value) && value.trim().length > 0,
  minLength: (value, minLength) => isString(value) && value.trim().length >= minLength,
  maxLength: (value, maxLength) => isString(value) && value.trim().length <= maxLength,
  isValidPattern: (value) => (isValidEmail(value.trim()) ? true : stateFormErrorsPatternEmailMessage),
};

export const stateFormDataTypeEmailValidators: {
  email: typeof validators;
} = {
  email: validators,
};
