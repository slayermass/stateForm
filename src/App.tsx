import React from 'react';

import { TestForm } from 'src/TestComponents';

const App = () => {
  const [showMoreForms, setShowMoreForms] = React.useState(false);

  return (
    <div className="App">
      <TestForm index={1} />
      <TestForm index={2} />
      <TestForm index={3} />

      <button type="button" onClick={() => setShowMoreForms(!showMoreForms)}>
        Toggle more
      </button>

      {showMoreForms && (
        <>
          <TestForm index={4} />
          <TestForm index={5} />
          <TestForm index={6} />
        </>
      )}
    </div>
  );
};

export default App;
