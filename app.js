const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors');
const app = express()

var path = require('path');
var router = require('./bin/router');

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));

app.use('/api', router);

module.exports = app;
