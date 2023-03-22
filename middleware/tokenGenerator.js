const jwt = require('jsonwebtoken');
const secretKey = 'SECRET_KEY';
function createJsonWebToken(data) {
    const token = jwt.sign(data, `${secretKey}${Date().toString()}`, {expiresIn: 86400});
    return token;
}
module.exports = createJsonWebToken;