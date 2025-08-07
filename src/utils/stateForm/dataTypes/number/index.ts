import { isStateFormValueEmpty } from '../../types';
import { StateFormValidatorType } from '../types';
import { isBigInt, isNumber, isFinite } from '../../outerDependencies';

export const stateFormErrorsNumberMinMessage = 'common.validation.min';

export const stateFormErrorsNumberMaxMessage = 'common.validation.max';

const validators: StateFormValidatorType<StateFormNumberType['value'], StateFormNumberType['specificProperties']> = {
  isSet: (value) => (isNumber(value) && isFinite(value)) || isBigInt(value),
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

    if (isNumber(validationOptions.min)) {
      if (validators.isSet(value)) {
        value = value as StateFormNumberType['value'];

        return value >= validationOptions.min
          ? true
          : [validationOptions.minMessage || stateFormErrorsNumberMinMessage, { min: validationOptions.min }];
      }

      return false;
    }

    if (isNumber(validationOptions.max)) {
      if (validators.isSet(value)) {
        value = value as StateFormNumberType['value'];

        return value <= validationOptions.max
          ? true
          : [validationOptions.maxMessage || stateFormErrorsNumberMaxMessage, { max: validationOptions.max }];
      }

      return false;
    }

    return true;
  },
};

export const stateFormDataTypeNumberValidators: {
  number: typeof validators;
} = {
  number: validators,
};

export type StateFormNumberType = {
  value: number | bigint;
  fields: keyof typeof stateFormDataTypeNumberValidators;
  specificProperties: {
    min: number;
    max: number;
    minMessage: string;
    maxMessage: string;
  };
};
