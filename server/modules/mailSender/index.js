const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
    },
});
module.exports = {
    sendToken: (email, token) => {
        const mailOptions = {
            from: `${process.env.EMAIL_ADDRESS}`,
            to: `${email}`,
            subject: "Reset Password Verification Code",
            text: `K-${token} is your karma verification code`,
        };
        console.log(`Sending mail to ${email}`);
        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                throw new Error(err.message);
            } else {
                console.log(`Email with token sent to ${email}`);
            }
        });
    },
    sendBugReport: (email, report) => {
        const mailOptions = {
            from: `${email}`,
            to: `${process.env.EMAIL_ADDRESS}`,
            subject: "Bug Report",
            text: `Bug report from ${email}: ${report}`,
        };
        console.log(
            `Sending bug report from ${email} to ${process.env.EMAIL_ADDRESS}`,
        );
        transporter.sendMail(mailOptions, (err, response) => {
            if (err) {
                throw new Error(err.message);
            } else {
                console.log(
                    `Bug report from ${email} to ${process.env.EMAIL_ADDRESS} sent successfully.`,
                );
            }
        });
    },
};
