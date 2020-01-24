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

const pool = new DbConnection(prodConfig);

module.exports = pool;
