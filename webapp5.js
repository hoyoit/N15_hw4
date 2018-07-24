
var express = require('express');
var app = express();

var bodyParser = require('body-parser');

var mysql = require('mysql');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

app.set('view engine','ejs');
app.set('views','./views');

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

      //res.send(rows);
      res.render('boardlist',{boardlist:rows});

    }
  });

});

app.get('/boardinfo/:id',function(req,res){

  var sql = `
  select A.BoardSeq,
         (case A.BoardKind when 3001 then "정치"
                           when 3002 then "경제"
                           when 3003 then "IT"
                           else "?"
                           end
         ) as BoardKindName,
         A.Title,
         A.Content,
         date_format(A.RegDateTime,"%Y-%m-%d %H:%i:%s") as RegDateTime

    from TDABoard as A
   where A.BoardSeq = ${req.params.id}
   order by A.RegDateTime desc
    ;`;

  conn.query(sql,function(err,rows,fields){

    if(err){
      console.log(err);
    }
    else {

      res.render('boardinfo',{boardinfo:rows});

    }
  });

});

app.get('/boardedit/:id',function(req,res){
  //req.params.id

  var sql = `
  select A.BoardSeq,
         A.BoardKind,
         (case A.BoardKind when 3001 then "정치"
                           when 3002 then "경제"
                           when 3003 then "IT"
                           else "?"
                           end
         ) as BoardKindName,
         A.Title,
         A.Content,
         date_format(A.RegDateTime,"%Y-%m-%d %H:%i:%s") as RegDateTime,
         A.RegEmpSeq

    from TDABoard as A
   where A.BoardSeq = ${req.params.id}
   order by A.RegDateTime desc
    ;

  select EmpSeq, EmpName from TDAEmp order by EmpName`;

  conn.query(sql,function(err,rows,fields){

    if(err){
      console.log(err);
    }
    else {
      res.render('boardedit',{boardinfo:rows[0],empinfo:rows[1]});
    }
  });

});

app.get('/boardadd',function(req,res){

  var sql = `
  select EmpSeq, EmpName from TDAEmp order by EmpName`;

  conn.query(sql,function(err,rows,fields){

    if(err){
      console.log(err);
    }
    else {

      console.log('rows',rows);

      res.render('boardadd',{emplist:rows});

    }
  });

});

app.get('/boarddelete/:id',function(req,res){

  var boardseq = req.params.id;
  var sql = 'delete from TDABoard where BoardSeq = ?';

  conn.query(sql,[boardseq],function(err,rows,fields){

    if(err){
      console.log(err);
    }
    else {
      res.redirect('/boardlist');
    }
  });
});

app.post('/boardsave',function(req,res){

  var boardseq = req.body.boardseq;
  var boardkind = req.body.boardkind;
  var title = req.body.title;
  var content = req.body.content;
  var regempseq = req.body.regempseq;

  var sql = '';

  if ( boardseq == 0 ) {

    sql = `insert into TDABoard (BoardKind,Title,Content,RegEmpSeq,RegDateTime) select ?,?,?,?,now();`;

    conn.query(sql,[boardkind,title,content,regempseq],function(err,rows,fields){

      if(err){
        console.log(err);
      }
      else {
        res.redirect('/boardinfo/'+rows.insertId);
      }
    });
  }
  else {

    sql = `
    update TDABoard
       set BoardKind = ?, Title = ?, Content = ?, RegEmpSeq = ?, RegDateTime = now()
     where BoardSeq = ?;
     `;

     conn.query(sql,[boardkind,title,content,regempseq,boardseq],function(err,rows,fields){

       if(err){
         console.log(err);
       }
       else {
         res.redirect('/boardinfo/'+boardseq);
       }
     });
  }

});

app.listen(8082,function(){
  console.log('connected 8082 port!');
});
