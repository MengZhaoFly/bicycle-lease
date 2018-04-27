const serializeJavascript = require('serialize-javascript');
const ReactSSR = require('react-dom/server');
const asyncBootstrap = require('react-async-bootstrapper').default;
const ejs = require('ejs');
const SheetsRegistry= require('react-jss/lib/jss').SheetsRegistry;
const materialStyle = require('material-ui/styles');
const materialColor =require('material-ui/colors');


const getStoresState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {})
}

module.exports = (bundle, template, url) => {
  return new Promise((resolve, reject) => {
    const routerContext = {};
    const serverBundle = bundle.default;
    const createStoreMap = bundle.createStoreMap;
    const stores = createStoreMap();
    const theme = materialStyle.createMuiTheme({
      palette: {
        primary: materialColor.blue,
        accent: materialColor.red,
        type: 'light',
      },
    });
    const sheetsRegistry = new SheetsRegistry();
    const generateClassName = materialStyle.createGenerateClassName();
    const serverRenderContent = serverBundle(stores, routerContext, url, sheetsRegistry, theme, generateClassName);

    // 支持异步
    asyncBootstrap(serverRenderContent).then(() => {
      // 有 redirect: 发生 该对象有 url 属性
      console.log('stores->', stores.appState.count);
      if (routerContext.url) {
        resolve({
          routerContext
        })
        return false;
      }
      // ctx.body = template.replace('<!--app-->', content);
      const state = getStoresState(stores)
      console.log(stores, state);
      let content = ReactSSR.renderToString(serverRenderContent);
      const html = ejs.render(template, {
        appString: content,
        initialState: serializeJavascript(state),
        materialCSS: sheetsRegistry.toString()
      })
      // resolve(template.replace('<!--app-->', content));
      resolve(html);
    })
      .catch(err => {
        reject(err);
      })
  })
}
