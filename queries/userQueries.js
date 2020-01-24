const pool = require('../bin/dbConnection');
var crypto = require('crypto');


function hashPassword(salt, password) {

    console.log('Hashing password ...');

    return crypto.pbkdf2Sync(password, salt,
        1000, 64, `sha512`).toString(`hex`);
}

function validPassword(hash, salt, payloadPassword) {

    var processedHash = crypto.pbkdf2Sync(payloadPassword,
        salt, 1000, 64, `sha512`).toString(`hex`);

    return hash === processedHash;
}

async function hasUser(login) {

    console.log('First, verify if an user with login ' + login + ' exist.');

    const result = await pool.query('SELECT COUNT(*) AS usercount FROM cyclobase_users WHERE login = $1', [login])

    console.log(result.rows[0].usercount + ' result found');

    return result.rows[0].usercount > 0;
}

module.exports = {

    getAllUsers: function (request, response) {

        pool.query('SELECT * FROM cyclobase_users ORDER BY id ASC', (error, results) => {
            if (error) {
                throw error;
            }
            response.status(200).json(results.rows)
        })
    },
    getUserById: function (request, response) {
        const id = parseInt(request.params.id);

        pool.query('SELECT * FROM cyclobase_users WHERE id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            response.status(200).json(results.rows)
        })
    },
    createUser: async function createUser(request, response) {

        var payload = request.body;

        console.log('Try to register a new user');

        if (await hasUser(payload.login)) {
            console.log('This username already exist.');
            response.status(400).send('User with this identifier already exist')
        } else {

            console.log("Not any user register with this identifier, let's go");

            // Creating a unique salt for a particular user
            var salt = crypto.randomBytes(16).toString('hex');
            var hash = hashPassword(salt, payload.password);

            console.log("salt : " + salt);
            console.log("hash : " + hash);

            console.log('Inserting user in database ...');

            pool.query('INSERT INTO cyclobase_users (login, hash, salt) VALUES ($1, $2, $3)', [payload.login, hash, salt], (error, results) => {
                if (error) {
                    console.log('Fail to insert new user with identifiers ' + payload.login + '  into database');
                    response.status(400).send('Error while register user');
                    throw error
                } else {
                    console.log('New user with identifiers ' + payload.login + ' have been successfully inserted into database');
                    response.status(200).send('User ' + payload.login + ' added in database')
                }
            })
        }
    },
    deleteUser: function deleteUser(request, response) {
        const id = parseInt(request.params.id);

        pool.query('DELETE FROM cyclobase_users WHERE id = $1',
            [id],
            (error, results) => {
                if (error) {
                    throw error
                }
                response.status(200).send(`User deleted with ID: ${id}`)
            })
    },
    updateUser: function (request, response) {
        const id = parseInt(request.params.id);
        const {name, email} = request.body;

        pool.query(
            'UPDATE cyclobase_users SET name = $1, email = $2 WHERE id = $3',
            [name, email, id],
            (error, results) => {
                if (error) {
                    throw error
                }
                response.status(200).send(`User modified with ID: ${id}`)
            }
        )
    },
    authUser: function (request, response) {

        var payload = request.body;

        console.log('User ' + payload.login + ' try an authentification ...');

        pool.query('SELECT * FROM cyclobase_users WHERE login = $1 AND activated = true',
            [payload.login],
            (error, result) => {
                if (validPassword(result.rows[0].hash, result.rows[0].salt, payload.password)) {
                    console.log('Login success');
                    response.status(200).send('login success');
                } else {
                    console.log('Login failure');
                    response.status(401).send('Wrong password');
                }
            })
    }
};
