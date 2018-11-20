const DataBase = require('./database.js')

const Log = require('../utils/logger');
const Error = require('../errors/statusError');
const CODES = require('../constants/httpCodes');

const getPolls = async () => {
    try {
        const results = await DataBase.query('SELECT * FROM poll');
        Log.info(`Request for all polls`);
        return results.rows;
      } catch (error) {
        Log.error(error);
        throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
      }
};

const getPollById = async (id) => {
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
                            ( \
                                SELECT \
                                    array_to_json(array_agg(row_to_json(o))) \
                                FROM \
                                    ( \
                                        SELECT \
                                            option_text \
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
;'
  try {
    const results = await DataBase.query(getPollByIdQuery, [id]);
    Log.info(`Request to get poll with id: ${id}`);
    return results.rows;
  } catch (error) {
    Log.error(error);
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const postPoll = async (title, details, acceptance_percentage, anonymity) => {
    try {
        const results = await DataBase.query('INSERT INTO poll(title, details, acceptance_percentage,anonymity) VALUES($1,$2,$3,$4);', [title, details, acceptance_percentage, anonymity]);
        Log.info(`Poll created with title ${title} and id ${results.insertedId}`);
        return results.insertedId;
      } catch (error) {
        Log.error(error);
        throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
      }
}

module.exports = {getPolls, getPollById, postPoll}