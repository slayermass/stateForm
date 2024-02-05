import { renderHook } from '@testing-library/react';

import {
  stateFormErrorsCommonInvalidMessage,
  stateFormErrorsRequiredMessage,
} from '../../helpers/formStateGenerateErrors';
import { StateFormEmptyValueType, StateFormReturnType, useStateForm } from '../../index';

describe('date', () => {
  console.error = jest.fn();

  type FormValues = {
    dateValue0: Date | StateFormEmptyValueType;
    dateValue1: Date | StateFormEmptyValueType;
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

    const newValues = {
      dateValue0: new Date(),
      dateValue1: new Date(),
    };

    Object.keys(newValues).forEach((propName) => {
      formProps.register(propName, 'date', {
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
    const propNames = ['dateValue0', 'dateValue1'];

    propNames.forEach((propName) => {
      formProps.register(propName, 'date', {
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

  it('required wrong type', () => {
    const propName = 'dateValue0';

    formProps.register(propName, 'date', {
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
    const propName = 'dateValue0';

    formProps.register(propName, 'date', {
      required: true,
      minDate: new Date(5e7),
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.setValue(propName, new Date(3e7));

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsCommonInvalidMessage }],
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
    const propName = 'dateValue0';
    const minDateMessage = 'HALU';

    formProps.register(propName, 'date', {
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
    const propName = 'dateValue0';

    formProps.register(propName, 'date', {
      required: true,
      maxDate: new Date(15e9),
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.setValue(propName, new Date(22e9));

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsCommonInvalidMessage }],
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
    const propName = 'dateValue0';
    const maxDateMessage = 'wronngnsa!!@#@#!@#';

    formProps.register(propName, 'date', {
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

  it('console errors check (should be the last test)', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
