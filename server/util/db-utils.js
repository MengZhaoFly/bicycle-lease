const mysql = require('mysql2');
const { mysqlConf } = require('../config/index');
const pool = mysql.createPool(mysqlConf);
let query = function (sql, values) {
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        resolve(err);
      } else {
        // values = values.map(value => connection.escape(value));
        console.log('execute sql', sql, values);
        connection.query(sql, values, (err, rows) => {
          if (err) {
            console.log('db util query err', err);
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });

};
let insert = function (sql, values) {
  console.log(sql, values);
  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        resolve(err);
      } else {
        connection.execute(sql, values, (err, rows) => {
          if (err) {
            console.log(err);
            reject(err);
          } else {
            resolve(rows);
          }
          connection.release();
        });
      }
    });
  });
};
let transAction = function (argument) {
  let allResults = [];

  return new Promise((resolve, reject) => {
    pool.getConnection(function (err, connection) {
      if (err) {
        reject(err);
      }
      const transArgument = (sqlArr) => {
        sqlArr = Array.from(sqlArr);
        console.log('sqlArr------------------------->', sqlArr);
        if (sqlArr.length < 1) {
          return connection.commit(function (err) {
            if (err) {
              return connection.rollback(function () {
                throw err;
              });
            }
            resolve(allResults);
          });
        }
        else {
          let currentSql = sqlArr.shift();
          console.log('currentSql->>>>>>>>>>>>>>>>>>>>>>>>', currentSql);
          return connection.query(currentSql.sql, currentSql.value, function (error, results, fields) {
            if (error) {
              return connection.rollback(function () {
                reject(err);
              });
            }
            else {
              allResults.push(results);
              console.log('this results=========================', results);
              return transArgument(sqlArr);
            }
          });
        }
      };
      connection.beginTransaction(err => {
        argument = Array.from(argument);
        if (err) reject(err);
        transArgument(argument);
      });
    });
  });
};
module.exports = {
  query,
  insert,
  transAction
};
