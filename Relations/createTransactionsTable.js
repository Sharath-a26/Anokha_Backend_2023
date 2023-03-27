const createTransactionTable = (transactions_db) => {
    transactions_db.query("create table Transactions (transactionId varchar(50) UNIQUE,userEmail varchar(50) NOT NULL,sender varchar(50) NOT NULL,senderAccNo varchar(50) NOT NULL,receiver varchar(50) NOT NULL,receiverAccNo varchar(50) NOT NULL,eventIdOrPassportId varchar(25) NOT NULL,amount int NOT NULL,timeStamp datetime NOT NULL, transactionStatus boolean, PRIMARY KEY(userEmail, timeStamp, eventIdOrPassportId))",(err,result) => {
        if(err) {
            console.log("Failed to create transaction table");
        }
        else {
            console.log("Transactions table created succesfully");
        }
    })
}

module.exports = createTransactionTable;