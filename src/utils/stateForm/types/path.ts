import { SafeAnyType } from '../outerDependencies';

type Primitive = null | undefined | string | number | boolean | symbol | bigint;
type ArrayKey = number;

type PathImpl<K extends string | number, V> = V extends Primitive ? `${K}` : `${K}` | `${K}.${StateFormPath<V>}`;
type IsTuple<T extends ReadonlyArray<SafeAnyType>> = number extends T['length'] ? false : true;
type TupleKeys<T extends ReadonlyArray<SafeAnyType>> = Exclude<keyof T, keyof SafeAnyType[]>;

type ArrayPathImpl<K extends string | number, V> = V extends Primitive
  ? never
  : V extends ReadonlyArray<infer U>
    ? U extends Primitive
      ? never
      : `${K}` | `${K}.${ArrayPath<V>}`
    : `${K}.${ArrayPath<V>}`;

type ArrayPath<T> =
  T extends ReadonlyArray<infer V>
    ? IsTuple<T> extends true
      ? {
          [K in TupleKeys<T>]-?: ArrayPathImpl<K & string, T[K]>;
        }[TupleKeys<T>]
      : ArrayPathImpl<ArrayKey, V>
    : {
        [K in keyof T]-?: ArrayPathImpl<K & string, T[K]>;
      }[keyof T];

export type StateFormPath<T> =
  T extends ReadonlyArray<infer V>
    ? IsTuple<T> extends true
      ? {
          [K in TupleKeys<T>]-?: PathImpl<K & string, T[K]>;
        }[TupleKeys<T>]
      : PathImpl<ArrayKey, V>
    : {
        [K in keyof T]-?: PathImpl<K & string, T[K]>;
      }[keyof T];

export type StateFormPathValue<T, P extends StateFormPath<T> | ArrayPath<T>> = T extends SafeAnyType
  ? P extends `${infer K}.${infer R}`
    ? K extends keyof T
      ? R extends StateFormPath<T[K]>
        ? StateFormPathValue<T[K], R>
        : never
      : K extends `${ArrayKey}`
        ? T extends ReadonlyArray<infer V>
          ? StateFormPathValue<V, R & StateFormPath<V>>
          : never
        : never
    : P extends keyof T
      ? T[P]
      : P extends `${ArrayKey}`
        ? T extends ReadonlyArray<infer V>
          ? V
          : never
        : never
  : never;

export type StateFormPathValues<
  TFieldValues extends Record<SafeAnyType, SafeAnyType>,
  TPath extends StateFormPath<TFieldValues>[],
  // eslint-disable-next-line @typescript-eslint/ban-types
> = {} & {
  [K in keyof TPath]: StateFormPathValue<TFieldValues, TPath[K] & StateFormPath<TFieldValues>>;
};
