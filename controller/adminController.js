const { db, transactions_db } = require('../connection');
const tokenGenerator = require('../middleware/tokenGenerator');
const tokenValidator = require('../middleware/tokenValidator');
const fs = require('fs');
const validator = require('validator');


 module.exports = {

     getAdminDetails : [tokenValidator, async (req,res) => {
        if(req.params.adminEmail == undefined || !validator.isEmail(req.params.adminEmail))
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
        else{
         let sql_q = `select * from AnokhaEventManager where eventManagerEmail = ?`;
         const db_connection = await db.promise().getConnection();
         try{
            const [result] = await db_connection.query(sql_q, [req.params.adminEmail]);
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
     }],



     getEventDetails : [tokenValidator, async(req, res) => {
        var sql_q = "";
        parameters = []
        if(req.body.eventDate == undefined && validator.isEmail(req.params.eventManagerEmail))
        {
            sql_q = `select * from AnokhaEventData where eventManagerEmail = ?`;
            parameters = [req.params.eventManagerEmail]
        }
        else if (validator.isEmail(req.params.eventManagerEmail)){
            sql_q = `select * from AnokhaEventData where eventManagerEmail = ? and date = ?`;
            parameters = [req.params.eventManagerEmail,req.body.eventDate]
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
        
     }],




     createEvent : [tokenValidator, async  (req, res) => {

        if(req.body.eventName == undefined ||
            req.body.eventOrWorkshop == undefined ||
            req.body.description == undefined ||
            req.body.eventManagerEmail == undefined ||
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
        !validator.isEmail(req.body.eventManagerEmail) ||
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
                let sql_q = `insert into EventData (eventName, eventOrWorkshop, groupOrIndividual, maxCount, description, eventManagerEmail, date, eventTime, venue, fees, totalNumberOfSeats, noOfRegistrations, timeStamp, refundable, departmentAbbr) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                const [result] = await db_connection.query(sql_q, [req.body.eventName,req.body.eventOrWorkshop,req.body.groupOrIndividual, req.body.maxCount, req.body.description,req.body.eventManagerEmail,req.body.date,req.body.eventTime,req.body.venue,req.body.fees,req.body.totalNumberOfSeats,req.body.noOfRegistrations,req.body.timeStamp,req.body.refundable,req.body.departmentAbbr]);
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
        if(req.body.eventManagerEmail == undefined || req.body.password == undefined || !validator.isEmail(req.body.eventManagerEmail) ||
        validator.isEmpty(req.body.password))
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
        else{
        let sql_q = `select * from AnokhaEventManager where eventManagerEmail = ? and password = ?`
            const db_connection = await db.promise().getConnection();
            try{
                const [result] = await db_connection.query(sql_q, [req.body.eventManagerEmail, req.body.password]);
                if(result.length == 0)
                {
                    res.status(404).send({error : "User not found"})
                }
                else{

                    const token = await tokenGenerator({
                        eventManagerEmail : req.body.eventManagerEmail,
                        name : result.fullName,
                        managerPhoneNumber : result.managerPhoneNumber
                    });
                    res.json({
                        
                            eventManagerEmail : result[0].eventManagerEmail,
                            fullName : result[0].name,
                            managerPhoneNumber : result[0].managerPhoneNumber,
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
        let sql = `select * from AnokhaEventRegisteredStudents where eventId = ?`
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



    updateEventData : [tokenValidator, async (req, res) => {
        if(req.body.eventName == undefined ||
            req.body.eventOrWorkshop == undefined ||
            req.body.description == undefined ||
            req.body.eventManagerEmail == undefined ||
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
        !validator.isEmail(req.body.eventManagerEmail) ||
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
                const [result] = db.query(`update EventData set eventName = ?, groupOrIndividual = ?, maxCount = ?, description = ?, date = ?, eventTime = ?, venue = ?, fees = ?, totalNumberOfSeats = ?, refundable = ?, departmentAbbr = ? where eventId = ? and eventManagerEmail = ?`[req.body.eventName,req.body.groupOrIndividual, req.body.maxCount, req.body.description,req.body.eventDate,req.body.eventTime,req.body.venue,req.body.fees,req.body.totalNumberOfSeats,req.body.refundable,req.body.departmentAbbr,req.body.eventId,req.body.eventManagerEmail]);
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

    getUserDetails : [tokenValidator,(req,res) => {
        
        if(req.params.userEmail == undefined) {
            res.sendStatus(400).send("URL not found")
        }
        let sql_q = `select * from userData where userEmail = ?`;
        db.query(sql_q,[req.params.userEmail],(err,result) => {
            if(err) {
                res.send("Error");
            }
            else {
                res.send(result);
            }
            
        })
        
    }]
    
}

