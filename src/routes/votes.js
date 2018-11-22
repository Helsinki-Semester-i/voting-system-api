var express = require('express');
var router = express.Router();
const votesController = require('../controllers/votes.js');

router.get('/:code', votesController.getAnonymousVoteByCode);
router.post('/', votesController.postAnonymousVote);

module.exports = router;