
import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';

import './assets/css/index.css';
import App from './components/App.js';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
registerServiceWorker();
