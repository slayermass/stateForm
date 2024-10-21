import { SyntheticEvent } from 'react';
import { SafeAnyType } from 'src/utils/safeAny';
import { EventBusFieldEventType, EventBusReturnType } from 'src/utils/stateForm/eventBus';
import {
  StateFormDataTypesFieldsType,
  StateFormDataTypesSpecificPropertiesType,
  StateFormPossibleValue,
} from 'src/utils/stateForm/setDataTypes';
import { StateFormPath, StateFormPathValue, StateFormPathValues } from 'src/utils/stateForm/types/path';
import { DeepPartial } from 'src/utils/types';

export type NullableUndefinable<T> = {
  [K in keyof T]?: NullableUndefinable<T[K]> | null;
};

export type StateFormSpread<T> = NullableUndefinable<{
  [Property in keyof T]: T[Property];
}>;

/**
 * @example
 *
 * type FormValues = StateFormFormType<{
 *   test: string;
 * }>;
 */
export type StateFormFormType<T> = StateFormSpread<T>;

export type StateFormEmptyValueType = null | undefined;

export const stateFormEmptyValues: StateFormEmptyValueType[] = [null, undefined];

export const stateFormIsValueInnerEmpty = (value: SafeAnyType): boolean => {
  for (let i = 0; i < stateFormEmptyValues.length; i += 1) {
    if (stateFormEmptyValues[i] === value) {
      return true;
    }
  }

  return false;
};

type ErrorsType = { type: StateFormErrorTypes; message: string; initChange?: boolean }[] | StateFormEmptyValueType;

export type StateFormDefinedErrorsType = NonNullable<ErrorsType>;

export type StateFormFieldOptionValue = {
  type: StateFormFieldsType;
  active: boolean;
  options: StateFormInputOptionsType;
  isDirty: boolean;
  ref?: HTMLElement | null;
};

export type StateFormFieldsOptions = Record<string, StateFormFieldOptionValue>;

/**
 * error type may be any string but these are default types which are used in the form
 *
 * validate - for default validation errors (required ...)
 * hover    - only for hover errors
 */
export type StateFormErrorTypes = 'hover' | 'validate' | 'all' | string;

/** --- return types --- */

// export type StateFormErrors = { [s: string]: StateFormDefinedErrorsType };
export type StateFormErrors = Record<string, StateFormDefinedErrorsType>;

export type StateFormOnSubmitType<FormValues> = (
  right: (d: FormValues, status: StateFormGetStatusValue) => void,
  left?: (e: StateFormErrors) => void,
) => (e?: SyntheticEvent) => void;

export type StateFormInputOptionsType = {
  required?: boolean;
  disabled?: boolean;

  initChange?: true; // creates errors for every input when started; inner usage

  requiredMessage?: string;
  // true is OK, false is a validate error; string is a custom error
  validate?: (value: StateFormPossibleValue) => boolean | string;
  changedInitialValue?: (value: StateFormPossibleValue) => StateFormPossibleValue;
  errorLabel?: string;

  trigger?: boolean;
  stayAliveAfterUnregister?: boolean;
} & StateFormDataTypesSpecificPropertiesType;

export type StateFormOnChange = (
  name: string,
  value: StateFormPossibleValue,
  options?: StateFormSetValueOptions,
) => void;

export type StateFormOnBlur = (name: string, options?: StateFormInputOptionsType) => void;

export type StateFormUnknownFormType = Record<SafeAnyType, SafeAnyType>;

export type StateFormGetErrorsByName<FormValues extends StateFormUnknownFormType = SafeAnyType> = {
  <FieldName extends StateFormPath<FormValues>>(fieldName: FieldName): StateFormDefinedErrorsType;
  <FieldNames extends StateFormPath<FormValues>[]>(fieldNames: FieldNames): StateFormDefinedErrorsType[];
};

export type StateFormInnerGetValue<FormValues extends StateFormUnknownFormType = SafeAnyType> = <
  FieldName extends StateFormPath<FormValues>,
>(
  property: FieldName,
) => StateFormPathValue<FormValues, FieldName>;

export type StateFormGetValue<FormValues extends StateFormUnknownFormType = SafeAnyType> = {
  (): FormValues;
  <FieldName extends StateFormPath<FormValues>>(fieldName: FieldName): StateFormPathValue<FormValues, FieldName>;
  <FieldNames extends StateFormPath<FormValues>[]>(
    fieldNames: [...FieldNames],
  ): [...StateFormPathValues<FormValues, FieldNames>];
};

