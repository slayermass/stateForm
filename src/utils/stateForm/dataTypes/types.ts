import { SafeAnyType } from '../outerDependencies';
import { StateFormInputOptionsType } from '..';

export type StateFormValidatorIsSetType = (value: SafeAnyType) => boolean;

export type StateFormValidatorPropertyType<P> = (value: SafeAnyType, property: P) => boolean;

export type StateFormValidatorIsValidPatternType = (value: SafeAnyType) => boolean | string;

export type StateFormValidatorValidateType = (
  value: SafeAnyType,
  validationOptions: StateFormInputOptionsType,
) => string | boolean;
