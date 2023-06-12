require('dotenv').config();
var mysql= require('mysql');

var connection = mysql.createConnection({
    'host': process.env.db_host,
    'user':process.env.user_name,
    'password': process.env.password,
    'database': process.env.db_name,
    'port': process.env.port
})

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('Connected to the database!');
});

module.exports=connection;