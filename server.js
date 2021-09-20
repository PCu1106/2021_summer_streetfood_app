const express = require('express')
const app = express()
var path = require("path");

const hostname = '127.0.0.1';
const port = 5500

var fs = require("fs");
var file = "test.db";

// release the limit of '/static' file
app.use('/static', express.static(__dirname + '/static'));


app.get('/', function (req, res) {
  console.log(`${__dirname+'/static'}`);
  //res.sendFile(path.join(__dirname + '/templates/dist/index.html'));
  var sqlite3 = require("sqlite3").verbose();
  var db = new sqlite3.Database(file);
  var sqlselect = "SELECT a.NAME FROM table3 as a INNER JOIN hitstory_01 as b ON a.ID = b.shopID;";
  var x = 1;
  var param = {};
  db.each(sqlselect, function(err, row) {
    //console.log(row.ID + ": " + row.NAME);
    //add(2);
    sqlgetdata(row.NAME, x, param);
    x++;
  });
  render(path.join(__dirname + '/templates/dist/homepage.html'), param,  function (err, data) {
    res.send(data);
  });  
});

function sqlgetdata(name, x, param){
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
      console.log('params[' + key  + ']' + params[key]);
      block = '<div class="shop-item"><p class="shop-name" align="center">' + params[key] + '</p><p class="score">{score' + x + '}</p><p class="score">4.4</p><div class="ratings"><div class="empty_star">★★★★★</div><div class="full_star">★★★★★</div></div><p class="command">1825則評論</p><p class="phone-number">電話:06-2365768</p><p class="business-hours">營業時間:11:00-21:00</p><div class="small-block">電話</div><div class="small-block">網站</div><div class="small-block">儲存</div></div>';
      data = data.replace('<!-- {' + key  + '} -->', block);
      console.log(data);
      x++;
    }
    callback(null, data);
  });
}

app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});

//db.close();