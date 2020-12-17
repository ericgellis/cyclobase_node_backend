const pool = require('../bin/dbConnection');
var format = require('pg-format');


const insertTrip = 'INSERT into trip ' +
    '(end_gps_lat, end_gps_long, end_time, start_gps_lat, start_gps_long, start_time) ' +
    'VALUES($1, $2, $3, $4, $5, $6) ' +
    'RETURNING *';

const insertRollingPoints = 'INSERT into rolling_point ' +
    '(gps_lat, gps_long, point_time_rolling_point, trip_id) ' +
    'VALUES %L';

const insertEvents = 'INSERT into event ' +
    '(end_time, event_name, event_type, gps_lat_end, gps_lat_start, gps_long_end, gps_long_start, start_time, trip_id) ' +
    'VALUES %L';

function makeRollingPointsRows(rollingPoints, tripId) {

    var values = [];

    for (var i = 0; i < rollingPoints.length; i++) {

        values.push(
            [rollingPoints[i].gpsLat,
                rollingPoints[i].gpsLong,
                rollingPoints[i].timeOfRollingPoint,
                tripId])

    }

    return values;
}

function makeEventsRows(events, tripId) {

    var values = [];

    for (var i = 0; i < events.length; i++) {
        values.push([
            events[i].endTime,
            events[i].eventName,
            events[i].eventType,
            events[i].gpsLatEnd,
            events[i].gpsLatStart,
            events[i].gpsLongEnd,
            events[i].gpsLongStart,
            events[i].startTime,
            tripId
        ])
    }

    return values;
}

module.exports = {
    createTrip: async function createTrip(request, response) {

        var payload = request.body;

        console.log("Inserting Trip into DataBase");

        const result = await pool.query(
            insertTrip,
            [payload.endGpsLat, payload.endGpsLong, payload.endTime, payload.startGpsLat, payload.startGpsLong, payload.startTime])
            .catch((error) => {
                console.log(error);
                response.status(400).send("Error while inserting new trip into Database");
                throw error
            });

        console.log("New trip have been successful insert with trip_id : " + result.rows[0].trip_id);

        console.log("Inserting " + payload.rollingPoints.length + " new rolling points into DataBase... ");

        await pool.query(format(insertRollingPoints, makeRollingPointsRows(payload.rollingPoints, result.rows[0].trip_id)))
            .catch((error) => {
                console.log(format(insertRollingPoints, makeRollingPointsRows(payload.rollingPoints, result.rows[0].trip_id)));
                console.log(error);
                response.status(400).send("Error while inserting RollingPoint into Database");
                throw error
            })
            .then( (result) => {
                console.log("Success inserting RollingPoints")
            });

        console.log("Inserting " + payload.events.length + " new events into DataBase... ");

        await pool.query(format(insertEvents, makeEventsRows(payload.events, result.rows[0].trip_id)))
            .catch((error) => {
                console.log(format(insertEvents, makeEventsRows(payload.events, result.rows[0].trip_id)));
                console.log(error);
                response.status(400).send("Error while inserting Events into Database");
                throw error
            })
            .then( (result) => {
                console.log("Success inserting Events")
            });

        console.log("All datas have beensuccessfully inserted into database");
        return response.status(200).send("Trip and datas have been successfully inserted into database");
    }
};

