import { renderHook } from '@testing-library/react';

import { baseLeftTestChecker, baseRightTestChecker } from 'src/utils/stateForm/dataTypes/baseTests';
import { stateFormEmptyValues, StateFormEmptyValueType, isStateFormValueEmpty } from 'src/utils/stateForm/types';

import {
  StateFormEmailType,
  stateFormErrorsEmailMaxLengthMessage,
  stateFormErrorsEmailMinLengthMessage,
} from './index';
import {
  stateFormErrorsCommonInvalidMessage,
  stateFormErrorsRequiredMessage,
} from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../index';

const typeName = 'email';

describe(typeName, () => {
  console.error = jest.fn();

  type FormValues = {
    emailValue: StateFormEmailType['value'] | StateFormEmptyValueType;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    emailValue: null,
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
    const possibleValidValues: (StateFormEmailType['value'] | StateFormEmptyValueType)[] = [
      'y@y.ru',
      'vavavy@y.rub',
      ...stateFormEmptyValues,
    ];

    const invalidValues = ['alo', '1234@', 'y#y.eu', 'y@y.r', '1', '', Infinity, -Infinity, NaN, true]; // any not emails

    const validChecker = baseRightTestChecker<FormValues>('emailValue', typeName, initialProps);

    const invalidChecker = baseLeftTestChecker<FormValues>('emailValue', typeName);

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
            (v as StateFormEmailType['value']).length >= minLength &&
            (v as StateFormEmailType['value']).length <= maxLength,
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
            (v as StateFormEmailType['value']).length >= minLength &&
            (v as StateFormEmailType['value']).length <= maxLength,
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
        errorMessage: stateFormErrorsEmailMinLengthMessage,
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
        errorMessage: stateFormErrorsEmailMaxLengthMessage,
      });
    });
  });

  it('submit disabled', () => {
    const propName: keyof FormValues = 'emailValue';

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
