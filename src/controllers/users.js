const userService = require('../services/users.js');

const getUsers = (req, res) => {
  try {
    let data = userService.getUsers;
    res.status(200).json(data);
  } catch (err) {
    res.status(err.code).send(err.msg);
  }
};

module.exports = {
  getUsers,
};
