const DbConnection = require('pg/lib').Pool;

const prodConfig = {
    user: "sumssetnxptoyp",
    password: "dae82949eb052ac466dbc3da5c4ac0978ccefb27033beb7dea6fa7de7371c1a4",
    database: "dso577pvb7cki",
    port: 5432,
    host: "ec2-46-137-91-216.eu-west-1.compute.amazonaws.com",
    ssl: true,
    max: 10,
    idleTimeoutMillis: 30000,
};

const stagingConfig = {
    user: "dztrihqwpjieqs",
    password: "70dedc3d61a138f0fff00c1eb22c8e99791651753c9627b8abf2e96809077c30",
    database: "db57b8ug50d8j4",
    port: 5432,
    host: "ec2-54-217-221-21.eu-west-1.compute.amazonaws.com",
    ssl: true,
    max: 10,
    idleTimeoutMillis: 30000,
};


const pool = new DbConnection(stagingConfig);

module.exports = pool;
