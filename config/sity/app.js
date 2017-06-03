var express = require('express');
var app = express();

app.use(express.static(__dirname+'/../../build'));

app.listen(9002, function () {
  console.log('Start static sity on port 9002');
});

