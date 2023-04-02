const paseto = require('paseto');
const { V4: { verify } } = paseto;
const validator = require('validator');
const fs = require('fs');
const secret_token_transaction = "-KaPdSgVkXp2s5v8y/B?E(H+MbQeThWmZq3t6w9z$C&F)J@NcRfUjXn2r5u7x!A%D*G-KaPdSgVkYp3s6v9y/B?E(H+MbQeThWmZq4t7w!z%C&F)J@NcRfUjXn2r5u8x/A?D(G-KaPdSgVkYp3s6v9y$B&E)H@MbQeThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u8x/A?D(G+KbPeShVmYp3s6v9y$B&E)H@McQfTjWnZr4t7w!z%C*F-JaNdRgUkXp2s5v8x/A?D(G+KbPeShVmYq3t6w9z$B&E)H@McQfTjWnZr4u7x!A%D*F-JaNdRgUkXp2s5v8y/B?E(H+KbPeShVmYq3t6w9z$C&F)J@NcQfTjWnZr4u7x!A%D*G-KaPdSgUkXp2s5v8y/B?E(H+MbQeThWmYq3t6w9z$C&F)J@NcRfUjXn2r4u7x!A%D*G-KaPdSgVkYp3s6v8y/B?E(H+MbQeThWmZq4t7w!z$C&F)J@NcRfUjXn2r5u8x/A?D*";
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
        if(payload["userEmail"] == req.body.userEmail && secret_token_transaction == payload["secret_key"])
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
