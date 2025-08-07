import { StateFormValidatorType } from 'src/utils/stateForm/dataTypes/types';
import { isStateFormValueEmpty } from 'src/utils/stateForm/types';
import { isArray, isDate } from '../../outerDependencies';

export const stateFormErrorsDateRangeMinMessage = 'common.validation.minDate';

export const stateFormErrorsDateRangeMaxMessage = 'common.validation.maxDate';

const validators: StateFormValidatorType<
  StateFormDateRangeType['value'],
  StateFormDateRangeType['specificProperties']
> = {
  isSet: (value) => isArray(value) && isDate(value[0]) && isDate(value[1]),
  validate: (value, validationOptions) => {
    if (validationOptions.disabled === true) {
      return true;
    }

    if (validationOptions.required && !validators.isSet(value)) {
      return false;
    }

    if (!validationOptions.required) {
      if (isStateFormValueEmpty(value)) {
        return true;
      }
      if (!validators.isSet(value)) {
        return false;
      }
    }

    if (validationOptions.minDate) {
      if (validators.isSet(value)) {
        value = value as StateFormDateRangeType['value'];

        return value[0] >= validationOptions.minDate && value[1] >= validationOptions.minDate
          ? true
          : [
              validationOptions.minDateMessage || stateFormErrorsDateRangeMinMessage,
              { minDate: validationOptions.minDate },
            ];
      }

      return false;
    }

    if (validationOptions.maxDate) {
      if (validators.isSet(value)) {
        value = value as StateFormDateRangeType['value'];

        return value[0] <= validationOptions.maxDate && value[1] <= validationOptions.maxDate
          ? true
          : [
              validationOptions.maxDateMessage || stateFormErrorsDateRangeMaxMessage,
              { maxDate: validationOptions.maxDate },
            ];
      }

      return false;
    }

    return true;
  },
};

export const stateFormDataTypeDateRangeValidators: {
  dateRange: typeof validators;
} = {
  dateRange: validators,
};

export type StateFormDateRangeType = {
  value: [Date, Date];
  fields: keyof typeof stateFormDataTypeDateRangeValidators;
  specificProperties: {
    minDate: Date;
    maxDate: Date;
    minDateMessage: string;
    maxDateMessage: string;
  };
};
