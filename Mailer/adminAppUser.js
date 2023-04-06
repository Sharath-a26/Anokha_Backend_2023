const mailer = require('nodemailer');
const fs = require('fs');
const otpMailer = (fullName, userEmail, userName, password) => {
  var transporter = mailer.createTransport({
    service: 'hotmail',
    auth: {
      user: 'anokha@cb.amrita.edu',
      pass: '@u97*j3P^RG49V'
    }
});


const data = fs.readFileSync('htmlDocuments/accountCreated.html').toString();
const finaldata = data.replace('%= username %', userName).replace('%= password %', password).replace('%= name %', fullName);

  

  
  
  var mailOptions = {
      from: 'Anokha 2023',
      to: userEmail,
      subject: 'Anokha 2023 Account Created',
      html: finaldata
    }
    
  
    
    
    
      transporter.sendMail(mailOptions, function(error, info){});
}
otpMailer();
module.exports = otpMailer;
