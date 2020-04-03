const log = require("../../../util/log");
const mailSender = require('../../mail');
const resetRepo = require("../../../repositories/reset");
const regRepo = require("../../../repositories/registration");
const digest = require("../../digest");
const config = require("../../../config");
const util = require("../../../util");

/**
 * Generate a password reset token with config defined expiry,
 * store the token and expiry date in the reset table
 * in the database and send the token to the email address.
 * @param {number} userId
 * @param {string} email
 */
const storeAndSendPasswordResetToken = async (userId, email) => {
    log.info("User id '%d': Generating password reset token", userId);
    const resetConfig = config.passwordReset;
    const token = generateSecureToken(resetConfig.tokenLength);
    const validMinutes = resetConfig.validMinutes;
    const expiryDate = util.getNowInUTCAsString(validMinutes);
    await storePasswordResetToken(userId, token, expiryDate);
    await mailSender.sendEmail(
        email,
        `${token} Password Reset Token`,
        `${token} is your Karma password reset code.\nThis token is valid for ${validMinutes} minutes.`,
    );
};

/**
 * Store password reset token in the reset table.
 * Previous tokens get cleared so only latest token
 * will be valid.
 * @param {Number} userId
 * @param {String} token
 * @param {String} expiryDate
 */
const storePasswordResetToken = async (userId, token, expiryDate) => {
    await resetRepo.removeByUserId(userId);
    await resetRepo.insertResetToken({
        userId: userId,
        token: token,
        expiryDate: expiryDate,
    });
};

/**
 * Generate an email verification token with custom expiry,
 * store the token and expiry date in the registration table
 * in the database and send the token to the email address.
 * @param {string} email
 */
const storeAndSendEmailVerificationToken = async (email) => {
    log.info("'%s': Generating email verification token", email);
    const verifyConfig = config.emailVerification;
    const token = generateSecureToken(verifyConfig.tokenLength);
    const validMinutes = verifyConfig.validMinutes;
    const expiryDate = util.getNowInUTCAsString(validMinutes);
    await storeEmailVerificationToken(email, token, expiryDate);
    await mailSender.sendEmail(
        email,
        `${token} Email Verification Code`,
        `${token} is your Karma email verification code.\nThis token is valid for ${validMinutes} minutes.`,
    );
};

/**
 * Store email verification token in the registration table.
 * Previous tokens get cleared so only latest token
 * will be valid.d.
 * @param {String} email
 * @param {String} token
 * @param {String} expiryDate
 */
const storeEmailVerificationToken = async (email, token, expiryDate) => {
    await regRepo.removeByEmail(email);
    await regRepo.insert({
        email: email,
        emailFlag: 0,
        idFlag: 0,
        phoneFlag: 0,
        signUpFlag: 0,
        verificationToken: token,
        expiryDate: expiryDate,
    });
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
        let zeros = "";
        for (let i = 0; i < (length - genStringLength); i++) {
            zeros += "0";
        }
        return zeros + secureIntString;
    }
};

module.exports = {
    generateSecureToken,
    storeAndSendPasswordResetToken,
    storeAndSendEmailVerificationToken,
};
