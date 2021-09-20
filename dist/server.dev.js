"use strict";

var fs = require('fs');

var https = require('https');

var path = require('path');

var express = require('express'); //-----run these code when you are on server---------
// var keyPath = '../ssl/private.key';
// var certPath = '../ssl/certificate.pem';
// var hskey = fs.readFileSync(keyPath);
// var hscert = fs.readFileSync(certPath);
//---------------------------------------------------


var app = express();
var port = 8787;
app.use('/static', express["static"](__dirname + '/static')); //---------------run these code when you are local------------------------------

app.get('/', function (req, res) {
  // console.log(`${__dirname+'/static'}`);
  res.sendFile(path.join(__dirname + '/templates/dist/homepage.html'));
});
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