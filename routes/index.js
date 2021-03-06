var express = require('express');
var router = express.Router();
var mysql = require('mysql')

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'workers_db'
});
connection.connect();



router.post('/reg', function (req, res, next) {
  if (req.body.name != "" && req.body.age != "" && req.body.city != "" && req.body.salary) {
    let insertQuery = `
    INSERT INTO workers (name, age, city, salary) 
    VALUES ('${req.body.name}',  ${req.body.age}, '${req.body.city}', ${req.body.salary})
  `

    connection.query(insertQuery, (err, data) => {
      if (err) throw err;
      res.redirect("/allworkers");
    });
  }
  else {
    res.redirect("/");
  }

});


router.get('/allworkers', function (req, res, next) {

  connection.query('SELECT * FROM workers', (err, data) => {
    if (err) throw err;

    let htmlRes = `
    <style>

    body{
      background:black;
      color:greenyellow;
    }

    table{
      border:3px ridge limegreen;
    }

    td{
      border: 1px ridge green;
    }
    
    th{
      border: 3px ridge limegreen;
    }
    
    .delBtn{
      cursor:pointer;
    }

    input[type='button']{
      cursor:pointer;
    } 
      
      </style>
      
      <table style='zoom: 175%;font-family: monospace;'>
      <tr>
      <th>ID</th>
      <th>Name</th>
      <th>Age</th>
      <th>City</th>
      <th>Salary</th>
      <th>Remove Worker</th>
      </tr>
      `;

    data.forEach(worker => {
      htmlRes += `<tr> 
        <td>${worker.ID}</td> 
        <td>${worker.name}</td> 
        <td>${worker.age}</td>
        <td>${worker.city}</td> 
        <td>${worker.salary}</td>
          <td><button class="delBtn" onclick="location.href = '/deleter?worker_id=${worker.ID} ' " 
          style='background:green;color:black;font-family:monospace;width:113px;'>Remove ${worker.name}</button></td>
          </tr> `
    });
    htmlRes += `</table><br/><br/>
        <input type="button" value="&#x261A Go Back" onclick="location.href='/'" style='background:green;color:yellow;font-size:18px;font-family:monospace;width:113px;' /> 
        `;

    // res.json(data);
    res.send(htmlRes);
  });

});

router.get('/deleter', function (req, res, next) {
 
  let x = parseInt(req.query.worker_id);
  connection.query(`DELETE FROM workers WHERE id = '${x}'`, (err, data) => {
    if (err) throw err;
    console.log("Number of workers deleted: " + data.affectedRows);
    res.redirect("/allworkers")
    // res.send(""+(x+5));
  });
});


//---------------------------------------------------------------


// router.get('/createtable', function (req, res, next) { 
//   //connect to  SQL DB 
//   var createTableQuery = `
//  CREATE TABLE workers (
//   ID int NOT NULL AUTO_INCREMENT,
//   name varchar(200) NOT NULL,
//   age int NOT NULL,
//   city varchar(200) NOT NULL,
//   salary int NOT NULL,
//   PRIMARY KEY (ID)
//   ); 
// `;

//   //create db query
//   connection.query(createTableQuery, (err, data) => {
//       if (err) throw err;
//       console.log("table created!");
//       res.send("<h2>workers table was created!</h2>");
//   });

// });


//----------------------------------------------------------------


// router.get('/createdb', function (req, res, next) {
//   //create the DB
//   //connect to  SQL engine 
//   var connection = mysql.createConnection({
//       host: 'localhost',
//       user: 'root',
//       password: 'root'
//   });
//   connection.connect(); 

//   //create db query
//   connection.query("CREATE DATABASE workers_db", (err, data) => {
//       if (err) throw err;
//       console.log("db created!");
//       res.send("<h2>workers_db database was created!</h2>");
//   });

// });

module.exports = router;
