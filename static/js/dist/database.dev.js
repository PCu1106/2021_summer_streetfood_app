"use strict";

var fs = require('fs');

var data = fs.readFileSync('D://password.txt', "utf8");
var pswd = data.toString();

var mysql = require('mysql');

var user = {
  host: '140.116.72.89',
  user: 'food',
  password: pswd,
  database: 'foodcam_test'
}; //建立連線

var connection = mysql.createConnection(user);
connection.connect(function (err) {
  if (err) {
    return console.error('error: ' + err.message);
  }

  console.log('Connected to the MySQL server.');
}); //查詢

connection.query('select * from history;', function (err, results, fields) {
  if (err) console.log("mysql error");
  console.log(results); //console.log(fields);
}); //關閉連線

connection.end(function (err) {
  if (err) {
    return console.log('error:' + err.message);
  }

  console.log('Close the database connection.');
});