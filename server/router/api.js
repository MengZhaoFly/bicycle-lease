const router = require('koa-router')();
const moment = require('moment-timezone');
const dbUtil = require('../util/db-utils');
const getBody = (ctx) => {
  return new Promise(function (resolve, reject) {
    var data = '';
    ctx.req.on('data', function (chunk) {
      data += chunk;
    })
    ctx.req.on('end', function (chunk) {
      resolve(data);
    })
  })
}
const routers = router
  .get('/rent/list', async (ctx) => {
    let result = await dbUtil.query('SELECT * FROM `rent-history`');
    // 时间格式化
    result && result.forEach(list => {
      if (list.beginTime) {
        list.beginTime = moment.tz(list.beginTime, 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
      }
      if (list.endTime) {
        list.endTime = moment.tz(list.endTime, 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
      }
    })
    ctx.body = result;
  })
  .post('/sign/up', async (ctx) => {
    try {
      let data = await getBody(ctx);
      data = JSON.parse(data);
      let arr = Object.keys(data).map(key => data[key]);
      let result = await dbUtil.insert(
        'INSERT INTO `user` (phoneNum, `PASSWORD`) VALUES (?, ?)',
        [data.phoneNum, data.password]);
      ctx.body = ctx.req;
      ctx.body = {
        status: 200,
        msg: '注册成功'
      }
    } catch (error) {
      ctx.body = {
        status: 500,
        msg: '注册失败'
      }
    }
  })
  .post('/sign/in', async (ctx) => {
    try {
      let data = await getBody(ctx);
      data = JSON.parse(data);
      let result = await dbUtil.query('SELECT * FROM `user` WHERE phoneNum=? and `passWord`=?', [data.phoneNum, data.password]);
      console.log(result);
      if (result.length >= 1) {
        ctx.body = {
          status: 200,
          msg: '登录成功'
        }
      }
      else {
        ctx.body = {
          status: 400,
          msg: '登录失败'
        }
      }

    }
    catch (error) {
      ctx.body = {
          status: 500,
          msg: '登录失败'
        }
    }
  })

module.exports = routers
