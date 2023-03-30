const {db, transactions_db} = require('./../connection.js');

const createViews = () =>{
    //General Views
    db.query(`create view AnokhaCollegeData as select * from CollegeData`, (err, result)=>{if(err) console.log("Error in AnokhaCollegeData")});
    db.query(`create view AnokhaCrewDetails as select * from CrewDetails`, (err, result)=>{if(err) console.log("Error in AnokhaCrewDetails")});
    db.query(`create view AnokhaCrewMembers as select * from CrewMembers`, (err, result)=>{if(err) console.log("Error in AnokhaCrewMembers")});
    db.query(`create view AnokhaDepartmentData as select * from DepartmentData`, (err, result)=>{if(err) console.log("Error in AnokhaDepartmentData")});
    db.query(`create view AnokhaEventData as select * from EventData`, (err, result)=>{if(err) console.log("Error in AnokhaEventData")});
    db.query(`create view AnokhaEventManager as select * from EventManager`, (err, result)=>{if(err) console.log("Error in AnokhaEventManager")});
    db.query(`create view AnokhaGroupData as select * from GroupData`, (err, result)=>{if(err) console.log("Error in AnokhaGroupData")});
    db.query(`create view AnokhaOTP as select * from OTP`, (err, result)=>{if(err) console.log("Error in AnokhaOTP")});
    db.query(`create view AnokhaRegisteredEvents as select * from RegisteredEvents`, (err, result)=>{if(err) console.log("Error in AnokhaRegisteredEvents")});
    db.query(`create view AnokhaStarredEvents as select * from StarredEvents`, (err, result)=>{if(err) console.log("Error in AnokhaStarredEven")});
    db.query(`create view AnokhaUserData as select * from UserData`, (err, result)=>{if(err) console.log("Error in AnokhaUserData")});
    transactions_db.query(`create view AnokhaTransaction as select * from Transaction`, (err, result)=>{if(err) console.log("Error in AnokhaTransaction")});

    //User App
    db.query(`create view AnokhaEventsAndDepartments as SELECT eventId, eventName, eventOrWorkshop, description, date, eventTime, venue, fees, EventData.departmentAbbr, departmentName FROM EventData LEFT JOIN DepartmentData ON EventData.DepartmentAbbr = DepartmentData.DepartmentAbbr order by EventData.DepartmentAbbr`, (err, result)=>{if(err) console.log("Error in AnokhaEventsAndDepartment")});
    db.query(`create view AnokhaCompleteUserData as select userEmail, password, fullName, currentStatus, activePassport, isAmritaCBE, CollegeData.collegeId, passportId, collegeName, district, state, country from UserData left join CollegeData on UserData.collegeId = CollegeData.collegeId`, (err, result)=>{if(err) console.log("Error in AnokhaCompleteUserData")});
    db.query(`create view AnokhaStarredEventsData as select eventdata.eventId, userEmail, eventdata.eventName, eventOrWorkshop, description, date, eventTime, venue, fees, departmentdata.departmentabbr, departmentName from departmentdata, starredevents, eventdata where starredevents.eventId = eventdata.eventId && departmentData.departmentAbbr = eventData.departmentAbbr`, (err, result)=>{if(err) console.log("Error in AnokhaStarredEventsData")})
    db.query(`create view AnokhaCrewCompleteData as select crewEmail,name,departmentdata.departmentabbr,role,departmentname, crewmembers.teamId, teamName from crewmembers, departmentdata, crewdetails where crewmembers.teamId = crewdetails.teamId && departmentdata.departmentabbr = crewmembers.departmentAbbr`, (err, result)=>{if(err) console.log("Error in AnokhaCrewCompleteData")});
    
    
    //Admin App
    db.query(`create view AnokhaEventRegisteredStudents as select eventdata.eventId, eventName, eventOrWorkshop, description, date, eventTime, venue, fees, userEmail, departmentData.departmentAbbr, RegisteredEvents.timeStamp, departmentName from eventData, RegisteredEvents, departmentData where RegisteredEvents.eventId = eventData.eventId && departmentData.departmentAbbr = eventData.departmentAbbr`, (err, result)=>{if(err) console.log("Error in AnokhaEventRegisteredStudents")})

}

module.exports = createViews;