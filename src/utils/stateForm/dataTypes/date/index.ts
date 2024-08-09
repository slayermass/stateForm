import { stateFormIsValueInnerEmpty } from 'src/utils/stateForm/types';
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

    if (validationOptions.minDate) {
      if (validators.isSet(value)) {
        value = value as StateFormDateType['value'];

        return value >= validationOptions.minDate
          ? true
          : [validationOptions.minDateMessage || stateFormErrorsDateMinMessage, { minDate: validationOptions.minDate }];
      }

      return false;
    }

    if (validationOptions.maxDate) {
      if (validators.isSet(value)) {
        value = value as StateFormDateType['value'];

        return value <= validationOptions.maxDate
          ? true
          : [validationOptions.maxDateMessage || stateFormErrorsDateMaxMessage, { maxDate: validationOptions.maxDate }];
      }

      return false;
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
