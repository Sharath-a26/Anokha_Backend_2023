const { db, transactions_db } = require('../connection');
const tokenGenerator = require('../middleware/tokenGenerator');
const tokenValidator = require('../middleware/tokenValidator');
const randonNumberGenerator = require('../OTPGenerator/otp');
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
        console.log(req.params.userEmail);
        
        let sql_q = `select * from UserData where userEmail = '${req.params.userEmail}'`;
        db.query(
            sql_q,(err,result) => {
                if(err){
                    console.log("Error in query getUserDetails");
                    res.status(500).send({error : "Query Error... Contact DB Admin"});
                }
                else {

                    if(result == [])
                    {res.status(200).send([]);

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
        let sql_q = `select * from UserData left join CollegeData on UserData.collegeId = CollegeData.collegeId where userEmail = '${req.body.userEmail}' and password = '${req.body.password}'`
        db.query(sql_q, async (err, result) => {
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
    

    registerUser : (req, res) =>{

       
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
        db.query(`delete from OTP where userEmail = '${req.body.userEmail}'`, (err, res) => {});
        db.query(`insert into OTP (userEmail, otp) values ('${req.body.userEmail}', ${otpGenerated})`, (err, result)=> {
            if(err)
            {
                
                console.log("Error in query userLogin");
                res.status(500).send({error : "Query Error... Contact DB Admin"});
            }
            else{
                res.status(200).send({"result" : "OK"});
            }
        });

        
    },


    verifyOTP :[tokenValidator, (req, res) => {
        const otp = req.body.otp;
        const userEmail = req.body.userEmail;

        db.query(`select * from  OTP where userEmail = '${userEmail}' and otp = ${otp}`, (err, result) => {
            if(err)
            {
                console.log("Error in query userLogin");
                res.status(500).send({error : "Query Error... Contact DB Admin"});
            }
            else{
                
                if(result.length == 1)
                {
                    db.query(`delete from OTP where userEmail = '${userEmail}'`, (err, result) => {});
                    res.status(200).send({"result" : "success"})
                }
                else{
                    res.status(400).send({"error" : "Cannot verify please try again"})
                }
            }
        })

    }]


}