const router = require('koa-router')();
const devStatic = require('../util/dev-static');
const routers = router
  .get('*', async (ctx) => {
    const body = await devStatic(ctx.request.url);
    const url = body && body.routerContext && body.routerContext.url;
    if (url) {
      ctx.res.statusCode = 302;
      ctx.res.setHeader('Location', url);
      return false;
    }
    ctx.body = body;
  });


module.exports = routers;
