const express = require('express')
const helmet = require('helmet')
const createTables = require('./Relations/createRelations');
const dropTables = require('./Relations/dropRelations');
const createTransactionTable = require('./Relations/createTransactionsTable.js')
const dropTransactionTable = require('./Relations/dropTransactionsTable')
const cluster = require('cluster');
const { pid } = require('process');
const insertDummyData = require('./SampleData/dummyData');
const server = express()
const cors = require('cors');
const userAppRouter = require('./routes/userApp');
const adminAppRouter = require('./routes/adminApp');
const userWebRouter = require('./routes/userWeb.js');
const adminWebRouter = require('./routes/adminWeb.js');
const {generateKey, generateTransactionKey} = require('./AssymetricKeyPair/key');
const createViews = require('./ViewGenerator/views.js');
const establishConnection = require('./initializeConnection.js');
const insertCollegeData = require('./SampleData/collegeData');


const numberOfSlaves = 10;

const PORT = 4000;


    server.use(helmet())
    server.use(express.json());
    server.use(cors());
    
    
     //Routes
    server.use('/userApp', userAppRouter);
    server.use('/adminApp', adminAppRouter);
    server.use('/userWeb',userWebRouter);
    server.use('/adminWeb',adminWebRouter);

 



    if (cluster.isMaster) {
        console.log(`Master ${process.pid} is running`);

        db = establishConnection();
       

        const initializeStep1 = () => {
            //Drop command. Please be carefull!!
            dropTables(db[0]);
            dropTransactionTable(db[1]);

            //Creating tables. Please be careful!
            createTables(db[0]);  
            createTransactionTable(db[1]); 
            //Inserting Sample Data. Please be careful!

            insertCollegeData(db[0]);
            createViews(db[0], db[1]);
        
            //Key Generator
            //generateKey();
            //generateTransactionKey();
        
            console.log("initialization Done...");
        }

        const initializeStep2 = () =>{
            insertDummyData(db[0], db[1]);
            
            console.log("initialization Done...");
        }
        
        
            //Please be careful. Dont run this command if you have data in backend.
            //initializeStep1();
            //initializeStep2();
      
        // Fork workers
        for (let i = 0; i < numberOfSlaves; i++) {
          cluster.fork();
        }
      
        cluster.on('exit', (worker, code, signal) => {
          console.log(`Worker ${worker.process.pid} died`);
        });
    }

    else{
        server.listen(PORT,  (err) => {
                if(err){
                    console.log("Error starting server");
                }
                else{
                    console.log(`Process ${pid} listening on port ${PORT}`)
                }
            })
    }

    
    
   

    
   
  



