const sessionConf = {
  key: 'bicycle',
  maxAge: 3 * 60 * 1000,
  overwrite: true,
  httpOnly: true,
  signed: false,
  rolling: false,
  renew: false,
};
const mysqlConf = {
  host: 'localhost', // default 3306
  user: 'root',
  password: '123456',
  database: 'bicycle'
};
const server = {
  port: 3001
};
module.exports = {
  sessionConf,
  mysqlConf,
  server
};

