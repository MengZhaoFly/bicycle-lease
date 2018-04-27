const Koa = require('koa');
// const Router = require('koa-router');
const mount = require('koa-mount');
const path = require('path');
const session = require('koa-session');
const { sessionConf, server } = require('./config/index');
const app = new Koa();
const staticApp = new Koa(); // 静态资源static
// const router = new Router();
const proxy = require('koa-proxy');
const crossOrigin = require('./middleware/cross-origin');
const staticServe = require("koa-static");
const routers = require('./router/index');
const isDev = process.env.NODE_ENV === 'development';
//  self signed certificate fix https
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

app.use(session(sessionConf, app));
// api/v1
app.use(crossOrigin({}));
app
  .use(routers.routes())
  .use(routers.allowedMethods());

// app.use((ctx) => {
//     ctx.set('Access-Control-Allow-Origin', '*');
// })
// 页面的render工作
if (!isDev) {
  const renderProductionRouter = require('./router/render-production');
  staticApp.use(staticServe(path.join(__dirname, '../dist')));
  app.use(mount('/public', staticApp));
  app
    .use(renderProductionRouter.routes())
    .use(renderProductionRouter.allowedMethods());

}
else {
  const renderDevelopmentRouter = require('./router/render-development');
  app.use(proxy({
    host: 'https://localhost', // proxy fe
    match: /^\/public\//        // ...just the /public
  }));
  app
    .use(renderDevelopmentRouter.routes())
    .use(renderDevelopmentRouter.allowedMethods());
}


app.listen(server.port, () => {
  console.log('server is running', isDev ? 'development' : 'production');
});
