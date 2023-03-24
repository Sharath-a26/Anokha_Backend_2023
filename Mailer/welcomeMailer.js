const mailer = require('nodemailer');
const fs = require('fs');
const welcomeMailer = () => {
  var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kvaisakhkrishnan@gmail.com',
        pass: 'bzadotrblgcgcnac'
    }
});

   const data = fs.readFileSync('../htmlDocuments/welcomeHTML.html');
  console.log(data.toString());
    
    
    
    var mailOptions = {
        from: 'kvaisakhkrishnan@gmail.com',
        to: 'cb.en.u4cse20069@cb.students.amrita.edu',
        subject: 'Welcome',
        html: data.toString()
      }
    
    
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}
welcomeMailer();
module.exports = welcomeMailer;
