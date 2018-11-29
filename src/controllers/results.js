const { param, validationResult } = require('express-validator/check');
const resultsService = require('../services/results.js');

const {
  Log, CODES, utils, throwErrorForQueryParams, Error, checkValidationResult,
} = require('./validationUtils');

const validate = (method) => {
  switch (method) {
    case 'getResultById': {
      return [
        param('id').isInt({ gt: 0 }).withMessage('Invalid user Id to request results by ID'),
      ];
    }
    default: return [];
  }
};

const getResultById = async (req, res) => {
  try {
    throwErrorForQueryParams(req.query);
    checkValidationResult(validationResult(req));
    const { id } = req.params;
    const data = await resultsService.getResultById(id);
    if (utils.isEmptyArray(data)) {
      Log.warn(`Non existent data was requested with id: ${id}`);
      throw new Error(CODES.STATUS.NOT_FOUND, 'Poll does not exists');
    }
    res.status(CODES.STATUS.OK).json(data);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

module.exports = { validate, getResultById };
