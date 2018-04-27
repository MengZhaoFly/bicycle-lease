import React from 'react';
import App from './views/App';
import ReactDOM from 'react-dom';
import { BrowserRouter, Link, Route } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import { Provider } from 'mobx-react';
import store from './store/store';
import { MuiThemeProvider, createMuiTheme, createGenerateClassName } from 'material-ui/styles';
import { blue, red } from 'material-ui/colors';
const AppState = store.AppState;
const theme = createMuiTheme({
  palette: {
    primary: blue,
    accent: red,
    type: 'light',
  },
  overrides: {
    MuiButton: {
      // Name of the styleSheet
      root: {
        // Name of the rule
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        borderRadius: 3,
        border: 0,
        color: 'white',
        height: 48,
        padding: '0 30px',
        boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .30)',
      },
    },
  }
});

const initialState = window.__INITIAL__STATE__ || {};
const createApp = (App) => {
  class Main extends React.Component {
    // Remove the server-side injected CSS.
    componentDidMount() {
      const jssStyles = document.getElementById('jss-server-side');
      if (jssStyles && jssStyles.parentNode) {
        jssStyles.parentNode.removeChild(jssStyles);
      }
    }

    render() {
      return <App/>
    }
  }
  return Main;
}
const createState = (store) => {
  console.log('store', store);
  const originalKey =  Object.keys(store);
  const keys = originalKey.slice(0).map(key => key.charAt(0).toLowerCase() + key.substr(1));
  let instanceStore = {};
  originalKey.forEach((key, i) => {
    const Class = store[key];
    const argument = initialState[keys[i]];
    instanceStore[keys[i]] = new Class(argument);
  })
  return instanceStore;
}
const storeInstance = createState(store);
console.log('storeInstance*********', storeInstance);
const render = Component => {
  ReactDOM.render(
    <AppContainer >
      {/*<Provider appState={new AppState(initialState.appState)}>*/}
      <Provider {...storeInstance}>
        <BrowserRouter>
          <MuiThemeProvider theme={theme}>
            <Component />
          </MuiThemeProvider>
        </BrowserRouter>
      </Provider>
    </AppContainer>,
    document.getElementById('root')
  );
};

render(createApp(App));

if (module.hot) {
  module.hot.accept('./views/App', () => {
    const NextApp = require('./views/App').default;
    render(createApp(NextApp));
  });
}

