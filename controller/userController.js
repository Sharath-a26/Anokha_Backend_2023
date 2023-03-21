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
    },

    getUserDetails : (req,res) => {
        console.log(req.params.userEmail);
        let sql_q = `select * from UserData where userEmail = '${req.params.userEmail}'`;
        db.query(
            sql_q,(err,result) => {
                if(err){
                    console.log(err);
                }
                else {
                res.send(result);
                }
            }
        )
    },


}