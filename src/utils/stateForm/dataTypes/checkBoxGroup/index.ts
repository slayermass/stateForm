import { isBoolean } from '../../outerDependencies';
import { StateFormValidatorIsSetType, StateFormValidatorValidateType } from '../types';

export type StateFormDataTypeCheckBoxGroupType = boolean;
export type StateFormDataTypeFieldCheckBoxGroupType = keyof typeof stateFormDataTypeCheckBoxGroupValidators;
// {} as empty value not to break other types
// eslint-disable-next-line
export type StateFormDataTypeCheckBoxGroupSpecificProperties = {};

const validators: {
  isSet: StateFormValidatorIsSetType;
  validate: StateFormValidatorValidateType;
} = {
  isSet: (value) => isBoolean(value),
  validate: (value, validationOptions) => {
    if (validationOptions.disabled === true) {
      return true;
    }

    if (!validators.isSet(value)) {
      return false;
    }

    return true;
  },
};

export const stateFormDataTypeCheckBoxGroupValidators: {
  checkBoxGroup: typeof validators;
} = {
  checkBoxGroup: validators,
};
