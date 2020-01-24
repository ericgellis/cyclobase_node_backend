var express = require('express');
var router = express.Router();
const tripQueries = require('../../queries/tripQueries');

/********************************************
 *                                          *
 *                /trips                    *
 *                                          *
 ********************************************/

router.post('/', tripQueries.createTrip);

module.exports = router;


