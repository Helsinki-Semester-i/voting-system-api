var express = require('express');
var router = express.Router();
const queries = require('../services/votes.js');

router.get('/', queries.getVotes);
router.get('/:id', queries.getVoteById);
router.post('/', queries.createVote);
router.put('/:id', queries.updateVote);
router.put('/:id', queries.deleteVote);

module.exports = router;