const express = require('express');

const router = express.Router();
const resultsController = require('../controllers/results.js');

// router.get('/', resultsController.getResults);
router.get('/:id', resultsController.validate('getResultById'), resultsController.getResultById);
// router.post('/', resultsController.postResult);

module.exports = router;
