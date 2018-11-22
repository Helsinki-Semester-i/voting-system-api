const express = require('express');

const usersController = require('../controllers/users.js');

const router = express.Router();

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.put('/:id', usersController.deleteUser);

module.exports = router;
