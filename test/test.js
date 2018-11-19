var assert = require('assert');
var pgtestdb = require('pg-testdb');
var database = require('./database.js');
describe('Connection', function() {
    describe('#indexOf()', function() {
        it('should return -1 when the value is not present', function() {
            assert.equal([1,2,3].indexOf(4), -1);
        });
    });
});

database.tests = [
    // 2.1 Define initial test function
    // The first function should should run "client.connect();" to connect to the test database
    // This function can be used to initialize tables for testing
    client => {
      client.connect(); // IMPORTANT: connect client
      console.log('Connected to test db');
      return client.query('CREATE TABLE created_table (some_text text, some_number numeric);')
        .then(() => {
          // Do something after table creation
          console.log('Test table "created_table" created.');
        })
        .catch(err => {
          // Handle table creation error
          console.log('Test table "created_table" creation failed.');
        });
    },
   
    // 2.2 Define second test function
    // The second function runs after the first one succeeds
    // This function can be used to include data into the table created from the first function
    client => {
      return client.query("INSERT INTO created_table VALUES ('text data 1', 1), ('text data 2', 2);")
        .then(() => {
          // Do something after insert
          console.log('INSERT test passed!');
        })
        .catch(err => {
          // Handle insert error
          console.log('INSERT test failed.');
        });
    },
   
    // 2.3 Define third test function
    // The third function runs after the second one succeeds
    // This function can be used to query the inserted data from the third function
    client => {
      return client.query('SELECT * FROM created_table;')
        .then(res => {
          // Do something after select query
          console.log('SELECT test passed!');
          console.log(res.rows[0]); // {some_text: 'text data 1', some_number: '1'}
          console.log(res.rows[1]); // {some_text: 'text data 2', some_number: '2'}
        })
        .catch(err => {
          // Handle select query error
          console.log('SELECT test failed.');
        });
    }
   
    // 2.4 Define additional test functions
    // Any number of functions following the above structure can be defined
    // If a function errors out, the test database will be dropped and the error handled
  ];
   
  // 3. Run test functions in test database
  // Each function in "options.tests" is run in order inside the defined "options.testdb"
  // If an error occurs, the error will be handled as defined and the test database dropped
  // Re-running this with the defined "options" will recreate the test database and run the test functions inside it
  pgtestdb(database, (err, res) => {
   
    // 4. Drop test database
    // The test database is dropped if all tests succeed or if an error occurs
    // Do something after dropping the test database
    console.log('Test database "pgtestdb" dropped.');
  });