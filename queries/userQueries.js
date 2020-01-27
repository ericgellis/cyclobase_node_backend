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

async function hasUser(userName) {

    console.log('First, verify if an user with login ' + userName + ' exist.');

    const result = await pool.query('SELECT COUNT(*) AS usercount FROM cyclobase_users WHERE userName = $1', [userName])

    console.log(result.rows[0].usercount + ' result found');

    return result.rows[0].usercount > 0;
}

module.exports = {

    getAllUsers: function (request, response) {

        pool.query('SELECT username, activated FROM cyclobase_users ORDER BY user_id ASC', (error, results) => {
            if (error) {
                throw error;
            }
            return response.status(200).json(results.rows)
        })
    },
    getUserById: function (request, response) {
        const id = parseInt(request.params.id);

        pool.query('SELECT * FROM cyclobase_users WHERE user_id = $1', [id], (error, results) => {
            if (error) {
                throw error
            }
            return response.status(200).json(results.rows)
        })
    },
    createUser: async function createUser(request, response) {

        var payload = request.body;

        console.log('Try to register a new user');

        if(payload.userName === null || payload.password === null){
            return response.status(400).send('userName or password is empty')
        }

        if (await hasUser(payload.userName)) {
            console.log('This username already exist.');
            return response.status(400).send('User with this identifier already exist')
        } else {

            console.log("Not any user register with this identifier, let's go");

            // Creating a unique salt for a particular user
            var salt = crypto.randomBytes(16).toString('hex');
            console.log("salt : " + salt);

            var hash = hashPassword(salt, payload.password);
            console.log("hash : " + hash);

            console.log('Inserting user in database ...');

            pool.query('INSERT INTO cyclobase_users (userName, hash, salt) VALUES ($1, $2, $3)', [payload.userName, hash, salt], (error, results) => {
                if (error) {
                    console.log('Fail to insert new user with identifiers ' + payload.userName + '  into database');
                    return response.status(400).send('Error while register user');
                } else {
                    console.log('New user with identifiers ' + payload.userName + ' have been successfully inserted into database');
                    return response.status(200).send('User ' + payload.userName + ' added in database')
                }
            })
        }
    },
    deleteUser: function deleteUser(request, response) {
        const id = parseInt(request.params.id);

        pool.query('DELETE FROM cyclobase_users WHERE user_id = $1',
            [id],
            (error, results) => {
                if (error) {
                    throw error
                }
                return response.status(200).send(`User deleted with ID: ${id}`)
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
                return response.status(200).send(`User modified with ID: ${id}`)
            }
        )
    },
    authUser: function (request, response) {

        var payload = request.body;

        console.log('User ' + payload.userName + ' try an authentification ...');

        pool.query('SELECT * FROM cyclobase_users WHERE userName = $1 AND activated = true',
            [payload.userName],
            (error, result) => {
                if(result.rows.length === 1){
                    console.log('User Found');
                    if (validPassword(result.rows[0].hash, result.rows[0].salt, payload.password)) {
                        console.log('Login success');
                        return response.status(200).send('login success');
                    }else{
                        console.log('Wrong Password');
                    }
                }else{
                    console.log('User not found');
                }
                return response.status(401).send('Wrong userName / password combination');
            })
    }
};
