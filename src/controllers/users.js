const { body, param, validationResult } = require('express-validator/check');
const userService = require('../services/users.js');

// utils
const valUtils = require('./validationUtils');

const validate = (method) => {
  switch (method) {
    case 'getUserIdByEmail': {
      return [
        param('email').isEmail().withMessage('Invalid email'),
      ];
    }
    case 'getUserById':
    case 'deleteUser': {
      return [
        param('id').isInt({ gt: 0 }).withMessage('Invalid user Id'),
      ];
    }
    case 'createUser': {
      return [
        body('first_name')
          .exists().withMessage('First name required'),
        body('last_name')
          .exists().withMessage('Last name required'),
        body('email')
          .exists().withMessage('email required')
          .isEmail()
          .withMessage('Invalid email'),
        body('phone')
          .exists().withMessage('Phone required')
          .isMobilePhone()
          .withMessage('Invalid phone'),
      ];
    }
    case 'updateUser': {
      return [
        body('first_name')
          .exists().withMessage('First name required'),
        body('last_name')
          .exists().withMessage('Last name required'),
        body('email')
          .exists().withMessage('email required')
          .isEmail()
          .withMessage('Invalid email'),
        body('phone')
          .exists().withMessage('Phone required')
          .isMobilePhone()
          .withMessage('Invalid phone'),
        param('id').isInt({ gt: 0 }).withMessage('Invalid user Id'),
      ];
    }
    default: return [];
  }
};

const getUsers = async (req, res) => {
  try {
    valUtils.throwErrorForQueryParams(req.query);
    const data = await userService.getUsers();
    res.status(valUtils.CODES.STATUS.OK).json(data);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

const getUserIdByEmail = async (req, res) => {
  try {
    valUtils.throwErrorForQueryParams(req.query);
    valUtils.checkValidationResult(validationResult(req));
    const { email } = req.params;
    const data = await userService.getUserIdByEmail(email);
    if (valUtils.helper.isEmptyArray(data)) {
      valUtils.Log.warn(`User with email ${email} does not exist`);
      throw new Error(valUtils.CODES.STATUS.NOT_FOUND, 'Searched user does not exists');
    }
    const userId = data[0];
    res.status(valUtils.CODES.STATUS.OK).json(userId);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

const getUserById = async (req, res) => {
  try {
    valUtils.throwErrorForQueryParams(req.query);
    valUtils.checkValidationResult(validationResult(req));
    const { id } = req.params;
    const data = await userService.getUserById(id);
    if (valUtils.helper.isEmptyArray(data)) {
      valUtils.Log.warn(`Non existent user was requested with id: ${id}`);
      throw new Error(valUtils.CODES.STATUS.NOT_FOUND, 'User does not exists');
    }
    const userData = data[0].row_to_json;
    res.status(valUtils.CODES.STATUS.OK).json(userData);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

const createUser = async (req, res) => {
  try {
    valUtils.throwErrorForQueryParams(req.query);
    valUtils.checkValidationResult(validationResult(req));
    const {
      // eslint-disable-next-line camelcase
      first_name, last_name, email, phone,
    } = req.body;
    const data = await userService.createUser(first_name, last_name, email, phone);
    const newUser = data[0];
    valUtils.Log.warn(`New wiki user created: ${JSON.stringify(newUser)}`);
    res.status(valUtils.CODES.STATUS.CREATED).json(newUser);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

const updateUser = async (req, res) => {
  try {
    valUtils.throwErrorForQueryParams(req.query);
    valUtils.checkValidationResult(validationResult(req));
    const { id } = req.params;
    const {
      // eslint-disable-next-line camelcase
      first_name, last_name, email, phone,
    } = req.body;
    await userService.createUser(id, first_name, last_name, email, phone);
    valUtils.Log.info(`User modified with ID: ${id}`);
    res.status(valUtils.CODES.STATUS.OK).send(`User modified with ID: ${id}`);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

const deleteUser = async (req, res) => {
  try {
    valUtils.throwErrorForQueryParams(req.query);
    valUtils.checkValidationResult(validationResult(req));
    const { id } = req.params;
    await userService.deleteUser(id);
    valUtils.Log.info(`User deleted with ID: ${id}`);
    res.status(valUtils.CODES.STATUS.OK).send(`User deleted with ID: ${id}`);
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

module.exports = {
  validate,
  getUsers,
  getUserById,
  getUserIdByEmail,
  createUser,
  updateUser,
  deleteUser,
};
