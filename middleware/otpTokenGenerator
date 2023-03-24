const paseto = require('paseto');
const { V4: { sign } } = paseto;
const fs = require('fs');
async function createToken(data) {
    const privateKey = fs.readFileSync('./AssymetricKeyPair/private_key.pem');
    const token = await sign(data, privateKey, { expiresIn: "5 m" });
    return token;
}
module.exports = createToken;