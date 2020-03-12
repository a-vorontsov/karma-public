const randomize = require('randomatic');
const mailSender = require('../mailSender');
const date = require("date-and-time");
const resetRepo = require("../../models/databaseRepositories/resetRepository");
const regRepo = require("../../models/databaseRepositories/registrationRepository");

/**
 * Generate a password reset token with custom expiry,
 * store the token and expiry date in the reset table
 * in the database and send the token to the email address.
 * @param {number} userId
 * @param {string} email
 */
const storeAndSendPasswordResetToken = async (userId, email) => {
    const customSubject = "Reset Password Verification Code";
    const validMinutes = 60;
    await storeAndSendVerificationToken(validMinutes, resetRepo.insertResetToken, userId, customSubject, email);
};

/**
 * Generate an email verification token with custom expiry,
 * store the token and expiry date in the registration table
 * in the database and send the token to the email address.
 * @param {string} email
 */
const storeAndSendEmailVerificationToken = async (email) => {
    const customSubject = "Reset Password Verification Code";
    const validMinutes = 15;
    await storeAndSendVerificationToken(validMinutes, regRepo.insertEmailTokenPair, email, customSubject, email);
};

/**
 * Generate a verification token with custom expiry,
 * store the token and expiry date in the database with
 * given dbUpdateFunction and dbIdentifier and send the
 * token to the email address with a custom mail subject.
 * @param {number} validMinutes how long the token should be valid for
 * @param {Function} dbUpdateFunction function to store token-expiry pair in DB
 * @param {any} dbId the unique identifier in the table related to the dbUpdateFunction
 * @param {string} customSubject custom subject to the email
 * @param {string} toEmail recipient of the email
 */
const storeAndSendVerificationToken = async (validMinutes, dbUpdateFunction, dbId, customSubject, toEmail) => {
    // generate 6 digit code
    const token = randomize('0', 6);
    const expiryDate = date.format(
        date.addMinutes(new Date(), validMinutes),
        "YYYY-MM-DD HH:mm:ss", true,
    );
    // update the db
    await dbUpdateFunction(dbId, token, expiryDate);
    // specify email params
    const text = "K-" + token + " is your karma verification code";
    const subject = customSubject;
    // send email with token
    await mailSender.sendEmail(toEmail, subject, text);
};

module.exports = {
    storeAndSendPasswordResetToken: storeAndSendPasswordResetToken,
    storeAndSendEmailVerificationToken: storeAndSendEmailVerificationToken,
};
