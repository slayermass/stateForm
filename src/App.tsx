import React from 'react';
import { useStateForm } from 'src/utils/stateForm';

const App = () => {
  const formProps = useStateForm();

  formProps.register('testText', 'text', {
    required: true, // turn on validation
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
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default App;
