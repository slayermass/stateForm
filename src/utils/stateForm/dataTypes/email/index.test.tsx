import { renderHook } from '@testing-library/react';

import {
  stateFormErrorsEmailMaxLengthMessage,
  stateFormErrorsEmailMinLengthMessage,
  stateFormErrorsPatternEmailMessage,
} from './index';
import { stateFormErrorsRequiredMessage } from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../index';

const typeName = 'email';

describe(typeName, () => {
  console.error = jest.fn();

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

  it('form empty values', () => {
    const right = jest.fn();
    const left = jest.fn();

    const propName: keyof FormValues = 'emailValue1';

    formProps.register(propName, typeName, {
      required: true,
    });

    [null, undefined].forEach((value) => {
      formProps.setValue(propName, value);

      formProps.onSubmit((data) => {
        right(data);
      }, left)();

      expect(right).not.toHaveBeenCalled();
      expect(left).toHaveBeenCalledWith({
        [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
      });
    });
  });

  it('submit changed values', () => {
    const right = jest.fn();
    const left = jest.fn();

    const newValues: FormValues = {
      emailValue0: 'y1@y.com',
      emailValue1: 'y2@y.ru',
      emailValue2: 'y3@y.oa',
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
    const propNames: Array<keyof FormValues> = ['emailValue1', 'emailValue2'];

    propNames.forEach((propName) => {
      formProps.register(propName, typeName, {
        required: true,
      });

      formProps.setValue(propName as keyof FormValues, '                ');
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
    const propNames: Array<keyof FormValues> = ['emailValue1', 'emailValue2'];

    propNames.forEach((propName) => {
      formProps.register(propName, typeName, {
        required: false,
      });

      formProps.setValue(propName as keyof FormValues, '                ');
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).toHaveBeenCalled();

    expect(formProps.getErrors(propNames as (keyof FormValues)[])).toEqual([[], []]);
  });

  it('minLength', () => {
    const propName: keyof FormValues = 'emailValue0';

    formProps.register(propName, typeName, {
      minLength: 8,
    });

    // set empty value
    formProps.setValue(propName, '');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsEmailMinLengthMessage }],
    });

    // set another empty value
    right.mockClear();
    left.mockClear();

    formProps.setValue(propName, ' t@t.com ');

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsEmailMinLengthMessage }],
    });

    // set another invalid value (not email)
    right.mockClear();
    left.mockClear();

    formProps.setValue(propName, '12312321312312323');

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsPatternEmailMessage }],
    });

    // set valid value
    right.mockClear();
    left.mockClear();

    const validValue = 'tttttt@tttt.com';
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('maxLength', () => {
    const propName: keyof FormValues = 'emailValue1';

    formProps.register(propName, typeName, {
      maxLength: 7,
    });

    // set invalid value
    formProps.setValue(propName, 't@tt.com');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsEmailMaxLengthMessage }],
    });

    // set another invalid value
    right.mockClear();
    left.mockClear();

    formProps.setValue(propName, '   ttt@4.com    ');

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsEmailMaxLengthMessage }],
    });

    // set another invalid value (not email)
    right.mockClear();
    left.mockClear();

    formProps.setValue(propName, '123456');

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsPatternEmailMessage }],
    });

    // set valid value
    right.mockClear();
    left.mockClear();

    const validValue = '   t@t.com    ';
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('required + maxLength', () => {
    const propName: keyof FormValues = 'emailValue1';

    formProps.register(propName, typeName, {
      maxLength: 7,
      required: true,
    });

    // set invalid value
    formProps.setValue(propName, '12345678');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsPatternEmailMessage }],
    });
  });

  it('required + minLength', () => {
    const propName: keyof FormValues = 'emailValue1';

    formProps.register(propName, typeName, {
      minLength: 10,
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

    // set invalid value
    formProps.setValue(propName, 't@t.com');

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsEmailMinLengthMessage }],
    });

    right.mockClear();
    left.mockClear();

    // set valid value
    const validValue = 'test@test.com';
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: 'test@test.com' });
    expect(left).not.toHaveBeenCalled();
  });

  it('not required + minLength', () => {
    const propName: keyof FormValues = 'emailValue1';

    formProps.register(propName, typeName, {
      minLength: 10,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsEmailMinLengthMessage }],
    });

    right.mockClear();
    left.mockClear();

    // set invalid value
    formProps.setValue(propName, 't@t.com');

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsEmailMinLengthMessage }],
    });

    right.mockClear();
    left.mockClear();

    // set valid value
    const validValue = 'test@test.com';
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: 'test@test.com' });
    expect(left).not.toHaveBeenCalled();
  });

  it('valid pattern', () => {
    const propName: keyof FormValues = 'emailValue1';

    formProps.register(propName, typeName);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps });
    expect(left).not.toHaveBeenCalled();

    right.mockClear();
    left.mockClear();

    // set invalid pattern
    formProps.setValue(propName, 'test text');

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsPatternEmailMessage }],
    });

    right.mockClear();
    left.mockClear();

    // set valid pattern
    const validValue = 'test@test.com';

    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('required + pattern email', () => {
    const propName: keyof FormValues = 'emailValue1';

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

    // set invalid value
    formProps.setValue(propName, 'test.com');

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsPatternEmailMessage }],
    });

    right.mockClear();
    left.mockClear();

    // set valid value
    const validValue = 'test@test.com';

    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  describe('getInitialValue + reset', () => {
    it('not set values', () => {
      expect(formProps.getInitialValue()).toEqual(initialProps);
    });

    it('set values', () => {
      const newValues: FormValues = {
        emailValue0: 'emailValue0',
        emailValue1: 'emailValue1',
        emailValue2: 'emailValue2',
      };

      Object.keys(newValues).forEach((propName) => {
        formProps.register(propName, typeName);
      });

      formProps.setValue(newValues);

      expect(formProps.getInitialValue()).toEqual(initialProps);
    });

    it('reset', () => {
      const newValues: FormValues = {
        emailValue0: 'emailValue0',
        emailValue1: 'emailValue1',
        emailValue2: 'emailValue2',
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
