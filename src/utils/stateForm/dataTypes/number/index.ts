import { StateFormValidatorType } from '../types';
import { isBigInt, isNumber } from '../../outerDependencies';

export const stateFormErrorsNumberMinMessage = 'common.validation.min';
export const stateFormErrorsNumberMaxMessage = 'common.validation.max';

const validators: StateFormValidatorType<StateFormNumberType['value'], StateFormNumberType['specificProperties']> = {
  isSet: (value) => isNumber(value) || isBigInt(value),
  validate: (value, validationOptions, hasValidValue) => {
    if (hasValidValue && !isBigInt(value) && !Number.isFinite(value)) {
      return false;
    }

    if (isNumber(validationOptions.min)) {
      return (isNumber(value) || isBigInt(value)) && (value as number) >= validationOptions.min
        ? true
        : [validationOptions.minMessage || stateFormErrorsNumberMinMessage, { min: validationOptions.min }];
    }

    if (isNumber(validationOptions.max)) {
      return (isNumber(value) || isBigInt(value)) && (value as number) <= validationOptions.max
        ? true
        : [validationOptions.maxMessage || stateFormErrorsNumberMaxMessage, { max: validationOptions.max }];
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
