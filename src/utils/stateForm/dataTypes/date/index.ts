import { isDate } from '../../outerDependencies';
import { StateFormValidatorIsSetType, StateFormValidatorValidateType } from '../types';

export type StateFormDataTypeDateType = Date;
export type StateFormDataTypeFieldDateType = keyof typeof stateFormDataTypeDateValidators;
export type StateFormDataTypeDateSpecificProperties = {
  minDate: Date;
  maxDate: Date;
  minDateMessage: string;
  maxDateMessage: string;
};

const validators: {
  isSet: StateFormValidatorIsSetType;
  validate: StateFormValidatorValidateType;
} = {
  isSet: (value) => isDate(value),
  validate: (value, validationOptions) => {
    if (!isDate(value)) {
      return false;
    }

    if (validationOptions.minDate) {
      return value > validationOptions.minDate ? true : validationOptions.minDateMessage || false;
    }

    if (validationOptions.maxDate) {
      return value < validationOptions.maxDate ? true : validationOptions.maxDateMessage || false;
    }

    return true;
  },
};

export const stateFormDataTypeDateValidators: {
  date: typeof validators;
} = {
  date: validators,
};
