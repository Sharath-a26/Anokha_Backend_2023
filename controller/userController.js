const { db, transactions_db } = require('../connection');
module.exports = {
    getEventsByDepartment : (req, res) => {
        let sql_q = "SELECT * FROM EventData LEFT JOIN DepartmentData ON EventData.DepartmentAbbr = DepartmentData.DepartmentAbbr order by EventData.DepartmentAbbr";
        db.query(sql_q, (err, result) => {
            if(err){
                console.log("Error in query");
                res.send("Query Error... Contact DB Admin");
            }
            else{

                var jsonResponse = [];
                var eventsByDepartment = {};
                var department = "";
                result.forEach(eventData => {
                    if(eventData.departmentAbbr == department)
                    {
                       eventsByDepartment["events"].push(eventData);
                    }
                    else
                    {
                        if(department != "")
                        {
                            jsonResponse.push(eventsByDepartment);
                        }
                        eventsByDepartment = {
                            department : eventData.departmentName,
                            events : [eventData]
                        }
                        department = eventData.departmentAbbr;

                    }
                });
                res.send(jsonResponse);
                

            }
        });
    },

    getUserDetails : (req,res) => {
        console.log(req.params.userEmail);
        let sql_q = `select * from UserData where userEmail = '${req.params.userEmail}'`;
        db.query(
            sql_q,(err,result) => {
                if(err){
                    console.log(err);
                    res.send("Query Error... Contact DB Admin");
                }
                else {
                res.send(result[0]);
                }
            }
        )
    },


    userLogin : (req, res) => {
        let sql_q = `select * from UserData left join CollegeData on UserData.collegeId = CollegeData.collegeId where userEmail = '${req.params.userEmail}' and password = '${req.params.password}'`
        db.query(sql_q, (err, result) => {
            if(err){
                console.log("Error in query");
                res.send("Query Error... Contact DB Admin");
            }
            else
            {
                if(result.length == 0)
                {
                    res.json({
                        status : 0
                    });
                }
                else{
                    
                        res.json({
                            status : 1,
                            details : {
                                userEmail : result[0].userEmail,
                                fullName : result[0].fullName,
                                activePassport : result[0].activePassport,
                                isAmritaCBE : result[0].isAmritaCBE,
                                collegeName : result[0].collegeName,
                                district : result[0].district,
                                state : result[0].state,
                                country : result[0].country
                            }
                        });
                    
                }
            }
        })
    }


}