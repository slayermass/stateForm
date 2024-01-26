import { StateFormFieldNamePathType, stateFormSubscriptions } from './common';
import { get, SafeAnyType } from '../outerDependencies';

export const stateFormEmit = (fieldNamePath: StateFormFieldNamePathType, arg: SafeAnyType): void => {
  const subs = get(stateFormSubscriptions, fieldNamePath);

  if (!subs) {
    return;
  }

  Object.keys(subs).forEach((key) => subs[key] && subs[key](arg, fieldNamePath[2]));
};
