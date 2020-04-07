const log = require("../../../util/log");
const mailSender = require('../../mail');
const resetRepo = require("../../../repositories/reset");
const regRepo = require("../../../repositories/registration");
const digest = require("../../digest");
const config = require("../../../config");
const util = require("../../../util");
const leftPad = require("left-pad");

/**
 * Generate a password reset token with config defined expiry,
 * store the token and expiry date in the reset table
 * in the database and send the token to the email address.
 * @param {number} userId
 * @param {string} email
 */
const storeAndSendPasswordResetToken = async (userId, email) => {
    log.info("User id '%d': Generating password reset token", userId);
    await storeAndSendVerificationToken(
        config.emailVerification,
        email,
        {
            userId: userId,
        },
        resetRepo.insertResetToken,
    );
};

/**
 * Generate an email verification token with custom expiry,
 * store the token and expiry date in the registration table
 * in the database and send the token to the email address.
 * @param {string} email
 */
const storeAndSendEmailVerificationToken = async (email) => {
    log.info("'%s': Generating email verification token", email);
    await storeAndSendVerificationToken(
        config.emailVerification,
        email,
        {
            email: email,
            emailFlag: 0,
            idFlag: 0,
            phoneFlag: 0,
            signUpFlag: 0,
        },
        regRepo.insert,
    );
};

/**
 * Generate a custom verification token with a configuration
 * object specifying it's length and expiry, store it in
 * the database with given object and function, and send to
 * the specified email address.
 * @param {Object} configuration
 * @param {String} email
 * @param {Object} dbRecord
 * @param {Function} dbFunction
 */
const storeAndSendVerificationToken = async (configuration, email, dbRecord, dbFunction) => {
    const verificationConfig = configuration;
    const token = generateSecureToken(verificationConfig.tokenLength);
    const validMinutes = verificationConfig.validMinutes;
    const expiryDate = util.getCurrentTimeInUtcAsString(validMinutes);
    dbRecord[verificationConfig.dbTokenParam] = token;
    dbRecord.expiryDate = expiryDate;
    await dbFunction(dbRecord);
    await mailSender.sendEmail(
        email,
        `${token} ${verificationConfig.mailSubject}`,
        `${token} ${verificationConfig.mailBody}\n` +
        `This token is valid for ${validMinutes} minutes.`,
    );
};

/**
 * Generate a cryptographically secure pseudo random token
 * string of given length.
 * @param {Number} length positive integer
 * @return {String} token
 */
const generateSecureToken = (length) => {
    const secureBytes = digest.generateSecureRandomBytesInHex(Math.ceil(length / 2));
    const secureIntString = parseInt(secureBytes, 16).toString();
    const genStringLength = secureIntString.length;
    if (genStringLength >= length) {
        return secureIntString.substring(genStringLength - length);
    } else {
        return leftPad(secureIntString, length, "0");
    }
};

module.exports = {
    generateSecureToken,
    storeAndSendPasswordResetToken,
    storeAndSendEmailVerificationToken,
};
