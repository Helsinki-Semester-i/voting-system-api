var express = require('express');
var router = express.Router();
const queries = require('../services/polls.js');

router.get('/', queries.getPolls);
router.get('/:id', queries.getPollById);
router.post('/', queries.postPoll);

module.exports = router;