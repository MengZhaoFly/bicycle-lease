import React from 'react';
import App from './App.js';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
const render = Component => {
  ReactDOM.render(
    <AppContainer>
      <Component />
    </AppContainer>,
    document.getElementById('root')
  );
};

render(App);

if (module.hot) {
  module.hot.accept('./App.js', () => {
    const NextApp = require('./App.js').default;
    render(NextApp);
  });
}

