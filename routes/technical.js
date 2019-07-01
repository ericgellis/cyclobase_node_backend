var express = require('express');
var router = express.Router();

/* GET Get All users. */
router.post('/wakeup', function(req, res, next) {

    res.sendStatus(200);
});

module.exports = router;

