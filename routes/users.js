var express = require('express');
var pg = require("pg");
var router = express.Router();

var tryAuthRequest = "SELECT password FROM cyclobase_users WHERE login = $1 AND activated = true;";

var config = new pg.Client({
  user: "sumssetnxptoyp",
  password: "dae82949eb052ac466dbc3da5c4ac0978ccefb27033beb7dea6fa7de7371c1a4",
  database: "dso577pvb7cki",
  port: 5432,
  host: "ec2-46-137-91-216.eu-west-1.compute.amazonaws.com",
  ssl: true,
  max: 10, // max number of connection can be open to database
  idleTimeoutMillis: 30000,
});

var pool = new pg.Pool(config);


/* authentificate user. */
router.post('/auth', function(req, res, next) {

  var payload = req.body;

  pool.connect(function(err,client,done)  {

    if(err){
      console.log("not able to get connection "+ err);
      res.status(400).send(err);
    }

    client.query(tryAuthRequest ,
          [payload.login],
          function(err,result) {


          if(err){
              console.log(err);
              res.status(400).send(err);
          }else{

            console.log(result.rows.length +" users found")


            if(result.rows.length == 0){
              res.status(402).send('Unknow user');
            }else{

              if(result.rows[0].password == payload.password){
                res.status(200).send('login success');
              }else{
                res.status(401).send('Wrong password');

              }
            }
          }
            done();

          });
  });
});


module.exports = router;
