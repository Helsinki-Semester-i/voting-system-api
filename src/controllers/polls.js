const userService = require('../services/polls.js');

const Log = require('../utils/logger');
const Error = require('../errors/statusError');
const utils = require('../utils/utils.js');
const CODES = require('../constants/httpCodes');

function throwErrorForQueryParams(queryParams) {
    if (!utils.isEmptyObject(queryParams)) {
        throw new Error(CODES.STATUS.BAD_REQUEST, 'Query params are not supported yet');
    }
}

const getPolls = async (req, res) => {
    try {
        throwErrorForQueryParams(req.query);
        const data = await userService.getPolls();
        res.status(CODES.STATUS.OK).json(data);
    } catch (err) {
        res.status(err.code).send({ error: err.msg });
    }
};

const getPollById = async (req, res) => {
    try {
      throwErrorForQueryParams(req.query);
      const { id } = req.params;
      if (!utils.isPositiveInteger(id)) {
        Log.warn(`Invalid Id = (${id}) was used to request a poll by ID`);
        throw new Error(CODES.STATUS.BAD_REQUEST, 'Invalid poll ID');
      }
      const data = await userService.getPollById(id);
      if (utils.isEmptyArray(data)) {
        Log.warn(`Non existent data was requested with id: ${id}`);
        throw new Error(CODES.STATUS.NOT_FOUND, 'Poll does not exists');
      }
      res.status(CODES.STATUS.OK).json(data);
    } catch (err) {
      res.status(err.code).send({ error: err.msg });
    }
};

const postPoll = async (req, res) => {
    try {
      throwErrorForQueryParams(req.query);
      const { title, details, acceptance_percentage, anonimity } = req.body;
      const data = await userService.postPoll(title, details, acceptance_percentage, anonimity);
      Log.info(`New poll created with ID: ${data}`);
      res.status(CODES.STATUS.CREATED).send(`Poll created with ID: ${data}`);
    } catch (err) {
      res.status(err.code).send({ error: err.msg });
    }
  };
  
module.exports = {getPolls, getPollById, postPoll}