/**
 * Check if app user is authenticated.
 * If yes, directs user to desired destination.
 * Otherwise, redirects user to the login page.
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {HTTP} next
 */
function checkAuthenticated(req, res, next) {
    // TODO: validate token and userID in request
    next();
    // res.status(401).send({message: "Request is not authorised."});
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

module.exports = {
    checkAuthenticated: checkAuthenticated,
    checkNotAuthenticated: checkNotAuthenticated,
    requireAuthentication: requireAuthentication,
};
