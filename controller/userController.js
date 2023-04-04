const { db, transactions_db } = require('../connection');
const tokenGenerator = require('../middleware/appTokenGenerator');
const tokenValidator = require('../middleware/appTokenValidator');
const otpTokenGenerator = require('../middleware/otpTokenGenerator.js');
const otpTokenValidator = require('../middleware/otpTokenValidator');
const randonNumberGenerator = require('../OTPGenerator/otp');
const mailer = require('../Mailer/otpGenerator');
const welcomeMailer = require('../Mailer/welcomeMailer');
const validator = require('validator');
const fs = require('fs');
const transactionTokenGenerator = require('../middleware/transactionTokenGenerator');
const transactionTokenVerifier = require('../middleware/transactionTokenVerifier');
module.exports = {


    getEventsByDepartment : [tokenValidator, async (req, res) => {

        const db_connection = await db.promise().getConnection();
        try{
            let sql_q = "select * from AnokhaEventsAndDepartments order by departmentAbbr";
            const [results] = await db_connection.query(sql_q);
            var jsonResponse = [];
           if(results.length != 0)
           {
                    var eventsByDepartment = {};  
                    var department = "";
                    results.forEach(eventData => {
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
           }


            res.status(200).send(jsonResponse);
        }

        catch (err) {
            const now = new Date();
            now.setUTCHours(now.getUTCHours() + 5);
            now.setUTCMinutes(now.getUTCMinutes() + 30);
            const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
            fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
            fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
            res.status(500).send({"Error" : "Contact DB Admin if you see this message"});
          } finally {
            db_connection.release();
          }

        
    }],






    getUserDetails : [tokenValidator, async (req, res) => {
        if(validator.isEmail(req.params.userEmail))
         {

        const db_connection = await db.promise().getConnection();
        try{
            let sql_q = "select * from AnokhaUserData where userEmail = ?";
            const [results] = await db_connection.query(sql_q, req.params.userEmail);
            res.status(200).send(results);
        }

        catch (err) {
            const now = new Date();
            now.setUTCHours(now.getUTCHours() + 5);
            now.setUTCMinutes(now.getUTCMinutes() + 30);
            const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
            fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
            fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
            res.status(500).send({"Error" : "Contact DB Admin if you see this message"});
          } finally {
            db_connection.release();
          }
        }
        else{
            res.status(400).send({error : "We are one step ahead! Try harder!"});
            return;
            }


    }],





    editUserDetails: [tokenValidator, async (req,res) => {
        if(req.body.fullName == undefined ||
            req.body.password == undefined ||
            req.body.userEmail == undefined ||
            validator.isEmpty(req.body.fullName) ||
            validator.isEmpty(req.body.password) ||
            validator.isEmpty(req.body.userEmail) ||
            !validator.isEmail(req.body.userEmail)
            )
            {
                res.status(400).send({error : "We are one step ahead! Try harder!"});
                return;
            }
            else{
        let sql_q = `Update userData SET fullName = ?,password = ? where userEmail = ?`
        let db_connection = await db.promise().getConnection();
        try{
            const lockName = "EDITUSERDETAILS";
            const lockTimeout = 10;
            await db_connection.query(`SELECT GET_LOCK(?, ?)`, [lockName, lockTimeout]);
            const [results] = await db_connection.query(sql_q, [req.body.fullName,req.body.password,req.body.userEmail]); 
            await db_connection.query(`SELECT RELEASE_LOCK(?)`, [lockName]);
            if(results.affectedRows == 0)
            {
                res.status(400).send({"error" : "no data found. dont play around here..."});
            }
            else{
                res.status(200).send({"result" : "data updated..."});
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
          } finally {
            db_connection.release();
          }
   
    }
    }],








    userLogin : async (req, res) => {
        if(req.body.userEmail != undefined && req.body.password != undefined && !validator.isEmpty(req.body.userEmail) && !validator.isEmpty(req.body.password) && validator.isEmail(req.body.userEmail)){
        
        let db_connection = await db.promise().getConnection();
        try{
            
            let sql_q = `select * from AnokhaCompleteUserData where userEmail = ? and password = ?`;
            const [result] = await db_connection.query(sql_q, [req.body.userEmail, req.body.password]);
            if(result.length == 0)
            {
                res.status(404).send({error : "User not found"});
                return;
            }
            else{

                const token = await tokenGenerator({
                    userEmail : result[0].userEmail,
                    fullName : result[0].fullName,
                    collegeName : result[0].collegeName,
                    district : result[0].district,
                    country : result[0].country,
                    role : "USER"
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
        finally 
        {
            db_connection.release();
        }   
        }
        else
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
            return;
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
                res.status(400).send({error : "We are one step ahead! Try harder!"});
                return;
            }

            else{
                db.beginTransaction()

                db.query(`select * from AnokhaUserData where userEmail = ?`,[req.body.userEmail], (err, result) =>{
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
            res.status(400).send({error : "We are one step ahead! Try harder!"});
            return;
        }
        else{
        const otp = req.body.otp;
        const userEmail = req.body.userEmail;

        db.query(`select * from  AnokhaOTP where userEmail = ? and otp = ?`,[userEmail,otp], (err, result) => {
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
        tokenValidator,
       async (req,res) => {

            if(req.body.userEmail == undefined ||
                req.body.eventId == undefined ||
                !validator.isEmail(req.body.userEmail)
            ||
            !validator.isNumeric(req.body.eventId))
            {
                res.status(400).send({error : "We are one step ahead! Try harder!"});
                return;
            }
            else{

            let sql_q = `insert into starredevents values (?,?)`
            let db_connection = await db.promise().getConnection();
            try{
                const lockName = "INSERTSTARREDEVENTS";
                const lockTimeout = 10;
                await db_connection.query(`SELECT GET_LOCK(?, ?)`, [lockName, lockTimeout]);
                const [results] = await db_connection.query(sql_q, [req.body.eventId,req.body.userEmail]); 
                await db_connection.query(`SELECT RELEASE_LOCK(?)`, [lockName]);
                if(results.affectedRows == 0)
                {
                    res.status(400).send({"error" : "no data found. dont play around here..."});
                }
                else{
                    res.status(200).send({"result" : "data updated..."});
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
                db_connection.release();
            }
            }
        }
    ],



    dropStarredEvent : [
        tokenValidator,async (req,res) => {

            if(req.body.userEmail == undefined ||
                req.body.eventId == undefined ||
                !validator.isEmail(req.body.userEmail) ||
            !validator.isNumeric(req.body.eventId))
            {
                res.status(400).send({error : "We are one step ahead! Try harder!"});
                return;
            }
            else{

            let user_email = req.body.userEmail;
            let event_id = req.body.eventId;
            let sql_q = `delete from starredevents where (userEmail = ? and eventId = ?)`;
            let db_connection = await db.promise().getConnection();
            try{
                const lockName = "INSERTSTARREDEVENTS";
                const lockTimeout = 10;
                await db_connection.query(`SELECT GET_LOCK(?, ?)`, [lockName, lockTimeout]);
                const [results] = await db_connection.query(sql_q, [req.body.userEmail, req.body.eventId]); 
                await db_connection.query(`SELECT RELEASE_LOCK(?)`, [lockName]);
                if(results.affectedRows == 0)
                {
                    res.status(400).send({"error" : "no data found. dont play around here..."});
                }
                else{
                    res.status(200).send({"result" : "data updated..."});
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
                db_connection.release();
            }
        }
        }
    ],




    getStarredEvents : [tokenValidator, async (req, res) => {

        if(req.params.userEmail == undefined ||
            !validator.isEmail(req.params.userEmail))
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
            return;

        }
        else{

            let db_connection = await db.promise().getConnection();
            try{
                const [result] = await db_connection.query(`select * from AnokhaStarredEventsData where userEmail = ?`,[req.params.userEmail]);
                res.send(result);
            }
            catch{
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




    getCrewDetails : [tokenValidator,
       async (req,res) => {
            let db_connection = await db.promise().getConnection();
            let sql_q = `select * from AnokhaCrewCompleteData`;
            try{
            const [result] = await db_connection.query(sql_q);
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
    ],



    getAllEvents : [tokenValidator, async (req, res) => {
        let db_connection = await db.promise().getConnection();
        try{
            const [result] = await db_connection.query(`select * from AnokhaEventData`);
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
    }],

    
    



    moveToTransaction : [async (req, res) => {
        const tokenHeader = req.headers.authorization;
        const token = tokenHeader && tokenHeader.split(' ')[1];
        if(token == null)
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
            return;
        }
        const transactionToken = await transactionTokenGenerator({
            SECRET_TOKEN : token
        });
        if(transactionToken == null)
        {
            res.status(400).send({"error" : "Invalid Token"});
            return;
        }
        res.status(200).send({"TRANSACTION_SECRET_TOKEN" : transactionToken});
    }],

    initiateTransaction : [transactionTokenVerifier, async (req, res) => {
        if(
            validator.isEmpty(req.body.transactionId) ||
            !validator.isEmail(req.body.userEmail) ||
            req.body.userEmail == undefined||
            validator.isEmpty(req.body.transactionId) ||
            req.body.transactionId == undefined ||
            validator.isEmpty(req.body.sender) ||
            req.body.sender == undefined ||
            validator.isEmpty(req.body.senderAccNo) ||
            req.body.senderAccNo == undefined ||
            validator.isEmpty(req.body.receiver) ||
            req.body.receiver == undefined ||
            validator.isEmpty(req.body.receiverAccNo) ||
            req.body.receiverAccNo == undefined ||
            validator.isEmpty(req.body.eventIdOrPassportId) ||
            req.body.eventIdOrPassportId == undefined ||
            validator.isEmpty(req.body.amount) ||
            req.body.amount == undefined
        )
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
            return;
        }
        else{

            const db_connection = await transactions_db.promise().getConnection();
            try{
                const lockName = "INITIATETRANSACTION";
                const lockTimeout = 10;
                await db_connection.query(`SELECT GET_LOCK(?, ?)`, [lockName, lockTimeout]);
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                const [result] = await db_connection.query(`insert into transactions (transactionId, userEmail, sender, senderAccNo, receiver, receiverAccNo, eventIdOrPassportId, amount, timeStamp, transactionStatus) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [req.body.transactionId, req.body.userEmail, req.body.sender, req.body.senderAccNo, req.body.receiver, req.body.receiverAccNo, req.body.eventIdOrPassportId, req.body.amount, istTime, 0]);
                await db_connection.query(`SELECT RELEASE_LOCK(?, ?)`, [lockName]);
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
    }]

}