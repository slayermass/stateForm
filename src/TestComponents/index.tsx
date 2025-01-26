import React, { FC, useEffect } from 'react';
import { useStateForm } from 'src/utils/stateForm';
import { useStateFormFieldArray } from 'src/utils/stateForm/helpers/useStateFormFieldArray';
import { useStateFormValueWatch } from 'src/utils/stateForm/useFormWatch/useStateFormValueWatch';

type FormValues = {
  textInput: string | null;
  nested: { id: number; label: string }[];
};

const textInputName = 'textInput';

export const TestForm: FC<{ index: number }> = ({ index }) => {
  const formProps = useStateForm<FormValues>({
    defaultValues: {
      nested: [],
      [textInputName]: `textInput_${index}`,
    },
  });

  const { fields, append, remove } = useStateFormFieldArray<FormValues['nested']>({
    formProps,
    name: 'nested',
  });

  useEffect(() => {
    formProps.register(textInputName, 'text');
    // formProps.setValue(textInputName, `textInput_${index}`);
  }, [formProps, index]);

  const value = useStateFormValueWatch(formProps.getSubscribeProps, textInputName);

  return (
    <div className="App">
      <form
        onSubmit={formProps.onSubmit(
          (data) => {
            // eslint-disable-next-line no-console
            console.log('OK', data);
          },
          (data) => {
            // eslint-disable-next-line no-console
            console.log('ERROR', data);
          },
        )}
      >
        <input type="text" name="testText" />
        <input
          type="text"
          name="textInput"
          value={value}
          onChange={(e) => {
            formProps.onChange(textInputName, e.target.value);
          }}
        />

        {fields.map((item, index) => (
          // eslint-disable-next-line no-underscore-dangle
          <div key={item.getId()} style={{ display: 'flex', alignItems: 'center' }}>
            <div>{item.label}</div>
            <button
              type="button"
              onClick={() => {
                remove(index);
              }}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => {
            const id = Math.random();

            append({
              id,
              label: `label_${id}`,
            });
          }}
        >
          Append
        </button>
        <button type="submit">Submit</button>
        <button
          type="button"
          onClick={() => {
            console.log('initial values:', formProps.getInitialValue());
          }}
        >
          Get initial values
        </button>
      </form>
    </div>
  );
};
