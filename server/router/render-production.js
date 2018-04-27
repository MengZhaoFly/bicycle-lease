const router = require('koa-router')();

const serverEntry = require('../../dist/server-entry');
const template = fs.readFileSync(path.join(__dirname, '../../dist/server.ejs'), 'utf-8');
const routers = router
  .get('*', async (ctx) => {
    const body = await serverRender(serverEntry, template, ctx.request.url);
    const url = body && body.routerContext && body.routerContext.url;
    if (url) {
      ctx.res.statusCode = 302;
      ctx.res.setHeader('Location', url);
      return false;
    }
    ctx.body = body;
  });


module.exports = routers;