export type StateFormTrigger<FormValues extends StateFormUnknownFormType = SafeAnyType> = {
  (): void;
  <FieldName extends StateFormPath<FormValues>>(fieldName: FieldName): void;
  <FieldNames extends StateFormPath<FormValues>[]>(fieldNames: FieldNames): void;
};

export type StateFormClearTypes = (name: string, type?: StateFormErrorTypes) => void;

export type StateFormSetError<FormValues extends StateFormUnknownFormType = SafeAnyType> = (
  name: StateFormPath<FormValues>,
  error: StateFormDefinedErrorsType[0] | string,
  initChange?: boolean,
) => void;

export type StateFormSetValueOptions = { trigger?: boolean; merge?: boolean; _afterRegister?: boolean };

export type StateFormSetMultipleValueOptions = StateFormSetValueOptions & { prefix?: string };

export type StateFormSetValue<FormValues extends StateFormUnknownFormType = SafeAnyType> = {
  (
    name: StateFormPath<FormValues>,
    value: StateFormPathValue<FormValues, StateFormPath<FormValues>> | StateFormPossibleValue,
    options?: StateFormSetValueOptions,
  ): void;
  (
    values: Partial<
      Record<
        StateFormPath<FormValues>,
        StateFormPathValue<FormValues, StateFormPath<FormValues>> | StateFormPossibleValue
      >
    >,
    options?: StateFormSetMultipleValueOptions,
  ): void;
};

export type StateFormRegisterOptions = Exclude<StateFormInputOptionsType, 'initChange'>;

export type StateFormRegister = (name: string, type: StateFormFieldsType, options?: StateFormRegisterOptions) => void;

export type StateFormUnregister = (name: string) => void;

export type StateFormSubscribeFn = (
  callback: (value: SafeAnyType, fieldName: string) => void,
) => ReturnType<EventBusReturnType['on']>[];

// TODO: make dependent on eventType prop
type StateFormSubscribeDefaultValue = SafeAnyType;

export type StateFormGetSubscribeProps = (
  eventType: EventBusFieldEventType,
  names?: string | string[],
) => [StateFormSubscribeFn, StateFormSubscribeDefaultValue];

export type StateFormSubscribeType<FormValues extends StateFormUnknownFormType = SafeAnyType> = <
  FieldName extends StateFormPath<FormValues>,
>(
  fieldName?: FieldName,
) => {
  on: (callback: (value: StateFormPathValue<FormValues, FieldName>) => void) => ReturnType<EventBusReturnType['on']>;
  onError: (callback: (error: StateFormDefinedErrorsType) => void) => ReturnType<EventBusReturnType['on']>;
};

export type StateFormSubscribeMultipleType<FormValues extends StateFormUnknownFormType = SafeAnyType> = <
  FieldNames extends StateFormPath<FormValues>[],
>(
  fieldNames: [...FieldNames],
) => {
  on: (
    callback: (values: [...StateFormPathValues<FormValues, FieldNames>]) => void,
  ) => ReturnType<EventBusReturnType['on']>;
  onError: (callback: (error: StateFormDefinedErrorsType[]) => void) => ReturnType<EventBusReturnType['on']>;
};

export type StateFormFieldsType = StateFormDataTypesFieldsType;

export type StateFormReset<FormValues = SafeAnyType> = (
  values?: DeepPartial<FormValues>,
  options?: { trigger?: boolean; resetInitialForm?: boolean; mergeWithPreviousState?: boolean },
) => void;

export type StateFormSetRef = (name: string) => (element: HTMLElement | null) => void;

export type StateFormGetDirtyFields = () => string[];

export type StateFormGetStatusValue = { isDirty: boolean };

export type StateFormGetStatus = () => StateFormGetStatusValue;

export type StateFormChangeStateDirectly = (
  name: string,
  value: SafeAnyType,
  options?: {
    fromFormFieldArrayHook?: boolean;
  },
) => Promise<boolean>;

export type StateFormSetFocus<FormValues extends StateFormUnknownFormType = SafeAnyType> = <
  FieldName extends StateFormPath<FormValues>,
>(
  fieldName: FieldName,
) => void;

export type StateFormOptionsType<FormValues extends StateFormUnknownFormType> = {
  defaultValues?: DeepPartial<FormValues>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
  typeCheckOnSetValue?: boolean;
};
