const express = require('express');

const router = express.Router();

const users = require('./users.js');
const oauth = require('./oauth.js');

router.get('/', (request, response) => {
  response.json({ info: 'Bienvenido a la API de Wikipolitica Voting-System' });
});

router.use('/users', users);
router.use('/oauth', oauth);
// ADD MORE ROUTES HERE

module.exports = router;
