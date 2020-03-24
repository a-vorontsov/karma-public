const FacebookStrategy = require("passport-facebook").Strategy;
const users = require("../../../user");

/**
 * Passport's boilerplate.
 * Initialise the passport module for Facebook OAuth 2.0 use.
 * @param {Object} passport
 */
function initialise(passport) {
    passport.use(
        new FacebookStrategy(
            {
                clientID: process.env.FACEBOOK_APP_ID,
                clientSecret: process.env.FACEBOOK_APP_SECRET,
                callbackURL: "http://127.0.0.1:8000/auth/facebook/callback",
            },
            function(accessToken, refreshToken, profile, done) {
                const user = users.findByEmail(profile.email);
                if (user !== null) {
                    return done(null, user);
                } else {
                    return done(null, false, {
                        message: "Email / user does not exist",
                    });
                }
            },
        ),
    );
}

module.exports = initialise;
