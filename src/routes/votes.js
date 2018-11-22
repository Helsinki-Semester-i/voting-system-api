var express = require('express');
var router = express.Router();
const votesController = require('../controllers/votes.js');

//router.get('/', votesController.getVotes);
router.get('/:code', votesController.getVoteByCode);
//router.post('/', votesController.postVote);

module.exports = router;