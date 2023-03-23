const paseto = require('paseto');
const { V4: { sign } } = paseto;
const fs = require('fs');
async function createWebToken(data) {
    const privateKey = fs.readFileSync('./AssymetricKeyPair/private_key.pem');
    const token = await sign(data, privateKey, { expiresIn: "15 m" });
    return token;
}
module.exports = createWebToken;