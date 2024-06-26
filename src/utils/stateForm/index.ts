import { SyntheticEvent, useCallback, useMemo, useRef } from 'react';

import {
  StateFormDataTypesFieldsType,
  StateFormDataTypesSpecificPropertiesType,
  StateFormPossibleValue,
} from './settings';
import { formStateInnerCloneDeep } from './helpers/cloneDeep';
import { formStateGenerateErrors } from './helpers/formStateGenerateErrors';
import { EventBusReturnType, getEventBus, EventBusFieldEventType } from './eventBus';

import {
  DeepPartial,
  diff,
  equal,
  get,
  getUniqueId,
  has,
  isArray,
  isEmpty,
  isFunction,
  isPlainObject,
  isString,
  merge,
  SafeAnyType,
  set,
  omit,
} from './outerDependencies';
import { StateFormPath, StateFormPathValue, StateFormPathValues } from './types/path';

export type StateFormEmptyValueType = null | undefined;

type ErrorsType = { type: StateFormErrorTypes; message: string; initChange?: boolean }[] | StateFormEmptyValueType;

type DefinedErrorsType = NonNullable<ErrorsType>;

type FieldOptionValue = {
  type: StateFormFieldsType;
  active: boolean;
  options: StateFormInputOptionsType;
  isDirty: boolean;
  ref?: HTMLElement | null;
};

type FieldsOptions = Record<string, FieldOptionValue>;

/**
 * error type may be any string but these are default types which are used in the form
 *
 * validate - for default validation errors (required ...)
 * hover    - only for hover errors
 */
type StateFormErrorTypes = 'hover' | 'validate' | 'all' | string;

/** --- return types --- */

export type StateFormErrors = { [s: string]: DefinedErrorsType };

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
  <FieldName extends StateFormPath<FormValues>>(fieldName: FieldName): DefinedErrorsType;
  <FieldNames extends StateFormPath<FormValues>[]>(fieldNames: FieldNames): DefinedErrorsType[];
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
  error: DefinedErrorsType[0] | string,
  initChange?: boolean,
) => void;

type StateFormSetValueOptions = { trigger?: boolean; merge?: boolean; _afterRegister?: boolean };
type StateFormSetMultipleValueOptions = StateFormSetValueOptions & { prefix?: string };

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

export type StateFormRegisterOptions = Omit<StateFormInputOptionsType, 'initChange'>;

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

export type StateFormFieldsType = StateFormDataTypesFieldsType;

export type StateFormReset<FormValues = SafeAnyType> = (
  values?: DeepPartial<FormValues>,
  options?: { trigger?: boolean; resetInitialForm?: boolean; mergeWithPreviousState?: boolean },
) => void;

export type StateFormSetRef = (name: string) => (element: HTMLElement | null) => void;

export type StateFormGetDirtyFields = () => string[];

export type StateFormGetStatusValue = { isDirty: boolean };
export type StateFormGetStatus = () => StateFormGetStatusValue;

export type StateFormChangeStateDirectly = (name: string, value: SafeAnyType) => void;

export type StateFormSetFocus<FormValues extends StateFormUnknownFormType = SafeAnyType> = <
  FieldName extends StateFormPath<FormValues>,
>(
  fieldName: FieldName,
) => void;
/** --- end return types --- */

export type StateFormReturnType<FormValues extends StateFormUnknownFormType = SafeAnyType> = {
  onSubmit: StateFormOnSubmitType<FormValues>;
  onChange: StateFormOnChange;
  onBlur: StateFormOnBlur;
  clearErrors: StateFormClearTypes;
  getErrors: StateFormGetErrorsByName<FormValues>;
  getValue: StateFormGetValue<FormValues>;
  setValue: StateFormSetValue<FormValues>;
  setError: StateFormSetError<FormValues>;
  register: StateFormRegister;
  unregister: StateFormUnregister;
  getSubscribeProps: StateFormGetSubscribeProps;
  reset: StateFormReset<FormValues>;
  getDirtyFields: StateFormGetDirtyFields;
  getStatus: StateFormGetStatus;
  changeStateDirectly: StateFormChangeStateDirectly;
  trigger: StateFormTrigger<FormValues>;
  setFocus: StateFormSetFocus<FormValues>;
  setRef: StateFormSetRef;
  getInitialValue: StateFormGetValue<FormValues>;
};

