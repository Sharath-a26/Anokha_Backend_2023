const paseto = require('paseto');
const { V4: { sign, verify } } = paseto;
const fs = require('fs');
const secret_token_transaction = "-KaPdSgVkXp2s5v8y/B?E(H+MbQeThWmZq3t6w9z$C&F)J@NcRfUjXn2r5u7x!A%D*G-KaPdSgVkYp3s6v9y/B?E(H+MbQeThWmZq4t7w!z%C&F)J@NcRfUjXn2r5u8x/A?D(G-KaPdSgVkYp3s6v9y$B&E)H@MbQeThWmZq4t7w!z%C*F-JaNdRgUjXn2r5u8x/A?D(G+KbPeShVmYp3s6v9y$B&E)H@McQfTjWnZr4t7w!z%C*F-JaNdRgUkXp2s5v8x/A?D(G+KbPeShVmYq3t6w9z$B&E)H@McQfTjWnZr4u7x!A%D*F-JaNdRgUkXp2s5v8y/B?E(H+KbPeShVmYq3t6w9z$C&F)J@NcQfTjWnZr4u7x!A%D*G-KaPdSgUkXp2s5v8y/B?E(H+MbQeThWmYq3t6w9z$C&F)J@NcRfUjXn2r4u7x!A%D*G-KaPdSgVkYp3s6v8y/B?E(H+MbQeThWmZq4t7w!z$C&F)J@NcRfUjXn2r5u8x/A?D*";
async function createToken(data) {
    const publicKey = fs.readFileSync('./AssymetricKeyPair/public_key.pem');
    try{
       data["secret_key"] = secret_token_transaction;
        const payload = await verify(data.SECRET_TOKEN, publicKey);
        data["userEmail"] = payload["userEmail"];
        const transactionPrivateKey = fs.readFileSync('./AssymetricKeyPair/transaction_private_key.pem');
        const transactionToken = await sign(data, transactionPrivateKey, { expiresIn: "10 m" });
        return transactionToken;
       
    }
    catch(error)
    {
        return null;
    }
    
}
module.exports = createToken;