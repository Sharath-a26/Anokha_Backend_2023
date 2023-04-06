const createTransactionTable = (transactions_db) => {
    transactions_db.query("create table Transactions (transactionId varchar(50) primary key, productId varchar(50) not null, userEmail varchar(50) NOT NULL,senderName varchar(50) NOT NULL, eventIdOrPassportId varchar(25) NOT NULL,amount int NOT NULL,timeStamp datetime NOT NULL, transactionStatus varchar(10) not null, address varchar(100) not null,city varchar(50) not null, state varchar(50) not null, zipcode varchar(20) not null, phoneNumber varchar(10) not null)",(err,result) => {
        if(err) {
            console.log("Failed to create transaction table");
        }
        else {
            console.log("Transactions table created succesfully");
        }
    })
}

module.exports = createTransactionTable;
