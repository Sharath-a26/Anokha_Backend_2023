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
const request = require('request');
const transactionTokenGenerator = require('../middleware/transactionTokenGenerator');
const transactionTokenVerifier = require('../middleware/transactionTokenVerifier');
var crypto = require("crypto");


module.exports = {




    getEventsByDepartment : [ tokenValidator,async (req, res) => {

        const db_connection = await db.promise().getConnection();
        try{
            let sql_q = "select * from AnokhaEventsAndDepartments order by departmentAbbr";
            await db_connection.query('lock tables eventdata read, departmentdata read, AnokhaEventsAndDepartments read');
            const [results] = await db_connection.query(sql_q);
            await db_connection.query('unlock tables');
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
        if(req.params.userEmail != undefined &&
            validator.isEmail(req.params.userEmail))
         {

        const db_connection = await db.promise().getConnection();
        try{
            await db_connection.query("lock tables userdata read, AnokhaUserData read");
            let sql_q = "select * from AnokhaUserData where userEmail = ?";
            const [results] = await db_connection.query(sql_q, req.params.userEmail);
            await db_connection.query('unlock tables');
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
            
            await db_connection.query('lock tables userdata write');
            const [results] = await db_connection.query(sql_q, [req.body.fullName,req.body.password,req.body.userEmail]); 
            await db_connection.query('unlock tables');
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
            await db_connection.query("lock tables AnokhaCompleteUserData read, UserData read, CollegeData read")
            const [result] = await db_connection.query(sql_q, [req.body.userEmail, req.body.password]);
            await db_connection.query('unlock tables');
            if(result.length == 0)
            {
                res.status(404).send({error : "User not found"});
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




    

    registerUser : async (req, res) =>{


        if(req.body.userEmail == undefined ||
            req.body.fullName == undefined ||
            req.body.password == undefined ||
            req.body.collegeId == undefined ||
            !validator.isEmail(req.body.userEmail))
            
            {
                res.status(400).send({error : "We are one step ahead! Try harder!"});
                return;
            }

            else{
               
                const db_connection = await db.promise().getConnection();
                try{
                    await db_connection.query("lock tables AnokhaUserData read");
                    const [result] = await db_connection.query("select * from AnokhaUserData where userEmail = ?",[req.body.userEmail] );
                    await db_connection.query("unlock tables");
                    if(result.length != 0)
                    {
                        res.status(409).send({"error" : "user already exists..."});
                        
                    }
                    else{

                        if(req.body.collegeId == 633 || req.body.collegeId == 638 || req.body.collegeId == 645)
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
                        if(req.body.collegeId == 633 || req.body.collegeId == 638 || req.body.collegeId == 645)
                        {
                            isAmrita = 1;
                        }
                        const otpGenerated = randonNumberGenerator();
                        const now = new Date();
                        now.setUTCHours(now.getUTCHours() + 5);
                        now.setUTCMinutes(now.getUTCMinutes() + 30);
                        const istTime = now.toISOString().slice(0, 19).replace('T', ' ');

                        await db_connection.query("lock tables otp write");
                        await db_connection.query(`delete from OTP where userEmail = ?`,[req.body.userEmail], (err, res) => {});
                        await db_connection.query(`insert into OTP (userEmail, otp, fullName, password, currentStatus, activePassport, isAmritaCBE, collegeId, accountTimeStamp, passportId, passportTimeStamp) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[req.body.userEmail,otpGenerated,req.body.fullName,req.body.password,req.body.currentStatus,0,isAmrita,req.body.collegeId,istTime,null,null]);
                        await db_connection.query("unlock tables");
                               
                        const token = await otpTokenGenerator({
                                    userEmail : req.body.userEmail,
                                    password : req.body.password
                        });
                                
                        mailer (req.body.fullName, req.body.userEmail, otpGenerated);
                        res.status(200).send({SECRET_TOKEN : token});
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

        
    },


    verifyOTP :[otpTokenValidator, async (req, res) => {


        if(req.body.userEmail == undefined ||
            req.body.otp == undefined ||
        !validator.isEmail(req.body.userEmail) ||
        !validator.isNumeric(req.body.otp))
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
            return;
        }
        else{
        const otp = req.body.otp;
        const userEmail = req.body.userEmail;

        const db_connection = await db.promise().getConnection();
        try{
            await db_connection.query("lock tables otp write, anokhaotp write");
            const [result] = await db_connection.query(`select * from  AnokhaOTP where userEmail = ? and otp = ?`,[userEmail,otp]);
            await db_connection.query("unlock tables");
            if(result.length == 1)
                {
                    const now = new Date();
                    now.setUTCHours(now.getUTCHours() + 5);
                    now.setUTCMinutes(now.getUTCMinutes() + 30);
                    const istTime = now.toISOString().slice(0, 19).replace('T', ' ');   
                    await db_connection.query("lock tables UserData write, otp write");
                    db_connection.query(`insert into UserData (userEmail, fullName, password, currentStatus, activePassport, isAmritaCBE, collegeId, accountTimeStamp, passportId, passportTimeStamp) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,[result[0].userEmail,result[0].fullName,result[0].password,result[0].currentStatus,0,result[0].isAmritaCBE,result[0].collegeId,istTime,null,null]);
                    db_connection.query(`delete from OTP where userEmail = ?`,[userEmail]);
                    await db_connection.query("unlock tables");
                    welcomeMailer(result[0].fullName, userEmail);
                    res.status(200).send({"result" : "success"})
                }
                else{
                    res.status(400).send({"error" : "Cannot verify please try again"})
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

    }],



    insertStarredEvent : [
        tokenValidator,
       async (req,res) => {

            if(req.body.userEmail == undefined ||
                req.body.eventId == undefined ||
                !validator.isEmail(req.body.userEmail) ||
            !validator.isNumeric(req.body.eventId))
            {
                res.status(400).send({error : "We are one step ahead! Try harder!"});
                return;
            }
            else{

            let sql_q = `insert into starredevents values (?,?)`
            let db_connection = await db.promise().getConnection();
            try{
                await db_connection.query("lock tables starredevents write");
                const [results] = await db_connection.query(sql_q, [req.body.eventId,req.body.userEmail]); 
                await db_connection.query("unlock tables");
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

            
            let sql_q = `delete from starredevents where (userEmail = ? and eventId = ?)`;
            let db_connection = await db.promise().getConnection();
            try{
                await db_connection.query("lock tables starredevents write");
                const [results] = await db_connection.query(sql_q, [req.body.userEmail, req.body.eventId]); 
                await db_connection.query("unlock tables");
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
                await db_connection.query("lock tables starredevents read");
                const [result] = await db_connection.query(`select * from AnokhaStarredEventsData where userEmail = ?`,[req.params.userEmail]);
                await db_connection.query("unlock tables");
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
            await db_connection.query("lock tables AnokhaCrewCompleteData read, userdata read, collegedata read");
            let sql_q = `select * from AnokhaCrewCompleteData`;
            await db_connection.query("unlock tables");
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
            await db_connection.query("lock tables AnokhaEventData read, eventdata read");
            const [result] = await db_connection.query(`select * from AnokhaEventData`);
            await db_connection.query("unlock tables");
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



    


    



    intiatePay :[transactionTokenVerifier, async (req, res) => {

        if(
            req.body.productId == undefined ||
            req.body.firstName == undefined ||
            req.body.userEmail == undefined ||
            !validator.isEmail(req.body.userEmail) ||
            req.body.address == undefined ||
            req.body.city == undefined ||
            req.body.state == undefined ||
            req.body.country == undefined ||
            req.body.zipcode == undefined ||
            req.body.phoneNumber == undefined ||
            !validator.isNumeric(req.body.zipcode) ||
            !validator.isNumeric(req.body.phoneNumber)

            )
            {
                res.status(400).send({"error" : "Wohooooo..! Be careful.... If you are bad, I am your dad!"})
            }
            else{

                var hashedData;
                var txid;
                const db_connection = await db.promise().getConnection();
                try{
                    await db_connection.query("lock tables eventData read");
                    const [result] = await db_connection.query("select * from eventData where eventId = ?", [req.body.productId]);
                    await db_connection.query("unlock tables");
                    if(request.length == 0)
                    {
                        res.send(400).send({"error" : "We are much ahead of you..."});
                        return;
                    }
                    else{
                        txid = "ANOKHA2023" + new Date().getTime();
                        const amount = result.fees;
                        const key = "Pz9v2c";
                        const salt = "TbxC2ph02lBUbVYwx0fIB50CvqL27pHo";
                        const productinfo = req.body.productId;
                        const firstName = req.body.firstName;
                        const userEmail = req.body.userEmail;
                        const phoneNumber = req.body.phoneNumber;
                        const callbackurl = "http://52.66.236.118:3000/userApp/data";
                        const text = key + "|" + txid + "|" + amount + "|" + productinfo + "|" + firstName + "|" + userEmail + "|||||||||||" + salt;
                        const hash = crypto.createHash('sha512');
                        hash.update(text);
                        hashedData = hash.digest('hex');
                        
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

                const transaction_db_connection = await transactions_db.promise().getConnection(); 
                try{
                      
                    
                    await transaction_db_connection.query("lock tables transactions write");
                    await transaction_db_connection.query("insert into transactions values ", [req.body.eventId]);
                    await transaction_db_connection.query("unlock tables");


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
                    await transaction_db_connection.release();
                }

                res.status(201).send({
                    "txid" : txid,
                    "hash" : hashedData
                })
           
            }

    }],

   
   

}

