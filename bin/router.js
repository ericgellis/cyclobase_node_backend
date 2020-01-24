const express = require('express');
const router = express.Router();

const usersApiV1 = require('../api/v1/usersAPI');
const tripsApiV1 = require('../api/v1/tripsAPI');
const technicalApiV1 = require('../api/v1/technicalAPI');

router.use('/v1/users', usersApiV1);
router.use('/v1/trips', tripsApiV1);
router.use('/v1/technical', technicalApiV1);

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
