import { StateFormValidatorType } from '../types';
import { isString } from '../../outerDependencies';

const validators: StateFormValidatorType<StateFormRichTextType['value'], StateFormRichTextType['specificProperties']> =
  {
    isSet: (value) => isString(value) && value.trim().length > 0,
    validate: (value) => !new DOMParser().parseFromString(value || '', 'application/xml').querySelector('parsererror'),
  };

export const stateFormDataTypeRichTextValidators: {
  richText: typeof validators;
} = {
  richText: validators,
};

export type StateFormRichTextType = {
  value: string;
  fields: keyof typeof stateFormDataTypeRichTextValidators;
  specificProperties: null;
};
