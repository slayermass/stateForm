import { SafeAnyType } from '../outerDependencies';

export type StateFormValidatorIsSetType = (value: SafeAnyType) => boolean;

export type StateFormValidatorMinLengthType = (value: SafeAnyType, minLength: number) => boolean;

export type StateFormValidatorMaxLengthType = (value: SafeAnyType, maxLength: number) => boolean;

export type StateFormValidatorIsValidPatternType = (value: SafeAnyType) => boolean | string;
