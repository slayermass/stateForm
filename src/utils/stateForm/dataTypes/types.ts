import { SafeAnyType } from '../outerDependencies';

export type StateFormValidatorIsSetType = (value: SafeAnyType) => boolean;

export type StateFormValidatorPropertyType<P> = (value: SafeAnyType, property: P) => boolean;

export type StateFormValidatorIsValidPatternType = (value: SafeAnyType) => boolean | string;
