import { renderHook } from '@testing-library/react';

import { StateFormDataTypeCheckBoxGroupType } from './index';
import { StateFormEmptyValueType, StateFormReturnType, useStateForm } from '../../index';

const typeName = 'checkBoxGroup';

describe(typeName, () => {
  console.error = jest.fn();

  type FormValues = {
    checkValue0: StateFormDataTypeCheckBoxGroupType | StateFormEmptyValueType;
    checkValue1: StateFormDataTypeCheckBoxGroupType | StateFormEmptyValueType;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    checkValue0: null,
    checkValue1: null,
  };

  beforeEach(() => {
    const {
      result: { current },
    } = renderHook(
      (defaultValues) =>
        useStateForm<FormValues>({
          defaultValues,
        }),
      {
        initialProps,
      },
    );

    formProps = current;
  });

  it('init', () => {
    expect(formProps.getValue()).toEqual(initialProps);
  });

  it('submit values', () => {
    const right = jest.fn();
    const left = jest.fn();

    const newValues: FormValues = {
      checkValue0: true,
      checkValue1: false,
    };

    Object.keys(newValues).forEach((propName) => {
      formProps.register(propName, typeName, {
        required: true,
      });
    });

    formProps.setValue(newValues);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith(newValues);
    expect(left).not.toHaveBeenCalled();
  });

  it('submit empty values', () => {
    const right = jest.fn();
    const left = jest.fn();

    const newValues: FormValues = {
      checkValue0: null,
      checkValue1: null,
    };

    Object.keys(newValues).forEach((propName) => {
      formProps.register(propName, typeName, {
        required: true,
      });
    });

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith(newValues);
    expect(left).not.toHaveBeenCalled();
  });

  describe('getInitialValue + reset', () => {
    it('not set values', () => {
      expect(formProps.getInitialValue()).toEqual(initialProps);
    });

    it('set values', () => {
      const newValues: FormValues = {
        checkValue0: true,
        checkValue1: false,
      };

      Object.keys(newValues).forEach((propName) => {
        formProps.register(propName, typeName);
      });

      formProps.setValue(newValues);

      expect(formProps.getInitialValue()).toEqual(initialProps);
    });

    it('reset', () => {
      const newValues: FormValues = {
        checkValue0: true,
        checkValue1: false,
      };

      Object.keys(newValues).forEach((propName) => {
        formProps.register(propName, typeName);
      });

      formProps.reset(newValues, {
        resetInitialForm: true,
      });

      expect(formProps.getInitialValue()).toEqual(newValues);
    });
  });

  it('console errors check (should be the last test)', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
