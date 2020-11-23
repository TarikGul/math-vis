import React from 'react';

import Console from './Console/Console';
import Viewport from './Viewport/Viewport';
import '../styles/App.css';

const App = () => {
  return (
    <div className="App">
        <Console />
        <Viewport />
    </div>
  );
}

export default App;
