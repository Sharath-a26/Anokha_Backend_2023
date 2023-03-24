const { db, transactions_db } = require('../connection');
const tokenGenerator = require('../middleware/tokenGenerator');
const tokenValidator = require('../middleware/tokenValidator');
const otpTokenGenerator = require('../middleware/otpTokenGenerator');
const otpTokenValidator = require('../middleware/otpTokenValidator');
const randonNumberGenerator = require('../OTPGenerator/otp');
const mailer = require('../Mailer/otpGenerator');
const welcomeMailer = require('../Mailer/welcomeMailer');
module.exports = {
    getEventsByDepartment : [tokenValidator, (req, res) => {
        let sql_q = "SELECT * FROM EventData LEFT JOIN DepartmentData ON EventData.DepartmentAbbr = DepartmentData.DepartmentAbbr order by EventData.DepartmentAbbr";
        db.query(sql_q, (err, result) => {
            if(err){
                console.log("Error in query getEventsByDepartment");
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
        
        let sql_q = `select * from UserData where userEmail = '${req.params.userEmail}'`;
        db.query(
            sql_q,(err,result) => {
                if(err){
                    console.log("Error in query getUserDetails");
                    res.status(500).send({error : "Query Error... Contact DB Admin"});
                }
                else {

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
        
    }],

    editUserDetails: [tokenValidator, (req,res) => {
        const data = req.body;
        let sql = `Update userData SET fullName = '${req.body.fullName}',password = '${req.body.password}',currentStatus = '${req.body.currentStatus}',activePassport = '${req.body.activePassport}',isAmritaCBE = '${req.body.isAmritaCBE}',collegeId = '${req.body.collegeId}' where userEmail = '${req.body.userEmail}'`
        db.query(sql,(err,result,fields) => {
            if(err) {
                console.log("Error in query editUserDetails");
                res.status(500).send({error : "Query Error... Contact DB Admin"});
            }
            else {
                res.status(200).send({result : "Updated Successfully"})
                
            }
        })
    }]
,

    userLogin : (req, res) => {
        console.log(req.body.userEmail);
        console.log(req.body.password);
        let sql_q = `select * from UserData left join CollegeData on UserData.collegeId = CollegeData.collegeId where userEmail = '${req.body.userEmail}' and password = '${req.body.password}'`
        db.query(sql_q, async (err, result) => {
            if(err){
                console.log(err)
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
    },
    

    registerUser :(req, res) =>{


        if(req.body.userEmail == undefined ||
            req.body.fullName == undefined ||
            req.body.password == undefined ||
            req.body.currentStatus == undefined ||
            req.body.isAmritaCBE == undefined ||
            req.body.collegeId == undefined)
            {
                res.status(400).send({"error" : "You need to be much better to do so..."});
            }

            else{

                db.query(`select * from UserData where userEmail = '${req.body.userEmail}'`, (err, result) =>{
                    if(err)
                    {
                        console.log("Error in query registerUser");
                        res.status(500).send({error : "Query Error... Contact DB Admin"});
                    }
                    else{
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
                    
                            
                            const otpGenerated = randonNumberGenerator();
                            const now = new Date();
                            now.setUTCHours(now.getUTCHours() + 5);
                            now.setUTCMinutes(now.getUTCMinutes() + 30);
                            const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                            db.query(`delete from OTP where userEmail = '${req.body.userEmail}'`, (err, res) => {});
                            db.query(`insert into OTP (userEmail, otp, fullName, password, currentStatus, activePassport, isAmritaCBE, collegeId, accountTimeStamp, passportId, passportTimeStamp) values ('${req.body.userEmail}', ${otpGenerated}, '${req.body.fullName}', '${req.body.password}', ${req.body.currentStatus}, ${0}, ${req.body.isAmritaCBE}, ${req.body.collegeId}, '${istTime}', ${null}, ${null})`, async (err, result)=> {
                                if(err)
                                {
                                    
                                    console.log("Error in query userRegister");
                                    res.status(500).send({error : "Query Error... Contact DB Admin"});
                                }
                                else{
                                    const token = await otpTokenGenerator({
                                        userEmail : req.body.userEmail,
                                        password : req.body.password
                                    });
                                    //sending OTP to user
                                    mailer(otpGenerated);
                                    res.status(200).send({SECRET_TOKEN : token});
                                }
                            });



                        }
                    }
                })

       
        
    }

        
    },


    verifyOTP :[otpTokenValidator, (req, res) => {
        const otp = req.body.otp;
        const userEmail = req.body.userEmail;

        db.query(`select * from  OTP where userEmail = '${userEmail}' and otp = ${otp}`, (err, result) => {
            if(err)
            {
                console.log("Error in query userRegister");
                res.status(500).send({error : "Query Error... Contact DB Admin"});
            }
            else{
                
                if(result.length == 1)
                {
                    const now = new Date();
                    now.setUTCHours(now.getUTCHours() + 5);
                    now.setUTCMinutes(now.getUTCMinutes() + 30);
                    const istTime = now.toISOString().slice(0, 19).replace('T', ' ');   
                    db.query(`insert into UserData (userEmail, fullName, password, currentStatus, activePassport, isAmritaCBE, collegeId, accountTimeStamp, passportId, passportTimeStamp) values ('${result[0].userEmail}', '${result[0].fullName}', '${result[0].password}', ${result[0].currentStatus}, ${0}, ${result[0].isAmritaCBE}, ${result[0].collegeId}, '${istTime}', ${null}, ${null})`, (err2, result2) => {});
                    db.query(`delete from OTP where userEmail = '${userEmail}'`, (err, result3) => {});
                    welcomeMailer();
                    res.status(200).send({"result" : "success"})
                }
                else{
                    res.status(400).send({"error" : "Cannot verify please try again"})
                }
            }
        })

    }],



    insertStarredEvent : [
        tokenGenerator,(req,res) => {
            const data = req.body;
            let user_email = req.body.userEmail;
            let event_id = req.body.eventId;
            let sql_q = `insert into starredevents values (${event_id},'${user_email}')`
            db.query(sql_q,(err,result) => {
                if(err) {
                    console.log(err);
                    res.status(400).send({"error" : "Error in data"});
                }
                else {
                    res.status(201).send({result : "Inserted successfully"})
                }
            })
        }
    ],

    dropStarredEvent : [
        tokenValidator,(req,res) => {
            let user_email = req.body.userEmail;
            let event_id = req.body.eventId;
            let sql_q = `delete from starredevents where (userEmail = '${user_email}' and eventId = ${event_id})`;
            db.query(sql_q,(err,result) => {
                if(err) {
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
    ],

    getStarredEvents : [tokenValidator, (req, res) => {
        db.query(`select * from starredevents LEFT JOIN  eventdata ON starredevents.eventId = eventdata.eventId where userEmail = '${req.params.userEmail}'`, (err, result) =>  {
            if(err)
            {
                console.log("Error in query getStarredEvents");
                req.status(500).send({"error" : "error in db query... contact db admin"});
            }
            else{
                res.status(200).send(result);
            }
        })
    }],

    getCrewDetails : [
        tokenValidator,(req,res) => {
            let team_name = req.params.teamName;
            console.log(req.params.teamName);
            let sql_q = `select crewEmail,name,departmentAbbr,role,crewmembers.teamId from crewmembers left join crewdetails on crewmembers.teamId = crewdetails.teamId`;
    
            db.query(sql_q,(err,result,fields) => {
                if(err) {
                    res.send(err);
                }
                else {
                    res.send(result)
                }
            })
        }
    ]





}