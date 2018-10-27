// server.js

// BASE SETUP
// =============================================================================

// call the packages we need
const express    = require('express');        // call express
const app        = express();                 // define our app using express
const bodyParser = require('body-parser');
const http       =require('http');
const { promisify } = require('util');
const cors = require('cors');

const initializeDatabase = require('./services/database')//USE DATABASE FROM THE SCRIPT

// require('dotenv').config();
// process.env.VAR_NAME

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// ROUTES FOR OUR API
// =============================================================================
var router = express.Router();              // get an instance of the express Router

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
const startServer = async () => {
  await initializeDatabase(app); //WAIT UNTIL DATABASE IS INITIALIZED
  const port = process.env.PORT || 8081;        // set our port
  await promisify(app.listen).bind(app)(port)
  console.log('Magic happens on port ' + port);
}
startServer();
