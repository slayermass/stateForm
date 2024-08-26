import { renderHook } from '@testing-library/react';

import { StateFormReturnType, useStateForm } from 'src/utils/stateForm';
import {
  StateFormFieldArrayReturnType,
  useStateFormFieldArray,
} from 'src/utils/stateForm/helpers/useStateFormFieldArray';

type FormValues = {
  nested: { id: number; label: string }[];
};

describe('useStateFormFieldArray', () => {
  console.error = jest.fn();

  let formProps: StateFormReturnType<FormValues>;
  let formFieldArray: StateFormFieldArrayReturnType<FormValues['nested']>;

  const initialProps: FormValues = {
    nested: [],
  };

  beforeEach(() => {
    const {
      result: { current },
    } = renderHook(
      (defaultValues) => {
        const formProps = useStateForm<FormValues>({
          defaultValues,
          typeCheckOnSetValue: false,
        });

        return {
          formProps,
          formFieldArray: useStateFormFieldArray<FormValues['nested']>({
            formProps,
            name: 'nested',
          }),
        };
      },
      {
        initialProps,
      },
    );

    formProps = current.formProps;
    formFieldArray = current.formFieldArray;
  });

  it('test initial values', () => {
    expect(formProps.getValue()).toEqual(initialProps);
    expect(formFieldArray.fields).toEqual(initialProps.nested);
  });

  it('append some fields', async () => {
    const values: FormValues['nested'] = [
      {
        id: 1,
        label: 'test1',
      },
      {
        id: 2,
        label: 'test2',
      },
    ];

    values.forEach((value) => {
      formFieldArray.append(value);
    });

    // temporary. the right code is expect(formFieldArray.fields)
    expect(formProps.getValue('nested')).toEqual(values);
  });

  it('append + remove[] some fields', async () => {
    const values: FormValues['nested'] = [
      {
        id: 1,
        label: 'test1',
      },
      {
        id: 2,
        label: 'test2',
      },
    ];

    values.forEach((value) => {
      formFieldArray.append(value);
    });

    expect(formProps.getValue('nested')).toEqual(values);

    formFieldArray.remove([0, 1]);

    expect(formProps.getValue('nested')).toEqual(initialProps.nested);
  });

  it('append + remove by index some fields', async () => {
    const values: FormValues['nested'] = [
      {
        id: 1,
        label: 'test1',
      },
      {
        id: 2,
        label: 'test2',
      },
    ];

    values.forEach((value) => {
      formFieldArray.append(value);
    });

    expect(formProps.getValue('nested')).toEqual(values);

    values.forEach(() => {
      formFieldArray.remove(0); // after deleting 0 element, 1 becomes 0
    });

    expect(formProps.getValue('nested')).toEqual(initialProps.nested);
  });

  // todo validate nested values?

  it('console errors check (should be the last test)', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
