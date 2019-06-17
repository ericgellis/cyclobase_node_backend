var express = require('express');
var pg = require("pg");
var router = express.Router();

var tryAuthRequest = "SELECT * FROM cyclobase_users WHERE login = $1";
var getAllUsersRequest = 'SELECT * FROM cyclobase_users';


var config = new pg.Client({
  user: "trhrhtnafalhdk",
  password: "b8b1e8c2bcb2277432c034acf6a306fe64be6dc6036782fff8344ed73374366c",
  database: "daanph1b372kbm",
  port: 5432,
  host: "ec2-54-247-72-30.eu-west-1.compute.amazonaws.com",
  ssl: true,
  max: 10, // max number of connection can be open to database
  idleTimeoutMillis: 30000,
});

var pool = new pg.Pool(config);


/* GET Get All users. */
router.get('/', function(req, res, next) {

  const results = [];

  /* Grab data from http request
  const data = {text: req.body.text, complete: false};*/

  pool.connect(function(err,client,done)  {

    if(err){
      console.log("not able to get connection "+ err);
      res.status(400).send(err);
    }

    client.query(getAllUsersRequest ,function(err,result) {

      done();

      if(err){
        console.log(err);
        res.status(400).send(err);
      }

      res.status(200).send(result.rows);
    });
  });
});

/* authentificate user. */
router.post('/auth', function(req, res, next) {

  console.log(req.body.authPayload.login);

  console.log(req.body.authPayload.password);

  // Grab data from http request
  const data = {login: req.body.authPayload.login, password: req.body.authPayload.password};

  pool.connect(function(err,client,done)  {

    if(err){
      console.log("not able to get connection "+ err);
      res.status(400).send(err);
    }

    client.query(tryAuthRequest ,
          [data.login],
          function(err,result) {

      done();

      if(err){
        console.log(err);
        res.status(400).send(err);
      }

            console.log(result);

      if(result.rows[0].password == data.password){
        res.status(200).send('login success');
      }else{
        res.status(401).send('Wrong password');
      }

    });
  });
});


module.exports = router;
