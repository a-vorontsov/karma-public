const util = require("../../../util/util");
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
 */
function requireAuthentication(req, res, next) {
    if (process.env.SKIP_AUTH_CHECKS_FOR_TESTING == true) {
        next();
        return;
    }
    console.log(req.body);
    const authToken = req.body.authToken;
    if (authToken === undefined) {
        httpUtil.sendBuiltInErrorWithRedirect(httpErr.getMissingVarInRequest("authToken"), res);
    } else if (authToken === null) {
        httpUtil.sendBuiltInErrorWithRedirect(httpErr.getUnauthorised(), res);
    } else {
        let aud = undefined;
        const baseUrl = req.baseUrl;
        console.log(baseUrl);
        if (permissions.has(baseUrl)) {
            aud = permissions.get(baseUrl);
        }
        const userId = jose.verifyAndGetUserId(authToken, aud);
        req.body.userId = userId;
        req.query.userId = userId;
        req.params.userId = userId;
        next();
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
function requireNoAuthentication(req, res, next) {
    if (process.env.SKIP_AUTH_CHECKS_FOR_TESTING == true) {
        next();
        return;
    }
    const authToken = req.body.authToken;
    if (authToken === undefined) {
        httpUtil.sendBuiltInErrorWithRedirect(httpErr.getMissingVarInRequest("authToken"), res);
    } else if (authToken === null) {
        next(); // for performance reasons logic is separated
    } else {
        try { // if it does not fail user already auth
            jose.verify(authToken);
            httpUtil.sendBuiltInErrorWithRedirect(httpErr.getAlreadyAuth(), res);
        } catch (error) {
            next();
        }
    }
}

/**
 * Log user in: initialise an authToken valid
 * for a specific time (specified in /config)
 * for given user and return it.
 * @param {number} userId
 * @return {string} authToken
 * @throws {error} if failed query
 */
function logIn(userId) {
    const payload = {
        sub: userId.toString(),
        aud: permConfig["/"],
    };
    return jose.sign(payload);
};

/**
 * Log user out: set their
 * auth token invalid.
 * @param {string} authToken
 */
async function logOut(authToken) {
    await jose.blacklistJWT(authToken);
}

module.exports = {
    requireAuthentication: requireAuthentication,
    requireNoAuthentication: requireNoAuthentication,
    logIn: logIn,
    logOut: logOut,
};
