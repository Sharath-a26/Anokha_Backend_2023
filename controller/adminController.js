const { db, transactions_db } = require('../connection');
const tokenGenerator = require('../middleware/tokenGenerator');
const tokenValidator = require('../middleware/tokenValidator');

 module.exports = {

     getAdminDetails : (req,res) => {
         let sql_q = `select * from eventManager where eventManagerEmail = '${req.params.adminEmail}'`;
         db.query(sql_q,(err,result) => {
             if(err) {
                console.log("Error in query getAdminDetails");
                res.status(500).send({error : "Query Error... Contact DB Admin"});
            
             }
             else {
                  res.status(200).send(result[0]);
             }
         })
     },


     getEventDetails : (req, res) => {
        let sql_q = `select * from EventData where eventManagerEmail = '${req.params.eventManagerEmail}'`;
        db.query(sql_q, (err, result) => {
            if(err)
            {
                console.log("Error in query getEventDetails");
                res.status(500).send({error : "Query Error... Contact DB Admin"});
            }
            else{
                res.status(200).send(result);
            }
        })
     },

     createEvent :  (req, res) => {
        let sql_q = `insert into EventData (eventName, eventOrWorkshop, description, eventManagerEmail, date, eventTime, venue, fees, totalNumberOfSeats, noOfRegistrations, timeStamp, refundable, departmentAbbr) values ('${req.body.eventName}', ${req.body.eventOrWorkshop}, '${req.body.description}', '${req.body.eventManagerEmail}', '${req.body.date}', '${req.body.eventTime}', '${req.body.venue}', ${req.body.fees}, ${req.body.totalNumberOfSeats}, ${req.body.noOfRegistrations}, '${req.body.timeStamp}', ${req.body.refundable}, '${req.body.departmentAbbr}')`;
        db.query(sql_q, (err, result) => {
            if(err)
            {
                if(err.errno = 1452)
                {
                    res.status(400).send({error : "Foreign Key Constraint Error"});
                }
                else{
               
                console.log("Error in query getEventDetails");
                res.status(500).send({error : "Query Error... Contact DB Admin"});
                }
            }
            else{

                res.status(201).send({result : "Data Inserted Succesfully"});
            }
        })
     },

     adminLogin : (req, res) => {
        let sql_q = `select * from EventManager where eventManagerEmail = '${req.body.eventManagerEmail}' and password = '${req.body.password}'`
        db.query(sql_q, (err, result) => {
            if(err){
                console.log("Error in query userLogin");
                res.status(500).send({error : "Query Error... Contact DB Admin"});
            }
            else
            {
                if(result.length == 0)
                {
                    res.status(404).send({error : "User not found"})
                }
                else{

                        const token = tokenGenerator({
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

    registeredUsers : (req,res) => {
        let sql = `select * from userData where userEmail in (select userEmail from registeredevents where eventId in 
            (select eventId from eventData where eventName = '${req.params.eventName}'));`

        db.query(sql,(err,result) => {
            if(err) {
                res.send("Query Error")
            }
            else {
                 res.send(result)
            }
        })
    }
}

