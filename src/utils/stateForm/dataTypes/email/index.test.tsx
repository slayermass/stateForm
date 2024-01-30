import { renderHook } from '@testing-library/react';

import { stateFormErrorsRequiredEmailMessage } from './index';
import {
  stateFormErrorsMaxLengthMessage,
  stateFormErrorsMinLengthMessage,
  stateFormErrorsRequiredMessage,
} from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../index';

describe('email', () => {
  type FormValues = {
    emailValue0: string;
    emailValue1: string;
    emailValue2: string;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    emailValue0: '--------///////',
    emailValue1: '',
    emailValue2: 'y@y.com',
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
      emailValue0: 'y1@y.com',
      emailValue1: 'y2@y.ru',
      emailValue2: 'y3@y.oa',
    };

    Object.keys(newValues).forEach((propName) => {
      formProps.register(propName, 'email', {
        required: true,
      });
    });

    formProps.setValue(newValues);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toBeCalledWith(newValues);
    expect(left).not.toBeCalled();
  });

  it('required empty multiple', () => {
    const propNames = ['emailValue1', 'emailValue2'];

    propNames.forEach((propName) => {
      formProps.register(propName, 'email', {
        required: true,
      });

      formProps.setValue(propName as keyof FormValues, '                ');
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({
      [propNames[0]]: [{ type: 'validate', message: stateFormErrorsRequiredEmailMessage }],
      [propNames[1]]: [{ type: 'validate', message: stateFormErrorsRequiredEmailMessage }],
    });

    expect(formProps.getErrors(propNames as (keyof FormValues)[])).toEqual([
      [{ type: 'validate', message: stateFormErrorsRequiredEmailMessage }],
      [{ type: 'validate', message: stateFormErrorsRequiredEmailMessage }],
    ]);
  });

  it('minLength', () => {
    const propName = 'emailValue0';

    formProps.register(propName, 'email', {
      minLength: 8,
    });

    // set empty value
    formProps.setValue(propName, '');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsMinLengthMessage }] });

    // set another empty value
    right.mockClear();
    left.mockClear();

    formProps.setValue(propName, ' t@t.com ');

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsMinLengthMessage }] });

    // set valid value
    right.mockClear();
    left.mockClear();

    const validValue = 'tttttt@tttt.com';
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toBeCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toBeCalled();
  });

  it('maxLength', () => {
    const propName = 'emailValue1';

    formProps.register(propName, 'email', {
      maxLength: 7,
    });

    // set invalid value
    formProps.setValue(propName, 't@tt.com');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsMaxLengthMessage }] });

    // set another invalid value
    right.mockClear();
    left.mockClear();

    formProps.setValue(propName, '   t@tt@4com    ');

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsMaxLengthMessage }] });

    // set valid value
    right.mockClear();
    left.mockClear();

    const validValue = '   t@t.com    ';
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toBeCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toBeCalled();
  });

  it('required + maxLength', () => {
    const propName = 'emailValue1';

    formProps.register(propName, 'email', {
      maxLength: 7,
      required: true,
    });

    // set invalid value
    formProps.setValue(propName, '12345678');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsRequiredEmailMessage }],
    });
  });

  it('required + minLength', () => {
    const propName = 'emailValue1';

    formProps.register(propName, 'email', {
      minLength: 10,
      required: true,
    });

    formProps.onBlur(propName);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
    });

    right.mockClear();
    left.mockClear();

    // set invalid value
    formProps.setValue(propName, 't@t.com')

    formProps.onSubmit(right, left)();

    console.log(formProps.getValue());

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsMinLengthMessage }]
    })
  });
});
