const httpUtil = require("../../../util/httpUtil");
const httpErr = require("../../../util/httpErrors");
const jose = require("../../jose");
const permConfig = require("../../../config").permissions;
const permissions = new Map(Object.entries(permConfig));
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
 * @return {Function} next or redirect
 */
const requireAuthentication = (req, res, next) => {
    if (process.env.SKIP_AUTH_CHECKS_FOR_TESTING == true) {
        return next();
    }
    const authToken = req.body.authToken;
    if (authToken === undefined) {
        return httpUtil.sendBuiltInErrorWithRedirect(httpErr.getMissingVarInRequest("authToken"), res);
    }
    try {
        const baseUrl = req.baseUrl;
        const aud = permissions.has(baseUrl) ? permissions.get(baseUrl) : undefined;
        const userId = jose.verifyAndGetUserId(authToken, aud);
        // pass on derived userId in request
        req.body.userId = userId;
        req.query.userId = userId;
        req.params.userId = userId;
        next();
    } catch (e) {
        httpUtil.sendErrorWithRedirect(401, e.message, res);
    }
};

/**
 * Check if app user is NOT authenticated.
 * This is used for avoiding unnecessary sign-in pages.
 * If not auth., directs user to desired destination.
 * Otherwise, redirects to an error route which
 * sends an appropriate error response.
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {HTTP} next
 * @return {Function} next or redirect
 */
const requireNoAuthentication = (req, res, next) => {
    if (process.env.SKIP_AUTH_CHECKS_FOR_TESTING == true) {
        return next();
    }
    const authToken = req.body.authToken;
    if (authToken === undefined) {
        return httpUtil.sendBuiltInErrorWithRedirect(httpErr.getMissingVarInRequest("authToken"), res);
    }
    try { // if it does not fail user already auth
        jose.verify(authToken);
        httpUtil.sendBuiltInErrorWithRedirect(httpErr.getAlreadyAuth(), res);
    } catch (e) {
        next(); // if it does fail, user is not auth as needed
    }
};

/**
 * Log in user of custom role: initialise an
 * authToken valid for a specific time
 * (specified in /config) for given
 * user and return it.
 * @param {number} userId
 * @param {string} aud
 * @return {string} authToken
 */
const logIn = (userId, aud) => {
    const payload = {
        sub: userId.toString(),
        aud: aud,
    };
    return jose.sign(payload);
};

/**
 * Log user in: initialise an authToken valid
 * for a specific time (specified in /config)
 * for given user and return it.
 * @param {number} userId
 * @return {string} authToken
 */
const logInUser = (userId) => {
    return logIn(userId, permConfig["/"]);
};

/**
 * Log an admin in: initialise an authToken valid
 * for a specific time (specified in /config)
 * for given user and return it.
 * @param {number} userId of admin
 * @return {string} authToken
 */
const logInAdmin = (userId) => {
    return logIn(userId, permConfig["/admin"]);
};

/**
 * Grant temporary access to some routes
 * to given user. The access type and
 * length of temporary access must both
 * must be specified. Otherwise, an error
 * is thrown.
 * @param {number} userId
 * @param {string} aud
 * @param {string} exp
 * @return {string} authToken
 * @throws {error} if aud or exp unspecified
 */
const grantTemporaryAccess = (userId, aud, exp) => {
    if (!permissions.has(aud) || !(typeof(exp) === "string")) {
        throw new Error("Invalid params for temporary access.");
    }
    const payload = {
        sub: userId.toString(),
        aud: aud,
    };
    return jose.sign(payload, exp);
};

/**
 * Grant temporary access to a user to
 * reset their password. This must only
 * be called after a valid password
 * reset token was input by the user.
 * The temporary reset access is only
 * valid for the reset password route
 * and for 15 minutes.
 * @param {number} userId
 * @return {string} authToken
 */
const grantResetAccess = (userId) => {
    return grantTemporaryAccess(userId, permConfig["/reset"], "15 m");
};

/**
 * Log user out: set their
 * auth token invalid.
 * @param {string} authToken
 */
const logOut = async (authToken) => {
    await jose.blacklistJWT(authToken);
};

module.exports = {
    requireAuthentication,
    requireNoAuthentication,
    logInUser,
    logInAdmin,
    logOut,
    grantResetAccess,
};
