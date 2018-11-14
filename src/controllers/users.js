const userService = require('../services/users.js');

const Error = require('../errors/statusError');
const utils = require('../utils/utils.js');

const getUsers = async (req, res) => {
  try {
    if (!utils.isEmptyObject(req.query)) {
      throw new Error(400, 'Query params are not supported yet');    
    }
    let data = await userService.getUsers()
    console.log('dsadas: ', data);
    res.status(200).json(data);
    
  } catch (err) {
    res.status(err.code).send({ error: err.msg });
  }
};

module.exports = {
  getUsers,
};
