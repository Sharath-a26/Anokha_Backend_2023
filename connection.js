const mysql = require('mysql2');


const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'anokha',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


const transactions_db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'anokha_transactions',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

module.exports = {db, transactions_db};