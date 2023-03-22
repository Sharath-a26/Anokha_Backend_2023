require('dotenv').config()
const jwt = require('jsonwebtoken');
const secret_key = process.env.SECRET_ACCESS_TOKEN;
function createJsonWebToken(data) {
    const token = jwt.sign(data, secret_key, {expiresIn: 86400});
    return token;
}
module.exports = createJsonWebToken;