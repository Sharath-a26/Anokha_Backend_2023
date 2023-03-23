const createTables = (db) => {
    db.query("create table DepartmentData (departmentAbbr varchar(10) primary key, departmentName varchar(50) not null unique)", (err, result) => {
        if(err)
        {
            console.log("Failed to create DepartmentData");
        }
        else{
            console.log("DepartmentData created succesfully");
        }
    });

    

    db.query("create table OTP (userEmail varchar(65) primary key, otp int unique not null, fullName VARCHAR(50) NOT NULL, password VARCHAR(25) NOT NULL, currentStatus BOOLEAN NOT NULL, activePassport BOOLEAN NOT NULL, isAmritaCBE BOOLEAN NOT NULL, collegeId INT NOT NULL, accountTimeStamp DATETIME NOT NULL, passportId VARCHAR(25) UNIQUE, passportTimeStamp DATETIME);", (err, res) => {
        if(err)
        {
            console.log("Failed to create OTP table")
        }
        else{
            console.log("OTP table created succesfully");
        }
    });

    db.query("create table EventManager (eventManagerEmail varchar(65) PRIMARY KEY,name varchar(50) NOT NULL,password varchar(25) NOT NULL,timeStamp datetime NOT NULL,managerPhoneNumber char(10) NOT NULL unique)",(err,result) => {
        if(err) {
            console.log("Failed to create ErrorManager table");
        }
        else {
            console.log("EventManager table created succesfully");
        }
    });


    db.query("create table CollegeData (collegeId int PRIMARY KEY AUTO_INCREMENT,collegeName varchar(50) NOT NULL,district varchar(50) NOT NULL,state varchar(50) NOT NULL,country varchar(50) NOT NULL)", (err,result) => {
        if(err) {
            console.log("Failed to create CollegeData table")
        }
        else {
            console.log("CollegeData table created succesfully");
        }
    });

    db.query("create table CrewDetails (teamId int PRIMARY KEY AUTO_INCREMENT,teamName varchar(50) NOT NULL unique)", (err,result) => {
        if(err) {
            console.log("Failed to create CrewDetails table");
        }
        else {
            console.log("CrewDetails table created succesfully");
        }
    });

    db.query("CREATE TABLE UserData (userEmail VARCHAR(65) PRIMARY KEY, fullName VARCHAR(50) NOT NULL, password VARCHAR(25) NOT NULL, currentStatus BOOLEAN NOT NULL, activePassport BOOLEAN NOT NULL, isAmritaCBE BOOLEAN NOT NULL, collegeId INT NOT NULL, accountTimeStamp DATETIME NOT NULL, passportId VARCHAR(25) UNIQUE, passportTimeStamp DATETIME, FOREIGN KEY (collegeId) REFERENCES CollegeData (collegeId));", (err, result) => {
        if(err)
        {
            console.log("Failed to create UserData table");
        }
        else{
            console.log("UserData table created succesfully");
        }
    });
    
    db.query("create table CrewMembers (crewEmail varchar(65) primary key, name varchar(50) not null, departmentAbbr varchar(10) not null,  teamId int not null, role varchar(50) not null,  foreign key (departmentAbbr) references DepartmentData(departmentAbbr), foreign key (teamId) references CrewDetails(teamId))", (err, result) => {
        if(err)
        {
            console.log("Failed to create CrewMembers table");
        }
        else{
            console.log("CrewMembers table created succesfully");
        }
    });

    db.query("create table GroupData (groupId varchar(36), userEmail varchar(65), teamName varchar(50) unique not null, role varchar(50) not null, eventId int, primary key(groupId, userEmail, eventId))", (err,res) => {
        if(err)
        {
            console.log("Failed to create GroupData table");
        }
        else{
            console.log("GroupData table created succesfully");
        }
    });

    

    db.query("create table EventData (eventId int PRIMARY KEY AUTO_INCREMENT, eventName varchar(50) NOT NULL,eventOrWorkshop boolean NOT NULL,description varchar(500) NOT NULL,eventManagerEmail varchar(65) not null,date varchar(20) NOT NULL,eventTime time NOT NULL,venue varchar(50) NOT NULL,fees int NOT NULL,totalNumberOfSeats int NOT NULL,noOfRegistrations int NOT NULL,timeStamp datetime NOT NULL,refundable boolean NOT NULL,departmentAbbr varchar(10) not null,FOREIGN KEY(departmentAbbr) REFERENCES DepartmentData(departmentAbbr),FOREIGN KEY(eventManagerEmail) REFERENCES EventManager(eventManagerEmail))", (err,result) => {
        if(err) {
            console.log("Failed to create EventData table");
        }
        else {
            console.log("EventData table created succesfully");
        }
    });

    db.query("create table RegisteredEvents (userEmail varchar(65), eventId int,timeStamp datetime NOT NULL, refundRequested boolean NOT NULL, PRIMARY KEY(userEmail,eventId),  FOREIGN KEY(eventId) REFERENCES EventData(eventId),  FOREIGN KEY(userEmail) REFERENCES UserData(userEmail))",(err,result) => {
        if(err) {
            console.log("Failed to create Registered Events table");
        }
        else {
            console.log("RegisteredEvents table created succesfully");  
        }
    })

     db.query("create table StarredEvents (eventId int, userEmail varchar(65), primary key(userEmail, eventId), foreign key (eventId) references EventData(eventId), foreign key (userEmail) references UserData (userEmail))",(err,result) => {
        if(err) {
            console.log("Failed to create StarredEvents table");
        }
        else {
            console.log("StarredEvents table created succesfully");  
        }
    })


    



}

module.exports = createTables;