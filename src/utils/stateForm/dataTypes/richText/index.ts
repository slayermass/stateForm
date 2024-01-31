import { StateFormValidatorIsSetType, StateFormValidatorIsValidPatternType } from '../types';
import { isString } from '../../outerDependencies';

export type StateFormDataTypeRichTextType = string;
export type StateFormDataTypeFieldRichTextType = keyof typeof stateFormDataTypeRichTextValidators;

const validators: {
  isSet: StateFormValidatorIsSetType;
  isValidPattern: StateFormValidatorIsValidPatternType;
} = {
  isSet: (value) => isString(value) && value.trim().length > 0,
  isValidPattern: (value) => !new DOMParser().parseFromString(value, 'application/xml').querySelector('parsererror'),
};

export const stateFormDataTypeRichTextValidators: {
  richText: typeof validators;
} = {
  richText: validators,
};
