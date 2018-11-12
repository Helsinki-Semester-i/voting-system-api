var express = require('express');
var router = express.Router();

const users = require('./users.js');

router.get('/', (request, response) => {
    response.json({ info: 'Bienvenido a la API de Wikipolitica Voting-System' })
  })

router.use('/users', users);
//ADD MORE ROUTES HERE


module.exports = router