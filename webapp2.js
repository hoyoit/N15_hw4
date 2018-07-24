
var express = require('express');
var app = express();

app.use(express.static('public'));
// http://127.0.0.1:8082/dt.jpg
// http://127.0.0.1:8082/static.html

app.get('/',function(req,res){
  res.send('hello home page!');
});

app.get('/go',function(req,res){
  res.send('Gogo!!');
});

app.get('/dt',function(req,res){
  res.send('hello daughter!, <img src="/dt.jpg" />');
});

app.get('/dynamic',function(req,res){

  var lis = '';
  for(var i=0;i<5;i++){
    lis = lis + '<li>coding</li>';
  }

  var time = Date();

  var output = `<html>
    <head>
      <title>dynamic page!</title>
    </head>
    <body>
      this is a dynamic page!
      <ul>
      ${lis}
      </ul>
      ${time}
    </body>
  </html>`;

  res.send(output);

});

app.get('/topic',function(req,res){ // http://127.0.0.1:8082/topic?id=10000

  res.send(req.query.id);
});

app.get('/topic2/:id',function(req,res){ // http://127.0.0.1:8082/topic2/200

  res.send(req.params.id);
});

app.listen(8082,function(){
  console.log('connected 8082 port!');
});
