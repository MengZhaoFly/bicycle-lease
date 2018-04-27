const sessionConf = {
  key: 'koa:sess',
  maxAge: 10 * 60 * 1000,
  overwrite: false,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false,
}
const mysqlConf = {
  host: 'localhost', // default 3306
  user: 'root',
  password: '123456',
  database: 'bicycle'
}
const server = {
  port: 3001
}
module.exports = {
  sessionConf,
  mysqlConf,
  server
}

