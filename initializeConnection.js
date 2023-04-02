const mysql = require('mysql2');

const establishConnection = () => {

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

return [db, transactions_db];

}

module.exports = establishConnection;