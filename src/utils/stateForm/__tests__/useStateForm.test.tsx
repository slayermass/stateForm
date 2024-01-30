import { renderHook } from '@testing-library/react';

import { stateFormErrorsRequiredMessage } from '../helpers/formStateGenerateErrors';
import { StateFormRegisterOptions, StateFormReturnType, useStateForm } from '../index';
import { set } from '../outerDependencies';

type FormValues = {
  strValue: string;
  fieldArrayitems: { email: string; disabled: boolean; test: string }[];
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
  // dateValue: Date; // todo replace inner cloneDeep. do not use JSON
  booleanValue: boolean;
  nullValue: null;
  undefinedValue: undefined;
  // bigIntValue: bigint;

  optionalAnyType?: any;
};

describe('useStateForm', () => {
  console.error = jest.fn();

  let formProps: StateFormReturnType<FormValues>;

  const initialProps: FormValues = {
    strValue: '-',
    fieldArrayitems: [{ email: '', disabled: false, test: '' }],
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
    // dateValue: new Date(2000, 1),
    booleanValue: false,
    nullValue: null,
    undefinedValue: undefined,
    // bigIntValue: BigInt(1e10),
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
    const resetData1 = {
      strValue: '---*/89+5',
      fieldArrayitems: [],
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
    };

    formProps.reset(resetData1);
    expect(formProps.getValue()).toEqual(resetData1);

    const resetData2 = {
      strValue: '',
      fieldArrayitems: [
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
    };

    formProps.reset(resetData2);
    expect(formProps.getValue()).toEqual(resetData2);
  });

  describe('test setValue + getValue', () => {
    it('test string value', () => {
      formSetThenExpect('strValue', ['baba', '--++==', '1 2 3 4 5', '()+_*&&^%%$$#@@!46872532]q\\', 'AABB#%']);
    });

    it('test field array value', () => {
      formSetThenExpect('fieldArrayitems', [
        [{ email: 'y@y.ru', disabled: false, test: 'v' }],
        [{ email: 'yv2v2v2v2v2v251b 25634y.ru', disabled: true, test: 'v-21-2-dur!!!@$%^&t9l7-' }],
        [
          { email: 'y1@y.ru', disabled: true, test: 'true' },
          { email: 'y2@y.ru', disabled: false, test: 'false' },
        ],
        [
          { email: 'y1@y.ru', disabled: true, test: 'true' },
          { email: 'y2@y.ru', disabled: false, test: 'false' },
          { email: 'y3@y.ru', disabled: true, test: '!empty' },
        ],
      ]);
    });

    it('test primitive array value', () => {
      formSetThenExpect('primitiveArray', [['1'], [2], [null], ['B', 'C', '45', null], [3423, 56654, null, 867], []]);
    });

    it('test object value', () => {
      const fieldName = 'objValue';

      const validate = ({ name, value }: { name: string; value: any }) => {
        // 1. get the form's value
        const expected = set(formProps.getValue(), name, value);

        formProps.setValue(name as any, value); // todo types of nested fields
        expect(formProps.getValue(name as any)).toEqual(value);

        // 2. and compare after setting a new value
        expect(formProps.getValue()).toEqual(expected);
      };

      // dot-notation
      [
        {
          name: fieldName,
          value: {
            pops: {
              tops: {
                aleps: {
                  numberValue: Math.random(),
                  arrValue: [{ oi: Math.random().toString() }],
                },
              },
            },
          },
        },
        {
          name: `${fieldName}.pops`,
          value: {
            tops: {
              aleps: {
                numberValue: Math.random(),
                arrValue: [{ oi: Math.random().toString() }],
              },
            },
          },
        },
        {
          name: `${fieldName}.pops.tops`,
          value: {
            aleps: {
              numberValue: Math.random(),
              arrValue: [{ oi: Math.random().toString() }],
            },
          },
        },
        {
          name: `${fieldName}.pops.tops.aleps`,
          value: {
            numberValue: Math.random(),
            arrValue: [{ oi: Math.random().toString() }],
          },
        },
        {
          name: `${fieldName}.pops.tops.aleps.numberValue`,
          value: Math.random(),
        },
        {
          name: `${fieldName}.pops.tops.arrValue`,
          value: [{ oi: Math.random().toString() }],
        },
      ].forEach(validate);

      // brace-notation
      [
        {
          name: fieldName,
          value: {
            pops: {
              tops: {
                aleps: {
                  numberValue: Math.random(),
                  arrValue: [{ oi: Math.random().toString() }],
                },
              },
            },
          },
        },
        {
          name: `${fieldName}[pops]`,
          value: {
            tops: {
              aleps: {
                numberValue: Math.random(),
                arrValue: [{ oi: Math.random().toString() }],
              },
            },
          },
        },
        {
          name: `${fieldName}[pops][tops]`,
          value: {
            aleps: {
              numberValue: Math.random(),
              arrValue: [{ oi: Math.random().toString() }],
            },
          },
        },
        {
          name: `${fieldName}.pops.tops.aleps`,
          value: {
            numberValue: Math.random(),
            arrValue: [{ oi: Math.random().toString() }],
          },
        },
        {
          name: `${fieldName}.pops.tops.aleps.numberValue`,
          value: Math.random(),
        },
        {
          name: `${fieldName}.pops.tops.arrValue`,
          value: [{ oi: Math.random().toString() }],
        },
      ].forEach(validate);
    });

    it('test boolean value', () => {
      const fieldName = 'booleanValue';

      [true, false, true, false].forEach((value) => {
        formProps.setValue(fieldName, value);
        expect(formProps.getValue(fieldName)).toEqual(value);
      });
    });

    it('test null value. it might have any value', () => {
      const fieldName = 'booleanValue';

      [true, false, 'A', 2, { t: 1 }, ['h', 2, null], null].forEach((value) => {
        formProps.setValue(fieldName, value);
        expect(formProps.getValue(fieldName)).toEqual(value);
      });
    });

    it('test undefined value (similar to an optional value). it might have any value', () => {
      formSetThenExpect('undefinedValue', [true, false, 'A', 2, { t: 1 }, ['h', 2, null], undefined]);
    });

    // it('test bigInt (number) value', () => {
    //   formSetThenExpect('bigIntValue', [
    //     BigInt(0),
    //     BigInt(-0),
    //     BigInt(-5e20),
    //     BigInt(9590),
    //     839824,
    //     -325,
    //     666_666_666_666,
    //   ]);
    // });
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
        'common.validation.minLength',
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
        'common.validation.maxLength',
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

  it('console errors check (should be the last test)', () => {
    expect(console.error).not.toHaveBeenCalled();
  });
});
