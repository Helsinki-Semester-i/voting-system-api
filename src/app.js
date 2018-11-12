// BASE SETUP =============================================================================

require('dotenv').config();
const express = require('express');        // call express
const app = express();                 // define our app using express
const bodyParser = require('body-parser');
const http = require('http');
const { promisify } = require('util');
const cors = require('cors');
const port = 8000;
const routes = require('./routes/index.js');

const initializeDatabase = require('./services/database'); //USE DATABASE FROM THE SCRIPT
const authMiddleware = require('./auth');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
//app.use(authMiddleware);

// ROUTES FOR OUR API =============================================================================
app.use('/', routes);

// START THE SERVER =============================================================================
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
