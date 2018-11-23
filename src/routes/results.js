var express = require('express');
var router = express.Router();
const resultsController = require('../controllers/results.js');

//router.get('/', resultsController.getResults);
router.get('/:id', resultsController.getResultById);
//router.post('/', resultsController.postResult);

module.exports = router;
