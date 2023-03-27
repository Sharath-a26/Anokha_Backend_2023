const paseto = require('paseto');
const { V4: { sign, verify } } = paseto;
const fs = require('fs');
async function createToken(data) {
    const publicKey = fs.readFileSync('./AssymetricKeyPair/public_key.pem');
    try{
       
        const payload = await verify(data.SECRET_TOKEN, publicKey);
        data["userEmail"] = payload["userEmail"];
        const transactionPrivateKey = fs.readFileSync('./AssymetricKeyPair/transaction_private_key.pem');
        const transactionToken = await sign(data, transactionPrivateKey, { expiresIn: "5 m" });
        return transactionToken;
       
    }
    catch(error)
    {
        return null;
    }
    
}
module.exports = createToken;