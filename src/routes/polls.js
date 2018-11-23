var express = require('express');
var router = express.Router();
const pollsControler = require('../controllers/polls.js');

router.get('/', pollsControler.getPolls);
router.get('/:id', pollsControler.getPollById);
router.post('/', pollsControler.postPoll);

module.exports = router;
