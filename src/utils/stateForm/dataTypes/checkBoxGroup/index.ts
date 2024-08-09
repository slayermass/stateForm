import { stateFormIsValueInnerEmpty } from '../../types';
import { isBoolean } from '../../outerDependencies';
import { StateFormValidatorType } from '../types';

const validators: StateFormValidatorType<
  StateFormCheckBoxGroupType['value'],
  StateFormCheckBoxGroupType['specificProperties']
> = {
  isSet: (value) => isBoolean(value),
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

    return validators.isSet(value);
  },
};

export const stateFormDataTypeCheckBoxGroupValidators: {
  checkBoxGroup: typeof validators;
} = {
  checkBoxGroup: validators,
};

export type StateFormCheckBoxGroupType = {
  value: boolean;
  fields: keyof typeof stateFormDataTypeCheckBoxGroupValidators;
  specificProperties: null;
};
