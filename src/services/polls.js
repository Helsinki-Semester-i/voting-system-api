/* eslint-disable camelcase */
const DataBase = require('./database.js');

const Log = require('../utils/logger');
const Error = require('../errors/statusError');
const CODES = require('../constants/httpCodes');

const getPolls = async () => {
  try {
    const results = await DataBase.query('SELECT * FROM poll');
    Log.info('Request for all polls');
    return results.rows;
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const getPollById = async (id) => {
  // eslint-disable-next-line no-multi-str
  const getPollByIdQuery = 'SELECT \
    row_to_json(t) \
FROM \
    ( \
        SELECT \
            *, \
            ( \
                SELECT \
                    array_to_json(array_agg(row_to_json(q))) \
                FROM \
                    ( \
                        SELECT \
                            question, \
                            order_priority, \
                            ( \
                                SELECT \
                                    array_to_json(array_agg(row_to_json(o))) \
                                FROM \
                                    ( \
                                        SELECT \
                                            option_text, \
                                            order_priority \
                                        FROM \
                                            closed_option \
                                        WHERE \
                                            poll_id = $1 AND closed_question.order_priority = question_order_priority \
                                        ORDER BY \
                                            order_priority \
                                    ) o \
                            ) AS options \
                        FROM \
                            closed_question \
                        WHERE \
                            poll_id = $1 \
                        ORDER BY \
                            order_priority \
                    ) q \
            ) AS questions \
        FROM \
            poll \
        WHERE \
            id = $1 \
    ) t \
;';
  try {
    const results = await DataBase.query(getPollByIdQuery, [id]);
    Log.info(`Request to get poll with id: ${id}`);
    return results.rows[0].row_to_json;
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const postPoll = async (title, details, creation_date,
  close_date, acceptance_percentage, anonymity) => {
  try {
    const format = 'YYYY-MM-DD';
    await DataBase.query('INSERT INTO poll(title, details,creation_date, close_date, acceptance_percentage,anonymity) VALUES($1,$2,to_date($3, $7), to_date($4, $7),$5,$6);', [title, details, creation_date, close_date, acceptance_percentage, anonymity, format]);
    Log.info(`Poll created with title ${title}`);
    const response = await DataBase.query('SELECT * FROM poll WHERE title = $1 AND details = $2 AND creation_date = to_date($3, $5) AND close_date = to_date($4,$5);', [title, details, creation_date, close_date, format]);
    return response.rows;
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const createClosed_question = async (poll_id, poll_anonymity, order_priority, question) => {
  try {
    await DataBase.query('INSERT INTO closed_question(poll_id, poll_anonymity, order_priority, question) VALUES ($1,$2,$3,$4);', [poll_id, poll_anonymity, order_priority, question]);
    Log.info(`Question created for poll with id: ${poll_id}, order priority is ${order_priority}`);
    // const question = await DataBase.query('SELECT * FROM closed_question WHERE poll_id = $1 AND poll_anonymity = $2 AND order_priority = $3 AND question = $4;', [poll_id, poll_anonymity, order_priority, question]);        return id.rows[0].id;
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const createClosed_option = async (poll_id, poll_anonymity,
  question_order_priority, order_priority, option_text) => {
  try {
    await DataBase.query('INSERT INTO closed_option(poll_id, poll_anonymity, question_order_priority, order_priority, option_text) VALUES ($1,$2,$3,$4,$5);', [poll_id, poll_anonymity, question_order_priority, order_priority, option_text]);
    Log.info(`Closed option created for poll with id: ${poll_id}, question number: ${question_order_priority} and priority: ${order_priority}`);
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const addUsersToPoll = async (wiki_user_id, poll_id, poll_anonymity) => {
  try {
    const initialStatus = 'not seen';
    await DataBase.query('INSERT INTO participation(wiki_user_id, poll_id, poll_anonymity, vote_status) VALUES ($1,$2,$3,$4);', [wiki_user_id, poll_id, poll_anonymity, initialStatus]);
    Log.info(`User ${wiki_user_id} added to poll ${poll_id}`);
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

module.exports = {
  getPolls, getPollById, postPoll, createClosed_question, createClosed_option, addUsersToPoll,
};
