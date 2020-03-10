const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: `${process.env.EMAIL_ADDRESS}`,
        pass: `${process.env.EMAIL_PASSWORD}`,
    },
});

/**
 * Send a custom email asynchronously, returning a promise.
 * @param {string} email
 * @param {string} subject
 * @param {string} text
 */
const sendEmail = async (email, subject, text) => {
    if (process.env.SKIP_MAIL_SENDING_FOR_TESTING == true) {
        return;
    }
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: `${process.env.EMAIL_ADDRESS}`,
            to: `${email}`,
            subject: subject,
            text: text,
        };
        console.log(`Sending mail to ${email}`);
        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                throw new Error(err.message);
            } else {
                console.log(`Email sent to ${email} ` + info.response);
                resolve(true);
            }
        });
    });
};

/**
 * Send a bug report email asynchronously to the bug report
 * email address specified in .env. This sets the sender
 * of the email to be the server email address, but the
 * user's email is specified in the body of the email.
 * @param {string} email the user input contact email address
 * @param {string} report the user input bug report
 */
const sendBugReport = async (email, report) => {
    const toEmail = process.env.BUG_REPORT_EMAIL_ADDRESS;
    const subject = "Bug Report";
    const text = `Bug report from ${email}: ${report}`;
    await sendEmail(toEmail, subject, text);
};

module.exports = {
    sendEmail: sendEmail,
    sendBugReport: sendBugReport,
};
