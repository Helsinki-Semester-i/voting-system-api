const PGUSER= process.env.PGUSER;
const PGHOST= process.env.PGHOST;
const PGPASSWORD= process.env.PGPASSWORD;
const PGPORT= process.env.PGPORT;
// 1. Define test database details
// Enter your Postgres connection details below
// The user should be have super user privileges
// "testdb" is the test database, which should not already exist
var options = {
  testdb: 'pgtestdb', // test db name
  messages: true, // display info
  connection: { // postgres connection details
    host : PGHOST,
    user: PGUSER,
    password: PGPASSWORD,
    port: PGPORT
  }
};

module.exports = options
 
