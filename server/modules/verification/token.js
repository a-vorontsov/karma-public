const randomize = require('randomatic');
const mailSender = require('../mailSender');
const resetRepository = require("../../models/databaseRepositories/resetRepository");

const sendResetToken = (userId, email, res) => {
    const subject = "Reset Password Verification Code";
    // generate 6 digit code
    const token = randomize('0', 6);
    const text = "K-" + token + "is your karma verification code";
    // add one hour to the current time
    const expiry = new Date();
    expiry.setTime(expiry.getTime() + (1 * 60 * 60 * 1000));
    // update the db
    resetRepository.insertResetToken(userId, token, expiry)
        .then(() => mailSender.sendEmail(email, subject, text))
        .then(() => res.status(200).send("Code sent successfully to " + email))
        .catch(err => res.status(500).send(err));
};

module.exports = {
    sendResetToken: sendResetToken,
};
