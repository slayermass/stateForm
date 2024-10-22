import { renderHook } from '@testing-library/react';

import { StateFormRegisterOptions } from '../types';
import { stateFormErrorsRequiredMessage } from '../helpers/formStateGenerateErrors';
import { StateFormReturnType, useStateForm } from '../index';
import { get, SafeAnyType, set, omit } from '../outerDependencies';
import {
  stateFormErrorsTextMaxLengthMessage,
  stateFormErrorsTextMinLengthMessage,
} from 'src/utils/stateForm/dataTypes/text';
import { StateFormPath } from 'src/utils/stateForm/types/path';
import { formStateInnerCloneDeep } from 'src/utils/stateForm/helpers/cloneDeep';

type FormValues = {
  strValue: string;
  fieldArrayItems: { email: string; disabled: boolean; test: string }[];
  primitiveArray: (string | number | null)[];
  objValue: {
    pops: {
      tops: {
        aleps: {
          numberValue: number;
          arrValue: { oi: string }[];
        };
      };
    };
  };
  booleanValue: boolean;
  nullValue: null;
  undefinedValue: undefined;
  bigIntValue: bigint;
  nested: {
    test: number;
  };

  optionalAnyType?: any;
};

describe('useStateForm', () => {
  console.error = jest.fn();

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    strValue: '-',
    fieldArrayItems: [{ email: '', disabled: false, test: '' }],
    primitiveArray: [],
    objValue: {
      pops: {
        tops: {
          aleps: {
            numberValue: 0,
            arrValue: [{ oi: 'v33vv3' }],
          },
        },
      },
    },
    nested: {
      test: 1,
    },
    // dateValue: new Date(2000, 1),
    booleanValue: false,
    nullValue: null,
    undefinedValue: undefined,
    bigIntValue: BigInt(1e10),
  };

  const formSetThenExpect = (fieldName: keyof FormValues, arr: any[]) => {
    arr.forEach((value) => {
      formProps.setValue(fieldName, value);
      expect(formProps.getValue(fieldName)).toEqual(value);
    });
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

  it('test initial values', () => {
    expect(formProps.getValue()).toEqual(initialProps);
  });

  it('test reset', () => {
    const resetData1: FormValues = {
      strValue: '---*/89+5',
      fieldArrayItems: [],
      primitiveArray: [6, 78, '$4'],
      objValue: {
        pops: {
          tops: {
            aleps: {
              numberValue: 2666,
              arrValue: [],
            },
          },
        },
      },
      booleanValue: false,
      nullValue: null,
      undefinedValue: undefined,
      bigIntValue: BigInt(4e5),
      nested: {
        test: 2,
      },
    };

    formProps.reset(resetData1);
    expect(formProps.getValue()).toEqual(resetData1);

    const resetData2: FormValues = {
      strValue: '',
      fieldArrayItems: [
        { email: '2v2v', disabled: false, test: 'dbw96' },
        {
          email: 'y@Y.ru',
          disabled: true,
          test: 'hgello',
        },
      ],
      primitiveArray: ['ab,,.', 2535235235, null],
      objValue: {
        pops: {
          tops: {
            aleps: {
              numberValue: 0,
              arrValue: [{ oi: 'v33vv3' }, { oi: 'r3b2b23b' }, { oi: '' }],
            },
          },
        },
      },
      booleanValue: true,
      nullValue: null,
      undefinedValue: undefined,
      bigIntValue: BigInt(5050),
      nested: {
        test: 3,
      },
    };

    formProps.reset(resetData2);
    expect(formProps.getValue()).toEqual(resetData2);
  });

  describe('test setValue + getValue', () => {
    it('test string value', () => {
      formSetThenExpect('strValue', ['baba', '--++==', '1 2 3 4 5', '()+_*&&^%%$$#@@!46872532]q\\', 'AABB#%']);
    });

    // it('test field array value', () => {
    //   formSetThenExpect('fieldArrayItems', [
    //     [{ email: 'y@y.ru', disabled: false, test: 'v' }],
    //     [{ email: 'yv2v2v2v2v2v251b 25634y.ru', disabled: true, test: 'v-21-2-dur!!!@$%^&t9l7-' }],
    //     [
    //       { email: 'y1@y.ru', disabled: true, test: 'true' },
    //       { email: 'y2@y.ru', disabled: false, test: 'false' },
    //     ],
    //     [
    //       { email: 'y1@y.ru', disabled: true, test: 'true' },
    //       { email: 'y2@y.ru', disabled: false, test: 'false' },
    //       { email: 'y3@y.ru', disabled: true, test: '!empty' },
    //     ],
    //   ]);
    // });

    // it('test primitive array value', () => {
    //   formSetThenExpect('primitiveArray', [['1'], [2], [null], ['B', 'C', '45', null], [3423, 56654, null, 867], []]);
    // });

    // it('test object value', () => {
    //   const fieldName = 'objValue';
    //
    //   const validate = ({ name, value }: { name: string; value: any }) => {
    //     // 1. get the form's value
    //     const expected = set(formProps.getValue(), name, value);
    //
    //     formProps.setValue(name as any, value); // todo types of nested fields
    //     expect(formProps.getValue(name as any)).toEqual(value);
    //
    //     // 2. and compare after setting a new value
    //     expect(formProps.getValue()).toEqual(expected);
    //   };
    //
    //   // dot-notation
    //   [
    //     {
    //       name: fieldName,
    //       value: {
    //         pops: {
    //           tops: {
    //             aleps: {
    //               numberValue: Math.random(),
    //               arrValue: [{ oi: Math.random().toString() }],
    //             },
    //           },
    //         },
    //       },
    //     },
    //     {
    //       name: `${fieldName}.pops`,
    //       value: {
    //         tops: {
    //           aleps: {
    //             numberValue: Math.random(),
    //             arrValue: [{ oi: Math.random().toString() }],
    //           },
    //         },
    //       },
    //     },
    //     {
    //       name: `${fieldName}.pops.tops`,
    //       value: {
    //         aleps: {
    //           numberValue: Math.random(),
    //           arrValue: [{ oi: Math.random().toString() }],
    //         },
    //       },
    //     },
    //     {
    //       name: `${fieldName}.pops.tops.aleps`,
    //       value: {
    //         numberValue: Math.random(),
    //         arrValue: [{ oi: Math.random().toString() }],
    //       },
    //     },
    //     {
    //       name: `${fieldName}.pops.tops.aleps.numberValue`,
    //       value: Math.random(),
    //     },
    //     {
    //       name: `${fieldName}.pops.tops.arrValue`,
    //       value: [{ oi: Math.random().toString() }],
    //     },
    //   ].forEach(validate);
    //
    //   // brace-notation
    //   [
    //     {
    //       name: fieldName,
    //       value: {
    //         pops: {
    //           tops: {
    //             aleps: {
    //               numberValue: Math.random(),
    //               arrValue: [{ oi: Math.random().toString() }],
    //             },
    //           },
    //         },
    //       },
    //     },
    //     {
    //       name: `${fieldName}[pops]`,
    //       value: {
    //         tops: {
    //           aleps: {
    //             numberValue: Math.random(),
    //             arrValue: [{ oi: Math.random().toString() }],
    //           },
    //         },
    //       },
    //     },
    //     {
    //       name: `${fieldName}[pops][tops]`,
    //       value: {
    //         aleps: {
    //           numberValue: Math.random(),
    //           arrValue: [{ oi: Math.random().toString() }],
    //         },
    //       },
    //     },
    //     {
    //       name: `${fieldName}.pops.tops.aleps`,
    //       value: {
    //         numberValue: Math.random(),
    //         arrValue: [{ oi: Math.random().toString() }],
    //       },
    //     },
    //     {
    //       name: `${fieldName}.pops.tops.aleps.numberValue`,
    //       value: Math.random(),
    //     },
    //     {
    //       name: `${fieldName}.pops.tops.arrValue`,
    //       value: [{ oi: Math.random().toString() }],
    //     },
    //   ].forEach(validate);
    // });

    it('test boolean value', () => {
      const fieldName = 'booleanValue';

      [true, false, true, false].forEach((value) => {
        formProps.setValue(fieldName, value);
        expect(formProps.getValue(fieldName)).toEqual(value);
      });
    });

    // it('test null value. it might have any value', () => {
    //   const fieldName = 'booleanValue';
    //
    //   [true, false, 'A', 2, { t: 1 }, ['h', 2, null], null].forEach((value) => {
    //     formProps.setValue(fieldName, value);
    //     expect(formProps.getValue(fieldName)).toEqual(value);
    //   });
    // });

    // it('test undefined value (similar to an optional value). it might have any value', () => {
    //   formSetThenExpect('undefinedValue', [true, false, 'A', 2, { t: 1 }, ['h', 2, null], undefined]);
    // });

    it('test bigInt (number) value', () => {
      formSetThenExpect('bigIntValue', [
        BigInt(0),
        BigInt(-0),
        BigInt(-5e20),
        BigInt(9590),
        839824,
        -325,
        666_666_666_666,
      ]);
    });
  });

  describe('test getErrors (string type property)', () => {
    const propName = 'strValue';

    const checkerFn = (options: StateFormRegisterOptions, expectedErrorMessage: string, valueToSet: any = null) => {
      formProps.register(propName, 'text', {
        required: true, // turn on validation
        ...options,
      });

      formProps.setValue(propName, valueToSet);

      formProps.onSubmit(
        () => null,
        (errors) => {
          expect(errors).toEqual({ [propName]: [{ type: 'validate', message: expectedErrorMessage }] });
        },
      )();

      expect(formProps.getErrors(propName)).toEqual([{ type: 'validate', message: expectedErrorMessage }]);
    };

    it('required', () => {
      checkerFn(
        {
          required: true,
        },
        stateFormErrorsRequiredMessage,
      );
    });

    it('required + requiredMessage', () => {
      checkerFn(
        {
          requiredMessage: 'requiredMessage555',
        },
        'requiredMessage555',
      );
    });

    it('required + errorLabel', () => {
      checkerFn(
        {
          required: true,
          errorLabel: 'customName',
        },
        stateFormErrorsRequiredMessage,
      );
    });

    it('required + minLength', () => {
      checkerFn(
        {
          minLength: 2,
        },
        stateFormErrorsTextMinLengthMessage,
        '1',
      );
    });

    it('required + minLength + minLengthMessage', () => {
      checkerFn(
        {
          minLength: 2,
          minLengthMessage: 'custom minLengthMessage',
        },
        'custom minLengthMessage',
        '1',
      );
    });

    it('required + maxLength', () => {
      checkerFn(
        {
          maxLength: 2,
        },
        stateFormErrorsTextMaxLengthMessage,
        '123',
      );
    });

    it('required + maxLength + maxLengthMessage', () => {
      checkerFn(
        {
          maxLength: 2,
          maxLengthMessage: 'custom maxLengthMessage',
        },
        'custom maxLengthMessage',
        '123',
      );
    });

    it('required + validate (false)', () => {
      checkerFn(
        {
          validate: () => false,
        },
        stateFormErrorsRequiredMessage,
      );
    });

    it('required + validate (string)', () => {
      checkerFn(
        {
          validate: () => 'doesnt fit',
        },
        'doesnt fit',
        'any',
      );
    });

    it('getInitialValue', () => {
      formProps.register(propName, 'text');

      let newValue = 'value1b';
      formProps.setValue(propName, newValue);

      expect(formProps.getInitialValue(propName)).toEqual(initialProps[propName]);
      expect(formProps.getValue(propName)).toEqual(newValue);

      // new value
      newValue = '!@%$(#BJ)#(B)#ac_)_+++__!)KB(@!';

      formProps.onChange(propName, newValue);

      expect(formProps.getInitialValue(propName)).toEqual(initialProps[propName]);
      expect(formProps.getValue(propName)).toEqual(newValue);
    });
  });

  describe('unregister', () => {
    it('base', () => {
      const props: (keyof FormValues)[] = ['strValue', 'primitiveArray'];

      props.forEach((propName) => {
        formProps.setError(propName, 'a');
        formProps.unregister(propName);
      });

      expect(formProps.getValue()).toEqual(omit(initialProps, props));
      expect(formProps.getErrors(props)).toEqual(new Array(props.length).fill([]));
      expect(formProps.getStatus().isDirty).toEqual(false);
    });

    it('stayAliveAfterUnregister', () => {
      formProps.register('strValue', 'text', {
        stayAliveAfterUnregister: true,
      });

      // formProps.setError('strValue', 'a'); // error disappears

      formProps.setValue('strValue', 'form is dirty');

      formProps.unregister('strValue');

      expect(formProps.getStatus().isDirty).toEqual(true);
      expect(formProps.getValue()).toEqual({
        ...initialProps,
        strValue: 'form is dirty',
      });
      // expect(formProps.getErrors('strValue')).toEqual([]);
    });

    it('base. nested', () => {
      const props: (keyof FormValues)[] = ['nested.test' as keyof FormValues];

      props.forEach((propName) => {
        formProps.unregister(propName);
      });

      // remove parent if it is empty?
      expect(formProps.getValue()).toEqual(omit(initialProps, props));
      expect(formProps.getErrors(props)).toEqual(new Array(props.length).fill([]));
    });

    it('base. wrong property', () => {
      const props: (keyof FormValues)[] = ['opa.alo.3' as keyof FormValues];

      props.forEach((propName) => {
        formProps.unregister(propName);
      });

      expect(formProps.getValue()).toEqual(initialProps);
      expect(formProps.getErrors(props)).toEqual(new Array(props.length).fill([]));
    });
  });

  it('getDirtyFields', () => {
    const props: (keyof FormValues)[] = ['strValue', 'fieldArrayItems', 'primitiveArray', 'booleanValue', 'nullValue'];

    props.forEach((propName) => {
      formProps.register(propName, 'text');

      formProps.setValue(propName, '1');
    });

    expect(formProps.getDirtyFields()).toEqual(props);
  });

  it('getAllValues', () => {
    expect(formProps.getValue()).toEqual(initialProps);
  });

  describe('subscribe', () => {
    describe('"onChange" method', () => {
      it('without names', () => {
        const testFn = jest.fn();

        const unsub = formProps.subscribe().onChange(testFn);

        formProps.setValue('strValue', 'val1');
        formProps.setValue('nested.test', 'val1');

        expect(testFn).toHaveBeenNthCalledWith(1, { ...initialProps, strValue: 'val1' });
        expect(testFn).toHaveBeenNthCalledWith(2, { ...initialProps, strValue: 'val1', nested: { test: 'val1' } });
        expect(testFn).toHaveBeenCalledTimes(2);

        unsub();
        testFn.mockClear();

        formProps.setValue('strValue', 'val2');

        expect(testFn).not.toHaveBeenCalled();
      });

      it('single name', () => {
        const testFn = jest.fn();

        const fieldName = 'strValue';

        const unsub = formProps.subscribe(fieldName).onChange(testFn);

        formProps.setValue(fieldName, 'val1');

        formProps.setValue('booleanValue', true);

        expect(testFn).toHaveBeenCalledWith('val1');
        expect(testFn).toHaveBeenCalledTimes(1);

        unsub();
        testFn.mockClear();

        formProps.setValue(fieldName, 'val2');

        expect(testFn).toHaveBeenCalledTimes(0);
      });

      it('multiple names', () => {
        jest.useFakeTimers();

        const testFn = jest.fn();

        const unsub = formProps.subscribe(['strValue', 'nested']).onChange(testFn);

        formProps.setValue('strValue', 'val1');
        formProps.setValue('nested.test', 'valNested1');

        formProps.setValue('booleanValue', true);

        jest.runAllTimers();

        expect(testFn).toHaveBeenCalledWith(['val1', { test: 'valNested1' }]);
        expect(testFn).toHaveBeenCalledTimes(1);

        unsub();
        testFn.mockClear();

        formProps.setValue('strValue', 'val2');
        formProps.setValue('nested.test', 'valNested2');

        expect(testFn).not.toHaveBeenCalled();
      });
    });

    describe('"onError" method', () => {
      it('single name', () => {
        const testFn = jest.fn();

        const fieldName = 'strValue';

        const unsub = formProps.subscribe(fieldName).onError(testFn);

        formProps.setError(fieldName, 'error');

        formProps.setError('booleanValue', 'error2');

        expect(testFn).toHaveBeenCalledWith([{ message: 'error', type: 'validate' }]);
        expect(testFn).toHaveBeenCalledTimes(1);

        unsub();
        testFn.mockClear();

        formProps.setError(fieldName, 'error2');

        expect(testFn).toHaveBeenCalledTimes(0);
      });

      it('multiple names', () => {
        jest.useFakeTimers();

        const testFn = jest.fn();

        const unsub = formProps.subscribe(['strValue', 'nested.test']).onError(testFn);

        formProps.setError('strValue', 'error');
        formProps.setError('nested.test', 'error2');

        formProps.setError('booleanValue', 'error3');

        jest.runAllTimers();

        expect(testFn).toHaveBeenCalledWith([
          [{ message: 'error', type: 'validate' }],
          [{ message: 'error2', type: 'validate' }],
        ]);
        expect(testFn).toHaveBeenCalledTimes(1);

        unsub();
        testFn.mockClear();

        formProps.setError('strValue', 'val2');
        formProps.setError('nested.test', 'valNested2');

        expect(testFn).not.toHaveBeenCalled();
      });
    });
  });

  // it('getSubscribeProps and changeStateForm', () => {
  //   const checkSubscribeProps = (name: StateFormPath<FormValues>, value: SafeAnyType) => {
  //     const errorMessage = 'Error message';
  //
  //     const [subscribeChangeFns, initialValues] = formProps.getSubscribeProps('change', name);
  //     const [subscribeErrorsFns, initialErrors] = formProps.getSubscribeProps('error', name);
  //
  //     expect(formProps.getValue(name)).toEqual(initialValues);
  //     expect(formProps.getErrors(name)).toEqual(initialErrors);
  //
  //     const changeFn = jest.fn();
  //     const errorFn = jest.fn();
  //
  //     const unSubscribeChangeFns = subscribeChangeFns(changeFn);
  //     const unSubscribeErrorFns = subscribeErrorsFns(errorFn);
  //
  //     expect(changeFn).not.toHaveBeenCalled();
  //     expect(errorFn).not.toHaveBeenCalled();
  //
  //     formProps.setValue(name, value);
  //     formProps.setError(name, errorMessage);
  //
  //     expect(changeFn).toHaveBeenCalledTimes(1);
  //     expect(changeFn).toHaveBeenCalledWith(value, name);
  //
  //     expect(errorFn).toHaveBeenCalledTimes(1);
  //     expect(errorFn).toHaveBeenCalledWith([{ message: errorMessage, type: 'validate' }], name);
  //
  //     changeFn.mockClear();
  //     errorFn.mockClear();
  //
  //     unSubscribeChangeFns.forEach((fn) => fn());
  //     unSubscribeErrorFns.forEach((fn) => fn());
  //
  //     formProps.setValue(name, value);
  //     formProps.setError(name, errorMessage);
  //
  //     expect(changeFn).not.toHaveBeenCalled();
  //     expect(errorFn).not.toHaveBeenCalled();
  //   };
  //
  //   checkSubscribeProps('strValue', 'test value');
  //   checkSubscribeProps('fieldArrayItems', [{ email: 'test', disabled: true, test: 'test' }]);
  //   checkSubscribeProps('primitiveArray', ['test value']);
  //   checkSubscribeProps('booleanValue', true);
  //   checkSubscribeProps('bigIntValue', BigInt(1));
  //
  //   /** deep object */
  //   const names = [
  //     'objValue',
  //     'objValue.pops',
  //     'objValue.pops.tops',
  //     'objValue.pops.tops.aleps',
  //     'objValue.pops.tops.aleps.arrValue',
  //     'objValue.pops.tops.aleps.arrValue.0',
  //     'objValue.pops.tops.aleps.arrValue.0.oi',
  //
  //     // TODO: убрать после удаления квадратных скобок
  //     'objValue.pops.tops.aleps.arrValue[0]',
  //     'objValue.pops.tops.aleps.arrValue[0].oi',
  //   ] as StateFormPath<FormValues>[];
  //
  //   const name = 'objValue.pops.tops.aleps.arrValue.0.oi';
  //
  //   const newValue = 'new value';
  //   const errorMessage = 'Error message';
  //
  //   const [subscribeChangeFns, initialValues] = formProps.getSubscribeProps('change', names);
  //   const [subscribeErrorsFns, initialErrors] = formProps.getSubscribeProps('error', names);
  //
  //   expect(formProps.getValue(names)).toEqual(initialValues);
  //   expect(formProps.getErrors(names)).toEqual(initialErrors);
  //
  //   const changeFn = jest.fn();
  //   const errorFn = jest.fn();
  //
  //   const unSubscribeChangeFns = subscribeChangeFns(changeFn);
  //   const unSubscribeErrorFns = subscribeErrorsFns(errorFn);
  //
  //   expect(changeFn).not.toHaveBeenCalled();
  //   expect(errorFn).not.toHaveBeenCalled();
  //
  //   /** change only the deepest prop */
  //   formProps.setValue(name, newValue);
  //   formProps.setError(name, errorMessage);
  //
  //   expect(changeFn).toHaveBeenCalledTimes(names.length);
  //   expect(errorFn).toHaveBeenCalledTimes(1);
  //
  //   const changedObj = { objValue: formStateInnerCloneDeep(initialProps.objValue) };
  //   set(changedObj, 'objValue.pops.tops.aleps.arrValue.0.oi', newValue);
  //
  //   names.forEach((name) => {
  //     expect(changeFn).toHaveBeenCalledWith(get(changedObj, name), name);
  //   });
  //
  //   expect(errorFn).toHaveBeenCalledWith([{ message: errorMessage, type: 'validate' }], name);
  //
  //   changeFn.mockClear();
  //   errorFn.mockClear();
  //
  //   unSubscribeChangeFns.forEach((fn) => fn());
  //   unSubscribeErrorFns.forEach((fn) => fn());
  //
  //   formProps.setValue(name, newValue);
  //   formProps.setError(name, errorMessage);
  //
  //   expect(changeFn).not.toHaveBeenCalled();
  //   expect(errorFn).not.toHaveBeenCalled();
  // });

  it('console errors check (should be the last test)', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
