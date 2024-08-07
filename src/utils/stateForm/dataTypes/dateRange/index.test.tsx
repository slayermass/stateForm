import { renderHook } from '@testing-library/react';
import { SafeAnyType } from 'src/utils/safeAny';

import { StateFormReturnType, useStateForm } from 'src/utils/stateForm';
import {
  StateFormDateRangeType,
  stateFormErrorsDateRangeMaxMessage,
  stateFormErrorsDateRangeMinMessage,
} from 'src/utils/stateForm/dataTypes/dateRange/index';
import { stateFormErrorsRequiredMessage } from 'src/utils/stateForm/helpers/formStateGenerateErrors';
import { StateFormEmptyValueType } from 'src/utils/stateForm/types';

const typeName = 'dateRange';

describe(typeName, () => {
  console.error = jest.fn();

  type FormValues = {
    dateRangeValue0: StateFormDateRangeType['value'] | StateFormEmptyValueType;
  };

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    dateRangeValue0: null,
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

  it('init', () => {
    expect(formProps.getValue()).toEqual(initialProps);
  });

  it('submit changed values', () => {
    const right = jest.fn();
    const left = jest.fn();

    const newValues: FormValues = {
      dateRangeValue0: [new Date(), new Date()],
    };

    Object.keys(newValues).forEach((propName) => {
      formProps.register(propName, typeName, {
        required: true,
      });
    });

    formProps.setValue(newValues);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith(newValues);
    expect(left).not.toHaveBeenCalled();
  });

  it('getErrors. required empty multiple', () => {
    const propNames: Array<keyof FormValues> = ['dateRangeValue0'];

    propNames.forEach((propName) => {
      formProps.register(propName, typeName, {
        required: true,
      });

      formProps.setValue(propName as keyof FormValues, null);
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propNames[0]]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
    });

    expect(formProps.getErrors(propNames as (keyof FormValues)[])).toEqual([
      [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
    ]);
  });

  it('getErrors. not required empty multiple', () => {
    const propNames: Array<keyof FormValues> = ['dateRangeValue0'];

    propNames.forEach((propName) => {
      formProps.register(propName, typeName);

      formProps.setValue(propName as keyof FormValues, null);
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.onSubmit(right, left)();

    expect(right).toHaveBeenCalled();

    expect(formProps.getErrors(propNames as (keyof FormValues)[])).toEqual([[]]);
  });

  it('required. set only one date', () => {
    const propName: keyof FormValues = 'dateRangeValue0';

    formProps.register(propName, typeName, {
      required: true,
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.setValue(propName, new Date());

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsRequiredMessage }],
    });
  });

  it('required. set many dates', () => {
    const propName: keyof FormValues = 'dateRangeValue0';

    formProps.register(propName, typeName, {
      required: true,
    });

    const right = jest.fn();
    const left = jest.fn();

    const valueToSet = [new Date(), new Date(), new Date(), new Date()] as SafeAnyType;

    formProps.setValue(propName, valueToSet);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith({ [propName]: valueToSet });
    expect(left).not.toHaveBeenCalled();
  });

  it('required + minDate', () => {
    const propName: keyof FormValues = 'dateRangeValue0';

    formProps.register(propName, typeName, {
      required: true,
      minDate: new Date(5e7),
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.setValue(propName, [new Date(3e7), new Date(5e7)]);

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsDateRangeMinMessage }],
    });

    right.mockClear();
    left.mockClear();

    // valid value
    const validValue: StateFormDateRangeType['value'] = [new Date(6e7), new Date(5e7)];
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('not required + minDate', () => {
    const propName: keyof FormValues = 'dateRangeValue0';

    formProps.register(propName, typeName, {
      minDate: new Date(5e7),
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.setValue(propName, [new Date(3e7), new Date(5e7)]);

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsDateRangeMinMessage }],
    });

    right.mockClear();
    left.mockClear();

    // valid value
    const validValue: StateFormDateRangeType['value'] = [new Date(6e7), new Date(5e7)];
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('required + maxDate', () => {
    const propName: keyof FormValues = 'dateRangeValue0';

    formProps.register(propName, typeName, {
      required: true,
      maxDate: new Date(1e12),
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.setValue(propName, [new Date(1e13), new Date(1e12)]);

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsDateRangeMaxMessage }],
    });

    right.mockClear();
    left.mockClear();

    // valid value
    const validValue: StateFormDateRangeType['value'] = [new Date(1e12), new Date(1e10)];
    formProps.setValue(propName, validValue);

    formProps.onSubmit((data) => {
      right(data);
    }, left)();

    expect(right).toHaveBeenCalledWith({ ...initialProps, [propName]: validValue });
    expect(left).not.toHaveBeenCalled();
  });

  it('not required + maxDate', () => {
    const propName: keyof FormValues = 'dateRangeValue0';

    formProps.register(propName, typeName, {
      maxDate: new Date(1e12),
    });

    const right = jest.fn();
    const left = jest.fn();

    formProps.setValue(propName, [new Date(1e13), new Date(1e12)]);

    formProps.onSubmit(right, left)();

    expect(right).not.toHaveBeenCalled();
    expect(left).toHaveBeenCalledWith({
      [propName]: [{ type: 'validate', message: stateFormErrorsDateRangeMaxMessage }],
    });

    right.mockClear();
    left.mockClear();

    // valid value
    const validValue: StateFormDateRangeType['value'] = [new Date(1e12), new Date(1e10)];
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
