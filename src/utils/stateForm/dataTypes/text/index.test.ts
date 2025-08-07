import { renderHook } from '@testing-library/react';
import { baseLeftTestChecker, baseRightTestChecker } from 'src/utils/stateForm/dataTypes/baseTests';

import { stateFormEmptyValues, StateFormEmptyValueType, isStateFormValueEmpty } from 'src/utils/stateForm/types';
import {
  stateFormErrorsCommonInvalidMessage,
  stateFormErrorsRequiredMessage,
} from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../';
import {
  stateFormErrorsTextMaxLengthMessage,
  stateFormErrorsTextMinLengthMessage,
  StateFormTextType,
} from 'src/utils/stateForm/dataTypes/text';

const typeName = 'text';

describe('text + textarea', () => {
  console.error = jest.fn();

  type FormValues = {
    strValue: StateFormTextType['value'] | StateFormEmptyValueType;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    strValue: null,
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
    const possibleValidValues: (StateFormTextType['value'] | StateFormEmptyValueType)[] = [
      '1',
      '!@#$%^&*()_+-=',
      '              1        ',
      'aloALO',
      ...stateFormEmptyValues,
    ];

    const invalidValues = [Infinity, -Infinity, NaN, '', true]; // any not string

    const validChecker = baseRightTestChecker<FormValues>('strValue', typeName);

    const invalidChecker = baseLeftTestChecker<FormValues>('strValue', typeName);

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

    it('test valid values. default + minLength + maxLength', () => {
      const minLength = 1;
      const maxLength = 10;

      validChecker({
        formProps,
        values: possibleValidValues.filter(
          (v) =>
            !isStateFormValueEmpty(v) &&
            (v as StateFormTextType['value']).length >= minLength &&
            (v as StateFormTextType['value']).length <= maxLength,
        ),
        registerOptions: {
          minLength,
          maxLength,
        },
      });
    });

    it('test valid values. required + minLength + maxLength', () => {
      const minLength = 1;
      const maxLength = 10;

      validChecker({
        formProps,
        values: possibleValidValues.filter(
          (v) =>
            !isStateFormValueEmpty(v) &&
            (v as StateFormTextType['value']).length >= minLength &&
            (v as StateFormTextType['value']).length <= maxLength,
        ),
        registerOptions: {
          required: true,
          minLength,
          maxLength,
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

    it('test invalid values. required + minLength', () => {
      const minLength = 10;

      invalidChecker({
        formProps,
        values: possibleValidValues.filter((v) => v && v.trim().length < minLength),
        registerOptions: {
          required: true,
          minLength,
        },
        errorMessage: stateFormErrorsTextMinLengthMessage,
      });
    });

    it('test invalid values. required + maxLength', () => {
      const maxLength = 2;

      invalidChecker({
        formProps,
        values: possibleValidValues.filter((v) => v && v.trim().length > maxLength),
        registerOptions: {
          required: true,
          maxLength,
        },
        errorMessage: stateFormErrorsTextMaxLengthMessage,
      });
    });
  });

  it('submit disabled', () => {
    const propName: keyof FormValues = 'strValue';

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
