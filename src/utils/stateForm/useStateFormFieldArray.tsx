import { useCallback, useRef, useState } from 'react';

import { StateFormReturnType } from './index';

import { createArrayXLength, isPlainObject, isArray, SafeAnyType, getUniqueId } from './outerDependencies';

type DefaultFieldType = Record<string, SafeAnyType>;

type RemoveType = (value: number | number[]) => void;
type AppendType<FieldType = DefaultFieldType> = (value: FieldType) => string;

type ReturnType<FieldsType extends DefaultFieldType[], FieldType = DefaultFieldType> = {
  fields: FieldsType;
  append: AppendType<FieldType>;
  remove: RemoveType;
  refresh: () => void;
};

type Props = {
  formProps: StateFormReturnType;
  name: string;

  rerenderAllFieldsAfterRemove?: boolean;
};

export const useStateFormFieldArray = <FieldsType extends SafeAnyType[]>({
  formProps: { getValue, changeStateDirectly },
  name,
  rerenderAllFieldsAfterRemove = true,
}: Props): ReturnType<
  Array<FieldsType[0] extends DefaultFieldType ? FieldsType[0] & { id: string } : { id: string }>,
  FieldsType[0]
> => {
  const [, changeState] = useState(0);
  const rerender = useCallback(() => changeState(Math.random()), []);

  const getFieldsValue: () => FieldsType = useCallback(() => getValue(name) || [], [getValue, name]);

  const keys = useRef<string[]>(createArrayXLength(getFieldsValue().length).map(getUniqueId));

  const getFieldsPrepared = useCallback(
    () =>
      getFieldsValue().map((item, index) => {
        if (!keys.current[index]) {
          keys.current[index] = getUniqueId();
        }

        const id = keys.current[index];

        if (isPlainObject(item)) {
          return {
            ...(item as Record<string, SafeAnyType>),
            id,
          };
        }
        return {
          id,
        };
      }),
    [getFieldsValue],
  );

  const append: AppendType<FieldsType[0]> = useCallback(
    (value) => {
      /**
       * values is always an array
       * add the appending value to the end of the array
       * name must not be changed to replace the updating array correctly
       */
      changeStateDirectly(name, [...getFieldsValue(), value]);

      rerender();

      const key = getUniqueId();

      keys.current.push(key);

      return key;
    },
    [changeStateDirectly, getFieldsValue, name, rerender],
  );

  const remove: RemoveType = useCallback(
    (index) => {
      const indices = isArray(index) ? index : [index];

      if (indices.length) {
        const arr = getFieldsValue().filter((_, index) => !indices.includes(index));

        if (rerenderAllFieldsAfterRemove) {
          /** change keys to rerender all fields */
          keys.current = createArrayXLength(arr.length).map(getUniqueId);
        } else {
          keys.current = keys.current.filter((_, index) => !indices.includes(index));
        }

        changeStateDirectly(name, arr);

        rerender();
      }
    },
    [changeStateDirectly, getFieldsValue, name, rerender, rerenderAllFieldsAfterRemove],
  );

  return {
    fields: getFieldsPrepared(),
    append,
    remove,
    refresh: rerender,
  };
};
