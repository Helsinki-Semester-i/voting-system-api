const pollService = require('../services/polls.js');
const userService = require('../services/users.js');

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
        const data = await pollService.getPolls();
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
      const data = await pollService.getPollById(id);
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
    const { title, details, creation_date, close_date, acceptance_percentage, anonymity, questions, users} = req.body;

    var usersIds = [];
    for(var i in users){
      var email = users[i];
      var id = await userService.getUserIdByEmail(email);
      if (id === null){
        Log.warn(`One or more users does not exist`);
        throw new Error(CODES.STATUS.BAD_REQUEST, 'Cannot create anoymous poll, one or more users does not exist.');
      }
      usersIds.push(id);
    }

    if (anonymity){
      const poll_id = await pollService.postPoll(title, details, creation_date, close_date, acceptance_percentage, anonymity);
      Log.info(`New anonymous poll created with ID: ${poll_id}`);
      createClosed_question(poll_id, anonymity, questions);
      addUsersToPoll(usersIds,poll_id,anonymity);
      res.status(CODES.STATUS.CREATED).send(`Anonymous poll created with ID: ${poll_id}`);
    }else{
      Log.warn(`Non-anoymous poll creation still not supported`);
      throw new Error(CODES.STATUS.BAD_REQUEST, 'Cannot create non-anoymous polls');
    }
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

const createClosed_question = async(poll_id, anonymity, questions) =>{
  try{
    var questionsLenght = 0;
    for (var x in questions){
      questionsLenght++;
    }
    //Log.info(`Creating ${questionsLenght} questions`);
    var priority;
    for(priority = 1; priority <= questionsLenght; priority++){
      //Log.info(`Creating question ${priority}`);
      const question = questions[priority-1];
      await pollService.createClosed_question(poll_id, anonymity, priority, question.question);
      //Log.info(`New closed question created for poll with ID: ${poll_id}`);
      createClosed_options(poll_id, anonymity, priority, question.options);
      //res.status(CODES.STATUS.CREATED).send(`Question ${priority} created for poll with ID ${poll_id}`);
    }
  }catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
}

const createClosed_options = async(poll_id, anonymity, priority, options)=>{
  var optionsLenght=0;
  for (var y in options){
    optionsLenght++;
  }
  //Log.info(`Creating ${optionsLenght} options`);
  var option_priority;
  for(option_priority=1; option_priority <= optionsLenght; option_priority++){
    await pollService.createClosed_option(poll_id, anonymity, priority, option_priority, options[option_priority-1].option_text);
    //Log.info(`New closed option created for poll with ID: ${poll_id}`);
    //res.status(CODES.STATUS.CREATED).send(`Option created for poll with ID ${poll_id} and question ${priority}`);
  }
}

const addUsersToPoll = async(usersIds, poll_id, anonymity)=>{
  for(var i in usersIds ){
    await pollService.addUsersToPoll(usersIds[i], poll_id, anonymity);
  }
}
  
module.exports = {getPolls, getPollById, postPoll}