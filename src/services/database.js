// const fs = require('fs');

const { Pool } = require('pg');

const { PGUSER } = process.env;
const { PGHOST } = process.env;
const { PGPASSWORD } = process.env;
const { PGDATABASE } = process.env;
const { PGPORT } = process.env;
// const { CAPATH } = process.env;
// const { KEYPATH } = process.env;
// const { CERTPATH } = process.env;

const DataBase = new Pool({
  database: PGDATABASE,
  host: PGHOST,
  user: PGUSER,
  password: PGPASSWORD,
  port: PGPORT,
  // this object will be passed to the TLSSocket constructor
  // ssl : {
  //  rejectUnauthorized : false,
  //  ca   : fs.readFileSync(CAPATH).toString(),
  //  key  : fs.readFileSync(KEYPATH).toString(),
  //  cert : fs.readFileSync(CERTPATH).toString(),
  // }
});

module.exports = DataBase;
