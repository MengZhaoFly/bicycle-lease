const mysql = require('mysql2');
const { mysqlConf } = require('../config/index');
const pool = mysql.createPool(mysqlConf);
let query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        resolve(err)
      } else {
        connection.query(sql, values, (err, rows) => {
          if (err) {
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })

};
module.exports = {
  query
}
