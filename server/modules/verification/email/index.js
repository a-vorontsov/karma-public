const regRepo = require("../../../models/databaseRepositories/registrationRepository");
const util = require("../../../util");

/**
 * Verify email address with given token.
 * An descriptive error is returned if the
 * token is invalid.
 * @param {string} email
 * @param {string} token
 * @return {object} result in httpUtil's sendResult format
 */
const verifyEmail = async (email, token) => {
    const regResult = await regRepo.findByEmail(email);
    const isValidResult = await util.isValidToken(regResult, token, "verificationToken");
    if (!isValidResult.isValidToken) {
        return ({
            status: 400,
            message: isValidResult.error,
        });
    } else {
        await updateEmailVerificationFlag(regResult);
        return ({
            status: 200,
            message: "Email successfully verified. Go to registration screen.",
        });
    }
};

/**
 * Update the email verification flag to true for
 * given registration record.
 * @param {object} regResult result of DB query
 * @throws {error} if query is faulty
 */
const updateEmailVerificationFlag = async (regResult) => {
    const regRecord = regResult.rows[0];
    regRecord.emailFlag = 1;
    await regRepo.update(regRecord);
};

module.exports = {
    verifyEmail,
};
