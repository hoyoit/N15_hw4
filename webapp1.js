
var express = require('express');
var app = express();

app.get('/',function(req,res){
  res.send('hello home page!');
});

app.get('/go',function(req,res){
  res.send('Gogo!!');
});

app.listen(8082,function(){
  console.log('connected 8082 port!');
});
