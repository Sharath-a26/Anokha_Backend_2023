const dropTransactionsTable = (transactions_db) => {
    transactions_db.query("drop table Transactions",(err,result) => {
        if(err) {
            console.log("Error while dropping transaction table");
        }
        else {
            console.log("Transactions table dropped");
        }
    });
}

module.exports = dropTransactionsTable;