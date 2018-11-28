const Log = require('../utils/logger');
const Error = require('../errors/statusError');
const utils = require('../utils/utils.js');
const CODES = require('../constants/httpCodes');
const { getUserIdByEmail, getUserById } = require('../services/users');

const throwErrorForQueryParams = (queryParams) => {
  if (!utils.isEmptyObject(queryParams)) {
    throw new Error(CODES.STATUS.BAD_REQUEST, 'Query params are not supported yet');
  }
};

const checkValidationResult = (errors) => {
  if (!errors.isEmpty()) {
    Log.error(JSON.stringify(errors.array()));
    throw new Error(CODES.STATUS.BAD_REQUEST, errors.array().map(key => `${key.msg} : ${key.value}`));
  }
};

const alreadyVoted = async (id, poll_id) => {
  const user = (await getUserById(id))[0].row_to_json;
  for(let i in user.polls){
    let poll = user.polls[i];
    if (poll.id == poll_id){
      if(poll.vote_status == 'voted') {
        throw new Error(CODES.STATUS.FORBIDDEN, 'User already voted.');
      } else {
        return;
      }
    }
  }
  throw new Error(CODES.STATUS.FORBIDDEN, 'User not participating in this poll.');
}

module.exports = {
  checkValidationResult,
  throwErrorForQueryParams,
  Log,
  CODES,
  utils,
  Error,
  alreadyVoted,
};
