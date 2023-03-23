const mailer = require('nodemailer');
const otpMailer = (random_number) => {
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
        subject: 'Anokha 2023 Password Reset Confirmation',
        html: `<p>${random_number}</p>`
      }
    
    
    
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
}

module.exports = otpMailer;
