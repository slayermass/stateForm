import { SafeAnyType } from '../outerDependencies';
import { StateFormInputOptionsType } from '..';

export type StateFormValidatorIsSetType = (value: SafeAnyType) => boolean;

export type StateFormValidatorValidateType = (
  value: SafeAnyType,
  validationOptions: StateFormInputOptionsType,
  hasValidValue: boolean,
) => string | boolean;
