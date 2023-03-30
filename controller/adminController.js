const { db, transactions_db } = require('../connection');
const tokenGenerator = require('../middleware/tokenGenerator');
const tokenValidator = require('../middleware/tokenValidator');
const fs = require('fs');
const validator = require('validator');

 module.exports = {

     getAdminDetails : [tokenValidator, (req,res) => {
        if(!validator.isEmail(req.params.adminEmail))
        {
            res.status(400).send({"error" : "You need to be much better to do so..."});
        }
        else{
         let sql_q = `select * from AnokhaEventManager where eventManagerEmail = ?`;
         db.query(sql_q,[req.params.adminEmail],(err,result) => {
             if(err) {
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                res.status(500).send({error : "Query Error... Contact DB Admin"});
            
             }
             else {
                  res.status(200).send(result[0]);
             }
         })
        }
     }],


     getEventDetails : [tokenValidator, (req, res) => {
        var sql_q = "";
        if(req.body.eventDate == undefined && validator.isEmail(req.params.eventManagerEmail))
        {
            sql_q = `select * from AnokhaEventData where eventManagerEmail = ?`;
            params = [req.params.eventManagerEmail]
        }
        else if (validator.isEmail(req.params.eventManagerEmail)){
            sql_q = `select * from AnokhaEventData where eventManagerEmail = ? and date = ?`;
            params = [req.params.eventManagerEmail,req.body.eventDate]
        }
       
        db.query(sql_q,params, (err, result) => {
            if(err)
            {
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                res.status(500).send({error : "Query Error... Contact DB Admin"});
                return;
            }
            else{
                res.status(200).send(result);
                return;
            }
        })
     }],

     createEvent : [tokenValidator,  (req, res) => {

        if(validator.isEmpty(req.body.eventName) ||
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
            res.status(400).send({"error" : "You need to be much better to do so..."});
        }
        else{
            const now = new Date();
            now.setUTCHours(now.getUTCHours() + 5);
            now.setUTCMinutes(now.getUTCMinutes() + 30);
            const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
        let sql_q = `insert into EventData (eventName, eventOrWorkshop, description, eventManagerEmail, date, eventTime, venue, fees, totalNumberOfSeats, noOfRegistrations, timeStamp, refundable, departmentAbbr) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        db.query(sql_q, [req.body.eventName,req.body.eventOrWorkshop,req.body.description,req.body.eventManagerEmail,req.body.date,req.body.eventTime,req.body.venue,req.body.fees,req.body.totalNumberOfSeats,req.body.noOfRegistrations,req.body.timeStamp,req.body.refundable,req.body.departmentAbbr],(err, result) => {
            if(err)
            {
                db.rollback()
                if(err.errno = 1452)
                {
                    res.status(400).send({error : "Foreign Key Constraint Error"});
                }
                else{
               
                   
                    fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                    fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                    res.status(500).send({error : "Query Error... Contact DB Admin"});
                }
            }
            else{
                db.commit()
                res.status(201).send({result : "Data Inserted Succesfully"});
            }
        })
        }
     }],

     adminLogin :  (req, res) => {
        if(req.body.eventManagerEmail == undefined || req.body.password == undefined || !validator.isEmail(req.body.eventManagerEmail) ||
        validator.isEmpty(req.body.password))
        {
            res.status(400).send({"error" : "You need to be much better to do so..."});
        }
        else{
        let sql_q = `select * from AnokhaEventManager where eventManagerEmail = ? and password = ?`
        db.beginTransaction()
        db.query(sql_q, [req.body.eventManagerEmail,req.body.password],async (err, result) => {
            if(err){
                db.rollback()
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                res.status(500).send({error : "Query Error... Contact DB Admin"});
            }
            else
            {
                db.commit()
                if(result.length == 0)
                {
                    res.status(404).send({error : "User not found"})
                }
                else{

                        const token = await tokenGenerator({
                            eventManagerEmail : req.body.eventManagerEmail,
                            password : req.body.password
                        });
                        res.json({
                            
                                eventManagerEmail : result[0].eventManagerEmail,
                                fullName : result[0].name,
                                managerPhoneNumber : result[0].managerPhoneNumber,
                                SECRET_TOKEN : token
                            
                        });
                    
                }
            }
        })
    }
    },

    registeredUsers : [tokenValidator, (req,res) => {
        if(!validator.isNumeric(req.params.eventId))
        {
            res.status(400).send({"error" : "You need to be much better to do so..."});
        }
        else{
        let sql = `select * from AnokhaEventRegisteredStudents where eventId = ?`
        db.beginTransaction()
        db.query(sql,[req.params.eventId],(err,result) => {
            if(err) {
                db.rollback()
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                res.status(500).send({error : "Query Error"})
            }
            else {
                db.commit()
                 res.send(result)
            }
        })
    }
    }],

    updateEventData : [tokenValidator, (req, res) => {
        db.query(`update EventData set eventName = ?, description = ?, date = ?, eventTime = ?, venue = ?, fees = ?, totalNumberOfSeats = ?, refundable = ?, departmentAbbr = ? where eventId = ? and eventManagerEmail = ?`,
        [req.body.eventName,req.body.description,req.body.eventDate,req.body.eventTime,req.body.venue,req.body.fees,req.body.totalNumberOfSeats,req.body.refundable,req.body.departmentAbbr,req.body.eventId,req.body.eventManagerEmail], (err, result) => {
            if(err)
            {
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                res.status(500).send({error : "Query Error"})
            }
            else{
                if(result.affectedRows == 0)
                    {
                        res.status(400).send({"error" : "Error in data"});
                    }
                    else{
                    res.status(200).send({result : "Updated Succesfully"});
                    }
            }
        })
    }]
    
}

