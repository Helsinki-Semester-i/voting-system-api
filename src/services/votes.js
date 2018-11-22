const DataBase = require('./database.js');

const Log = require('../utils/logger');
const Error = require('../errors/statusError');
const CODES = require('../constants/httpCodes');

const getVotes = async() => {
    response.status(200);
}

const getVoteByCode = async(code) => {
    const getVoteByCodeQuery = 'SELECT \
    row_to_json(t) \
FROM \
    ( \
        SELECT \
            *, \
            ( \
                SELECT \
                    row_to_json(p) \
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
                                                            (CASE WHEN closed_option.order_priority = anonymous_closed_response.option_priority THEN true ELSE false END) AS chosen \
                                                        FROM \
                                                            closed_option LEFT JOIN anonymous_closed_response \
                                                                ON closed_option.poll_id = anonymous_closed_response.poll_id \
                                                                    AND closed_option.poll_anonymity = anonymous_closed_response.poll_anonymity \
                                                                    AND closed_option.question_order_priority = anonymous_closed_response.poll_priority \
                                                        WHERE \
                                                            closed_option.poll_id = poll.id \
                                                            AND closed_question.order_priority = question_order_priority \
                                                            AND anonymous_closed_response.ballot_id = anonymous_ballot.id \
                                                        ORDER BY \
                                                            order_priority \
                                                    ) o \
                                            ) AS question_option \
                                        FROM \
                                            closed_question \
                                        WHERE \
                                            closed_question.poll_id = poll.id \
                                        ORDER BY \
                                            order_priority \
                                    ) q \
                            ) AS questions \
                        FROM \
                            poll \
                        WHERE \
                            id = anonymous_ballot.poll_id \
                    ) p \
            ) AS poll \
        FROM \
            anonymous_ballot \
        WHERE \
            unique_code=$1 \
    ) t \
;'
    try {
        const results = await DataBase.query(getVoteByCodeQuery, [code]);
        Log.info(`Request to ballot with code: ${code}`);
        return results.rows[0].row_to_json;
    } catch (error) {
        Log.error(error);
        throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
    }
}

const postVote = async() => {
    response.status(200);
}

module.exports = {getVotes, getVoteByCode, postVote}