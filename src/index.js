import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app';
require('./style.scss');
require('./flags/flags.css');

ReactDOM.render(
  <App />,
  document.querySelector('#app')
);
