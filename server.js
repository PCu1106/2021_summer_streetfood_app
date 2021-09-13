const express = require('express')
const app = express()
var path = require("path");

const hostname = '127.0.0.1';
const port = 5000

// release the limit of '/static' file
app.use('/static', express.static(__dirname + '/static'));


app.get('/', function (req, res) {
  console.log(`${__dirname+'/static'}`);
  res.sendFile(path.join(__dirname + '/templates/dist/homepage.html'));
});


app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
