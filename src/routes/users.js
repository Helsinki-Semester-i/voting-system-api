const express = require('express');

const userController = require('../controllers/users.js');

const router = express.Router();

router.get('/', userController.getUsers);
router.get('/:id', userController.getUserById);
router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.put('/:id', userController.deleteUser);

module.exports = router;
