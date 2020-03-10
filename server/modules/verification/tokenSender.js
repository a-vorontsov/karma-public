const randomize = require('randomatic');
const mailSender = require('../mailSender');
const date = require("date-and-time");
const resetRepo = require("../../models/databaseRepositories/resetRepository");
const regRepo = require("../../models/databaseRepositories/registrationRepository");

const sendPasswordResetToken = async (userId, email) => {
    const customSubject = "Reset Password Verification Code";
    await sendAndStoreVerificationToken(60, resetRepo.insertResetToken, userId, customSubject, email);
};

const sendEmailVerificationToken = async (email) => {
    const customSubject = "Reset Password Verification Code";
};

const sendAndStoreVerificationToken = async (validMinutes, dbUpdateFunction, dbId, customSubject, toEmail) => {
    // generate 6 digit code
    const token = randomize('0', 6);
    const expiryDate = date.format(
        date.addMinutes(new Date(), validMinutes),
        "YYYY-MM-DD HH:mm:ss", true,
    );
    // update the db
    await dbUpdateFunction(dbId, token, expiryDate);
    // specify email params
    const text = "K-" + token + "is your karma verification code";
    const subject = customSubject;
    // send email with token
    await mailSender.sendEmail(toEmail, subject, text);
};

module.exports = {
    sendPasswordResetToken: sendPasswordResetToken,
};
