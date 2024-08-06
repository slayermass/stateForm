import { isDate } from '../../outerDependencies';
import { StateFormValidatorType } from '../types';

export const stateFormErrorsDateMinMessage = 'common.validation.minDate';
export const stateFormErrorsDateMaxMessage = 'common.validation.maxDate';

const validators: StateFormValidatorType<StateFormDateType['value'], StateFormDateType['specificProperties']> = {
  isSet: (value) => isDate(value),
  validate: (value, validationOptions) => {
    if (validationOptions.disabled === true) {
      return true;
    }

    if (!isDate(value) && validationOptions.required) {
      return false;
    }

    if (validationOptions.minDate) {
      return isDate(value) && value > validationOptions.minDate
        ? true
        : [validationOptions.minDateMessage || stateFormErrorsDateMinMessage, { minDate: validationOptions.minDate }];
    }

    if (validationOptions.maxDate) {
      return isDate(value) && value < validationOptions.maxDate
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

export type StateFormDateType = {
  value: Date;
  fields: keyof typeof stateFormDataTypeDateValidators;
  specificProperties: {
    minDate: Date;
    maxDate: Date;
    minDateMessage: string;
    maxDateMessage: string;
  };
};
