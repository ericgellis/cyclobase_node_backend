const express = require('express')
const bodyParser = require('body-parser')
const app = express()

var path = require('path');
var router = require('./bin/router');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', router);

module.exports = app;
