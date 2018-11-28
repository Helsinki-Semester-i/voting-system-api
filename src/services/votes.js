/* eslint-disable camelcase */
const DataBase = require('./database.js');

const Log = require('../utils/logger');
const Error = require('../errors/statusError');
const CODES = require('../constants/httpCodes');

const getAnonymousVoteByCode = async (code) => {
  // eslint-disable-next-line no-multi-str
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
;';
  try {
    const results = await DataBase.query(getVoteByCodeQuery, [code]);
    Log.info(`Request to ballot with code: ${code}`);
    return results.rows[0].row_to_json;
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const postAnonymousVote = async (poll_id, poll_anonymity, questions) => {
  function makeid() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 8; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
  try {
    const code = makeid();
    await DataBase.query('INSERT INTO anonymous_ballot(poll_id,poll_anonymity,unique_code) VALUES($1,$2,$3);', [poll_id, poll_anonymity, code]);
    Log.info(`Anonymous ballot created with code: ${code}`);
    const data = await DataBase.query('SELECT * FROM anonymous_ballot WHERE unique_code = $1;', [code]);
    if (data.length === 0 || data === null){
        Log.warn("Data is empty");
        throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR); //PUT CUSTOM ERROR HERE
    }
    const id = data.rows[0].id;
    // CREATE ALL THE RESPONSES
    // eslint-disable-next-line no-use-before-define
    await createAnonymous_closed_response(id, poll_id, poll_anonymity, questions);

    // TODO: --  UPDATE USER STATUS
    return data.rows[0];
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

/* eslint-disable */
const createAnonymous_closed_response = async (ballot_id, poll_id, poll_anonymity, questions) => {
  try {
    for (let i in questions) {
      const question_priority = questions[parseInt(i)].order_priority;
      let response = null;
      response = questions[parseInt(i)].response;
      await DataBase.query('INSERT INTO anonymous_closed_response(ballot_id,poll_id,poll_anonymity,poll_priority,option_priority)VALUES($1,$2,$3,$4,$5);',
        [ballot_id, poll_id, poll_anonymity, question_priority, response]);
    }
    Log.info(`Responses created for anonymous ballot with id: ${ballot_id}`);
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

module.exports = { getAnonymousVoteByCode, postAnonymousVote };
