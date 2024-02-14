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

export const stateFormErrorsDateMinMessage = 'common.validation.minDate';
export const stateFormErrorsDateMaxMessage = 'common.validation.maxDate';

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
      return value > validationOptions.minDate
        ? true
        : [validationOptions.minDateMessage || stateFormErrorsDateMinMessage, { minDate: validationOptions.minDate }];
    }

    if (validationOptions.maxDate) {
      return value < validationOptions.maxDate
        ? true
        : [validationOptions.maxDateMessage || stateFormErrorsDateMaxMessage, { maxDate: validationOptions.maxDate }];
    }

    return true;
  },
};

export const stateFormDataTypeDateValidators: {
  date: typeof validators;
} = {
  date: validators,
};
