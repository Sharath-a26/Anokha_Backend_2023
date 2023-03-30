const insertDummyData = (db, transactions_db) => {
    var bool_data = false;
    for(var i = 0; i<=9; i+=1)
    {
        
        var date_time = new Date().toISOString().slice(0, 19).replace('T', ' ')
        bool_data = !bool_data;
        db.query(`insert into DepartmentData (departmentAbbr, departmentName) values ('DEP${i}', 'DEPARTMENT${i}')`);
        db.query(`insert into CollegeData (collegeName, district, state, country) values ('COLLEGE${i}', 'DISTRICT${i}', 'STATE${i}', 'COUNTRY${i}')`);
        db.query(`insert into CrewDetails (teamName) values ('TEAM${i}')`);
        db.query(`insert into EventManager (eventManagerEmail,name,password,timeStamp,managerPhoneNumber) values ('managerEmail${i}@gmailc.com','managerName${i}','managerPass${i}','${date_time}','123456789${i}')`); 
        db.query(`insert into EventData (eventName,eventOrWorkshop,departmentAbbr,description,eventManagerEmail,date,eventTime,venue,fees,totalNumberOfSeats,noOfRegistrations,timeStamp,refundable) values ('EVENT${i}','${i%2}','DEP${i}','DESCRIPTION${i}','managerEmail${i}@gmailc.com', '2${i}-Mar-2023', '${i}0:00:00','VENUE${i}',${(i+1)*100},${i+50},${i+10},'${date_time}',${bool_data})`);
        db.query(`insert into UserData (userEmail, fullName, password, currentStatus, activePassport, isAmritaCBE, collegeId, accountTimeStamp, passportId, passportTimeStamp) values ('cb.en.u4cse2001${i}@cb.students.amrita.edu', 'FIRSTNAME${i} LASTNAME${i}', 'SAFEPASSWORD${i}', ${!bool_data}, ${bool_data}, ${bool_data}, ${i + 1},'${date_time}','PASSPORTID${i}', '${date_time}')`);
        db.query(`insert into CrewMembers (crewEmail, name, departmentAbbr, teamId, role) values ('someEmail${i}@gmail.com', 'NAME${i}', 'DEP${i}', ${i+1}, 'SOMEROLE${i}')`);
        db.query(`insert into StarredEvents (eventId, userEmail) values (${i+1}, 'cb.en.u4cse2001${i}@cb.students.amrita.edu')`);
        db.query(`insert into GroupData (groupId, userEmail, teamName, role, eventId) values ('UUID${i}', 'cb.en.u4cse2001${i}@cb.students.amrita.edu', 'TEAM NAME ${i}', 'ROLE ${i}', ${i + 1})`);
        db.query(`insert into RegisteredEvents (userEmail,eventId,timeStamp,refundRequested) values ('cb.en.u4cse2001${i}@cb.students.amrita.edu',${i+1},'${date_time}',${bool_data})`);
       transactions_db.query(`insert into Transactions (transactionId, userEmail, sender, senderAccNo, receiver, receiverAccNo, eventIdOrPassportId, amount, timeStamp) values ('TRANSACTIONID${i}', 'cb.en.u4cse2001${i}@cb.students.amrita.edu', 'SENDER${i}', 'SENDERACC${i}', 'RECNAME${i}', 'RECACC${i}', 'SOMEID${i}', ${200 + i * i}, '${date_time}')`);

    }
    
}

module.exports = insertDummyData;

