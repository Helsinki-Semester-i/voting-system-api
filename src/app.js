// BASE SETUP =============================================================================

require('dotenv').config();
const express = require('express');        // call express
const app = express();                 // define our app using express
const bodyParser = require('body-parser');
const http = require('http');
const { promisify } = require('util');
const cors = require('cors');
const axios = require('axios');

const initializeDatabase = require('./services/database'); //USE DATABASE FROM THE SCRIPT
const authMiddleware = require('./auth');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
//app.use(authMiddleware);

// ROUTES FOR OUR API =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here
router.post('/users', async (req, res, next) => {
  let oktaApiUrl = process.env.API_OKTA;
  let oktaToken = process.env.OKTA_TOKEN;

  try {
    const { data } = await axios ({
      method: 'post',
      url: oktaApiUrl + '/users',
      data: req.body,
      params: req.query,
      headers: {
        ContentType: 'application/json',
        Accept: 'application/json',
        Authorization: 'SSWS ' + oktaToken,
      }
    });
    res.json(data);
  } catch (err) {
    next(err)
  }  
});

router.get('/panelists', async (req, res, next) => {
  let oktaApiUrl = process.env.API_OKTA;
  let oktaToken = process.env.OKTA_TOKEN;
  let panelistId = process.env.OKTA_PANELIST_GROUP;

  try {
    const { data } = await axios ({
      method: 'get',
      url: oktaApiUrl + '/groups/' + panelistId + '/users',
      headers: {
        ContentType: 'application/json',
        Accept: 'application/json',
        Authorization: 'SSWS ' + oktaToken,
      }
    });
    console.log('Data: ', data);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

router.get('/users/:login', async (req, res, next) => {
  let oktaApiUrl = process.env.API_OKTA;
  let oktaToken = process.env.OKTA_TOKEN;

  try {
    const { data } = await axios ({
      method: 'get',
      url: oktaApiUrl + '/users/' + req.params.login,
      headers: {
        ContentType: 'application/json',
        Accept: 'application/json',
        Authorization: 'SSWS ' + oktaToken,
      }
    });
    console.log('Data: ', data);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Deactivate user
// https://developer.okta.com/docs/api/resources/users#deactivate-user
router.post('/users/:userId', async (req, res, next) => {
  let oktaApiUrl = process.env.API_OKTA;
  let oktaToken = process.env.OKTA_TOKEN;
  try {
    const { data } = await axios ({
      method: 'post',
      url: oktaApiUrl + '/users/' + req.params.userId + 'lifecycle/deactivate',
      headers: {
        ContentType: 'application/json',
        Accept: 'application/json',
        Authorization: 'SSWS ' + oktaToken,
      }
    });
    console.log('Data: ', data);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Delete user
router.delete('/users/:userId', async (req, res, next) => {
  let oktaApiUrl = process.env.API_OKTA;
  let oktaToken = process.env.OKTA_TOKEN;
  try {
    const { data } = await axios ({
      method: 'delete',
      url: oktaApiUrl + '/users/' + req.params.userId,
      headers: {
        ContentType: 'application/json',
        Accept: 'application/json',
        Authorization: 'SSWS ' + oktaToken,
      }
    });
    console.log('Data: ', data);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

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

router.use(errorHandler);

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER =============================================================================
const startServer = async () => {
  await initializeDatabase(app); //WAIT UNTIL DATABASE IS INITIALIZED
  const port = process.env.PORT || 8081;        // set our port
  await promisify(app.listen).bind(app)(port)
  console.log('Magic happens on port ' + port);
}
startServer();
