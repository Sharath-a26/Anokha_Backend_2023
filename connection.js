const mysql = require('mysql');
require('dotenv').config()

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

db.connect((err) => {
    if(err)
    {
        console.log("Failed to connect to MySequel");
        console.log(err);
    }
    else{
       console.log("Connected to MySequel...");
    }
});


const transactions_db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.TRANSACTIONS_DATABASE
})

transactions_db.connect((err) => {
    if(err)
    {
        console.log("Failed to connect to MySequel (Transactions)");
        console.log(err);
    }
    else{
       console.log("Connected to MySequel (Transactions)...");
    }
})

module.exports = {db, transactions_db};