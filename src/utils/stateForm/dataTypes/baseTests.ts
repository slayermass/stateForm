import { SafeAnyType } from 'src/utils/safeAny';

import { StateFormDataTypesFieldsType } from '../setDataTypes';
import { StateFormReturnType } from '..';
import { StateFormRegisterOptions, StateFormUnknownFormType } from '../types';

export const baseRightTestChecker =
  <R extends StateFormUnknownFormType>(propName: keyof R, type: StateFormDataTypesFieldsType, initialState?: R) =>
  ({
    formProps,
    values,
    registerOptions,
  }: {
    formProps: StateFormReturnType<R>;
    values: SafeAnyType[];
    registerOptions?: StateFormRegisterOptions;
  }) => {
    const right = jest.fn();

    formProps.register(propName as string, type, registerOptions);

    values.forEach((value) => {
      formProps.setValue(propName as SafeAnyType, value);

      formProps.onSubmit((data) => {
        right(data);
      })();

      expect(right).toHaveBeenCalledWith({ ...initialState, [propName]: value });

      right.mockClear();
    });
  };

export const baseLeftTestChecker =
  <R extends StateFormUnknownFormType>(propName: keyof R, type: StateFormDataTypesFieldsType) =>
  ({
    formProps,
    values,
    registerOptions,
    errorMessage,
  }: {
    formProps: StateFormReturnType<R>;
    values: SafeAnyType[];
    errorMessage: string;
    registerOptions?: StateFormRegisterOptions;
  }) => {
    const left = jest.fn();

    formProps.register(propName as string, type, registerOptions);

    values.forEach((value) => {
      formProps.setValue(propName as SafeAnyType, value);

      formProps.onSubmit(() => null, left)();

      expect(left).toHaveBeenCalledWith({
        [propName]: [{ type: 'validate', message: errorMessage }],
      });

      left.mockClear();
    });
  };
