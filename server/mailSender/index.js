const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
    },
});
module.exports = {
    sendToken : (email,token)=>{
        const mailOptions = {
            from: `${process.env.EMAIL_ADDRESS}`,
            to: `${email}`,
            subject: 'Reset Password Verification Code',
            text: `K-${token} is your karma verification code`
        };
        console.log(`Sending mail to ${email}`);
        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                throw new Error(err.message);
            } else {
                console.log(`Email with token sent to ${email}`);
            }
        });
    }
}