import { useCallback, useRef, useState } from 'react';

import { StateFormReturnType } from 'src/utils/stateForm/index';

import {
  createArrayXLength,
  isPlainObject,
  isArray,
  SafeAnyType,
  getUniqueId,
} from 'src/utils/stateForm/outerDependencies';

type DefaultFieldType = Record<string, SafeAnyType>;

type RemoveType = (index: number | number[]) => void;
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

export type StateFormFieldArrayReturnType<FieldsType extends SafeAnyType[]> = ReturnType<
  Array<FieldsType[0] extends DefaultFieldType ? FieldsType[0] & { getId: () => string } : { getId: () => string }>,
  FieldsType[0]
>;

export const useStateFormFieldArray = <FieldsType extends SafeAnyType[]>({
  formProps: { getValue, changeStateDirectly },
  name,
  rerenderAllFieldsAfterRemove = true,
}: Props): StateFormFieldArrayReturnType<FieldsType> => {
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

        if (isPlainObject(item)) {
          return {
            ...(item as Record<string, SafeAnyType>),
            getId: () => keys.current[index],
          };
        }

        return {
          getId: () => keys.current[index],
        };
      }),
    [getFieldsValue],
  );

  const append: AppendType<FieldsType[0]> = useCallback(
    (value) => {
      /**
       * value is always an array
       * add the appending value to the end of the array
       * name must not be changed to replace the updating array correctly
       */
      changeStateDirectly(name, [...getFieldsValue(), value], {
        fromFormFieldArrayHook: true,
      }).then(rerender);

      const key = getUniqueId();

      keys.current.push(key);

      return key;
    },
    [rerender, changeStateDirectly, getFieldsValue, name],
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

        changeStateDirectly(name, arr, {
          fromFormFieldArrayHook: true,
        }).then(rerender);
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
