// BASE SETUP
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const expressValidator = require('express-validator');

const app = express();

const port = process.env.PORT || 8000;
const routes = require('./routes/index.js');
const authMiddleware = require('./auth'); // eslint-disable-line

app.use(cors());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(authMiddleware); // TODO: remove comment for production
app.use(expressValidator());

// ROUTES FOR OUR API
app.use('/', routes);

// START THE SERVER
app.listen(port, () => {
  console.log(`App running on port ${port}.`); // eslint-disable-line
});
