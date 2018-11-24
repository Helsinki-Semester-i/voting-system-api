const votesService = require('../services/votes.js');

const {
  Log, CODES, utils, throwErrorForQueryParams, Error,
} = require('./validationUtils');

const getAnonymousVoteByCode = async (req, res) => {
  try {
    throwErrorForQueryParams(req.query);
    const { code } = req.params;
    const data = await votesService.getAnonymousVoteByCode(code);
    if (utils.isEmptyArray(data)) {
      Log.warn(`Non existent ballot was requested with code: ${code}`);
      throw new Error(CODES.STATUS.NOT_FOUND, 'Ballot does not exists');
    }
    res.status(CODES.STATUS.OK).json(data);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

const postAnonymousVote = async (req, res) => {
  try {
    throwErrorForQueryParams(req.query);
    const { id, anonymity, questions } = req.body;
    const data = await votesService.postAnonymousVote(id, anonymity, questions);
    res.status(CODES.STATUS.OK).json(data);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

module.exports = { getAnonymousVoteByCode, postAnonymousVote };
