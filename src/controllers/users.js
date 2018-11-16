const userService = require('../services/users.js');

const Log = require('../utils/logger');
const Error = require('../errors/statusError');
const utils = require('../utils/utils.js');
const CODES = require('../constants/httpCodes');

function throwErrorForQueryParams(queryParams) {
  if (!utils.isEmptyObject(queryParams)) {
    throw new Error(CODES.STATUS.BAD_REQUEST, 'Query params are not supported yet');
  }
}

const getUsers = async (req, res) => {
  try {
    throwErrorForQueryParams(req.query);
    const data = await userService.getUsers();
    res.status(CODES.STATUS.OK).json(data);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

const getUserById = async (req, res) => {
  try {
    throwErrorForQueryParams(req.query);
    const { id } = req.params;
    if (!utils.isPositiveInteger(id)) {
      Log.warn(`Invalid Id = (${id}) was used to request an user by ID`);
      throw new Error(CODES.STATUS.BAD_REQUEST, 'Invalid user ID');
    }
    const data = await userService.getUserById(id);
    if (utils.isEmptyArray(data)) {
      Log.warn(`Non existent user was requested with id: ${id}`);
      throw new Error(CODES.STATUS.NOT_FOUND, 'User does not exists');
    }
    res.status(CODES.STATUS.OK).json(data);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

const createUser = async (req, res) => {
  try {
    throwErrorForQueryParams(req.query);
    const { name, email } = req.body;
    const data = await userService.createUser(name, email);
    Log.info(`New user created with ID: ${data}`);
    res.status(CODES.STATUS.CREATED).send(`User created with ID: ${data}`);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

const updateUser = async (req, res) => {
  try {
    throwErrorForQueryParams(req.query);
    const { id } = req.params;
    const { name, email } = req.body;
    await userService.createUser(id, name, email);
    Log.info(`User modified with ID: ${id}`);
    res.status(CODES.STATUS.OK).send(`User modified with ID: ${id}`);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

const deleteUser = async (req, res) => {
  try {
    throwErrorForQueryParams(req.query);
    const { id } = req.params;
    await userService.createUser(id);
    Log.info(`User deleted with ID: ${id}`);
    res.status(CODES.STATUS.OK).send(`User deleted with ID: ${id}`);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
