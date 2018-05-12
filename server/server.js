const https = require('https');
const fs = require('fs');
const Koa = require('koa');
// const Router = require('koa-router');
const mount = require('koa-mount');
const koaBody = require('koa-body');
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
// const isDev = process.env.NODE_ENV === 'development';
const isDev = 'development';
//  self signed certificate fix https
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const options = {
  key: fs.readFileSync(path.join(__dirname, './ssl/server.key')),
  cert: fs.readFileSync(path.join(__dirname, './ssl/server.crt'))
};
app.use(session(sessionConf, app));
app.use(koaBody({ multipart: true }));
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

https.createServer(options, app.callback()).listen(server.port);
// app.listen(server.port, () => {
//   console.log('server is running', isDev ? 'development' : 'production');
// });
