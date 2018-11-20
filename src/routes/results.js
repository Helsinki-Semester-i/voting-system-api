var express = require('express');
var router = express.Router();
const queries = require('../services/results.js');

router.get('/', queries.getResults);
router.get('/:id', queries.getResultById);
router.post('/', queries.postResult);

module.exports = router;