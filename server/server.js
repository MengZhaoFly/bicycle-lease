const Koa = require('koa');
const Router = require('koa-router');
const mount = require('koa-mount');
const ReactSSR = require('react-dom/server');
const path = require('path');
const fs = require('fs');
const getTemplate = require('./util/getBody');
const app = new Koa();
const staticApp = new Koa(); // 静态资源static
const router = new Router();

const staticServe = require("koa-static");
const isDev = process.env.NODE_ENV === 'development';
console.log(isDev ? 'development' : 'production');
if (!isDev) {
  const serverEntry = require('../dist/server-entry').default;
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8');
  staticApp.use(staticServe(path.join(__dirname, '../dist')));
  app.use(mount('/public', staticApp));
  router.get('*', (ctx) => {
    let appString = ReactSSR.renderToString(serverEntry);
    ctx.body = template.replace('<!--app-->', appString);
  });
}
else {
  const devStatic = require('./util/dev-static');
  router.get('/', async (ctx) => {
    console.log('----url :  ', ctx.request.url);
    const body = await devStatic();
    ctx.body = body;
  });
  // 遇到public开头的文件 proxy 到 127.0.0.1:8888 请求
  /* todo : /public/sockjs.js.map  会请求一个map文件 404 error  待处理
  */
  router.get('/public/*', async (ctx) => {
    const url = ctx.request.url;
    const body = await new Promise((resolve, reject) => {
      getTemplate(url)
        .then(template => {
          resolve(template);
        })
        .catch(err => {
          reject(err);
        });
    });
    ctx.body = body;
    console.log('----url :  ', ctx.request.url);
  });

}
app
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3001, () => {
  console.log('server is start');
});
