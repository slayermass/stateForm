import { StateFormGetSubscribeProps, StateFormUnknownFormType } from '../index';
import { StateFormPath, StateFormPathValue, StateFormPathValues } from '../types/path';
import { useFormCommonWatch } from './index';

import { SafeAnyType } from '../outerDependencies';

export function useStateFormValueWatch<ReturnValue = SafeAnyType>(
  getSubscribeProps: StateFormGetSubscribeProps,
  names: string | string[],
): ReturnValue;
export function useStateFormValueWatch<
  FormValues = Record<string, SafeAnyType>,
  Name extends StateFormPath<FormValues> = StateFormPath<FormValues>,
>(
  getSubscribeProps: StateFormGetSubscribeProps,
  names: StateFormPath<FormValues>,
): StateFormPathValue<FormValues, Name>;
export function useStateFormValueWatch<
  FormValues extends StateFormUnknownFormType = Record<string, SafeAnyType>,
  Names extends StateFormPath<FormValues>[] = StateFormPath<FormValues>[],
>(
  getSubscribeProps: StateFormGetSubscribeProps,
  names: StateFormPath<FormValues>[],
): StateFormPathValues<FormValues, Names>;
export function useStateFormValueWatch<ReturnValue = SafeAnyType>(
  getSubscribeProps: StateFormGetSubscribeProps,
): ReturnValue;

/** the hook for subscribing to the input value change */
export function useStateFormValueWatch<ReturnValue = SafeAnyType>(
  getSubscribeProps: StateFormGetSubscribeProps,
  names?: string | string[],
): ReturnValue {
  return useFormCommonWatch<ReturnValue>(getSubscribeProps, 'change', names);
}
