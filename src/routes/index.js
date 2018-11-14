var express = require('express');
var router = express.Router();

const users = require('./users.js');
const oauth = require('./oauth.js');

router.get('/', (request, response) => {
    response.json({ info: 'Bienvenido a la API de Wikipolitica Voting-System' })
  })

router.use('/users', users);
router.use('/oauth', oauth);
//ADD MORE ROUTES HERE

function errorHandler(err, req, res, next) {
  if (err.response) {
    console.log('Response error data: ', err.response.data);
    console.log('Error Status: ', err.response.status);
    console.log('Error Header: ', err.response.headers);
    res.status(err.response.status).json(err.response.data);
  } else if (err.request) {
    console.log('Request error ', err.request);
    res.json(err.request);
  } else {
    console.log('Error', err.message);
    res.json(err.message);
  }
  console.log('Error config: ', err.config)
}

// router.use(errorHandler);

module.exports = router