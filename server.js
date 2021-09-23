var fs = require('fs');
var https = require('https');
var path = require('path');
var express = require('express');

var file = "test.db";
let {PythonShell} = require('python-shell')

//-----run these code when you are on server---------
// var keyPath = '../ssl/private.key';
// var certPath = '../ssl/certificate.pem';
// var hskey = fs.readFileSync(keyPath);
// var hscert = fs.readFileSync(certPath);
//---------------------------------------------------

var app = express();
var port = 8787;

app.use('/static', express.static(__dirname + '/static'));

//-----python shell
app.get('/python', function(req, res){
  console.log('get python')
  //set req structure
  let options = {
    args:
      [
        req.query.name,
        req.query.from,
        req.query.end
      ]
  }

  PythonShell.run('./pythonfunc/info.py', options, (err, data) => {
    if (err) res.send(err)
    const parsedString = JSON.parse(data)
    console.log(`name: ${parsedString.Name}, from: ${parsedString.From}, end: ${parsedString.end}`)
    res.json(parsedString) 
  })
})

//---------------run these code when you are local------------------------------
app.get('/', function (req, res) {
  console.log(`${__dirname+'/static'}`);
  //res.sendFile(path.join(__dirname + '/templates/dist/index.html'));
  render(path.join(__dirname + '/templates/dist/homepage.html'),  function (err, data) {
    res.send(data);
  });  
});

app.listen(port, "127.0.0.1", () => {
  console.log('Server is running on http://127.0.0.1:' + port);
});
//------------------------------------------------------------------------------

//-----run these code when you are on server-------------------------------------
// var credentials = { key:hskey, cert:hscert};
// app.get('/', function(req, res) {
//   res.sendFile(path.join(__dirname + '/templates/dist/homepage.html')); 
// });
// var server = https.createServer(credentials,app);
// server.listen(port, "foodcam.tk", function() {
//   console.log('Server is running on ' + port + ' port...');
// });
//-------------------------------------------------------------------------------

function sql() {
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);
  var sqlselect = "SELECT * FROM table3 as a INNER JOIN history_01 as b ON a.ID = b.shopID;";
  var x = 1;
  var param = {};
  db.each(sqlselect, function(err, row) {
    //console.log(row.ID + ": " + row.NAME);
    sqlgetdata(row.NAME, x, param);
    x++;
  });
  db.close();
  return param;
}

function sql_fav() {
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);
  var sqlselect = "SELECT * FROM table3 as a INNER JOIN history_01 as b ON a.ID = b.shopID AND b.favorite == 1;";
  var x = 1;
  var param = {};
  db.each(sqlselect, function(err, row) {
    //console.log("favorite " + row.ID + ": " + row.NAME);
    sqlgetdata_fav(row.NAME, x, param);
    x++;
  });
  db.close();
  return param;
}
function sqlgetdata_fav(name, x, param){
  var key = 'favorite' + x;
  var data = name.toString();
  param[key] = data;
}

function sqlgetdata(name, x, param){
  var key = 'shopname' + x;
  var data = name.toString();
  param[key] = data;
}

function wait(ms) {
  return new Promise(resolve =>setTimeout(() =>resolve(), ms));
};

function render(filename, callback) {
  fs.readFile(filename, 'utf8', async function (err, data) {
    if (err) return callback(err);
    var params = {};
    var params_fav = {};
    params = sql();
    params_fav = sql_fav();
    await wait(200);
    for (var key in params) {
      //console.log('params[' + key  + ']' + params[key]);
      block = '<div class="shop-item"><p class="shop-name" align="center">' + params[key] + '</p><p class="score">4.4</p><div class="ratings"><div class="empty_star">★★★★★</div><div class="full_star">★★★★★</div></div><p class="command">1825則評論</p><p class="phone-number">電話:06-2365768</p><p class="business-hours">營業時間:11:00-21:00</p><div class="small-block">電話</div><div class="small-block">網站</div><button onclick="save(this);" class="save-btn" value="' + params[key] + '">儲存</button></div>';
      data = data.replace('<!-- {' + key  + '} -->', block);
    }
    for (var key in params_fav) {
      //console.log('params_fav[' + key  + ']' + params_fav[key]);
      block = '<div class="shop-item"><p class="shop-name" align="center">' + params_fav[key] + '</p><p class="score">4.4</p><div class="ratings"><div class="empty_star">★★★★★</div><div class="full_star">★★★★★</div></div><p class="command">1825則評論</p><p class="phone-number">電話:06-2365768</p><p class="business-hours">營業時間:11:00-21:00</p><div class="small-block">電話</div><div class="small-block">網站</div></div>';
      data = data.replace('<!-- {' + key  + '} -->', block);
    }
    callback(null, data);
  });
};


//login
var sqlite3 = require('sqlite3').verbose()
var db_user = new sqlite3.Database("users.db");
const bodyParser = require('body-parser')

app.use(bodyParser.json({ limit: "1mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));

app.use(express.static(`${__dirname}`));

app.get('/login', (req, res) => {
  res.redirect('./templates/dist/login.html');
});

app.post('/templates/dist/login', (req, res) => {
  if (req.body.account != "" && req.body.password != "") {
    db_user.get("SELECT password FROM users WHERE account = ?", [req.body.account], function(err, row) {
        if (row == undefined) {
            res.send("帳號不存在！");
        } else if (row.password == req.body.password) {
          db_user.get("SELECT id FROM users WHERE account = ?", [req.body.account], function(err, row) {
                res.send("jump");
            })
        } else {
            res.send("密碼錯誤！");
        }
    })
  } else {
      res.send("帳號或密碼不能空白！");
  }
});
 
// list
app.post('/list', (req, res) =>{
  let pyshell = new PythonShell('./pythonfunc/dectect_picture.py');
  // send base64 string to python stdin
  pyshell.send(req.body.img_64)

  // received a message from Python script (ex:print (xxx) )
  pyshell.on('message', function (message) {
    console.log(message);
    res.send(message);
  });
  
  // end the input stream and allow the process to exit
  pyshell.end(function (err,code,signal) {
    if (err) throw err;
    console.log('The exit code was: ' + code);
    console.log('The exit signal was: ' + signal);
    console.log('finished');
  });
});

//------------------------------------------------------------------------------

//register
app.post('/templates/dist/register', (req, res) => {
  if (req.body.account != "" && req.body.password != "") {
    db_user.get("SELECT account FROM users WHERE account = ?", [req.body.account], function(err, row) {
      if (row == undefined) {
        if (req.body.passwordagain==req.body.password){
          db_user.serialize(function() {
            db_user.run("CREATE TABLE IF NOT EXISTS users (account INTEGER, password INTEGER)");
            db_user.run("INSERT INTO users (account, password) VALUES (?, ?)", [req.body.account, req.body.password]);
            });
            res.send("註冊成功！將為您跳轉到登入畫面");
        }else{
          res.send("密碼不符，請再次確認！");
        }
        
      } else {
          res.send("帳號已存在！");
        }
      })
  } else {
      res.send("帳號或密碼不能空白！");
  }
});

