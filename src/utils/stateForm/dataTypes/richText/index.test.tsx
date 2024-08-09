import { renderHook } from '@testing-library/react';

import { baseLeftTestChecker, baseRightTestChecker } from 'src/utils/stateForm/dataTypes/baseTests';
import { StateFormRichTextType } from 'src/utils/stateForm/dataTypes/richText/index';
import { stateFormEmptyValues, StateFormEmptyValueType, stateFormIsValueInnerEmpty } from 'src/utils/stateForm/types';

import {
  stateFormErrorsCommonInvalidMessage,
  stateFormErrorsRequiredMessage,
} from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../index';

const typeName = 'richText';

describe(typeName, () => {
  console.error = jest.fn();

  type FormValues = {
    richTextValue: StateFormRichTextType['value'] | StateFormEmptyValueType;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    richTextValue: '<h1>hello</h1>',
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
    const possibleValidValues: (StateFormRichTextType['value'] | StateFormEmptyValueType)[] = [
      '<p>alo</p>',
      ...stateFormEmptyValues,
    ];

    const invalidValues = [Infinity, -Infinity, NaN, '', true]; // any not strings

    const invalidHtmlValues = ['<p>1<>', 'aavava</h>']; // any invalid html

    const validChecker = baseRightTestChecker<FormValues>('richTextValue', typeName);

    const invalidChecker = baseLeftTestChecker<FormValues>('richTextValue', typeName);

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

    it('test invalid values', () => {
      invalidChecker({ formProps, values: invalidValues, errorMessage: stateFormErrorsCommonInvalidMessage });
    });

    it('test wrong-type values. required', () => {
      invalidChecker({
        formProps,
        values: invalidValues,
        registerOptions: {
          required: true,
        },
        errorMessage: stateFormErrorsRequiredMessage,
      });
    });

    it('test invalid html values. required', () => {
      invalidChecker({
        formProps,
        values: invalidHtmlValues,
        registerOptions: {
          required: true,
        },
        errorMessage: stateFormErrorsCommonInvalidMessage,
      });
    });
  });

  it('console errors check (should be the last test)', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
