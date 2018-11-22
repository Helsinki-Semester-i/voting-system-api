const DataBase = require('./database.js');

const getPolls = (request, response) => {
  DataBase.query('SELECT * FROM poll', (error, results) => {
    if (error) {
      next(error);
    }
    response.status(200).json(results.rows);
  });
};

const getPollById = (request, response) => {
  response.status(200);
};

const postPoll = (request, response) => {
  response.status(200);
};

module.exports = { getPolls, getPollById, postPoll };
