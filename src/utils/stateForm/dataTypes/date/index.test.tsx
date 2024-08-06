import { renderHook } from '@testing-library/react';

import { stateFormErrorsRequiredMessage } from '../../helpers/formStateGenerateErrors';
import { StateFormEmptyValueType, StateFormReturnType, useStateForm } from '../../index';
import {
  StateFormDateType,
  stateFormErrorsDateMaxMessage,
  stateFormErrorsDateMinMessage,
} from 'src/utils/stateForm/dataTypes/date/index';

const typeName = 'date';

describe(typeName, () => {
  console.error = jest.fn();

  type FormValues = {
    dateValue0: StateFormDateType['value'] | StateFormEmptyValueType;
    dateValue1: StateFormDateType['value'] | StateFormEmptyValueType;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    dateValue0: null,
    dateValue1: null,
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

  it('submit changed values', () => {
    const right = jest.fn();
    const left = jest.fn();

    const newValues: FormValues = {
      dateValue0: new Date(),
      dateValue1: new Date(),
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

  it('required empty multiple', () => {
    const propNames: Array<keyof FormValues> = ['dateValue0', 'dateValue1'];

    propNames.forEach((propName) => {
      formProps.register(propName, typeName, {
        required: true,
      });

      formProps.setValue(propName as keyof FormValues, null);
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propNames[0]]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
      [propNames[1]]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
    });

    expect(formProps.getErrors(propNames as (keyof FormValues)[])).toEqual([
      [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
      [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
    ]);
  });

  it('not required empty multiple', () => {
    const propNames: Array<keyof FormValues> = ['dateValue0', 'dateValue1'];

    propNames.forEach((propName) => {
      formProps.register(propName, typeName);

      formProps.setValue(propName as keyof FormValues, null);
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).toHaveBeenCalled();

    expect(formProps.getErrors(propNames as (keyof FormValues)[])).toEqual([[], []]);
  });

  it('required wrong type', () => {
    const propName: keyof FormValues = 'dateValue0';

    formProps.register(propName, typeName, {
      required: true,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
    });

    right.mockClear();
    left.mockClear();

    // set invalid value 1
    formProps.setValue(propName, 'test.com');

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
    });

    right.mockClear();
    left.mockClear();

    // set invalid value 2
    formProps.setValue(propName, 66);

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
    });

    // set valid value
    right.mockClear();
    left.mockClear();

    const validValue = new Date();

    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('required + minDate', () => {
    const propName: keyof FormValues = 'dateValue0';

    formProps.register(propName, typeName, {
      required: true,
      minDate: new Date(5e7),
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.setValue(propName, new Date(3e7));

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsDateMinMessage }],
    });

    right.mockClear();
    left.mockClear();

    // valid value
    const validValue = new Date(6e7);
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('not required + minDate', () => {
    const propName: keyof FormValues = 'dateValue0';

    formProps.register(propName, typeName, {
      minDate: new Date(5e7),
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.setValue(propName, new Date(3e7));

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsDateMinMessage }],
    });

    right.mockClear();
    left.mockClear();

    // valid value
    const validValue = new Date(6e7);
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('required + minDate + minDateMessage', () => {
    const propName: keyof FormValues = 'dateValue0';
    const minDateMessage = 'HALU';

    formProps.register(propName, typeName, {
      required: true,
      minDate: new Date(5e7),
      minDateMessage,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.setValue(propName, new Date(3e7));

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: minDateMessage }],
    });

    right.mockClear();
    left.mockClear();

    // valid value
    const validValue = new Date(6e7);
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('required + maxDate', () => {
    const propName: keyof FormValues = 'dateValue0';

    formProps.register(propName, typeName, {
      required: true,
      maxDate: new Date(15e9),
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.setValue(propName, new Date(22e9));

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsDateMaxMessage }],
    });

    right.mockClear();
    left.mockClear();

    // valid value
    const validValue = new Date(6e7);
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('required + maxDate + maxDateMessage', () => {
    const propName: keyof FormValues = 'dateValue0';
    const maxDateMessage = 'wronngnsa!!@#@#!@#';

    formProps.register(propName, typeName, {
      required: true,
      maxDate: new Date(5e7),
      maxDateMessage,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.setValue(propName, new Date(36e7));

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: maxDateMessage }],
    });

    right.mockClear();
    left.mockClear();

    // valid value
    const validValue = new Date(2e4);
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  describe('getInitialValue + reset', () => {
    it('not set values', () => {
      expect(formProps.getInitialValue()).toEqual(initialProps);
    });

    it('set values', () => {
      const newValues: FormValues = {
        dateValue0: new Date(),
        dateValue1: new Date(),
      };

      Object.keys(newValues).forEach((propName) => {
        formProps.register(propName, typeName);
      });

      formProps.setValue(newValues);

      expect(formProps.getInitialValue()).toEqual(initialProps);
    });

    it('reset', () => {
      const newValues: FormValues = {
        dateValue0: new Date(),
        dateValue1: new Date(),
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
