import React, { Dispatch, SetStateAction } from 'react';
import { SafeAnyType } from 'src/utils/safeAny';

/** override any props in type */
export type Override<T1, T2> = Omit<T1, keyof T2> & T2;

/** create record from a type where keys are not required */
export type PartialRecord<K extends keyof SafeAnyType, T> = Partial<Record<K, T>>;

/** makes all properties to be nullable */
export type RecursiveNullable<T> = {
  [K in keyof T]: RecursiveNullable<T[K]> | null;
};

type RecursiveNonNullable1<T> = { [K in keyof T]: RecursiveNonNullable<T[K]> };
export type RecursiveNonNullable<T> = RecursiveNonNullable1<NonNullable<T>>;

/** makes all properties to be set or not  */
export type NullableUndefineable<T> = {
  [K in keyof T]?: RecursiveNullable<T[K]> | null;
};

/** any children passing in components */
export type ChildrenPropType = React.ReactNode | React.ReactNode[];

/** checks if argument is not null and guards it */
export const isNotNull = <T>(arg: T): arg is Exclude<T, null> => arg !== null;

type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

/** get return type of promise */
export type PromiseReturnType<T extends (...args: SafeAnyType) => SafeAnyType> = Awaited<ReturnType<T>>;

/** makes all properties partial */
export type RecursivePartial<T> = {
  [P in keyof T]?: RecursivePartial<T[P]>;
};

export type ValueOf<T> = T[keyof T];

/** make all properties to be partial */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/* useState dispatch fn */
export type StateDispatch<T> = Dispatch<SetStateAction<T>>;

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
