const { db, transactions_db } = require('../connection');

const tokenGenerator = require('../middleware/webTokenGenerator');
const tokenValidator = require('../middleware/webTokenValidator');
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
    }
}