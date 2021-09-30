var fs = require('fs');
var https = require('https');
var path = require('path');
var express = require('express');
var file = "shopdata.db";
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
var sqlite3 = require('sqlite3').verbose()
var userid = "01";
var paramname = {};
var paramsid = {};
var paramsrating = {};
var paramscomment = {};
var paramsnumber = {};
var paramsweb = {};

function sql_fav() {
  var db = new sqlite3.Database(file);
  var sqlselect = "SELECT * FROM shop as a INNER JOIN history_" + userid + " as b ON a.ID = b.shopID AND b.favorite == 1;";
  var x = 1;
  var param = {};
  db.each(sqlselect, function(err, row) {
    for (var key in paramname) {
      if(paramname[key] == row.name) {
        param[x] = key;
        break;
      }
    }
    x++;
    //console.log(row.name);
  });
  db.close();
  return param;
}

function sql() {
  var db = new sqlite3.Database(file);
  var sqlselect = "SELECT * FROM shop as a INNER JOIN history_" + userid + " as b ON a.ID = b.shopID;";
  var x = 1;
  console.log(userid);
  db.each(sqlselect, function(err, row) {
    //console.log(row.ID + ": " + row.NAME);
    paramname[x] = row.name.toString();
    paramsid[x] = row.ID;
    paramsrating[x] = row.rating;
    paramscomment[x] = row.comment;
    paramsnumber[x] = row.number;
    paramsweb[x] = row.web;
    x++;
  });
  db.close();
}

function wait(ms) {
  return new Promise(resolve =>setTimeout(() =>resolve(), ms));
};

function render(filename, callback) {
  fs.readFile(filename, 'utf8', async function (err, data) {
    if (err) return callback(err);
    var params_fav = {};
    sql();
    params_fav = sql_fav();
    await wait(1000);
    for (var key in paramname) {
      block = '<div class="shop-item">\
                <p class="shop-name" align="center">' + paramname[key] + '</p>\
                <p class="score">' + paramsrating[key] + '</p>\
                <div class="ratings">\
                <div class="empty_star">★★★★★</div>\
                <div style="width: ' + paramsrating[key] * 20 + '%;position: absolute;left: 0;top: 0;white-space: nowrap;overflow: hidden;color: #D56A16;">★★★★★</div>\
                </div>\
                <p class="command">' + paramscomment[key] + '則評論</p>\
                <p class="phone-number">電話:' + paramsnumber[key] + '</p>\
                <p class="business-hours">營業時間:11:00-21:00</p>\
                <div class="control_btn">\
                  <a href="tel:' + paramsnumber[key] + '">撥打電話</a>\
                  <a href="' + paramsweb[key] + '">網站</a>\
                  <button onclick="save(this);" class="save-btn" value="' + paramsid[key] + '">儲存</button>\
                </div>\
              </div>';
      data = data.replace('<!-- {shopname' + key  + '} -->', block);
    }
    for (var key_fav in params_fav) {
      //console.log('params_fav[' + key_fav  + ']' + params_fav[key_fav]);
      var key = params_fav[key_fav];
      block = '<div class="shop-item">\
                <p class="shop-name" align="center">' + paramname[key] + '</p>\
                <p class="score">' + paramsrating[key] + '</p>\
                <div class="ratings">\
                <div class="empty_star">★★★★★</div>\
                <div style="width: ' + paramsrating[key] * 20 + '%;position: absolute;left: 0;top: 0;white-space: nowrap;overflow: hidden;color: #D56A16;">★★★★★</div>\
                </div>\
                <p class="command">' + paramscomment[key] + '</p>\
                <p class="phone-number">電話:' + paramsnumber[key] + '</p>\
                <p class="business-hours">營業時間:11:00-21:00</p>\
                <div class="control_btn">\
                  <a href="tel:' + paramsnumber[key] + '">撥打電話</a>\
                  <a href="' + paramsweb[key] + '">網站</a>\
                </div>\
              </div>';
      data = data.replace('<!-- {favorite' + key  + '} -->', block);
    }
    callback(null, data);
  });
};
//save
const bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.post('/save', urlencodedParser, (req, res) => {
  if (req.body.id != ""){
    console.log('favorite: ' + req.body.id);
    var db = new sqlite3.Database(file);
    var sql = "UPDATE history_" + userid + " SET favorite = 1 WHERE shopID = " + req.body.id + ";";
    db.run(sql);
    db.close();
    res.send(req.body.id);
  }
});
//save(從restaurant-list按下"儲存"button後將店家名稱存進我的最愛)
app.post('/saveToFav', urlencodedParser, (req, res) =>{
  console.log('shop name: ' + req.body.name)
  //交給db寫後面
});

//login
var db_user = new sqlite3.Database("users.db");

app.use(bodyParser.json({ limit: "1mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "1mb", extended: true }));

app.use(express.static(`${__dirname}`));

app.get('/login', (req, res) => {
  res.redirect('./templates/dist/login.html');
});

app.post('/templates/dist/login', (req, res) => {
  if (req.body.account != "" && req.body.password != "") {
    userid = req.body.account;
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

async function put_into_history(final_list) {
  var db = new sqlite3.Database(file);
  var time = "營業時間:11:00-21:00";
  var result = []; //陣列，每一格儲存一間店的所有資訊
  for (var i=0; i < final_list.length; i++) {
    var sqlselect = "SELECT * FROM shop WHERE name = '" + final_list[i] + "';";
    db.get(sqlselect, function(err, row) {
      if(row) {
        var sql = "INSERT INTO history_" + userid + " (shopID, favorite) VALUES (" + row.ID + ",0);";
        db.run(sql);
        var obj = JSON.stringify ({
          id: row.ID,
          name: row.name,
          score: row.rating,
          command: row.comment,
          phone: row.number,
          time: time,
          website: row.web
        })
        result.push(obj);
      }     
    });      
  }    
  db.close();
  return result;
}

// list
app.post('/list', async (req, res) =>{
  let pyshell = new PythonShell('./pythonfunc/dectect_picture.py');
  // send base64 string to python stdin
  console.log('send data to python shell');
  pyshell.send(req.body.img_64);
  // received a message from Python script (ex:print (xxx) )
  pyshell.on('message', async function (message) {
    console.log('received store name list');
    console.log(`type is : ${typeof message}`);
    console.log(message);
    // message內容為 b'["\uXXXX\uXXXX..\uXXXX","\u...\u"]' 型態為string
    // 用正規表示式對 \uXXXX (Unicode)做decode
    let tmp = message.replace( /\\u([a-fA-F0-9]{4})/g, function(g, m1) {
      return String.fromCharCode(parseInt(m1, 16));
    })
    // 針對decode完的結果做刪減並型態轉換
    // ex: string [ '"飽芝林關東煮"', '"個別指導明光義塾 台南後甲教室"' ]
    //  => array ['飽芝林關東煮', '個別指導明光義塾 台南後甲教室'] 
    const final_list = tmp.substring(1,tmp.length-1).replace(/\"/g,'').split(',');
    console.log(final_list);
    var result = [];
    result = await put_into_history(final_list);
    // 最後打包成json型態回傳
    await wait(1000);
    console.log('result');
    console.log(result);
    res.json(result);
    console.log('json finish');
  });  
  // end the input stream and allow the process to exit
  await wait(1000);
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
            var db = new sqlite3.Database(file);
            db.run("create table history_" + req.body.account + "(shopID, favorite);");
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