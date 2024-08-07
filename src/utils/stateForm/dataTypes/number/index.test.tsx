import { renderHook } from '@testing-library/react';

import { stateFormEmptyValues, StateFormEmptyValueType, stateFormIsValueInnerEmpty } from 'src/utils/stateForm/types';
import {
  stateFormErrorsCommonInvalidMessage,
  stateFormErrorsRequiredMessage,
} from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../index';
import {
  stateFormErrorsNumberMaxMessage,
  stateFormErrorsNumberMinMessage,
  StateFormNumberType,
} from 'src/utils/stateForm/dataTypes/number';

const typeName = 'number';

describe(typeName, () => {
  console.error = jest.fn();

  type FormValues = {
    valueZero: number | StateFormEmptyValueType;
    valueNull: number | StateFormEmptyValueType;
    valueSet: number | StateFormEmptyValueType;
    bigIntValueZero: bigint | StateFormEmptyValueType;
    bigIntValueNull: bigint | StateFormEmptyValueType;
    bigIntValueSet: bigint | StateFormEmptyValueType;
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

  describe('simple validity', () => {
    // "-0" comes "0"
    const validValues = [
      Number.MIN_SAFE_INTEGER,
      Number.MAX_SAFE_INTEGER,
      0,
      500,
      -1,
      +0,
      1e6,
      BigInt(-1e67),
      BigInt(0),
      BigInt(1e67),
      ...stateFormEmptyValues,
    ];

    const invalidValues = [Infinity, -Infinity, NaN, '']; // any not numbers

    it('test valid values. default', () => {
      const right = jest.fn();

      const propName: keyof FormValues = 'valueNull';

      formProps.register(propName, typeName);

      validValues.forEach((value) => {
        formProps.setValue(propName, value);

        formProps.onSubmit((data) => {
          right(data);
        })();

        expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: value });

        right.mockClear();
      });
    });

    it('test valid values. required', () => {
      const right = jest.fn();

      const propName: keyof FormValues = 'valueNull';

      formProps.register(propName, typeName, {
        required: true,
      });

      validValues
        .filter((v) => !stateFormIsValueInnerEmpty(v))
        .forEach((value) => {
          formProps.setValue(propName, value);

          formProps.onSubmit((data) => {
            right(data);
          })();

          expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: value });

          right.mockClear();
        });
    });

    it('test valid values. default + min + max', () => {
      const right = jest.fn();

      const propName: keyof FormValues = 'valueNull';

      formProps.register(propName, typeName, {
        min: 1,
        max: 5000,
      });

      validValues
        .filter(
          (v) =>
            !stateFormIsValueInnerEmpty(v) &&
            (v as StateFormNumberType['value']) >= 1 &&
            (v as StateFormNumberType['value']) <= 10,
        )
        .forEach((value) => {
          formProps.setValue(propName, value);

          formProps.onSubmit((data) => {
            right(data);
          })();

          expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: value });

          right.mockClear();
        });
    });

    it('test valid values. required + min + max', () => {
      const right = jest.fn();

      const propName: keyof FormValues = 'valueNull';

      formProps.register(propName, typeName, {
        required: true,
        min: 1,
        max: 5000,
      });

      validValues
        .filter(
          (v) =>
            !stateFormIsValueInnerEmpty(v) &&
            (v as StateFormNumberType['value']) >= 1 &&
            (v as StateFormNumberType['value']) <= 10,
        )
        .forEach((value) => {
          formProps.setValue(propName, value);

          formProps.onSubmit((data) => {
            right(data);
          })();

          expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: value });

          right.mockClear();
        });
    });

    it('test invalid values', () => {
      const left = jest.fn();

      const propName: keyof FormValues = 'valueNull';

      formProps.register(propName, typeName);

      invalidValues.forEach((value) => {
        formProps.setValue(propName, value);

        formProps.onSubmit(() => null, left)();

        expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsCommonInvalidMessage));

        left.mockClear();
      });
    });

    it('test invalid values. required', () => {
      const left = jest.fn();

      const propName: keyof FormValues = 'valueNull';

      formProps.register(propName, typeName, {
        required: true,
      });

      invalidValues.forEach((value) => {
        formProps.setValue(propName, value);

        formProps.onSubmit(() => null, left)();

        expect(left).toHaveBeenCalledWith(getValidateErrorWithProp(propName, stateFormErrorsRequiredMessage));

        left.mockClear();
      });
    });

    it('test invalid values. required + min', () => {
      const left = jest.fn();

      const propName: keyof FormValues = 'valueNull';

      formProps.register(propName, typeName, {
        required: true,
        min: 1,
      });

      [-500, -5, 0].forEach((value) => {
        formProps.setValue(propName, value);

        formProps.onSubmit(() => null, left)();

        expect(left).toHaveBeenCalledWith({
          [propName]: [{ type: 'validate', message: stateFormErrorsNumberMinMessage }],
        });

        left.mockClear();
      });
    });

    it('test invalid values. required + max', () => {
      const left = jest.fn();

      const propName: keyof FormValues = 'valueNull';

      formProps.register(propName, typeName, {
        required: true,
        max: 50,
      });

      [51, 500].forEach((value) => {
        formProps.setValue(propName, value);

        formProps.onSubmit(() => null, left)();

        expect(left).toHaveBeenCalledWith({
          [propName]: [{ type: 'validate', message: stateFormErrorsNumberMaxMessage }],
        });

        left.mockClear();
      });
    });
  });

  it('submit disabled', () => {
    const propName: keyof FormValues = 'valueSet';

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

  it('console errors check (should be the last test)', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
