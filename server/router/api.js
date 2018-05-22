const router = require('koa-router')();
const moment = require('moment');
const crypto = require('crypto');

const fs = require('fs');
const path = require('path');
const stream = require('stream');
const qiniu = require('qiniu');
const momentTz = require('moment-timezone');
const dbUtil = require('../util/db-utils');
const toReadStream = require('../util/toReadstream');

const createJwt = (payload) => {
  const iat = new Date().getTime();
  const exp = iat + 120 * 60 * 1000;
  const header = {
    typ: "JWT",
    alg: "HS256"
  };
  payload = {
    ...payload,
    iat,
    exp,
    iss: "Zhao Meng",
    aud: "https://localhost",
    sub: "all"
  };
  const headerB64 = Buffer.from(JSON.stringify(header)).toString('base64');
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64');
  const unSignature = `${headerB64}.${payloadB64}`;
  const hmac = crypto.createHmac('sha256', 'bicycle');
  hmac.update(unSignature);
  const signatureB64 = Buffer.from(hmac.digest()).toString('base64');
  return {
    value: `${unSignature}.${signatureB64}`,
    payload,
    header
  };
};
// const getBody = (ctx) => {
//   return new Promise(function (resolve, reject) {
//     var data = '';
//     ctx.req.on('data', function (chunk) {
//       console.log('ing ....', chunk);
//       data += chunk;
//     })
//     ctx.req.on('end', function (chunk) {
//       console.log('end ...', chunk);
//       resolve(data);
//     })
//   })
// }
/*const handleFileStream = (ctx) => {
  return new Promise(function (resolve, reject) {
    let totalBuffer = Buffer.from([]);
    ctx.req.on('data', function (buffer) {
      console.log('receiving ...', buffer, buffer.length);
      totalBuffer = Buffer.concat([totalBuffer, buffer]);
    })
    ctx.req.on('end', function (chunk) {
      console.log('end', totalBuffer, totalBuffer.length);
      resolve(totalBuffer);
    })
  })
}*/
const routers = router
  .post('/upload', async (ctx) => {
    const file = ctx.request.body.files.file;
    console.log('file', ctx.request.body);
    let accessKey = 'Iw0Ch6DoNxzwiFR6rKWxr6y8OT_PhZcQ_SKJtZi7';
    let secretKey = 'hoTswaVQ1Idqhmi-Jc6NoRRngmjwgSXE7OtRTzaS';
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
    const options = {
      scope: 'graduation-design',
      returnBody: '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
      callbackBodyType: 'application/json'
    };
    const putPolicy = new qiniu.rs.PutPolicy(options);
    const uploadToken = putPolicy.uploadToken(mac);
    var config = new qiniu.conf.Config();
    // 空间对应的机房
    config.zone = qiniu.zone.Zone_z0;
    var formUploader = new qiniu.form_up.FormUploader(config);
    var putExtra = new qiniu.form_up.PutExtra();
    console.log('------------------------------------------------');
    // const buffer = await handleFileStream(ctx);
    const filename = `${ctx.session.userId}-${moment().format('YYYY-MM-DD~HH:mm:ss')}.png`;
    // fs.writeFileSync(filename, buffer);
    // fs.writeFileSync('123.txt', '123 test');
    const readableStream = fs.createReadStream(file.path);
    try {
      let avatarSrc = `//p7mkbgmyd.bkt.clouddn.com/${filename}`;
      let res = await dbUtil.query('UPDATE `user` SET avatarSrc = ? WHERE id = ?', [avatarSrc, ctx.request.body.fields.userId]);
      let putRes = await new Promise((resolve, reject) => {
        formUploader.putStream(uploadToken, filename, readableStream, putExtra, function (respErr,
          respBody, respInfo) {
          if (respErr) {
            reject(respErr);
          }
          resolve({
            respInfo,
            respBody
          });
        });
      });
      console.log('putRes', putRes);
      if (putRes.respInfo.statusCode === 200 && res) {
        // http:avatar.jpg
        // UPDATE `user` SET avatarSrc WHERE id = ?
        ctx.body = {
          status: 200,
          msg: 'success',
          avatarSrc,
          userId: ctx.request.body.fields.userId
        };
      }
      else {
        ctx.body = {
          status: 400,
          msg: 'failure'
        };
      }
    } catch (error) {
      console.log(error);
      ctx.body = {
        status: 500,
        msg: 'failure'
      };
    }


  })
  .get('/rent/list', async (ctx) => {
    const { userId } = ctx.request.query;
    let result = await dbUtil.query('SELECT * FROM `rent-history` WHERE userID = ?', [userId]);
    // 时间格式化
    result && result.forEach(list => {
      if (list.beginTime) {
        list.beginTime = momentTz.tz(list.beginTime, 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
      }
      if (list.endTime) {
        list.endTime = momentTz.tz(list.endTime, 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
      }
    });
    ctx.body = result;
  })
  .get('/bicycle/list', async (ctx) => {
    let result = await dbUtil.query('SELECT * FROM `bicycle` WHERE isUsing="n" and isBad="n"');
    ctx.body = result;
  })
  .get('/sign/auth', async (ctx) => {
    console.log('session', ctx.session);
    if (ctx.session.userId) {
      ctx.body = {
        status: 200,
        userId: ctx.session.userId
      };
      return false;
    }
    const jwt = ctx.request.headers && ctx.request.headers['authorization'];
    console.log('jwt auth', jwt);
    if (!jwt || (jwt && jwt.split('.').length !== 3)) {
      ctx.body = {
        status: 401,
        keepLogin: false
      };
      return false;
    }
    const [headerB64, payloadB64, signatureB64] = jwt.split('.');
    try {
      const header = JSON.parse(Buffer.from(headerB64, 'base64').toString());
      const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString());
      const { userId, exp } = payload;
      if (exp < new Date().getTime()) {
        ctx.body = {
          status: 401,
          msg: 'timeout'
        };
        return false;
      }
      const { alg } = header;
      if (alg && alg === 'HS256') {
        const authheaderB64 = Buffer.from(JSON.stringify(header)).toString('base64');
        const authpayloadB64 = Buffer.from(JSON.stringify(payload)).toString('base64');
        const unSignature = `${authheaderB64}.${authpayloadB64}`;
        const hmac = crypto.createHmac('sha256', 'bicycle');
        hmac.update(unSignature);
        const authsignatureB64 = Buffer.from(hmac.digest()).toString('base64');
        let result = await dbUtil.query('SELECT * FROM `user` WHERE id= ?', userId);
        if (authsignatureB64 === signatureB64 && result.length > 0) {
          ctx.body = {
            status: 200,
            userId,
            avatarSrc: result[0].avatarSrc
          };
        }
        else {
          ctx.body = {
            status: 401,
            msg: 'auth failed'
          };
        }
      }
    } catch (error) {
      console.log(error);
      ctx.body = {
        status: 401
      };
    }
  })
  .post('/sign/up', async (ctx) => {
    try {
      // let data = await getBody(ctx);
      // data = JSON.parse(data);
      let data = ctx.request.body;
      let arr = Object.keys(data).map(key => data[key]);
      let result = await dbUtil.insert(
        'INSERT INTO `user` (phoneNum, `PASSWORD`) VALUES (?, ?)',
        [data.phoneNum, data.password]);
      ctx.body = ctx.req;
      ctx.body = {
        status: 200,
        msg: '注册成功'
      };
    } catch (error) {
      ctx.body = {
        status: 500,
        msg: '注册失败'
      };
    }
  })
  .post('/sign/in', async (ctx) => {
    try {
      // let data = await getBody(ctx);
      // data = JSON.parse(data);
      let data = ctx.request.body;
      console.log('/sign/in', data);
      let result = await dbUtil.query('SELECT * FROM `user` WHERE phoneNum=? and `passWord`=?', [data.phoneNum, data.password]);
      console.log('/sign/in-------->', result.length, result);
      if (result.length >= 1) {
        const { payload, header, value } = createJwt({
          userId: result[0].id
        });
        console.log(payload, header, value);
        const maxAge = moment.utc(payload.exp).format();
        console.log('maxAge------->', maxAge, momentTz.tz(maxAge, 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss'));
        // ctx.cookies.set('jwt', value, {
        //   domain: 'https://192.168.1.103',
        //   maxAge: payload.exp
        // })
        ctx.session.userId = result[0]['id'];
        ctx.body = {
          status: 200,
          userID: result[0]['id'],
          phoneNum: result[0]['phoneNum'],
          avatarSrc: result[0]['avatarSrc'],
          jwt: value,
          msg: '登录成功'
        };
      }
      else {
        ctx.body = {
          status: 400,
          msg: '登录失败'
        };
      }

    }
    catch (error) {
      console.log(error);
      ctx.body = {
        status: 500,
        msg: '登录失败'
      };
    }
  })
  .get('/using/status', async (ctx) => {
    const { userId } = ctx.request.query;
    let body = {
      status: 500,
      isUsing: false,
      haveUsedTime: 0
    };
    try {
      const queryBicycle = await dbUtil.query('SELECT bicycleID FROM `rent-history` WHERE userID = ?', userId);
      let queryBicycleCount = queryBicycle.length;
      console.log('queryBicycle', queryBicycle);
      if (!queryBicycle || queryBicycleCount === 0) {
        body.status = 200;
        ctx.body = body;
      }
      const bicycleId = queryBicycle[queryBicycleCount - 1].bicycleID;
      const bicycleIdRes = await dbUtil.query('SELECT * FROM `bicycle` WHERE isUsing = "y" and id = ?', [bicycleId]);
      const userIdRes = await dbUtil.query('SELECT * FROM `rent-history` WHERE endTime IS NULL AND bicycleID = ? AND userID = ?', [bicycleId, userId]);
      // console.log('bicycleIdRes', bicycleIdRes, 'userIdRes', userIdRes);
      if (bicycleIdRes.length === 0) {
        body.status = 200;
        ctx.body = body;
      }
      if (bicycleIdRes.length >= 1 && userIdRes.length >= 1) {
        let currentTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let beginTime = momentTz.tz(userIdRes[0]['beginTime'], 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');
        const diff = moment.duration(moment(currentTime).diff(moment(beginTime)));
        // console.log(currentTime, beginTime, haveUsedTime);
        const hours = parseInt(diff.asHours());
        let minutes = parseInt(diff.asMinutes());
        minutes = minutes - hours * 60;
        let second = parseInt(diff.asSeconds());
        second = second - (hours * 60 * 60 + minutes * 60);
        const haveUsedTime = [hours, minutes, second];
        console.log(currentTime, beginTime, haveUsedTime);
        body.status = 200;
        body.isUsing = true;
        body.haveUsedTime = haveUsedTime;
        body.beginTime = beginTime;
        body.bicycleId = bicycleId;
        ctx.body = body;
      }
    } catch (error) {
      console.log('/using/status  error-----------------------');
      ctx.body = body;
    }
  })
  .post('/user/edit', async (ctx) => {
    console.log(ctx.request.body);
    const {passWord, userId} = ctx.request.body;
    try {
      let res = await dbUtil.query('UPDATE `user` SET `passWord` = ? WHERE id = ?', [passWord, userId]);
      console.log(res);
      if (res && res.affectedRows > 0) {
        ctx.body = {
          status: 200
        };
      }
    } catch (error) {
      console.log(error);
    }
  })
  .post('/using/create', async (ctx) => {
    try {
      // let data = await getBody(ctx);
      // data = JSON.parse(data);
      let data = ctx.request.body;
      if (data.userId && data.bicycleId) {
        let beginTime = moment().format('YYYY-MM-DD HH:mm:ss');
        let result = await dbUtil.transAction([
          {
            sql: 'UPDATE bicycle SET isUsing = "y" WHERE id = ?',
            value: data.bicycleId
          },
          {
            sql: 'INSERT INTO `rent-history` (`bicycleId`, `userId`, `beginTime`) VALUES (?, ?, ?)',
            value: [data.bicycleId, data.userId, beginTime]
          }
        ]);
        console.log('result', result);
        ctx.body = {
          status: 200,
          beginTime: beginTime,
          msg: '用车成功'
        };
      }
      else {
        ctx.body = {
          status: 400,
          msg: 'params required'
        };
      }
    } catch (error) {
      console.log('/using/create-------------------', error);
      ctx.body = {
        status: 500,
        msg: 'server error'
      };
    }
  })
  .post('/using/close', async (ctx) => {
    try {
      // let data = await getBody(ctx);
      // data = JSON.parse(data);
      let data = ctx.request.body;
      console.log('/using/close', data);
      const endTime = moment().format('YYYY-MM-DD HH:mm:ss');
      let result = await dbUtil.transAction([
        {
          sql: 'UPDATE `rent-history` SET endTime = ?, pay = ? WHERE endTime IS NULL AND bicycleID = ? and userID = ?',
          value: [endTime, data.pay, data.bicycleId, data.userId]
        },
        {
          sql: 'UPDATE bicycle SET isUsing = "n" WHERE id = ?',
          value: [data.bicycleId]
        }
      ]);
      console.log('result', result);
      ctx.body = {
        status: 200,
        endTime: endTime,
        msg: '还车成功'
      };
    } catch (error) {
      ctx.body = {
        status: 500,
        msg: '还车失败'
      };
    }
  });

module.exports = routers;
