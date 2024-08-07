import { renderHook } from '@testing-library/react';
import { StateFormRichTextType } from 'src/utils/stateForm/dataTypes/richText/index';
import { StateFormEmptyValueType } from 'src/utils/stateForm/types';

import {
  stateFormErrorsCommonInvalidMessage,
  stateFormErrorsRequiredMessage,
} from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../index';

describe('richText', () => {
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

  it('form empty values', () => {
    const right = jest.fn();
    const left = jest.fn();

    const propName = 'richTextValue';

    formProps.register(propName, 'richText', {
      required: true,
    });

    [null, undefined].forEach((value) => {
      formProps.setValue(propName, value);

      formProps.onSubmit((data) => {
        right(data);
      }, left)();

      expect(right).not.toHaveBeenCalled();
      expect(left).toHaveBeenCalledWith({
        [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
      });
    });
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
      richTextValue: '<p>popa</p>',
    };

    formProps.setValue(newValues);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith(newValues);
    expect(left).not.toHaveBeenCalled();
  });

  it('required empty', () => {
    const propName = 'richTextValue';

    formProps.register(propName, 'richText', {
      required: true,
    });

    formProps.setValue(propName, '');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }] });

    expect(formProps.getErrors(propName)).toEqual([{ type: 'validate', message: stateFormErrorsRequiredMessage }]);
  });

  it('required empty length', () => {
    const propName = 'richTextValue';

    formProps.register(propName, 'richText', {
      required: true,
    });

    formProps.setValue(propName, '                ');

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }] });

    expect(formProps.getErrors(propName)).toEqual([{ type: 'validate', message: stateFormErrorsRequiredMessage }]);
  });

  it('required invalid', () => {
    const propName = 'richTextValue';

    formProps.register(propName, 'richText', {
      required: true,
    });

    // invalid html
    ['<h1>j</p>', '<h1>j</h1><h2>', '<p>', '1v11v<h1>', '123<p></p>34'].forEach((value) => {
      formProps.setValue(propName, value);

      const right = jest.fn();
      const left = jest.fn();

      formProps.onSubmit(right, left)();

      expect(right).not.toHaveBeenCalled();
      expect(left).toHaveBeenCalledWith({
        [propName]: [{ type: 'validate', message: stateFormErrorsCommonInvalidMessage }],
      });
    });

    // valid again
    const newValues = {
      [propName]: '<h1>j</h1>',
    };
    formProps.setValue(newValues);

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith(newValues);
    expect(left).not.toHaveBeenCalled();
  });

  it('console errors check (should be the last test)', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