export const useStateForm = <FormValues extends StateFormUnknownFormType>({
  defaultValues,
  mode = 'onBlur',
}: {
  defaultValues?: DeepPartial<FormValues>;
  mode?: 'onChange' | 'onBlur' | 'onSubmit';
} = {}): StateFormReturnType<FormValues> => {
  const initialValues = useRef(defaultValues || ({} as FormValues));

  /** form eventBus */
  const instanceEventBus = useRef<EventBusReturnType | null>(null);

  // lazy ref init
  const eventBus = (() => {
    if (instanceEventBus.current !== null) {
      return instanceEventBus.current;
    }

    const newInstance = getEventBus();
    instanceEventBus.current = newInstance;
    return newInstance;
  })();

  /** form data storage */
  const formState = useRef<FormValues>(formStateInnerCloneDeep(initialValues.current as FormValues));

  /** form errors storage */
  const errors = useRef<StateFormErrors>({});

  /** form fields options */
  const fieldsOptions = useRef<FieldsOptions>({});

  /** form unique id */
  const id = useRef(getUniqueId()).current;

  /** helpers */
  const getErrorsByNameInner = useCallback((name: string) => (errors.current[name] || []) as DefinedErrorsType, []);

  const hasErrorsByName = useCallback(
    (name: string, type: StateFormErrorTypes = 'all'): boolean => {
      let errors = getErrorsByNameInner(name);

      if (type !== 'all') {
        errors = errors.filter((item) => item.type === type);
      }

      return errors.length > 0;
    },
    [getErrorsByNameInner],
  );

  const getFieldOptionsValue: <PROP extends keyof FieldOptionValue>(
    name: string,
    prop: PROP,
  ) => FieldOptionValue[PROP] = useCallback(
    (name, prop) => get(fieldsOptions.current[name], `[${prop}]`) as SafeAnyType,
    [],
  );

  const getAllValues = useCallback(() => formStateInnerCloneDeep(formState.current), []);

  const setFieldOptionsValue = useCallback(
    (
      fieldName: string,
      options: Partial<FieldOptionValue> | FieldOptionValue[keyof FieldOptionValue],
      propName?: keyof FieldOptionValue,
    ): void => {
      fieldsOptions.current[fieldName] = propName
        ? { ...fieldsOptions.current[fieldName], [propName]: options }
        : (options as FieldOptionValue);
    },
    [],
  );

  const checkDirtyField = useCallback(
    (name: string) => !equal(get(initialValues.current, name), get(formState.current, name)),
    [],
  );

  const innerGetValue: StateFormInnerGetValue = useCallback(
    (name) => formStateInnerCloneDeep(get(formState.current, name)),
    [],
  );

  const setRef: StateFormSetRef = useCallback(
    (name) => (element) => {
      const ref = getFieldOptionsValue(name, 'ref');

      if ((!ref && element) || (ref && !element)) {
        setFieldOptionsValue(name, element, 'ref');
      }
    },
    [getFieldOptionsValue, setFieldOptionsValue],
  );

  const changeStateForm = useCallback(
    (name: string, value: SafeAnyType) => {
      const previousFormState = formStateInnerCloneDeep(formState.current);

      set(formState.current, name, value);

      const diffStateValue = diff(previousFormState, formState.current);

      if (!isEmpty(diffStateValue)) {
        const cloneObjOrArray = (value: SafeAnyType) =>
          isPlainObject(value) || isArray(value) ? formStateInnerCloneDeep(value) : value;

        const getNames = (value: StateFormUnknownFormType, parentName?: string): string[] => {
          if (isPlainObject(value)) {
            return Object.entries(value).reduce<string[]>(
              (acc, [propName, propValue]) => {
                const name = parentName ? `${parentName}.${propName}` : propName;

                /* there are two ways to subscribe to array values.
                 * arrayProp.0 and arrayProp[0]
                 */
                const arrName = /^\d+$/.test(propName) ? `${parentName}[${propName}]` : undefined;

                return arrName
                  ? [...getNames(propValue, arrName), ...getNames(propValue, name), ...acc]
                  : [...getNames(propValue, name), ...acc];
              },
              isPlainObject(value) && parentName ? [parentName] : [],
            );
          }

          return parentName ? [parentName] : [];
        };

        if (eventBus) {
          getNames(diffStateValue).forEach((name) => {
            eventBus.emit(name, 'change', cloneObjOrArray(get(formState.current, name)));
          });

          eventBus.emit(id, 'change', cloneObjOrArray(formState.current));
        }
      }
    },
    [eventBus, id],
  );
  /** end helpers */

  /** outer API */
  const getValue = useCallback(
    (names?: StateFormPath<FormValues> | StateFormPath<FormValues>[]) => {
      if (!names) {
        return getAllValues();
      }

      if (isString(names)) {
        return innerGetValue(names);
      }

      if (isArray(names)) {
        return names.map((name) => innerGetValue(name));
      }

      return undefined;
    },
    [getAllValues, innerGetValue],
  ) as StateFormGetValue<FormValues>;

  const getErrors = useCallback(
    (names: StateFormPath<FormValues> | StateFormPath<FormValues>[]) => {
      if (isString(names)) {
        return getErrorsByNameInner(names).filter(({ initChange }) => !initChange);
      }

      if (isArray(names)) {
        return names.map((name) => getErrorsByNameInner(name).filter(({ initChange }) => !initChange));
      }

      return [];
    },
    [getErrorsByNameInner],
  ) as StateFormGetErrorsByName<FormValues>;

  const emitErrors = useCallback(
    (name: string, customErrors?: DefinedErrorsType) =>
      eventBus?.emit(name, 'error', customErrors || getErrors(name as StateFormPath<FormValues>)),
    [eventBus, getErrors],
  );

  const setError: StateFormSetError<FormValues> = useCallback(
    (name, error, initChange) => {
      const foundErrors = formStateInnerCloneDeep(getErrorsByNameInner(name));

      if (typeof error === 'string') {
        const errObj: DefinedErrorsType[0] = {
          type: 'validate',
          message: error,
        };

        if (initChange) {
          errObj.initChange = true;
        }

        foundErrors.push(errObj);
      } else {
        if (initChange) {
          error.initChange = true;
        }

        /**
         * in case of setting the same error multiple times (required by form and setting requierment manually)
         * prefer 'validate' type rather than 'hover' or any custom
         * */
        if (!foundErrors.find(({ message }) => message === error.message)) {
          foundErrors.push(error);
        }
      }

      errors.current[name] = foundErrors;

      emitErrors(name);
    },
    [emitErrors, getErrorsByNameInner],
  );

  const clearErrors: StateFormClearTypes = useCallback(
    (name, type = 'all') => {
      const foundErrors = getErrorsByNameInner(name);

      let newErrors: DefinedErrorsType = [];

      if (type !== 'all') {
        newErrors = formStateInnerCloneDeep(foundErrors).filter((err) => err.type !== type);
      }

      if (foundErrors.length !== newErrors.length) {
        if (newErrors.length) {
          errors.current[name] = newErrors;
        } else {
          delete errors.current[name];
        }

        emitErrors(name);
      }
    },
    [emitErrors, getErrorsByNameInner],
  );

  const validateInput = useCallback(
    (name: string, method: typeof mode, needTrigger = false, clearOnlyValidateError = false) => {
      const value = innerGetValue(name);

      const type = getFieldOptionsValue(name, 'type');

      const omitArrayTypes: StateFormFieldsType[] = [];

      if (isArray(value) && !omitArrayTypes.includes(type)) {
        (value as Record<string, StateFormPossibleValue>[]).forEach((item, index) => {
          if (isPlainObject()) {
            Object.keys(item).forEach((key) => {
              validateInput(`${name}[${index}].${key}`, method, true, clearOnlyValidateError);
            });
          } else {
            // primitive arrays are not commonly used
            value.forEach((_, innerIndex) => {
              validateInput(`${name}[${index}][${innerIndex}]`, method, true, clearOnlyValidateError);
            });
          }
        });
      } else {
        /** declare variables */
        const fieldType = getFieldOptionsValue(name, 'type');

        const fieldsAlwaysNeedCheck: StateFormFieldsType[] = [];

        // const fieldsAlwaysNeedCheck: StateFormFieldsType[] =
        //   mode === 'onSubmit' ? [] : ['checkbox', 'timepicker', 'datepicker'];

        const options = getFieldOptionsValue(name, 'options');

        const initialChange: boolean = options?.initChange === true;

        const isCurrentMode = method === mode;
        /** end declare variables */

        if ((!initialChange || isCurrentMode || needTrigger) && hasErrorsByName(name, 'validate')) {
          clearErrors(name, clearOnlyValidateError ? 'validate' : 'all');
        }

        if (isCurrentMode || initialChange || needTrigger || fieldsAlwaysNeedCheck.includes(fieldType)) {
          formStateGenerateErrors(value, options, fieldType, name).forEach((errorMessage) => {
            setError(
              name as StateFormPath<FormValues>,
              errorMessage,
              needTrigger || isCurrentMode ? false : initialChange,
            );
          });
        }
      }
    },
    [clearErrors, getFieldOptionsValue, innerGetValue, hasErrorsByName, mode, setError],
  );

  const changeStateDirectly: StateFormChangeStateDirectly = useCallback(
    (name, value) => {
      changeStateForm(name, formStateInnerCloneDeep(value));

      validateInput(name, 'onChange', true);
    },
    [changeStateForm, validateInput],
  );

  const onChange: StateFormOnChange = useCallback(
    (name, value, options) => {
      const newValue =
        options?.merge === true ? formStateInnerCloneDeep(merge(get(formState.current, name), value)) : value;

      changeStateForm(name, newValue);

      setFieldOptionsValue(
        name,
        {
          ...getFieldOptionsValue(name, 'options'),
          initChange: undefined,
        },
        'options',
      );

      setFieldOptionsValue(name, checkDirtyField(name), 'isDirty');

      // prevent checkboxes show errors immediately after registering
      // eslint-disable-next-line no-underscore-dangle
      if (!(options?._afterRegister && fieldsOptions.current[name].type === 'checkBoxGroup')) {
        validateInput(name, 'onChange', options?.trigger);
      }
    },
    [changeStateForm, checkDirtyField, getFieldOptionsValue, setFieldOptionsValue, validateInput],
  );

  const onBlur: StateFormOnBlur = useCallback(
    (name) => {
      validateInput(name, 'onBlur', true);
    },
    [validateInput],
  );

  const setValue: StateFormSetValue<FormValues> = useCallback(
    (...args) => {
      const changeFn = (name: string, value: SafeAnyType, options?: StateFormSetMultipleValueOptions) => {
        onChange(options?.prefix ? `${options.prefix}.${name}` : name, value, {
          trigger: !(options?.trigger === false || options?.trigger === undefined),
          merge: options?.merge,
        });
      };

      if (isPlainObject(args[0])) {
        Object.entries(args[0]).forEach(([name, value]) => changeFn(name, value, args[1] as StateFormSetValueOptions));
      } else {
        changeFn(args[0] as string, args[1], args[2] as StateFormSetValueOptions);
      }
    },
    [onChange],
  );

  const register: StateFormRegister = useCallback(
    (name, fieldType, options = {}) => {
      const fieldOptions = getFieldOptionsValue(name, 'options');
      const fieldRef = getFieldOptionsValue(name, 'ref');

      setFieldOptionsValue(name, {
        type: fieldType,
        active: true,
        options: {
          ...fieldOptions,
          initChange: fieldOptions ? undefined : true,
          ...options,
        },
        ref: fieldRef,
      });

      let value = innerGetValue(name);

      if (isFunction(options.changedInitialValue)) {
        value = options.changedInitialValue(value);
      }

      if (!has(initialValues.current, name)) {
        set(initialValues.current, name, value);
      }

      /** set the current value whatever it may be to have all the values registered */
      onChange(name, value, { _afterRegister: true });
    },
    [getFieldOptionsValue, innerGetValue, onChange, setFieldOptionsValue],
  );

  const unregister: StateFormUnregister = useCallback(
    (name) => {
      const inputOptions = getFieldOptionsValue(name, 'options');

      if (!inputOptions?.stayAliveAfterUnregister) {
        setFieldOptionsValue(name, false, 'active');
        setFieldOptionsValue(name, false, 'isDirty');

        formState.current = omit(formState.current, name) as FormValues;
        fieldsOptions.current = omit(fieldsOptions.current, name);

        clearErrors(name);
      }
    },
    [clearErrors, getFieldOptionsValue, setFieldOptionsValue],
  );

  const trigger: StateFormTrigger<FormValues> = useCallback(
    (names?: StateFormPath<FormValues> | StateFormPath<FormValues>[]) => {
      let fields: string[] = [];

      if (!names) {
        Object.keys(fieldsOptions.current).forEach((key) => {
          const value = fieldsOptions.current[key];

          if (getFieldOptionsValue(key, 'type') !== 'checkBoxGroup' && value.active) {
            fields.push(key);
          }
        });
      } else if (isString(names)) {
        fields = [names];
      } else if (isArray(names)) {
        fields = names;
      }

      /** trigger all values but only by validate type */
      fields.forEach((name) => {
        validateInput(name, 'onSubmit', true, true);
      });
    },
    [getFieldOptionsValue, validateInput],
  );

  const setFocus: StateFormSetFocus<FormValues> = useCallback(
    (name) => {
      const ref = getFieldOptionsValue(name, 'ref');

      if (ref && ref.focus) {
        ref.focus();
      }
    },
    [getFieldOptionsValue],
  );

  const getStatus: StateFormGetStatus = useCallback(
    () => ({
      isDirty: Object.values(fieldsOptions.current).some((value) => value.isDirty),
    }),
    [],
  );

  const onSubmit: StateFormOnSubmitType<FormValues> = useCallback(
    (right, left) => (e) => {
      e?.preventDefault();

      /**
       * there can be any errors even not connected to form directly
       * reset all error and wait if trigger generates local ones
       */
      errors.current = {};

      trigger();

      const foundErrors = errors.current;

      if (isEmpty(foundErrors)) {
        right(getAllValues(), getStatus());
      } else if (isFunction(left)) {
        left(foundErrors);
      }
    },
    [getAllValues, getStatus, trigger],
  );

  const reset: StateFormReset = useCallback(
    (values, options) => {
      const fn = (obj: StateFormUnknownFormType, path?: string) =>
        Object.entries(obj).forEach(([key, currentValue]) => {
          const name = path ? `${path}.${key}` : key;

          if (isPlainObject(currentValue)) {
            fn(currentValue, name);
          } else {
            const value = get(values || initialValues.current, name);

            // ????
            // if (value === undefined) {
            //   switch (fieldsOptions.current[name]?.type) {
            //     case 'checkBoxGroup': {
            //       value = false;
            //       break;
            //     }
            //     default:
            //       break;
            //   }
            // }

            changeStateForm(name, value);

            setFieldOptionsValue(
              name,
              {
                ...getFieldOptionsValue(name, 'options'),
                initChange: true,
              },
              'options',
            );
            setFieldOptionsValue(name, false, 'isDirty');

            clearErrors(name);

            if (options?.trigger) {
              validateInput(name, 'onChange', true);
            }
          }
        });

      fn(values || formState.current);

      if (options?.resetInitialForm && values) {
        const preparedValues = formStateInnerCloneDeep(values);

        initialValues.current = options?.mergeWithPreviousState
          ? { ...initialValues.current, ...preparedValues }
          : preparedValues;
      }
    },
    [changeStateForm, clearErrors, getFieldOptionsValue, setFieldOptionsValue, validateInput],
  );

  const getDirtyFields: StateFormGetDirtyFields = useCallback(
    () =>
      Object.keys(fieldsOptions.current).reduce<ReturnType<StateFormGetDirtyFields>>((acc, key) => {
        const value = fieldsOptions.current[key];

        if (getFieldOptionsValue(key, 'type') !== 'checkBoxGroup' && value.isDirty) {
          acc.push(key);
        }

        return acc;
      }, []),
    [getFieldOptionsValue],
  );
  /** end outer API */

  /** state subscription */
  const getSubscribeProps: StateFormGetSubscribeProps = useCallback(
    (eventType, names) => [
      (callback: (value: SafeAnyType, fieldName: string) => void) => {
        if (!eventBus) {
          return [];
        }

        /* callback when subscribed to all form values */
        if (!names) {
          return [eventBus.on(id, eventType, callback)];
        }

        return isString(names)
          ? [eventBus.on(names, eventType, callback)]
          : names.map((name) => eventBus.on(name, eventType, callback));
      },
      eventType === 'change' ? getValue(names as SafeAnyType) : getErrors(names as SafeAnyType),
    ],
    [eventBus, getErrors, getValue, id],
  );
  /** end state subscription */

  /** get initial value of the form */
  const getInitialValue = useCallback((names?: StateFormPath<FormValues> | StateFormPath<FormValues>[]) => {
    const getInitialAllValues = () =>
      Object.entries(initialValues.current).reduce<SafeAnyType>((acc, [k, v]) => {
        acc[k] = v;
        return acc;
      }, {});

    const getInitialValue: StateFormInnerGetValue = (name) => formStateInnerCloneDeep(get(initialValues.current, name));

    if (!names) {
      return getInitialAllValues();
    }

    if (isString(names)) {
      return getInitialValue(names);
    }

    if (isArray(names)) {
      return names.map((name) => getInitialValue(name));
    }

    return undefined;
  }, []) as StateFormGetValue<FormValues>;

  return useMemo(
    () => ({
      onSubmit,

      onChange,
      onBlur,

      clearErrors,

      getErrors,
      getValue,

      setError,
      setValue,
      setRef,

      register,
      unregister,

      getSubscribeProps,

      reset,

      getDirtyFields,
      getStatus,

      changeStateDirectly,

      trigger,
      setFocus,

      getInitialValue,
    }),
    [
      onSubmit,
      onChange,
      onBlur,
      clearErrors,
      getErrors,
      getValue,
      setError,
      setValue,
      setRef,
      register,
      unregister,
      getSubscribeProps,
      reset,
      getDirtyFields,
      getStatus,
      changeStateDirectly,
      trigger,
      setFocus,
      getInitialValue,
    ],
  );
};
