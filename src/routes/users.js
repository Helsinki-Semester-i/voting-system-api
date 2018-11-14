var express = require('express');
var router = express.Router();

const queries = require('../services/users.js');
const userController = require('../controllers/users.js');

router.get('/', userController.getUsers);
router.get('/:id', queries.getUserById);
router.post('/', queries.createUser);
router.put('/:id', queries.updateUser);
router.put('/:id', queries.deleteUser);

module.exports = router;