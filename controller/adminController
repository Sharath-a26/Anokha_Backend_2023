const { db, transactions_db } = require('../connection');

 module.exports = {

     getAdminDetails : (req,res) => {
         console.log(req.params.adminEmail);
         let sql = `select * from eventManager where eventManagerEmail = '${req.params.adminEmail}'`
         db.query(sql,(err,result) => {
             if(err) {
                 res.send("Query error");
             }
             else {

                  res.send(result[0])
             }
         })
     }
}

