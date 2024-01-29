import { renderHook } from '@testing-library/react';

import {
  stateFormErrorsMaxLengthMessage,
  stateFormErrorsMinLengthMessage,
  stateFormErrorsRequiredMessage,
} from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../index';

describe('text + textarea', () => {
  type FormValues = {
    strValue0: string;
    strValue1: string;
    strValue2: string;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    strValue0: '--------///////',
    strValue1: '',
    strValue2: 'GOO63463737867ty34546 GOGOGO OGO #@#%@#%@#^^#^#',
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
      strValue0: '0',
      strValue1: '1',
      strValue2: '2',
    };

    formProps.setValue(newValues);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toBeCalledWith(newValues);
    expect(left).not.toBeCalled();
  });

  it('required empty', () => {
    const propName = 'strValue0';

    formProps.register(propName, 'text', {
      required: true,
    });

    formProps.setValue(propName, '');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }] });

    expect(formProps.getErrors(propName)).toEqual([{ type: 'validate', message: stateFormErrorsRequiredMessage }]);
  });

  it('required empty length', () => {
    const propName = 'strValue1';

    formProps.register(propName, 'text', {
      required: true,
    });

    formProps.setValue(propName, '                ');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }] });

    expect(formProps.getErrors(propName)).toEqual([{ type: 'validate', message: stateFormErrorsRequiredMessage }]);
  });

  it('required empty multiple', () => {
    const propNames = ['strValue1', 'strValue2'];

    propNames.forEach((propName) => {
      formProps.register(propName, 'text', {
        required: true,
      });

      formProps.setValue(propName as keyof FormValues, '                ');
    });

    formProps.onSubmit(
      () => null,
      (errors) => {
        expect(errors).toEqual({
          [propNames[0]]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
          [propNames[1]]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
        });
      },
    )();

    expect(formProps.getErrors(propNames as (keyof FormValues)[])).toEqual([
      [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
      [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
    ]);
  });

  it('minLength', () => {
    const propName = 'strValue0';

    formProps.register(propName, 'text', {
      minLength: 3,
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

    formProps.setValue(propName, '               ');

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsMinLengthMessage }] });

    // set valid value
    right.mockClear();
    left.mockClear();

    const validValue = '333';
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toBeCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toBeCalled();
  });

  it('maxLength', () => {
    const propName = 'strValue1';

    formProps.register(propName, 'text', {
      maxLength: 5,
    });

    // set invalid value
    formProps.setValue(propName, '123456');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsMaxLengthMessage }] });

    // set another invalid value
    right.mockClear();
    left.mockClear();

    formProps.setValue(propName, '   123456    ');

    formProps.onSubmit(right, left)();

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsMaxLengthMessage }] });

    // set valid value
    right.mockClear();
    left.mockClear();

    const validValue = '   123    ';
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toBeCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toBeCalled();
  });

  it('required + maxLength', () => {
    const propName = 'strValue1';

    formProps.register(propName, 'text', {
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
      [propName]: [{ type: 'validate', message: stateFormErrorsMaxLengthMessage }],
    });
  });
});
