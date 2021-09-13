"use strict";

var express = require('express');

var app = express();

var path = require("path");

var hostname = '127.0.0.1';
var port = 5000; // release the limit of '/static' file

app.use('/static', express["static"](__dirname + '/static'));
app.get('/', function (req, res) {
  console.log("".concat(__dirname + '/static'));
  res.sendFile(path.join(__dirname + '/templates/dist/homepage.html'));
});
app.listen(port, hostname, function () {
  console.log("Server running at http://".concat(hostname, ":").concat(port, "/"));
});