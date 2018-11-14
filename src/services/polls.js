const DataBase = require('./database.js')

const getPolls = (request, response) => {
    response.status(200);
}

const getPollByID = (request, response) => {
    response.status(200);
}

const postPoll = (request, response) => {
    response.status(200);
}

module.exports = {getPolls, getPollByID, postPoll}