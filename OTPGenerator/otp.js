const rn = require('random-number');

const otpGenerator = () =>
{
const gn = rn.generator({
    min: 100000,
    max: 999999,
    integer: true
});
return gn();
}

module.exports = otpGenerator;
