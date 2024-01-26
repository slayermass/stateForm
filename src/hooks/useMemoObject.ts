import { useEffect, useRef } from 'react';
import equal from 'fast-deep-equal';

import { SafeAnyType } from 'src/utils/safeAny';

/* Returns the previous reference to the object, if it has not changed */
export const useMemoObject = <T = SafeAnyType>(current: T): T => {
  const previousRef = useRef<T>();
  const previous = previousRef.current;

  const isEqual = equal(previous, current);

  useEffect(() => {
    if (!isEqual) {
      previousRef.current = current;
    }
  });

  return isEqual && previous ? previous : current;
};
