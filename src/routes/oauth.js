const express = require('express');

const router = express.Router();
const oauth = require('../services/oauth.js');

router.use(oauth.addHeaders);
router.get('/', oauth.getPanelists);
router.get('/:login', oauth.getUserByMail);
router.post('/', oauth.createUser);
router.put('/:userId', oauth.deactivateUser, oauth.deleteUser);

module.exports = router;
