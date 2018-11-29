const express = require('express');

const oauth = require('../services/oauth.js');

const router = express.Router();

router.use(oauth.addHeaders);
router.get('/', oauth.getPanelists);
router.get('/:login', oauth.getUserByMail);
router.post('/', oauth.createUser);
router.delete('/:userId', oauth.deactivateUser, oauth.deleteUser);
router.use(oauth.errorHandler);

module.exports = router;
