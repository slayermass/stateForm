import { useCallback, useMemo, useRef } from 'react';

import { stateFormInnerValidators, StateFormPossibleValue, stateFormValuesOfArrayType } from './setDataTypes';
import {
  StateFormChangeStateDirectly,
  StateFormClearTypes,
  StateFormDefinedErrorsType,
  StateFormErrors,
  StateFormErrorTypes,
  StateFormFieldOptionValue,
  StateFormFieldsOptions,
  StateFormFieldsType,
  StateFormGetDirtyFields,
  StateFormGetErrorsByName,
  StateFormGetStatus,
  StateFormGetSubscribeProps,
  StateFormGetValue,
  StateFormInnerGetValue,
  stateFormIsValueInnerEmpty,
  StateFormOnBlur,
  StateFormOnChange,
  StateFormOnSubmitType,
  StateFormOptionsType,
  StateFormRegister,
  StateFormReset,
  StateFormSetError,
  StateFormSetFocus,
  StateFormSetMultipleValueOptions,
  StateFormSetRef,
  StateFormSetValue,
  StateFormSetValueOptions,
  StateFormSubscribeType,
  StateFormTrigger,
  StateFormUnknownFormType,
  StateFormUnregister,
} from './types';
import { formStateInnerCloneDeep } from './helpers/cloneDeep';
import { formStateGenerateErrors } from './helpers/formStateGenerateErrors';
import { EventBusReturnType, getEventBus } from './eventBus';

