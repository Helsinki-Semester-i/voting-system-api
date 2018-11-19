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
    Log.error(error);
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const getUserById = async (id) => {
  try {
    const results = await DataBase.query('SELECT * FROM wiki_user WHERE id = $1', [id]);
    Log.info(`Request to get user with id: ${id}`);
    return results.rows;
  } catch (error) {
    Log.error(error);
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const createUser = async (name, email) => {
  try {
    const results = await DataBase.query('INSERT INTO wiki_user (name, email) VALUES ($1, $2)', [name, email]);
    Log.info(`User created with name ${name}, email ${email}, and id ${results.insertedId}`);
    return results.insertedId;
  } catch (error) {
    Log.error(error);
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const updateUser = async (id, name, email) => {
  try {
    await DataBase.query(
      'UPDATE wiki_user SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
    );
    Log.info(`User modified with ID: ${id}`);
  } catch (error) {
    Log.error(error);
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

const deleteUser = async (id) => {
  try {
    await DataBase.query('DELETE FROM wiki_user WHERE id = $1', [id]);
    Log.info(`User deleted with ID: ${id}`);
  } catch (error) {
    Log.error(error);
    throw new Error(CODES.STATUS.INT_SERV_ERR, CODES.MSG.INT_SERV_ERR);
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
