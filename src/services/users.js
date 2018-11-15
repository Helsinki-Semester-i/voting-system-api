const DataBase = require('./database.js');

const Error = require('../errors/statusError');

const getUsers = async () => {
  try {
    const results = await DataBase.query('SELECT * FROM wiki_user ORDER BY id ASC');
    console.log('Request to get users'); // eslint-disable-line
    return results.rows;
  } catch (error) {
    console.log('error: ', error); // eslint-disable-line
    throw new Error(500, 'Error conecting to DB');
  }
};

const getUserById = async (id) => {
  try {
    const results = await DataBase.query('SELECT * FROM wiki_user WHERE id = $1', [id]);
    console.log(`Request to get user with id: ${id}`); // eslint-disable-line
    return results.rows;
  } catch (error) {
    console.log('error: ', error); // eslint-disable-line
    throw new Error(500, 'Error conecting to DB');
  }
};

const createUser = async (name, email) => {
  try {
    const results = await DataBase.query('INSERT INTO wiki_user (name, email) VALUES ($1, $2)', [name, email]);
    console.log(`User created with name ${name}, email ${email}, and id ${results.insertedId}`); // eslint-disable-line
    return results.insertedId;
  } catch (error) {
    console.log('error: ', error); // eslint-disable-line
    throw new Error(500, 'Error conecting to DB');
  }
};

const updateUser = async (id, name, email) => {
  try {
    await DataBase.query(
      'UPDATE wiki_user SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
    );
    console.log(`User modified with ID: ${id}`); // eslint-disable-line
  } catch (error) {
    console.log('error: ', error); // eslint-disable-line
    throw new Error(500, 'Error conecting to DB');
  }
};

const deleteUser = async (id) => {
  try {
    await DataBase.query('DELETE FROM wiki_user WHERE id = $1', [id]);
    console.log(`User deleted with ID: ${id}`); // eslint-disable-line
  } catch (error) {
    console.log('error: ', error); // eslint-disable-line
    throw new Error(500, 'Error conecting to DB');
  }
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
