import { renderHook } from '@testing-library/react';

import { baseLeftTestChecker, baseRightTestChecker } from 'src/utils/stateForm/dataTypes/baseTests';
import {
  stateFormErrorsCommonInvalidMessage,
  stateFormErrorsRequiredMessage,
} from 'src/utils/stateForm/helpers/formStateGenerateErrors';
import { stateFormEmptyValues, StateFormEmptyValueType, isStateFormValueEmpty } from 'src/utils/stateForm/types';

import { StateFormCheckBoxGroupType } from './index';
import { StateFormReturnType, useStateForm } from '../../index';

const typeName = 'checkBoxGroup';

describe(typeName, () => {
  console.error = jest.fn();

  type FormValues = {
    checkValue: StateFormCheckBoxGroupType['value'] | StateFormEmptyValueType;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    checkValue: null,
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
    const possibleValidValues: (StateFormCheckBoxGroupType['value'] | StateFormEmptyValueType)[] = [
      true,
      false,
      ...stateFormEmptyValues,
    ];

    const invalidValues = [Infinity, -Infinity, NaN, '', 'a']; // any not boolean

    const validChecker = baseRightTestChecker<FormValues>('checkValue', typeName, initialProps);

    const invalidChecker = baseLeftTestChecker<FormValues>('checkValue', typeName);

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
  });

  it('submit disabled', () => {
    const propName: keyof FormValues = 'checkValue';

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
