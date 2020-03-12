const authRepo = require("../../models/databaseRepositories/authenticationRepository");
const digest = require("./digest");
const date = require("date-and-time");
const util = require("../../util/util");
const httpUtil = require("../../util/httpUtil");
const httpErr = require("../../util/httpErrors");
/**
 * Check if app user is authenticated.
 * If yes, directs user to desired destination.
 * Otherwise, redirects to an error route which
 * sends an appropriate error response.
 * Therefore, it prevents unauthorised access
 * to internal routes.
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {HTTP} next
 */
async function requireAuthentication(req, res, next) {
    if (process.env.SKIP_AUTH_CHECKS_FOR_TESTING == true) {
        next();
        return;
    }
    const userId = req.body.userId;
    const authToken = req.body.authToken;
    if (userId === undefined) {
        httpUtil.sendBuiltInErrorWithRedirect(httpErr.getMissingVarInRequest("userId"), res);
    } else if (authToken === undefined) {
        httpUtil.sendBuiltInErrorWithRedirect(httpErr.getMissingVarInRequest("authToken"), res);
    } else if (authToken === null || userId === null) {
        httpUtil.sendBuiltInErrorWithRedirect(httpErr.getUnauthorised(), res);
    } else {
        const isValid = await isValidToken(userId, authToken);
        if (isValid.isValidToken) {
            next();
        } else {
            httpUtil.sendErrorWithRedirect(401, isValid.error, res);
        }
    }
}

/**
 * Check if app user is NOT authenticated.
 * This is used for avoiding unnecessary sign-in pages.
 * If not auth., directs user to desired destination.
 * Otherwise, redirects to an error route which
 * sends an appropriate error response.
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {HTTP} next
 */
async function requireNoAuthentication(req, res, next) {
    if (process.env.SKIP_AUTH_CHECKS_FOR_TESTING == true) {
        next();
        return;
    }
    const userId = req.body.userId;
    const authToken = req.body.authToken;
    if (userId === undefined) {
        httpUtil.sendBuiltInErrorWithRedirect(httpErr.getMissingVarInRequest("userId"), res);
    } else if (authToken === undefined) {
        httpUtil.sendBuiltInErrorWithRedirect(httpErr.getMissingVarInRequest("authToken"), res);
    } else if (userId === null || authToken === null) {
        next(); // for performance reasons logic is separated
    } else if ((await isValidToken(userId, authToken)).isValidToken) {
        httpUtil.sendBuiltInErrorWithRedirect(httpErr.getAlreadyAuth(), res);
    } else {
        next();
    }
}

/**
 * Return true if authToken is valid for given
 * user.
 * This requires the token to be of valid format,
 * matching the user specified by the userId in
 * the database and to be not expired.
 * If no token is found for specified user or
 * user is not found, a custom error is returned.
 * @param {number} userId
 * @param {string} authToken
 */
async function isValidToken(userId, authToken) {
    const tokenResult = await authRepo.findLatestByUserID(userId);
    return util.isValidToken(tokenResult, authToken, "token");
}

/**
 * Log user in: initialise an authToken valid
 * for 15 minutes for given user and return it.
 * @param {number} userId
 * @return {string} authToken valid for 15 minutes
 * @throws {error} if failed query
 */
async function logIn(userId) {
    const tokenResult = await authRepo.insert({
        token: digest.hashVarargInBase64(
            userId,
            digest.generateSecureSaltInHex(),
        ),
        expiryDate: date.format(
            date.addMinutes(new Date(), 15),
            "YYYY-MM-DD HH:mm:ss", true,
        ), // TODO: token renewal
        creationDate: date.format(new Date(), "YYYY-MM-DD HH:mm:ss", true),
        userId: userId,
    });
    return tokenResult.rows[0].token;
}

/**
 * Log user out: set their
 * auth token(s) expired.
 * @param {number} userId
 * @throws {error} if failed query
 */
async function logOut(userId) {
    await authRepo.updateAllExpirationsForUser(
        userId,
        date.format(new Date(), "YYYY-MM-DD HH:mm:ss", true),
    );
}

module.exports = {
    requireAuthentication: requireAuthentication,
    requireNoAuthentication: requireNoAuthentication,
    logIn: logIn,
    logOut: logOut,
    isValidToken: isValidToken,
};
