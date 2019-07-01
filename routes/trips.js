var express = require('express');
var pg = require("pg");
var router = express.Router();


var insertTrip = 'INSERT into trip ' +
    '(end_gps_lat, end_gps_long, end_time, start_gps_lat, start_gps_long, start_time) ' +
    'VALUES($1, $2, $3, $4, $5, $6) ' +
    'RETURNING *';

var insertRollingPoints = 'INSERT into rolling_point ' +
    '(gps_lat, gps_long, point_time, trip_id) ' +
    'VALUES($1, $2, $3, $4)';

var insertEvents = 'INSERT into event ' +
    '(end_time, event_name, event_type, gps_lat_end, gps_lat_start, gps_long_end, gps_long_start, start_time, trip_id) ' +
    'VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9)';


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



router.post('/', function(req, res, next) {

    var payload = req.body;

    //var rollingPoint = JSON.stringify(payload.rollingPoints);
    //console.log("start time = " + payload.startTime + " , rollingPoint = " + rollingPoint);

    pool.connect(function(err,client,done)  {

        if(err){
            console.log("not able to get connection "+ err);
            res.status(400).send(err);
        }

        console.log("Inserting Trip into DataBase");

        client.query(
            insertTrip ,
            [payload.endGpsLat, payload.endGpsLong, payload.endTime, payload.startGpsLat, payload.startGpsLong, payload.startTime ],
            function(err,result) {
                if (err) {
                    console.log("Trip insertion failed ! " + err);
                } else {

                    console.log("New trip have been successful insert with trip_id : " + result.rows[0].trip_id);

                    console.log("Inserting "+ payload.rollingPoints.length + " new rolling points into DataBase... ");

                    for(var i = 0; i < payload.rollingPoints.length; i++ ) {
                        client.query(insertRollingPoints ,
                            [payload.rollingPoints[i].gpsLat, payload.rollingPoints[i].gpsLong, payload.rollingPoints[i].timeOfRollingPoint, result.rows[0].trip_id],
                            function(err,result) {
                                if(err){
                                    console.log("A rolling Points insertion failed ! " + err);
                                }
                            });
                    }

                    console.log("Inserting "+ payload.events.length + " new events into DataBase... ");;


                    for(var i = 0; i < payload.events.length; i++ ) {
                        client.query(insertEvents ,
                            [payload.events[i].endTime, payload.events[i].eventName, payload.events[i].eventType, payload.events[i].gpsLatEnd, payload.events[i].gpsLatStart, payload.events[i].gpsLongEnd, payload.events[i].gpsLongStart, payload.events[i].startTime, result.rows[0].trip_id],
                            function(err,result) {
                                if(err){
                                    console.log("An event insertion failed ! " + err);
                                }
                            });
                    }


                    done();

                    if(err){
                        console.log(err);
                        res.status(400).send(err);
                    }

                    res.status(200).send(result);
                }
            });
    });

});


module.exports = router;

