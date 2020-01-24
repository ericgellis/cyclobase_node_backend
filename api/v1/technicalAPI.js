var express = require('express');
var router = express.Router();

router.post('/wakeup', function(req, res, next) {
    console.log('Wake up !!!');
    res.sendStatus(200);
});

module.exports = router;

