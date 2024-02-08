import { renderHook } from '@testing-library/react';

import {
  stateFormErrorsRequiredMessage,
} from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../index';

describe('number', () => {
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
      valueZero: null,
      valueNull: 100,
      valueSet: 0,
      bigIntValueZero: null,
      bigIntValueNull: BigInt(100),
      bigIntValueSet: BigInt(0),
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

    formProps.register(propName, 'number');

    formProps.setValue(propName, Infinity);

    const right = jest.fn();
    const left = jest.fn();


    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));
  });

  it('check with -Infinity', () => {
    const propName = 'valueNull';

    formProps.register(propName, 'number');

    formProps.setValue(propName, -Infinity);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled()
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));
  });

  it('check with NaN', () => {
    const propName = 'valueNull';

    formProps.register(propName, 'number');

    formProps.setValue(propName, NaN);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled()
    expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));
  });

  it('required zero', () => {
    const propName = 'valueZero';

    formProps.register(propName, 'number', {
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

    formProps.register(propName, 'number', {
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

    formProps.register(propName, 'number', {
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

  describe('bigInt', () => {
    it('check with Infinity', () => {
      const propName = 'bigIntValueNull';

      formProps.register(propName, 'number');

      formProps.setValue(propName, Infinity);

      const right = jest.fn();
      const left = jest.fn();


      formProps.onSubmit(right, left)();

      expect(right).not.toHaveBeenCalled();
      expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));
    });

    it('check with -Infinity', () => {
      const propName = 'bigIntValueNull';

      formProps.register(propName, 'number');

      formProps.setValue(propName, -Infinity);

      const right = jest.fn();
      const left = jest.fn();

      formProps.onSubmit(right, left)();

      expect(right).not.toHaveBeenCalled()
      expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));
    });

    it('check with NaN', () => {
      const propName = 'bigIntValueNull';

      formProps.register(propName, 'number');

      formProps.setValue(propName, NaN);

      const right = jest.fn();
      const left = jest.fn();

      formProps.onSubmit(right, left)();

      expect(right).not.toHaveBeenCalled()
      expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));
    });

    it('required zero', () => {
      const propName = 'bigIntValueZero';

      formProps.register(propName, 'number', {
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

      formProps.register(propName, 'number', {
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

      formProps.register(propName, 'number', {
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
  })

  it('console errors check (should be the last test)', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
