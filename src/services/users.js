const DataBase = require('./database.js')

const Error = require('../errors/statusError');

const getUsers = async () => {
    try {
        const results = await DataBase.query('SELECT * FROM wiki_user ORDER BY id ASC');
        console.log('Request to get users')
        return results.rows;
    } catch (error) {
        console.log('error: ', error);
        throw new Error(500, 'Error conecting to DB');
    }
}

const getUserById = (request, response, next) => {
    const id = parseInt(request.params.id)

    DataBase.query('SELECT * FROM wiki_user WHERE id = $1', [id], (error, results) => {
        if (error) {
            next(error);
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response, next) => {
    const { name, email } = request.body

    DataBase.query('INSERT INTO wiki_user (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if (error) {
            next(error);
        }
        response.status(201).send(`User added with ID: ${result.insertId}`)
    })
}

const updateUser = (request, response, next) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body
  
    DataBase.query(
      'UPDATE wiki_user SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
      (error, results) => {
        if (error) {
            next(error);
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
}

const deleteUser = (request, response, next) => {
    const id = parseInt(request.params.id)
  
    DataBase.query('DELETE FROM wiki_user WHERE id = $1', [id], (error, results) => {
      if (error) {
        next(error);
      }
      response.status(200).send(`User deleted with ID: ${id}`)
    })
}

module.exports = {
    getUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
}