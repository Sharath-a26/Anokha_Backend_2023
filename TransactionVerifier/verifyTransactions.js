const { db, transactions_db } = require('../connection');
const fs = require('fs');

const checkPaymentStatus = async () => {
    const db_connection = await transactions_db.promise().getConnection();
    try{
        await db_connection.query('lock tables transactions read');
        const [result] =  await db_connection.query('select * from transactions where transactionStatus = "INITIATED"');
        await db_connection.query('unlock tables');

        console.log(result);

    }
    catch(err){
        console.log("Error");
            const now = new Date();
            now.setUTCHours(now.getUTCHours() + 5);
            now.setUTCMinutes(now.getUTCMinutes() + 30);
            const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
            fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
            fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
    }
    finally{
        await db_connection.release();
    }
}
module.exports = checkPaymentStatus;