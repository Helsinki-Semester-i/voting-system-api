const express = require('express');

const usersController = require('../controllers/users.js');

const router = express.Router();

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUserById);
router.get('/:email', usersController.getUserIdByEmail);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;
