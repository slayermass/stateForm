import { renderHook } from '@testing-library/react';

import { baseLeftTestChecker, baseRightTestChecker } from 'src/utils/stateForm/dataTypes/baseTests';
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
    valueZero: StateFormNumberType['value'] | StateFormEmptyValueType;
    valueNull: StateFormNumberType['value'] | StateFormEmptyValueType;
    valueSet: StateFormNumberType['value'] | StateFormEmptyValueType;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    valueZero: 0,
    valueNull: null,
    valueSet: 100,
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

  describe('simple validity', () => {
    // "-0" comes "0"
    const possibleValidValues = [
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

    const invalidValues = [Infinity, -Infinity, NaN, '', 'a', true]; // any not numbers

    const validChecker = baseRightTestChecker<FormValues>('valueNull', typeName, initialProps);

    const invalidChecker = baseLeftTestChecker<FormValues>('valueNull', typeName);

    it('test valid values. default', () => {
      validChecker({ formProps, values: possibleValidValues });
    });

    it('test valid values. required', () => {
      validChecker({
        formProps,
        values: possibleValidValues.filter((v) => !stateFormIsValueInnerEmpty(v)),
        registerOptions: {
          required: true,
        },
      });
    });

    it('test valid values. default + min + max', () => {
      const min = 1;
      const max = 5000;

      validChecker({
        formProps,
        values: possibleValidValues.filter(
          (v) =>
            !stateFormIsValueInnerEmpty(v) &&
            (v as StateFormNumberType['value']) >= min &&
            (v as StateFormNumberType['value']) <= max,
        ),
        registerOptions: {
          min,
          max,
        },
      });
    });

    it('test valid values. required + min + max', () => {
      const min = 1;
      const max = 5000;

      validChecker({
        formProps,
        values: possibleValidValues.filter(
          (v) =>
            !stateFormIsValueInnerEmpty(v) &&
            (v as StateFormNumberType['value']) >= min &&
            (v as StateFormNumberType['value']) <= max,
        ),
        registerOptions: {
          required: true,
          min,
          max,
        },
      });
    });

    it('test invalid values', () => {
      invalidChecker({ formProps, values: invalidValues, errorMessage: stateFormErrorsCommonInvalidMessage });
    });

    it('test invalid values. required', () => {
      invalidChecker({
        formProps,
        values: invalidValues,
        registerOptions: {
          required: true,
        },
        errorMessage: stateFormErrorsRequiredMessage,
      });
    });

    it('test invalid values. required + min', () => {
      const min = 1;

      invalidChecker({
        formProps,
        values: [-500, -5, 0],
        registerOptions: {
          required: true,
          min,
        },
        errorMessage: stateFormErrorsNumberMinMessage,
      });
    });

    it('test invalid values. required + max', () => {
      const max = 50;

      invalidChecker({
        formProps,
        values: [51, 500],
        registerOptions: {
          required: true,
          max,
        },
        errorMessage: stateFormErrorsNumberMaxMessage,
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
