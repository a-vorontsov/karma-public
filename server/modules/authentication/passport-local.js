const LocalStrategy = require("passport-local").Strategy;
const digest = require("./digest");

/**
 * Passport's boilerplate.
 * Initialise the passport module for local use.
 * @param {Object} passport
 * @param {function} getUserByEmail
 * @param {function} getUserById
 */
function initialise(passport, getUserByEmail, getUserById) {
    const authenticateUser = async (email, password, done) => {
        const user = getUserByEmail(email);
        if (user == null) {
            return done(null, false, {message: "Email / user does not exist"});
        }

        try {
            if (digest.hashPassWithSaltInHex(password, user.salt) === user.password) {
                return done(null, user);
            } else {
                return done(null, false, {message: "Incorrect password"});
            }
        } catch (e) {
            // if error
            return done(e);
        }
    };

    passport.use(new LocalStrategy({usernameField: "email"}, authenticateUser));
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id));
    });
}

module.exports = initialise;
