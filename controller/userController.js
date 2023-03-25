const { db, transactions_db } = require('../connection');
const tokenGenerator = require('../middleware/tokenGenerator');
const tokenValidator = require('../middleware/tokenValidator');
const otpTokenGenerator = require('../middleware/otpTokenGenerator');
const otpTokenValidator = require('../middleware/otpTokenValidator');
const randonNumberGenerator = require('../OTPGenerator/otp');
const mailer = require('../Mailer/otpGenerator');
const welcomeMailer = require('../Mailer/welcomeMailer');
const validator = require('validator');
const fs = require('fs');
module.exports = {
    getEventsByDepartment : [tokenValidator, (req, res) => {
        let sql_q = "SELECT * FROM EventData LEFT JOIN DepartmentData ON EventData.DepartmentAbbr = DepartmentData.DepartmentAbbr order by EventData.DepartmentAbbr";

        db.query(sql_q, (err, result) => {
            if(err){

                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                res.status(500).send({error : "Query Error... Contact DB Admin"});
            }
            else{


                var jsonResponse = [];
                var eventsByDepartment = {};
                var department = "";
                result.forEach(eventData => {
                    if(eventData.departmentAbbr == department)
                    {
                       eventsByDepartment["events"].push(eventData);
                    }
                    else
                    {
                        if(department != "")
                        {
                            jsonResponse.push(eventsByDepartment);
                        }
                        eventsByDepartment = {
                            department : eventData.departmentName,
                            events : [eventData]
                        }
                        department = eventData.departmentAbbr;

                    }
                });
                res.status(200).send(jsonResponse);
                

            }
        });
    }],

    getUserDetails : [tokenValidator, (req,res) => {

        if(validator.isEmail(req.params.userEmail))
        {

        let sql_q = `select * from UserData where userEmail = ?`;
        db.beginTransaction()
        db.query(
            sql_q,[req.params.userEmail],(err,result) => {
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
                else {
                    db.commit()

                    if(result.length == 0)
                    {
                        res.status(200).send({});

                    }
                    else{
                        res.status(200).send(result[0]);
                    }
                
                }
            }
        )
        }
        else{
            res.status(400).send({error : "you need to much better to do so..."})
        }
        
    }],

    editUserDetails: [tokenValidator, (req,res) => {
        const data = req.body;
        if(validator.isEmpty(req.body.fullName) ||
            validator.isEmpty(req.body.password) ||
            validator.isEmpty(req.body.collegeId) ||
            validator.isEmpty(req.body.userEmail) ||
            !validator.isEmail(req.body.userEmail)
            )
            {
                res.status(400).send({error : "you need to much better to do so..."});
            }
            else{
        db.beginTransaction()
        let sql = `Update userData SET fullName = ?,password = ?, collegeId = ? where userEmail = ?`
        db.query(sql,[req.body.fullName,req.body.password,req.body.collegeId,req.body.userEmail],(err,result,fields) => {
            if(err) {
                db.rollback()
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                res.status(500).send({error : "Query Error... Contact DB Admin"});
            }
            else {
                db.commit()
                res.status(200).send({result : "Updated Successfully"})
                
            }
        })
    }
    }]
,

    userLogin : (req, res) => {
        if(!validator.isEmpty(req.body.userEmail) || !validator.isEmpty(req.body.password) || validator.isEmail(req.body.userEmail)){
        let sql_q = `select * from UserData left join CollegeData on UserData.collegeId = CollegeData.collegeId where userEmail = ? and password = ?`
        db.beginTransaction()
        db.query(sql_q,[req.body.userEmail,req.body.password], async (err, result) => {
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
                            userEmail : req.body.userEmail,
                            password : req.body.password
                        });
                        res.json({
                            
                                userEmail : result[0].userEmail,
                                fullName : result[0].fullName,
                                activePassport : result[0].activePassport,
                                isAmritaCBE : result[0].isAmritaCBE,
                                collegeName : result[0].collegeName,
                                district : result[0].district,
                                state : result[0].state,
                                country : result[0].country,
                                SECRET_TOKEN : token
                            
                        });
                    
                }
            }
        })
        }
        else{
            res.status(400).send({error : "you need to much better to do so..."});
        }
    },
    

    registerUser :(req, res) =>{


        if(validator.isEmpty(req.body.userEmail)||
            validator.isEmpty(req.body.fullName)||
            validator.isEmpty(req.body.password)||
            validator.isEmpty(req.body.collegeId) ||
            !validator.isEmail(req.body.userEmail) ||
            !validator.isBoolean(req.body.collegeId))
            
            {
                res.status(400).send({"error" : "You need to be much better to do so..."});
            }

            else{
                db.beginTransaction()

                db.query(`select * from UserData where userEmail = ?`,[req.body.userEmail], (err, result) =>{
                    if(err)
                    {
                        db.rollback()
                        const now = new Date();
                        now.setUTCHours(now.getUTCHours() + 5);
                         now.setUTCMinutes(now.getUTCMinutes() + 30);
                         const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                        fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                        fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                        res.status(500).send({error : "Query Error... Contact DB Admin"});
                    }
                    else{
                        db.commit()
                        if(result.length != 0)
                        {
                            res.status(409).send({"error" : "user already exists..."});
                            
                        }
                        else{

                            if(req.body.collegeId == 1)
                            {
                                if(req.body.userEmail.includes("@cb.amrita.edu") || req.body.userEmail.includes("@cb.students.amrita.edu"))
                                {
                                    //User is from Amrita CBE with Amrita Email
                                    //Need tp verify credibility
                                }
                                else
                                {
                                    //User claims to be from Amrita CBE
                                    //Email is not under Amrita domain
                                    //Credibility cannot be verified
                                    res.status(400).send({"error" : "invalid email"});
                                    return;
                                }
                            }
                            else{
                    
                                //User is not from Amrita CBE
                                //Need tp verify credibility of email given
                                
                            }
                            var isAmrita = 0;
                            if(req.body.collegeId == 1)
                            {
                                isAmrita = 1;
                            }
                            const otpGenerated = randonNumberGenerator();
                            const now = new Date();
                            now.setUTCHours(now.getUTCHours() + 5);
                            now.setUTCMinutes(now.getUTCMinutes() + 30);
                            const istTime = now.toISOString().slice(0, 19).replace('T', ' ');

                            db.beginTransaction()
                            db.query(`delete from OTP where userEmail = ?`,[req.body.userEmail], (err, res) => {});
                            db.query(`insert into OTP (userEmail, otp, fullName, password, currentStatus, activePassport, isAmritaCBE, collegeId, accountTimeStamp, passportId, passportTimeStamp) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[req.body.userEmail,otpGenerated,req.body.fullName,req.body.password,req.body.currentStatus,0,isAmrita,req.body.collegeId,istTime,null,null], async (err, result)=> {
                                if(err)
                                {
                                    db.rollback()
                                    
                                    const now = new Date();
                                    now.setUTCHours(now.getUTCHours() + 5);
                                    now.setUTCMinutes(now.getUTCMinutes() + 30);
                                    const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                                    fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                                    fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                                    res.status(500).send({error : "Query Error... Contact DB Admin"});
                                }
                                else{
                                    db.commit()
                                    const token = await otpTokenGenerator({
                                        userEmail : req.body.userEmail,
                                        password : req.body.password
                                    });
                                    //sending OTP to user
                                    mailer(req.body.fullName, req.body.userEmail, otpGenerated);
                                    res.status(200).send({SECRET_TOKEN : token});
                                }
                            });



                        }
                    }
                })

       
        
    }

        
    },


    verifyOTP :[otpTokenValidator, (req, res) => {


        if(validator.isEmpty(req.body.userEmail) ||
        !validator.isEmail(req.body.userEmail) ||
        !validator.isNumeric(req.body.otp))
        {
            res.status(400).send({"error" : "You need to be much better to do so..."});
        }
        else{
        const otp = req.body.otp;
        const userEmail = req.body.userEmail;

        db.query(`select * from  OTP where userEmail = ? and otp = ?`,[userEmail,otp], (err, result) => {
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
                
                if(result.length == 1)
                {
                    const now = new Date();
                    now.setUTCHours(now.getUTCHours() + 5);
                    now.setUTCMinutes(now.getUTCMinutes() + 30);
                    const istTime = now.toISOString().slice(0, 19).replace('T', ' ');   
                    db.query(`insert into UserData (userEmail, fullName, password, currentStatus, activePassport, isAmritaCBE, collegeId, accountTimeStamp, passportId, passportTimeStamp) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[result[0].userEmail,result[0].fullName,result[0].password,result[0].currentStatus,0,result[0].isAmritaCBE,result[0].collegeId,istTime,null,null], (err2, result2) => {});
                    db.query(`delete from OTP where userEmail = ?`,[userEmail], (err, result3) => {});
                    welcomeMailer(result[0].fullName, userEmail);
                    res.status(200).send({"result" : "success"})
                }
                else{
                    res.status(400).send({"error" : "Cannot verify please try again"})
                }
            }
        })
    }

    }],



    insertStarredEvent : [
        tokenGenerator,(req,res) => {

            if(!validator.isEmail(req.body.userEmail)
            ||
            !validator.isNumeric(req.body.eventId))
            {
                res.status(400).send({"error" : "You need to be much better to do so..."});
            }
            else{

            let user_email = req.body.userEmail;
            let event_id = req.body.eventId;
            let sql_q = `insert into starredevents values (?,?)`
            db.query(sql_q,[event_id,user_email],(err,result) => {
                if(err) {
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                    res.status(400).send({"error" : "Error in data"});
                }
                else {
                    res.status(201).send({result : "Inserted successfully"})
                }
            })
        }
        }
    ],

    dropStarredEvent : [
        tokenValidator,(req,res) => {

            if(!validator.isEmail(req.body.userEmail) ||
            !validator.isNumeric(req.body.eventId))
            {
                res.status(400).send({"error" : "You need to be much better to do so..."});
            }
            else{

            let user_email = req.body.userEmail;
            let event_id = req.body.eventId;
            let sql_q = `delete from starredevents where (userEmail = ? and eventId = ?)`;
            db.query(sql_q,[user_email,event_id],(err,result) => {
                if(err) {
                    const now = new Date();
                    now.setUTCHours(now.getUTCHours() + 5);
                    now.setUTCMinutes(now.getUTCMinutes() + 30);
                    const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                    fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                    fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                    res.status(400).send({"error" : "Error in data"})
                }
                else {
                    
                    if(result.affectedRows == 0)
                    {
                        res.status(400).send({"error" : "Error in data"});
                    }
                    else{
                    res.status(202).send({result : "Deleted successfully"});
                    }
                }
            })
        }
        }
    ],



    getStarredEvents : [tokenValidator, (req, res) => {

        if(!validator.isEmail(req.params.userEmail))
        {
            res.status(400).send({"error" : "You need to be much better to do so..."});

        }
        else{

        db.query(`select * from starredevents LEFT JOIN  eventdata ON starredevents.eventId = eventdata.eventId where userEmail = ?`,[req.params.userEmail], (err, result) =>  {
            if(err)
            {
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                req.status(500).send({"error" : "error in db query... contact db admin"});
            }
            else{
                res.status(200).send(result);
            }
        })
    }
    }],

    getCrewDetails : [
        tokenValidator,(req,res) => {
            let sql_q = `select crewEmail,name,departmentAbbr,role,crewmembers.teamId from crewmembers left join crewdetails on crewmembers.teamId = crewdetails.teamId`;
    
            db.query(sql_q,(err,result) => {
                if(err) {
                    const now = new Date();
                    now.setUTCHours(now.getUTCHours() + 5);
                    now.setUTCMinutes(now.getUTCMinutes() + 30);
                    const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                    fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                    fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                    req.status(500).send({"error" : "error in db query... contact db admin"});
                }
                else {
                    res.status(200).send(result);
                }
            })
        }
    ],

    getAllEvents : [tokenValidator, (req, res) => {
        db.query(`select * from EventData`, (err, result) => {
            if(err)
            {
                    const now = new Date();
                    now.setUTCHours(now.getUTCHours() + 5);
                    now.setUTCMinutes(now.getUTCMinutes() + 30);
                    const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                    fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                    fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                    req.status(500).send({"error" : "error in db query... contact db admin"});
            }
            else{
                res.status(200).send(result);
            }
        })
    }]





}