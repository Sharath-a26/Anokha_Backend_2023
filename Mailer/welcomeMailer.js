const mailer = require('nodemailer');
const fs = require('fs');
const welcomeMailer = (fullName, userEmail) => {
  var transporter = mailer.createTransport({
    service: 'hotmail',
    auth: {
        user: 'anokha@cb.amrita.edu',
        pass: '@u97*j3P^RG49V'
    }
});


  const data = fs.readFileSync('htmlDocuments/welcomeHTML.html').toString();
  const finaldata = data.replace('%= name %', fullName);
    

    var mailOptions = {
        from: {
          name : "Anokha 2023",
          address : 'anokha@cb.amrita.edu'
        },
        to: userEmail,
        subject: 'Welcome to Anokha 2023: Unleash Your Genius at Amrita Vishwa Vidyapeetham, Coimbatore!',
        html: finaldata
      }
    
    
    
      transporter.sendMail(mailOptions, function(error, info){});
}
welcomeMailer();
module.exports = welcomeMailer;
