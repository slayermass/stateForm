import { SafeAnyType, isValidEmail } from '../../outerDependencies';

export type StateFormDataTypeEmailType = string;
export type StateFormDataTypeFieldEmailType = keyof typeof stateFormDataTypeEmailValidators;

const validators: {
  required: (value: SafeAnyType) => boolean;
  minLength: (value: SafeAnyType, minLength: number) => boolean;
  maxLength: (value: SafeAnyType, maxLength: number) => boolean;
} = {
  required: (value) => {
    const trimmedValue = value.trim();

    return isValidEmail(trimmedValue) && trimmedValue.length > 0;
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
