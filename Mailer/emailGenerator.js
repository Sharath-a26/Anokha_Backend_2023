const mailer = require('nodemailer');
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
    html: '<h1>Welcome</h1><p>That was easy!</p>'
  }



  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });