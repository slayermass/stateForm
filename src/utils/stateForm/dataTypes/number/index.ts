import { StateFormValidatorIsSetType, StateFormValidatorValidateType } from '../types';
import { isBigInt, isNumber } from '../../outerDependencies';

export type StateFormDataTypeNumberType = number | bigint;
export type StateFormDataTypeFieldNumberType = keyof typeof stateFormDataTypeNumberValidators;
export type StateFormDataTypeNumberSpecificProperties = {
  min: number;
  max: number;
  minMessage: string;
  maxMessage: string;
};

export const stateFormErrorsNumberMinMessage = 'common.validation.min';
export const stateFormErrorsNumberMaxMessage = 'common.validation.max';

const validators: {
  isSet: StateFormValidatorIsSetType;
  validate: StateFormValidatorValidateType;
} = {
  isSet: (value) => isNumber(value) || isBigInt(value),
  validate: (value, validationOptions, hasValidValue) => {
    if (hasValidValue && !isBigInt(value) && !Number.isFinite(value)) {
      return false;
    }

    if (isNumber(validationOptions.min)) {
      return value >= validationOptions.min
        ? true
        : [validationOptions.minMessage || stateFormErrorsNumberMinMessage, { min: validationOptions.min }];
    }

    if (isNumber(validationOptions.max)) {
      return value <= validationOptions.max
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
