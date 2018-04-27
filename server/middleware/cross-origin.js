module.exports = (option) => {
  const origin = option.origin || '*';
  const allowMethods = option.allowMethods || 'GET,POST,PUT,DELETE';
  const credentials = option.credentials || false;
  const allowHeaders = option.allowHeaders || 'X-Custom-Header';
  const exposeHeaders = option.exposeHeaders || '*';
  const maxAge = option.maxAge || 1728000;
  return async (ctx, next) => {
    ctx.set('Access-Control-Allow-Origin', origin);
    ctx.set('Access-Control-Allow-Credentials', credentials);
    ctx.set('Access-Control-Allow-Methods', allowMethods);
    // ctx.set('Access-Control-Allow-Headers', allowHeaders);
    // ctx.set('Access-Control-Expose-Headers', exposeHeaders);
    ctx.set('Access-Control-Max-Age', maxAge);
    await next();
  }
}