const express = require('express');

const router = express.Router();

const users = require('./users.js');
const oauth = require('./oauth.js');
const polls = require('./polls.js');
const votes = require('./votes.js');
const results = require('./results.js');

router.get('/', (request, response) => {
  response.json({ info: 'Bienvenido a la API de Wikipolitica Voting-System' });
});

router.use('/users', users);
router.use('/oauth', oauth);
router.use('/polls', polls);
router.use('/votes', votes);
router.use('/results', results);

// ADD MORE ROUTES HERE

module.exports = router;
