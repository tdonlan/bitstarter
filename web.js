var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());



app.get('/', function(request, response) {

response.send('In get method');

var buf1 = new Buffer(fs.readFileSync("./index.html");
resonse.send(buf1.toString());

console.log('In get method');

var fileBuf = fs.readFileSync('index.html');

console.log(fileBuf.toString());

 response.send(fileBuf.toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {

var buf1 = new Buffer(fs.readFileSync("./index.html");


var fileBuf = fs.readFileSync('index.html');
console.log(fileBuf.toString());

  console.log("Listening on " + port);
});
