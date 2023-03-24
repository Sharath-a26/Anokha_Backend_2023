const mailer = require('nodemailer');
const fs = require('fs');
const welcomeMailer = (fullName, userEmail) => {
  var transporter = mailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'kvaisakhkrishnan@gmail.com',
        pass: 'bzadotrblgcgcnac'
    }
});


  const data = fs.readFileSync('htmlDocuments/welcomeHTML.html').toString();
  const finaldata = data.replace('%= name %', fullName);
    

    var mailOptions = {
        from: 'Anokha 2023',
        to: userEmail,
        subject: 'Welcome to Anokha 2023: Unleash Your Genius at Amrita Vishwa Vidyapeetham, Coimbatore!',
        html: finaldata
      }
    
    
    
      transporter.sendMail(mailOptions, function(error, info){});
}
welcomeMailer();
module.exports = welcomeMailer;
