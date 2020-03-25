const httpUtil = require("../../util/http");
const httpRes = require("../../util/http/responses");
const log = require("../../util/log");
const digest = require("../digest");
const jose = require("../jose");
const permConfig = require("../../config").josePermissions;
const permissions = new Map(Object.entries(permConfig));
const redirectCache = new Set();
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
    if (process.env.NO_AUTH == true) {
        return next();
    }
    const authToken = req.headers.authorization;
    if (authToken === undefined) {
        return httpUtil.sendBuiltInErrorWithRedirect(httpRes.getMissingVarInRequest("authToken"), res, redirToken());
    }
    try {
        const baseUrl = req.baseUrl;
        const aud = permissions.has(baseUrl) ? permissions.get(baseUrl) : undefined;
        const userId = jose.decryptVerifyAndGetUserId(authToken, aud);
        log.info("User id '%d': Successfully authenticated for '%s'", userId, req.originalUrl);
        // pass on derived userId in request
        req.body.userId = userId;
        req.query.userId = userId;
        req.params.userId = userId;
        next();
    } catch (e) {
        log.error("An unsuccessful authentication attempt (req-auth) for '%s', " +
            "error:'%s', ref:'%s'", req.originalUrl, e.message, jose.getSignatureFromJWE(authToken));
        httpUtil.sendErrorWithRedirect(401, e.message, res, redirToken());
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
    if (process.env.NO_AUTH == true) {
        return next();
    }
    const authToken = req.headers.authorization;
    if (authToken === undefined) {
        return httpUtil.sendBuiltInErrorWithRedirect(httpRes.getMissingVarInRequest("authToken"), res, redirToken());
    }
    try { // if it does not fail user already auth
        jose.decryptAndVerify(authToken);
        log.error("An unsuccessful authentication attempt (no-auth) for '%s', " +
            "ref:'%s'", req.originalUrl, jose.getSignatureFromJWE(authToken));
        httpUtil.sendBuiltInErrorWithRedirect(httpRes.getAlreadyAuth(), res, redirToken());
    } catch (e) {
        log.info("A successful authentication attempt (no-auth) for '%s', " +
            "ref:'%s'", req.originalUrl, jose.getSignatureFromJWE(authToken));
        next(); // if it does fail, user is not auth as needed
    }
};

/**
 * Explicitly specify that a route can be
 * accessed by any authentication
 * and authorisation status.
 * This is to ensure all routes have a
 * well-defined authentication requirement
 * and to validate the sent request.
 * This will (only) fail if authToken is undefined.
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {HTTP} next
 * @return {Function} next or redirect
 */
const acceptAnyAuthentication = (req, res, next) => {
    if (process.env.NO_AUTH == true) {
        return next();
    }
    const authToken = req.headers.authorization;
    if (authToken === undefined) {
        return httpUtil.sendBuiltInErrorWithRedirect(httpRes.getMissingVarInRequest("authToken"), res, redirToken());
    }
    next();
};

/**
 * Explicitly specify that a route can only
 * be accessed after a secure redirect.
 * This is to ensure all routes have a
 * well-defined authentication requirement
 * and to validate the sent request.
 * This will fail if a protected route
 * is attempted to be visited without a
 * valid redirection token.
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {HTTP} next
 * @return {Function} next or redirect
 */
const requireRedirectionAuthentication = (req, res, next) => {
    if (process.env.NO_AUTH == true) {
        return next();
    }
    const authToken = req.query.token;
    if (authToken === undefined || !(redirectCache.has(authToken))) {
        log.error("An unsuccessful authentication attempt (redir-auth) for '%s', " +
            "ref:'%s'", req.originalUrl, jose.getSignatureFromJWE(authToken));
        return httpUtil.sendBuiltInErrorWithRedirect(httpRes.getForbidden(), res, redirToken());
    }
    redirectCache.delete(authToken);
    next();
};

/**
 * Generate, cache and return a temporary
 * redirection token.
 * @return {string} redirToken
 */
const redirToken = () => {
    const token = digest.generateSecureRandomBytesInHex(3);
    redirectCache.add(token);
    return token;
};

/**
 * Log in user of custom role: initialise an
 * authToken valid for a specific time
 * (specified in /config) for given
 * user and return it.
 * @param {number} userId
 * @param {string} aud
 * @param {Object} pub public key of recipient
 * @return {string} authToken
 */
const logIn = (userId, aud, pub) => {
    const payload = {
        sub: userId.toString(),
        aud: aud,
    };
    return jose.signAndEncrypt(payload, pub);
};

/**
 * Log user in: initialise an authToken valid
 * for a specific time (specified in /config)
 * for given user and return it.
 * @param {number} userId
 * @param {Object} pub public key of recipient
 * @return {string} authToken
 */
const logInUser = (userId, pub) => {
    return logIn(userId, permConfig["/"], pub);
};

/**
 * Log an admin in: initialise an authToken valid
 * for a specific time (specified in /config)
 * for given user and return it.
 * @param {number} userId of admin
 * @param {Object} pub public key of recipient
 * @return {string} authToken
 */
const logInAdmin = (userId, pub) => {
    return logIn(userId, permConfig["/admin"], pub);
};

/**
 * Grant temporary access to some routes
 * to given user. The access type and
 * length of temporary access must both
 * must be specified. Otherwise, an error
 * is thrown.
 * @param {number} userId
 * @param {string} aud
 * @param {Object} pub public key of recipient
 * @param {string} exp
 * @return {string} authToken
 * @throws {error} if aud or exp unspecified
 */
const grantTemporaryAccess = (userId, aud, pub, exp) => {
    if (!permissions.has(aud) || !(typeof(exp) === "string")) {
        throw new Error("Invalid params for temporary access.");
    }
    const payload = {
        sub: userId.toString(),
        aud: aud,
    };
    return jose.signAndEncrypt(payload, pub, exp);
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
 * @param {Object} pub public key of recipient
 * @return {string} authToken
 */
const grantResetAccess = (userId, pub) => {
    return grantTemporaryAccess(userId, permConfig["/reset"], pub, "15 m");
};

/**
 * Log user out: set their
 * auth token invalid.
 * @param {string} authToken
 */
const logOut = async (authToken) => {
    await jose.decryptAndBlacklistJWE(authToken);
};

module.exports = {
    requireAuthentication,
    requireNoAuthentication,
    acceptAnyAuthentication,
    requireRedirectionAuthentication,
    logInUser,
    logInAdmin,
    logOut,
    grantResetAccess,
};
