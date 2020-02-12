/**
 * Check if app user is authenticated.
 * If yes, directs user to desired destination.
 * Otherwise, redirects user to the login page.
 * @param req 
 * @param res 
 * @param next 
 */
function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

/**
 * Check if app user is not authenticated.
 * If not auth., directs user to desired destination.
 * Otherwise, redirects user to the main page.
 * @param req 
 * @param res 
 * @param next 
 */
function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/");
  }
  next();
}

module.exports = {
  checkAuthenticated: checkAuthenticated,
  checkNotAuthenticated: checkNotAuthenticated
};
