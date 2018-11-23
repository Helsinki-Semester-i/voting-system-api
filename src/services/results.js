const DataBase = require('./database.js');

const Log = require('../utils/logger');
const Error = require('../errors/statusError');
const CODES = require('../constants/httpCodes');

const getResults = async () => {
  response.status(200);
};

const getResultById = async (poll_id) => {
  const getResultByIdQuery = 'SELECT \
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
                                            option_text, \
                                            vote_count \
                                        FROM \
                                            closed_poll_result \
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
    const results = await DataBase.query(getResultByIdQuery, [poll_id]);
    Log.info(`Request to results for poll with id: ${poll_id}`);
    return results.rows[0].row_to_json;
  } catch (error) {
    Log.error(error);
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const postResult = async () => {
  response.status(200);
};

module.exports = { getResults, getResultById, postResult };
