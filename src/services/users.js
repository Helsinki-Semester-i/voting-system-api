/* eslint-disable camelcase */
const DataBase = require('./database.js');

const Log = require('../utils/logger');
const Error = require('../errors/statusError');
const CODES = require('../constants/httpCodes');

const getUsers = async () => {
  try {
    const results = await DataBase.query('SELECT * FROM wiki_user ORDER BY id ASC');
    Log.info('Request for all users');
    return results.rows;
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const getUserIdByEmail = async (email) => {
  try {
    const results = await DataBase.query('SELECT id FROM wiki_user WHERE email = $1;', [email]);
    Log.info('Request for user ID by email');
    return results.rows;
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const getUserById = async (id) => {
  // eslint-disable-next-line no-multi-str
  const getUserByIdQuery = 'SELECT \
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
                          poll.*, \
                          p.vote_status \
                      FROM \
                          poll JOIN ( \
                              SELECT \
                                  * \
                              FROM \
                                  participation \
                              WHERE \
                                  wiki_user_id = $1 \
                          ) p ON poll.id = p.poll_id \
                  ) q \
          ) AS polls \
      FROM \
          wiki_user \
      WHERE \
          id = $1 \
  ) t \
;';
  try {
    const results = await DataBase.query(getUserByIdQuery, [id]);
    Log.info(`Request to get user with id: ${id}`);
    return results.rows;
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const createUser = async (first_name, last_name, email, phone) => {
  try {
    await DataBase.query('INSERT INTO wiki_user (first_name,last_name, email, phone) VALUES ($1,$2,$3,$4)', [first_name, last_name, email, phone]);
    Log.info('Request to create new Wiki user');
    const id = await DataBase.query('SELECT * FROM wiki_user WHERE email = $1', [email]);
    return id.rows;
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const updateUser = async (id, first_name, last_name, email, phone) => {
  try {
    await DataBase.query(
      'UPDATE wiki_user SET first_name = $2, last_name = $3, email = $4, phone = $5 WHERE id = $1',
      [id, first_name, last_name, email, phone],
    );
    Log.info(`User modified with ID: ${id}`);
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const deleteUser = async (id) => {
  try {
    await DataBase.query('DELETE FROM wiki_user WHERE id = $1', [id]);
    Log.info(`User deleted with ID: ${id}`);
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const setVoteStatus = async (uid, poll_id, status) => {
  try {
    await DataBase.query('UPDATE participation SET vote_status = $3 WHERE wiki_user_id = $1 AND poll_id = $2;', [uid, poll_id, status]);
    Log.info(`Vote user ID: ${uid} on poll: ${poll_id} set to status: ${status}`);
  } catch (error) {
    Log.error(JSON.stringify(error));
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserIdByEmail,
  createUser,
  updateUser,
  deleteUser,
  setVoteStatus,
};