import {
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
  omit,
  SafeAnyType,
  set,
  isNumber,
} from './outerDependencies';
import { StateFormPath } from './types/path';

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
  subscribe: StateFormSubscribeType<FormValues>;
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
  typeCheckOnSetValue = true,
}: StateFormOptionsType<FormValues> = {}): StateFormReturnType<FormValues> => {
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
  const fieldsOptions = useRef<StateFormFieldsOptions>({});

  /** form unique id */
  const FORM_ID = useRef(getUniqueId()).current;

  /** helpers */
  const getErrorsByNameInner = useCallback(
    (name: string) => (errors.current[name] || []) as StateFormDefinedErrorsType,
    [],
  );

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

  const getFieldOptionsValue: <PROP extends keyof StateFormFieldOptionValue>(
    name: string,
    prop: PROP,
  ) => StateFormFieldOptionValue[PROP] = useCallback(
    (name, prop) => get(fieldsOptions.current[name], `[${prop}]`) as SafeAnyType,
    [],
  );

  const getAllValues = useCallback(() => formStateInnerCloneDeep(formState.current), []);

  const setFieldOptionsValue = useCallback(
    (
      fieldName: string,
      options: Partial<StateFormFieldOptionValue> | StateFormFieldOptionValue[keyof StateFormFieldOptionValue],
      propName?: keyof StateFormFieldOptionValue,
    ): void => {
      fieldsOptions.current[fieldName] = propName
        ? { ...fieldsOptions.current[fieldName], [propName]: options }
        : (options as StateFormFieldOptionValue);
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
              (acc, { 0: propName, 1: propValue }) => {
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

          eventBus.emit(FORM_ID, 'change', cloneObjOrArray(formState.current));
        }
      }
    },
    [eventBus, FORM_ID],
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
    (name: string, customErrors?: StateFormDefinedErrorsType) =>
      eventBus?.emit(name, 'error', customErrors || getErrors(name as StateFormPath<FormValues>)),
    [eventBus, getErrors],
  );

  const setError: StateFormSetError<FormValues> = useCallback(
    (name, error, initChange) => {
      const foundErrors = formStateInnerCloneDeep(getErrorsByNameInner(name));

      if (typeof error === 'string') {
        const errObj: StateFormDefinedErrorsType[0] = {
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

      let newErrors: StateFormDefinedErrorsType = [];

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
    (
      name: string,
      method: typeof mode,
      { needTrigger = false, clearOnlyValidateError = false, fromFormFieldArrayHook = false },
    ) => {
      const value = innerGetValue(name);

      const type = getFieldOptionsValue(name, 'type');

      if (isArray(value) && !stateFormValuesOfArrayType.includes(type)) {
        (value as Record<string, StateFormPossibleValue>[]).forEach((item, index) => {
          if (isPlainObject()) {
            Object.keys(item).forEach((key) => {
              validateInput(`${name}[${index}].${key}`, method, { needTrigger: true, clearOnlyValidateError });
            });
          } else if (!fromFormFieldArrayHook) {
            // fromFormFieldArrayHook - ignore validating nested key when appending array value by useStateFormFieldArray

            // primitive arrays are not commonly used
            value.forEach((_, innerIndex) => {
              validateInput(`${name}[${index}][${innerIndex}]`, method, {
                needTrigger: true,
                clearOnlyValidateError,
              });
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
    (name, value, options) =>
      new Promise<boolean>((resolve) => {
        changeStateForm(name, formStateInnerCloneDeep(value));

        validateInput(name, 'onChange', { needTrigger: true, fromFormFieldArrayHook: options?.fromFormFieldArrayHook });

        setTimeout(() => {
          resolve(true);
        }, 0);
      }),
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

      // eslint-disable-next-line no-underscore-dangle
      if (!options?._afterRegister) {
        validateInput(name, 'onChange', { needTrigger: options?.trigger });
      }
    },
    [changeStateForm, checkDirtyField, getFieldOptionsValue, setFieldOptionsValue, validateInput],
  );

  const onBlur: StateFormOnBlur = useCallback(
    (name) => {
      validateInput(name, 'onBlur', { needTrigger: true });
    },
    [validateInput],
  );

  const setValue: StateFormSetValue<FormValues> = useCallback(
    (...args) => {
      const changeFn = (name: string, value: SafeAnyType, options?: StateFormSetMultipleValueOptions) => {
        if (typeCheckOnSetValue && process.env.NODE_ENV !== 'production') {
          const isRequired = !!getFieldOptionsValue(name, 'options')?.required;

          const fieldType = getFieldOptionsValue(name, 'type');

          if (isRequired && !stateFormIsValueInnerEmpty(value) && !stateFormInnerValidators[fieldType].isSet(value)) {
            throw new Error(`Trying to set wrong value "${value}" of type "${typeof value}" to type "${fieldType}"`);
          }
        }

        onChange(options?.prefix ? `${options.prefix}.${name}` : name, value, {
          trigger: !(options?.trigger === false || options?.trigger === undefined),
          merge: options?.merge,
        });
      };

      if (isPlainObject(args[0])) {
        Object.entries(args[0]).forEach(({ 0: name, 1: value }) =>
          changeFn(name, value, args[1] as StateFormSetValueOptions),
        );
      } else {
        changeFn(args[0] as string, args[1], args[2] as StateFormSetValueOptions);
      }
    },
    [getFieldOptionsValue, onChange, typeCheckOnSetValue],
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
          if (fieldsOptions.current[key].active) {
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
        validateInput(name, 'onSubmit', { needTrigger: true, clearOnlyValidateError: true });
      });
    },
    [validateInput],
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
        Object.keys(obj).forEach((key) => {
          const name = path ? `${path}.${key}` : key;

          const currentValue = obj[key];

          if (isPlainObject(currentValue)) {
            fn(currentValue, name);
          } else {
            const value = get(values || initialValues.current, name);

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
              validateInput(name, 'onChange', { needTrigger: true });
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

        if (value.isDirty) {
          acc.push(key);
        }

        return acc;
      }, []),
    [],
  );
  /** end outer API */

  /** state subscription */
  const subscribe: StateFormSubscribeType<FormValues> = useCallback(
    (fieldNames?: StateFormPath<FormValues> | StateFormPath<FormValues>[]) => {
      if (!fieldNames || isString(fieldNames)) {
        return {
          on: (callback: SafeAnyType) => eventBus.on(fieldNames || FORM_ID, 'change', (value) => callback(value)),
          onError: (callback: SafeAnyType) => eventBus.on(fieldNames || FORM_ID, 'error', (value) => callback(value)),
        };
      }

      const fieldsPositions: Record<string, number> = fieldNames.reduce(
        (acc, name, index) => ({ ...acc, [name]: index }),
        {},
      );

      const localErrors = getErrors(fieldNames);

      const localValues = getValue(fieldNames);

      let timer: SafeAnyType;

      const handleEmit =
        (callback: (value: SafeAnyType) => void, type: 'change' | 'error') => (value: SafeAnyType, name: string) => {
          const index = fieldsPositions[name];

          if (isNumber(index)) {
            const valuesVariable = type === 'change' ? localValues : localErrors;

            valuesVariable[index] = value;

            /** it should be called only at the end of all changes
             *
             * example case:
             *
             *  obj0: {
             *    obj1: {
             *      obj2: {
             *        val: string
             *      }
             *    }
             *  }
             *
             *  subscribeMultiple(['obj0', 'obj0.obj1', 'obj0.obj1.obj2.val']).on(<callback>);
             *
             *  such a value change will call handleEmit function more than once without timeout:
             *  setValue('obj0.obj1.obj2.val', 'lol');
             * */
            clearTimeout(timer);
            timer = setTimeout(() => callback([...valuesVariable]));
          }
        };

      return {
        on: (callback: SafeAnyType) => {
          const unsubscribeFns = fieldNames.map((fieldName) =>
            eventBus.on(fieldName, 'change', handleEmit(callback, 'change')),
          );

          return () => unsubscribeFns.forEach((fn) => fn());
        },
        onError: (callback: SafeAnyType) => {
          const unsubscribeFns = fieldNames.map((fieldName) =>
            eventBus.on(fieldName, 'error', handleEmit(callback, 'error')),
          );

          return () => unsubscribeFns.forEach((fn) => fn());
        },
      };
    },
    [FORM_ID, eventBus, getErrors, getValue],
  );

  const getSubscribeProps: StateFormGetSubscribeProps = useCallback(
    (eventType, names) => [
      (callback: (value: SafeAnyType, fieldName: string) => void) => {
        if (!eventBus) {
          return [];
        }

        /* callback when subscribed to all form values */
        if (!names) {
          return [eventBus.on(FORM_ID, eventType, callback)];
        }

        return isString(names)
          ? [eventBus.on(names, eventType, callback)]
          : names.map((name) => eventBus.on(name, eventType, callback));
      },
      eventType === 'change' ? getValue(names as SafeAnyType) : getErrors(names as SafeAnyType),
    ],
    [eventBus, getErrors, getValue, FORM_ID],
  );
  /** end state subscription */

  /** get initial value of the form */
  const getInitialValue = useCallback((names?: StateFormPath<FormValues> | StateFormPath<FormValues>[]) => {
    if (!names) {
      const getAllInitialValues = () =>
        Object.keys(initialValues.current).reduce<SafeAnyType>((acc, key) => {
          acc[key] = initialValues.current[key];

          return acc;
        }, {});

      return getAllInitialValues();
    }

    const getInitialValue: StateFormInnerGetValue = (name) => formStateInnerCloneDeep(get(initialValues.current, name));

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
      subscribe,

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
      subscribe,
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
