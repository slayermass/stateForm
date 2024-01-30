import { SafeAnyType } from '../outerDependencies';

export type StateFormValidatorRequiredType = (value: SafeAnyType) => boolean | string;

export type StateFormValidatorMinLengthType = (value: SafeAnyType, minLength: number) => boolean;

export type StateFormValidatorMaxLengthType = (value: SafeAnyType, maxLength: number) => boolean;
