const mailer = require('nodemailer');
const welcomeMailer = () => {
  var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kvaisakhkrishnan@gmail.com',
        pass: 'bzadotrblgcgcnac'
    }
});

   
    
    
    
    var mailOptions = {
        from: 'kvaisakhkrishnan@gmail.com',
        to: 'cb.en.u4cse20069@cb.students.amrita.edu',
        subject: 'Welcome',
        html: `<p></p>`
      }
    
    
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = welcomeMailer;
