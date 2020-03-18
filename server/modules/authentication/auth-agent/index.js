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
 * Log user in: initialise an authToken valid
 * for a specific time (specified in /config)
 * for given user and return it.
 * @param {number} userId
 * @return {string} authToken
 */
const logIn = (userId) => {
    const payload = {
        sub: userId.toString(),
        aud: permConfig["/"],
    };
    return jose.sign(payload);
};

/**
 * Log an admin in: initialise an authToken valid
 * for a specific time (specified in /config)
 * for given user and return it.
 * @param {number} userId of admin
 * @return {string} authToken
 */
const logInAdmin = (userId) => {
    const payload = {
        sub: userId.toString(),
        aud: permConfig["/admin"],
    };
    return jose.sign(payload);
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
    logIn,
    logInAdmin,
    logOut,
};
