import { renderHook } from '@testing-library/react';

import { StateFormReturnType, useStateForm } from 'src/utils/stateForm';
import { baseLeftTestChecker, baseRightTestChecker } from 'src/utils/stateForm/dataTypes/baseTests';
import {
  StateFormDateRangeType,
  stateFormErrorsDateRangeMaxMessage,
  stateFormErrorsDateRangeMinMessage,
} from 'src/utils/stateForm/dataTypes/dateRange/index';
import {
  stateFormErrorsCommonInvalidMessage,
  stateFormErrorsRequiredMessage,
} from 'src/utils/stateForm/helpers/formStateGenerateErrors';
import { stateFormEmptyValues, StateFormEmptyValueType, stateFormIsValueInnerEmpty } from 'src/utils/stateForm/types';

const typeName = 'dateRange';

describe(typeName, () => {
  console.error = jest.fn();

  type FormValues = {
    dateRangeValue: StateFormDateRangeType['value'] | StateFormEmptyValueType;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    dateRangeValue: null,
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

  describe('simple validity', () => {
    const possibleValidValues: (StateFormDateRangeType['value'] | StateFormEmptyValueType)[] = [
      [new Date(), new Date()],
      [new Date(1), new Date(1)],
      [new Date(1e7), new Date(1e7)],
      [new Date(-5e4), new Date(-5e4)],
      ...stateFormEmptyValues,
    ];

    const invalidValues = [1, '', 'a', true]; // any not dates

    const invalidRangeValues = [new Date(), [new Date()]]; // wrong number of values (validator takes only first 2)

    const validChecker = baseRightTestChecker<FormValues>('dateRangeValue', typeName);

    const invalidChecker = baseLeftTestChecker<FormValues>('dateRangeValue', typeName);

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

    it('test valid values. default + minDate + maxDate', () => {
      const minDate = new Date(5e7);
      const maxDate = new Date(8e7);

      validChecker({
        formProps,
        values: [[new Date(6e7), new Date(5e7)]],
        registerOptions: {
          minDate,
          maxDate,
        },
      });
    });

    it('test valid values. required + minDate + maxDate', () => {
      const minDate = new Date(5e7);
      const maxDate = new Date(8e7);

      validChecker({
        formProps,
        values: [[new Date(6e7), new Date(5e7)]],
        registerOptions: {
          minDate,
          maxDate,
        },
      });
    });

    it('test invalid wrong-type values', () => {
      invalidChecker({ formProps, values: invalidValues, errorMessage: stateFormErrorsCommonInvalidMessage });
    });

    it('test invalid range values', () => {
      invalidChecker({ formProps, values: invalidRangeValues, errorMessage: stateFormErrorsCommonInvalidMessage });
    });

    it('test invalid wrong-type values. required', () => {
      invalidChecker({
        formProps,
        values: invalidValues,
        registerOptions: {
          required: true,
        },
        errorMessage: stateFormErrorsRequiredMessage,
      });
    });

    it('test invalid range values. required', () => {
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
      const minDate = new Date(5e7);

      invalidChecker({
        formProps,
        values: [[new Date(100), new Date(499)]],
        registerOptions: {
          required: true,
          minDate,
        },
        errorMessage: stateFormErrorsDateRangeMinMessage,
      });
    });

    it('test invalid values. required + maxDate', () => {
      const maxDate = new Date(500);

      invalidChecker({
        formProps,
        values: [[new Date(501), new Date()]],
        registerOptions: {
          required: true,
          maxDate,
        },
        errorMessage: stateFormErrorsDateRangeMaxMessage,
      });
    });
  });

  it('submit disabled', () => {
    const propName: keyof FormValues = 'dateRangeValue';

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

  it('console errors check (should be the last test)', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
