const Pool = require('pg').Pool
const fs = require('fs')

const PGUSER= 'postgres'
const PGHOST= '35.224.151.49'
const PGPASSWORD= 'postgrestest'
const PGDATABASE= 'voting-system-api:us-central1:test-db'
const PGPORT= 5432 //Hace falta definir el puerto

//const PGUSER= 'postgres'
//const PGHOST= '35.236.121.106'
//const PGPASSWORD= 'postgres'
//const PGDATABASE= 'voting-system-api:us-west2:voting-system-db-production'
//const PGPORT= 5432 //Hace falta definir el puerto

//const CAPATH = "server-ca.pem"
//const KEYPATH = "client-key.pem"
//const CERTPATH = "client-cert.pem"
const pool = new Pool({
  database : PGDATABASE,
  host     : PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  port: PGPORT,
  // this object will be passed to the TLSSocket constructor
  //ssl : {
  //  rejectUnauthorized : false,
  //  ca   : fs.readFileSync(CAPATH).toString(),
  //  key  : fs.readFileSync(KEYPATH).toString(),
  //  cert : fs.readFileSync(CERTPATH).toString(),
  //}
})

const getUsers = (request, response) => {
    pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
      if (error) {
        throw error
      }
      response.status(200).json(results.rows)
    })
}

const getUserById = (request, response) => {
    const id = parseInt(request.params.id)

    pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
        if (error) {
        throw error
        }
        response.status(200).json(results.rows)
    })
}

const createUser = (request, response) => {
    const { name, email } = request.body

    pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email], (error, results) => {
        if (error) {
        throw error
        }
        response.status(201).send(`User added with ID: ${result.insertId}`)
    })
}

const updateUser = (request, response) => {
    const id = parseInt(request.params.id)
    const { name, email } = request.body
  
    pool.query(
      'UPDATE users SET name = $1, email = $2 WHERE id = $3',
      [name, email, id],
      (error, results) => {
        if (error) {
          throw error
        }
        response.status(200).send(`User modified with ID: ${id}`)
      }
    )
}

const deleteUser = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM users WHERE id = $1', [id], (error, results) => {
      if (error) {
        throw error
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