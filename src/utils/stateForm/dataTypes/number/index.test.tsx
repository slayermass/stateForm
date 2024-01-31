import { renderHook } from '@testing-library/react';

import {
  stateFormErrorsRequiredMessage,
} from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../index';

describe('number', () => {
  console.error = jest.fn();

  type FormValues = {
    value0: number | null;
    value1: number | null;
    value2: number | null;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    value0: 0,
    value1: null,
    value2: 100,
  };

  const getValidateError = (message: string) => [{ type: 'validate', message: message }];
  const getValidateErrorWithProp = (propName: string, message: string) => ({ [propName]: getValidateError(message) });

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

  it('submit the same values', () => {
    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toBeCalledWith(initialProps);
    expect(left).not.toBeCalled();
  });

  it('submit changed values', () => {
    const right = jest.fn();
    const left = jest.fn();

    const newValues = {
      value0: null,
      value1: 100,
      value2: 0,
    };

    formProps.setValue(newValues);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toBeCalledWith(newValues);
    expect(left).not.toBeCalled();
  });

  it('check with Infinity', () => {
    const propName = 'value1';

    formProps.register(propName, 'number');

    formProps.setValue(propName, Infinity);

    const right = jest.fn();
    const left = jest.fn();


    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled()
    expect(left).toBeCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));
  });

  it('check with -Infinity', () => {
    const propName = 'value1';

    formProps.register(propName, 'number');

    formProps.setValue(propName, -Infinity);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left);

    expect(right).not.toBeCalled()
    expect(left).toBeCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));
  });

  it('check with NaN', () => {
    const propName = 'value1';

    formProps.register(propName, 'number');

    formProps.setValue(propName, NaN);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left);

    expect(right).not.toBeCalled()
    expect(left).toBeCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));
  });

  it('required zero', () => {
    const propName = 'value0';

    formProps.register(propName, 'number', {
      required: true,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toBeCalledWith(initialProps);
    expect(left).not.toBeCalled();
  });

  it('required', () => {
    const propName = 'value1';

    formProps.register(propName, 'number', {
      required: true,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));

    right.mockClear();
    left.mockClear();

    // set valid value
    const validValue = 12;

    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toBeCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toBeCalled();
  });

  it('required empty', () => {
    const propName = 'value2';

    formProps.register(propName, 'number', {
      required: true,
    });

    formProps.setValue(propName, null);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));

    expect(formProps.getErrors(propName)).toEqual(getValidateError(stateFormErrorsRequiredMessage));

    right.mockClear();
    left.mockClear();

    // set valid value
    const validValue = 12;

    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toBeCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toBeCalled();
  });

  it('console errors check (should be the last test)', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
