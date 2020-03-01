/**
 * Check if app user is authenticated.
 * If yes, directs user to desired destination.
 * Otherwise, redirects user to the login page.
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {HTTP} next
 */
async function checkAuthenticated(req, res, next) {
    if (process.env.SKIP_AUTH_CHECKS_FOR_TESTING == true) {
        next();
        return;
    }
    const userId = req.body.userId;
    const authToken = req.body.authToken;
    if (userId === undefined) {
        res.redirect("/error/nouserid");
    } else if (authToken === undefined) {
        res.redirect("/error/noauthtoken");
    } else if (authToken === null) {
        res.redirect("/error/unauthorised");
    } else if (!(await isAuthenticated(userId, authToken))) {
        res.redirect("/error/unauthorised");
    } else {
        next();
    }
}

/**
 * Check if app user is NOT authenticated.
 * This is used for avoiding unnecessary sing-in pages.
 * If not auth., directs user to desired destination.
 * Otherwise, a HTTP error response is sent stating
 * that user is already authenticated.
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {HTTP} next
 */
function checkNotAuthenticated(req, res, next) {
    // TODO: validate token and userID in request
    next();
    // res.status(401).send({message: "Request is not authorised."});
}

/**
 * Check if app user is authenticated.
 * If yes, directs user to desired destination.
 * Otherwise, redirects user to the login page,
 * unless already at login/register.
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {HTTP} next
 */
function requireAuthentication(req, res, next) {
    // TODO: validate token and userID in request
    next();
    // res.status(401).send({message: "Request is not authorised."});
}

/**
 * Return true if authToken is valid for given
 * user.
 * This requires the token to be of valid format,
 * matching the user specified by the userId in
 * the database and to be not expired.
 * @param {integer} userId
 * @param {string} authToken
 */
async function isAuthenticated(userId, authToken) {
    // TODO: DB query & check for expiry & format
    return true;
}

/**
 * Log user out and destroy their
 * auth token.
 * @param {integer} userId
 */
async function logOut(userId) {
    // TODO:
}

module.exports = {
    checkAuthenticated: checkAuthenticated,
    checkNotAuthenticated: checkNotAuthenticated,
    requireAuthentication: requireAuthentication,
    logOut: logOut,
};
