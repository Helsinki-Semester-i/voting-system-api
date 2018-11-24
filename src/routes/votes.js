const express = require('express');

const router = express.Router();
const votesController = require('../controllers/votes.js');

router.get('/:code', votesController.validate('getVoteByCode'), votesController.getAnonymousVoteByCode);
router.post('/', votesController.validate('postVote'), votesController.postAnonymousVote);

module.exports = router;
