const express = require('express')
const createTables = require('./Relations/createRelations');
const dropTables = require('./Relations/dropRelations');
const createTransactionTable = require('./Relations/createTransactionsTable')
const dropTransactionTable = require('./Relations/dropTransactionsTable')
const cluster = require('cluster');
const { pid } = require('process');
const numCPUs = require('os').cpus().length;
const {db, transactions_db} = require('./connection');
const insertDummyData = require('./SampleData/dummyData');
const server = express();
const port = 3000;


//Creating master and slave threads
if(cluster.isMaster){
    
    
    
    //Drop command. Please be carefull!!
    dropTables(db);
    dropTransactionTable(transactions_db);



    //Creating tables. Please be careful!
    createTables(db);  
    createTransactionTable(transactions_db); 


    //Inserting Sample Data. Please be careful!
    insertDummyData(db, transactions_db);
    
    
    //Creating threads
    console.log(`Master Process is creating ${numCPUs} threads`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
        console.log(`Process ${i} created...`)
      }
     
}

else{

    

    
    //Thread listening on port PORT
    server.listen(port,  (err) => {
        if(err){
            console.log("Error starting server");
        }
        else{
            console.log(`Process ${pid} listening on port ${port}`)
        }
    })

    //Routes
   

    
   
  }



