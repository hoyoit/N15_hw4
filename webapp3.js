
var express = require('express');
var app = express();

var mysql = require('mysql');

app.use(express.static('public'));

var conn = mysql.createConnection({
  host : '127.0.0.1',
  user : 'root',
  password : 'p@ssWord',
  database : 'N15',
  multipleStatements: true
});

conn.connect();

app.get('/boardlist',function(req,res){

  //var sql = 'select * from TDABoard;';
  var sql = `
  select A.BoardSeq,
         (case A.BoardKind when 3001 then "정치"
                           when 3002 then "경제"
                           when 3003 then "IT"
                           else "?"
                           end
         ) as BoardKindName,
         A.Title,
         date_format(A.RegDateTime,"%Y-%m-%d %H:%i:%s") as RegDateTime

    from TDABoard as A
   order by A.RegDateTime desc
    ;`;

  conn.query(sql,function(err,rows,fields){

    if(err){
      console.log(err);
    }
    else {

      res.send(rows);

    }
  });

  //res.render('list');
});

app.listen(8082,function(){
  console.log('connected 8082 port!');
});
