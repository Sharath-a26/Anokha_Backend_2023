const { db, transactions_db } = require('../connection');
const tokenGenerator = require('../middleware/tokenGenerator');
const tokenValidator = require('../middleware/tokenValidator');
const fs = require('fs');

 module.exports = {

     getAdminDetails : [tokenValidator, (req,res) => {
        if(!validator.isEmail(req.params.adminEmail))
        {
            res.status(400).send({"error" : "You need to be much better to do so..."});
        }
        else{
         let sql_q = `select * from eventManager where eventManagerEmail = ?`;
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
        var params = []
        if(validator.isEmpty(req.params.eventDate) && validator.isEmail(req.params.eventManagerEmail))
        {
            sql_q = `select * from EventData where eventManagerEmail = ?`;
            params = [req.params.eventManagerEmail]
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
                }
                else{
                    res.status(200).send(result);
                }
            })
        }
        else if (validator.isEmail(req.params.eventManagerEmail) && validator.isString(req.params.eventDate)){
            sql_q = `select * from EventData where eventManagerEmail = ? and date = ?`;
            params = [req.params.eventManagerEmail,req.params.eventDate]
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
                }
                else{
                    res.status(200).send(result);
                }
            })
        }
        else{
            res.status(400).send({"error" : "You need to be much better to do so..."});
        }
       
       
      
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
        db.query(sql_q, [req.body.eventName,req.body.eventOrWorkshop,req.body.description,req.body.eventManagerEmail,req.body.date,req.body.eventTime,req.body.venue,req.body.fees,req.body.totalNumberOfSeats,0,istTime,req.body.refundable,req.body.departmentAbbr],(err, result) => {
            if(err)
            {
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

                res.status(201).send({result : "Data Inserted Succesfully"});
            }
        })
        }
     }],

     adminLogin :  (req, res) => {
        if(!validator.isEmail(req.body.eventManagerEmail) ||
        validator.isEmpty(req.body.password))
        {
            res.status(400).send({"error" : "You need to be much better to do so..."});
        }
        else{
        let sql_q = `select * from EventManager where eventManagerEmail = ? and password = ?`
        db.query(sql_q, [req.body.eventManagerEmail,req.body.password],async (err, result) => {
            if(err){
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
        let sql = `select * from userData where userEmail in (select userEmail from registeredevents where eventId = 
            (select eventId from eventData where eventId = ?));`

        db.query(sql,[req.params.eventId],(err,result) => {
            if(err) {
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                res.status(500).send({error : "Query Error"})
            }
            else {
                 res.send(result)
            }
        })
    }
    }],

    updateEventData : [tokenValidator, (req, res) => {
        if(validator.isEmpty(req.body.eventName) ||
        validator.isEmpty(req.body.description) ||
        validator.isEmpty(req.body.eventDate) ||
        validator.isEmpty(req.body.eventTime) ||
        validator.isEmpty(req.body.venue) ||
        !validator.isNumeric(req.body.fees) ||
        !validator.isNumeric(req.body.totalNumberOfSeats) ||
        !validator.isBoolean(req.body.refundable) ||
        validator.isEmpty(req.body.departmentAbbr) ||
        !validator.isNumeric(req.body.eventId) ||
        !validator.isEmail(req.body.eventManagerEmail)
        ){
            res.status(400).send({"error" : "You need to be much better to do so..."});
        }
        else{
        const now = new Date();
        now.setUTCHours(now.getUTCHours() + 5);
        now.setUTCMinutes(now.getUTCMinutes() + 30);
        const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
        db.query(`update EventData set eventName = ?, description = ?, date = ?, eventTime = ?, venue = ?, fees = ?, totalNumberOfSeats = ?, refundable = ?, departmentAbbr = ? where eventId = ? and eventManagerEmail = ?`,
        [req.body.eventName,req.body.description,req.body.eventDate,req.body.eventTime,req.body.venue,req.body.fees,req.body.totalNumberOfSeats,req.body.refundable,req.body.departmentAbbr,req.body.eventId,req.body.eventManagerEmail], (err, result) => {
            if(err)
            {
                
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
    }
    }]
}

