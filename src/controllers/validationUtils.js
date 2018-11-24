const Log = require('../utils/logger');
const Error = require('../errors/statusError');
const helper = require('../utils/utils.js');
const CODES = require('../constants/httpCodes');

const throwErrorForQueryParams = (queryParams) => {
  if (!helper.isEmptyObject(queryParams)) {
    throw new Error(CODES.STATUS.BAD_REQUEST, 'Query params are not supported yet');
  }
};

const checkValidationResult = (errors) => {
  if (!errors.isEmpty()) {
    Log.error(JSON.stringify(errors.array()));
    throw new Error(CODES.STATUS.BAD_REQUEST, errors.array());
  }
};

module.exports = {
  checkValidationResult,
  throwErrorForQueryParams,
  Log,
  CODES,
  helper,
};
