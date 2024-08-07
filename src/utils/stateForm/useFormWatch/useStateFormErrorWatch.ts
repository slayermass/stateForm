import { useFormCommonWatch } from './index';
import { StateFormGetSubscribeProps } from '../types';

type ErrorListType = { type: string; message: string }[];

export function useStateFormErrorWatch(getSubscribeProps: StateFormGetSubscribeProps, name: string): ErrorListType;

export function useStateFormErrorWatch(getSubscribeProps: StateFormGetSubscribeProps, name: string[]): ErrorListType[];

/** the hook for subscribing to the input errors change */
export function useStateFormErrorWatch(
  getSubscribeProps: StateFormGetSubscribeProps,
  name: string | string[],
): ErrorListType | ErrorListType[] {
  return useFormCommonWatch(getSubscribeProps, 'error', name) || [];
}
