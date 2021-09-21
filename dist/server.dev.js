"use strict";

var fs = require('fs');

var https = require('https');

var path = require('path');

var express = require('express');

var file = "test.db";

var _require = require('python-shell'),
    PythonShell = _require.PythonShell; //-----run these code when you are on server---------
// var keyPath = '../ssl/private.key';
// var certPath = '../ssl/certificate.pem';
// var hskey = fs.readFileSync(keyPath);
// var hscert = fs.readFileSync(certPath);
//---------------------------------------------------


var app = express();
var port = 8787;
app.use('/static', express["static"](__dirname + '/static')); //-----python shell

app.get('/python', function (req, res) {
  console.log('get python'); //set req structure

  var options = {
    args: [req.query.name, req.query.from, req.query.end]
  };
  PythonShell.run('./pythonfunc/info.py', options, function (err, data) {
    if (err) res.send(err);
    var parsedString = JSON.parse(data);
    console.log("name: ".concat(parsedString.Name, ", from: ").concat(parsedString.From, ", end: ").concat(parsedString.end));
    res.json(parsedString);
  });
}); //---------------run these code when you are local------------------------------

app.get('/', function (req, res) {
  console.log("".concat(__dirname + '/static')); //res.sendFile(path.join(__dirname + '/templates/dist/index.html'));

  render(path.join(__dirname + '/templates/dist/homepage.html'), function (err, data) {
    res.send(data);
  });
});

function sql() {
  var sqlite3 = require("sqlite3").verbose();

  var db = new sqlite3.Database(file);
  var sqlselect = "SELECT * FROM table3 as a INNER JOIN hitstory_01 as b ON a.ID = b.shopID;";
  var x = 1;
  var param = {};
  db.each(sqlselect, function (err, row) {
    console.log(row.ID + ": " + row.NAME);
    sqlgetdata(row.NAME, x, param);
    x++;
  });
  db.close();
  console.log(param);
  return param;
}

function sqlgetdata(name, x, param) {
  var key = 'shopname' + x;
  var data = name.toString();
  param[key] = data;
}

function wait(ms) {
  return new Promise(function (resolve) {
    return setTimeout(function () {
      return resolve();
    }, ms);
  });
}

;

function render(filename, callback) {
  fs.readFile(filename, 'utf8', function _callee(err, data) {
    var params, x, key;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (!err) {
              _context.next = 2;
              break;
            }

            return _context.abrupt("return", callback(err));

          case 2:
            params = {};
            params = sql();
            x = 1;
            console.log(params);
            _context.next = 8;
            return regeneratorRuntime.awrap(wait(200));

          case 8:
            for (key in params) {
              console.log('params[' + key + ']' + params[key]);
              block = '<div class="shop-item"><p class="shop-name" align="center">' + params[key] + '</p><p class="score">{score' + x + '}</p><p class="score">4.4</p><div class="ratings"><div class="empty_star">★★★★★</div><div class="full_star">★★★★★</div></div><p class="command">1825則評論</p><p class="phone-number">電話:06-2365768</p><p class="business-hours">營業時間:11:00-21:00</p><div class="small-block">電話</div><div class="small-block">網站</div><div class="small-block">儲存</div></div>';
              data = data.replace('<!-- {' + key + '} -->', block);
              x++;
            }

            callback(null, data);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    });
  });
}

;
app.listen(port, "127.0.0.1", function () {
  console.log('Server is running on http://127.0.0.1:' + port);
}); //login

var sqlite3 = require('sqlite3').verbose();

var db_user = new sqlite3.Database("users.db");

var bodyParser = require('body-parser');

app.use(bodyParser.json({
  limit: "1mb",
  extended: true
}));
app.use(bodyParser.urlencoded({
  limit: "1mb",
  extended: true
}));
app.use(express["static"]("".concat(__dirname)));
app.get('/login', function (req, res) {
  res.redirect('./templates/dist/login.html');
});
app.post('/templates/dist/login', function (req, res) {
  if (req.body.account != "" && req.body.password != "") {
    db_user.get("SELECT password FROM users WHERE account = ?", [req.body.account], function (err, row) {
      if (row == undefined) {
        res.send("帳號不存在！");
      } else if (row.password == req.body.password) {
        db_user.get("SELECT id FROM users WHERE account = ?", [req.body.account], function (err, row) {
          res.send("jump");
        });
      } else {
        res.send("密碼錯誤！");
      }
    });
  } else {
    res.send("帳號或密碼不能空白！");
  }
}); //register

app.post('/templates/dist/register', function (req, res) {
  if (req.body.account != "" && req.body.password != "") {
    db_user.get("SELECT account FROM users WHERE account = ?", [req.body.account], function (err, row) {
      if (row == undefined) {
        if (req.body.passwordagain == req.body.password) {
          db_user.serialize(function () {
            db_user.run("CREATE TABLE IF NOT EXISTS users (account INTEGER, password INTEGER)");
            db_user.run("INSERT INTO users (account, password) VALUES (?, ?)", [req.body.account, req.body.password]);
          });
          res.send("註冊成功！將為您跳轉到登入畫面");
        } else {
          res.send("密碼不符，請再次確認！");
        }
      } else {
        res.send("帳號已存在！");
      }
    });
  } else {
    res.send("帳號或密碼不能空白！");
  }
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