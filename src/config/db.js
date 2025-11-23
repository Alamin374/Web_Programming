const mysql = require('mysql2');
const connection = mysql.createPool({
host: 'localhost',
user: 'Alamin',
password: 'Alamin123',
database: 'task_management',
waitForConnections: true,
connectionLimit: 10,
queueLimit: 0
});
const promiseConnection = connection.promise();
module.exports = promiseConnection;
