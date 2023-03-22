const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret_key = process.env.SECRET_ACCESS_TOKEN;
function tokenValidator(req, res, next){

    

   const token_header = req.headers.authorization;
   const token = token_header && token_header.split(' ')[1];
   if(token == null)
   {
    
        res.status(401).send({"error" : "Better Luck Next Time..."});
        return ;
   }
   jwt.verify(token, secret_key, (err, result) => {
    if(err){
        res.status(403).send({"error" : "Expired Token"});
        return ;
        
    }
    next();
    
   })
   

}
module.exports = tokenValidator;

module.exports = tokenValidator;