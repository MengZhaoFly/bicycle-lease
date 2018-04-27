import React from 'react';
import { Provider, useStaticRendering } from 'mobx-react';
import { StaticRouter } from 'react-router-dom';
import { createStoreMap } from './store/store';
import JssProvider from 'react-jss/lib/JssProvider';
import { MuiThemeProvider, createMuiTheme, createGenerateClassName } from 'material-ui/styles';
import App from './views/App';

useStaticRendering(true);

export default (stores, routerContext, url, sheetsRegistry, theme, generateClassName) => {
  return (
    <Provider {...stores}>
      <StaticRouter context={routerContext} location={url}>
        <JssProvider registry={sheetsRegistry} generateClassName={generateClassName}>
          <MuiThemeProvider theme={theme} sheetsManager={new Map()}>
            <App />
          </MuiThemeProvider>
        </JssProvider>
      </StaticRouter>
    </Provider>
  );
};

export {
  createStoreMap
};



