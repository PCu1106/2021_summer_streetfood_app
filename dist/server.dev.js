"use strict";

var fs = require('fs');

var https = require('https');

var path = require('path');

var express = require('express');

var file = "test.db"; //-----run these code when you are on server---------
// var keyPath = '../ssl/private.key';
// var certPath = '../ssl/certificate.pem';
// var hskey = fs.readFileSync(keyPath);
// var hscert = fs.readFileSync(certPath);
//---------------------------------------------------

var app = express();
var port = 8787;
app.use('/static', express["static"](__dirname + '/static')); //---------------run these code when you are local------------------------------

app.get('/', function (req, res) {
  console.log("".concat(__dirname + '/static')); //res.sendFile(path.join(__dirname + '/templates/dist/index.html'));

  var sqlite3 = require("sqlite3").verbose();

  var db = new sqlite3.Database(file);
  var sqlselect = "SELECT a.NAME FROM table3 as a INNER JOIN hitstory_01 as b ON a.ID = b.shopID;";
  var x = 1;
  var param = {};
  db.each(sqlselect, function (err, row) {
    //console.log(row.ID + ": " + row.NAME);
    //add(2);
    sqlgetdata(row.NAME, x, param);
    x++;
  });
  render(path.join(__dirname + '/templates/dist/homepage.html'), param, function (err, data) {
    res.send(data);
  });
});

function sqlgetdata(name, x, param) {
  var key = 'shopname' + x;
  var data = name.toString();
  param[key] = data;
}

function render(filename, params, callback) {
  fs.readFile(filename, 'utf8', function (err, data) {
    console.log('render');
    if (err) return callback(err);
    var x = 1;

    for (var key in params) {
      console.log('params[' + key + ']' + params[key]);
      block = '<div class="shop-item"><p class="shop-name" align="center">' + params[key] + '</p><p class="score">{score' + x + '}</p><p class="score">4.4</p><div class="ratings"><div class="empty_star">★★★★★</div><div class="full_star">★★★★★</div></div><p class="command">1825則評論</p><p class="phone-number">電話:06-2365768</p><p class="business-hours">營業時間:11:00-21:00</p><div class="small-block">電話</div><div class="small-block">網站</div><div class="small-block">儲存</div></div>';
      data = data.replace('<!-- {' + key + '} -->', block);
      console.log(data);
      x++;
    }

    callback(null, data);
  });
}

app.listen(port, "127.0.0.1", function () {
  console.log('Server is running on http://127.0.0.1:' + port);
}); //------------------------------------------------------------------------------
//-----run these code when you are on server---------
// var credentials = { key:hskey, cert:hscert};
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname + '/templates/dist/homepage.html')); 
// });
// var server = https.createServer(credentials,app);
// server.listen(port, "foodcam.tk", function() {
//   console.log('Server is running on ' + port + ' port...');
// });
//---------------------------------------------------