const { db, transactions_db } = require('../connection');
module.exports = {
    getEventsByDepartment : (req, res) => {
        db.query("SELECT * FROM EventData LEFT JOIN DepartmentData ON EventData.DepartmentAbbr = DepartmentData.DepartmentAbbr order by EventData.DepartmentAbbr", (err, result) => {
            if(err){
                console.log("Error in query");
            }
            else{
                res.send(result);
            }
        });
    }
}