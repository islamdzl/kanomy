const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
require('dotenv').config()
const Email = async(to,message)=> {
    const oauth2Client = new OAuth2(
      process.env.GOOGLE_OAUTH_CLIENT_ID,
      process.env.GOOGLE_OAUTH_CLIENT_SECRET,
        'https://developers.google.com/oauthplayground'
      );
      oauth2Client.setCredentials({
        refresh_token: '1//04Pj5PmSH1rjDCgYIARAAGAQSNwF-L9Ir5pnOUvedP_V07UZjiuu9h6ZhtCrBp6RtN3B8Dd4b2H2WCKGA8enoJubu1_-za9u1ojw'
      });
      const accessToken = oauth2Client.getAccessToken();
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: 'isodpl1@gmail.com',
          clientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
          clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
          refreshToken: '1//04Pj5PmSH1rjDCgYIARAAGAQSNwF-L9Ir5pnOUvedP_V07UZjiuu9h6ZhtCrBp6RtN3B8Dd4b2H2WCKGA8enoJubu1_-za9u1ojw',
          accessToken: accessToken
        }
      });
      let mailOptions = {
        from: 'lejbedjislam@gmail.com',
        to: to,
        subject: message.subject,   
      };
      if (message.text) {
        mailOptions.text = message.text
      }else if (message.html) {
        mailOptions.html = message.html
      }
      return new Promise((resolve,reject)=> {
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            reject(false)
            return
          }
            resolve(true)
        });
      })
}
module.exports = Email
