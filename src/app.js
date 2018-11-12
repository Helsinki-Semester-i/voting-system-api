// BASE SETUP =============================================================================

require('dotenv').config();
const express = require('express');        // call express
const app = express();                 // define our app using express
const bodyParser = require('body-parser');
const { promisify } = require('util');
const cors = require('cors');
const port = process.env.PORT;
const routes = require('./routes/index.js');
const axios = require('axios');


const authMiddleware = require('./auth');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
//app.use(authMiddleware);

// ROUTES FOR OUR API =============================================================================
app.use('/', routes);
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// Add okta information in requests
router.use('/users', (req, res, next) => {
  let oktaApiUrl = process.env.API_OKTA;
  let oktaToken = process.env.OKTA_TOKEN;

  req.oktaApi = oktaApiUrl;
  req.oktaHeaders = {
    ContentType: 'application/json',
    Accept: 'application/json',
    Authorization: 'SSWS ' + oktaToken,
  };
  next();
});

// Create users
router.post('/users', async (req, res, next) => {
  try {
    const { data } = await axios ({
      method: 'post',
      url: req.oktaApi + '/users',
      data: req.body,
      params: req.query,
      headers: req.oktaHeaders,
    });
    res.json(data);
  } catch (err) {
    next(err)
  }  
});

// List all panelists
router.get('/users/panelists', async (req, res, next) => {
  let panelistId = process.env.OKTA_PANELIST_GROUP;
  try {
    const { data } = await axios ({
      method: 'get',
      url: req.oktaApi + '/groups/' + panelistId + '/users',
      headers: req.oktaHeaders,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Get a sinlge user info
router.get('/users/:login', async (req, res, next) => {
  try {
    const { data } = await axios ({
      method: 'get',
      url: req.oktaApi + '/users/' + req.params.login,
      headers: req.oktaHeaders,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Deactivate user
router.post('/users/:userId', async (req, res, next) => {
  try {
    const { data } = await axios ({
      method: 'post',
      url: req.oktaApi + '/users/' + req.params.userId + 'lifecycle/deactivate',
      headers: req.oktaHeaders,
    });
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// Delete user
router.delete('/users/:userId', async (req, res, next) => {
  // First deactivate user
  try {
    const { data } = await axios ({
      method: 'post',
      url: req.oktaApi + '/users/' + req.params.userId + '/lifecycle/deactivate',
      headers: req.oktaHeaders,
    });
    next();
  } catch (err) {
    next(err);
  }
}, async (req, res, next) => {
  // Then remove it
  try {
    const { data } = await axios ({
      method: 'delete',
      url: req.oktaApi + '/users/' + req.params.userId,
      headers: req.oktaHeaders,
    });
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
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
