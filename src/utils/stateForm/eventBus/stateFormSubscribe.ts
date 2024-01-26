import { StateFormFieldNamePathType, stateFormSubscriptions } from './common';
import { SafeAnyType, set, unset, get, getUniqueId } from '../outerDependencies';

export const stateFormSubscribe = (
  fieldNamePath: StateFormFieldNamePathType,
  callback: (value: SafeAnyType, name: string) => void,
): (() => void) => {
  const id = getUniqueId();
  const fieldNameIdPath = [...fieldNamePath, id];

  set(stateFormSubscriptions, fieldNameIdPath, callback);

  return () => {
    unset(stateFormSubscriptions, fieldNameIdPath);

    if (Object.keys(get(stateFormSubscriptions, fieldNamePath, {})).length < 1) {
      unset(stateFormSubscriptions, fieldNamePath);
    }
  };
};
