const mailer = require('nodemailer');
const fs = require('fs');
const otpMailer = (fullName, userEmail, otp) => {
  var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kvaisakhkrishnan@gmail.com',
        pass: 'bzadotrblgcgcnac'
    }
});


const data = fs.readFileSync('htmlDocuments/otpVerification.html').toString();
const finaldata = data.replace('%= name %', fullName).replace('%= otp %', otp);

  

  
  
  var mailOptions = {
      from: 'Anokha 2023',
      to: userEmail,
      subject: 'OTP Verification for Anokha 2023',
      html: finaldata
    }
    
  
    
    
    
      transporter.sendMail(mailOptions, function(error, info){});
}
otpMailer();
module.exports = otpMailer;
