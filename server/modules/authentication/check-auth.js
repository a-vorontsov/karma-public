/**
 * Check if app user is authenticated.
 * If yes, directs user to desired destination.
 * Otherwise, redirects user to the login page.
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {HTTP} next
 * @return {HTTP} status
 */
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    // res.redirect("/login");
    res.status(401).send({message: "Request is not authorised."});
}

/**
 * Check if app user is not authenticated.
 * If not auth., directs user to desired destination.
 * Otherwise, redirects user to the main page.
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {HTTP} next
 * @return {HTTP} redirect
 */
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
}

/**
 * Check if app user is authenticated.
 * If yes, directs user to desired destination.
 * Otherwise, redirects user to the login page,
 * unless already at login/register.
 * @param {HTTP} req
 * @param {HTTP} res
 * @param {HTTP} next
 * @return {HTTP} redirect
 */
function requireAuthentication(req, res, next) {
    if (
        !req.isAuthenticated() &&
        req.originalUrl !== "/login" &&
        req.originalUrl !== "/register"
    ) {
        // res.redirect("/login");
        res.status(401).send({message: "Request is not authorised."});
    }
    return next();
}

module.exports = {
    checkAuthenticated: checkAuthenticated,
    checkNotAuthenticated: checkNotAuthenticated,
    requireAuthentication: requireAuthentication,
};
