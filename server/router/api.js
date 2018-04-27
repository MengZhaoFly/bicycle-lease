const router = require('koa-router')()
const dbUtil = require('../util/db-utils');

const routers = router
  .get('/rent/list', async (ctx) => {
    const result = await dbUtil.query('SELECT * FROM `rent-history`');
    ctx.body = result;
  })

module.exports = routers
