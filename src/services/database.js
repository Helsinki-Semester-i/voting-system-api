const fs = require('fs');

const Pool = require('pg').Pool;

const PGUSER = process.env.PGUSER;
const PGHOST = process.env.PGHOST;
const PGPASSWORD = process.env.PGPASSWORD;
const PGDATABASE = process.env.PGDATABASE;
const PGPORT = process.env.PGPORT;
const CAPATH = process.env.CAPATH;
const KEYPATH = process.env.KEYPATH;
const CERTPATH = process.env.CERTPATH;

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
