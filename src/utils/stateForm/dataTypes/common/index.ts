import {
  StateFormValidatorMaxLengthType,
  StateFormValidatorMinLengthType,
  StateFormValidatorRequiredType
} from '../types';
import { isString } from '../../outerDependencies';

export const stateFormDataTypeCommonValidators: {
  required: StateFormValidatorRequiredType;
  minLength: StateFormValidatorMinLengthType;
  maxLength: StateFormValidatorMaxLengthType;
} = {
  required: (value) => isString(value) && value.trim().length > 0,
  minLength: (value, minLength) => isString(value) && value.trim().length >= minLength,
  maxLength: (value, maxLength) => isString(value) && value.trim().length <= maxLength,
};