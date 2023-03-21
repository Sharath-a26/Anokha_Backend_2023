const dropTables = (db) => {

    db.query("drop table StarredEvents",  (err, result) => {
        if(err)
        {
            console.log("StarredEvents Relation doesnot exist. Failed to drop...");
            
        }
        else{
            console.log("Succesfully dropped relation StarredEvents");
        }
    });

    
    db.query("drop table RegisteredEvents", (err, result) => {
        if(err)
        {
            console.log("RegisteredEvents Relation doesnot exist. Failed to drop...");
            
        }
        else{
            console.log("Succesfully dropped relation RegisteredEvents");
        }
    });

    db.query("drop table EventData", (err, result) => {
        if(err)
        {
            console.log("EventData Relation doesnot exist. Failed to drop...");
            
        }
        else{
            console.log("Succesfully dropped relation EventData");
        }
    });

    db.query("drop table GroupData",  (err, result) => {
        if(err)
        {
            console.log("GroupData Relation doesnot exist. Failed to drop...");
            
        }
        else{
            console.log("Succesfully dropped relation GroupData");
        }
    });

    db.query("drop table CrewMembers",  (err, result) => {
        if(err)
        {
            console.log("CrewMembers Relation doesnot exist. Failed to drop...");
            
        }
        else{
            console.log("Succesfully dropped relation CrewMembers");
        }
    });

    db.query("drop table UserData", (err, result) => {
        if(err)
        {
            console.log("UserData Relation doesnot exist. Failed to drop...");
            
        }
        else{
            console.log("Succesfully dropped relation UserData");
        }
    });

    db.query("drop table CrewDetails",(err, result) => {
        if(err)
        {
            console.log("CrewDetails Relation doesnot exist. Failed to drop...");
            
        }
        else{
            console.log("Succesfully dropped relation CrewDetails");
        }
    });


    db.query("drop table CollegeData",  (err, result) => {
        if(err)
        {
            console.log("CollegeData Relation doesnot exist. Failed to drop...");
            
        }
        else{
            console.log("Succesfully dropped relation CollegeData");
        }
    });



    db.query("drop table EventManager",  (err, result) => {
        if(err)
        {
            console.log("EventManager Relation doesnot exist. Failed to drop...");
            
        }
        else{
            console.log("Succesfully dropped relation EventManager");
        }
    });


    
    db.query("drop table OTP", (err, result) => {
        if(err)
        {
            console.log("OTP Relation doesnot exist. Failed to drop...");
            
        }
        else{
            console.log("Succesfully dropped relation OTP");
        }
    });



    db.query("drop table DepartmentData",  (err, result) => {
        if(err)
        {
            console.log("DepartmentData Relation doesnot exist. Failed to drop...");
            
        }
        else{
            console.log("Succesfully dropped relation DepartmentData");
        }
    });

    
    


}

    
    module.exports = dropTables;