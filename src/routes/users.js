const express = require('express');

const usersController = require('../controllers/users.js');

const router = express.Router();

router.get('/', usersController.getUsers);
router.get('/:id', usersController.validate('getUserById'), usersController.getUserById);
router.get('/byMail/:email', usersController.validate('getUserIdByEmail'), usersController.getUserIdByEmail);
router.post('/', usersController.validate('createUser'), usersController.createUser);
router.put('/:id', usersController.validate('updateUser'), usersController.updateUser);
router.delete('/:id', usersController.validate('deleteUser'), usersController.deleteUser);

module.exports = router;
