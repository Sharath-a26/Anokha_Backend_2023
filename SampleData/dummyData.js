const insertDummyData = (db, transactions_db) => {
    var bool_data = false;

    db.query(`insert into Roles (role) values ("ADMIN")`);
    db.query(`insert into Roles (role) values ("EWHEAD")`);
    db.query(`insert into Roles (role) values ("FINANCE")`);
    db.query(`insert into Roles (role) values ("DEPTHEAD")`);
    db.query(`insert into Roles (role) values ("FACCOORD")`);
    db.query(`insert into Roles (role) values ("STDCOORD")`);
    db.query(`insert into Roles (role) values ("EVNTDREG")`);
    db.query(`insert into Roles (role) values ("SECURITY")`);
    //ADMIN ==> All data with all regsieterd users
    //EWHEAD ==> All data from that event 
    //DEPTHEAD ==> All department related events
    //FACCOORD ==> Particular event
    //STUDENTCOORD ==> Particular coordinator
    //EVENTIDEREG ==> registration for eventide
    //SECURITY ==> Scanning
    //FINANCE ==> Statistics
    var date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
    db.query(`insert into EventManager (userName,name,password,timeStamp,phoneNumber,role) values ('ADMIN_538865','ADMIN1','ADMINPASSWORD1','${date_time}','1234567890','ADMIN')`); 
    db.query(`insert into EventManager (userName,name,password,timeStamp,phoneNumber,role) values ('ADMIN_538867','ADMIN2','ADMINPASSWORD2','${date_time}','1234567891','ADMIN')`); 
    db.query(`insert into EventManager (userName,name,password,timeStamp,phoneNumber,role) values ('ADMIN_638866','EWHEAD2','ADMINPASSWORD1','${date_time}','1234567893','EWHEAD')`); 
    db.query(`insert into EventManager (userName,name,password,timeStamp,phoneNumber,role) values ('EWHEAD_638865','EWHEAD1','EWHEADPASSWORD1','${date_time}','1234567895','EWHEAD')`); 
    db.query(`insert into EventManager (userName,name,password,timeStamp,phoneNumber,role) values ('DEPTHEAD_738865','DEPTHEAD1','DEPTHEADPASSWORD1','${date_time}','1234567296', 'DEPTHEAD')`); 
    db.query(`insert into EventManager (userName,name,password,timeStamp,phoneNumber,role) values ('FACCOORD_738865','FACCOORD1','FACCOORDPASSWORD1','${date_time}','1234527897', 'FACCOORD')`); 
    db.query(`insert into EventManager (userName,name,password,timeStamp,phoneNumber,role) values ('STUDENTCOORD_738865','STUDENTCOORD1','STUDENTCOORDPASSWORD1','${date_time}','1214527898', 'STDCOORD')`); 
    db.query(`insert into EventManager (userName,name,password,timeStamp,phoneNumber,role) values ('EVENTIDEREG_738865','EVENTIDEREG1','EVENTIDEREGPASSWORD1','${date_time}','1215452789', 'EVNTDREG')`); 
    db.query(`insert into EventManager (userName,name,password,timeStamp,phoneNumber,role) values ('SECURITY_738865','SECURITY1','SECURITYPASSWORD1','${date_time}','121645279', 'SECURITY')`); 
    db.query(`insert into EventManager (userName,name,password,timeStamp,phoneNumber,role) values ('FINANCE_738865','FINANCE1','FINANCEPASSWORD1','${date_time}','129645890', 'FINANCE')`); 









    for(var i = 0; i<=9; i+=1)
    {
        
        var date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
        bool_data = !bool_data;
        db.query(`insert into DepartmentData (departmentAbbr, departmentName) values ('DEP${i}', 'DEPARTMENT${i}')`);
        db.query(`insert into CollegeData (collegeName, district, state, country) values ('COLLEGE${i}', 'DISTRICT${i}', 'STATE${i}', 'COUNTRY${i}')`);
        db.query(`insert into CrewDetails (teamName) values ('TEAM${i}')`);
        db.query(`insert into UserData (userEmail, fullName, password, currentStatus, activePassport, isAmritaCBE, collegeId, accountTimeStamp, passportId, passportTimeStamp) values ('cb.en.u4cse2001${i}@cb.students.amrita.edu', 'FIRSTNAME${i} LASTNAME${i}', 'SAFEPASSWORD${i}', ${!bool_data}, ${bool_data}, ${bool_data}, ${i + 1},'${date_time}','PASSPORTID${i}', '${date_time}')`);
        db.query(`insert into CrewMembers (crewEmail, name, departmentAbbr, teamId, role) values ('someEmail${i}@gmail.com', 'NAME${i}', 'DEP${i}', ${i+1}, 'SOMEROLE${i}')`);
        db.query(`insert into EventData (eventName, eventOrWorkshop, groupOrIndividual, maxCount, description, url, userName, date, eventTime, venue, fees, totalNumberOfSeats, noOfRegistrations, timeStamp, refundable, departmentAbbr) values ('EVENT${i}', ${bool_data}, ${bool_data}, 1, 'DESC${i}', 'https://play-lh.googleusercontent.com/VojafVZNddI6JvdDGWFrRmxc-prrcInL2AuBymsqGoeXjT4f9sv7KnetB-v3iLxk_Koi','ADMIN_538865', '24-Mar-2023', '08:14:57', 'VENUE${i}', 100, 100, 0, '${date_time}', 0,  'DEP${i}')`)
        db.query(`insert into GroupData (groupId, userEmail, teamName, role, eventId) values ('UUID${i}', 'cb.en.u4cse2001${i}@cb.students.amrita.edu', 'TEAM NAME ${i}', 'ROLE ${i}', ${i + 1})`);
       transactions_db.query(`insert into Transactions (transactionId, userEmail, sender, senderAccNo, receiver, receiverAccNo, eventIdOrPassportId, amount, timeStamp) values ('TRANSACTIONID${i}', 'cb.en.u4cse2001${i}@cb.students.amrita.edu', 'SENDER${i}', 'SENDERACC${i}', 'RECNAME${i}', 'RECACC${i}', 'SOMEID${i}', ${200 + i * i}, '${date_time}')`);
        db.query(`insert into StarredEvents (eventId, userEmail) values (${i+1}, 'cb.en.u4cse2001${i}@cb.students.amrita.edu')`);
        db.query(`insert into RegisteredEvents (userEmail,eventId,timeStamp,refundRequested) values ('cb.en.u4cse2001${i}@cb.students.amrita.edu',${i+1},'${date_time}',${bool_data})`);
   
}
    
}

module.exports = insertDummyData;

