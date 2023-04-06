const insertDummyData = (db, transactions_db) => {


    var bool_data = false;
    db.query(`insert into Roles (role) values ("SUPER")`);
    db.query(`insert into Roles (role) values ("ADMIN")`);
    db.query(`insert into Roles (role) values ("EWHEAD")`);
    db.query(`insert into Roles (role) values ("FINANCE")`);
    db.query(`insert into Roles (role) values ("DEPTHEAD")`);
    db.query(`insert into Roles (role) values ("FACCOORD")`);
    db.query(`insert into Roles (role) values ("STDCOORD")`);
    db.query(`insert into Roles (role) values ("EVNTDREG")`);
    db.query(`insert into Roles (role) values ("SECURITY")`);
    var date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
    db.query(`insert into EventManager (userName,userEmail,name,password,timeStamp,phoneNumber,role) values ('SUPER_VAI_2023','cb.en.u4cse20069@cb.students.amrita.edu','Vaisakhkrishnan K','hd8t3edbiug39eutougdhe','${date_time}','8129348583','SUPER')`); 
    db.query(`insert into EventManager (userName,userEmail,name,password,timeStamp,phoneNumber,role) values ('SUPER_SHR_2023','cb.en.u4cse20159@cb.students.amrita.edu','Sharath S R','iuge62g3d8b82yfdio3eoi','${date_time}','9597197934','SUPER')`); 



    //ADMIN ==> All data with all regsieterd users
    //EWHEAD ==> All data from that event 
    //DEPTHEAD ==> All department related events
    //FACCOORD ==> Particular event
    //STUDENTCOORD ==> Particular coordinator
    //EVENTIDEREG ==> registration for eventide
    //SECURITY ==> Scanning
    //FINANCE ==> Statistics
    var date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
    
    db.query(`insert into EventManager (userName,userEmail,name,password,timeStamp,phoneNumber,role) values ('ADMIN_538865','managerEmail1@gmail.com','ADMIN1','ADMINPASSWORD1','${date_time}','1234567890','ADMIN')`); 
    db.query(`insert into EventManager (userName,userEmail,name,password,timeStamp,phoneNumber,role) values ('ADMIN_538867','managerEmail2@gmail.com','ADMIN2','ADMINPASSWORD2','${date_time}','1234567891','ADMIN')`); 
    db.query(`insert into EventManager (userName,userEmail,name,password,timeStamp,phoneNumber,role) values ('ADMIN_638866','managerEmail3@gmail.com','EWHEAD2','ADMINPASSWORD1','${date_time}','1234567893','EWHEAD')`); 
    db.query(`insert into EventManager (userName,userEmail,name,password,timeStamp,phoneNumber,role) values ('EWHEAD_638865','managerEmail4@gmail.com','EWHEAD1','EWHEADPASSWORD1','${date_time}','1234567895','EWHEAD')`); 
    db.query(`insert into EventManager (userName,userEmail,name,password,timeStamp,phoneNumber,role) values ('DEPTHEAD_738865','managerEmail5@gmail.com','DEPTHEAD1','DEPTHEADPASSWORD1','${date_time}','1234567296', 'DEPTHEAD')`); 
    db.query(`insert into EventManager (userName,userEmail,name,password,timeStamp,phoneNumber,role) values ('FACCOORD_738865','managerEmail6@gmail.com','FACCOORD1','FACCOORDPASSWORD1','${date_time}','1234527897', 'FACCOORD')`); 
    db.query(`insert into EventManager (userName,userEmail,name,password,timeStamp,phoneNumber,role) values ('STUDENTCOORD_738865','managerEmail7@gmail.com','STUDENTCOORD1','STUDENTCOORDPASSWORD1','${date_time}','1214527898', 'STDCOORD')`); 
    db.query(`insert into EventManager (userName,userEmail,name,password,timeStamp,phoneNumber,role) values ('EVENTIDEREG_738865','managerEmail8@gmail.com','EVENTIDEREG1','EVENTIDEREGPASSWORD1','${date_time}','1215452789', 'EVNTDREG')`); 
    db.query(`insert into EventManager (userName,userEmail,name,password,timeStamp,phoneNumber,role) values ('SECURITY_738865','managerEmail9@gmail.com','SECURITY1','SECURITYPASSWORD1','${date_time}','121645279', 'SECURITY')`); 
    db.query(`insert into EventManager (userName,userEmail,name,password,timeStamp,phoneNumber,role) values ('FINANCE_738865','managerEmail10@gmail.com','FINANCE1','FINANCEPASSWORD1','${date_time}','129645890', 'FINANCE')`); 









    for(var i = 0; i<=9; i+=1)
    {
        
        var date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
        bool_data = !bool_data;
        db.query(`insert into DepartmentData (departmentAbbr, departmentName) values ('DEP${i}', 'DEPARTMENT${i}')`);
        db.query(`insert into CrewDetails (teamName) values ('TEAM${i}')`);
        db.query(`insert into UserData (userEmail, fullName, password, currentStatus, activePassport, isAmritaCBE, collegeId, accountTimeStamp, passportId, passportTimeStamp) values ('cb.en.u4cse2001${i}@cb.students.amrita.edu', 'FIRSTNAME${i} LASTNAME${i}', 'SAFEPASSWORD${i}', ${!bool_data}, ${bool_data}, ${bool_data}, ${i + 1},'${date_time}','PASSPORTID${i}', '${date_time}')`);
        db.query(`insert into CrewMembers (crewEmail, name, departmentAbbr, teamId, role) values ('someEmail${i}@gmail.com', 'NAME${i}', 'DEP${i}', ${i+1}, 'SOMEROLE${i}')`);
        db.query(`insert into EventData (eventName, eventOrWorkshop, groupOrIndividual, maxCount, description, url, userEmail, date, eventTime, venue, fees, totalNumberOfSeats, noOfRegistrations, timeStamp, refundable, departmentAbbr) values ('EVENT${i}', ${bool_data}, ${bool_data}, 1, 'DESC${i}', 'https://play-lh.googleusercontent.com/VojafVZNddI6JvdDGWFrRmxc-prrcInL2AuBymsqGoeXjT4f9sv7KnetB-v3iLxk_Koi','managerEmail${i + 1}@gmail.com', '24-Mar-2023', '08:14:57', 'VENUE${i}', 100, 100, 0, '${date_time}', 0,  'DEP${i}')`)
        db.query(`insert into GroupData (groupId, userEmail, teamName, role, eventId) values ('UUID${i}', 'cb.en.u4cse2001${i}@cb.students.amrita.edu', 'TEAM NAME ${i}', 'ROLE ${i}', ${i + 1})`);
       transactions_db.query(`insert into Transactions (transactionId, userEmail, sender, senderAccNo, receiver, receiverAccNo, eventIdOrPassportId, amount, timeStamp) values ('TRANSACTIONID${i}', 'cb.en.u4cse2001${i}@cb.students.amrita.edu', 'SENDER${i}', 'SENDERACC${i}', 'RECNAME${i}', 'RECACC${i}', 'SOMEID${i}', ${200 + i * i}, '${date_time}')`);
        db.query(`insert into StarredEvents (eventId, userEmail) values (${i+1}, 'cb.en.u4cse2001${i}@cb.students.amrita.edu')`);
        db.query(`insert into RegisteredEvents (userEmail,eventId,timeStamp,refundRequested) values ('cb.en.u4cse2001${i}@cb.students.amrita.edu',${i+1},'${date_time}',${bool_data})`);
        db.query(`insert into VisitsData (userEmail, entryTimeStamp, exitTimeStamp, inside) values ('cb.en.u4cse2001${i}@cb.students.amrita.edu', '${date_time}', null, 1)`);

}
// db.query(`insert into StudentCoordinator (faculty, student, eventId) values ('FACCOORD_738865', 'STUDENTCOORD_738865', 2)`)

}


module.exports = insertDummyData;

