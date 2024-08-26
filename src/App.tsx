import React from 'react';
import { useStateForm } from 'src/utils/stateForm';
import { useStateFormFieldArray } from 'src/utils/stateForm/helpers/useStateFormFieldArray';

type FormValues = {
  nested: { id: number; label: string }[];
};

const App = () => {
  const formProps = useStateForm<FormValues>({
    defaultValues: {
      nested: [],
    },
  });

  const { fields, append, remove } = useStateFormFieldArray<FormValues['nested']>({
    formProps,
    name: 'nested',
  });

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
      </form>
    </div>
  );
};

export default App;
