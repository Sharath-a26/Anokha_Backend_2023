const paseto = require('paseto');
const { V4: { verify } } = paseto;
const validator = require('validator');
const fs = require('fs');
async function tokenValidator(req, res, next){
    const tokenHeader = req.headers.authorization;
    const token = tokenHeader && tokenHeader.split(' ')[1];
    if(tokenHeader == null)
    {
        res.status(401).send({"error" : "You need to be way better to access the db..."});
        return;
    }
    const publicKey = fs.readFileSync('./AssymetricKeyPair/transaction_public_key.pem');
    try{
        const payload = await verify(token, publicKey);
        if(payload["userEmail"] == req.body.userEmail)
        {
            next();
            return;
        }
        res.status(401).send({"error" : "Unauthorized access"});
        return;
           

    }
    catch(error)
    {
        res.status(401).send({"error" : "Unauthorized access"});
        return;
    }
    
    
    

}
module.exports = tokenValidator;
