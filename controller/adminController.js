const { db, transactions_db } = require('../connection');
const tokenGenerator = require('../middleware/tokenGenerator');
const tokenValidator = require('../middleware/tokenValidator');
const fs = require('fs');

 module.exports = {

     getAdminDetails : [tokenValidator, (req,res) => {
         let sql_q = `select * from eventManager where eventManagerEmail = '${req.params.adminEmail}'`;
         db.query(sql_q,(err,result) => {
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
     }],


     getEventDetails : [tokenValidator, (req, res) => {
        var sql_q = "";
        if(req.params.eventDate == undefined)
        {
            sql_q = `select * from EventData where eventManagerEmail = '${req.params.eventManagerEmail}'`;
        }
        else{
            sql_q = `select * from EventData where eventManagerEmail = '${req.params.eventManagerEmail}' and date = '${req.params.eventDate}'`;
        }
       
        db.query(sql_q, (err, result) => {
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
     }],

     createEvent : [tokenValidator,  (req, res) => {
        let sql_q = `insert into EventData (eventName, eventOrWorkshop, description, eventManagerEmail, date, eventTime, venue, fees, totalNumberOfSeats, noOfRegistrations, timeStamp, refundable, departmentAbbr) values ('${req.body.eventName}', ${req.body.eventOrWorkshop}, '${req.body.description}', '${req.body.eventManagerEmail}', '${req.body.date}', '${req.body.eventTime}', '${req.body.venue}', ${req.body.fees}, ${req.body.totalNumberOfSeats}, ${req.body.noOfRegistrations}, '${req.body.timeStamp}', ${req.body.refundable}, '${req.body.departmentAbbr}')`;
        db.query(sql_q, (err, result) => {
            if(err)
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
                    res.status(500).send({error : "Query Error... Contact DB Admin"});
                }
            }
            else{

                res.status(201).send({result : "Data Inserted Succesfully"});
            }
        })
     }],

     adminLogin :  (req, res) => {
        let sql_q = `select * from EventManager where eventManagerEmail = '${req.body.eventManagerEmail}' and password = '${req.body.password}'`
        db.query(sql_q, async (err, result) => {
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
    },

    registeredUsers : [tokenValidator, (req,res) => {
        let sql = `select * from userData where userEmail in (select userEmail from registeredevents where eventId = 
            (select eventId from eventData where eventId = '${req.params.eventId}'));`

        db.query(sql,(err,result) => {
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
    }],

    updateEventData : (req, res) => {
        db.query(`update EventData set eventName = '${req.body.eventName}', description = '${req.body.description}', date = '${req.body.eventDate}', eventTime = '${req.body.eventTime}', venue = '${req.body.venue}', fees = ${req.body.fees}, totalNumberOfSeats = '${req.body.totalNumberOfSeats}', refundable = ${req.body.refundable}, departmentAbbr = '${req.body.departmentAbbr}' where eventId = ${req.body.eventId} and eventManagerEmail = '${req.body.eventManagerEmail}'`, (err, result) => {
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
    }
}

