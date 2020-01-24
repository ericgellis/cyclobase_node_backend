var express = require('express');
var router = express.Router();
var userQueries = require('../../queries/userQueries');


/********************************************
 *                                          *
 *                /users                    *
 *                                          *
 ********************************************/

router.get('/', userQueries.getAllUsers);

router.post('/', userQueries.createUser);

router.post('/auth', userQueries.authUser);

router.get('/:id', userQueries.getUserById);

router.put('/:id', userQueries.updateUser);

router.delete('/:id', userQueries.deleteUser);


module.exports = router;
