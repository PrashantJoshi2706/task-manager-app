

var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
 port: 587,
 secure: false,
 auth: {
     user:"joshipraantsm123@gmail.com",
     pass: 'prashantjoshi27'
 }
});

/*sending the mail after creating */
sendingMail = (email, name) => {

  var mailOptions = {
    from: 'joshipraantsm123@gmail.com',
    to: email,
    subject: 'Thanks for joining in',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('mail is sent')
    }
  });
}

/*cancelation mail */
sendingCancelMail = (email, name)=>{


  var mailOptions = {
    from:'joshipraantsm123@gmail.com',
    to: email,
    subject: 'canceling the account',
    text:`Tanks ${name} for using our services!!!`
  }

  transporter.sendMail(mailOptions, function (error, info){
    if(error){
      console.log(error);
    }
    else{
      console.log('cancelation email is sent');
    }
  })

}

module.exports = {
  sendingMail,
  sendingCancelMail
}
