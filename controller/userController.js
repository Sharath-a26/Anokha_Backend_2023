const { db, transactions_db } = require('../connection');
module.exports = {
    getEventsByDepartment : (req, res) => {
        db.query("SELECT * FROM EventData LEFT JOIN DepartmentData ON EventData.DepartmentAbbr = DepartmentData.DepartmentAbbr order by EventData.DepartmentAbbr", (err, result) => {
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


}