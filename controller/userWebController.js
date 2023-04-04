const { db, transactions_db } = require('../connection');

const webtokenGenerator = require('../middleware/webTokenGenerator');
const webtokenValidator = require('../middleware/webTokenValidator');
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
    getAllEvents :  async (req, res) => {
        let db_connection = await db.promise().getConnection();
        try{
            const [result] = await db_connection.query(`select * from EventData`);
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
    },


    userLogin : async (req,res) => {
        console.log(req.body);
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
    }
}