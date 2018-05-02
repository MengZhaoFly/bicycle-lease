const mysql = require('mysql2');
const { mysqlConf } = require('../config/index');
const pool = mysql.createPool(mysqlConf);
let query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        resolve(err)
      } else {
        // values = values.map(value => connection.escape(value));
        console.log('execute sql', sql, values);
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
let insert = function (sql, values) {
  console.log(sql, values);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        resolve(err)
      } else {
        connection.execute(sql, values, (err, rows) => {
          if (err) {
            console.log(err);
            reject(err)
          } else {
            resolve(rows)
          }
          connection.release()
        })
      }
    })
  })
}
module.exports = {
  query,
  insert
}
