const { db, transactions_db } = require('../connection');
const tokenGenerator = require('../middleware/appTokenGenerator');
const tokenValidator = require('../middleware/appTokenValidator');
const fs = require('fs');
const rn = require('random-number');
const validator = require('validator');
const mailer = require('../Mailer/adminAppUser.js');
const { log } = require('console');
const { param } = require('../routes/userApp');
 module.exports = {



    createAdminAppUsers : [tokenValidator, async (req, res) => {
        if(req.authorization_tier == "SUPER"){
            if(req.body.userEmail == undefined ||
                !validator.isEmail(req.body.userEmail) ||
                req.body.name == undefined ||
                req.body.phoneNumber == undefined ||
                req.body.role == undefined ||
                ((req.body.role == "DEPTHEAD" || req.body.role == "FACCOORD" || req.body.role == "STDCOORD") && req.body.departmentAbbr == undefined)
                )
                {
                    res.status(400).send({error : "Please Check Guys...."});
                }
                else{
                    const gn = rn.generator({
                        min: 100000,
                        max: 999999,
                        integer: true
                    });
                    
                    const userName = `${req.body.role}_${gn()}`;
                    const password = Math.random().toString(36).slice(2) + Math.random().toString(36).toUpperCase().slice(2);
                    var department = "";
                    if(req.body.departmentAbbr == undefined)
                    {
                        department = null;
                    }
                    else{
                        department = req.body.departmentAbbr;
                    }
                    const db_connection = await db.promise().getConnection();
                    try{
                        var date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
                        const [result] = await db_connection.query(`insert into EventManager (userName,userEmail,name,password,timeStamp,phoneNumber,role) values (?,?,?,?,?,?,?)`, [userName, req.body.userEmail, req.body.name, password, date_time, req.body.phoneNumber, req.body.role]);
                        mailer(req.body.name, req.body.userEmail, userName, password);
                        res.status(201).send({"status" : "Done..."});
                    }
                    catch(err){
                        const now = new Date();
                        now.setUTCHours(now.getUTCHours() + 5);
                        now.setUTCMinutes(now.getUTCMinutes() + 30);
                        const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                        fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                        fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                        res.status(500).send({"Error" : err});
                    }
                    finally{
                        await db_connection.release();
                    }
                }
        }
        else{
            res.status(401).send({"error" : "You have no rights to be here!"})
        }
    }],






    getUserDetails : [tokenValidator, async (req,res) => {
        if(req.authorization_tier == "ADMIN"){

        if(req.params.userName == undefined)
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
        else{
         let sql_q = `select * from EventManager where userName = ?`;
         const db_connection = await db.promise().getConnection();
         try{
            const [result] = await db_connection.query(sql_q, [req.params.userName]);
            if(result.length == 0)
            {
                res.status(404).send({"error" : "no data found"});
            }
            else{
                res.status(200).send(result[0]);
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
        }
    }else{
        res.status(401).send({"error" : "You have no rights to be here!"})
    }
     }],



     getEventDetails : [tokenValidator, async(req, res) => {
        if(req.authorization_tier == "ADMIN"){
        var sql_q = "";
        parameters = []
        if(req.body.eventDate == undefined && req.params.userName != undefined)
        {
            sql_q = `select * from EventData where userEmail = (select userEmail from eventManager where userName = ?)`;
            parameters = [req.params.userName]
        }
        else if (req.params.userName != undefined){
            sql_q = `select * from EventData where userName = (select userEmail from eventManager where userName = ?) and date = ?`;
            parameters = [req.params.userName,req.body.eventDate]
        }
        else{
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
       
        const db_connection = await db.promise().getConnection();
        try{
            const [result] = await db_connection.query(sql_q, parameters);
            if(result.length == 0)
            {
                res.status(404).send({"error" : "no data found"});
            }
            else{
                res.status(200).send(result);
            }
        }
        catch(err)
         {
            console.log(err);
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
        else{
            res.status(401).send({"error" : "You have no rights to be here!"})
        }

        
     }],




     createEvent : [tokenValidator, async  (req, res) => {

        if(req.body.eventName == undefined ||
            req.body.eventOrWorkshop == undefined ||
            req.body.description == undefined ||
            req.body.userEmail == undefined ||
            req.body.date == undefined ||
            req.body.eventTime == undefined ||
            req.body.venue == undefined ||
            req.body.fees == undefined ||
            req.body.totalNumberOfSeats == undefined ||
            req.body.departmentAbbr == undefined ||
            req.body.refundable == undefined ||
            req.body.groupOrIndividual == undefined ||
            req.body.maxCount == undefined 
        )
        {
           
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
        else if(req.body.groupOrIndividual == 0 && req.body.maxCount != 0)
        {
            res.status(400).send({"error" : "ANOKHAERRCODEUNDEFINEDPARAMETERS"});
        }
        else{
            
            const db_connection = await db.promise().getConnection();
            try{
                const lockName = "CREATEVENT";
                const lockTimeout = 10;
                await db_connection.query(`SELECT GET_LOCK(?,?)`, [lockName, lockTimeout]);
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                let sql_q = `insert into EventData (eventName, eventOrWorkshop, groupOrIndividual, maxCount, description, url, userEmail, date, eventTime, venue, fees, totalNumberOfSeats, noOfRegistrations, timeStamp, refundable, departmentAbbr) values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`;
                const [result] = await db_connection.query(sql_q, [req.body.eventName,req.body.eventOrWorkshop,req.body.groupOrIndividual, req.body.maxCount, req.body.description, req.body.url, req.body.userEmail,req.body.date,req.body.eventTime,req.body.venue,req.body.fees,req.body.totalNumberOfSeats,req.body.noOfRegistrations,req.body.timeStamp,req.body.refundable,req.body.departmentAbbr]);
                await db_connection.query(`SELECT RELEASE_LOCK(?)`, [lockName]);
                res.status(201).send({result : "Data Inserted Succesfully"});
            }
        
            catch(err)
            {
                console.log(err);
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
                    res.status(500).send({"Error" : "Contact DB Admin if you see this message"});
                }
            }
           finally{
            await db_connection.release();
           }
        }
     }],





     adminLogin : async (req, res) => {
        if(req.body.userName == undefined || req.body.password == undefined)
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
        else{
        let sql_q = `select * from EventManager where userName = ? and password = ?`
            const db_connection = await db.promise().getConnection();
            try{
                const [result] = await db_connection.query(sql_q, [req.body.userName, req.body.password]);
                if(result.length == 0)
                {
                    res.status(404).send({error : "User not found"})
                }
                else{

                    const token = await tokenGenerator({
                        userName : result.userName,
                        userEmail : result.userEmail,
                        name : result.name,
                        managerPhoneNumber : result.phoneNumber,
                        role : result[0].role
                    });
                    res.json({
                        
                            userName : result[0].userName,
                            fullName : result[0].name,
                            phoneNumber : result[0].phoneNumber,
                            SECRET_TOKEN : token
                        
                    });
                
                }
            }
            
            catch(err){
                console.log(err);
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
    },



    registeredUsers : [tokenValidator, async (req,res) => {

        if(req.params.eventId == undefined || !validator.isNumeric(req.params.eventId))

        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
        else{
        let sql = `select * from userData where userEmail in (select userEmail from registeredevents where eventId = ?);`

        const db_connection = await db.promise().getConnection();
        try{
            const [result] = await db_connection.query(sql, [req.params.eventId]);
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
    }],



    updateEventData : [tokenValidator,  async (req, res) => {
        if(req.body.eventName == undefined ||
            req.body.eventOrWorkshop == undefined ||
            req.body.description == undefined ||
            req.body.userName == undefined ||
            req.body.eventDate == undefined ||
            req.body.eventTime == undefined ||
            req.body.venue == undefined ||
            req.body.fees == undefined ||
            req.body.totalNumberOfSeats == undefined ||
            req.body.departmentAbbr == undefined ||
            req.body.refundable == undefined ||
            req.body.eventId == undefined ||
            !validator.isNumeric(req.body.eventId)||
            validator.isEmpty(req.body.eventName) ||
        !validator.isBoolean(req.body.eventOrWorkshop) ||
        validator.isEmpty(req.body.description) ||
        validator.isEmpty(req.body.eventDate) ||
        validator.isEmpty(req.body.eventTime) ||
        validator.isEmpty(req.body.venue) ||
        !validator.isNumeric(req.body.fees) ||
        !validator.isNumeric(req.body.totalNumberOfSeats) ||
        validator.isEmpty(req.body.departmentAbbr) ||
        req.body.groupOrIndividual == undefined ||
        req.body.maxCount == undefined ||
        !validatorisBoolean(req.body.groupOrIndividual) ||
        !validator.isNumeric(req.body.maxCount) ||
        !validator.isBoolean(req.body.refundable)
        )
        {
            res.status(400).send({error : "We are one step ahead! Try harder!"});
        }
        else if(req.body.groupOrIndividual == 0 && req.body.maxCount != 0)
        {
            res.status(400).send({"error" : "ANOKHAERRCODEUNDEFINEDPARAMETERS"});
        }
        else{
            const db_connection = await db.promise().getConnection();
            try{
                const [result] = db.query(`update EventData set eventName = ?, groupOrIndividual = ?, maxCount = ?, description = ?, date = ?, eventTime = ?, venue = ?, fees = ?, totalNumberOfSeats = ?, refundable = ?, departmentAbbr = ? where eventId = ? and userName = ?`[req.body.eventName,req.body.groupOrIndividual, req.body.maxCount, req.body.description,req.body.eventDate,req.body.eventTime,req.body.venue,req.body.fees,req.body.totalNumberOfSeats,req.body.refundable,req.body.departmentAbbr,req.body.eventId,req.body.userName]);
                if(result.affectedRows == 0)
                {
                    res.status(400).send({"error" : "Error in data"});
                }
                else{
                res.status(200).send({result : "Updated Succesfully"});
                }}

           
            catch(err)
            {
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                res.status(500).send({error : "Query Error"})
            }
            finally{
                await db_connection.release();
            }
        
    }
    }],
















    verifyUser : [tokenValidator,async (req,res) => {

        if(req.authorization_tier == "SECURITY")
        {
        
        if(req.params.userEmail == undefined) {
            res.sendStatus(400).send("URL not found")
        }
        const db_connection = await db.promise().getConnection();
        let sql_q = `select * from userData where userEmail = ?`;

        try {
            var a = null;
        db.query(sql_q,[req.params.userEmail],(err,result) => {
            if(err) {
                res.send("Error");
            }
            else {
                
                var entry;
                let sql_entry = `select inside from visitsdata where userEmail = ? order by visit_id desc LIMIT 1;`;
                db.query(sql_entry,[req.params.userEmail],(err,result_entry) => {
                    if(err) {
                        console.log(err);
                    }
                    else {
                    
                    entry = result_entry;
                     
                let sql2 = `insert into visitsdata values(?,?,?,?)`;
        
                var today = new Date();
                var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
                var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
                var dateTime = date+' '+time;
                var inside = 1;
                
               
                if(entry.length == 0) {
                    inside = 1;
                }
                else {
                    console.log("hello");
                    inside = 1 - entry[0]["inside"]
                    var params;
                if(inside == 1) {
                    params = [req.params.userEmail,dateTime,null,inside];
                }
                else {
                    params = [req.params.userEmail,null,dateTime,inside];
                }
                
                db.query(sql2,params,(err,result2) => {
                    if(err || result2.affectedRows == 0) {
                        console.log(err);
                        res.send([])
                    }
                    else {
                        
                        res.send(result);
                    }
                });
                }
                
                
                    }
                })

               
                
            }
            
        })

    }


    catch(err)
            {
                const now = new Date();
                now.setUTCHours(now.getUTCHours() + 5);
                now.setUTCMinutes(now.getUTCMinutes() + 30);
                const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
                fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
                fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
                res.status(500).send({error : "Query Error"})
            }

            finally{
                await db_connection.release();
            } 
        }
        else{
            res.status(401).send({"error" : "You have no rights to be here!"})
        }   
        
    }],



//     facultyAddsStudents : [tokenValidator, async (req, res) =>{
//         if(req.authorization_tier == "FACCOORD"){
//             if(req.userEmail == undefined ||
//                 !validator.isEmail(req.userEmail) ||
//                 //have to write code here.....
//                 )
            
//     }
// else{
//     res.status(401).send({"error" : "You have no rights to be here!"})
//     }
//     }]

getAllEvents : [tokenValidator, async (req, res) => {
    let db_connection = await db.promise().getConnection();
    try{
        const [result] = await db_connection.query(`select * from EventData`);
        res.status(200).send(result);
    }
    catch(err)
    {
        console.log(err);
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

getEventsByDept : [
    tokenValidator,
    async (req,res) => {
        let db_connection = await db.promise().getConnection();
        try{
            const [result] = await db_connection.query(`select * from EventData where departmentAbbr = ?`,[req.params.dept]);
            res.status(200).send(result);
        }

        catch(err) {
            console.log(err);
            const now = new Date();
            now.setUTCHours(now.getUTCHours() + 5);
            now.setUTCMinutes(now.getUTCMinutes() + 30);
            const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
            fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
            fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
            res.status(500).send({"Error" : "Contact DB Admin if you see this message"});
        }
    }
],

getEventsByDate : [
    tokenValidator,
    async (req,res) => {
        
        let db_connection = await db.promise().getConnection();
        try{
            
            const [result] = await db_connection.query(`select * from EventData where date = ?`,[req.params.date]);
            res.status(200).send(result);
        }

        catch(err) {
            console.log(err);
            const now = new Date();
            now.setUTCHours(now.getUTCHours() + 5);
            now.setUTCMinutes(now.getUTCMinutes() + 30);
            const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
            fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
            fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
            res.status(500).send({"Error" : "Contact DB Admin if you see this message"});
        }


    }
],

getTotalFee : [
    tokenValidator,
    async (req,res) => {
        if(req.body.eventName == undefined && req.body.dept == undefined) {
            res.send("No data passed in body to post")
        }
        else {
        let db_connection = await db.promise().getConnection();
        try {
            await db_connection.query("lock tables eventData read");

            let command = "";
            if(req.body.dept == undefined) {
                command = `select sum(fees) as EVENT_SUM from eventdata group by eventName having eventName = ?`;
            }

            else if(req.body.eventName == undefined) {
                command = `select sum(fees) as DEPT_SUM from eventdata group by departmentAbbr having departmentAbbr = ?`;
            }

            let parameter = (req.body.eventName == undefined)? [req.body.dept] : [req.body.eventName];
            const [result] = await db_connection.query(command,parameter)
            await db_connection.query("unlock tables");
            res.status(200).send(result);

        }
        catch(err) {
            console.log(err);
            const now = new Date();
            now.setUTCHours(now.getUTCHours() + 5);
            now.setUTCMinutes(now.getUTCMinutes() + 30);
            const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
            fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
            fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
            res.status(500).send({"Error" : "Contact DB Admin if you see this message"});
        }
    }
    }
],

getTotalRegs : [
    tokenValidator,
    async (req,res) => {

        if(req.body.eventName == undefined && req.body.dept == undefined) {
            res.send("No data sent in post")
        }
        else {
        let db_connection = await db.promise().getConnection();
        try {
            await db_connection.query("lock tables eventData read");
            let command = "";
            if(req.body.dept == undefined) {
                command = `select noOfRegistrations from eventdata where eventName = ?`;
            }
            else if(req.body.evetName == undefined) {
                command = `select sum(noOfRegistrations) as DEPT_REGISTRATIONS from eventdata group by departmentAbbr having departmentAbbr = ?`
            }
            let parameter = (req.body.dept == undefined) ? [req.body.eventName] : [req.body.dept];

            const [result] = db_connection.query(command,parameter);
            await db_connection.query("unlock tables")

            res.status(200).send(result);
            

        }

        catch(err) {
            console.log(err);
            const now = new Date();
            now.setUTCHours(now.getUTCHours() + 5);
            now.setUTCMinutes(now.getUTCMinutes() + 30);
            const istTime = now.toISOString().slice(0, 19).replace('T', ' ');
            fs.appendFile('ErrorLogs/errorLogs.txt', istTime+"\n", (err)=>{});
            fs.appendFile('ErrorLogs/errorLogs.txt', err.toString()+"\n\n", (err)=>{});
            res.status(500).send({"Error" : "Contact DB Admin if you see this message"});
        }
        }
    }
]

    
}

