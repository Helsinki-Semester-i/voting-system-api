var express = require('express');
var router = express.Router();
const queries = require('../services/users.js');
const oauth = require('./oauth.js');

router.use('/oauth', oauth);
router.get('/', queries.getUsers);
router.get('/:id', queries.getUserById);
router.post('/', queries.createUser);
router.put('/:id', queries.updateUser);
router.put('/:id', queries.deleteUser);

module.exports = router;