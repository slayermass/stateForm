import { renderHook } from '@testing-library/react';

import { stateFormErrorsRequiredMessage } from '../../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../../index';

describe('richText', () => {
  console.error = jest.fn();

  type FormValues = {
    richTextValue: string;
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

  it('submit the same values', () => {
    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toBeCalledWith(initialProps);
    expect(left).not.toBeCalled();
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

    expect(right).toBeCalledWith(newValues);
    expect(left).not.toBeCalled();
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

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }] });

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

    expect(right).not.toBeCalled();
    expect(left).toBeCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }] });

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

      expect(right).not.toBeCalled();
      expect(left).toBeCalledWith({ [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }] });
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

    expect(right).toBeCalledWith(newValues);
    expect(left).not.toBeCalled();
  });

  it('console errors check (should be the last test)', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
