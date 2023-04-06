const mailer = require('nodemailer');
const fs = require('fs');
const otpMailer = (fullName, userEmail, otp) => {
  var transporter = mailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'anokha@cb.amrita.edu',
        pass: '@u97*j3P^RG49V'
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
