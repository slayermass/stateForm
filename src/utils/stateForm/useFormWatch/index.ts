import { useCallback, useEffect, useMemo, useState } from 'react';

import { StateFormEventType } from '../eventBus/common';
import { StateFormGetSubscribeProps } from '../index';

import { isEmpty, isArray, equal, SafeAnyType, useMemoObject, diff } from '../outerDependencies';

/** the hook for subscribing to the input change (error or value) */
export const useFormCommonWatch = <ReturnValue = SafeAnyType>(
  getSubscribeProps: StateFormGetSubscribeProps,
  eventType: StateFormEventType,
  fieldNames?: string | string[],
): ReturnValue => {
  const memoizedNames = useMemoObject(fieldNames);

  const [, initialValue] = useMemo(
    () => getSubscribeProps(eventType, memoizedNames),
    [eventType, getSubscribeProps, memoizedNames],
  );
  const [value, setValue] = useState(initialValue);

  const setValues = useCallback(
    (values: SafeAnyType, fieldName: string) => {
      if (isArray(memoizedNames)) {
        const foundIndex = memoizedNames.findIndex((name) => name === fieldName);

        if (~foundIndex) {
          setValue((prevState: SafeAnyType) => {
            const newState = [...prevState];
            newState[foundIndex] = values;

            return equal(prevState, newState) ? prevState : newState;
          });
        }
        return;
      }

      setValue(values);
    },
    [memoizedNames],
  );

  useEffect(() => {
    const [subFns, defaultValue] = getSubscribeProps(eventType, memoizedNames);

    /* for the case when initial value is set before use the hook in a component */
    setValue((prev: SafeAnyType) => {
      /* for the case when subscribed to all form values */
      if (!memoizedNames && isEmpty(diff(prev, defaultValue))) {
        return prev;
      }

      return defaultValue;
    });

    const unsubFns = subFns(setValues);

    return () => {
      unsubFns.forEach((unsub) => unsub());
    };
  }, [eventType, getSubscribeProps, memoizedNames, setValues]);

  return value;
};
