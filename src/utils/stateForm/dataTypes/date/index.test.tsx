import { renderHook } from '@testing-library/react';

import { baseLeftTestChecker, baseRightTestChecker } from 'src/utils/stateForm/dataTypes/baseTests';
import { stateFormEmptyValues, StateFormEmptyValueType, isStateFormValueEmpty } from 'src/utils/stateForm/types';
import {
  stateFormErrorsCommonInvalidMessage,
  stateFormErrorsRequiredMessage,
} from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../index';
import {
  StateFormDateType,
  stateFormErrorsDateMaxMessage,
  stateFormErrorsDateMinMessage,
} from 'src/utils/stateForm/dataTypes/date/index';

const typeName = 'date';

describe(typeName, () => {
  console.error = jest.fn();

  type FormValues = {
    dateValue: StateFormDateType['value'] | StateFormEmptyValueType;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    dateValue: null,
  };

  beforeEach(() => {
    const {
      result: { current },
    } = renderHook(
      (defaultValues) =>
        useStateForm<FormValues>({
          defaultValues,
          typeCheckOnSetValue: false,
        }),
      {
        initialProps,
      },
    );

    formProps = current;
  });

  describe('simple validity', () => {
    const possibleValidValues: (StateFormDateType['value'] | StateFormEmptyValueType)[] = [
      new Date(),
      new Date(1),
      new Date(1e7),
      new Date(-5e4),
      ...stateFormEmptyValues,
    ];

    const invalidValues = [1, '', 'a', true]; // any not dates

    const validChecker = baseRightTestChecker<FormValues>('dateValue', typeName);

    const invalidChecker = baseLeftTestChecker<FormValues>('dateValue', typeName);

    it('test valid values. default', () => {
      validChecker({ formProps, values: possibleValidValues });
    });

    it('test valid values. required', () => {
      validChecker({
        formProps,
        values: possibleValidValues.filter((v) => !isStateFormValueEmpty(v)),
        registerOptions: {
          required: true,
        },
      });
    });

    it('test valid values. default + minDate + maxDate', () => {
      const minDate = new Date(100);
      const maxDate = new Date(1e8);

      validChecker({
        formProps,
        values: possibleValidValues.filter(
          (v) =>
            !isStateFormValueEmpty(v) &&
            (v as StateFormDateType['value']) >= minDate &&
            (v as StateFormDateType['value']) <= maxDate,
        ),
        registerOptions: {
          minDate,
          maxDate,
        },
      });
    });

    it('test valid values. required + minDate + maxDate', () => {
      const minDate = new Date(100);
      const maxDate = new Date(1e8);

      validChecker({
        formProps,
        values: possibleValidValues.filter(
          (v) =>
            !isStateFormValueEmpty(v) &&
            (v as StateFormDateType['value']) >= minDate &&
            (v as StateFormDateType['value']) <= maxDate,
        ),
        registerOptions: {
          required: true,
          minDate,
          maxDate,
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

    it('test invalid values. required + minDate', () => {
      const minDate = new Date(500);

      invalidChecker({
        formProps,
        values: [new Date(100), new Date(499)],
        registerOptions: {
          required: true,
          minDate,
        },
        errorMessage: stateFormErrorsDateMinMessage,
      });
    });

    it('test invalid values. required + maxDate', () => {
      const maxDate = new Date(500);

      invalidChecker({
        formProps,
        values: [new Date(501), new Date()],
        registerOptions: {
          required: true,
          maxDate,
        },
        errorMessage: stateFormErrorsDateMaxMessage,
      });
    });
  });

  it('submit disabled', () => {
    const propName: keyof FormValues = 'dateValue';

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

  it('required + minDate + minDateMessage', () => {
    const propName: keyof FormValues = 'dateValue';
    const minDateMessage = 'HALU';

    formProps.register(propName, typeName, {
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

  it('required + maxDate + maxDateMessage', () => {
    const propName: keyof FormValues = 'dateValue';
    const maxDateMessage = 'wronngnsa!!@#@#!@#';

    formProps.register(propName, typeName, {
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
