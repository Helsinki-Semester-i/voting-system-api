const DataBase = require('./database.js')

const getVotes = (request, response) => {
    response.status(200);
}

const getVoteByID = (request, response) => {
    response.status(200);
}

const postVote = (request, response) => {
    response.status(200);
}

module.exports = {getVotes, getVoteByID, postVote}