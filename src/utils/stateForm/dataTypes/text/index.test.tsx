import { renderHook } from '@testing-library/react';

import { stateFormErrorsRequiredMessage } from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../';
import {
  stateFormErrorsTextMaxLengthMessage,
  stateFormErrorsTextMinLengthMessage,
} from 'src/utils/stateForm/dataTypes/text';

const typeName = 'text';

describe('text + textarea', () => {
  console.error = jest.fn();

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

  it('form empty values', () => {
    const right = jest.fn();
    const left = jest.fn();

    const propName: keyof FormValues = 'strValue0';

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

  it('submit the same values', () => {
    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith(initialProps);
    expect(left).not.toHaveBeenCalled();
  });

  it('submit changed values', () => {
    const right = jest.fn();
    const left = jest.fn();

    const newValues: FormValues = {
      strValue0: '0',
      strValue1: '1',
      strValue2: '2',
    };

    formProps.setValue(newValues);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith(newValues);
    expect(left).not.toHaveBeenCalled();
  });

  it('required empty', () => {
    const propName: keyof FormValues = 'strValue0';

    formProps.register(propName, typeName, {
      required: true,
    });

    formProps.setValue(propName, '');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }] });

    expect(formProps.getErrors(propName)).toEqual([{ type: 'validate', message: stateFormErrorsRequiredMessage }]);
  });

  it('not required empty', () => {
    const propName: keyof FormValues = 'strValue0';

    formProps.register(propName, typeName);

    formProps.setValue(propName, '');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).toHaveBeenCalled();

    expect(formProps.getErrors(propName)).toEqual([]);
  });

  it('submit disabled', () => {
    const propName: keyof FormValues = 'strValue0';

    formProps.register(propName, typeName, {
      disabled: true,
    });

    formProps.setValue(propName, null);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).toHaveBeenCalled();
    expect(left).not.toHaveBeenCalled();

    expect(formProps.getErrors(propName)).toEqual([]);
  });

  it('required empty length', () => {
    const propName = 'strValue1';

    formProps.register(propName, typeName, {
      required: true,
    });

    formProps.setValue(propName, '                ');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }] });

    expect(formProps.getErrors(propName)).toEqual([{ type: 'validate', message: stateFormErrorsRequiredMessage }]);
  });

  it('required empty multiple', () => {
    const propNames = ['strValue1', 'strValue2'];

    propNames.forEach((propName) => {
      formProps.register(propName, typeName, {
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
    const propName: keyof FormValues = 'strValue0';

    formProps.register(propName, typeName, {
      minLength: 3,
    });

    // set empty value
    formProps.setValue(propName, '');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsTextMinLengthMessage }],
    });

    // set another empty value
    right.mockClear();
    left.mockClear();

    formProps.setValue(propName, '               ');

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsTextMinLengthMessage }],
    });

    // set valid value
    right.mockClear();
    left.mockClear();

    const validValue = '333';
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('maxLength', () => {
    const propName = 'strValue1';

    formProps.register(propName, typeName, {
      maxLength: 5,
    });

    // set invalid value
    formProps.setValue(propName, '123456');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsTextMaxLengthMessage }],
    });

    // set another invalid value
    right.mockClear();
    left.mockClear();

    formProps.setValue(propName, '   123456    ');

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsTextMaxLengthMessage }],
    });

    // set valid value
    right.mockClear();
    left.mockClear();

    const validValue = '   123    ';
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('required + maxLength', () => {
    const propName = 'strValue1';

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
      [propName]: [{ type: 'validate', message: stateFormErrorsTextMaxLengthMessage }],
    });
  });

  it('required + minLength', () => {
    const propName = 'strValue1';

    formProps.register(propName, typeName, {
      minLength: 3,
      required: true,
    });

    formProps.onBlur(propName);

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
    formProps.setValue(propName, '1');

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsTextMinLengthMessage }],
    });
  });

  it('not required + minLength', () => {
    const propName = 'strValue1';

    formProps.register(propName, typeName, {
      minLength: 3,
    });

    formProps.onBlur(propName);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsTextMinLengthMessage }],
    });

    right.mockClear();
    left.mockClear();

    // set invalid value
    formProps.setValue(propName, '1');

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsTextMinLengthMessage }],
    });
  });

  describe('getInitialValue + reset', () => {
    it('not set values', () => {
      expect(formProps.getInitialValue()).toEqual(initialProps);
    });

    it('set values', () => {
      const newValues: FormValues = {
        strValue0: 'strValue0',
        strValue1: 'strValue1',
        strValue2: 'strValue2',
      };

      Object.keys(newValues).forEach((propName) => {
        formProps.register(propName, typeName);
      });

      formProps.setValue(newValues);

      expect(formProps.getInitialValue()).toEqual(initialProps);
    });

    it('reset', () => {
      const newValues: FormValues = {
        strValue0: 'strValue0',
        strValue1: 'strValue1',
        strValue2: 'strValue2',
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
