var mysql= require('mysql');

var connection = mysql.createConnection({
    'host': 'sql12.freemysqlhosting.net',
    'user': 'sql12625300',
    'password': 'NLc2ArjhNR',
    'database': 'sql12625300',
    'port': '3306'
})

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

module.exports=connection;