import { renderHook } from '@testing-library/react';

import {
  stateFormErrorsCommonInvalidMessage,
  stateFormErrorsRequiredMessage,
} from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../index';
import { stateFormErrorsNumberMaxMessage, stateFormErrorsNumberMinMessage } from 'src/utils/stateForm/dataTypes/number';

const typeName = 'number';

describe(typeName, () => {
  console.error = jest.fn();

  type FormValues = {
    valueZero: number | null;
    valueNull: number | null;
    valueSet: number | null;
    bigIntValueZero: bigint | null;
    bigIntValueNull: bigint | null;
    bigIntValueSet: bigint | null;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    valueZero: 0,
    valueNull: null,
    valueSet: 100,
    bigIntValueZero: BigInt(0),
    bigIntValueNull: null,
    bigIntValueSet: BigInt(100),
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

    expect(right).toHaveBeenCalledWith(initialProps);
    expect(left).not.toHaveBeenCalled();
  });

  it('submit changed values', () => {
    const right = jest.fn();
    const left = jest.fn();

    const newValues = {
      valueZero: 0,
      valueNull: null,
      valueSet: 100,
      bigIntValueZero: BigInt(0),
      bigIntValueNull: null,
      bigIntValueSet: BigInt(100),
    };

    formProps.setValue(newValues);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith(newValues);
    expect(left).not.toHaveBeenCalled();
  });

  it('check with Infinity', () => {
    const propName = 'valueNull';

    formProps.register(propName, typeName);

    formProps.setValue(propName, Infinity);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsCommonInvalidMessage));
  });

  it('check with -Infinity', () => {
    const propName = 'valueNull';

    formProps.register(propName, typeName);

    formProps.setValue(propName, -Infinity);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsCommonInvalidMessage));
  });

  it('check with NaN', () => {
    const propName = 'valueNull';

    formProps.register(propName, typeName);

    formProps.setValue(propName, NaN);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsCommonInvalidMessage));
  });

  it('required zero', () => {
    const propName = 'valueZero';

    formProps.register(propName, typeName, {
      required: true,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith(initialProps);
    expect(left).not.toHaveBeenCalled();
  });

  it('required', () => {
    const propName = 'valueNull';

    formProps.register(propName, typeName, {
      required: true,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));

    right.mockClear();
    left.mockClear();

    // set valid value
    const validValue = 12;

    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('required empty', () => {
    const propName = 'valueSet';

    formProps.register(propName, typeName, {
      required: true,
    });

    formProps.setValue(propName, null);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));

    expect(formProps.getErrors(propName)).toEqual(getValidateError(stateFormErrorsRequiredMessage));

    right.mockClear();
    left.mockClear();

    // set valid value
    const validValue = 12;

    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('not required empty', () => {
    const propName = 'valueSet';

    formProps.register(propName, typeName, {
      required: false,
    });

    formProps.setValue(propName, null);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).toHaveBeenCalled();
  });

  it('not required + null value', () => {
    const propName = 'valueNull';

    formProps.register(propName, typeName, {
      required: false,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith(initialProps);
    expect(left).not.toHaveBeenCalled();
  });

  it('min', () => {
    const propName = 'valueZero';

    formProps.register(propName, typeName, {
      min: 10,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit((data) => right(data), left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsNumberMinMessage));

    right.mockClear();
    left.mockClear();

    // set valid value
    const validValue = 100;

    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('min + required', () => {
    const propName = 'valueNull';

    formProps.register(propName, typeName, {
      min: 10,
      required: true,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit((data) => right(data), left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));

    right.mockClear();
    left.mockClear();

    // set invalid value
    formProps.setValue(propName, 1);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsNumberMinMessage));

    right.mockClear();
    left.mockClear();

    // set valid value
    const validValue = 100;

    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('min custom error message', () => {
    const propName = 'valueZero';
    const customMessage = 'customErrorMessage';

    formProps.register(propName, typeName, {
      min: 10,
      minMessage: customMessage,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit((data) => right(data), left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, customMessage));
  });

  it('max', () => {
    const propName = 'valueSet';

    formProps.register(propName, typeName, {
      max: 10,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit((data) => right(data), left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsNumberMaxMessage));

    right.mockClear();
    left.mockClear();

    // set valid value
    const validValue = 10;

    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => right(data), left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('max custom error message', () => {
    const propName = 'valueSet';
    const customMessage = 'customErrorMessage';

    formProps.register(propName, typeName, {
      max: 10,
      maxMessage: customMessage,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit((data) => right(data), left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, customMessage));
  });

  describe('bigInt', () => {
    it('check with Infinity', () => {
      const propName = 'bigIntValueNull';

      formProps.register(propName, typeName);

      formProps.setValue(propName, Infinity);

      const right = jest.fn();
      const left = jest.fn();

      formProps.onSubmit(right, left)();

      expect(right).not.toHaveBeenCalled();
      expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsCommonInvalidMessage));
    });

    it('check with -Infinity', () => {
      const propName = 'bigIntValueNull';

      formProps.register(propName, typeName);

      formProps.setValue(propName, -Infinity);

      const right = jest.fn();
      const left = jest.fn();

      formProps.onSubmit(right, left)();

      expect(right).not.toHaveBeenCalled();
      expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsCommonInvalidMessage));
    });

    it('check with NaN', () => {
      const propName = 'bigIntValueNull';

      formProps.register(propName, typeName);

      formProps.setValue(propName, NaN);

      const right = jest.fn();
      const left = jest.fn();

      formProps.onSubmit(right, left)();

      expect(right).not.toHaveBeenCalled();
      expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsCommonInvalidMessage));
    });

    it('required zero', () => {
      const propName = 'bigIntValueZero';

      formProps.register(propName, typeName, {
        required: true,
      });

      const right = jest.fn();
      const left = jest.fn();

      formProps.onSubmit((data) => right(data), left)();

      expect(right).toHaveBeenCalledWith(initialProps);
      expect(left).not.toHaveBeenCalled();
    });

    it('required', () => {
      const propName = 'bigIntValueNull';

      formProps.register(propName, typeName, {
        required: true,
      });

      const right = jest.fn();
      const left = jest.fn();

      formProps.onSubmit(right, left)();

      expect(right).not.toHaveBeenCalled();
      expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));

      right.mockClear();
      left.mockClear();

      // set valid value
      const validValue = BigInt(12);

      formProps.setValue(propName, validValue);

      formProps.onSubmit((data) => right(data), left)();

      expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
      expect(left).not.toHaveBeenCalled();
    });

    it('required empty', () => {
      const propName = 'bigIntValueSet';

      formProps.register(propName, typeName, {
        required: true,
      });

      formProps.setValue(propName, null);

      const right = jest.fn();
      const left = jest.fn();

      formProps.onSubmit(right, left)();

      expect(right).not.toHaveBeenCalled();
      expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));

      expect(formProps.getErrors(propName)).toEqual(getValidateError(stateFormErrorsRequiredMessage));

      right.mockClear();
      left.mockClear();

      // set valid value
      const validValue = BigInt(12);

      formProps.setValue(propName, validValue);

      formProps.onSubmit((data) => right(data), left)();

      expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
      expect(left).not.toHaveBeenCalled();
    });

    it('min', () => {
      const propName = 'bigIntValueZero';

      formProps.register(propName, typeName, {
        min: 10,
      });

      const right = jest.fn();
      const left = jest.fn();

      formProps.onSubmit((data) => right(data), left)();

      expect(right).not.toHaveBeenCalled();
      expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsNumberMinMessage));

      right.mockClear();
      left.mockClear();

      // set valid value
      const validValue = BigInt(100);

      formProps.setValue(propName, validValue);

      formProps.onSubmit((data) => right(data), left)();

      expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
      expect(left).not.toHaveBeenCalled();
    });

    it('max', () => {
      const propName = 'bigIntValueSet';

      formProps.register(propName, typeName, {
        max: 10,
      });

      const right = jest.fn();
      const left = jest.fn();

      formProps.onSubmit((data) => right(data), left)();

      expect(right).not.toHaveBeenCalled();
      expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsNumberMaxMessage));

      right.mockClear();
      left.mockClear();

      // set valid value
      const validValue = BigInt(10);

      formProps.setValue(propName, validValue);

      formProps.onSubmit((data) => right(data), left)();

      expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
      expect(left).not.toHaveBeenCalled();
    });
  });

  describe('getInitialValue + reset', () => {
    it('not set values', () => {
      expect(formProps.getInitialValue()).toEqual(initialProps);
    });

    it('set values', () => {
      const newValues: FormValues = {
        valueZero: 1,
        valueNull: 1,
        valueSet: 1,
        bigIntValueZero: null,
        bigIntValueNull: null,
        bigIntValueSet: BigInt(100),
      };

      Object.keys(newValues).forEach((propName) => {
        formProps.register(propName, typeName);
      });

      formProps.setValue(newValues);

      expect(formProps.getInitialValue()).toEqual(initialProps);
    });

    it('reset', () => {
      const newValues: FormValues = {
        valueZero: 1,
        valueNull: 1,
        valueSet: 1,
        bigIntValueZero: null,
        bigIntValueNull: null,
        bigIntValueSet: BigInt(100),
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
