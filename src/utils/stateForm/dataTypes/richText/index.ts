import { stateFormIsValueInnerEmpty } from 'src/utils/stateForm/types';
import { StateFormValidatorType } from '../types';
import { isString } from '../../outerDependencies';

const validators: StateFormValidatorType<StateFormRichTextType['value'], StateFormRichTextType['specificProperties']> =
  {
    isSet: (value) => isString(value) && value.trim().length > 0,
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

      return !new DOMParser().parseFromString(value || '', 'application/xml').querySelector('parsererror');
    },
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
