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
                res.send(result[0]);
                }
            }
        )
    },

    editUserDetails: (req,res) => {
        const data = req.body;
        const user_mail = req.params.userEmail;
        let sql = `Update userData SET userEmail = '${req.body.userEmail}',fullName = '${req.body.fullName}',password = '${req.body.password}',currentStatus = '${req.body.currentStatus}',activePassport = '${req.body.activePassport}',isAmritaCBE = '${req.body.isAmritaCBE}',collegeId = '${req.body.collegeId}' where userEmail = '${req.params.userEmail}'`
        db.query(sql,(err,result,fields) => {
            if(err) {
                console.log(err);
                console.log("Error while editing profile")
            }
            else {
                res.send("Updated Successfully")
                
            }
        })
    }


}