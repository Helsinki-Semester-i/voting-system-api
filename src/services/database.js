const fs = require('fs')

const Pool = require('pg').Pool

const PGUSER= 'postgres'
const PGHOST= '35.224.151.49'
const PGPASSWORD= 'postgrestest'
const PGDATABASE= 'postgres'
const PGPORT= 5432 //Hace falta definir el puerto

//const PGUSER= 'postgres'
//const PGHOST= '35.236.121.106'
//const PGPASSWORD= 'postgres'
//const PGDATABASE= 'postgres'
//const PGPORT= 5432 //Hace falta definir el puerto

//const CAPATH = "server-ca.pem"
//const KEYPATH = "client-key.pem"
//const CERTPATH = "client-cert.pem"
const DataBase = new Pool({
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

module.exports = DataBase
