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
 * The sending of the email is skipped if in .env the
 * SKIP_MAIL_SENDING_FOR_TESTING flag is set to true.
 * @param {string} email
 * @param {string} subject
 * @param {string} text
 */
const sendEmail = async (email, subject, text) => {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            from: `${process.env.EMAIL_ADDRESS}`,
            to: `${email}`,
            subject: subject,
            text: text,
        };
        if (process.env.SKIP_MAIL_SENDING_FOR_TESTING == true) {
            const result = {
                status: 200,
                info: "testing",
                message: `Email sent to ${email}`,
            };
            resolve(result);
        } else {
            transporter.sendMail(mailOptions, function(err, info) {
                if (err) {
                    const result = {
                        status: 500,
                        info: err,
                        message: `Email sending failed to ${email}`,
                    };
                    resolve(result);
                } else {
                    const result = {
                        status: 200,
                        info: info,
                        message: `Email sent to ${email}`,
                    };
                    resolve(result);
                }
            });
        }
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
    return sendEmail(toEmail, subject, text);
};

module.exports = {
    sendEmail: sendEmail,
    sendBugReport: sendBugReport,
};
