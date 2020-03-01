const nodemailer = require('nodemailer');

const email_address = process.env.EMAIL_ADDRESS;
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: email_address,
        clientId: process.env.OAUTH_CLIENT_ID,
        clientSecret: process.env.OAUTH_CLIENT_SECRET,
        refreshToken: process.env.OAUTH_REFRESH_TOKEN,
    }
});

/**
 * Sends an email from the .env address to the specified 'to' email, with a subject and body given by the 
 * function caller.
 * @param {string} to 
 * @param {string} subject 
 * @param {string} body 
 */
function mailer(to, subject, body) {
 
    var mailOptions = {
        from: email_address,
        to: to,
        subject: subject,
        text: body
    };

    // verify connection configuration
    transporter.verify(function (error, success) {
        if (error) {
            console.log("Transport Verification Error")
            console.log(error);
        } else {
            // console.log('Server is ready to take our messages');
        }
    });

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            // console.log('Email sent: ' + info.response);
            return;
        }
    });
}

module.exports = mailer;