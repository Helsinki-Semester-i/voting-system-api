const express = require('express');

const router = express.Router();
const queries = require('../services/votes.js');

router.get('/', queries.getVotes);
router.get('/:id', queries.getVoteById);
router.post('/', queries.postVote);

module.exports = router;
