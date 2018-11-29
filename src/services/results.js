const DataBase = require('./database.js');

const Log = require('../utils/logger');
const Error = require('../errors/statusError');
const CODES = require('../constants/httpCodes');

const getResults = async () => {
  response.status(200);
};

const getResultById = async (poll_id) => {
  const getResultByIdQuery = '\
    SELECT \
    row_to_json(t) \
    FROM \
    ( \
        SELECT \
            *, \
            ( \
                SELECT \
                    (r.val * 1.0 / p.val) * 100.0 > poll.acceptance_percentage \
                FROM \
                    ( \
                        SELECT \
                            COUNT(participation.*) AS val \
                        FROM \
                            participation \
                        WHERE \
                            participation.poll_id = $1 \
                    ) p, \
                    ( \
                        SELECT \
                            COUNT(anonymous_closed_response.*) AS val \
                        FROM \
                            anonymous_closed_response \
                        WHERE \
                            anonymous_closed_response.poll_id = $1 \
                    ) r \
            ) AS accepted, \
            ( \
                SELECT \
                    array_to_json(array_agg(row_to_json(q))) \
                FROM \
                    ( \
                        SELECT \
                            question, \
                            vote_count \
                        FROM \
                            closed_question_result \
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
    ; \
    ';
  try {
    const results = await DataBase.query(getResultByIdQuery, [poll_id]);
    Log.info(`Request to results for poll with id: ${poll_id}`);
    return results.rows[0].row_to_json;
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const postResult = async () => {
  response.status(200);
};

module.exports = { getResults, getResultById, postResult };
