const Sequelize = require('sequelize')
const epilogue = require('epilogue')
const fs = require('fs')

const Postgres = require('pg')

const PGUSER= 'postgres'
const PGHOST= '35.236.121.106'
const PGPASSWORD= 'postgres'
const PGDATABASE= 'voting-system-api:us-west2:voting-system-db-production'
const PGPORT= 5432 //Hace falta definir el puerto

const CAPATH = "server-ca.pem"
const KEYPATH = "client-key.pem"
const CERTPATH = "client-cert.pem"

const config = {
  database : PGDATABASE,
  host     : PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  port: PGPORT,
  // this object will be passed to the TLSSocket constructor
  ssl : {
    rejectUnauthorized : false,
    ca   : fs.readFileSync(CAPATH).toString(),
    key  : fs.readFileSync(KEYPATH).toString(),
    cert : fs.readFileSync(CERTPATH).toString(),
  }
}
// const postgres = new Postgres({
//   user: PGUSER,
//   host: PGHOST,
//   database: PGPASSWORD,
//   password: PGDATABASE,
//   port: PGPORT,
// })
const postgres = new Postgres(config);
postgres.connect()
  .then(client => {
    console.log('connected')
    client.release()
  })
  .catch(err => console.error('error connecting', err.stack))
  .then(() => postgres.end())

postgres.query('SELECT NOW()', (err, res) => {
  console.log(err, res)
  postgres.end()
})

const database = new Sequelize({
  dialect: 'sqlite',
  storage: './test.sqlite',
  operatorsAliases: false
})

const Part = database.define('parts', {
  partNumber: Sequelize.STRING,
  modelNumber: Sequelize.STRING,
  name: Sequelize.STRING,
  description: Sequelize.TEXT
})

const initializeDatabase = async (app) => {
  epilogue.initialize({ app, sequelize: database })

  epilogue.resource({
    model: Part,
    endpoints: ['/parts', '/parts/:id']
  })

  await database.sync()
}

module.exports = initializeDatabase
