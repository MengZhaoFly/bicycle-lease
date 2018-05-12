const Koa = require('koa');
const app = new Koa();
app.use(async (ctx) => {
    ctx.body="123"
})
app.listen(400, () => {
    console.log('server is running 400');
})