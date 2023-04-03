const { db, transactions_db } = require('../connection');
const tokenGenerator = require('../middleware/tokenGenerator');
const tokenValidator = require('../middleware/tokenValidator');
const fs = require('fs');
const validator = require('validator');
 module.exports = {

    getUserDetails : [tokenValidator, async (req,res) => {
        if(req.authorization_tier == "ADMIN"){

        if(req.params.userName == undefined)
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
        else{
         let sql_q = `select * from AnokhaEventManager where userName = ?`;
         const db_connection = await db.promise().getConnection();
         try{
            const [result] = await db_connection.query(sql_q, [req.params.userName]);
            if(result.length == 0)
            {
                res.status(404).send({"error" : "no data found"});
            }
            else{
                res.status(200).send(result[0]);
            }
         }
         catch(err)
         {
            const now = new Date();
            now.setUTCHours(now.getUTCHours() + 5);
            now.setUTCMinutes(now.getUTCMinutes() + 30);
            const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
            fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
            fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
            res.status(500).send({"Error" : "Contact DB Admin if you see this message"});
         }
         finally{
            await db_connection.release();
         }
        }
    }else{
        res.status(401).send({"error" : "You have no rights to be here!"})
    }
     }],



     getEventDetails : [tokenValidator, async(req, res) => {
        if(req.authorization_tier == "ADMIN"){
        var sql_q = "";
        parameters = []
        if(req.body.eventDate == undefined && req.params.userName != undefined)
        {
            sql_q = `select * from AnokhaEventData where userName = ?`;
            parameters = [req.params.userName]
        }
        else if (req.params.userName != undefined){
            sql_q = `select * from AnokhaEventData where userName = ? and date = ?`;
            parameters = [req.params.userName,req.body.eventDate]
        }
        else{
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
       
        const db_connection = await db.promise().getConnection();
        try{
            const [result] = await db_connection.query(sql_q, parameters);
            if(result.length == 0)
            {
                res.status(404).send({"error" : "no data found"});
            }
            else{
                res.status(200).send(result);
            }
        }
        catch(err)
         {
            console.log(err);
            const now = new Date();
            now.setUTCHours(now.getUTCHours() + 5);
            now.setUTCMinutes(now.getUTCMinutes() + 30);
            const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
            fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
            fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
            res.status(500).send({"Error" : "Contact DB Admin if you see this message"});
         }
         finally{
            await db_connection.release();
         }
        }
        else{
            res.status(401).send({"error" : "You have no rights to be here!"})
        }

        
     }],




     createEvent : [tokenValidator, async  (req, res) => {

        if(req.body.eventName == undefined ||
            req.body.eventOrWorkshop == undefined ||
            req.body.description == undefined ||
            req.body.userName == undefined ||
            req.body.date == undefined ||
            req.body.eventTime == undefined ||
            req.body.venue == undefined ||
            req.body.fees == undefined ||
            req.body.totalNumberOfSeats == undefined ||
            req.body.departmentAbbr == undefined ||
            req.body.refundable == undefined ||
            req.body.groupOrIndividual == undefined ||
            req.body.maxCount == undefined ||
            !validatorisBoolean(req.body.groupOrIndividual) ||
            !validator.isNumeric(req.body.maxCount) ||
            validator.isEmpty(req.body.eventName) ||
        !validator.isBoolean(req.body.eventOrWorkshop) ||
        validator.isEmpty(req.body.description) ||
        validator.isEmpty(req.body.date) ||
        validator.isEmpty(req.body.eventTime) ||
        validator.isEmpty(req.body.venue) ||
        !validator.isNumeric(req.body.fees) ||
        !validator.isNumeric(req.body.totalNumberOfSeats) ||
        validator.isEmpty(req.body.departmentAbbr) ||
        !validator.isBoolean(req.body.refundable)
        )
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
        else if(req.body.groupOrIndividual == 0 && req.body.maxCount != 0)
        {
            res.status(400).send({"error" : "ANOKHAERRCODEUNDEFINEDPARAMETERS"});
        }
        else{
            
            const db_connection = await db.promise().getConnection();
            try{
                const lockName = "CREATEVENT";
                const lockTimeout = 10;
                await db_connection.query(`SELECT GET_LOCK(?,?)`, [lockName, lockTimeout]);
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                let sql_q = `insert into EventData (eventName, eventOrWorkshop, groupOrIndividual, maxCount, description, userName, date, eventTime, venue, fees, totalNumberOfSeats, noOfRegistrations, timeStamp, refundable, departmentAbbr) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const [result] = await db_connection.query(sql_q, [req.body.eventName,req.body.eventOrWorkshop,req.body.groupOrIndividual, req.body.maxCount, req.body.description,req.body.userName,req.body.date,req.body.eventTime,req.body.venue,req.body.fees,req.body.totalNumberOfSeats,req.body.noOfRegistrations,req.body.timeStamp,req.body.refundable,req.body.departmentAbbr]);
                await db_connection.query(`SELECT RELEASE_LOCK(?)`, [lockName]);
                res.status(201).send({result : "Data Inserted Succesfully"});
            }
        
            catch(err)
            {
                if(err.errno = 1452)
                {
                    res.status(400).send({error : "Foreign Key Constraint Error"});
                }
                else{
                    const now = new Date();
                    now.setUTCHours(now.getUTCHours() + 5);
                    now.setUTCMinutes(now.getUTCMinutes() + 30);
                    const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                    fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                    fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                    res.status(500).send({"Error" : "Contact DB Admin if you see this message"});
                }
            }
           finally{
            await db_connection.release();
           }
        }
     }],





     adminLogin : async (req, res) => {
        if(req.body.userName == undefined || req.body.password == undefined)
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
        else{
        let sql_q = `select * from EventManager where userName = ? and password = ?`
            const db_connection = await db.promise().getConnection();
            try{
                const [result] = await db_connection.query(sql_q, [req.body.userName, req.body.password]);
                if(result.length == 0)
                {
                    res.status(404).send({error : "User not found"})
                }
                else{

                    const token = await tokenGenerator({
                        userName : req.body.userName,
                        name : result.fullName,
                        managerPhoneNumber : result.managerPhoneNumber,
                        role : result[0].role
                    });
                    res.json({
                        
                            userName : result[0].userName,
                            fullName : result[0].name,
                            phoneNumber : result[0].phoneNumber,
                            SECRET_TOKEN : token
                        
                    });
                
                }
            }
            
            catch(err){
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                res.status(500).send({"Error" : "Contact DB Admin if you see this message"});
            }
            finally{
                await db_connection.release();
            }
        
    }
    },



    registeredUsers : [tokenValidator, async (req,res) => {

        if(req.params.eventId == undefined || !validator.isNumeric(req.params.eventId))

        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
        else{
        let sql = `select * from anokhaeventregisteredstudents where eventId = ?`

        const db_connection = await db.promise().getConnection();
        try{
            const [result] = await db_connection.query(sql, [req.params.eventId]);
            res.status(200).send(result);
        }
        catch(err)
        {
            const now = new Date();
            now.setUTCHours(now.getUTCHours() + 5);
            now.setUTCMinutes(now.getUTCMinutes() + 30);
            const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
            fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
            fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
            res.status(500).send({"Error" : "Contact DB Admin if you see this message"});
        }
        finally{
            await db_connection.release();
        }
        
           
    
    }
    }],



    updateEventData : [tokenValidator,  async (req, res) => {
        if(req.body.eventName == undefined ||
            req.body.eventOrWorkshop == undefined ||
            req.body.description == undefined ||
            req.body.userName == undefined ||
            req.body.eventDate == undefined ||
            req.body.eventTime == undefined ||
            req.body.venue == undefined ||
            req.body.fees == undefined ||
            req.body.totalNumberOfSeats == undefined ||
            req.body.departmentAbbr == undefined ||
            req.body.refundable == undefined ||
            req.body.eventId == undefined ||
            !validator.isNumeric(req.body.eventId)||
            validator.isEmpty(req.body.eventName) ||
        !validator.isBoolean(req.body.eventOrWorkshop) ||
        validator.isEmpty(req.body.description) ||
        validator.isEmpty(req.body.eventDate) ||
        validator.isEmpty(req.body.eventTime) ||
        validator.isEmpty(req.body.venue) ||
        !validator.isNumeric(req.body.fees) ||
        !validator.isNumeric(req.body.totalNumberOfSeats) ||
        validator.isEmpty(req.body.departmentAbbr) ||
        req.body.groupOrIndividual == undefined ||
        req.body.maxCount == undefined ||
        !validatorisBoolean(req.body.groupOrIndividual) ||
        !validator.isNumeric(req.body.maxCount) ||
        !validator.isBoolean(req.body.refundable)
        )
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
        else if(req.body.groupOrIndividual == 0 && req.body.maxCount != 0)
        {
            res.status(400).send({"error" : "ANOKHAERRCODEUNDEFINEDPARAMETERS"});
        }
        else{
            const db_connection = await db.promise().getConnection();
            try{
                const [result] = db.query(`update EventData set eventName = ?, groupOrIndividual = ?, maxCount = ?, description = ?, date = ?, eventTime = ?, venue = ?, fees = ?, totalNumberOfSeats = ?, refundable = ?, departmentAbbr = ? where eventId = ? and userName = ?`[req.body.eventName,req.body.groupOrIndividual, req.body.maxCount, req.body.description,req.body.eventDate,req.body.eventTime,req.body.venue,req.body.fees,req.body.totalNumberOfSeats,req.body.refundable,req.body.departmentAbbr,req.body.eventId,req.body.userName]);
                if(result.affectedRows == 0)
                {
                    res.status(400).send({"error" : "Error in data"});
                }
                else{
                res.status(200).send({result : "Updated Succesfully"});
                }}

           
            catch(err)
            {
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                res.status(500).send({error : "Query Error"})
            }
            finally{
                await db_connection.release();
            }
        
    }
    }],
















    verifyUser : [tokenValidator,async (req,res) => {

        if(req.authorization_tier == "SECURITY")
        {
        
        if(req.params.userEmail == undefined) {
            res.sendStatus(400).send("URL not found")
        }
        const db_connection = await db.promise().getConnection();
        let sql_q = `select * from userData where userEmail = ?`;

        try {
        db.query(sql_q,[req.params.userEmail],(err,result) => {
            if(err) {
                res.send("Error");
            }
            else {
                res.send(result);
            }
            
        })
    }


    catch(err)
            {
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                res.status(500).send({error : "Query Error"})
            }

            finally{
                await db_connection.release();
            } 
        }
        else{
            res.status(401).send({"error" : "You have no rights to be here!"})
        }   
        
    }]
    
}

