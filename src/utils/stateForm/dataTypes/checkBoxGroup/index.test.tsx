import { renderHook } from '@testing-library/react';

import { StateFormCheckBoxGroupType } from './index';
import { StateFormEmptyValueType, StateFormReturnType, useStateForm } from '../../index';

const typeName = 'checkBoxGroup';

describe(typeName, () => {
  console.error = jest.fn();

  type FormValues = {
    checkValue0: StateFormCheckBoxGroupType['value'] | StateFormEmptyValueType;
    checkValue1: StateFormCheckBoxGroupType['value'] | StateFormEmptyValueType;
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

    it('reset resetInitialForm', () => {
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

    it('reset resetInitialForm + mergeWithPreviousState', () => {
      const newValues: FormValues = {
        checkValue0: true,
        checkValue1: false,
      };

      Object.keys(newValues).forEach((propName) => {
        formProps.register(propName, typeName);
      });

      formProps.reset(
        {
          checkValue0: false,
        },
        {
          resetInitialForm: true,
        },
      );

      // if later you need to add something to the initial form use mergeWithPrevious
      // int this way it is possible to reset partially
      formProps.reset(
        {
          checkValue1: false,
        },
        {
          resetInitialForm: true,
          mergeWithPreviousState: true,
        },
      );

      expect(formProps.getInitialValue()).toEqual({
        checkValue0: false,
        checkValue1: false,
      });
    });
  });

  it('console errors check (should be the last test)', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
