const mysql = require('mysql');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'anokha'
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
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'anokha_transactions'
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